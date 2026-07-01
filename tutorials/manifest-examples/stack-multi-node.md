# Stack — Multi-node

Dois nodes com overlay network e app distribuída.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
  labels:
    region: br-south
spec:
  role: worker
  privateIP: 192.168.1.11
  enabled: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-02
  labels:
    region: br-south
spec:
  role: worker
  privateIP: 192.168.1.12
  enabled: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: overlay
  namespace: default
spec:
  driver: overlay
  subnet: 10.90.0.0/16
  encrypted: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: api
  namespace: default
spec:
  image: ghcr.io/example/api:1.0.0
  nodeSelector:
    region: br-south
  ports:
    - containerPort: 8080
  networks:
    - name: overlay
```

```bash
torukrctl apply -f stack-multi-node.yaml
```
