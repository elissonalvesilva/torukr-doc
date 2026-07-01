# Service Discovery

## Como Apps e Resources se Encontram?

O Torukr não inclui um serviço de DNS interno dedicado (como CoreDNS no Kubernetes). A descoberta de serviços é feita através do Network Overlay e da própria API do Torukr.

## Descoberta via IP do Overlay

Quando apps e resources estão na mesma network overlay, eles recebem IPs fixos no range da subnet configurada. Uma app pode se conectar a um resource usando esse IP diretamente.

```bash
# Descobrir IP do resource no overlay
torukrctl describe resource banco-principal
# ou via API
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8080/api/v1/resources/banco-principal
```

## Descoberta via API do Torukr

Applications podem consultar a API do Torukr para descobrir o endereço de outros serviços:

```bash
# Listar resources de um namespace
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/resources?namespace=default"
```

## Ingress Host

Apps podem ter um `ingressHost` configurado, que define o hostname externo pelo qual a app é acessível:

```json
{
  "name": "minha-api",
  "ingressHost": "api.meudominio.com"
}
```

::: info
A configuração do ingress (proxy reverso, DNS, TLS externo) é responsabilidade do operador. O Torukr registra o `ingressHost` mas não provisiona automaticamente o ingress controller.
:::

## Comunicação entre Nodes

Containers em nodes diferentes se comunicam através do [Network Overlay](/concepts/network-overlay) (WireGuard + VXLAN). Para que a comunicação funcione:

1. Ambos os nodes devem estar na mesma network overlay
2. WireGuard deve estar configurado e com handshake estabelecido
3. As regras de firewall não podem bloquear o tráfego overlay

## Limitações Atuais

- Não há DNS interno automático (como `meu-resource.default.svc.torukr`)
- Alocação de IPs no overlay é gerenciada pelo NetworkReconciler mas a visibilidade de qual container tem qual IP requer inspeção manual
- A vinculação explícita de networks a apps/resources ainda está em desenvolvimento

## Próximos Passos

- [Network Overlay](/concepts/network-overlay)
- [Conceito de Networks](/concepts/networks)
- [Tutorial: Conectar Dois Nodes](/tutorials/connect-two-nodes)
