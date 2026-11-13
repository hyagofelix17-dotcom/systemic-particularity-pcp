const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

console.log('Original length:', html.length);

// 1. In ensureReordemItemMetadata, ensure item.controladoPcp has a default
if (!html.includes('if (item.controladoPcp === undefined) item.controladoPcp = \'sim\';')) {
  html = html.replace(
    'if (item._metaResolved) return;',
    'if (item.controladoPcp === undefined) item.controladoPcp = \'sim\';\n  if (item._metaResolved) return;'
  );
  console.log('1. Added default controladoPcp to ensureReordemItemMetadata');
}

// 2. In colTitles in openExcelFilterPopover, add controladoPcp
if (!html.includes("'controladoPcp': 'Controlado a Compra por PCP?'")) {
  html = html.replace(
    "'codigo': 'Código Protheus',",
    "'codigo': 'Código Protheus',\n    'controladoPcp': 'Controlado a Compra por PCP?',"
  );
  console.log('2. Added controladoPcp to colTitles');
}

// 3. In getReordemColValue, return 'Sim' or 'Não'
if (!html.includes("if (colName === 'controladoPcp') {")) {
  html = html.replace(
    "if (colName === 'codigo') {",
    "if (colName === 'controladoPcp') {\n    return (r.controladoPcp !== 'nao') ? 'Sim' : 'Não';\n  }\n  if (colName === 'codigo') {"
  );
  console.log('3. Added colName === controladoPcp in getReordemColValue');
}

// 4. In reordemFilterState, add controladoPcp: 'sim'
if (!html.includes("controladoPcp: 'sim',")) {
  html = html.replace(
    "flag: 'all', // 'all', 'order', 'com_pedido', 'manual', 'normal', 'sc', 'zerado'",
    "flag: 'all', // 'all', 'order', 'com_pedido', 'manual', 'normal', 'sc', 'zerado'\n  controladoPcp: 'sim', // 'sim' (Apenas Controlados PCP), 'todos' (Geral), 'nao' (Apenas Não Controlados)"
  );
  console.log('4. Added controladoPcp to reordemFilterState');
}

// 5. In toggleMaterialPcpControl, update matches and sync with pedidosAbertos
const oldToggleMaterial = `function toggleMaterialPcpControl(desc, forceVal) {
  if (!REORDEM_DATA) return;
  const norm = String(desc || '').trim().toLowerCase();
  const allList = [...(REORDEM_DATA.mp || []), ...(REORDEM_DATA.embalagens || [])];
  const item = allList.find(it => String(it.descricao || '').trim().toLowerCase() === norm);
  if (!item) return;
  const currentVal = item.controladoPcp !== 'nao' ? 'sim' : 'nao';
  const nextVal = forceVal ? forceVal : (currentVal === 'sim' ? 'nao' : 'sim');
  item.controladoPcp = nextVal;

  try {
    localStorage.setItem('pcp_reordem_report', JSON.stringify(REORDEM_DATA));
  } catch (err) {
    console.warn('Erro ao salvar item no localStorage:', err);
  }

  if (nextVal === 'nao') {
    if (typeof showToast === 'function') {
      showToast('Material ' + item.descricao + ' desmarcado do controle PCP.');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('Material ' + item.descricao + ' marcado como CONTROLADO POR PCP!');
    }
  }

  renderReordemView();
}`;

const newToggleMaterial = `function toggleMaterialPcpControl(desc, forceVal) {
  if (!REORDEM_DATA) return;
  const norm = String(desc || '').trim().toLowerCase();
  const allList = [...(REORDEM_DATA.mp || []), ...(REORDEM_DATA.embalagens || [])];
  const matches = allList.filter(it => String(it.descricao || '').trim().toLowerCase() === norm);
  if (matches.length === 0) return;
  const currentVal = matches[0].controladoPcp !== 'nao' ? 'sim' : 'nao';
  const nextVal = forceVal ? forceVal : (currentVal === 'sim' ? 'nao' : 'sim');
  
  matches.forEach(it => {
    it.controladoPcp = nextVal;
  });

  // Sincroniza também nos pedidos em aberto do mesmo material
  if (REORDEM_DATA.pedidosAbertos) {
    REORDEM_DATA.pedidosAbertos.filter(p => String(p.material || '').trim().toLowerCase() === norm).forEach(p => {
      p.controladoPcp = nextVal;
    });
  }

  try {
    localStorage.setItem('pcp_reordem_report', JSON.stringify(REORDEM_DATA));
  } catch (err) {
    console.warn('Erro ao salvar item no localStorage:', err);
  }

  if (nextVal === 'nao') {
    if (typeof showToast === 'function') {
      showToast('Material ' + matches[0].descricao + ' desmarcado do PCP e transferido para a aba Geral.');
    }
  } else {
    if (typeof showToast === 'function') {
      showToast('Material ' + matches[0].descricao + ' reativado no Controle de Compras do PCP!');
    }
  }

  renderReordemView();
}

function setReordemControladoPcpFilter(val) {
  reordemFilterState.controladoPcp = val || 'sim';
  reordemFilterState.page = 1;
  renderReordemView();
}`;

