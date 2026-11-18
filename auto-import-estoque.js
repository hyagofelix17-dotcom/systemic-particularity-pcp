/**
 * 🔄 Auto-Import Estoque — Servidor local para importação automática
 * 
 * Este script:
 * 1. Monitora a pasta de relatórios Excel de saldo de estoque
 * 2. Processa o arquivo .xlsx mais recente
 * 3. Serve os dados processados via HTTP local (porta 3847)
 * 4. A aplicação PCP consulta este servidor automaticamente a cada 30 minutos
 * 
 * Uso: node auto-import-estoque.js
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const XLSX = require('./node_modules/xlsx');

// ══════════════════════════════════════════════
// CONFIGURAÇÃO
// ══════════════════════════════════════════════
const EXCEL_DIR = String.raw`C:\Users\hyago.oliveira\OneDrive - Grupo PQ\Arquivos de Claudio Lopes - PCP - PG Quimica\02 Controle de estoque\Saldo estoque diário\2026\Saldo Atual - PG`;
const PORT = 3847;
const CHECK_INTERVAL_MS = 30 * 60 * 1000; // 30 minutos

let lastProcessedFile = null;
let lastProcessedData = null;
let lastProcessedTime = null;

// ══════════════════════════════════════════════
// ENCONTRAR O EXCEL MAIS RECENTE
// ══════════════════════════════════════════════
function findLatestExcel() {
  try {
    const files = fs.readdirSync(EXCEL_DIR)
      .filter(f => /\.xlsx$/i.test(f))
      .map(f => ({
        name: f,
        fullPath: path.join(EXCEL_DIR, f),
        mtime: fs.statSync(path.join(EXCEL_DIR, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime);

    return files.length > 0 ? files[0] : null;
  } catch (err) {
    console.error('❌ Erro ao listar pasta:', err.message);
    return null;
  }
}

// ══════════════════════════════════════════════
// PROCESSAR O EXCEL (mesma lógica do index.html)
// ══════════════════════════════════════════════
function processExcel(filePath, fileName) {
  try {
    const wb = XLSX.readFile(filePath);
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });

    if (!matrix || !matrix.length) {
      console.error('❌ Arquivo vazio.');
      return null;
    }

    // Encontrar linha de cabeçalho (mesma lógica do processStockRawMatrix)
    let headerIdx = -1;
    for (let i = 0; i < Math.min(10, matrix.length); i++) {
      const validCells = matrix[i].filter(c => c !== undefined && c !== null && String(c).trim().length > 0);
      if (validCells.length >= 2) {
        headerIdx = i;
        break;
      }
    }

    if (headerIdx === -1) {
      console.error('❌ Cabeçalho não encontrado.');
      return null;
    }

    // Processar headers
    const rawHeaders = matrix[headerIdx].map((h, i) =>
      (h !== undefined && h !== null && String(h).trim().length > 0) ? String(h).trim() : `Coluna ${i + 1}`
    );
    let lastNonEmptyCol = rawHeaders.length - 1;
    while (lastNonEmptyCol >= 0 && rawHeaders[lastNonEmptyCol].startsWith('Coluna ')) {
      lastNonEmptyCol--;
    }
    const headers = rawHeaders.slice(0, lastNonEmptyCol + 1);

    // Processar linhas
    const rows = [];
    for (let r = headerIdx + 1; r < matrix.length; r++) {
      const rowRaw = matrix[r];
      if (!rowRaw || !rowRaw.length) continue;
      const hasData = rowRaw.some(c => c !== undefined && c !== null && String(c).trim().length > 0);
      if (!hasData) continue;

      const rowObj = {};
      for (let c = 0; c < headers.length; c++) {
        rowObj[headers[c]] = (rowRaw[c] !== undefined && rowRaw[c] !== null) ? String(rowRaw[c]).trim() : '';
      }
      rows.push(rowObj);
    }

    if (!rows.length) {
      console.error('❌ Nenhuma linha de dados encontrada.');
      return null;
    }

    // Detectar colunas (mesma lógica do index.html)
    const codeCol = headers.find(h => /c[oó]d|material|produto|item/i.test(h)) || headers[0];
    const descCol = headers.find(h => /desc|nome|denomin/i.test(h)) || (headers[1] || headers[0]);

    const hasSaldoAtual = headers.find(h => /^saldo\s*atual/i.test(h.trim()));
    const hasSldAtu = headers.find(h => /^sld\.?\s*atu/i.test(h.trim()));
    const hasValor = headers.find(h => /^(valor|vlr|val)\b/i.test(h.trim()) || /valor\s*total/i.test(h.trim()));

    let qtyCol = null;
    let valCol = null;

    if (hasSaldoAtual && hasSldAtu) {
      qtyCol = hasSaldoAtual;
      valCol = hasSldAtu;
    } else if (hasSldAtu && hasValor) {
      qtyCol = hasSldAtu;
      valCol = hasValor;
    } else if (hasSaldoAtual) {
      qtyCol = hasSaldoAtual;
      valCol = headers.find(h => /valor|custo\s*total|vlr/i.test(h)) || (headers.length >= 7 && headers[6] ? headers[6] : null);
    } else {
      qtyCol = headers.find(h => /quant|qtd|estoque|atual|f[ií]sico/i.test(h)) || (headers.length >= 5 && headers[4] ? headers[4] : null);
      valCol = hasSldAtu || headers.find(h => /valor|custo\s*total|vlr/i.test(h)) || (headers.length >= 7 && headers[6] ? headers[6] : null);
    }

    if (!qtyCol && headers.length >= 5) qtyCol = headers[4];
    if (!valCol && headers.length >= 7) valCol = headers[6];

    const costCol = headers.find(h => /c\.?\s*unit|custo\s*unit|vl\.?\s*unit|valor\s*unit|custo\s*m[eé]dio|b2_cm1/i.test(h)) || headers.find(h => /^custo/i.test(h)) || null;
    const locCol = headers.find(h => /local|almox|dep[oó]sito|armaz[eê]m|tanque/i.test(h)) || null;
    let unCol = headers.find(h => /^(um|un|unid|unidade|medida|b1_um)$/i.test(h.trim()) && !/custo|cost|unit\b|unit[aá]rio|valor|pre[çc]o/i.test(h)) ||
      headers.find(h => /\b(unidade|medida)\b/i.test(h) && !/custo|cost|unit\b|valor/i.test(h)) ||
      null;
    if (unCol && costCol && unCol === costCol) {
      unCol = null;
    }

    const nowStr = new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const result = {
      fileName: fileName || 'Relatório de Estoque',
      importedAt: nowStr,
      autoImported: true,
      headers,
      rows,
      codeCol,
      descCol,
      qtyCol,
      valCol,
      costCol,
      locCol,
      unCol
    };

    console.log(`✅ Processado: ${fileName}`);
    console.log(`   📊 ${rows.length.toLocaleString('pt-BR')} itens | Headers: [${headers.join(', ')}]`);
    console.log(`   🔑 Colunas: Código=${codeCol}, Desc=${descCol}, Qtd=${qtyCol}, Valor=${valCol}`);

    return result;

  } catch (err) {
    console.error('❌ Erro ao processar Excel:', err.message);
    return null;
  }
}

// ══════════════════════════════════════════════
// VERIFICAR E PROCESSAR NOVO ARQUIVO
// ══════════════════════════════════════════════
function checkAndProcess() {
  const latest = findLatestExcel();
  if (!latest) {
    console.log(`⏳ [${new Date().toLocaleTimeString('pt-BR')}] Nenhum arquivo .xlsx encontrado na pasta.`);
    return;
  }

  if (lastProcessedFile === latest.name && lastProcessedTime) {
    // Verifica se o arquivo foi modificado desde o último processamento
    if (latest.mtime <= lastProcessedTime) {
      console.log(`⏳ [${new Date().toLocaleTimeString('pt-BR')}] Arquivo mais recente não mudou: ${latest.name}`);
      return;
    }
  }

  console.log(`\n🔄 [${new Date().toLocaleTimeString('pt-BR')}] Processando novo arquivo: ${latest.name}`);
  const data = processExcel(latest.fullPath, latest.name);

  if (data) {
    lastProcessedFile = latest.name;
    lastProcessedData = data;
    lastProcessedTime = new Date();
    console.log(`✅ Dados prontos para a aplicação PCP consumir.`);
  }
}

// ══════════════════════════════════════════════
// SERVIDOR HTTP LOCAL
// ══════════════════════════════════════════════
const server = http.createServer((req, res) => {
  // CORS para a aplicação acessar
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.url === '/stock-data' || req.url === '/stock-data/') {
    if (lastProcessedData) {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'ok',
        file: lastProcessedFile,
        processedAt: lastProcessedTime?.toISOString(),
        data: lastProcessedData
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'no_data', message: 'Nenhum relatório processado ainda.' }));
    }
    return;
  }

  if (req.url === '/status' || req.url === '/status/') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'running',
      lastFile: lastProcessedFile,
      lastProcessedAt: lastProcessedTime?.toISOString(),
      itemCount: lastProcessedData?.rows?.length || 0,
      checkIntervalMin: CHECK_INTERVAL_MS / 60000,
      excelDir: EXCEL_DIR
    }));
    return;
  }

  if (req.url === '/refresh' || req.url === '/refresh/') {
    console.log(`\n🔃 [${new Date().toLocaleTimeString('pt-BR')}] Refresh manual solicitado.`);
    lastProcessedFile = null; // Força reprocessamento
    checkAndProcess();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'refreshed',
      file: lastProcessedFile,
      itemCount: lastProcessedData?.rows?.length || 0
    }));
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// ══════════════════════════════════════════════
// INICIALIZAÇÃO
// ══════════════════════════════════════════════
server.listen(PORT, () => {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('  🔄 Auto-Import Estoque — Servidor Ativo');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  📂 Pasta monitorada: ${EXCEL_DIR}`);
  console.log(`  🌐 Servidor local: http://localhost:${PORT}`);
  console.log(`  ⏱️  Intervalo de verificação: ${CHECK_INTERVAL_MS / 60000} minutos`);
  console.log(`  📡 Endpoints:`);
  console.log(`     GET /stock-data  → Dados processados (JSON)`);
  console.log(`     GET /status      → Status do servidor`);
  console.log(`     GET /refresh     → Forçar reprocessamento`);
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');

  // Processar imediatamente na inicialização
  checkAndProcess();

  // Agendar verificação periódica
  setInterval(checkAndProcess, CHECK_INTERVAL_MS);
});
