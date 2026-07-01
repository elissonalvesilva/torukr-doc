# Instalação

Este guia instala o Torukr usando os scripts de instalação oficiais.

## Pré-requisitos

- Docker 24+
- Docker Compose
- Linux (Ubuntu 22.04+ / Debian 12+)
- WireGuard (para network overlay)
- Portas liberadas: 8080 (API), 9090 (NodeRuntime), 51820 (WireGuard)

## DNS local para laboratório

Em ambientes de teste, adicione ao `/etc/hosts` no seu computador:

```txt
192.168.1.10 api.torukr.local
192.168.1.10 dashboard.torukr.local
192.168.1.11 node-01.torukr.local
192.168.1.12 node-02.torukr.local
```

Substitua `192.168.1.10` pelo IP do seu servidor. Em produção, use DNS reais como `torukr-api.example.com`.

## Instalação completa (servidores VPS)

Clone o repositório e execute o instalador interativo:

```bash
git clone https://github.com/elissonalvesilva/torukr.git
cd torukr
bash install/install.sh
```

O instalador vai perguntar:

- Modo de instalação (node único ou multi-node)
- Endereço IP do servidor
- Configurações de rede overlay (WireGuard)
- Configurações de certificados TLS

## Instalação via Docker (laboratório/dev)

Para subir toda a stack localmente em Docker:

```bash
bash scripts/install-torukr.sh
```

Isso sobe os containers na rede `torukr-system`:

```bash
docker ps
# torukr-postgres
# torukr-api
# torukr-controller
# torukr-dashboard
```

Ao final, o instalador exibe:

```txt
Dashboard:    http://localhost:3000
API:          http://localhost:8080

Usuário inicial: root
Senha inicial:   oj57DZ3fi]k5
```

::: warning
Troque a senha do usuário root após o primeiro login.
:::

## Validar a instalação

```bash
bash install/validate.sh
```

## Gerenciar certificados

```bash
bash install/certs.sh
```

## Desinstalar

```bash
bash install/uninstall.sh
```

## Instalar o torukrctl

```bash
go install github.com/elissonalvesilva/torukr/cmd/torukrctl@latest
```

Ou via compilação local:

```bash
go build -o torukrctl ./cmd/torukrctl
sudo mv torukrctl /usr/local/bin/
```

## Configurar o endpoint

### Laboratório

```bash
torukrctl config set server https://api.torukr.local
```

### Produção

```bash
torukrctl config set server https://torukr-api.example.com
```

### Desenvolvimento local

```bash
torukrctl config set server http://127.0.0.1:8080
```

## Verificar instalação

```bash
torukrctl get nodes
```

## Próximos Passos

- [Início Rápido](/getting-started/quickstart)
- [Configurar node único](/getting-started/single-node)
- [Variáveis de ambiente completas](/setup/environment-variables)
