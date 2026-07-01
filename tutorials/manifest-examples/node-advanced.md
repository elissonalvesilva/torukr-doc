# Node — Exemplo Avançado

Node com labels, capacidade declarada e agentURL configurado.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
  labels:
    region: br-south
    provider: hetzner
    environment: production
spec:
  role: worker
  privateIP: 10.0.0.11
  hostname: node-01.torukr.internal
  agentURL: https://node-01.torukr.local:9443
  enabled: true
  labels:
    region: br-south
    provider: hetzner
  resources:
    cpu: "4"
    memory: "8Gi"
    disk: "100Gi"
```

## Usar nodeSelector em Apps

Com labels no node, você pode direcionar apps para nodes específicos:

```yaml
spec:
  nodeSelector:
    region: br-south
    provider: hetzner
```
