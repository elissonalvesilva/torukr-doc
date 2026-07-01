# App — Exemplo Avançado

App com variáveis de ambiente, healthcheck, recursos e nodeSelector.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: api
  namespace: default
spec:
  image: ghcr.io/example/api:1.0.0
  nodeSelector:
    region: br-south
  ingressHost: api.torukr.local
  restartPolicy: always
  env:
    NODE_ENV: production
    PORT: "8080"
    LOG_LEVEL: info
  ports:
    - name: http
      containerPort: 8080
      protocol: TCP
  networks:
    - name: private
      aliases:
        - api-internal
  volumes:
    - type: bind
      source: /data/api
      target: /app/data
  healthCheck:
    test: ["CMD", "curl", "-f", "http://localhost:8080/health"]
    interval: 30s
    timeout: 5s
    retries: 3
    startPeriod: 10s
  resources:
    requests:
      cpu: "250m"
      memory: "256Mi"
    limits:
      cpu: "500m"
      memory: "512Mi"
```

## Notas

- `env` é um map de string para string (não array)
- `nodeSelector` seleciona nodes por labels — o scheduler escolhe automaticamente
- `networks` lista as redes Docker às quais o container será conectado
- `aliases` permite referenciar o container por nome interno na rede
