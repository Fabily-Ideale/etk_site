(function () {
  const url_base = 'https://chatwoot.etotek.com.br';
  const token_site = 'TN8rLFFukcLANx4QdB9TkCTV';
  const classe_oculto = 'whatsapp-float--oculto';

  window.chatwootSettings = {
    position: 'right',
    type: 'standard',
    launcherTitle: 'Converse com nosso assistente'
  };

  function alternar_whatsapp(oculto) {
    const botao = document.getElementById('whatsapp-floating-action');
    if (botao) {
      botao.classList.toggle(classe_oculto, oculto);
    }
  }

  function alternar_botoes_chat(visivel) {
    document.querySelectorAll('[data-abrir-chat]').forEach(function (botao) {
      botao.hidden = !visivel;
    });
  }

  document.addEventListener('click', function (evento) {
    if (evento.target.closest('[data-abrir-chat]') && window.$chatwoot) {
      window.$chatwoot.toggle('open');
    }
  });

  window.addEventListener('chatwoot:ready', function () {
    alternar_botoes_chat(true);
  });

  window.addEventListener('chatwoot:opened', function () {
    alternar_whatsapp(true);
  });

  window.addEventListener('chatwoot:closed', function () {
    alternar_whatsapp(false);
  });

  const eventos_interacao = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
  let carregado = false;

  function carregar_sdk() {
    if (carregado) {
      return;
    }
    carregado = true;
    eventos_interacao.forEach(function (nome) {
      window.removeEventListener(nome, carregar_sdk);
    });
    const script_sdk = document.createElement('script');
    script_sdk.src = url_base + '/packs/js/sdk.js';
    script_sdk.async = true;
    script_sdk.onload = function () {
      window.chatwootSDK.run({
        websiteToken: token_site,
        baseUrl: url_base
      });
    };
    document.head.appendChild(script_sdk);
  }

  eventos_interacao.forEach(function (nome) {
    window.addEventListener(nome, carregar_sdk, { once: true, passive: true });
  });

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(carregar_sdk, { timeout: 5000 });
  } else {
    window.setTimeout(carregar_sdk, 3000);
  }
})();
