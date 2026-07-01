# Arquitetura

## Visão Geral

O Torukr segue uma arquitetura de **control plane + data plane** similar ao Kubernetes, mas simplificada para ambientes de VPS.

```mermaid
flowchart TD
    subgraph "Usuário"
        CLI[torukrctl]
        Dashboard[Dashboard Web]
    end

    subgraph "Control Plane"
        API[API Server\nGin HTTP :8080]
        Controller[Controller\nReconcile Loop]
        DB[(PostgreSQL)]
    end

    subgraph "Node 1 - VPS"
        NR1[NodeRuntime :9090]
        Docker1[Docker Engine]
        Containers1[Containers]
    end

    subgraph "Node 2 - VPS"
        NR2[NodeRuntime :9090]
        Docker2[Docker Engine]
        Containers2[Containers]
    end

    CLI -->|HTTP + JWT| API
    Dashboard -->|HTTP + JWT| API
    API <-->|PostgreSQL| DB
    API --> Controller
    Controller -->|mTLS gRPC/HTTP| NR1
    Controller -->|mTLS gRPC/HTTP| NR2
    NR1 --> Docker1 --> Containers1
    NR2 --> Docker2 --> Containers2
    NR1 <-->|WireGuard + VXLAN| NR2
```

## Componentes

### API Server (`cmd/apiserver`)

- Framework: **Gin** (Go)
- Porta padrão: `8080`
- Autenticação: **JWT**
- Persistência: **PostgreSQL** via go-jet ORM
- Middlewares: CORS, rate limiting, logging, request ID, security headers, recovery

O API Server é o ponto central de entrada. Ele expõe uma API REST completa e armazena o estado de todos os recursos no banco de dados.

### Controller (`cmd/controller`)

- Processo de reconciliação contínua
- Monitora o banco via polling/eventos
- Reconciliadores: `AppReconciler`, `ResourceReconciler`, `NetworkReconciler`
- Se comunica com NodeRuntimes via **mTLS**

O Controller implementa o padrão de reconciliação: lê o estado desejado do banco e compara com o estado real reportado pelos NodeRuntimes, tomando ações corretivas.

### NodeRuntime (`cmd/noderuntime`)

- Agente que roda em cada VPS
- Porta padrão: `9090` (HTTPS com mTLS)
- Usa **Docker SDK** para gerenciar containers
- Reporta status de volta ao Controller

### torukrctl (`cmd/torukrctl`)

- CLI construída com **Cobra**
- Armazena configuração e token JWT localmente
- Suporta saída em tabela ou JSON

### gencerts (`cmd/gencerts`)

- Utilitário standalone para gerar CA, certificado de servidor e certificado de cliente
- Saída: arquivos PEM em diretório configurável

## Fluxo de Criação de uma App

```mermaid
sequenceDiagram
    participant CLI as torukrctl
    participant API as API Server
    participant DB as PostgreSQL
    participant Ctrl as Controller
    participant NR as NodeRuntime
    participant Docker as Docker Engine

    CLI->>API: POST /api/v1/apps
    API->>DB: INSERT app (phase=Pending)
    API-->>CLI: 201 Created

    Ctrl->>DB: Poll apps WHERE phase=Pending
    Ctrl->>DB: SELECT nodes WHERE role=apps AND enabled=true
    Ctrl->>DB: UPDATE app (assignedNodeID=...)
    Ctrl->>NR: Deploy container
    NR->>Docker: docker run ...
    Docker-->>NR: container ID
    NR-->>Ctrl: OK

    Ctrl->>DB: PATCH app phase=Running
```

## Fluxo de Autenticação

```mermaid
sequenceDiagram
    participant CLI as torukrctl
    participant API as API Server
    participant DB as PostgreSQL

    CLI->>API: POST /api/v1/auth/login {email, password}
    API->>DB: SELECT user WHERE email=...
    DB-->>API: user record
    API->>API: bcrypt.CompareHash
    API-->>CLI: {token: "eyJ..."}
    CLI->>CLI: Salvar token localmente

    Note over CLI,API: Requisições subsequentes
    CLI->>API: GET /api/v1/apps\nAuthorization: Bearer eyJ...
    API->>API: ValidateJWT
    API-->>CLI: {data: [...]}
```

## Comunicação Controller ↔ NodeRuntime (mTLS)

```mermaid
flowchart LR
    subgraph "Controller"
        C[Controller\nclient-cert.pem\nclient-key.pem]
    end
    subgraph "NodeRuntime"
        NR[NodeRuntime\nserver-cert.pem\nserver-key.pem]
    end
    CA[ca-cert.pem]

    C -->|valida com CA| NR
    NR -->|valida com CA| C
    CA -.->|assina| C
    CA -.->|assina| NR
```

Ambos os lados verificam o certificado do outro contra a mesma CA raiz. Isso é **mutual TLS (mTLS)**.

## Organização do Código

```
torukr/
├── cmd/                    # Binários (entrypoints)
│   ├── apiserver/         # API HTTP
│   ├── controller/        # Loop de reconciliação
│   ├── noderuntime/       # Agente do node
│   ├── gencerts/          # Gerador de certificados
│   └── torukrctl/         # CLI
├── internal/              # Código interno (não importável)
│   ├── apiserver/         # Handlers HTTP por domínio
│   ├── core/              # Domínio e casos de uso
│   │   ├── app/           # Lógica de aplicações
│   │   ├── resource/      # Lógica de recursos
│   │   └── node/          # Lógica de nodes
│   ├── controller/        # Reconciliadores
│   ├── noderuntime/       # Runtime handler
│   ├── infra/             # Infraestrutura
│   │   ├── database/      # Repositórios PostgreSQL
│   │   └── tls/           # Gerenciamento de TLS
│   └── cli/               # Lógica da CLI
├── pkg/                   # Pacotes públicos
│   ├── conditions/        # Condições de recursos
│   └── logger/            # Logger estruturado (zap)
└── graphify-out/          # Análise de grafo do código
```

## Próximos Passos

- [Conceito de Nodes](/concepts/nodes)
- [Conceito de Apps](/concepts/apps)
- [Network Overlay](/concepts/network-overlay)
- [Certificados e mTLS](/concepts/certificates)
