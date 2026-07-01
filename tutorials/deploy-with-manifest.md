# Deploy com Manifest YAML

Neste tutorial, você vai criar uma aplicação simples usando um manifesto declarativo.

## Antes de começar

- API Server do Torukr rodando
- Pelo menos um Node registrado
- `torukrctl` instalado e configurado
- Docker disponível no node

## 1. Criar o arquivo `whoami.yaml`

```yaml
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: whoami
  namespace: default
spec:
  image: traefik/whoami:v1.10
  ports:
    - name: http
      containerPort: 80
      protocol: TCP
  networks:
    - name: private
```

## 2. Aplicar o manifesto

```bash
torukrctl apply -f whoami.yaml
```

## 3. Verificar o app

```bash
torukrctl get apps
torukrctl describe app whoami
```

## 4. Atualizar a imagem

Altere o campo `image` no arquivo:

```yaml
image: traefik/whoami:v1.11
```

Depois aplique novamente:

```bash
torukrctl apply -f whoami.yaml
```

O Controller reconcilia e atualiza o container no node.

## 5. Remover o app

```bash
torukrctl delete app whoami
```

## Também via Dashboard

1. Acesse `https://dashboard.torukr.local`
2. Vá em **Apps**
3. Clique em **Create App**
4. Preencha nome `whoami`, imagem `traefik/whoami:v1.10`, porta `80`
5. Clique em **Deploy**

## Próximos Passos

- [Criar uma network privada](/tutorials/create-network)
- [Exemplos completos](/tutorials/complete-examples)
- [Referência de Manifests](/reference/manifests)
