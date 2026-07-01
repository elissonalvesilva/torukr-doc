# Análise com Graphify

O **graphify** é uma ferramenta que analisa código-fonte e gera um grafo de conhecimento representando módulos, dependências, funções e suas relações. A saída está em `graphify-out/`.

## O que foi Gerado

```
graphify-out/
├── GRAPH_REPORT.md   # Relatório legível (70KB)
├── graph.json        # Grafo completo em JSON (1.4MB)
└── cache/            # Cache de extração
```

## Estatísticas da Análise

| Métrica | Valor |
|---|---|
| Arquivos analisados | 403 |
| Palavras processadas | ~201.615 |
| Nós no grafo | 2.062 |
| Arestas (relações) | 2.145 |
| Comunidades detectadas | 361 |
| Taxa de extração | 100% EXTRACTED |

## Como Ler o GRAPH_REPORT.md

O relatório organiza o código em **comunidades** — grupos de nós fortemente relacionados:

```bash
# Ver as primeiras comunidades (arquitetura de alto nível)
head -100 graphify-out/GRAPH_REPORT.md
```

## God Nodes (Abstrações Centrais)

Os nós mais conectados do grafo — as abstrações mais importantes do sistema:

| Nó | Conexões | Significado |
|---|---|---|
| `APIClient` | 32 | Cliente HTTP da CLI — usado em todo torukrctl |
| `Resource` | 26 | Entidade Resource — central para infraestrutura |
| `NetworkRepository` | 23 | Repositório de redes — muito utilizado |
| `ResourceRepository` | 22 | Repositório de resources |
| `AppRepository` | 20 | Repositório de apps |
| `Network` | 15 | Entidade Network |
| `ResourceReconciler` | 15 | Reconciliador de resources no Controller |
| `RuntimeHandler` | 15 | Handler do NodeRuntime |
| `RoleRepository` | 14 | Repositório de RBAC |
| `Handler` | 13 | Handler HTTP genérico |

## Comunidades Relevantes

Algumas comunidades identificadas que mapeiam bem os domínios do sistema:

| Comunidade | Nós | Domínio |
|---|---|---|
| Community 1 | `APIClient` | Cliente CLI |
| Community 2 | `Resource`, `ResourceEvent`, `ResourceSpec`, `ResourceStatus` | Domínio de Resources |
| Community 3 | `AppManifest`, `AppSpec`, `AppTarget`, `ContainerSpec`, ... | Manifests de Apps |
| Community 4 | `RuntimeHandler`, `runtimeSpec`, ... | NodeRuntime |
| Community 5 | `ResourceRepository`, mappers | Repositório de Resources |
| Community 8 | `AppRepository`, mappers | Repositório de Apps |
| Community 9 | `toOutput()`, DTOs de saída | Use Case Output Layer |
| Community 17 | `Config`, `Load()`, TLS config | Configuração |
| Community 19 | `NetworkReconciler`, `incrementIP()` | Reconciliação de Redes |

## Conexões Surpreendentes Detectadas

O graphify identificou relações não óbvias:

```
main() (noderuntime) --calls--> run() (gencerts/main.go)
```

Indica que `cmd/noderuntime/main.go` e `cmd/gencerts/main.go` compartilham um padrão similar de função `run()`.

```
Load() (cli/config) --calls--> parseInt(), validateDatabaseDSN(), loadMasterKey(), loadTLSConfig()
```

O carregamento de configuração da CLI reutiliza as mesmas funções de validação do servidor principal.

## Como Regerar o Graphify

```bash
# Instalar graphify (se necessário)
# Ver instruções em https://github.com/[graphify-repo]

# Rodar na raiz do projeto
graphify .

# A saída será gerada em graphify-out/
```

## Como Usar o graph.json

O arquivo `graph.json` contém o grafo completo e pode ser importado em ferramentas de visualização:

```bash
# Ver estrutura do JSON
cat graphify-out/graph.json | jq 'keys'

# Buscar todas as funções relacionadas a Apps
cat graphify-out/graph.json | jq '.nodes[] | select(.id | contains("App"))'
```

## Como Esta Documentação Foi Gerada

1. O `GRAPH_REPORT.md` foi lido para identificar as comunidades e god nodes
2. Os god nodes foram usados para entender quais abstrações são centrais
3. As comunidades mapearam os domínios de negócio
4. O código-fonte dos arquivos identificados foi lido para confirmar o comportamento
5. A documentação foi escrita baseada no código real, não em suposições

Toda limitação documentada em [Limitações Conhecidas](/operations/known-limitations) foi identificada diretamente no código-fonte, não inferida.

## Próximos Passos

- [Estrutura do Projeto](/development/project-structure)
- [Limitações Conhecidas](/operations/known-limitations)
