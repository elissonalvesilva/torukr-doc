# Instalar torukrctl

## Via Go Install

```bash
go install github.com/elissonalvesilva/torukr/cmd/torukrctl@latest
```

O binário ficará em `$GOPATH/bin/torukrctl` ou `~/go/bin/torukrctl`.

## Via Compilação Local

```bash
git clone https://github.com/elissonalvesilva/torukr.git
cd torukr
go build -o torukrctl ./cmd/torukrctl
sudo mv torukrctl /usr/local/bin/
```

## Verificar Instalação

```bash
torukrctl version
# torukrctl vX.Y.Z
```

## Configuração Inicial

```bash
# Autenticar com a API
torukrctl login --api-url http://SEU-SERVIDOR:8080/api/v1
# Email: admin@torukr.io
# Password: ****
# ✓ Logged in as admin@torukr.io

# Verificar
torukrctl whoami
```

A configuração é salva localmente. Nas próximas execuções, `torukrctl` usa automaticamente a URL e o token salvos.

## Usar com Múltiplos Ambientes

Use a flag `--api-url` para apontar para diferentes instalações:

```bash
# Produção
torukrctl get apps --api-url https://api.producao.com/api/v1

# Staging
torukrctl get apps --api-url https://api.staging.com/api/v1
```

Ou exporte como variável de ambiente em seu shell:

```bash
export TORUKR_API_URL=https://api.producao.com/api/v1
```

## Próximos Passos

- [Referência Completa da CLI](/reference/cli)
- [Início Rápido](/getting-started/quickstart)
