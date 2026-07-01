# Tutorial: Fazer Deploy de App

Neste tutorial você vai fazer deploy de uma aplicação web simples no Torukr.

## Pré-requisitos

- Ao menos um node registrado e habilitado com role `apps`
- torukrctl autenticado

## Opção A: Via Manifest YAML

### Passo 1: Criar o Manifest

```bash
cat > minha-api.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: minha-api
  namespace: default
  labels:
    versao: v1
spec:
  image: nginx:1.25-alpine
  replicas: 1
EOF
```

### Passo 2: Aplicar

```bash
torukrctl apply -f minha-api.yaml
# ✓ App/minha-api created (phase: Pending)
```

### Passo 3: Acompanhar Status

```bash
# Verificar a cada 5 segundos até ficar Running
watch torukrctl get apps

# Ou uma vez:
torukrctl get apps
# NAME       PHASE    REPLICAS  IMAGE              NODE   CREATED
# minha-api  Running  1         nginx:1.25-alpine  vps-1  ...
```

### Passo 4: Ver Detalhes

```bash
torukrctl describe app minha-api
# Name:             minha-api
# Namespace:        default
# Phase:            Running
# Image:            nginx:1.25-alpine
# Replicas:         1
# Assigned Node:    3f4a8c1d-...
# Conditions:
#   - Type: ContainersReady, Status: True
```

## Opção B: Via API REST

```bash
curl -X POST http://localhost:8080/api/v1/apps \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "minha-api",
    "namespace": "default",
    "image": "nginx:1.25-alpine",
    "replicas": 1
  }'
```

## Atualizar uma App

Para atualizar a imagem ou replicas, edite o manifest e aplique novamente:

```yaml
spec:
  image: nginx:1.26-alpine  # nova versão
  replicas: 2               # escalar
```

```bash
torukrctl apply -f minha-api.yaml
# ✓ App/minha-api updated (phase: Reconciling)
```

## Verificar Logs

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8080/api/v1/namespaces/default/apps/minha-api/logs"
```

## Remover a App

```bash
torukrctl delete app minha-api
```

## Possíveis Problemas

### App fica em Pending por muito tempo

- Verifique se há nodes habilitados: `torukrctl get nodes`
- Verifique os logs do Controller: `journalctl -u torukr-controller -f`

### App vai para Failed

```bash
torukrctl describe app minha-api
# ver Conditions para entender o motivo
```

Cheque também os logs do NodeRuntime no VPS onde estava agendada.

## Próximos Passos

- [Conectar Dois Nodes](/tutorials/connect-two-nodes)
- [Rotacionar Certificados](/tutorials/rotate-certificates)
- [Troubleshooting](/operations/troubleshooting)
