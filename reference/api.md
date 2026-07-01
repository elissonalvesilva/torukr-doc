# Referência da API REST

**Base URL**: `http://host:8080/api/v1`

**Autenticação**: `Authorization: Bearer <token>` em todos os endpoints (exceto `/auth/login` e `POST /users`).

---

## Autenticação

### Login

```http
POST /api/v1/auth/login
```

**Request:**

```json
{
  "email": "admin@torukr.io",
  "password": "senha123"
}
```

**Response 200:**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-16T10:00:00Z"
}
```

**Curl:**

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@torukr.io","password":"senha123"}'
```

---

## Usuários

### Registrar Usuário

```http
POST /api/v1/users
```

**Request:**

```json
{
  "name": "Admin",
  "email": "admin@torukr.io",
  "password": "senha-segura"
}
```

**Response 201:**

```json
{
  "data": {
    "id": "uuid",
    "name": "Admin",
    "email": "admin@torukr.io",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

### Obter Usuário

```http
GET /api/v1/users/:id
```

### Atualizar Usuário

```http
PUT /api/v1/users/:id
```

### Deletar Usuário

```http
DELETE /api/v1/users/:id
```

---

## Nodes {#nodes}

### Listar Nodes

```http
GET /api/v1/nodes
```

**Response 200:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "vps-1",
      "role": "apps",
      "privateIP": "10.0.0.10",
      "enabled": true,
      "labels": {"region": "br"},
      "capacityCPU": "4",
      "capacityMemory": "8Gi",
      "createdAt": "2024-01-15T09:00:00Z"
    }
  ]
}
```

**Curl:**

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/nodes
```

### Listar Nodes Habilitados

```http
GET /api/v1/nodes/enabled
```

### Criar Node

```http
POST /api/v1/nodes
```

**Request:**

```json
{
  "name": "vps-1",
  "role": "apps",
  "privateIP": "10.0.0.10",
  "enabled": true,
  "labels": {"region": "br", "env": "prod"}
}
```

**Response 201:**

```json
{
  "data": {
    "id": "uuid",
    "name": "vps-1",
    ...
  }
}
```

### Obter Node

```http
GET /api/v1/nodes/:id
```

### Atualizar Node

```http
PUT /api/v1/nodes/:id
```

**Request (campos opcionais):**

```json
{
  "enabled": false,
  "labels": {"region": "br", "env": "staging"}
}
```

### Deletar Node

```http
DELETE /api/v1/nodes/:id
```

**Response 204** (sem body)

### Criar Status do Node

```http
POST /api/v1/nodes/:id/status
```

### Último Status do Node

```http
GET /api/v1/nodes/:id/status/latest
```

---

## Apps {#apps}

### Listar Apps

```http
GET /api/v1/apps?namespace=default
```

**Query params:**

| Param | Descrição |
|---|---|
| `namespace` | Filtrar por namespace |
| `name` | Filtrar por nome |

**Response 200:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "minha-api",
      "namespace": "default",
      "phase": "Running",
      "image": "nginx:latest",
      "replicas": 1,
      "assignedNodeID": "uuid-do-node",
      "ingressHost": null,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T10:05:00Z"
    }
  ]
}
```

### Listar Apps Pendentes

```http
GET /api/v1/apps/pending
```

### Criar App

```http
POST /api/v1/apps
```

**Request:**

```json
{
  "name": "minha-api",
  "namespace": "default",
  "image": "nginx:latest",
  "replicas": 1
}
```

**Response 201:**

```json
{
  "data": {
    "id": "uuid",
    "name": "minha-api",
    "namespace": "default",
    "phase": "Pending",
    "image": "nginx:latest",
    "replicas": 1,
    "createdAt": "..."
  }
}
```

**Curl:**

```bash
curl -X POST http://localhost:8080/api/v1/apps \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"minha-api","namespace":"default","image":"nginx:latest","replicas":1}'
```

### Obter App

```http
GET /api/v1/apps/:id
```

### Atualizar App

```http
PUT /api/v1/apps/:id
```

### Atualizar Fase da App

```http
PATCH /api/v1/apps/:id/phase
```

**Request:**

```json
{
  "phase": "Stopped"
}
```

### Deletar App

```http
DELETE /api/v1/apps/:id
```

### Criar Status da App

```http
POST /api/v1/apps/:id/status
```

### Último Status da App

```http
GET /api/v1/apps/:id/status/latest
```

### Criar Evento da App