if (html.includes('function toggleMaterialPcpControl(desc, forceVal) {')) {
  html = html.replace(oldToggleMaterial, newToggleMaterial);
  console.log('5. Upgraded toggleMaterialPcpControl and added setReordemControladoPcpFilter');
}

// 6. In setReordemActiveTab, configure controladoPcp defaults
if (html.includes("reordemFilterState.armazem = 'ALL';") && !html.includes("reordemFilterState.controladoPcp = 'todos';")) {
  html = html.replace(
    "reordemFilterState.armazem = 'ALL';\n    reordemFilterState.codigoPrefix = '';",
    "reordemFilterState.armazem = 'ALL';\n    reordemFilterState.codigoPrefix = '';\n    reordemFilterState.controladoPcp = 'todos';"
  );
  html = html.replace(
    "reordemFilterState.armazem = '01';\n    reordemFilterState.codigoPrefix = '01';",
    "reordemFilterState.armazem = '01';\n    reordemFilterState.codigoPrefix = '01';\n    reordemFilterState.controladoPcp = 'sim';"
  );
  html = html.replace(
    "reordemFilterState.armazem = '02';\n    reordemFilterState.codigoPrefix = '02';",
    "reordemFilterState.armazem = '02';\n    reordemFilterState.codigoPrefix = '02';\n    reordemFilterState.controladoPcp = 'sim';"
  );
  console.log('6. Updated setReordemActiveTab for controladoPcp');
}

// 7. In clearAllReordemFilters
if (!html.includes("reordemFilterState.controladoPcp = (reordemActiveTab === 'all' ? 'todos' : 'sim');")) {
  html = html.replace(
    "reordemFilterState.flag = 'all';",
    "reordemFilterState.flag = 'all';\n  reordemFilterState.controladoPcp = (reordemActiveTab === 'all' ? 'todos' : 'sim');"
  );
  console.log('7. Updated clearAllReordemFilters');
}

// 8. In reordemColumns, add controladoPcp
if (!html.includes("{ id: 'controladoPcp', label: 'Controlado PCP?'")) {
  html = html.replace(
    "{ id: 'descricao', label: 'Material / Insumo', minWidth: '270px', align: 'left', placeholder: 'Filtrar produto...' },",
    "{ id: 'descricao', label: 'Material / Insumo', minWidth: '270px', align: 'left', placeholder: 'Filtrar produto...' },\n    { id: 'controladoPcp', label: 'Controlado PCP?', minWidth: '135px', align: 'center', placeholder: 'Sim, Não...' },"
  );
  console.log('8. Added controladoPcp to reordemColumns');
}

// 9. In renderReordemView, add countCtrlSim and countCtrlNao
if (!html.includes('let countCtrlSim = 0;')) {
  html = html.replace(
    'let countZero = 0;',
    'let countZero = 0;\n  let countCtrlSim = 0;\n  let countCtrlNao = 0;'
  );
  html = html.replace(
    'if (intel.temPedido) countComPedido++;',
    'if (r.controladoPcp !== \'nao\') countCtrlSim++;\n      else countCtrlNao++;\n      if (intel.temPedido) countComPedido++;'
  );
  console.log('9. Added counts for countCtrlSim and countCtrlNao');
}

// 10. In renderReordemView filtering, filter by controladoPcp
if (!html.includes('const ctrlPcpFilter = reordemFilterState.controladoPcp')) {
  const oldFilterStart = `  // Filtragem
  const term = (reordemFilterState.q || '').trim().toLowerCase();
  let filtered = rawItems.filter(item => {`;

  const newFilterStart = `  // Filtragem
  const term = (reordemFilterState.q || '').trim().toLowerCase();
  const ctrlPcpFilter = reordemFilterState.controladoPcp || (isAll ? 'todos' : 'sim');
  const hasColCtrlFilter = Boolean(
    (reordemFilterState.colFilters && reordemFilterState.colFilters.controladoPcp) || 
    (reordemFilterState.colMultiFilters && reordemFilterState.colMultiFilters.controladoPcp && reordemFilterState.colMultiFilters.controladoPcp.length > 0)
  );

  let filtered = rawItems.filter(item => {
    // Filtro Controle de Compra PCP (Sim / Não / Geral)
    if (!hasColCtrlFilter) {
      if (ctrlPcpFilter === 'sim' && item.controladoPcp === 'nao') return false;
      if (ctrlPcpFilter === 'nao' && item.controladoPcp !== 'nao') return false;
    }`;

  html = html.replace(oldFilterStart, newFilterStart);
  console.log('10. Added row filtering by controladoPcp');
}

