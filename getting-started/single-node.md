# Configuração de Node Único

Neste guia você irá configurar o Torukr completo em uma única máquina: API Server, Controller e NodeRuntime rodando no mesmo host.

## Pré-requisitos

- Ubuntu 22.04+ ou Debian 12+
- Docker instalado e rodando
- PostgreSQL instalado
- Go 1.25+
- 2 GB RAM mínimo
- 20 GB disco

## Passo 1: Preparar o Banco de Dados

```bash
sudo -u postgres psql << 'EOF'
CREATE USER torukr WITH PASSWORD 'senha-segura-aqui';
CREATE DATABASE torukr OWNER torukr;
\q
EOF
```

## Passo 2: Clonar e Compilar

```bash
git clone https://github.com/elissonalvesilva/torukr.git
cd torukr
go build -o bin/apiserver ./cmd/apiserver
go build -o bin/controller ./cmd/controller
go build -o bin/noderuntime ./cmd/noderuntime
go build -o bin/torukrctl ./cmd/torukrctl
```

## Passo 3: Gerar Certificados

```bash
go run cmd/gencerts/main.go -output ./certs
```

Saída esperada:

```
🔐 Generating TLS certificates for Torukr...
1. Generating CA certificate...
2. Generating NodeRuntime server certificate...
3. Generating Controller client certificate...
✅ Certificate generation complete!
```

## Passo 4: Configurar Ambiente

```bash
cat > .env << 'EOF'
ENV=development
DATABASE_DSN=postgres://torukr:senha-segura-aqui@localhost:5432/torukr?sslmode=disable
API_PORT=8080
RUNTIME_PORT=9090
JWT_SECRET=chave-secreta-aleatoria-de-32-caracteres-minimo
JWT_EXPIRY_HOURS=24
TORUKR_MASTER_KEY=$(openssl rand -base64 32)
TORUKR_SECRET_HOST_BASE_DIR=/tmp/torukr/secrets

TORUKR_TLS_ENABLED=true
TORUKR_TLS_CA_CERT=./certs/ca-cert.pem
TORUKR_TLS_SERVER_CERT=./certs/server-cert.pem
TORUKR_TLS_SERVER_KEY=./certs/server-key.pem
TORUKR_TLS_CLIENT_CERT=./certs/client-cert.pem
TORUKR_TLS_CLIENT_KEY=./certs/client-key.pem
EOF
```

## Passo 5: Executar Migrações

```bash
# Com golang-migrate:
migrate -path internal/infra/database/migrations \
        -database "postgres://torukr:senha-segura-aqui@localhost:5432/torukr?sslmode=disable" \
        up
```

## Passo 6: Iniciar os Serviços

Abra três terminais ou use um process manager como `tmux`:

**Terminal 1 — NodeRuntime:**

```bash
cd torukr && ./bin/noderuntime
```

**Terminal 2 — API Server:**

```bash
cd torukr && ./bin/apiserver
```

**Terminal 3 — Controller:**

```bash
cd torukr && ./bin/controller
```

## Passo 7: Configurar o torukrctl

```bash
sudo cp bin/torukrctl /usr/local/bin/

# Autenticar (crie um usuário via API primeiro)
torukrctl login --api-url http://localhost:8080/api/v1
```

## Passo 8: Verificar que Tudo Funciona

```bash
# API respondendo
curl -s http://localhost:8080/api/v1/events | head -5

# Listar nodes
torukrctl get nodes

# Registrar o próprio servidor como node
torukrctl node create \
  --name localhost \
  --address 127.0.0.1 \
  --role apps \
  --enabled
```

## Próximos Passos

- [Fazer deploy da primeira aplicação](/tutorials/deploy-app)
- [Adicionar um segundo VPS](/getting-started/multi-node)
