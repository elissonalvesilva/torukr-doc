# Início Rápido

Este guia assume que você já tem o Torukr instalado e rodando. Se não, veja [Instalação](/getting-started/installation).

Neste guia você vai:

1. Configurar o endpoint da API
2. Autenticar
3. Criar o primeiro manifesto YAML
4. Aplicar e verificar

## 1. Configurar o endpoint

### Laboratório ou homelab

```bash
torukrctl config set server https://api.torukr.local
```

### Produção

```bash
torukrctl config set server https://torukr-api.example.com
```

### Desenvolvimento local

```bash
torukrctl config set server http://127.0.0.1:8080
```

## 2. Autenticar

```bash
torukrctl login
```

Credenciais iniciais:

```
Usuário: root
Senha: oj57DZ3fi]k5
```

::: warning
Troque a senha do usuário root após o primeiro login.
:::

## 3. Criar o primeiro manifesto

Crie o arquivo `stack.yaml`:

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: Node
metadata:
  name: node-01
spec:
  role: worker
  privateIP: 192.168.1.11
  enabled: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: Network
metadata:
  name: private
  namespace: default
spec:
  driver: overlay
  subnet: 10.88.0.0/16
  encrypted: true
---
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: whoami
  namespace: default
spec:
  image: traefik/whoami:v1.10
  ports:
    - containerPort: 80
  networks:
    - name: private
```

## 4. Aplicar

```bash
torukrctl apply -f stack.yaml
```

## 5. Verificar

```bash
torukrctl get nodes
torukrctl get networks
torukrctl get apps
```

Saída esperada:

```
NAME     PHASE    REPLICAS  IMAGE                  NODE     CREATED
whoami   Running  1         traefik/whoami:v1.10   node-01  2024-01-15 10:05:00
```

## 6. Ver detalhes e remover

```bash
torukrctl describe app whoami
torukrctl delete app whoami
```

## Também via Dashboard

1. Acesse `https://dashboard.torukr.local`
2. Login com `root` / `oj57DZ3fi]k5`
3. Vá em **Apps** → **Create App**
4. Preencha nome, imagem, porta e clique em **Deploy**

## Próximos Passos

- [Configuração completa de node único](/getting-started/single-node)
- [Adicionar um segundo node](/getting-started/multi-node)
- [Referência de Manifests YAML](/reference/manifests)
- [Tutorial completo de deploy com manifest](/tutorials/deploy-with-manifest)
