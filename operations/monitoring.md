# Monitoramento

## Health Checks

### API Server

```bash
# Verificar que a API está respondendo
curl -s -o /dev/null -w "%{http_code}" \
  http://localhost:8080/api/v1/events
# 200 = OK, qualquer outro = problema
```

### NodeRuntime

```bash
# Com mTLS
curl -s -o /dev/null -w "%{http_code}" \
  --cacert certs/ca-cert.pem \
  --cert certs/client-cert.pem \
  --key certs/client-key.pem \
  https://localhost:9090/runtime/v1/healthz
```

### Banco de Dados

```bash
psql -U torukr -d torukr -c "SELECT 1;" > /dev/null && echo "OK" || echo "FALHOU"
```

## Script de Health Check Completo

```bash
#!/bin/bash
# /opt/torukr/scripts/healthcheck.sh

ERRORS=0

check() {
    local name=$1; local cmd=$2
    if eval "$cmd" > /dev/null 2>&1; then
        echo "✓ $name"
    else
        echo "✗ $name"
        ERRORS=$((ERRORS + 1))
    fi
}

check "API Server" "curl -sf http://localhost:8080/api/v1/events"
check "NodeRuntime" "systemctl is-active torukr-noderuntime"
check "Controller" "systemctl is-active torukr-controller"
check "PostgreSQL" "pg_isready -U torukr -d torukr"
check "Docker" "docker info"

exit $ERRORS
```

## Métricas com Prometheus (trabalho futuro)

::: info
O Torukr não expõe métricas Prometheus nativas na versão atual. Esta é uma funcionalidade planejada para versões futuras.

Como alternativa, use o `node_exporter` para métricas do host e scripts de health check para disponibilidade dos serviços.
:::

## Alertas Recomendados

Configure alertas para:

| Condição | Severidade |
|---|---|
| API Server não responde em 30s | Critical |
| Controller não rodando | Critical |
| NodeRuntime não rodando em algum node | Warning |
| Certificados expiram em 30 dias | Warning |
| Espaço em disco < 10% | Warning |
| Memória > 90% | Warning |

## Usando systemd para Alertas por Email

```ini
# Em cada serviço .service:
[Service]
OnFailure=notify-email@%n.service
```

```ini
# /etc/systemd/system/notify-email@.service
[Unit]
Description=Send email on service failure

[Service]
Type=oneshot
ExecStart=/usr/bin/mail -s "ALERTA: %i falhou" admin@sua-empresa.com
```

## Próximos Passos

- [Logs](/operations/logs)
- [Troubleshooting](/operations/troubleshooting)
- [Checklist de Produção](/operations/production-readiness)
