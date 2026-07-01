# Documentação do Torukr

Documentação oficial do Torukr, construída com [VitePress](https://vitepress.dev/).

## Por que VitePress?

VitePress foi escolhido por:

- **Simplicidade**: configuração mínima, foco em Markdown
- **Performance**: site estático rápido
- **Mermaid**: suporte a diagramas via `vitepress-plugin-mermaid`
- **Search**: busca local integrada sem dependências externas
- **Dark mode**: suporte nativo
- **Familiaridade**: Vite ecosystem, amplamente usado na comunidade Go/TypeScript

## Rodar Localmente

```bash
# Instalar dependências
cd docs/site
npm install

# Servidor de desenvolvimento (com hot reload)
npm run docs:dev
# Acesse: http://localhost:5173
```

## Build para Produção

```bash
npm run docs:build
# Saída em: docs/site/.vitepress/dist/
```

## Preview do Build

```bash
npm run docs:preview
# Acesse: http://localhost:4173
```

## Publicar

O diretório `.vitepress/dist/` contém o site estático e pode ser publicado em:

- GitHub Pages
- Netlify
- Vercel
- Qualquer servidor HTTP estático (nginx, caddy)

### GitHub Pages

```yaml
# .github/workflows/docs.yml
name: Deploy Docs
on:
  push:
    branches: [main]
    paths: ['docs/site/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: cd docs/site && npm ci && npm run docs:build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: docs/site/.vitepress/dist
```

## Estrutura

```
docs/site/
├── .vitepress/
│   └── config.ts          # Configuração do VitePress
├── index.md               # Página inicial
├── getting-started/       # Primeiros passos
├── concepts/              # Conceitos
├── setup/                 # Instalação e configuração
├── reference/             # Referências (API, CLI, Manifests)
├── tutorials/             # Tutoriais passo a passo
├── operations/            # Operação e troubleshooting
├── development/           # Documentação para desenvolvedores
└── public/                # Assets estáticos (logo, imagens)
```

## Contribuindo com a Documentação

1. Edite os arquivos `.md` na pasta correta
2. Rode `npm run docs:dev` para ver as mudanças em tempo real
3. Abra um Pull Request

Para adicionar novas páginas, adicione o arquivo `.md` e registre no sidebar em `.vitepress/config.ts`.
