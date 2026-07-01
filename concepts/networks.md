# Redes (Networks)

## O que é uma Network?

Uma **Network** no Torukr é uma rede overlay privada que permite comunicação segura entre containers em nodes diferentes. Ela abstrai a complexidade de configurar VPNs e bridges de rede manualmente.

## Campos de uma Network

| Campo | Tipo | Descrição |
|---|---|---|
| `name` | string | Nome da network |
| `namespace` | string | Namespace |
| `driver` | string | Driver de rede (`overlay`) |
| `subnet` | string | Sub-rede CIDR (ex: `10.88.0.0/16`) |
| `gateway` | string | Gateway da sub-rede |
| `vni` | int | VNI (VXLAN Network Identifier) |
| `encrypted` | bool | Usar WireGuard para criptografar tráfego |
| `phase` | string | Fase atual |

## Manifest YAML

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: cluster-privado
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1
  encrypted: true
```

## Criar via CLI

```bash
# Via manifest
torukrctl apply -f network.yaml

# Listar networks
torukrctl get networks
torukrctl get networks --all-namespaces

# Detalhes
torukrctl describe network cluster-privado -n default

# Remover
torukrctl delete network cluster-privado
```

## Criar via API

```bash
curl -X POST http://localhost:8080/api/v1/networks \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "cluster-privado",
    "namespace": "default",
    "driver": "overlay",
    "subnet": "10.88.0.0/16",
    "gateway": "10.88.0.1",
    "encrypted": true
  }'
```

## Funcionamento Interno

Quando uma Network é criada, o `NetworkReconciler` do Controller:

1. Aloca um VNI único para a network
2. Instrui cada NodeRuntime a criar:
   - Interface WireGuard (`wg0`) para o túnel criptografado
   - Interface VXLAN (`vxlan{VNI}`) sobre o túnel WireGuard
   - Linux bridge (`br-private`) conectando os containers
   - Docker network usando a bridge

Veja [Network Overlay](/concepts/network-overlay) para detalhes técnicos completos.

## Fases de uma Network

| Fase | Descrição |
|---|---|
| `Pending` | Aguardando reconciliação |
| `Reconciling` | Controller configurando |
| `Ready` | Network operacional |
| `Degraded` | Problema em algum node |
| `Failed` | Falha na configuração |

## Próximos Passos

- [Network Overlay: detalhes técnicos](/concepts/network-overlay)
- [Tutorial: Criar uma Network](/tutorials/create-network)
- [Conectar dois nodes](/tutorials/connect-two-nodes)