```http
POST /api/v1/apps/:id/events
```

### Listar Eventos da App

```http
GET /api/v1/apps/:id/events
```

---

## Resources {#resources}

### Listar Resources

```http
GET /api/v1/resources?namespace=default
```

### Listar Resources Pendentes

```http
GET /api/v1/resources/pending
```

### Criar Resource

```http
POST /api/v1/resources
```

**Request:**

```json
{
  "name": "banco-principal",
  "namespace": "default",
  "type": "postgres",
  "version": "16",
  "replicas": 1
}
```

### Obter Resource

```http
GET /api/v1/resources/:id
```

### Atualizar Resource

```http
PUT /api/v1/resources/:id
```

### Atualizar Fase do Resource

```http
PATCH /api/v1/resources/:id/phase
```

### Deletar Resource

```http
DELETE /api/v1/resources/:id
```

### Status e Eventos

```http
POST /api/v1/resources/:id/status
GET  /api/v1/resources/:id/status/latest
POST /api/v1/resources/:id/events
GET  /api/v1/resources/:id/events
```

### Revelar Secrets Gerados

```http
GET /api/v1/resources/:id/secrets/consume-reveal
```

::: warning
Este endpoint retorna secrets **apenas uma vez**. Após ser consumido, os secrets não podem ser recuperados.
:::

---

## Networks {#networks}

### Listar Networks

```http
GET /api/v1/networks?namespace=default
```

### Criar Network

```http
POST /api/v1/networks
```

**Request:**

```json
{
  "name": "cluster-privado",
  "namespace": "default",
  "driver": "overlay",
  "subnet": "10.88.0.0/16",
  "gateway": "10.88.0.1",
  "encrypted": true
}
```

### Obter Network por Nome

```http
GET /api/v1/networks/:namespace/:name
```

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/networks/default/cluster-privado
```

### Deletar Network

```http
DELETE /api/v1/networks/:namespace/:name
```

---

## Manifests {#manifests}

### Aplicar Manifest (YAML)

```http
POST /api/v1/manifests/apply
Content-Type: application/yaml
```

**Request body:** conteúdo YAML do manifest.

**Response 200:**

```json
{
  "data": {
    "kind": "App",
    "name": "minha-api",
    "operation": "created",
    "phase": "Pending"
  }
}
```

**Curl:**

```bash
curl -X POST http://localhost:8080/api/v1/manifests/apply \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/yaml" \
  --data-binary @app.yaml
```

### CRUD de Manifests

```http
POST   /api/v1/manifests
GET    /api/v1/manifests
GET    /api/v1/manifests/:id
PUT    /api/v1/manifests/:id
DELETE /api/v1/manifests/:id
```

---

## Eventos

### Listar Todos os Eventos

```http
GET /api/v1/events
```

---

## Logs {#logs}

### Logs de App

```http
GET /api/v1/namespaces/:namespace/apps/:name/logs
```

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/namespaces/default/apps/minha-api/logs"
```

### Streaming de Logs de App

```http
GET /api/v1/namespaces/:namespace/apps/:name/logs/stream
```

### Logs de Node

```http
GET /api/v1/nodes/:id/logs
```

---

## RBAC

### Roles

```http
POST /api/v1/roles
GET  /api/v1/roles
GET  /api/v1/roles/:id
```

### Permissões por Role

```http
POST /api/v1/roles/:id/permissions
GET  /api/v1/roles/:id/permissions
```

### Permissions

```http
POST /api/v1/permissions
GET  /api/v1/permissions
GET  /api/v1/permissions/:id
```

### Role Bindings de Usuário

```http
POST /api/v1/users/:id/roles
GET  /api/v1/users/:id/roles
GET  /api/v1/users/:id/role-bindings
```

---

## Códigos de Status HTTP

| Código | Significado |
|---|---|
| `200` | OK — requisição bem sucedida |
| `201` | Created — recurso criado |
| `204` | No Content — deletado com sucesso |
| `400` | Bad Request — dados inválidos |
| `401` | Unauthorized — token inválido ou expirado |
| `403` | Forbidden — sem permissão |
| `404` | Not Found — recurso não encontrado |
| `409` | Conflict — recurso já existe |
| `422` | Unprocessable Entity — validação falhou |
| `429` | Too Many Requests — rate limit atingido |
| `500` | Internal Server Error — erro interno |

## Formato de Erro

```json
{
  "error": "descrição do erro",
  "code": "ERROR_CODE"
}
```
