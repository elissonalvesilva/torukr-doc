# Instalar Node Worker

Um node worker roda apenas o NodeRuntime — ele não precisa de PostgreSQL ou do API Server.

## Pré-requisitos

- Conectividade TCP:9090 com o node principal (Controller)
- Conectividade UDP:51820 com outros nodes (WireGuard)
- Docker instalado
- WireGuard instalado

## Passo 1: Preparar o Servidor

```bash
# Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# WireGuard
apt-get install -y wireguard-tools

# Carregar módulo WireGuard
modprobe wireguard
echo "wireguard" >> /etc/modules
```

## Passo 2: Copiar Binário e Certificados

**A partir do node principal:**

```bash
WORKER_IP=10.0.0.2

# Criar diretório
ssh usuario@$WORKER_IP "mkdir -p /opt/torukr/bin /etc/torukr/certs"

# Copiar binário
scp /opt/torukr/bin/noderuntime usuario@$WORKER_IP:/opt/torukr/bin/noderuntime

# Copiar apenas os certificados do servidor (não a chave CA!)
scp /opt/torukr/certs/ca-cert.pem usuario@$WORKER_IP:/etc/torukr/certs/
scp /opt/torukr/certs/server-cert.pem usuario@$WORKER_IP:/etc/torukr/certs/
scp /opt/torukr/certs/server-key.pem usuario@$WORKER_IP:/etc/torukr/certs/
```

## Passo 3: Configurar Ambiente

**No worker:**

```bash
cat > /opt/torukr/.env << 'EOF'
RUNTIME_PORT=9090

TORUKR_TLS_ENABLED=true
TORUKR_TLS_CA_CERT=/etc/torukr/certs/ca-cert.pem
TORUKR_TLS_SERVER_CERT=/etc/torukr/certs/server-cert.pem
TORUKR_TLS_SERVER_KEY=/etc/torukr/certs/server-key.pem
EOF

chmod 600 /opt/torukr/.env
chmod 600 /etc/torukr/certs/server-key.pem
```

## Passo 4: Criar Serviço systemd

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

systemctl daemon-reload
systemctl enable --now torukr-noderuntime
```

## Passo 5: Verificar

```bash
# Verificar que o NodeRuntime está rodando
systemctl status torukr-noderuntime
journalctl -u torukr-noderuntime -f

# A saída deve incluir algo como:
# NodeRuntime listening on :9090 (TLS)
```

## Passo 6: Registrar o Node

**A partir da máquina com torukrctl:**

```bash
torukrctl node create \
  --name vps-worker-1 \
  --address 10.0.0.2 \
  --role apps \
  --labels region=br \
  --enabled
```

Verificar:

```bash
torukrctl get nodes
```

## Passo 7: Verificar Conectividade do Controller

Nos logs do Controller você deve ver:

```
Connected to NodeRuntime at 10.0.0.2:9090
```

## Configurar Firewall

```bash
# No worker: permitir Controller chegar na porta 9090
ufw allow from 10.0.0.1 to any port 9090 proto tcp

# Para overlay network (WireGuard)
ufw allow 51820/udp
```

## Próximos Passos

- [Configurar Overlay Network](/setup/install-overlay-network)
- [Tutorial: Conectar Dois Nodes](/tutorials/connect-two-nodes)
