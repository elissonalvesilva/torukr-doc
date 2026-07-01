# Troubleshooting

## Diagnóstico Geral

Antes de qualquer troubleshooting, colete as informações básicas:

```bash
# Status de todos os serviços
systemctl status torukr-noderuntime torukr-apiserver torukr-controller

# Logs recentes
journalctl -u torukr-apiserver --since "1 hour ago"
journalctl -u torukr-controller --since "1 hour ago"
journalctl -u torukr-noderuntime --since "1 hour ago"
```

---

## API Não Responde

### Sintoma

```bash
curl http://localhost:8080/api/v1/events
# curl: (7) Failed to connect to localhost port 8080
```

### Diagnóstico

```bash
# Verificar se o processo está rodando
ps aux | grep apiserver

# Verificar porta
ss -tlnp | grep 8080

# Ver logs de inicialização
journalctl -u torukr-apiserver -n 50
```

### Causas Comuns

| Causa | Solução |
|---|---|
| `.env` não encontrado | Verificar que `.env` está no `WorkingDirectory` do serviço |
| `DATABASE_DSN` inválido | Verificar credenciais do PostgreSQL |
| Porta em uso | `fuser -k 8080/tcp` e reiniciar |
| `JWT_SECRET` muito fraco | Usar `openssl rand -hex 32` |

---

## torukrctl Não Encontra a API

### Sintoma

```bash
torukrctl get nodes
# Error: connection refused
```

### Solução

```bash
# Especificar URL explicitamente
torukrctl get nodes --api-url http://SEU-IP:8080/api/v1

# Verificar configuração salva
cat ~/.torukrctl/config

# Reautenticar
torukrctl login --api-url http://SEU-IP:8080/api/v1
```

---

## Controller Não Se Conecta ao NodeRuntime

### Sintoma

Nos logs do Controller:

```
ERROR Failed to connect to NodeRuntime at 10.0.0.2:9090
ERROR tls: certificate signed by unknown authority
```

### Diagnóstico

```bash
# Testar conexão mTLS manualmente
curl --cacert certs/ca-cert.pem \
     --cert certs/client-cert.pem \
     --key certs/client-key.pem \
     https://10.0.0.2:9090/runtime/v1/healthz

# Verificar certificados
openssl verify -CAfile certs/ca-cert.pem certs/server-cert.pem
openssl verify -CAfile certs/ca-cert.pem certs/client-cert.pem
```

### Causas Comuns

| Erro | Causa | Solução |
|---|---|---|
| `certificate signed by unknown authority` | CA incorreta | Verificar `TORUKR_TLS_CA_CERT` |
| `connection refused` | NodeRuntime não está rodando | `systemctl start torukr-noderuntime` |
| `tls: bad certificate` | Cert do cliente inválido | Regerar certificados |
| `no route to host` | Firewall bloqueando | Abrir porta 9090 TCP |

---

## App Fica em Pending

### Sintoma

```bash
torukrctl get apps
# minha-api  Pending  ...  (por muito tempo)
```

### Diagnóstico

```bash
# Ver logs do Controller
journalctl -u torukr-controller -f | grep -i "minha-api\|schedule\|pending"

# Verificar nodes disponíveis
torukrctl get nodes
# Todos devem ter ENABLED=true

# Verificar se há nodes com role correto
torukrctl get nodes | grep apps
```

### Causas Comuns

- Nenhum node habilitado com role `apps`
- Todos os nodes estão desabilitados
- Controller não está rodando
- Controller não consegue se conectar a nenhum NodeRuntime

---

## Network Overlay {#network-overlay}

### WireGuard sem Handshake

```bash
wg show wg0
# peer: ...
#   latest handshake: never  ← PROBLEMA
```

**Verificar:**

```bash
# Porta UDP 51820 aberta
ufw status | grep 51820
# ou
iptables -L INPUT -n | grep 51820

# Testar conectividade UDP entre nodes
nc -uv 10.0.0.2 51820

# Ver logs WireGuard
dmesg | grep wireguard
```

### VXLAN Sem Tráfego

```bash
# Verificar que a interface existe
ip link show vxlan10088

# Capturar tráfego
tcpdump -i vxlan10088 -n

# Verificar bridge
bridge fdb show dev vxlan10088
```

### Container Não Pinga Outro Container

```bash
# Verificar rota dentro do container
docker exec meu-container ip route

# Verificar bridge do Docker
docker network ls
docker network inspect torukr-privada

# Verificar regras iptables
iptables -L FORWARD -n | grep DROP
```

---

## Certificado Inválido ou Expirado

```bash
# Verificar datas de validade
openssl x509 -in certs/server-cert.pem -noout -dates
# notAfter=Jan 15 10:00:00 2025 GMT

# Se expirado, rotacionar:
# Ver tutorial: /tutorials/rotate-certificates
```

---

## Erro de Permissão nas Chaves

```bash
journalctl -u torukr-noderuntime | grep "permission denied"
# open /etc/torukr/certs/server-key.pem: permission denied

# Corrigir permissões
chmod 600 /etc/torukr/certs/server-key.pem
chown root:root /etc/torukr/certs/server-key.pem
```

---

## CORS: Dashboard Não Consegue Acessar API

### Sintoma

No console do browser: `Access to fetch blocked by CORS policy`

### Solução

Adicionar a origem do dashboard ao `.env`:

```ini
CORS_ORIGINS=http://localhost:3000,https://meu-dashboard.com
```

Reiniciar o API Server:

```bash
systemctl restart torukr-apiserver
```

---

## Coletar Informações para Debug

Ao reportar um problema:

```bash
# Versões
go version
docker version --format '{{.Server.Version}}'
uname -r

# Status dos serviços
systemctl status torukr-{apiserver,controller,noderuntime} --no-pager

# Logs das últimas 2 horas
journalctl -u torukr-apiserver --since "2 hours ago" > apiserver.log
journalctl -u torukr-controller --since "2 hours ago" > controller.log
journalctl -u torukr-noderuntime --since "2 hours ago" > noderuntime.log

# Informações de rede
ip addr
ip route
wg show
```

## Próximos Passos

- [Limitações Conhecidas](/operations/known-limitations)
- [Logs](/operations/logs)
