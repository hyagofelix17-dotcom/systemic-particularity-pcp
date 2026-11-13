# 🏭 Systemic Particularity - PCP & Gestão de Materiais

[![Status](https://img.shields.io/badge/Status-Produ%C3%A7%C3%A3o%20Ativa-success.svg)](#)
[![Plataforma](https://img.shields.io/badge/Plataforma-Web%20%7C%20SPA-blue.svg)](#)
[![Tecnologias](https://img.shields.io/badge/Tecnologias-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-orange.svg)](#)
[![Bibliotecas](https://img.shields.io/badge/Bibliotecas-SheetJS%20%7C%20ExcelJS-green.svg)](#)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-purple.svg)](#)

> **Solução completa de Planejamento, Programação e Controle da Produção (PCP) e Gestão Inteligente de Estoques e Matérias-Primas.**

Uma aplicação Web de página única (**Single-Page Application - SPA**), 100% autônoma (*serverless*), ultra-rápida e intuitiva, desenhada para acelerar as rotinas diárias de planejamento, tomada de decisão e resolução de bloqueios operacionais industriais.

---

## 🌟 Principais Módulos do Sistema

### 1. 📊 Consulta de Saldo de Estoque
- **Importação Direta de Excel (.xlsx, .xls) e CSV:** Leitura de relatórios de estoque do ERP com milhares de registros em segundos.
- **Filtros Avançados estilo Excel:** Checklist de valores múltiplos por coluna, operadores matemáticos (`> 0`, `< 100`, `= 0`) e busca global inteligente.
- **Painel de Totais em Tempo Real:** Itens filtrados, saldo físico total, valor financeiro em estoque (R$) e depósitos ativos.
- **🔍 Controle de Zoom Integrado:** Botões interativos de zoom (`➖`, `➕`, `📐 Ajustar 85%`, `↺ 100%`) para encaixar relatórios com muitas colunas em qualquer monitor.

### 2. 🧪 Lista de Matéria-Prima Atualizada
- Acompanhamento dos saldos de insumos e matérias-primas críticas.
- **Integração Inteligente com Estoque:** Botão para consultar em 1 clique o saldo atual e todas as ocorrências de um código de MP na Consulta de Estoque.
- **📌 Mini Cards Fixos:** Permite fixar pequenos painéis com informações de MPs importantes enquanto você navega em outros módulos.

### 3. 🎯 Ponto de Reordem (P.O.R & EOQ) & Inteligência de Lead Time
- **Painel Executivo de Suprimentos:** Indicadores em tempo real de itens abaixo do ponto de reordem (`Order`), itens urgentes sem pedido colocado, itens com risco de atraso no Lead Time, capital investido em estoque e dias médios de cobertura (DDE).
- **Dimensionamento Científico de Estoques:** Cálculo de Estoque de Segurança com Nível de Serviço de 85% ($Z = 1,036$), Ponto de Reordem ponderado por Lead Time e Lote Econômico de Compras (Wilson EOQ) com taxa WACC de 20% a.a.
- **Rastreamento Dinâmico de Pedidos no Sistema:** Campo interativo para informar/vincular se o material já possui Pedido de Compra incluso no sistema Protheus/ERP (Nº Pedido, Data de Emissão, Quantidade e Follow-up).
- **Cálculo Automático de Lead Time & Data de Disponibilidade (ETA):**
  - **Com Pedido:** Projeta a Data Prevista de Disponibilidade ($\text{ETA} = \text{Data do Pedido} + \text{Lead Time}$ em dias).
  - **Sem Pedido:** Projeta a data de chegada caso uma Ordem de Compra seja gerada hoje ($\text{Data Ref} + \text{Lead Time}$).
- **Previsão Analítica de Ruptura (Stockout Date) & Gap de Cobertura:**
  - Calcula a data exata em que o estoque físico atual esgotará com base no consumo diário ($\text{Data Ref} + \text{DDE}$).
  - Compara a Data de Disponibilidade com a Data de Ruptura: identifica se a entrega é segura (folga de dias) ou se há risco crítico de parada de fábrica ($\text{ETA} > \text{Data de Ruptura}$).
- **Diagnóstico Prescritivo PCP / IA:** Classificação automática em tempo real dos SKUs em: `🚨 Comprar Já (Sem Pedido)`, `⚠️ Risco Lead Time`, `🚚 Em Trânsito Seguro`, `⏳ Pedido Atrasado`, `✅ Estoque Seguro` e `⚪ Sem Consumo`.
- **Visão Integrada de Matérias-Primas e Embalagens:** Mais de 570 MPs e 32 embalagens rastreadas com filtros avançados, ordenação dinâmica, chips de criticidade e checklist estilo Excel.
- **Rastreamento de Pedidos de Compras:** Aba dedicada com carteira de pedidos em aberto, dias de atraso e observações do setor de suprimentos.
- **Manual Operacional e Regras Diárias Integradas:** Guia interativo com as regras de cópia/nomenclatura diária no OneDrive (`05 Ponto de Reordem`) e o passo a passo de atualização no ERP TOTVS Protheus (tabelas SB2 e SD4).
- **Importação Diária Inteligente & Exportação Enriquecida:** Suporte a importar planilhas `.xlsm`/`.xlsx` e exportar relatórios Excel contendo todas as novas colunas preditivas com persistência local (`localStorage`).
- **📑 Gerador Executivo de PDF em 1 Clique (IA & PCP Sênior):** Botão inteligente que audita em tempo real os 602 SKUs, identifica os materiais em risco iminente de desabastecimento sem pedido e itens com risco de Lead Time, projeta as quantidades exatas de compra (Lote Econômico EOQ Wilson) e emite instantaneamente um PDF gerencial completo com capa, indicadores, tabelas de ação e protocolos operacionais.

### 4. ⚠️ Particularidades Operacionais
Catálogo visual estruturado em cards categorizados:
- 🔒 **Bloqueios de Estoque:** Procedimentos imediatos ao encontrar lotes ou materiais bloqueados.
- ⚙️ **Variações Apontamentos de O.P:** De-para entre código de estrutura e código de empenho real na ordem de produção.
- 📅 **Controle de Produtos Programados - PCP:** Acompanhamento de programações e responsáveis.
- 📦 **Itens a Manter em Estoque/Quantidade e Batelada:** Controle de níveis mínimos em tanques e bateladas.
- 📝 **Particularidades do Processo (Bloco de Notas Integrado):** Bloco de anotações com suporte a pastas, formatação rica (negrito, listas, tabelas, código) e salvamento automático.

### 5. ⚖️ Balanço de Massa
- Importação de dados de produção para apuração de rendimento, perdas e conciliação de consumo de materiais (teórico vs. apontado).

### 6. 🏷️ Identificação de IBC's
- Classificação e controle visual de embalagens industriais intermediárias a granel (IBCs novos, recuperados, semi-novos e dedicados).

### 7. 🔖 Codificação de Produtos
- Guia prático de regras de codificação e máscaras cadastrais.

### 8. 🔔 Central de Lembretes do PCP
- Cadastro de reuniões e follow-ups de produção.
- Separação clara entre **📅 Data (calendário)** e **⏰ Horário**.
- Opção de alerta antecipado (5, 10, 15, 30 minutos ou 1 hora antes).
- **Alerta visual na tela, aviso sonoro e notificações na área de trabalho do Windows/navegador.**

### 9. 🗺️ Mapeamento de Processo
- Visualização e consulta do fluxo completo das etapas produtivas e administrativas do PCP.

### 10. 📊 Visualização de Dados (AI Dashboards & Inteligência Visual)
- **Top 10 Itens no Armazém 01 por SLD.ATU:** Ranking visual dos maiores volumes de estoque considerando matérias-primas e insumos com código inicial `01....`.
- **Gráficos Executivos:** Gráfico de barras horizontais/verticais interativo com gradientes modernos e gráfico Donut de curva de concentração (Pareto / Curva ABC).
- **🤖 Diagnóstico Inteligente AI Insights:** Análise heurística automatizada em tempo real com identificação de SKU líder, grau de dispersão e recomendações táticas para o PCP.
- **Tabela com Ação Rápida:** Ranking com medalhas (🥇, 🥈, 🥉), barras visuais de proporção, percentuais de representatividade e atalho direto para consulta detalhada no estoque.
- **Exportação e Impressão:** Download do gráfico em imagem PNG de alta resolução e modo de impressão executivo.

### 11. 📁 Projetos (Gestão de Pedidos & Matérias-Primas PG Química)
- **Gestão Operacional de Pedidos de MPs:** Acompanhamento interativo de matérias-primas nacionais e importadas, status de entrega e dias de atraso.
- **Identidade Corporativa Premium PG Química:** Design corporativo moderno, tipografia Inter e JetBrains Mono, padrão Staff Design.
- **Cores Oficiais da Planilha na Fonte:** Cores dos pedidos integradas diretamente à tipografia (sem poluir o fundo da tabela) com suporte a paleta personalizada e filtro estilo Excel por cor da fonte.
- **Descrição Completa sem Cortes:** Text wrap inteligente que se expande automaticamente para exibir 100% da descrição de qualquer matéria-prima.
- **Dashboard Executivo Integrado:** KPIs em tempo real, gráfico horizontal de Top 10 matérias-primas com maior atraso e gráfico Donut de distribuição de status.
- **Acesso Integrado ou Standalone:** Pode ser acessado diretamente pela nova aba **"📁 Projetos"** no sistema ou de forma autônoma pelo arquivo `pedidos-mp.html`.

---

## 🔒 Privacidade & Arquitetura Local-First (Segurança de Dados)

- **Zero Dependência de Servidores:** O processamento ocorre 100% no navegador do usuário (*Client-Side*).
- **Privacidade Total:** Os dados de estoque, produções e relatórios não são enviados para nenhum servidor externo.
- **Persistência Segura:** Configurações, notas, lembretes e relatórios são salvos no armazenamento local do navegador (`localStorage`), ficando disponíveis mesmo se fechar a janela ou reiniciar a máquina.

---

## 🚀 Como Disponibilizar via GitHub Pages (Acesso via Link Público Grátis)

Você pode hospedar este projeto no **GitHub Pages** para que qualquer pessoa do seu time possa acessar direto pelo navegador, sem precisar instalar nada:

1. Suba este repositório para a sua conta no GitHub (ex: `https://github.com/SEU-USUARIO/Systemic-Particularity-PCP`).
2. No repositório, clique na aba **Settings** (Configurações).
3. No menu lateral esquerdo, clique em **Pages**.
4. Em **Build and deployment** > **Branch**:
   - Selecione a branch `main` (ou `master`).
   - Mantenha a pasta `/ (root)`.
   - Clique em **Save**.
5. Em cerca de 1 minuto, o GitHub gerará um link público seguro (HTTPS):
   `https://SEU-USUARIO.github.io/Systemic-Particularity-PCP/`
6. Basta compartilhar esse link com a equipe!

---

## 💻 Uso Offline / Local

Você também pode usar o sistema offline:
1. Faça o download ou clone do repositório.
2. Dê dois cliques no arquivo `index.html`.
3. O sistema abrirá imediatamente em qualquer navegador moderno (Google Chrome, Microsoft Edge, Firefox, Brave).

---

## 📄 Licença

Distribuído sob a licença **MIT**. Veja o arquivo `LICENSE` para mais detalhes.

---

*Desenvolvido com foco em alta produtividade, simplicidade e precisão operacional para o PCP.*
