# Instalar Node Principal

O node principal hospeda o API Server, Controller e o banco de dados PostgreSQL.

## Passo 1: Instalar Dependências

```bash
# Atualizar sistema
apt-get update && apt-get upgrade -y

# Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Go (compilar o Torukr)
wget https://go.dev/dl/go1.25.5.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.25.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> /etc/profile.d/go.sh
source /etc/profile.d/go.sh
```

## Passo 2: Configurar PostgreSQL

```bash
systemctl start postgresql
systemctl enable postgresql

sudo -u postgres psql << 'EOF'
CREATE USER torukr WITH PASSWORD 'senha-segura-aqui';
CREATE DATABASE torukr OWNER torukr;
\q
EOF
```

## Passo 3: Clonar e Compilar

```bash
mkdir -p /opt/torukr
cd /opt/torukr
git clone https://github.com/elissonalvesilva/torukr.git .

# Compilar binários
go build -o bin/apiserver ./cmd/apiserver
go build -o bin/controller ./cmd/controller
go build -o bin/noderuntime ./cmd/noderuntime
go build -o bin/gencerts ./cmd/gencerts
go build -o bin/torukrctl ./cmd/torukrctl

# Instalar torukrctl globalmente
cp bin/torukrctl /usr/local/bin/
```

## Passo 4: Gerar Certificados

```bash
cd /opt/torukr
./bin/gencerts -output ./certs

# Verificar
ls -la certs/
```

## Passo 5: Configurar Ambiente

```bash
cat > /opt/torukr/.env << 'EOF'
ENV=production
DATABASE_DSN=postgres://torukr:senha-segura-aqui@localhost:5432/torukr?sslmode=disable
API_PORT=8080
RUNTIME_PORT=9090
JWT_SECRET=$(openssl rand -hex 32)
JWT_EXPIRY_HOURS=24
TORUKR_MASTER_KEY=$(openssl rand -base64 32)
TORUKR_SECRET_HOST_BASE_DIR=/var/lib/torukr/secrets

TORUKR_TLS_ENABLED=true
TORUKR_TLS_CA_CERT=/opt/torukr/certs/ca-cert.pem
TORUKR_TLS_SERVER_CERT=/opt/torukr/certs/server-cert.pem
TORUKR_TLS_SERVER_KEY=/opt/torukr/certs/server-key.pem
TORUKR_TLS_CLIENT_CERT=/opt/torukr/certs/client-cert.pem
TORUKR_TLS_CLIENT_KEY=/opt/torukr/certs/client-key.pem
EOF

chmod 600 /opt/torukr/.env
mkdir -p /var/lib/torukr/secrets
```

## Passo 6: Executar Migrações

```bash
# Instalar golang-migrate
go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest

# Executar migrações
migrate -path /opt/torukr/internal/infra/database/migrations \
        -database "postgres://torukr:senha@localhost:5432/torukr?sslmode=disable" \
        up
```

## Passo 7: Criar Serviços systemd

### NodeRuntime

```bash
cat > /etc/systemd/system/torukr-noderuntime.service << 'EOF'
[Unit]
Description=Torukr NodeRuntime
After=network.target docker.service
Requires=docker.service

[Service]
Type=simple
WorkingDirectory=/opt/torukr
EnvironmentFile=/opt/torukr/.env
ExecStart=/opt/torukr/bin/noderuntime
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### API Server

```bash
cat > /etc/systemd/system/torukr-apiserver.service << 'EOF'
[Unit]
Description=Torukr API Server
After=network.target postgresql.service

[Service]
Type=simple
WorkingDirectory=/opt/torukr
EnvironmentFile=/opt/torukr/.env
ExecStart=/opt/torukr/bin/apiserver
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

### Controller

```bash
cat > /etc/systemd/system/torukr-controller.service << 'EOF'
[Unit]
Description=Torukr Controller
After=network.target torukr-noderuntime.service torukr-apiserver.service

[Service]
Type=simple
WorkingDirectory=/opt/torukr
EnvironmentFile=/opt/torukr/.env
ExecStart=/opt/torukr/bin/controller
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

## Passo 8: Iniciar Serviços

```bash
systemctl daemon-reload
systemctl enable --now torukr-noderuntime
sleep 2
systemctl enable --now torukr-apiserver
sleep 2
systemctl enable --now torukr-controller

# Verificar status
systemctl status torukr-noderuntime torukr-apiserver torukr-controller
```

## Passo 9: Validar Instalação

```bash
# API respondendo
curl -s http://localhost:8080/api/v1/events

# Autenticar (criar usuário via API primeiro)
torukrctl login --api-url http://localhost:8080/api/v1

# Registrar o próprio node
torukrctl node create \
  --name node-principal \
  --address 127.0.0.1 \
  --role apps \
  --enabled
```

## Próximos Passos

- [Instalar Nodes Worker](/setup/install-worker-node)
- [Configurar Overlay Network](/setup/install-overlay-network)
- [Tutorial: Criar o Primeiro Node](/tutorials/create-first-node)
