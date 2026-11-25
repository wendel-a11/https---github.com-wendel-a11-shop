// Configuração dos módulos, campos e regras de cadastro do ShopFlex.
const CONFIG = {
  clientes: {
    titulo: 'Clientes', descricao: 'Cadastre e consulte as pessoas que compram na loja.', armazenamento: 'shopflex_clientes',
    campos: [
      { nome: 'nome', rotulo: 'Nome completo', tipo: 'text', obrigatorio: true, tamanho: 120 },
      { nome: 'cpf', rotulo: 'CPF', tipo: 'text', obrigatorio: true, tamanho: 14, placeholder: '000.000.000-00' },
      { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true, tamanho: 120 },
      { nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', obrigatorio: true, tamanho: 20 },
      { nome: 'data_nascimento', rotulo: 'Data de nascimento', tipo: 'date', obrigatorio: false },
      { nome: 'endereco', rotulo: 'Endereço', tipo: 'text', obrigatorio: false, tamanho: 180 }
    ], colunas: ['nome', 'cpf', 'email', 'telefone']
  },
  categorias: {
    titulo: 'Categorias', descricao: 'Organize os produtos por categorias.', armazenamento: 'shopflex_categorias',
    campos: [
      { nome: 'nome', rotulo: 'Nome da categoria', tipo: 'text', obrigatorio: true, tamanho: 80 },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'text', obrigatorio: false, tamanho: 180 },
      { nome: 'status', rotulo: 'Status', tipo: 'select', obrigatorio: true, opcoes: ['Ativa', 'Inativa'] },
      { nome: 'data_criacao', rotulo: 'Data de criação', tipo: 'date', obrigatorio: true }
    ], colunas: ['nome', 'descricao', 'status', 'data_criacao']
  },
  produtos: {
    titulo: 'Produtos', descricao: 'Controle o catálogo, os preços e o estoque da loja.', armazenamento: 'shopflex_produtos',
    campos: [
      { nome: 'nome', rotulo: 'Nome do produto', tipo: 'text', obrigatorio: true, tamanho: 120 },
      { nome: 'codigo', rotulo: 'Código/SKU', tipo: 'text', obrigatorio: true, tamanho: 30 },
      { nome: 'categoria_id', rotulo: 'Categoria', tipo: 'selectRef', referencia: 'categorias', obrigatorio: true },
      { nome: 'preco', rotulo: 'Preço (R$)', tipo: 'number', obrigatorio: true, min: 0, step: '0.01' },
      { nome: 'estoque', rotulo: 'Quantidade em estoque', tipo: 'number', obrigatorio: true, min: 0, step: '1' },
      { nome: 'descricao', rotulo: 'Descrição', tipo: 'text', obrigatorio: false, tamanho: 220 }
    ], colunas: ['nome', 'codigo', 'categoria_id', 'preco', 'estoque']
  },
  funcionarios: {
    titulo: 'Funcionários', descricao: 'Mantenha os dados da equipe da loja organizados.', armazenamento: 'shopflex_funcionarios',
    campos: [
      { nome: 'nome', rotulo: 'Nome completo', tipo: 'text', obrigatorio: true, tamanho: 120 },
      { nome: 'cpf', rotulo: 'CPF', tipo: 'text', obrigatorio: true, tamanho: 14 },
      { nome: 'cargo', rotulo: 'Cargo', tipo: 'text', obrigatorio: true, tamanho: 80 },
      { nome: 'email', rotulo: 'E-mail', tipo: 'email', obrigatorio: true, tamanho: 120 },
      { nome: 'telefone', rotulo: 'Telefone', tipo: 'tel', obrigatorio: false, tamanho: 20 },
      { nome: 'data_admissao', rotulo: 'Data de admissão', tipo: 'date', obrigatorio: true }
    ], colunas: ['nome', 'cpf', 'cargo', 'email']
  },
  pedidos: {
    titulo: 'Pedidos', descricao: 'Registre as compras realizadas pelos clientes.', armazenamento: 'shopflex_pedidos',
    campos: [
      { nome: 'cliente_id', rotulo: 'Cliente', tipo: 'selectRef', referencia: 'clientes', obrigatorio: true },
      { nome: 'data_pedido', rotulo: 'Data do pedido', tipo: 'date', obrigatorio: true },
      { nome: 'valor_total', rotulo: 'Valor total (R$)', tipo: 'number', obrigatorio: true, min: 0, step: '0.01' },
      { nome: 'status', rotulo: 'Status do pedido', tipo: 'select', obrigatorio: true, opcoes: ['Aguardando pagamento', 'Pago', 'Em separação', 'Enviado', 'Entregue', 'Cancelado'] },
      { nome: 'observacao', rotulo: 'Observações', tipo: 'text', obrigatorio: false, tamanho: 220 }
    ], colunas: ['cliente_id', 'data_pedido', 'valor_total', 'status']
  },
  itens: {
    titulo: 'Itens do pedido', descricao: 'Associe produtos e quantidades a cada pedido.', armazenamento: 'shopflex_itens',
    campos: [
      { nome: 'pedido_id', rotulo: 'Pedido', tipo: 'selectRef', referencia: 'pedidos', obrigatorio: true },
      { nome: 'produto_id', rotulo: 'Produto', tipo: 'selectRef', referencia: 'produtos', obrigatorio: true },
      { nome: 'quantidade', rotulo: 'Quantidade', tipo: 'number', obrigatorio: true, min: 1, step: '1' },
      { nome: 'preco_unitario', rotulo: 'Preço unitário (R$)', tipo: 'number', obrigatorio: true, min: 0, step: '0.01' },
      { nome: 'subtotal', rotulo: 'Subtotal (R$)', tipo: 'number', obrigatorio: true, min: 0, step: '0.01' }
    ], colunas: ['pedido_id', 'produto_id', 'quantidade', 'preco_unitario', 'subtotal']
  },
  pagamentos: {
    titulo: 'Pagamentos', descricao: 'Registre a forma e a situação dos pagamentos.', armazenamento: 'shopflex_pagamentos',
    campos: [
      { nome: 'pedido_id', rotulo: 'Pedido', tipo: 'selectRef', referencia: 'pedidos', obrigatorio: true },
      { nome: 'data_pagamento', rotulo: 'Data do pagamento', tipo: 'date', obrigatorio: true },
      { nome: 'valor', rotulo: 'Valor pago (R$)', tipo: 'number', obrigatorio: true, min: 0, step: '0.01' },
      { nome: 'metodo', rotulo: 'Método', tipo: 'select', obrigatorio: true, opcoes: ['Pix', 'Cartão de crédito', 'Cartão de débito', 'Boleto', 'Dinheiro'] },
      { nome: 'status', rotulo: 'Status', tipo: 'select', obrigatorio: true, opcoes: ['Pendente', 'Aprovado', 'Recusado', 'Estornado'] }
    ], colunas: ['pedido_id', 'data_pagamento', 'valor', 'metodo', 'status']
  },
  entregas: {
    titulo: 'Entregas', descricao: 'Acompanhe o envio dos pedidos aos clientes.', armazenamento: 'shopflex_entregas',
    campos: [
      { nome: 'pedido_id', rotulo: 'Pedido', tipo: 'selectRef', referencia: 'pedidos', obrigatorio: true },
      { nome: 'transportadora', rotulo: 'Transportadora', tipo: 'text', obrigatorio: true, tamanho: 100 },
      { nome: 'codigo_rastreio', rotulo: 'Código de rastreio', tipo: 'text', obrigatorio: false, tamanho: 60 },
      { nome: 'data_envio', rotulo: 'Data de envio', tipo: 'date', obrigatorio: false },
      { nome: 'previsao_entrega', rotulo: 'Previsão de entrega', tipo: 'date', obrigatorio: false },
      { nome: 'status', rotulo: 'Status', tipo: 'select', obrigatorio: true, opcoes: ['Preparando', 'Enviado', 'Em trânsito', 'Entregue', 'Atrasado'] }
    ], colunas: ['pedido_id', 'transportadora', 'codigo_rastreio', 'previsao_entrega', 'status']
  }
};
