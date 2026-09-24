# Trabalho de Conclusão de Curso (TCC) - Comparativo de Prompts de IA

Este repositório reúne os códigos de landing pages desenvolvidos e avaliados durante o Trabalho de Conclusão de Curso (TCC). O objetivo do estudo é comparar o desempenho de diferentes modelos de Linguagem (LLMs) na geração de interfaces web baseadas em três níveis/variações de prompts.

---

## 🌐 Hub de Visualização Rápida (index.html)

Para facilitar a navegação e comparação entre os modelos, o repositório conta com um **Hub/Dashboard Interativo (`index.html`)** na raiz do projeto.

- **GitHub Pages / Visualização Online**: Ao publicar via GitHub Pages, basta acessar o link principal do repositório para visualizar todas as 9 páginas em um único painel.
- **Prévia Integrada**: É possível alternar entre previsualizações em modal (Desktop, Tablet e Mobile) ou abrir qualquer landing page em uma nova aba com 1 clique.

---

## 📁 Estrutura do Repositório

```text
.
├── index.html            # Hub/Dashboard interativo de navegação rápida
├── PROMPTS CLAUDE/
│   ├── PROMPT 1/         # Interface gerada com Prompt 1 (Básico)
│   ├── PROMPT 2/         # Interface gerada com Prompt 2 (Intermediário)
│   └── PROMPT 3/         # Interface gerada com Prompt 3 (Avançado)
│
├── PROMPTS GEMINI/
│   ├── PROMPT 1/         # Interface gerada com Prompt 1 (Básico)
│   ├── PROMPT 2/         # Interface gerada com Prompt 2 (Intermediário)
│   └── PROMPT 3/         # Interface gerada com Prompt 3 (Avançado)
│
└── PROMPTS GPT-OSS/
    ├── PROMPT 1/         # Interface gerada com Prompt 1 (Básico)
    ├── PROMPT 2/         # Interface gerada com Prompt 2 (Intermediário)
    └── PROMPT 3/         # Interface gerada com Prompt 3 (Avançado)
```

---

## 🤖 Modelos Avaliados

1. **Claude (Anthropic)**: Testes de geração de código front-end utilizando modelos da família Anthropic Claude.
2. **Gemini (Google)**: Testes de geração utilizando modelos da família Google Gemini.
3. **GPT-OSS**: Testes utilizando o modelo open-source GPT-OSS.

---

## 🛠️ Tecnologias Utilizadas

- **HTML5** (Estruturação semântica)
- **CSS3** (Estilização Vanilla e Responsiva com Variáveis CSS)
- **JavaScript** (Interatividade, Filtros e Modal de Prévia)

---

## 🚀 Como Executar Localmente

Como as landing pages foram desenvolvidas utilizando HTML, CSS e JS nativos:

1. Clone este repositório:
   ```bash
   git clone https://github.com/AlexiaGeschwind/TCC-prompts-ia.git
   ```
2. Abra o arquivo **`index.html`** na raiz do projeto no seu navegador web para navegar por todas as páginas através do Hub Interativo.
3. Ou navegue diretamente até a pasta da landing page desejada (exemplo: `PROMPTS CLAUDE/PROMPT 1`) e abra o seu `index.html`.
