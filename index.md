---
layout: home

hero:
  name: Torukr
  text: Orquestração de VPS simplificada
  tagline: Gerencie aplicações, recursos e redes em múltiplos servidores com uma única plataforma — sem complexidade de Kubernetes.
  actions:
    - theme: brand
      text: Começar Agora
      link: /getting-started/overview
    - theme: alt
      text: Ver no GitHub
      link: https://github.com/elissonalvesilva/torukr

features:
  - title: Multi-Node
    details: Distribua workloads entre múltiplos VPS com agendamento automático baseado em roles e labels.
  - title: Network Overlay
    details: Comunicação privada e criptografada entre nodes usando WireGuard + VXLAN, sem expor portas públicas.
  - title: CLI Poderosa
    details: torukrctl oferece comandos familiares (get, describe, apply, delete) para gerenciar todos os recursos.
  - title: Manifests YAML
    details: Declare aplicações, recursos e redes em YAML e aplique com torukrctl apply -f manifest.yaml.
  - title: mTLS Nativo
    details: Comunicação interna criptografada com mutual TLS entre Controller e NodeRuntime.
  - title: API REST
    details: API HTTP completa com autenticação JWT e controle de acesso por roles (RBAC).
---

## O que é o Torukr?

O Torukr é uma plataforma de orquestração para servidores VPS. Ele permite que você gerencie aplicações containerizadas, recursos de infraestrutura (bancos de dados, serviços de suporte) e redes privadas em múltiplos servidores, usando uma interface unificada de API e CLI.

Diferente do Kubernetes, o Torukr foi projetado para ser executado diretamente em VPS convencionais, sem a necessidade de um cluster de alta disponibilidade complexo.

## Início Rápido

```bash
# 1. Instalar torukrctl
go install github.com/elissonalvesilva/torukr/cmd/torukrctl@latest

# 2. Autenticar
torukrctl login --api-url http://seu-servidor:8080/api/v1

# 3. Criar um node
torukrctl node create --name vps-1 --address 10.0.0.10 --role apps

# 4. Fazer deploy de uma aplicação
cat > app.yaml << 'EOF'
apiVersion: platform.torukr.io/v1alpha1
kind: App
metadata:
  name: minha-api
  namespace: default
spec:
  image: nginx:latest
  replicas: 1
EOF

torukrctl apply -f app.yaml

# 5. Verificar status
torukrctl get apps
```

## Componentes Principais

| Componente | Descrição |
|---|---|
| **API Server** | API REST que recebe comandos da CLI e do dashboard |
| **Controller** | Reconcilia o estado desejado com o estado real |
| **NodeRuntime** | Agente que roda em cada node e gerencia containers |
| **torukrctl** | CLI para gerenciar todos os recursos |
| **gencerts** | Utilitário para geração de certificados TLS |

## Próximos Passos

- [Visão Geral da Arquitetura](/concepts/architecture)
- [Guia de Instalação](/getting-started/installation)
- [Tutorial: Criar o Primeiro Node](/tutorials/create-first-node)
- [Referência da CLI](/reference/cli)
- [Referência da API](/reference/api)
