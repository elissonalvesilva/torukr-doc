# Tutorial: Rotacionar Certificados

Os certificados TLS do Torukr devem ser rotacionados periodicamente (recomendado: a cada 12 meses) ou quando houver suspeita de comprometimento.

## Quando Rotacionar

- Expiração próxima (verifique com `openssl x509 -in cert.pem -noout -dates`)
- Chave privada comprometida
- Mudança de IPs ou SANs necessária
- Política de segurança da organização

## Verificar Datas de Expiração

```bash
# Ver data de expiração de cada certificado
openssl x509 -in certs/ca-cert.pem -noout -dates
openssl x509 -in certs/server-cert.pem -noout -dates
openssl x509 -in certs/client-cert.pem -noout -dates
```

## Procedimento de Rotação

### Passo 1: Fazer Backup dos Certificados Antigos

```bash
cp -r certs/ certs-backup-$(date +%Y%m%d)/
```

### Passo 2: Gerar Novos Certificados

```bash
# Isso sobrescreverá os arquivos em ./certs
go run cmd/gencerts/main.go -output ./certs
```

::: warning
Gerar novos certificados invalida imediatamente os certificados antigos. O cluster ficará indisponível até que todos os componentes usem os novos certificados.
:::

### Passo 3: Distribuir para Nodes Worker

```bash
for WORKER_IP in 10.0.0.2 10.0.0.3; do
  scp certs/ca-cert.pem usuario@$WORKER_IP:/etc/torukr/certs/
  scp certs/server-cert.pem usuario@$WORKER_IP:/etc/torukr/certs/
  scp certs/server-key.pem usuario@$WORKER_IP:/etc/torukr/certs/
done
```

### Passo 4: Reiniciar NodeRuntime em Todos os Nodes

**Em cada node worker:**

```bash
systemctl restart torukr-noderuntime
systemctl status torukr-noderuntime
```

**No node principal:**

```bash
systemctl restart torukr-noderuntime
```

### Passo 5: Reiniciar o Controller

```bash
systemctl restart torukr-controller
```

### Passo 6: Verificar Conectividade

```bash
# Verificar que Controller se conecta aos NodeRuntimes
journalctl -u torukr-controller -f | grep -E "connected|error|tls"

# Verificar com curl
curl --cacert ./certs/ca-cert.pem \
     --cert ./certs/client-cert.pem \
     --key ./certs/client-key.pem \
     https://localhost:9090/runtime/v1/healthz
```

### Passo 7: Verificar Apps e Resources

```bash
torukrctl get apps
torukrctl get resources
# Todos devem estar Running/Ready como antes
```

## Rollback

Se algo der errado:

```bash
# Restaurar certificados antigos
cp -r certs-backup-YYYYMMDD/* certs/

# Redistribuir
for WORKER_IP in 10.0.0.2 10.0.0.3; do
  scp certs/server-cert.pem usuario@$WORKER_IP:/etc/torukr/certs/
  scp certs/server-key.pem usuario@$WORKER_IP:/etc/torukr/certs/
  ssh usuario@$WORKER_IP systemctl restart torukr-noderuntime
done

systemctl restart torukr-controller
```

## Próximos Passos

- [Certificados: conceito](/concepts/certificates)
- [Segurança em Produção](/operations/production-readiness)
