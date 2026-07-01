# Gerar Certificados

O Torukr inclui o utilitário `gencerts` para gerar todos os certificados TLS necessários.

## O que é Gerado

```
certs/
├── ca-cert.pem       # Certificado da CA raiz
├── ca-key.pem        # Chave privada da CA (manter seguro!)
├── server-cert.pem   # Certificado do NodeRuntime
├── server-key.pem    # Chave privada do NodeRuntime
├── client-cert.pem   # Certificado do Controller
└── client-key.pem    # Chave privada do Controller
```

## Gerar

```bash
# No diretório padrão ./certs
go run cmd/gencerts/main.go

# Em diretório específico
go run cmd/gencerts/main.go -output /etc/torukr/certs

# Ou com binário compilado
./bin/gencerts -output ./certs
```

## Saída Esperada

```
🔐 Generating TLS certificates for Torukr...
Output directory: ./certs

1. Generating CA certificate...
2. Generating NodeRuntime server certificate...
3. Generating Controller client certificate...

✅ Certificate generation complete!

Generated files:
  📄 CA Certificate:      ./certs/ca-cert.pem
  🔑 CA Key:              ./certs/ca-key.pem
  📄 Server Certificate:  ./certs/server-cert.pem
  🔑 Server Key:          ./certs/server-key.pem
  📄 Client Certificate:  ./certs/client-cert.pem
  🔑 Client Key:          ./certs/client-key.pem

Add these to your .env file:
TORUKR_TLS_ENABLED=true
TORUKR_TLS_CA_CERT=./certs/ca-cert.pem
...
```

## Configurar Permissões

As chaves privadas são criadas com permissão `0600` automaticamente. Verifique:

```bash
ls -la certs/
# -rw------- ca-key.pem
# -rw------- server-key.pem
# -rw------- client-key.pem
# -rw-r--r-- ca-cert.pem
# -rw-r--r-- server-cert.pem
# -rw-r--r-- client-cert.pem
```

## Distribuir para Nodes Worker

Cada node worker precisa apenas dos certificados do servidor:

```bash
# Copiar para o worker
ssh usuario@10.0.0.2 "mkdir -p /etc/torukr/certs"
scp certs/ca-cert.pem usuario@10.0.0.2:/etc/torukr/certs/
scp certs/server-cert.pem usuario@10.0.0.2:/etc/torukr/certs/
scp certs/server-key.pem usuario@10.0.0.2:/etc/torukr/certs/
```

**Não copie** `ca-key.pem` para workers — apenas a CA raiz pública é necessária.

## Verificar Certificados

```bash
# Ver detalhes do certificado CA
openssl x509 -in certs/ca-cert.pem -text -noout | grep -E "Subject:|Issuer:|Not After"

# Verificar que server-cert foi assinado pela CA
openssl verify -CAfile certs/ca-cert.pem certs/server-cert.pem
# server-cert.pem: OK

# Verificar que client-cert foi assinado pela CA
openssl verify -CAfile certs/ca-cert.pem certs/client-cert.pem
# client-cert.pem: OK

# Testar conexão TLS com NodeRuntime
curl --cacert certs/ca-cert.pem \
     --cert certs/client-cert.pem \
     --key certs/client-key.pem \
     https://localhost:9090/runtime/v1/healthz
```

## Adicionar ao .gitignore

```bash
echo "certs/*.pem" >> .gitignore
echo ".env" >> .gitignore
```

## Rotação de Certificados

Veja o [Tutorial de Rotação de Certificados](/tutorials/rotate-certificates).

## Próximos Passos

- [Instalar Node Principal](/setup/install-main-node)
- [Conceito de Certificados](/concepts/certificates)
- [Variáveis de Ambiente](/setup/environment-variables)
