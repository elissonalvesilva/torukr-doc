# Variáveis de Ambiente

Todas as variáveis são lidas do arquivo `.env` na raiz do projeto (via `godotenv`).

## Variáveis Obrigatórias

| Variável | Exemplo | Descrição |
|---|---|---|
| `DATABASE_DSN` | `postgres://torukr:pass@localhost:5432/torukr?sslmode=disable` | DSN do PostgreSQL |
| `JWT_SECRET` | `chave-secreta-32-chars-minimo-aqui` | Segredo para assinar JWTs. Mínimo 32 chars com alta entropia. |

## Variáveis com Valores Padrão

| Variável | Padrão | Descrição |
|---|---|---|
| `ENV` | `production` | Ambiente: `development` ou `production` |
| `API_PORT` | `8080` | Porta HTTP da API |
| `RUNTIME_PORT` | `9090` | Porta HTTPS do NodeRuntime |
| `JWT_EXPIRY_HOURS` | `24` | Expiração do token JWT em horas |
| `CORS_ORIGINS` | — | Origens CORS permitidas (vírgula separado) |

## Criptografia de Secrets

| Variável | Exemplo | Descrição |
|---|---|---|
| `TORUKR_MASTER_KEY` | `dGVzdC1tYXN0ZXIta2V5...` | Chave AES-256-GCM base64-encoded (32 bytes). Gerada com `openssl rand -base64 32` |
| `TORUKR_SECRET_HOST_BASE_DIR` | `/var/lib/torukr/secrets` | Diretório no host onde secrets são gravados antes de serem montados em containers |

Em desenvolvimento, se `TORUKR_MASTER_KEY` não for definida, uma chave determinística de desenvolvimento é usada automaticamente. **Nunca use isso em produção.**

## TLS (Controller ↔ NodeRuntime)

| Variável | Exemplo | Descrição |
|---|---|---|
| `TORUKR_TLS_ENABLED` | `true` | Habilita mTLS. **Deve ser `true` em produção.** |
| `TORUKR_TLS_CA_CERT` | `./certs/ca-cert.pem` | Caminho para o certificado CA |
| `TORUKR_TLS_SERVER_CERT` | `./certs/server-cert.pem` | Certificado do NodeRuntime |
| `TORUKR_TLS_SERVER_KEY` | `./certs/server-key.pem` | Chave privada do NodeRuntime |
| `TORUKR_TLS_CLIENT_CERT` | `./certs/client-cert.pem` | Certificado do Controller |
| `TORUKR_TLS_CLIENT_KEY` | `./certs/client-key.pem` | Chave privada do Controller |
| `TORUKR_TLS_INSECURE_SKIP_VERIFY` | `false` | **Apenas desenvolvimento.** Desabilita verificação de certificados. |

## Exemplo de .env Completo (Produção)

```ini
# Ambiente
ENV=production

# Banco de dados
DATABASE_DSN=postgres://torukr:senha-segura@localhost:5432/torukr?sslmode=require

# API
API_PORT=8080
RUNTIME_PORT=9090

# Autenticação
JWT_SECRET=aaa111bbb222ccc333ddd444eee555fff666
JWT_EXPIRY_HOURS=24

# CORS (dashboard web)
CORS_ORIGINS=https://dashboard.meudominio.com

# Criptografia de secrets
TORUKR_MASTER_KEY=base64encodedkey==
TORUKR_SECRET_HOST_BASE_DIR=/var/lib/torukr/secrets

# TLS
TORUKR_TLS_ENABLED=true
TORUKR_TLS_CA_CERT=/etc/torukr/certs/ca-cert.pem
TORUKR_TLS_SERVER_CERT=/etc/torukr/certs/server-cert.pem
TORUKR_TLS_SERVER_KEY=/etc/torukr/certs/server-key.pem
TORUKR_TLS_CLIENT_CERT=/etc/torukr/certs/client-cert.pem
TORUKR_TLS_CLIENT_KEY=/etc/torukr/certs/client-key.pem
```

## Exemplo de .env (Desenvolvimento)

```ini
ENV=development
DATABASE_DSN=postgres://torukr:torukr@localhost:5432/torukr?sslmode=disable
API_PORT=8080
RUNTIME_PORT=9090
JWT_SECRET=dev-secret-key-pelo-menos-32-chars-ok
JWT_EXPIRY_HOURS=168

# TLS desabilitado em dev
TORUKR_TLS_ENABLED=false
# ou com skip verify:
# TORUKR_TLS_INSECURE_SKIP_VERIFY=true
```

## Gerar Valores Seguros

```bash
# JWT_SECRET
openssl rand -hex 32

# TORUKR_MASTER_KEY
openssl rand -base64 32
```

## Próximos Passos

- [Instalar Node Principal](/setup/install-main-node)
- [Gerar Certificados](/setup/generate-certificates)
- [Segurança](/concepts/security)
