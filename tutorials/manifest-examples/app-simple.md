# App — Exemplo Simples

Deploy de uma aplicação de teste (whoami).

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

## Aplicar

```bash
torukrctl apply -f app-simple.yaml
torukrctl get apps
torukrctl describe app whoami
```

## Também via Dashboard

1. Acesse `https://dashboard.torukr.local`
2. Vá em **Apps**
3. Clique em **Create App**
4. Nome: `whoami`, Imagem: `traefik/whoami:v1.10`, Porta: `80`
5. Clique em **Deploy**
