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
2. Para coletar avaliações, inicie o Apache no XAMPP e acesse **http://localhost/TCC-prompts-ia/**. O envio requer PHP com `mbstring` e `iconv`, disponíveis no XAMPP. Abrir o HTML diretamente ou usar GitHub Pages permite apenas visualizar as páginas.
3. Ou navegue diretamente até a pasta da landing page desejada (exemplo: `PROMPTS CLAUDE/PROMPT 1`) e abra o seu `index.html`.


## Coleta de resultados

Ao clicar em **Enviar Avaliação Completa**, as 27 notas dos 9 prompts são validadas e enviadas para `salvar-resultados.php`. Cada envio gera um novo JSON em `resultados/`, contendo nome, resposta sobre Tech/Design, data de recebimento e notas. A confirmação só aparece depois da gravação no servidor. O Apache precisa ter permissão de escrita nessa pasta.

O nome é a única identificação do participante. Os rascunhos no navegador são separados por nome, ignorando maiúsculas e espaços repetidos; nomes iguais são tratados como a mesma pessoa. Ao mudar o nome, as notas daquele nome são carregadas ou um rascunho vazio é iniciado. O campo Tech/Design é apenas uma resposta da pesquisa. Os rascunhos antigos não são importados automaticamente porque não tinham separação por nome.

Os arquivos têm o formato `avaliacao_nome_data_sufixo.json`. Data e sufixo distinguem envios e evitam sobrescrever respostas anteriores, inclusive quando o nome se repete. Os JSONs são ignorados pelo Git e o acesso direto à pasta via Apache é bloqueado pelo `.htaccess`; consulte os arquivos pelo sistema de arquivos do servidor.

## Leitor de resultados

Acesse **http://localhost/TCC-prompts-ia/leitor-resultados.php** para ler os JSONs da pasta `resultados/`. O painel mostra as médias de coerência visual, experiência do usuário (UX) e atratividade estética por LLM, por nível de prompt e por combinação de LLM e prompt, com a quantidade de notas usada em cada cálculo.

Por padrão, somente o envio válido mais recente de cada nome entra nas médias. A opção **Todos os envios** inclui respostas repetidas. Notas ausentes ou inválidas são excluídas do cálculo; arquivos ilegíveis ou sem notas válidas são contabilizados como ignorados. Clique em **Atualizar resultados** para reler os arquivos. O painel exibe dados agregados, sem nomes dos participantes, e é acessado diretamente pelo endereço acima.

Para verificar os cálculos com dados de teste isolados, execute `php tests/resultados.php`.
