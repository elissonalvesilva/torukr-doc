# Tutorial: Criar uma Network

Neste tutorial você vai criar uma rede overlay privada para que containers em diferentes VPS possam se comunicar.

## Pré-requisitos

- Ao menos dois nodes registrados
- WireGuard instalado em todos os nodes
- NodeRuntime rodando em todos os nodes

## Passo 1: Verificar Nodes Disponíveis

```bash
torukrctl get nodes
# NAME   ROLE  ENABLED  PRIVATE IP  LABELS  CREATED
# vps-1  apps  true     10.0.0.10           ...
# vps-2  apps  true     10.0.0.20           ...
```

## Passo 2: Criar o Manifest da Network

```bash
cat > network-privada.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: rede-privada
  namespace: default
  labels:
    ambiente: producao
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1
  encrypted: true
EOF
```

Escolha uma subnet que não conflite com:
- IPs privados dos seus VPS
- Outras redes Docker existentes

## Passo 3: Aplicar o Manifest

```bash
torukrctl apply -f network-privada.yaml
# ✓ Network/rede-privada created (phase: Pending)
```

## Passo 4: Verificar Status

```bash
torukrctl get networks
# NAME          DRIVER   SUBNET          PHASE    CREATED
# rede-privada  overlay  10.88.0.0/16   Ready    ...
```

Aguardar a phase `Ready` (pode levar alguns segundos enquanto o NetworkReconciler configura os nodes).

## Passo 5: Ver Detalhes da Network

```bash
torukrctl describe network rede-privada
# Name:            rede-privada
# Namespace:       default
# Driver:          overlay
# Subnet:          10.88.0.0/16
# Gateway:         10.88.0.1
# Encrypted:       true
# Phase:           Ready
```

## Passo 6: Verificar Interface WireGuard nos Nodes

No VPS 1:

```bash
wg show wg0
# interface: wg0
#   public key: ...
#   peers:
#     peer: <public key do VPS 2>
#       endpoint: 10.0.0.20:51820
#       latest handshake: 5 seconds ago
```

## Passo 7: Testar Conectividade

Deploy de uma app em cada node e testar comunicação:

```bash
# App no VPS 1
cat > app1.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: app-vps1
  namespace: default
spec:
  image: alpine:latest
  replicas: 1
EOF
torukrctl apply -f app1.yaml
```

```bash
# A partir do container, pingar container no VPS 2
docker exec app-vps1 ping 10.88.0.X
```

## Limpeza

```bash
torukrctl delete network rede-privada
```

## Próximos Passos

- [Fazer Deploy de App](/tutorials/deploy-app)
- [Conectar Dois Nodes](/tutorials/connect-two-nodes)
- [Network Overlay: conceito](/concepts/network-overlay)