// 11. In renderReordemView sorting, add sorting for controladoPcp
if (!html.includes("if (col === 'controladoPcp') {")) {
  html = html.replace(
    "if (col === 'temPedido') {",
    "if (col === 'controladoPcp') {\n        const vA = a.controladoPcp === 'nao' ? 'Nao' : 'Sim';\n        const vB = b.controladoPcp === 'nao' ? 'Nao' : 'Sim';\n        return vA.localeCompare(vB) * dir;\n      }\n      if (col === 'temPedido') {"
  );
  console.log('11. Added sort handling for controladoPcp');
}

// 12. In renderReordemView controls bar, add Controle PCP selector
const oldCtrlGroup = `<span class="dash-ctrl-label" style="margin-left:8px;">Prefixo do Código:</span>
            <div style="display:inline-flex;align-items:center;position:relative;">
              <input type="text" class="dash-input" style="width:85px;padding-right:20px;font-weight:700;" id="reordem-inp-prefix" value="\${esc(reordemFilterState.codigoPrefix || '')}" oninput="reordemOnPrefixInput(this.value)" onchange="reordemSetPrefix(this.value)" placeholder="Todos">
              \${reordemFilterState.codigoPrefix ? \`<span onclick=\"reordemClearPrefix()\" style=\"position:absolute;right:6px;cursor:pointer;color:var(--mu);font-size:12px;font-weight:700;line-height:1;\" title=\"Limpar prefixo (mostrar todos)\">✕</span>\` : ''}
            </div>
          </div>`;

const newCtrlGroup = `<span class="dash-ctrl-label" style="margin-left:8px;">Prefixo do Código:</span>
            <div style="display:inline-flex;align-items:center;position:relative;">
              <input type="text" class="dash-input" style="width:85px;padding-right:20px;font-weight:700;" id="reordem-inp-prefix" value="\${esc(reordemFilterState.codigoPrefix || '')}" oninput="reordemOnPrefixInput(this.value)" onchange="reordemSetPrefix(this.value)" placeholder="Todos">
              \${reordemFilterState.codigoPrefix ? \`<span onclick=\"reordemClearPrefix()\" style=\"position:absolute;right:6px;cursor:pointer;color:var(--mu);font-size:12px;font-weight:700;line-height:1;\" title=\"Limpar prefixo (mostrar todos)\">✕</span>\` : ''}
            </div>

            <span class="dash-ctrl-label" style="margin-left:12px;">Controle PCP:</span>
            <select class="dash-select" id="reordem-sel-ctrl-pcp" onchange="setReordemControladoPcpFilter(this.value)" style="font-weight:700;">
              <option value="sim" \${reordemFilterState.controladoPcp==='sim'?'selected':''}>🎯 Apenas Controlados PCP (Sim)</option>
              <option value="todos" \${reordemFilterState.controladoPcp==='todos'?'selected':''}>🏢 Geral / Todos os Materiais</option>
              <option value="nao" \${reordemFilterState.controladoPcp==='nao'?'selected':''}>⚪ Apenas Não Controlados (Não)</option>
            </select>
          </div>`;

if (html.includes(oldCtrlGroup)) {
  html = html.replace(oldCtrlGroup, newCtrlGroup);
  console.log('12. Added Controle PCP dropdown to dash-controls-bar');
}

// 13. In reordem-chips, add quick filter chips for Controlados PCP, Geral, and Não Controlados
const oldChipsStart = `<div class="reordem-chips" style="flex-wrap:wrap;gap:6px;">
            <button class="rchip \${reordemFilterState.flag==='all'?'on':''}" onclick="setReordemFlagFilter('all')">Todos (\${rawItems.length})</button>`;

