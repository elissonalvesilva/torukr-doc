# Tutorial: Conectar Dois Nodes

Neste tutorial você vai configurar dois VPS para se comunicarem via network overlay privada.

## Topologia

```
VPS 1 (10.0.0.1)          VPS 2 (10.0.0.2)
  API Server                 NodeRuntime
  Controller
  NodeRuntime
  |                              |
  |    WireGuard UDP:51820       |
  +------------------------------|
  |    VXLAN overlay             |
  containers 10.88.0.x  <->  containers 10.88.0.y
```

## Pré-requisitos

- VPS 1: API Server + Controller + NodeRuntime instalados
- VPS 2: NodeRuntime instalado
- WireGuard instalado em ambos
- Porta UDP 51820 aberta nos firewalls
- Porta TCP 9090 do VPS 2 acessível do VPS 1

## Passo 1: Verificar NodeRuntime no VPS 2

```bash
# No VPS 2
systemctl status torukr-noderuntime
# ● torukr-noderuntime.service - Active: active (running)
```

## Passo 2: Registrar o VPS 2 como Node

```bash
# Na sua máquina local com torukrctl
torukrctl node create \
  --name vps-2 \
  --address 10.0.0.2 \
  --role apps \
  --enabled
```

## Passo 3: Verificar Conectividade do Controller

Nos logs do Controller:

```bash
journalctl -u torukr-controller -f | grep -i "vps-2\|node-2\|10.0.0.2"
# INFO Connected to NodeRuntime at 10.0.0.2:9090
```

## Passo 4: Criar Network Overlay

```bash
cat > rede-cluster.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: cluster
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1
  encrypted: true
EOF

torukrctl apply -f rede-cluster.yaml
```

Aguardar a phase `Ready`:

```bash
torukrctl get networks
# NAME     DRIVER   SUBNET          PHASE  CREATED
# cluster  overlay  10.88.0.0/16   Ready  ...
```

## Passo 5: Verificar WireGuard em Ambos os Nodes

**VPS 1:**

```bash
wg show wg0
# peer: <chave pública do VPS 2>
#   endpoint: 10.0.0.2:51820
#   latest handshake: X seconds ago
#   transfer: X received, Y sent
```

**VPS 2:**

```bash
wg show wg0
# peer: <chave pública do VPS 1>
#   endpoint: 10.0.0.1:51820
#   latest handshake: X seconds ago
```

Se `latest handshake` não aparecer ou for muito antigo, veja [Troubleshooting](/operations/troubleshooting).

## Passo 6: Testar Comunicação

Deploy de uma app em cada node:

```bash
# App no VPS 1
torukrctl apply -f - << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: servidor
  namespace: default
spec:
  image: nginx:alpine
  replicas: 1
EOF

# App no VPS 2 (assumindo que o scheduler agendará no VPS 2)
torukrctl apply -f - << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: cliente
  namespace: default
spec:
  image: alpine:latest
  replicas: 1
EOF
```

**No container `cliente` (VPS 2), pingar o `servidor` (VPS 1) pelo IP do overlay:**

```bash
docker exec cliente ping 10.88.0.2
# PING 10.88.0.2: 56 data bytes
# 64 bytes from 10.88.0.2: seq=0 ttl=64 time=1.2 ms
```

## Limpeza

```bash
torukrctl delete app servidor
torukrctl delete app cliente
torukrctl delete network cluster
```

## Próximos Passos

- [Troubleshooting de Redes](/operations/troubleshooting#network-overlay)
- [Network Overlay: conceito](/concepts/network-overlay)
