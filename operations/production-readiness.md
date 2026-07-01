# Checklist de Produção

## Segurança

- [ ] `TORUKR_TLS_ENABLED=true` no `.env`
- [ ] `TORUKR_TLS_INSECURE_SKIP_VERIFY` não definida (ou `false`)
- [ ] `JWT_SECRET` com no mínimo 32 caracteres e alta entropia
- [ ] `TORUKR_MASTER_KEY` gerado com `openssl rand -base64 32`
- [ ] Arquivo `.env` com permissão `600`
- [ ] Chaves privadas (`*-key.pem`) com permissão `600`
- [ ] `*.pem` e `.env` no `.gitignore`
- [ ] `ENV=production` para ativar validações extras

## Banco de Dados

- [ ] `DATABASE_DSN` com `sslmode=require` ou `sslmode=verify-full`
- [ ] Backup automático configurado
- [ ] Migrações aplicadas com `migrate up`
- [ ] Usuário do banco tem apenas permissões necessárias (não `superuser`)

## Certificados

- [ ] Certificados gerados com `gencerts`
- [ ] Datas de expiração verificadas (`openssl x509 -noout -dates`)
- [ ] Processo de rotação documentado e testado
- [ ] `ca-key.pem` armazenado em local seguro (não no servidor de produção)

## Rede

- [ ] Porta `8080` acessível apenas para clientes autorizados (ou atrás de proxy)
- [ ] Porta `9090` acessível apenas do servidor do Controller
- [ ] Porta `51820` UDP aberta entre todos os nodes (para overlay)
- [ ] Firewall configurado (`ufw` ou `iptables`)

## Alta Disponibilidade

::: info
O Torukr ainda não tem suporte nativo para HA do Control Plane (API Server + Controller em múltiplas instâncias). Para alta disponibilidade, considere:

- Banco de dados PostgreSQL em HA (Patroni, RDS Multi-AZ, etc.)
- Proxy reverso na frente da API (nginx, caddy)
- Monitoramento e alertas de processo com reinício automático (systemd com `Restart=always`)
:::

## Monitoramento

- [ ] Health check da API: `GET /api/v1/events` retorna 200
- [ ] Health check do NodeRuntime: endpoint mTLS respondendo
- [ ] Alertas de processo configurados (systemd, supervisord, ou equivalente)
- [ ] Log rotation configurado (`logrotate` ou similar)

## Backups

```bash
# Backup do banco de dados
pg_dump -U torukr torukr | gzip > torukr-backup-$(date +%Y%m%d).sql.gz

# Backup dos certificados
tar -czf certs-backup-$(date +%Y%m%d).tar.gz certs/
```

## Configuração de systemd para Produção

Certifique-se que os serviços têm `Restart=always` e limites de recursos:

```ini
[Service]
Restart=always
RestartSec=5
# Limitar uso de recursos:
MemoryLimit=512M
CPUQuota=50%
```

## Configurações Recomendadas de PostgreSQL

```sql
-- Criar usuário com permissões mínimas
CREATE USER torukr WITH PASSWORD 'senha-segura';
GRANT CONNECT ON DATABASE torukr TO torukr;
GRANT USAGE ON SCHEMA public TO torukr;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO torukr;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO torukr;
```

## Próximos Passos

- [Logs e Monitoramento](/operations/logs)
- [Troubleshooting](/operations/troubleshooting)
