const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const vm = require('vm');

class Element {
  constructor(id, tag = 'div') {
    this.id = id;
    this.tagName = tag.toUpperCase();
    this.style = {};
    this.classList = {
      classes: new Set(),
      add: (c) => this.classList.classes.add(c),
      remove: (c) => this.classList.classes.delete(c),
      toggle: (c, v) => v ? this.classList.classes.add(c) : this.classList.classes.delete(c),
      contains: (c) => this.classList.classes.has(c)
    };
    this.children = [];
    this._innerHTML = '';
  }
  set innerHTML(val) { this._innerHTML = val; }
  get innerHTML() { return this._innerHTML; }
  appendChild(child) { this.children.push(child); return child; }
  remove() {}
  setAttribute() {}
  getAttribute() { return null; }
  addEventListener() {}
}

const elements = new Map();
function getEl(id) {
  if (!elements.has(id)) {
    elements.set(id, new Element(id));
  }
  return elements.get(id);
}

const sandbox = {
  console: console,
  window: {},
  document: {
    getElementById: (id) => getEl(id),
    querySelector: (sel) => getEl(sel),
    querySelectorAll: (sel) => [],
    createElement: (tag) => new Element('', tag),
    body: new Element('body'),
    addEventListener: () => {},
    removeEventListener: () => {}
  },
  localStorage: {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = v; },
    removeItem(k) { delete this._data[k]; }
  },
  navigator: { userAgent: 'node' },
  location: { href: 'http://localhost/' },
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval,
  alert: (msg) => console.log('ALERT:', msg),
  confirm: (msg) => true,
  prompt: (msg) => null,
  Date: Date,
  Math: Math,
  JSON: JSON,
  parseFloat: parseFloat,
  parseInt: parseInt,
  isNaN: isNaN,
  isFinite: isFinite,
  encodeURIComponent: encodeURIComponent,
  decodeURIComponent: decodeURIComponent
};
sandbox.window = sandbox;

const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
let match;
let sIdx = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  sIdx++;
  const code = match[1];
  if (!code.trim()) continue;
  try {
    vm.runInNewContext(code, sandbox);
  } catch(e) {
    console.error('Error running script ' + sIdx + ':', e.stack);
  }
}

console.log('--- Testing renderReordemView() ---');
try {
  sandbox.renderReordemView();
  const innerLen = getEl('view-reordem').innerHTML.length;
  console.log('renderReordemView() SUCCESS! view-reordem HTML length:', innerLen);
} catch(err) {
  console.error('renderReordemView() FAILED:', err.stack);
}

console.log('--- Testing switchTab("reordem") ---');
try {
  sandbox.switchTab('reordem');
  console.log('switchTab("reordem") SUCCESS! view-reordem display:', getEl('view-reordem').style.display);
} catch(err) {
  console.error('switchTab("reordem") FAILED:', err.stack);
}

console.log('--- Testing toggleMaterialPcpControl ---');
try {
  sandbox.toggleMaterialPcpControl('ACIDO ACRILICO GLACIAL - GR (MP)', 'nao');
  console.log('toggleMaterialPcpControl to "nao" SUCCESS!');
  sandbox.toggleMaterialPcpControl('ACIDO ACRILICO GLACIAL - GR (MP)', 'sim');
  console.log('toggleMaterialPcpControl back to "sim" SUCCESS!');
} catch(err) {
  console.error('toggleMaterialPcpControl FAILED:', err.stack);
}


console.log('--- Testing sub-tabs and filter functions ---');
try {
  sandbox.setReordemActiveTab('mp');
  console.log('setReordemActiveTab(mp) OK!');
  sandbox.setReordemActiveTab('emb');
  console.log('setReordemActiveTab(emb) OK!');
  sandbox.setReordemActiveTab('all');
  console.log('setReordemActiveTab(all) OK!');
  sandbox.setReordemActiveTab('pedidos');
  console.log('setReordemActiveTab(pedidos) OK!');
  sandbox.setReordemActiveTab('kpis');
  console.log('setReordemActiveTab(kpis) OK!');
  sandbox.setReordemActiveTab('regras');
  console.log('setReordemActiveTab(regras) OK!');

  sandbox.setReordemActiveTab('mp');
  sandbox.setReordemControladoPcpFilter('sim');
  console.log('setReordemControladoPcpFilter(sim) OK!');
  sandbox.setReordemControladoPcpFilter('todos');
  console.log('setReordemControladoPcpFilter(todos) OK!');
  sandbox.setReordemControladoPcpFilter('nao');
  console.log('setReordemControladoPcpFilter(nao) OK!');
  sandbox.clearAllReordemFilters();
  console.log('clearAllReordemFilters() OK!');
} catch(err) {
  console.error('Sub-tab testing FAILED:', err.stack);
}
