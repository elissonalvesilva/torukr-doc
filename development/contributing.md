# Contribuindo

## Pré-requisitos

- Go 1.25+
- Docker
- Familiaridade com Go e REST APIs
- Leia [Estrutura do Projeto](/development/project-structure) antes de contribuir

## Processo de Contribuição

1. Fork o repositório
2. Crie uma branch: `git checkout -b feat/minha-feature`
3. Faça as alterações seguindo os padrões abaixo
4. Escreva ou atualize testes
5. Execute `go test ./...` e `go vet ./...`
6. Commit: `git commit -m "feat: descrição da feature"`
7. Pull Request

## Padrões de Código

### Go

- Siga as convenções de Go (`gofmt`, `golangci-lint`)
- Erros sempre wrapeados com contexto: `fmt.Errorf("contexto: %w", err)`
- Nomes de funções exportadas descritivos
- Comentários apenas quando o "porquê" não é óbvio

### Commits

Prefixos convencionais:

| Prefixo | Uso |
|---|---|
| `feat:` | Nova funcionalidade |
| `fix:` | Correção de bug |
| `docs:` | Documentação |
| `refactor:` | Refatoração sem mudança de comportamento |
| `test:` | Adição/modificação de testes |
| `chore:` | Manutenção, build, CI |

### Novas Migrações

- Sempre criar `.up.sql` e `.down.sql`
- Usar `IF NOT EXISTS` / `IF EXISTS` para idempotência
- Numerar sequencialmente: `000024_...`
- Atualizar arquivos go-jet manualmente após migração

## Reportar Bugs

Abra uma issue no GitHub com:

- Versão do Torukr (ou hash do commit)
- Versão do Go e OS
- Steps para reproduzir
- Comportamento esperado vs atual
- Logs relevantes

## Atualizar a Documentação

A documentação está em `docs/site/`. Para rodar localmente:

```bash
cd docs/site
npm install
npm run docs:dev
```

Edite os arquivos `.md` correspondentes e abra um PR.

## Próximos Passos

- [Desenvolvimento Local](/development/local-development)
- [Análise com Graphify](/development/graphify-analysis)
