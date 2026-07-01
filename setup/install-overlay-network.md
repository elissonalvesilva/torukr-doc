# Instalar Overlay Network

O network overlay permite comunicação privada entre containers em VPS diferentes.

## Pré-requisitos

Em cada node:

```bash
# Instalar WireGuard
apt-get install -y wireguard-tools

# Verificar módulo do kernel
modprobe wireguard && echo "OK"
lsmod | grep wireguard
```

Verificar versão do kernel (WireGuard nativo requer Linux 5.6+):

```bash
uname -r
# Exemplo: 5.15.0-89-generic ← OK
```

## Criar a Network

```bash
cat > network.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: privada
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1
  encrypted: true
EOF

torukrctl apply -f network.yaml
```

O `NetworkReconciler` aloca um VNI único e distribui a configuração para os NodeRuntimes.

## Verificar Status

```bash
torukrctl describe network privada
# Phase: Ready
```

## Verificar Interfaces (nos Nodes)

```bash
# Verificar WireGuard
wg show wg0

# Verificar VXLAN
ip link show | grep vxlan

# Verificar bridge
ip link show br-private

# Ver tabela de IPs alocados
ip addr show br-private
```

## Verificar Conectividade

```bash
# Em um container no VPS 1, pingar container no VPS 2
docker exec container-a ping 10.88.0.3

# Verificar handshake WireGuard entre nodes
wg show wg0
# deve mostrar: latest handshake: X seconds ago
```

## Firewall

```bash
# Abrir porta WireGuard em todos os nodes
ufw allow 51820/udp

# Ou com iptables
iptables -I INPUT -p udp --dport 51820 -j ACCEPT
```

## Próximos Passos

- [Network Overlay: conceito completo](/concepts/network-overlay)
- [Tutorial: Conectar Dois Nodes](/tutorials/connect-two-nodes)
- [Troubleshooting de Redes](/operations/troubleshooting#network-overlay)
