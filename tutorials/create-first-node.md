# Tutorial: Criar o Primeiro Node

Neste tutorial você vai registrar seu primeiro VPS como node no Torukr.

## Pré-requisitos

- Torukr instalado e rodando (API Server + Controller + NodeRuntime)
- torukrctl configurado e autenticado
- VPS com NodeRuntime rodando (pode ser o mesmo do API Server para começar)

## Passo 1: Verificar que Está Autenticado

```bash
torukrctl whoami
# admin@torukr.io
```

Se não estiver autenticado:

```bash
torukrctl login --api-url http://localhost:8080/api/v1
```

## Passo 2: Registrar o Node

```bash
torukrctl node create \
  --name meu-primeiro-vps \
  --address 10.0.0.10 \
  --role apps \
  --enabled
```

Saída esperada:

```
✓ node/meu-primeiro-vps created
```

## Passo 3: Verificar o Node

```bash
torukrctl get nodes
```

```
NAME               ROLE  ENABLED  PRIVATE IP  LABELS  CREATED
meu-primeiro-vps   apps  true     10.0.0.10           2024-01-15 10:00:00
```

## Passo 4: Ver Detalhes do Node

```bash
torukrctl describe node meu-primeiro-vps
```

```
Name:             meu-primeiro-vps
Role:             apps
Enabled:          true
Private IP:       10.0.0.10
Created:          2024-01-15 10:00:00
Updated:          2024-01-15 10:00:00
```

## Passo 5: Adicionar Labels

Labels permitem organizar e selecionar nodes:

```bash
torukrctl node label meu-primeiro-vps region=br env=producao
```

Verificar:

```bash
torukrctl describe node meu-primeiro-vps
# Labels:
#   region=br
#   env=producao
```

## Passo 6: Testar Deploy

Com o node registrado, faça deploy de uma app simples para verificar que tudo funciona:

```bash
cat > teste.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: app-teste
  namespace: default
spec:
  image: nginx:alpine
  replicas: 1
EOF

torukrctl apply -f teste.yaml
```

Aguardar alguns segundos e verificar:

```bash
torukrctl get apps
# NAME       PHASE    REPLICAS  IMAGE          NODE              CREATED
# app-teste  Running  1         nginx:alpine   meu-primeiro-vps  ...
```

## Limpeza

```bash
torukrctl delete app app-teste
```

## Próximos Passos

- [Criar uma Network](/tutorials/create-network)
- [Fazer Deploy de App](/tutorials/deploy-app)
- [Adicionar Segundo Node](/getting-started/multi-node)
