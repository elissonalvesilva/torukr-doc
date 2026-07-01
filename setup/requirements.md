# Requisitos

## Node Principal (Control Plane)

O node principal hospeda o API Server, Controller e banco de dados.

| Componente | Versão mínima |
|---|---|
| Linux | Ubuntu 22.04 / Debian 12 / CentOS Stream 9 |
| Go | 1.25+ |
| PostgreSQL | 14+ |
| Docker | 24+ |
| RAM | 2 GB mínimo, 4 GB recomendado |
| CPU | 2 vCPUs |
| Disco | 20 GB |

## Nodes Worker (NodeRuntime)

Cada VPS que receberá workloads precisa de:

| Componente | Versão mínima |
|---|---|
| Linux | Ubuntu 22.04 / Debian 12 |
| Docker | 24+ |
| WireGuard | Incluso no kernel Linux 5.6+ ou pacote `wireguard-tools` |
| RAM | 1 GB mínimo |
| CPU | 1 vCPU |
| Disco | 10 GB + espaço para containers |

## Portas de Rede

| Porta | Protocolo | Componente | Descrição |
|---|---|---|---|
| `8080` | TCP | API Server | HTTP da API REST |
| `9090` | TCP | NodeRuntime | mTLS Controller → NodeRuntime |
| `51820` | UDP | WireGuard | Network overlay entre nodes |
| `5432` | TCP | PostgreSQL | Banco de dados (interno) |

## Dependências de Software

Instalar no Ubuntu/Debian:

```bash
# Docker
curl -fsSL https://get.docker.com | sh
usermod -aG docker $USER

# WireGuard (nos workers)
apt-get install -y wireguard-tools

# Go (para compilar)
wget https://go.dev/dl/go1.25.5.linux-amd64.tar.gz
tar -C /usr/local -xzf go1.25.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.profile
source ~/.profile

# PostgreSQL
apt-get install -y postgresql postgresql-contrib
```

## Verificar Pré-requisitos

```bash
# Versões
go version
docker version
psql --version
wg --version

# Módulo WireGuard no kernel
modprobe wireguard && echo "WireGuard OK" || echo "WireGuard ausente"

# Docker funcionando
docker run hello-world
```

## Próximos Passos

- [Instalar Node Principal](/setup/install-main-node)
- [Instalar Node Worker](/setup/install-worker-node)
