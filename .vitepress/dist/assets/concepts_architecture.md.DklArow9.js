import{_ as a,o as n,c as i,a0 as e}from"./chunks/framework.jwovEGr5.js";const E=JSON.parse('{"title":"Arquitetura","description":"","frontmatter":{},"headers":[],"relativePath":"concepts/architecture.md","filePath":"concepts/architecture.md"}'),l={name:"concepts/architecture.md"};function t(p,s,r,o,c,d){return n(),i("div",null,[...s[0]||(s[0]=[e(`<h1 id="arquitetura" tabindex="-1">Arquitetura <a class="header-anchor" href="#arquitetura" aria-label="Permalink to &quot;Arquitetura&quot;">​</a></h1><h2 id="visao-geral" tabindex="-1">Visão Geral <a class="header-anchor" href="#visao-geral" aria-label="Permalink to &quot;Visão Geral&quot;">​</a></h2><p>O Torukr segue uma arquitetura de <strong>control plane + data plane</strong> similar ao Kubernetes, mas simplificada para ambientes de VPS.</p><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart TD</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;Usuário&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        CLI[torukrctl]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Dashboard[Dashboard Web]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;Control Plane&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        API[API Server\\nGin HTTP :8080]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Controller[Controller\\nReconcile Loop]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        DB[(PostgreSQL)]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;Node 1 - VPS&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        NR1[NodeRuntime :9090]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Docker1[Docker Engine]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Containers1[Containers]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;Node 2 - VPS&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        NR2[NodeRuntime :9090]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Docker2[Docker Engine]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        Containers2[Containers]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CLI --&gt;|HTTP + JWT| API</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Dashboard --&gt;|HTTP + JWT| API</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API &lt;--&gt;|PostgreSQL| DB</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API --&gt; Controller</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Controller --&gt;|mTLS gRPC/HTTP| NR1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Controller --&gt;|mTLS gRPC/HTTP| NR2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR1 --&gt; Docker1 --&gt; Containers1</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR2 --&gt; Docker2 --&gt; Containers2</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR1 &lt;--&gt;|WireGuard + VXLAN| NR2</span></span></code></pre></div><h2 id="componentes" tabindex="-1">Componentes <a class="header-anchor" href="#componentes" aria-label="Permalink to &quot;Componentes&quot;">​</a></h2><h3 id="api-server-cmd-apiserver" tabindex="-1">API Server (<code>cmd/apiserver</code>) <a class="header-anchor" href="#api-server-cmd-apiserver" aria-label="Permalink to &quot;API Server (\`cmd/apiserver\`)&quot;">​</a></h3><ul><li>Framework: <strong>Gin</strong> (Go)</li><li>Porta padrão: <code>8080</code></li><li>Autenticação: <strong>JWT</strong></li><li>Persistência: <strong>PostgreSQL</strong> via go-jet ORM</li><li>Middlewares: CORS, rate limiting, logging, request ID, security headers, recovery</li></ul><p>O API Server é o ponto central de entrada. Ele expõe uma API REST completa e armazena o estado de todos os recursos no banco de dados.</p><h3 id="controller-cmd-controller" tabindex="-1">Controller (<code>cmd/controller</code>) <a class="header-anchor" href="#controller-cmd-controller" aria-label="Permalink to &quot;Controller (\`cmd/controller\`)&quot;">​</a></h3><ul><li>Processo de reconciliação contínua</li><li>Monitora o banco via polling/eventos</li><li>Reconciliadores: <code>AppReconciler</code>, <code>ResourceReconciler</code>, <code>NetworkReconciler</code></li><li>Se comunica com NodeRuntimes via <strong>mTLS</strong></li></ul><p>O Controller implementa o padrão de reconciliação: lê o estado desejado do banco e compara com o estado real reportado pelos NodeRuntimes, tomando ações corretivas.</p><h3 id="noderuntime-cmd-noderuntime" tabindex="-1">NodeRuntime (<code>cmd/noderuntime</code>) <a class="header-anchor" href="#noderuntime-cmd-noderuntime" aria-label="Permalink to &quot;NodeRuntime (\`cmd/noderuntime\`)&quot;">​</a></h3><ul><li>Agente que roda em cada VPS</li><li>Porta padrão: <code>9090</code> (HTTPS com mTLS)</li><li>Usa <strong>Docker SDK</strong> para gerenciar containers</li><li>Reporta status de volta ao Controller</li></ul><h3 id="torukrctl-cmd-torukrctl" tabindex="-1">torukrctl (<code>cmd/torukrctl</code>) <a class="header-anchor" href="#torukrctl-cmd-torukrctl" aria-label="Permalink to &quot;torukrctl (\`cmd/torukrctl\`)&quot;">​</a></h3><ul><li>CLI construída com <strong>Cobra</strong></li><li>Armazena configuração e token JWT localmente</li><li>Suporta saída em tabela ou JSON</li></ul><h3 id="gencerts-cmd-gencerts" tabindex="-1">gencerts (<code>cmd/gencerts</code>) <a class="header-anchor" href="#gencerts-cmd-gencerts" aria-label="Permalink to &quot;gencerts (\`cmd/gencerts\`)&quot;">​</a></h3><ul><li>Utilitário standalone para gerar CA, certificado de servidor e certificado de cliente</li><li>Saída: arquivos PEM em diretório configurável</li></ul><h2 id="fluxo-de-criacao-de-uma-app" tabindex="-1">Fluxo de Criação de uma App <a class="header-anchor" href="#fluxo-de-criacao-de-uma-app" aria-label="Permalink to &quot;Fluxo de Criação de uma App&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant CLI as torukrctl</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant API as API Server</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant DB as PostgreSQL</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Ctrl as Controller</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant NR as NodeRuntime</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant Docker as Docker Engine</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CLI-&gt;&gt;API: POST /api/v1/apps</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API-&gt;&gt;DB: INSERT app (phase=Pending)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API--&gt;&gt;CLI: 201 Created</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Ctrl-&gt;&gt;DB: Poll apps WHERE phase=Pending</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Ctrl-&gt;&gt;DB: SELECT nodes WHERE role=apps AND enabled=true</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Ctrl-&gt;&gt;DB: UPDATE app (assignedNodeID=...)</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Ctrl-&gt;&gt;NR: Deploy container</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR-&gt;&gt;Docker: docker run ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Docker--&gt;&gt;NR: container ID</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR--&gt;&gt;Ctrl: OK</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Ctrl-&gt;&gt;DB: PATCH app phase=Running</span></span></code></pre></div><h2 id="fluxo-de-autenticacao" tabindex="-1">Fluxo de Autenticação <a class="header-anchor" href="#fluxo-de-autenticacao" aria-label="Permalink to &quot;Fluxo de Autenticação&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">sequenceDiagram</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant CLI as torukrctl</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant API as API Server</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    participant DB as PostgreSQL</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CLI-&gt;&gt;API: POST /api/v1/auth/login {email, password}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API-&gt;&gt;DB: SELECT user WHERE email=...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    DB--&gt;&gt;API: user record</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API-&gt;&gt;API: bcrypt.CompareHash</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API--&gt;&gt;CLI: {token: &quot;eyJ...&quot;}</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CLI-&gt;&gt;CLI: Salvar token localmente</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    Note over CLI,API: Requisições subsequentes</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CLI-&gt;&gt;API: GET /api/v1/apps\\nAuthorization: Bearer eyJ...</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API-&gt;&gt;API: ValidateJWT</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    API--&gt;&gt;CLI: {data: [...]}</span></span></code></pre></div><h2 id="comunicacao-controller-↔-noderuntime-mtls" tabindex="-1">Comunicação Controller ↔ NodeRuntime (mTLS) <a class="header-anchor" href="#comunicacao-controller-↔-noderuntime-mtls" aria-label="Permalink to &quot;Comunicação Controller ↔ NodeRuntime (mTLS)&quot;">​</a></h2><div class="language-mermaid vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">mermaid</span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">flowchart LR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;Controller&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        C[Controller\\nclient-cert.pem\\nclient-key.pem]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    subgraph &quot;NodeRuntime&quot;</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">        NR[NodeRuntime\\nserver-cert.pem\\nserver-key.pem]</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    end</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CA[ca-cert.pem]</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    C --&gt;|valida com CA| NR</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    NR --&gt;|valida com CA| C</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CA -.-&gt;|assina| C</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8;">    CA -.-&gt;|assina| NR</span></span></code></pre></div><p>Ambos os lados verificam o certificado do outro contra a mesma CA raiz. Isso é <strong>mutual TLS (mTLS)</strong>.</p><h2 id="organizacao-do-codigo" tabindex="-1">Organização do Código <a class="header-anchor" href="#organizacao-do-codigo" aria-label="Permalink to &quot;Organização do Código&quot;">​</a></h2><div class="language- vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang"></span><pre class="shiki shiki-themes github-light github-dark vp-code" tabindex="0"><code><span class="line"><span>torukr/</span></span>
<span class="line"><span>├── cmd/                    # Binários (entrypoints)</span></span>
<span class="line"><span>│   ├── apiserver/         # API HTTP</span></span>
<span class="line"><span>│   ├── controller/        # Loop de reconciliação</span></span>
<span class="line"><span>│   ├── noderuntime/       # Agente do node</span></span>
<span class="line"><span>│   ├── gencerts/          # Gerador de certificados</span></span>
<span class="line"><span>│   └── torukrctl/         # CLI</span></span>
<span class="line"><span>├── internal/              # Código interno (não importável)</span></span>
<span class="line"><span>│   ├── apiserver/         # Handlers HTTP por domínio</span></span>
<span class="line"><span>│   ├── core/              # Domínio e casos de uso</span></span>
<span class="line"><span>│   │   ├── app/           # Lógica de aplicações</span></span>
<span class="line"><span>│   │   ├── resource/      # Lógica de recursos</span></span>
<span class="line"><span>│   │   └── node/          # Lógica de nodes</span></span>
<span class="line"><span>│   ├── controller/        # Reconciliadores</span></span>
<span class="line"><span>│   ├── noderuntime/       # Runtime handler</span></span>
<span class="line"><span>│   ├── infra/             # Infraestrutura</span></span>
<span class="line"><span>│   │   ├── database/      # Repositórios PostgreSQL</span></span>
<span class="line"><span>│   │   └── tls/           # Gerenciamento de TLS</span></span>
<span class="line"><span>│   └── cli/               # Lógica da CLI</span></span>
<span class="line"><span>├── pkg/                   # Pacotes públicos</span></span>
<span class="line"><span>│   ├── conditions/        # Condições de recursos</span></span>
<span class="line"><span>│   └── logger/            # Logger estruturado (zap)</span></span>
<span class="line"><span>└── graphify-out/          # Análise de grafo do código</span></span></code></pre></div><h2 id="proximos-passos" tabindex="-1">Próximos Passos <a class="header-anchor" href="#proximos-passos" aria-label="Permalink to &quot;Próximos Passos&quot;">​</a></h2><ul><li><a href="/concepts/nodes.html">Conceito de Nodes</a></li><li><a href="/concepts/apps.html">Conceito de Apps</a></li><li><a href="/concepts/network-overlay.html">Network Overlay</a></li><li><a href="/concepts/certificates.html">Certificados e mTLS</a></li></ul>`,28)])])}const k=a(l,[["render",t]]);export{E as __pageData,k as default};
