# API do Torukr

## Visão Geral

A API REST do Torukr é o ponto central de controle. Todos os clientes (torukrctl, dashboard web) interagem exclusivamente com ela.

- **Base URL**: `http://host:8080/api/v1`
- **Autenticação**: JWT via header `Authorization: Bearer <token>`
- **Formato**: JSON (request e response)
- **Framework**: Gin (Go)

## Autenticação

### Obter token

```bash
curl -X POST http://localhost:8080/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@torukr.io", "password": "senha"}'
```

Response:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresAt": "2024-01-16T10:00:00Z"
}
```

### Usar o token

```bash
export TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
curl -H "Authorization: Bearer $TOKEN" http://localhost:8080/api/v1/nodes
```

O token expira após o período configurado em `JWT_EXPIRY_HOURS` (padrão: 24h).

## Namespaces

Apps, Resources e Networks são organizados por namespace. O namespace padrão é `default`. Passe como parâmetro de query:

```bash
# Filtrar por namespace
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/apps?namespace=producao"
```

## Formato de Response

### Sucesso (lista)

```json
{
  "data": [...]
}
```

### Sucesso (item único)

```json
{
  "data": {...}
}
```

### Erro

```json
{
  "error": "mensagem de erro",
  "code": "ERROR_CODE"
}
```

## Middlewares

Todas as requisições passam pelos seguintes middlewares:

| Middleware | Função |
|---|---|
| **RequestID** | Adiciona `X-Request-ID` a cada request |
| **Logger** | Log estruturado de cada requisição |
| **Recovery** | Captura panics e retorna 500 |
| **CORS** | Configura origens permitidas via `CORS_ORIGINS` |
| **SecurityHeaders** | Adiciona headers de segurança HTTP |
| **RateLimit** | Limita requisições por IP |
| **Auth** | Valida JWT (exceto rotas públicas) |

## Endpoints Públicos

Estes endpoints não requerem autenticação:

- `POST /api/v1/auth/login`
- `POST /api/v1/users` (registro)

## Rotas Disponíveis

Veja a [Referência Completa da API](/reference/api) para documentação de cada endpoint.

| Recurso | Operações |
|---|---|
| `/auth/login` | Login (JWT) |
| `/users` | CRUD de usuários |
| `/nodes` | CRUD de nodes + status |
| `/apps` | CRUD de apps + status + eventos + fases |
| `/resources` | CRUD de resources + status + eventos + secrets |
| `/networks` | CRUD de networks |
| `/manifests` | CRUD de manifests + apply |
| `/events` | Listar todos os eventos |
| `/logs` | Logs de apps e nodes |
| `/roles`, `/permissions` | RBAC |

## CORS

Configure as origens permitidas:

```ini
# .env
CORS_ORIGINS=http://localhost:3000,https://dashboard.meudominio.com
```

## Rate Limiting

O rate limiting é aplicado por IP. Em produção, ajuste conforme necessário. O middleware usa `golang.org/x/time/rate`.

## Próximos Passos

- [Referência Completa da API](/reference/api)
- [Segurança](/concepts/security)
- [Autenticação e RBAC](/concepts/security#rbac)
