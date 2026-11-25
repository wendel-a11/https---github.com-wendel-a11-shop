// Lógica principal: navegação, CRUD, pesquisa, validação e armazenamento local.
let paginaAtual = 'dashboard';
let registroEditando = null;
let toastTimer;

const $ = (seletor) => document.querySelector(seletor);
const $$ = (seletor) => document.querySelectorAll(seletor);
const lerDados = (chave) => JSON.parse(localStorage.getItem(chave) || '[]');
const salvarDados = (chave, dados) => localStorage.setItem(chave, JSON.stringify(dados));
const moeda = (valor) => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const escapar = (valor) => String(valor ?? '').replace(/[&<>"']/g, caractere => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[caractere]));

function mostrarToast(mensagem, tipo = 'success') {
  const toast = $('#toast');
  toast.textContent = mensagem;
  toast.className = `toast show ${tipo}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.className = 'toast', 3200);
}

function nomeReferencia(chave, id) {
  const config = CONFIG[chave];
  if (!config) return `#${id}`;
  const registro = lerDados(config.armazenamento).find(item => String(item.id) === String(id));
  if (!registro) return `#${id} (registro não encontrado)`;
  return registro.nome || registro.codigo || `Pedido #${registro.id}`;
}

function navegar(pagina) {
  paginaAtual = pagina;
  $$('.nav-link').forEach(botao => botao.classList.toggle('active', botao.dataset.page === pagina));
  $('#dashboardPage').classList.toggle('hidden', pagina !== 'dashboard');
  $('#managementPage').classList.toggle('hidden', pagina === 'dashboard');
  $('#pageTitle').textContent = pagina === 'dashboard' ? 'Visão geral' : CONFIG[pagina].titulo;
  $('#sidebar').classList.remove('open');
  if (pagina !== 'dashboard') renderizarTabela();
  atualizarDashboard();
}

function renderizarTabela() {
  const config = CONFIG[paginaAtual];
  const registros = lerDados(config.armazenamento);
  const termo = $('#searchInput').value.trim().toLocaleLowerCase('pt-BR');
  const filtrados = registros.filter(registro => Object.values(registro).some(valor => String(valor).toLocaleLowerCase('pt-BR').includes(termo)));
  $('#sectionHeading').textContent = config.titulo;
  $('#sectionDescription').textContent = config.descricao;
  $('#recordCount').textContent = `${filtrados.length} ${filtrados.length === 1 ? 'registro' : 'registros'}`;
  $('#tableHead').innerHTML = `<tr>${config.colunas.map(coluna => `<th>${escapar(rotuloCampo(config, coluna))}</th>`).join('')}<th class="actions-heading">Ações</th></tr>`;
  $('#tableBody').innerHTML = filtrados.map(registro => `<tr>${config.colunas.map(coluna => `<td>${formatarValor(config, coluna, registro[coluna])}</td>`).join('')}<td class="row-actions"><button class="action-button edit" data-edit="${registro.id}" aria-label="Editar registro">Editar</button><button class="action-button delete" data-delete="${registro.id}" aria-label="Excluir registro">Excluir</button></td></tr>`).join('');
  $('#emptyState').classList.toggle('hidden', filtrados.length > 0);
  $('#tableBody').classList.toggle('hidden', filtrados.length === 0);
}

function rotuloCampo(config, nome) {
  const campo = config.campos.find(item => item.nome === nome);
  return campo ? campo.rotulo : nome;
}

function formatarValor(config, campo, valor) {
  if (valor === undefined || valor === null || valor === '') return '<span class="muted">—</span>';
  const definicao = config.campos.find(item => item.nome === campo);
  if (definicao?.tipo === 'selectRef') return escapar(nomeReferencia(definicao.referencia, valor));
  if (['preco', 'valor_total', 'preco_unitario', 'subtotal', 'valor'].includes(campo)) return escapar(moeda(valor));
  if (campo === 'estoque' && Number(valor) <= 5) return `<span class="stock-low">${escapar(valor)} (baixo)</span>`;
  if (campo === 'status') return `<span class="status-pill">${escapar(valor)}</span>`;
  return escapar(valor);
}

function abrirModal(id = null) {
  const config = CONFIG[paginaAtual];
  registroEditando = id;
  const registro = id === null ? {} : lerDados(config.armazenamento).find(item => item.id === id);
  $('#modalTitle').textContent = id === null ? `Novo cadastro · ${config.titulo}` : `Editar · ${config.titulo}`;
  $('#formFields').innerHTML = config.campos.map(campo => criarCampo(campo, registro?.[campo.nome] ?? '')).join('');
  $('#recordModal').classList.remove('hidden');
  document.body.classList.add('modal-open');
  $('#formFields input, #formFields select').item(0)?.focus();
}

function criarCampo(campo, valor) {
  const obrigatorio = campo.obrigatorio ? 'required' : '';
  const placeholder = campo.placeholder ? `placeholder="${escapar(campo.placeholder)}"` : '';
  let controle = '';
  if (campo.tipo === 'select' || campo.tipo === 'selectRef') {
    let opcoes = campo.tipo === 'select' ? campo.opcoes.map(opcao => ({ value: opcao, label: opcao })) : lerDados(CONFIG[campo.referencia].armazenamento).map(item => ({ value: item.id, label: item.nome || item.codigo || `Pedido #${item.id}` }));
    controle = `<select id="campo_${campo.nome}" name="${campo.nome}" ${obrigatorio}><option value="">Selecione...</option>${opcoes.map(opcao => `<option value="${escapar(opcao.value)}" ${String(valor) === String(opcao.value) ? 'selected' : ''}>${escapar(opcao.label)}</option>`).join('')}</select>`;
  } else {
    const tipo = campo.tipo || 'text';
    const extras = `${campo.tamanho ? `maxlength="${campo.tamanho}"` : ''} ${campo.min !== undefined ? `min="${campo.min}"` : ''} ${campo.step ? `step="${campo.step}"` : ''}`;
    controle = `<input id="campo_${campo.nome}" name="${campo.nome}" type="${tipo}" value="${escapar(valor)}" ${obrigatorio} ${placeholder} ${extras}>`;
  }
  return `<label class="form-field" for="campo_${campo.nome}"><span>${escapar(campo.rotulo)} ${campo.obrigatorio ? '<b>*</b>' : ''}</span>${controle}</label>`;
}

function fecharModal() {
  $('#recordModal').classList.add('hidden');
  document.body.classList.remove('modal-open');
  $('#recordForm').reset();
  registroEditando = null;
}

function validarDuplicidade(config, dados, idAtual) {
  const unicos = { clientes: ['cpf', 'email'], funcionarios: ['cpf', 'email'], produtos: ['codigo'] };
  for (const campo of (unicos[paginaAtual] || [])) {
    const repetido = lerDados(config.armazenamento).some(item => item.id !== idAtual && String(item[campo]).toLowerCase() === String(dados[campo]).toLowerCase());
    if (repetido) return `Já existe um cadastro com este ${campo === 'codigo' ? 'código' : campo.toUpperCase()}.`;
  }
  return null;
}

function salvarRegistro(evento) {
  evento.preventDefault();
  const config = CONFIG[paginaAtual];
  const formulario = new FormData($('#recordForm'));
  const dados = {};
  config.campos.forEach(campo => {
    let valor = formulario.get(campo.nome);
    if (campo.tipo === 'number' && valor !== '') valor = Number(valor);
    if (campo.tipo === 'selectRef' && valor !== '') valor = Number(valor);
    dados[campo.nome] = valor;
  });
  const erro = validarDuplicidade(config, dados, registroEditando);
  if (erro) { mostrarToast(erro, 'error'); return; }
  if (paginaAtual === 'itens' && dados.subtotal !== Number((dados.quantidade * dados.preco_unitario).toFixed(2))) {
    mostrarToast('O subtotal deve ser igual à quantidade multiplicada pelo preço unitário.', 'error'); return;
  }
  const registros = lerDados(config.armazenamento);
  if (registroEditando !== null) {
    const indice = registros.findIndex(item => item.id === registroEditando);
    if (indice < 0) { mostrarToast('Registro não encontrado.', 'error'); return; }
    registros[indice] = { ...registros[indice], ...dados };
    salvarDados(config.armazenamento, registros);
    mostrarToast('Cadastro atualizado com sucesso!');
  } else {
    dados.id = Date.now() + Math.floor(Math.random() * 1000);
    dados.criado_em = new Date().toISOString();
    registros.push(dados);
    salvarDados(config.armazenamento, registros);
    mostrarToast('Cadastro realizado com sucesso!');
  }
  fecharModal();
  renderizarTabela();
  atualizarDashboard();
}

function excluirRegistro(id) {
  const config = CONFIG[paginaAtual];
  if (!confirm('Tem certeza de que deseja excluir este registro?')) return;
  const registros = lerDados(config.armazenamento).filter(item => item.id !== id);
  salvarDados(config.armazenamento, registros);
  renderizarTabela();
  atualizarDashboard();
  mostrarToast('Registro excluído com sucesso!');
}

function atualizarDashboard() {
  const produtos = lerDados(CONFIG.produtos.armazenamento);
  const clientes = lerDados(CONFIG.clientes.armazenamento);
  const pedidos = lerDados(CONFIG.pedidos.armazenamento);
  $('#totalProdutos').textContent = produtos.length;
  $('#totalClientes').textContent = clientes.length;
  $('#totalPedidos').textContent = pedidos.length;
  $('#totalVendas').textContent = moeda(pedidos.reduce((total, pedido) => total + Number(pedido.valor_total || 0), 0));
  const recentes = [...pedidos].sort((a, b) => String(b.data_pedido).localeCompare(String(a.data_pedido))).slice(0, 5);
  $('#recentOrders').innerHTML = recentes.length ? recentes.map(pedido => `<div class="recent-item"><div><strong>Pedido #${pedido.id}</strong><small>${escapar(nomeReferencia('clientes', pedido.cliente_id))} · ${escapar(pedido.data_pedido)}</small></div><div class="recent-right"><strong>${escapar(moeda(pedido.valor_total))}</strong><span class="status-pill">${escapar(pedido.status)}</span></div></div>`).join('') : '<p class="empty-state">Nenhum pedido cadastrado até o momento.</p>';
}

function inicializar() {
  $('#todayDate').textContent = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  $('#year').textContent = new Date().getFullYear();
  $$('.nav-link').forEach(botao => botao.addEventListener('click', () => navegar(botao.dataset.page)));
  $$('[data-go]').forEach(botao => botao.addEventListener('click', () => navegar(botao.dataset.go)));
  $('#addRecord').addEventListener('click', () => abrirModal());
  $('#closeModal').addEventListener('click', fecharModal);
  $('#cancelModal').addEventListener('click', fecharModal);
  $('#recordForm').addEventListener('submit', salvarRegistro);
  $('#searchInput').addEventListener('input', renderizarTabela);
  $('#tableBody').addEventListener('click', evento => {
    const editar = evento.target.closest('[data-edit]');
    const excluir = evento.target.closest('[data-delete]');
    if (editar) abrirModal(Number(editar.dataset.edit));
    if (excluir) excluirRegistro(Number(excluir.dataset.delete));
  });
  $('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const escuro = document.body.classList.contains('dark-theme');
    localStorage.setItem('shopflex_tema', escuro ? 'escuro' : 'claro');
    $('#themeToggle').textContent = escuro ? '☀' : '☾';
  });
  $('#mobileMenu').addEventListener('click', () => $('#sidebar').classList.toggle('open'));
  const temaSalvo = localStorage.getItem('shopflex_tema');
  if (temaSalvo === 'escuro') { document.body.classList.add('dark-theme'); $('#themeToggle').textContent = '☀'; }
  document.addEventListener('keydown', evento => { if (evento.key === 'Escape' && !$('#recordModal').classList.contains('hidden')) fecharModal(); });
  atualizarDashboard();
}

document.addEventListener('DOMContentLoaded', inicializar);
