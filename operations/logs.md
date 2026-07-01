# Logs

## Logs dos Componentes

O Torukr usa `go.uber.org/zap` para logging estruturado em todos os componentes.

### API Server

```bash
# Tempo real
journalctl -u torukr-apiserver -f

# Últimas 100 linhas
journalctl -u torukr-apiserver -n 100

# Filtrar por nível
journalctl -u torukr-apiserver | grep '"level":"error"'
```

**Exemplo de log:**

```json
{"level":"info","ts":1705320000.123,"caller":"middleware/logging.go:45",
"msg":"request","method":"GET","path":"/api/v1/apps","status":200,"latency_ms":12}
```

### Controller

```bash
journalctl -u torukr-controller -f
```

**Exemplo de log:**

```json
{"level":"info","msg":"reconciling app","name":"minha-api","namespace":"default"}
{"level":"info","msg":"app scheduled","name":"minha-api","nodeID":"uuid-do-node"}
```

### NodeRuntime

```bash
journalctl -u torukr-noderuntime -f
```

## Logs de Aplicações

Para ver os logs de uma aplicação rodando em um node, use a API:

```bash
# Logs de uma app específica
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/namespaces/default/apps/minha-api/logs"

# Streaming de logs (suporte parcial)
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/namespaces/default/apps/minha-api/logs/stream"
```

Ou diretamente via Docker no node onde a app está rodando:

```bash
# Descobrir o node
torukrctl describe app minha-api | grep "Assigned Node"

# No node correspondente
docker logs minha-api --tail 100 --follow
```

## Logs de Nodes

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/nodes/{NODE_ID}/logs"
```

## Rotação de Logs

Configure `logrotate` para os logs do systemd:

```bash
cat > /etc/logrotate.d/torukr << 'EOF'
/var/log/torukr/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    sharedscripts
}
EOF
```

Ou use o `journald` com limite de tamanho em `/etc/systemd/journald.conf`:

```ini
SystemMaxUse=1G
MaxRetentionSec=30day
```

## Formato de Logs

Todos os logs seguem o formato JSON estruturado com os campos:

| Campo | Descrição |
|---|---|
| `level` | `debug`, `info`, `warn`, `error` |
| `ts` | Timestamp Unix |
| `caller` | Arquivo e linha de código |
| `msg` | Mensagem principal |
| Campos extras | Dados contextuais do evento |

## Eventos da API

A API expõe um endpoint de eventos de sistema:

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/events
```

## Próximos Passos

- [Monitoramento](/operations/monitoring)
- [Troubleshooting](/operations/troubleshooting)
