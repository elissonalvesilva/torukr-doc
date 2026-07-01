# Referência da CLI (torukrctl)

## Flags Globais

Disponíveis em todos os comandos:

| Flag | Atalho | Padrão | Descrição |
|---|---|---|---|
| `--api-url` | — | `http://localhost:8080/api/v1` | URL do API Server |
| `--token` | — | — | Token JWT (sobrescreve o salvo) |
| `--namespace` | `-n` | `default` | Namespace das operações |
| `--all-namespaces` | — | `false` | Listar em todos os namespaces |
| `--output` | `-o` | `table` | Formato: `table` ou `json` |

---

## login

Autenticar e salvar token JWT localmente.

```bash
torukrctl login [--api-url URL]
```

**Exemplo:**

```bash
torukrctl login --api-url http://10.0.0.1:8080/api/v1
# Email: admin@torukr.io
# Password: ****
# ✓ Logged in
```

---

## logout

Remover token salvo.

```bash
torukrctl logout
```

---

## whoami

Mostrar o usuário autenticado atual.

```bash
torukrctl whoami
```

---

## version

Mostrar a versão do torukrctl.

```bash
torukrctl version
```

---

## apply

Aplicar um manifest YAML para criar ou atualizar recursos.

```bash
torukrctl apply -f ARQUIVO [--dry-run]
```

| Flag | Descrição |
|---|---|
| `-f, --file` | Arquivo de manifest (obrigatório) |
| `--dry-run` | Validar sem criar (suporte parcial) |

**Exemplos:**

```bash
# Aplicar manifest
torukrctl apply -f app.yaml

# Aplicar com dry-run
torukrctl apply -f app.yaml --dry-run
```

**Saída:**

```
✓ App/minha-api created (phase: Pending)
```

---

## get

Listar recursos.

```bash
torukrctl get RECURSO [flags]
```

### get apps

```bash
torukrctl get apps [-n NAMESPACE] [--all-namespaces] [-o json]
```

**Saída:**

```
NAME       PHASE    REPLICAS  IMAGE          NODE   CREATED
minha-api  Running  1         nginx:latest   vps-1  2024-01-15 10:00:00
```

### get resources

```bash
torukrctl get resources [-n NAMESPACE] [--all-namespaces] [-o json]
```

**Saída:**

```
NAME      TYPE      PHASE    REPLICAS  NODE   CREATED
db-main   postgres  Running  1         vps-2  2024-01-15 10:00:00
```

### get nodes

```bash
torukrctl get nodes [-o json]
```

**Saída:**

```
NAME   ROLE  ENABLED  PRIVATE IP  LABELS        CREATED
vps-1  apps  true     10.0.0.10   region=br     2024-01-15 09:00:00
```

### get networks

```bash
torukrctl get networks [-n NAMESPACE] [--all-namespaces] [-o json]
```

**Saída:**

```
NAME     DRIVER   SUBNET          PHASE  CREATED
privada  overlay  10.88.0.0/16   Ready  2024-01-15 09:30:00
```

---

## describe

Mostrar detalhes completos de um recurso.

```bash
torukrctl describe TIPO NOME [flags]
```

### describe app

```bash
torukrctl describe app NOME [-n NAMESPACE]
```

**Saída:**

```
Name:             minha-api
Namespace:        default
Phase:            Running
Image:            nginx:latest
Assigned Node:    3f4a8c1d-...
Ingress Host:     -
Created:          2024-01-15 10:00:00
Updated:          2024-01-15 10:05:00

Conditions:
  - Type: ContainersReady, Status: True, Reason: AllContainersRunning
```

### describe resource

```bash
torukrctl describe resource NOME [-n NAMESPACE]
```

### describe node

```bash
torukrctl describe node NOME
```

**Saída:**

```
Name:              vps-1
Role:              apps
Enabled:           true
Private IP:        10.0.0.10

Capacity:
  CPU:       4
  Memory:    8Gi
  Disk:      100Gi

Allocatable:
  CPU:       3.5
  Memory:    7Gi
  Disk:      80Gi

Labels:
  region=br
  env=prod
```

### describe network

```bash
torukrctl describe network NOME [-n NAMESPACE]
```

---

## delete

Remover um recurso.

```bash
torukrctl delete TIPO NOME [flags]
```

**Exemplos:**

```bash
torukrctl delete app minha-api
torukrctl delete resource banco-principal
torukrctl delete node vps-1
torukrctl delete network privada
```

---

## node

Gerenciar nodes (criar, habilitar, desabilitar, labels).

### node create

```bash
torukrctl node create --name NOME --address IP --role ROLE [--labels k=v,...] [--enabled]
```

| Flag | Obrigatório | Descrição |
|---|---|---|
| `--name` | Sim | Nome do node |
| `--address` | Sim | IP privado do servidor |
| `--role` | Sim | `apps` ou `resources` |
| `--labels` | Não | Labels no formato `k=v,k2=v2` |
| `--enabled` | Não | Habilitar para agendamento (padrão: true) |

**Exemplos:**

```bash
# Node para apps
torukrctl node create \
  --name vps-1 \
  --address 10.0.0.10 \
  --role apps \
  --labels region=br,env=prod \
  --enabled

# Node para databases
torukrctl node create \
  --name vps-db \
  --address 10.0.0.20 \
  --role resources
```

### node enable

```bash
torukrctl node enable NOME
```

```bash
torukrctl node enable vps-1
# ✓ node/vps-1 enabled
```

### node disable

```bash
torukrctl node disable NOME
```

```bash
torukrctl node disable vps-1
# ✓ node/vps-1 disabled
```

### node label

Adicionar ou atualizar labels em um node.

```bash
torukrctl node label NOME CHAVE=VALOR [CHAVE=VALOR...]
```

```bash
# Adicionar uma label
torukrctl node label vps-1 region=br

# Adicionar múltiplas labels
torukrctl node label vps-1 region=br env=prod datacenter=sp
```

### node unlabel

Remover labels de um node.

```bash
torukrctl node unlabel NOME CHAVE [CHAVE...]
```

```bash
# Remover uma label
torukrctl node unlabel vps-1 region

# Remover múltiplas labels
torukrctl node unlabel vps-1 region env
```

---

## Exemplos de Uso Combinado

```bash
# Deploy completo de uma stack
torukrctl apply -f network.yaml
torukrctl apply -f database.yaml
torukrctl apply -f api.yaml

# Verificar tudo
torukrctl get networks
torukrctl get resources
torukrctl get apps

# Saída JSON para scripts
torukrctl get apps -o json | jq '.[] | {name: .name, phase: .phase}'
```
