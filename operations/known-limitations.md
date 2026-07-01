# Limitações Conhecidas

Esta página documenta limitações identificadas diretamente no código-fonte do Torukr. Não são limitações inventadas — cada item foi detectado na análise do código.

## CLI

### Dry-run não totalmente suportado

O comando `torukrctl apply --dry-run` existe na CLI mas o suporte do lado da API é parcial.

**Local no código:** `internal/cli/commands/apply.go`

```go
if dryRun {
    output.PrintWarning("Dry-run mode is not yet fully supported by the API")
}
```

**Status:** Warning exibido ao usuário, mas a operação é executada normalmente.

### Enable/Disable de Nodes usa Busca por Nome

Os comandos `node enable` e `node disable` buscam o node pelo nome via query param `?name=`, mas a API não garante que o campo `name` seja indexado ou único globalmente. Em clusters com muitos nodes, isso pode ser lento.

**Local no código:** `internal/cli/commands/node.go`

---

## RBAC

### Permissões não aplicadas em todos os endpoints

O sistema de RBAC (Roles, Permissions, RoleBindings) está implementado na camada de dados, mas a verificação de permissões não está aplicada em todos os handlers da API.

**Status:** A API tem rotas de RBAC funcionais, mas a maioria dos endpoints verifica apenas autenticação (JWT válido), não autorização (se o usuário tem permissão específica).

**Impacto:** Qualquer usuário autenticado pode executar qualquer operação.

---

## Logs

### Streaming de logs parcialmente implementado

O endpoint `GET /namespaces/:namespace/apps/:name/logs/stream` está registrado nas rotas mas a implementação de streaming em tempo real pode não estar completa em todas as versões.

**Local no código:** `internal/apiserver/logs/routes.go`

---

## Networks

### Vinculação explícita de Networks a Apps/Resources

Atualmente não há um campo explícito de `networkRef` em Apps ou Resources para especificar qual rede overlay eles devem usar. A comunicação pelo overlay existe, mas a associação declarativa rede↔workload ainda está em desenvolvimento.

---

## Node Discovery / Service Discovery

### Sem DNS interno

O Torukr não provisiona um DNS interno. Containers se comunicam pelo IP do overlay (que pode mudar) em vez de nomes de serviço estáveis.

**Workaround:** Consultar a API para obter o IP atual do recurso antes de conectar.

---

## gencerts

### Certificados com SANs fixos

O `gencerts` gera certificados com SANs pré-definidos:
- Servidor: `localhost`, `noderuntime`, `noderuntime.torukr.svc`
- Cliente: `controller`, `controller.torukr.svc`

Se você precisar de SANs customizados (para IPs públicos ou domínios custom), o `gencerts` não suporta isso atualmente. Seria necessário usar `openssl` diretamente.

---

## Próximos Passos

- [Troubleshooting](/operations/troubleshooting)
- [Referência da API](/reference/api)
- [Contribuindo](/development/contributing)
