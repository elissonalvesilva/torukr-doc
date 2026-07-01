# Exemplos Completos

Exemplos prontos para copiar e adaptar.

## Exemplo 1 — App simples (whoami)

Um node, uma network, uma app de teste.

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

```bash
torukrctl apply -f stack-simple.yaml
torukrctl get apps
```

## Exemplo 2 — API + Worker

Dois serviços na mesma network.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: backend
  namespace: default
spec:
  driver: overlay
  subnet: 10.89.0.0/16
  encrypted: true
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
  ports:
    - name: http
      containerPort: 8080
  networks:
    - name: backend
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
    - name: backend
```

## Exemplo 3 — Multi-node

Dois nodes com uma app distribuída.

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

## Exemplo 4 — Stack completa com Resource

Network + banco de dados como Resource + App API.

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
  ports:
    - name: http
      containerPort: 8080
  networks:
    - name: private
```

```bash
torukrctl apply -f stack-complete.yaml
```

## Usando o Dashboard

Para criar recursos via dashboard:

1. Acesse `https://dashboard.torukr.local`
2. Login com `root` / `oj57DZ3fi]k5`
3. Navegue para **Apps**, **Networks** ou **Nodes**
4. Clique em **Create** e preencha os campos

A operação de `apply` multi-documento está disponível via `torukrctl`. O suporte pelo dashboard está planejado.
