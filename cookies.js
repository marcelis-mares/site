/* MARES · Aviso de cookies, Google Analytics 4 e Microsoft Clarity.

   Duas ferramentas, dois comportamentos, de propósito:

   O Clarity grava a sessão e monta mapa de calor, então só entra depois que a
   pessoa clica em Aceitar.

   O GA4 entra sempre, mas em modo de consentimento negado, que é o Consent Mode
   v2 do Google. Sem consentimento ele não grava cookie e não identifica ninguém:
   manda um ping sem identificação, que alimenta a contagem de sessão e a
   modelagem. Quando a pessoa aceita, o consentimento é atualizado para concedido
   e a medição passa a ser completa. Assim o número de visita nunca some, e a
   privacidade de quem recusa continua respeitada. */
(function () {
  var CLARITY_ID = 'xrnzuvtls4';
  var GA_ID = 'G-JEYDER00G4';
  var CHAVE = 'mares_cookies_v1';

  function preferencia() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }
  function guardar(valor) {
    try { localStorage.setItem(CHAVE, valor); } catch (e) {}
  }

  /* O gtag precisa existir antes do script do Google carregar, para que a
     configuração de consentimento chegue primeiro que qualquer medição. */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }

  function iniciarGA() {
    if (!GA_ID || window.__mares_ga) return;
    window.__mares_ga = true;
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      wait_for_update: 500
    });
    var t = document.createElement('script');
    t.async = true;
    t.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(t);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function liberarGA() {
    gtag('consent', 'update', { analytics_storage: 'granted' });
  }

  function carregarClarity() {
    if (window.clarity) return;
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function estilo() {
    var css = ''
      + '#mares-cookies{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;'
      + 'max-width:560px;margin:0 auto;background:#06182a;color:#fff;border-radius:16px;'
      + 'box-shadow:0 18px 50px rgba(0,0,0,.35);padding:20px 22px;'
      + "font-family:'Inter',system-ui,sans-serif;font-size:14px;line-height:1.55;"
      + 'opacity:0;transform:translateY(12px);transition:opacity .35s ease,transform .35s ease}'
      + '#mares-cookies.on{opacity:1;transform:none}'
      + '#mares-cookies .barra{height:3px;border-radius:3px;margin-bottom:14px;'
      + 'background:linear-gradient(90deg,#E26220 0%,#15A5A8 55%,#1C6795 100%)}'
      + '#mares-cookies h4{margin:0 0 6px;font-size:16px;font-weight:700;'
      + "font-family:'Bricolage Grotesque','Inter',sans-serif;line-height:1.2}"
      + '#mares-cookies p{margin:0 0 16px;color:#b9c6d3}'
      + '#mares-cookies a{color:#f0a04a;text-decoration:underline}'
      + '#mares-cookies .acoes{display:flex;gap:10px;flex-wrap:wrap}'
      + '#mares-cookies button{cursor:pointer;border:0;border-radius:999px;padding:11px 22px;'
      + "font-family:'Inter',sans-serif;font-size:14px;font-weight:600;transition:filter .2s ease,background .2s ease}"
      + '#mares-cookies .sim{background:#E26220;color:#fff}'
      + '#mares-cookies .sim:hover{filter:brightness(1.08)}'
      + '#mares-cookies .nao{background:transparent;color:#b9c6d3;border:1px solid rgba(255,255,255,.28)}'
      + '#mares-cookies .nao:hover{background:rgba(255,255,255,.08);color:#fff}'
      + '@media(max-width:520px){#mares-cookies{padding:18px}#mares-cookies .acoes button{flex:1 1 100%}}';
    var s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
  }

  function banner() {
    estilo();
    var box = document.createElement('div');
    box.id = 'mares-cookies';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML = ''
      + '<div class="barra"></div>'
      + '<h4>A gente usa cookies por aqui</h4>'
      + '<p>Usamos cookies para entender como você navega e melhorar a sua experiência no site. '
      + 'Nada do que você digita nos formulários é gravado. Você escolhe.</p>'
      + '<div class="acoes">'
      + '<button type="button" class="sim">Aceitar</button>'
      + '<button type="button" class="nao">Só o essencial</button>'
      + '</div>';
    document.body.appendChild(box);
    requestAnimationFrame(function () { box.classList.add('on'); });

    function fechar() {
      box.classList.remove('on');
      setTimeout(function () { if (box.parentNode) box.parentNode.removeChild(box); }, 350);
    }
    box.querySelector('.sim').addEventListener('click', function () {
      guardar('aceito'); liberarGA(); carregarClarity(); fechar();
    });
    box.querySelector('.nao').addEventListener('click', function () {
      guardar('recusado'); fechar();
    });
  }

  function iniciar() {
    iniciarGA();
    var p = preferencia();
    if (p === 'aceito') { liberarGA(); carregarClarity(); return; }
    if (p === 'recusado') return;
    banner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
