import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'Torukr',
  description: 'Documentação oficial do Torukr',

  lang: 'pt-BR',
  cleanUrls: false,

  themeConfig: {
    siteTitle: 'Torukr',

    nav: [
      { text: 'Início', link: '/' },
      { text: 'Primeiros Passos', link: '/getting-started/overview' },
      { text: 'Conceitos', link: '/concepts/architecture' },
      { text: 'Referência', link: '/reference/api' },
      { text: 'Tutoriais', link: '/tutorials/create-first-node' }
    ],

    sidebar: [
      {
        text: 'Primeiros Passos',
        items: [
          { text: 'Visão Geral', link: '/getting-started/overview' },
          { text: 'Instalação', link: '/getting-started/installation' },
          { text: 'Início Rápido', link: '/getting-started/quickstart' },
          { text: 'Node Único', link: '/getting-started/single-node' },
          { text: 'Multi-Node', link: '/getting-started/multi-node' }
        ]
      },
      {
        text: 'Conceitos',
        items: [
          { text: 'Arquitetura', link: '/concepts/architecture' },
          { text: 'Nodes', link: '/concepts/nodes' },
          { text: 'Redes', link: '/concepts/networks' },
          { text: 'Aplicações', link: '/concepts/apps' },
          { text: 'Recursos', link: '/concepts/resources' },
          { text: 'Node Runtime', link: '/concepts/node-runtime' },
          { text: 'API do Torukr', link: '/concepts/torukr-api' },
          { text: 'torukrctl', link: '/concepts/torukrctl' },
          { text: 'Certificados', link: '/concepts/certificates' },
          { text: 'Network Overlay', link: '/concepts/network-overlay' },
          { text: 'Service Discovery', link: '/concepts/service-discovery' },
          { text: 'Segurança', link: '/concepts/security' }
        ]
      },
      {
        text: 'Configuração',
        items: [
          { text: 'Requisitos', link: '/setup/requirements' },
          { text: 'Instalar Node Principal', link: '/setup/install-main-node' },
          { text: 'Instalar Worker Node', link: '/setup/install-worker-node' },
          { text: 'Instalar Overlay Network', link: '/setup/install-overlay-network' },
          { text: 'Gerar Certificados', link: '/setup/generate-certificates' },
          { text: 'Instalar torukrctl', link: '/setup/install-torukrctl' },
          { text: 'Variáveis de Ambiente', link: '/setup/environment-variables' }
        ]
      },
      {
        text: 'Referência',
        items: [
          { text: 'API REST', link: '/reference/api' },
          { text: 'CLI', link: '/reference/cli' },
          { text: 'Manifests YAML', link: '/reference/manifests' }
        ]
      },
      {
        text: 'Tutoriais',
        items: [
          { text: 'Criar o Primeiro Node', link: '/tutorials/create-first-node' },
          { text: 'Criar uma Network', link: '/tutorials/create-network' },
          { text: 'Fazer Deploy de App', link: '/tutorials/deploy-app' },
          { text: 'Deploy com Manifest YAML', link: '/tutorials/deploy-with-manifest' },
          { text: 'Conectar Dois Nodes', link: '/tutorials/connect-two-nodes' },
          { text: 'Rotacionar Certificados', link: '/tutorials/rotate-certificates' },
          { text: 'Exemplos Completos', link: '/tutorials/complete-examples' }
        ]
      },
      {
        text: 'Exemplos de Manifests',
        items: [
          { text: 'Índice', link: '/tutorials/manifest-examples/' },
          { text: 'Node Simples', link: '/tutorials/manifest-examples/node-simple' },
          { text: 'Node Avançado', link: '/tutorials/manifest-examples/node-advanced' },
          { text: 'Network Simples', link: '/tutorials/manifest-examples/network-simple' },
          { text: 'Network Avançada', link: '/tutorials/manifest-examples/network-advanced' },
          { text: 'App Simples', link: '/tutorials/manifest-examples/app-simple' },
          { text: 'App Avançado', link: '/tutorials/manifest-examples/app-advanced' },
          { text: 'Resource Simples', link: '/tutorials/manifest-examples/resource-simple' },
          { text: 'Resource Avançado', link: '/tutorials/manifest-examples/resource-advanced' },
          { text: 'Stack Single-Node', link: '/tutorials/manifest-examples/stack-single-node' },
          { text: 'Stack Multi-Node', link: '/tutorials/manifest-examples/stack-multi-node' },
          { text: 'Stack Completa', link: '/tutorials/manifest-examples/stack-complete' }
        ]
      },
      {
        text: 'Operação',
        items: [
          { text: 'Produção', link: '/operations/production-readiness' },
          { text: 'Logs', link: '/operations/logs' },
          { text: 'Monitoramento', link: '/operations/monitoring' },
          { text: 'Troubleshooting', link: '/operations/troubleshooting' },
          { text: 'Limitações Conhecidas', link: '/operations/known-limitations' }
        ]
      },
      {
        text: 'Desenvolvimento',
        items: [
          { text: 'Estrutura do Projeto', link: '/development/project-structure' },
          { text: 'Desenvolvimento Local', link: '/development/local-development' },
          { text: 'Contribuindo', link: '/development/contributing' },
          { text: 'Análise com Graphify', link: '/development/graphify-analysis' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/elissonalvesilva/torukr'
      }
    ],

    footer: {
      message: 'Documentação oficial do Torukr',
      copyright: 'Copyright © 2026 Torukr'
    }
  }
})
