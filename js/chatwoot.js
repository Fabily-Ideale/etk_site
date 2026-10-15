(function () {
  var url_base = 'https://chatwoot.etotek.com.br';
  var token_site = 'TN8rLFFukcLANx4QdB9TkCTV';
  var classe_oculto = 'whatsapp-float--oculto';

  window.chatwootSettings = {
    position: 'right',
    type: 'standard',
    launcherTitle: ''
  };

  function alternar_whatsapp(oculto) {
    var botao = document.getElementById('whatsapp-floating-action');
    if (botao) {
      botao.classList.toggle(classe_oculto, oculto);
    }
  }

  window.addEventListener('chatwoot:opened', function () {
    alternar_whatsapp(true);
  });

  window.addEventListener('chatwoot:closed', function () {
    alternar_whatsapp(false);
  });

  var script_sdk = document.createElement('script');
  script_sdk.src = url_base + '/packs/js/sdk.js';
  script_sdk.async = true;
  script_sdk.onload = function () {
    window.chatwootSDK.run({
      websiteToken: token_site,
      baseUrl: url_base
    });
  };
  document.head.appendChild(script_sdk);
})();
