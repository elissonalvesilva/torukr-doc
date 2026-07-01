# Referência de Manifests YAML

Manifests são arquivos YAML declarativos que descrevem o estado desejado dos recursos. Aplique-os com `torukrctl apply -f`.

## Estrutura básica

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: <Kind>
metadata:
  name: <nome>
  namespace: <namespace>       # opcional, default: "default"
  labels:                      # opcional
    chave: valor
  annotations:                 # opcional
    chave: valor
spec:
  # campos específicos do kind
```

## Kinds suportados

| Kind | Descrição |
|------|-----------|
| `Node` | Servidor VPS registrado na plataforma |
| `Network` | Rede privada overlay entre nodes |
| `App` | Aplicação containerizada stateless |
| `Resource` | Workload customizável com múltiplos containers |

## Node

Registra um servidor VPS como node da plataforma.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
  labels:
    region: br-south
    provider: hetzner
spec:
  role: worker
  privateIP: 10.0.0.11
  hostname: node-01.torukr.internal   # opcional
  agentURL: https://node-01.torukr.local:9443  # opcional
  enabled: true
  labels:
    region: br-south
    provider: hetzner
  resources:             # capacidade declarada (opcional)
    cpu: "4"
    memory: "8Gi"
    disk: "100Gi"
```

### Campos de NodeSpec

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `role` | string | sim | Role do node na plataforma |
| `privateIP` | string | sim | IP privado do servidor |
| `hostname` | string | não | Hostname do servidor |
| `agentURL` | string | não | URL do NodeRuntime agent |
| `enabled` | bool | sim | Se o node está ativo |
| `labels` | map | não | Labels para seleção por nodeSelector |
| `resources` | object | não | Capacidade declarada |

## Network

Cria uma rede privada overlay para comunicação entre apps em nodes diferentes.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay        # driver de rede (overlay = WireGuard + VXLAN)
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1     # opcional
  vni: 100               # VXLAN Network Identifier (opcional)
  encrypted: true
```

### Campos de NetworkSpec

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `driver` | string | sim | Driver de rede (`overlay`) |
| `subnet` | string | sim | Subnet CIDR da rede |
| `gateway` | string | não | IP do gateway |
| `vni` | int | não | VXLAN Network Identifier |
| `encrypted` | bool | sim | Ativar criptografia WireGuard |

## App

Deploy de aplicação containerizada stateless.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: api
  namespace: default
spec:
  image: ghcr.io/example/api:1.0.0
  node: node-01          # fixar em node específico (opcional)
  nodeSelector:          # seleção por labels (opcional)
    region: br-south
  ingressHost: api.torukr.local  # opcional
  restartPolicy: always
  env:                   # variáveis de ambiente (map string→string)
    NODE_ENV: production
    PORT: "8080"
  ports:
    - name: http
      containerPort: 8080
      hostPort: 8080     # opcional
      protocol: TCP
  networks:
    - name: private
      aliases:
        - api-internal
  volumes:
    - type: bind
      source: /data/api
      target: /app/data
  healthCheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
    interval: 30s
    timeout: 5s
    retries: 3
    startPeriod: 10s
  resources:
    requests:
      cpu: "250m"
      memory: "256Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
```

### Campos de AppSpec

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `image` | string | sim | Imagem Docker |
| `node` | string | não | Nome do node específico |
| `nodeSelector` | map | não | Seleção por labels |
| `ingressHost` | string | não | Host de ingress |
| `command` | []string | não | Entrypoint override |
| `args` | []string | não | Arguments override |
| `env` | map | não | Variáveis de ambiente (map string→string, não array) |
| `ports` | []PortSpec | não | Mapeamento de portas |
| `networks` | []NetworkRef | não | Redes conectadas |
| `volumes` | []VolumeSpec | não | Volumes montados |
| `healthCheck` | object | não | Healthcheck Docker |
| `resources` | object | não | Limites de recursos |
| `restartPolicy` | string | não | Política de restart |

## Resource

Workload customizável com múltiplos containers. Útil para bancos de dados, proxies e serviços auxiliares.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Resource
metadata:
  name: postgres
  namespace: default
spec:
  type: container
  node: node-01
  nodeSelector:
    role: worker
  exposure:
    type: private        # "private" ou "public"
  containers:
    - name: postgres
      image: postgres:16
      env:
        - name: POSTGRES_DB
          value: app
        - name: POSTGRES_PASSWORD
          valueFrom:
            generated:
              strategy: password
              length: 32
      ports:
        - containerPort: 5432
          hostPort: 5432
          protocol: TCP
      volumes:
        - type: volume
          source: postgres-data
          target: /var/lib/postgresql/data
      healthCheck:
        test: ["CMD-SHELL", "pg_isready -U app"]
        interval: 10s
        timeout: 5s
        retries: 5
```

### Campos de ResourceSpec

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `type` | string | sim | Tipo (`container`) |
| `node` | string | não | Node específico |
| `nodeSelector` | map | não | Seleção por labels |
| `exposure` | object | não | Exposição (`private`/`public`) |
| `containers` | []ContainerSpec | não | Containers do workload |

## Geração automática de secrets

O campo `valueFrom.generated` gera e persiste um secret automaticamente:

```yaml
env:
  - name: POSTGRES_PASSWORD
    valueFrom:
      generated:
        strategy: password   # password | uuid | random
        length: 32
```

O valor gerado é estável entre reconciliações.

## Multi-documento

Múltiplos recursos em um único arquivo, separados por `---`:

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  encrypted: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: whoami
  namespace: default
spec:
  image: traefik/whoami:v1.10
  ports:
    - containerPort: 80
  networks:
    - name: private
```

```bash
torukrctl apply -f stack.yaml
```

## Operação de Apply

Ao aplicar um manifest:
- Se o recurso **não existir** → é **criado**
- Se o recurso **já existir** → é **atualizado**

O campo `name` + `namespace` identifica unicamente o recurso.

## Comandos úteis

```bash
torukrctl apply -f manifest.yaml

torukrctl get nodes
torukrctl get networks
torukrctl get apps

torukrctl describe node node-01
torukrctl describe network private
torukrctl describe app whoami
```

## Próximos Passos

- [Exemplos de Manifests](/tutorials/manifest-examples/)
- [Tutorial: Deploy com Manifest](/tutorials/deploy-with-manifest)
- [Referência da CLI](/reference/cli)
- [Referência da API](/reference/api)
