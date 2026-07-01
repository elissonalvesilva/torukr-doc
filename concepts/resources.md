# Recursos (Resources)

## O que é um Resource?

Um **Resource** representa um serviço de infraestrutura gerenciado, como um banco de dados, cache, ou serviço de mensageria. Enquanto Apps são aplicações sem estado ou com estado externo, Resources são serviços que mantêm dados persistentes.

Resources são agendados em nodes com role `resources`.

## Campos de um Resource

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome do recurso |
| `namespace` | string | Namespace de isolamento |
| `type` | string | Tipo do recurso (ex: `postgres`, `redis`) |
| `phase` | string | Fase atual (igual ao App) |
| `replicas` | int | Número de réplicas (padrão: 1) |
| `version` | string | Versão do serviço (opcional) |
| `storageRequested` | string | Armazenamento solicitado |
| `storageAllocated` | string | Armazenamento alocado |
| `assignedNodeID` | UUID | Node onde está rodando |
| `conditions` | array | Condições de saúde |

## Fases de um Resource

Mesmas fases de uma App: `Pending`, `Reconciling`, `Running`, `Ready`, `Healthy`, `Degraded`, `Warning`, `Failed`, `Error`, `Stopped`, `Disabled`, `Unknown`.

## Manifest YAML

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Resource
metadata:
  name: banco-principal
  namespace: default
spec:
  type: postgres
  version: "16"
  replicas: 1
  storageRequested: "10Gi"
```

## Criar via CLI

```bash
# Via manifest
torukrctl apply -f banco.yaml

# Listar recursos
torukrctl get resources

# Com namespace específico
torukrctl get resources -n producao
torukrctl get resources --all-namespaces

# Detalhes
torukrctl describe resource banco-principal

# Remover
torukrctl delete resource banco-principal
```

## Criar via API

```bash
curl -X POST http://localhost:8080/api/v1/resources \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "banco-principal",
    "namespace": "default",
    "type": "postgres",
    "version": "16",
    "replicas": 1
  }'
```

## Secrets Gerados

O Torukr pode gerar secrets automaticamente para Resources (senhas de banco, por exemplo). O endpoint de consume-reveal retorna esses secrets uma única vez:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/resources/{id}/secrets/consume-reveal
```

::: warning
O endpoint `consume-reveal` retorna os secrets **uma única vez**. Guarde o resultado em local seguro.
:::

## Diferença entre App e Resource

| Aspecto | App | Resource |
|---|---|---|
| Role do node | `apps` | `resources` |
| Uso típico | APIs, frontends, workers | Bancos, caches, brokers |
| Armazenamento | Sem garantia de persistência | Com gestão de storage |
| Secrets gerados | Não | Sim (senhas, connection strings) |

## Próximos Passos

- [Referência da API: Resources](/reference/api#resources)
- [Conceito de Nodes](/concepts/nodes)
- [Segurança e Secrets](/concepts/security)
