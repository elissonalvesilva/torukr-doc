# Network — Exemplo Simples

Cria uma rede overlay privada entre nodes.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  encrypted: true
```

## Aplicar

```bash
torukrctl apply -f network-simple.yaml
torukrctl get networks
torukrctl describe network private
```

## Também via Dashboard

1. Acesse `https://dashboard.torukr.local`
2. Vá em **Networks**
3. Clique em **Create Network**
4. Informe nome `private`, driver `overlay`, subnet `10.88.0.0/16`
5. Clique em **Create**
