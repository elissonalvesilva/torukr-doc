# Node — Exemplo Simples

Registra um servidor VPS como worker na plataforma.

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
spec:
  role: worker
  privateIP: 192.168.1.11
  enabled: true
```

## Aplicar

```bash
torukrctl apply -f node-simple.yaml
torukrctl get nodes
torukrctl describe node node-01
```

## Também via Dashboard

1. Acesse `https://dashboard.torukr.local`
2. Vá em **Nodes**
3. Clique em **Create Node**
4. Informe nome `node-01`, IP `192.168.1.11`, role `worker`
5. Clique em **Create**
