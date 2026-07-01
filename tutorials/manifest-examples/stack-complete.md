# Stack — Completa

Network + Resource (postgres) + App API + App Worker.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay
  subnet: 10.91.0.0/16
  encrypted: true
---
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
          protocol: TCP
      volumes:
        - type: volume
          source: postgres-data
          target: /var/lib/postgresql/data
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: api
  namespace: default
spec:
  image: ghcr.io/example/api:1.0.0
  env:
    NODE_ENV: production
    PORT: "8080"
    DATABASE_URL: postgres://app:@postgres.default.torukr:5432/app
  ports:
    - containerPort: 8080
  networks:
    - name: private
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: worker
  namespace: default
spec:
  image: ghcr.io/example/worker:1.0.0
  env:
    NODE_ENV: production
    API_URL: http://api.default.torukr:8080
  networks:
    - name: private
```

```bash
torukrctl apply -f stack-complete.yaml
torukrctl get apps
```
