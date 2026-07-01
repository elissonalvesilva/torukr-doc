# Resource — Exemplo Simples

Workload com um container no node especificado.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Resource
metadata:
  name: redis
  namespace: default
spec:
  type: container
  node: node-01
  containers:
    - name: redis
      image: redis:7-alpine
      ports:
        - containerPort: 6379
          protocol: TCP
```

## Aplicar

```bash
torukrctl apply -f resource-simple.yaml
torukrctl get apps
```
