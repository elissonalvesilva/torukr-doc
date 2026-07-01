# torukrctl

## O que é o torukrctl?

`torukrctl` é a interface de linha de comando oficial do Torukr. Inspirada no `kubectl`, ela oferece comandos familiares para gerenciar todos os recursos da plataforma.

## Instalação

```bash
go install github.com/elissonalvesilva/torukr/cmd/torukrctl@latest
```

Ou compilar localmente:

```bash
go build -o torukrctl ./cmd/torukrctl
sudo mv torukrctl /usr/local/bin/
```

## Configuração

Após autenticar, o torukrctl salva a configuração localmente (por padrão em `~/.torukrctl/config`):

```bash
torukrctl login --api-url http://localhost:8080/api/v1
# Informe email e senha quando solicitado
# Token salvo localmente
```

## Flags Globais

| Flag | Atalho | Padrão | Descrição |
|---|---|---|---|
| `--api-url` | — | `http://localhost:8080/api/v1` | URL da API |
| `--token` | — | — | Token JWT (substitui o salvo) |
| `--namespace` | `-n` | `default` | Namespace das operações |
| `--all-namespaces` | — | false | Listar em todos os namespaces |
| `--output` | `-o` | `table` | Formato de saída: `table` ou `json` |

## Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `login` | Autenticar e salvar token |
| `logout` | Remover token salvo |
| `whoami` | Mostrar usuário atual |
| `version` | Mostrar versão do torukrctl |
| `apply` | Aplicar manifest YAML |
| `get` | Listar recursos |
| `describe` | Detalhes de um recurso |
| `delete` | Remover um recurso |
| `node` | Gerenciar nodes (criar, habilitar, labels) |

## Exemplos Rápidos

```bash
# Autenticar
torukrctl login

# Listar tudo em todos os namespaces
torukrctl get apps --all-namespaces
torukrctl get resources --all-namespaces -o json

# Aplicar manifest
torukrctl apply -f minha-app.yaml

# Descrever um recurso
torukrctl describe app minha-api -n producao

# Operações em nodes
torukrctl node create --name vps-1 --address 10.0.0.10 --role apps
torukrctl node enable vps-1
torukrctl node label vps-1 region=br env=prod
```

## Padrão de Output

O output padrão é em tabela. Use `-o json` para integração com scripts:

```bash
# Tabela (padrão)
torukrctl get apps
# NAME       PHASE    REPLICAS  IMAGE         NODE  CREATED
# minha-api  Running  1         nginx:latest  ...   ...

# JSON
torukrctl get apps -o json
# [{"id": "...", "name": "minha-api", ...}]
```

## Próximos Passos

- [Referência Completa da CLI](/reference/cli)
- [Início Rápido](/getting-started/quickstart)
