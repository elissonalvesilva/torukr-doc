# Stack — Single Node

Stack completa em um único node: network + app.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
spec:
  role: worker
  privateIP: 192.168.1.11
  enabled: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  encrypted: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: whoami
  namespace: default
spec:
  image: traefik/whoami:v1.10
  ports:
    - containerPort: 80
  networks:
    - name: private
```

## Aplicar

```bash
torukrctl apply -f stack-single-node.yaml
torukrctl get nodes
torukrctl get networks
torukrctl get apps
```
