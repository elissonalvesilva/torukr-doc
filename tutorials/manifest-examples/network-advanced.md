# Network — Exemplo Avançado

Network com VNI customizado e gateway configurado.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: production
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  gateway: 10.88.0.1
  vni: 100
  encrypted: true
```

O campo `vni` (VXLAN Network Identifier) permite isolar redes overlay quando há múltiplas redes no mesmo ambiente.
