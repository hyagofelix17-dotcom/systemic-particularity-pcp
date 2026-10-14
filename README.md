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

### 3. ⚠️ Particularidades Operacionais
Catálogo visual estruturado em cards categorizados:
- 🔒 **Bloqueios de Estoque:** Procedimentos imediatos ao encontrar lotes ou materiais bloqueados.
- ⚙️ **Variações Apontamentos de O.P:** De-para entre código de estrutura e código de empenho real na ordem de produção.
- 📅 **Controle de Produtos Programados - PCP:** Acompanhamento de programações e responsáveis.
- 📦 **Itens a Manter em Estoque/Quantidade e Batelada:** Controle de níveis mínimos em tanques e bateladas.
- 📝 **Particularidades do Processo (Bloco de Notas Integrado):** Bloco de anotações com suporte a pastas, formatação rica (negrito, listas, tabelas, código) e salvamento automático.

### 4. ⚖️ Balanço de Massa
- Importação de dados de produção para apuração de rendimento, perdas e conciliação de consumo de materiais (teórico vs. apontado).

### 5. 🏷️ Identificação de IBC's
- Classificação e controle visual de embalagens industriais intermediárias a granel (IBCs novos, recuperados, semi-novos e dedicados).

### 6. 🔖 Codificação de Produtos
- Guia prático de regras de codificação e máscaras cadastrais.

### 7. 🔔 Central de Lembretes do PCP
- Cadastro de reuniões e follow-ups de produção.
- Separação clara entre **📅 Data (calendário)** e **⏰ Horário**.
- Opção de alerta antecipado (5, 10, 15, 30 minutos ou 1 hora antes).
- **Alerta visual na tela, aviso sonoro e notificações na área de trabalho do Windows/navegador.**

### 8. 🗺️ Mapeamento de Processo
- Visualização e consulta do fluxo completo das etapas produtivas e administrativas do PCP.

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
