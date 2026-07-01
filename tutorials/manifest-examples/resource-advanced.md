# Resource — Exemplo Avançado

PostgreSQL como Resource com secret gerado automaticamente.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Resource
metadata:
  name: postgres
  namespace: default
spec:
  type: container
  node: node-01
  exposure:
    type: private
  containers:
    - name: postgres
      image: postgres:16
      env:
        - name: POSTGRES_DB
          value: app
        - name: POSTGRES_USER
          value: app
        - name: POSTGRES_PASSWORD
          valueFrom:
            generated:
              strategy: password
              length: 32
      ports:
        - containerPort: 5432
          hostPort: 5432
          protocol: TCP
      volumes:
        - type: volume
          source: postgres-data
          target: /var/lib/postgresql/data
      healthCheck:
        test: ["CMD-SHELL", "pg_isready -U app"]
        interval: 10s
        timeout: 5s
        retries: 5
        startPeriod: 30s
      resources:
        requests:
          cpu: "250m"
          memory: "256Mi"
        limits:
          cpu: "1"
          memory: "512Mi"
```

## Notas

- `valueFrom.generated` com `strategy: password` gera e persiste um secret automaticamente
- O secret gerado é estável entre reconciliações (não muda a cada apply)
- `exposure.type: private` garante que o recurso não é exposto publicamente
