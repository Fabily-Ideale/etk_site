(() => {
  const ids_grids = [
    'grid-software-services',
    'grid-loja-services',
    'grid-suporte-services',
    'grid-redes-services',
    'grid-seguranca-comp-services'
  ];

  const mapa_categorias = {
    'empresa de software': 'grid-software-services',
    'loja de informatica': 'grid-loja-services',
    'loja de informatica e design': 'grid-loja-services',
    'suporte e servicos para computadores': 'grid-suporte-services',
    'servico de redes de computadores': 'grid-redes-services',
    'redes de computadores': 'grid-redes-services',
    'seguranca de computadores': 'grid-seguranca-comp-services'
  };

  const normalizar_texto = (texto) =>
    texto
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/&/g, ' e ')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const gerar_slug = (texto) => normalizar_texto(texto).replace(/ /g, '-');

  const texto_valido = (valor) => typeof valor === 'string' && valor.trim() !== '';

  const filtrar_servicos = (dados) => {
    if (!Array.isArray(dados)) return [];
    return dados.filter(
      (item) =>
        item !== null &&
        typeof item === 'object' &&
        texto_valido(item.nome) &&
        texto_valido(item.descricao) &&
        texto_valido(item.categoria)
    );
  };

  const agrupar_por_grid = (servicos) => {
    const agrupado = new Map();
    for (const servico of servicos) {
      const id_grid = mapa_categorias[normalizar_texto(servico.categoria)];
      if (!id_grid) {
        console.warn('Categoria desconhecida ignorada:', servico.categoria);
        continue;
      }
      if (!agrupado.has(id_grid)) agrupado.set(id_grid, []);
      agrupado.get(id_grid).push(servico);
    }
    return agrupado;
  };

  const criar_card = (servico, numero, ids_usados) => {
    const base_id = 'srv-' + gerar_slug(servico.nome);
    let id_card = base_id;
    let sufixo = 2;
    while (ids_usados.has(id_card)) {
      id_card = base_id + '-' + sufixo++;
    }
    ids_usados.add(id_card);

    const card = document.createElement('div');
    card.className = 'service-detail-card';
    card.id = id_card;

    const cabecalho = document.createElement('div');
    cabecalho.className = 'service-card-header';

    const rotulo_numero = document.createElement('span');
    rotulo_numero.className = 'service-card-number';
    rotulo_numero.textContent = String(numero).padStart(2, '0');

    const titulo = document.createElement('h3');
    titulo.className = 'service-card-title';
    titulo.textContent = servico.nome.trim();

    const descricao = document.createElement('p');
    descricao.className = 'service-card-desc';
    descricao.textContent = servico.descricao.trim();

    cabecalho.append(rotulo_numero, titulo);
    card.append(cabecalho, descricao);
    return card;
  };

  const renderizar = (agrupado) => {
    const ids_usados = new Set();
    let contador = 0;

    for (const id_grid of ids_grids) {
      const grid = document.getElementById(id_grid);
      if (!grid) continue;

      const servicos = agrupado.get(id_grid);
      if (!servicos) {
        const secao = grid.closest('.servicos-cat-sec');
        if (secao) secao.remove();
        continue;
      }

      const cards = servicos.map((servico) => criar_card(servico, ++contador, ids_usados));
      grid.replaceChildren(...cards);
    }

    document.querySelectorAll('.servicos-cat-sec .section-tag').forEach((tag, indice) => {
      tag.textContent = 'Pilar ' + String(indice + 1).padStart(2, '0');
    });
  };

  const carregar_servicos = async () => {
    try {
      const resposta = await fetch('/servicos.json', {
        headers: { Accept: 'application/json' },
        signal: AbortSignal.timeout(4000)
      });
      if (!resposta.ok) return;

      const servicos = filtrar_servicos(await resposta.json());
      if (servicos.length === 0) return;

      const agrupado = agrupar_por_grid(servicos);
      if (agrupado.size === 0) return;

      renderizar(agrupado);
    } catch (erro) {
      console.warn('Lista de servicos indisponivel, mantendo conteudo estatico:', erro.name);
    }
  };

  carregar_servicos();
})();