const newChipsStart = `<div class="reordem-chips" style="flex-wrap:wrap;gap:6px;">
            <button class="rchip \${reordemFilterState.controladoPcp==='sim' && reordemFilterState.flag==='all'?'on':''}" style="\${reordemFilterState.controladoPcp==='sim'?'background:#16a34a;color:#fff;font-weight:700;':''}" onclick="setReordemControladoPcpFilter('sim')" title="Exibir apenas materiais sob controle ativo do PCP">🎯 Controlados PCP (\${countCtrlSim})</button>
            <button class="rchip \${reordemFilterState.controladoPcp==='todos' && reordemFilterState.flag==='all'?'on':''}" onclick="setReordemControladoPcpFilter('todos')" title="Exibir todos os materiais da carteira geral">🏢 Geral / Todos (\${rawItems.length})</button>
            \${countCtrlNao > 0 ? \`<button class="rchip \${reordemFilterState.controladoPcp==='nao'?'on':''}" style="\${reordemFilterState.controladoPcp==='nao'?'background:#dc2626;color:#fff;font-weight:700;':''}" onclick="setReordemControladoPcpFilter('nao')" title="Exibir materiais desmarcados do PCP (fora do controle)">⚪ Não Controlados (\${countCtrlNao})</button>\` : ''}
            <span style="display:inline-block;width:1px;height:18px;background:var(--bd);margin:0 4px;vertical-align:middle;"></span>
            <button class="rchip \${reordemFilterState.flag==='all' && reordemFilterState.controladoPcp!=='sim' && reordemFilterState.controladoPcp!=='todos'?'on':''}" onclick="setReordemFlagFilter('all')">Todos Status (\${rawItems.length})</button>`;

if (html.includes(oldChipsStart)) {
  html = html.replace(oldChipsStart, newChipsStart);
  console.log('13. Added chips for Controlados PCP / Geral / Não Controlados');
}

// 14. In table body row (pageRows.map), add the cell for controladoPcp right after Material/Insumo cell
const oldRowMaterialEnd = `                        <button class="btn outline" style="padding:1px 5px;font-size:10px;" onclick="copyReordemText('\${esc(r.descricao).replace(/'/g, "\\\\'")}')" title="Copiar descrição">📋</button>
                      </div>
                    </div>
                  </td>
                  <td style="text-align:right;font-weight:700;\${r.saldo <= 0 ? 'color:#b91c1c;':''}">\${sldFmt}</td>`;

const newRowMaterialEnd = `                        <button class="btn outline" style="padding:1px 5px;font-size:10px;" onclick="copyReordemText('\${esc(r.descricao).replace(/'/g, "\\\\'")}')" title="Copiar descrição">📋</button>
                      </div>
                    </div>
                  </td>
                  <td style="text-align:center;white-space:nowrap;">
                    \${r.controladoPcp !== 'nao' ? \`
                      <div style="display:inline-flex;align-items:center;background:rgba(21,128,61,0.08);border:1px solid #16a34a;border-radius:18px;padding:2px 4px;gap:3px;" title="Material controlado pelo PCP. Clique em 'Não' para desmarcar e transferir para o Geral.">
                        <span style="padding:2px 7px;font-size:11px;font-weight:700;background:#16a34a;color:#fff;border-radius:12px;">✓ Sim</span>
                        <button type="button" class="btn" style="padding:2px 6px;font-size:11px;font-weight:600;background:transparent;color:var(--mu);border-radius:12px;border:none;cursor:pointer;" onclick="toggleMaterialPcpControl('\${esc(r.descricao).replace(/'/g, "\\\\'")}', 'nao')" title="Desmarcar do PCP (mover para Geral)">✕ Não</button>
                      </div>
                    \` : \`
                      <div style="display:inline-flex;align-items:center;background:rgba(220,38,38,0.08);border:1px solid #dc2626;border-radius:18px;padding:2px 4px;gap:3px;" title="Material fora do controle do PCP (Geral). Clique em 'Sim' para incluir no controle PCP.">
                        <button type="button" class="btn" style="padding:2px 6px;font-size:11px;font-weight:600;background:transparent;color:var(--mu);border-radius:12px;border:none;cursor:pointer;" onclick="toggleMaterialPcpControl('\${esc(r.descricao).replace(/'/g, "\\\\'")}', 'sim')" title="Reativar controle pelo PCP">✓ Sim</button>
                        <span style="padding:2px 7px;font-size:11px;font-weight:700;background:#dc2626;color:#fff;border-radius:12px;">✕ Não</span>
                      </div>
                    \`}
                  </td>
                  <td style="text-align:right;font-weight:700;\${r.saldo <= 0 ? 'color:#b91c1c;':''}">\${sldFmt}</td>`;

if (html.includes(oldRowMaterialEnd)) {
  html = html.replace(oldRowMaterialEnd, newRowMaterialEnd);
  console.log('14. Added table body cell for controladoPcp');
} else {
  console.error('Could not find oldRowMaterialEnd');
}

fs.writeFileSync('index.html', html, 'utf8');
console.log('Done! New length:', html.length);
