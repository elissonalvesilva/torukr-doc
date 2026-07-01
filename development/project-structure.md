# Estrutura do Projeto

O Torukr segue a estrutura padrão de projetos Go com separação clara entre cmd (entrypoints), internal (código privado) e pkg (código reutilizável).

```
torukr/
│
├── cmd/                           # Binários executáveis
│   ├── apiserver/main.go          # API Server HTTP
│   ├── controller/main.go         # Controller (loop de reconciliação)
│   ├── noderuntime/main.go        # Agente do node
│   ├── gencerts/main.go           # Gerador de certificados TLS
│   └── torukrctl/main.go          # CLI
│
├── internal/                      # Código interno (não importável externamente)
│   │
│   ├── apiserver/                 # Handlers HTTP da API
│   │   ├── app/                   # Routes, requests, responses, handler para Apps
│   │   ├── auth/                  # Autenticação JWT
│   │   ├── event/                 # Eventos do sistema
│   │   ├── logs/                  # Logs de apps e nodes
│   │   ├── manifest/              # Manifests YAML
│   │   ├── middleware/            # CORS, rate limit, auth, logging, etc.
│   │   ├── network/               # Redes overlay
│   │   ├── node/                  # Nodes
│   │   ├── rbac/                  # Roles e permissões
│   │   ├── resource/              # Resources de infraestrutura
│   │   ├── response/              # Helpers de response HTTP
│   │   └── user/                  # Usuários
│   │
│   ├── core/                      # Domínio e lógica de negócio
│   │   ├── app/
│   │   │   ├── domain/entity.go   # Entidade App
│   │   │   └── usecases/          # Create, Update, Delete, List, etc.
│   │   ├── resource/
│   │   │   ├── domain/entity.go
│   │   │   └── usecases/
│   │   └── node/
│   │       ├── domain/entity.go
│   │       └── usecases/
│   │
│   ├── controller/                # Reconciliadores
│   │   ├── app/                   # AppReconciler
│   │   ├── resource/              # ResourceReconciler
│   │   └── network/               # NetworkReconciler
│   │
│   ├── noderuntime/               # Handler do NodeRuntime
│   │   └── handler.go             # RuntimeHandler: executa containers
│   │
│   ├── infra/                     # Infraestrutura
│   │   ├── database/
│   │   │   ├── migrations/        # Migrações SQL (golang-migrate)
│   │   │   ├── postgres/
│   │   │   │   └── repositories/  # Implementações dos repositórios
│   │   │   └── jet/torukr/public/ # Modelos gerados pelo go-jet
│   │   └── tls/                   # Geração e carregamento de certificados
│   │
│   ├── cli/                       # Lógica da CLI
│   │   ├── client/                # Cliente HTTP da API
│   │   ├── commands/              # Implementação dos comandos Cobra
│   │   ├── config/                # Configuração da CLI
│   │   ├── flags/                 # Flags globais
│   │   ├── output/                # Formatação de tabela e JSON
│   │   └── root.go                # Comando raiz
│   │
│   └── config/                    # Configuração do servidor (env vars)
│
├── pkg/                           # Pacotes públicos reutilizáveis
│   ├── conditions/                # Gerenciamento de condições de recursos
│   └── logger/                    # Logger estruturado (zap)
│
├── api/                           # Definições de API (proto, swagger, etc.)
├── docs/                          # Documentação
│   └── site/                      # Site de documentação (VitePress)
├── graphify-out/                  # Análise de grafo do código
│   ├── GRAPH_REPORT.md            # Relatório legível
│   └── graph.json                 # Grafo em JSON
├── install/                       # Scripts de instalação
├── examples/                      # Exemplos de manifests
├── scripts/                       # Scripts utilitários
├── .env.tls.example               # Exemplo de configuração com TLS
├── go.mod / go.sum                # Dependências Go
└── Makefile                       # Comandos comuns
```

## Padrão Arquitetural

O código segue **Clean Architecture** com as camadas:

```
HTTP Handler → Use Case → Domain → Repository
(apiserver)   (usecases)  (entity)  (postgres)
```

1. **Handler** recebe o request HTTP e chama o Use Case
2. **Use Case** contém a lógica de negócio, chama o Repository
3. **Domain/Entity** define a estrutura dos dados
4. **Repository** acessa o banco de dados via go-jet

## ORM: go-jet

O projeto usa [go-jet](https://github.com/go-jet/jet) para geração de queries SQL type-safe. Os modelos gerados ficam em `internal/infra/database/jet/torukr/public/`.

::: info
Os arquivos em `jet/` são gerados pela ferramenta `jet` mas são commitados no repositório e modificados manualmente quando necessário (ex: ao adicionar colunas após migrações).
:::

## Próximos Passos

- [Desenvolvimento Local](/development/local-development)
- [Contribuindo](/development/contributing)
- [Análise com Graphify](/development/graphify-analysis)
