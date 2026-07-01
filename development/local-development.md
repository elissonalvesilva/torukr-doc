# Desenvolvimento Local

## Pré-requisitos

```bash
# Go 1.25+
go version

# Docker e Docker Compose
docker version

# PostgreSQL (ou via Docker)
psql --version
```

## Setup com Docker Compose

O projeto inclui um `docker-compose.dev.yml` para facilitar o desenvolvimento:

```bash
# Iniciar banco de dados
docker compose -f docker-compose.dev.yml up -d

# Verificar
docker compose -f docker-compose.dev.yml ps
```

## Configurar Ambiente

```bash
# Copiar e editar .env
cp .env.tls.example .env

# Editar valores de desenvolvimento:
# ENV=development
# DATABASE_DSN=postgres://torukr:torukr@localhost:5432/torukr?sslmode=disable
# JWT_SECRET=dev-secret-32-chars-minimum-here
# TORUKR_TLS_ENABLED=false  (ou true com certificados gerados)
```

## Gerar Certificados (para dev com TLS)

```bash
go run cmd/gencerts/main.go -output ./certs
```

## Executar Migrações

```bash
# Instalar golang-migrate
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

migrate -path internal/infra/database/migrations \
        -database "postgres://torukr:torukr@localhost:5432/torukr?sslmode=disable" \
        up
```

## Rodar os Componentes

Use `tmux` ou múltiplos terminais:

```bash
# Terminal 1: NodeRuntime
go run cmd/noderuntime/main.go

# Terminal 2: API Server
go run cmd/apiserver/main.go

# Terminal 3: Controller
go run cmd/controller/main.go
```

## Rodar os Testes

```bash
# Todos os testes
go test ./...

# Com verbose
go test -v ./...

# Testes de um pacote específico
go test ./internal/core/app/...

# Testes com coverage
go test -cover ./...
go test -coverprofile=coverage.out ./...
go tool cover -html=coverage.out
```

## Build

```bash
# Todos os binários
go build ./cmd/...

# Binário específico
go build -o bin/apiserver ./cmd/apiserver

# Com ldflags de versão
go build -ldflags="-X main.version=v1.0.0" -o bin/apiserver ./cmd/apiserver
```

## Lint

```bash
# Instalar golangci-lint
go install github.com/golangci/golangci-lint/cmd/golangci-lint@latest

# Executar
golangci-lint run
```

## Adicionar Novo Endpoint

1. Criar handler em `internal/apiserver/<domínio>/handler.go`
2. Adicionar request/response types em `requests.go` e `responses.go`
3. Registrar rota em `routes.go`
4. Implementar use case em `internal/core/<domínio>/usecases/`
5. Atualizar repositório em `internal/infra/database/postgres/repositories/`

## Adicionar Novo Comando CLI

1. Criar arquivo em `internal/cli/commands/<comando>.go`
2. Implementar a função `New<Comando>Command() *cobra.Command`
3. Registrar em `internal/cli/root.go`: `rootCmd.AddCommand(commands.New<Comando>Command())`

## Adicionar Nova Migração

```bash
# Criar arquivos de migração
touch internal/infra/database/migrations/000024_nova_coluna.up.sql
touch internal/infra/database/migrations/000024_nova_coluna.down.sql
```

Após adicionar a migração, atualizar manualmente os arquivos go-jet em:
- `internal/infra/database/jet/torukr/public/model/<tabela>.go`
- `internal/infra/database/jet/torukr/public/table/<tabela>.go`

## Próximos Passos

- [Estrutura do Projeto](/development/project-structure)
- [Contribuindo](/development/contributing)
