<?php $now = new DateTime(); ?>
<!doctype html>
<html lang="it">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Attivati! l’app del volontariato trentino</title>
  <meta name="description" content="Attivati! è la prima app di volontariato in Trentino che aiuta aspiranti volontari e volontarie a conoscere le associazioni e le opportunità di volontariato sul territorio.">

  <meta property="og:title" content="Attivati! l’app del volontariato trentino">
  <meta property="og:description" content="Attivati! è la prima app di volontariato in Trentino che aiuta aspiranti volontari e volontarie a conoscere le associazioni e le opportunità di volontariato sul territorio.">
  <meta property="og:type" content="website">
  <meta property="og:image" content="/images/attivati.jpg">
  <meta property="og:url" content="https://attivati.volontariatotrentino.it">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Attivati! l’app del volontariato trentino">
  <meta name="twitter:description" content="Attivati! è la prima app di volontariato in Trentino che aiuta aspiranti volontari e volontarie a conoscere le associazioni e le opportunità di volontariato sul territorio.">
  <meta name="twitter:image" content="/images/attivati.jpg">

  <link rel="stylesheet" href="css/style.css">

  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="Attivati" />
  <link rel="manifest" href="/site.webmanifest" />
  <link href="https://api.fontshare.com/v2/css?f[]=satoshi@500,700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap-grid.min.css" />
</head>

<body>
  <header class="header">
    <div class="container">
      <a class="logo" href="/"><img src="/images/logo.svg"></a>
      <div class="app-logos">
        <a href="https://apps.apple.com/it/app/attivati/id6736770067" rel="nofollow" target="blank"><img alt="Scarica da App Store" src="/images/apple.svg"></a>
        <a href="https://play.google.com/store/apps/details?id=it.volontariatotrentino.attivati" rel="nofollow" target="blank"><img alt="Scarica da Play Store" src="/images/play.svg"></a>
      </div>
    </div>
  </header>
  <div class="intro">
    <div class="intro-content">
      <h1 class="intro-text">Sei fiero?</h1>
      <div class="intro-subtitle med-text">Ci sono molto motivi per essere fieri di se stessi. Noi vorremmo suggerirne uno in più.<br>
Scoprilo il 5 dicembre.</div>
    <?php if($now->format('Y-m-d') < '2025-12-05'): ?>
      <div class="count-down">
        <div class="c-d-text">Stay tuned</div>
        <div class="c-d-number">
          -30
        </div>
      </div>
    <?php endif; ?>
    </div>
    <div class="backgrounds">
      <i></i>
      <i></i>
      <i></i>
      <i></i>
      <i></i>
    </div>
  </div>
  <?php if($now->format('Y-m-d') >= '2025-12-05'): ?>
    <div class="cta-sect">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-md-6">
            <img src="/images/guy.jpg">
          </div>
          <div class="col-md-6">
            <div class="usage-sect">
              <div class="intro-subtitle med-text">
                Usare l’App è facile.
              </div>
              <div class="text">
                1) Scegli la causa<br>
                2) Scegli l’associazione<br>
                3) Scegli cosa fare e quando
              </div>
              <a class="usage-cta bt" rel="nofollow" target="_blank" href="https://apps.apple.com/it/app/attivati/id6736770067">
                Scarica l’App
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="question-sect">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="intro-subtitle med-text">
                Vuoi saperne di più?
              </div>
            <div class="text">
                Se hai dubbi, domande o curiosità contattaci!<br>
    Ti aiuteremo a trovare l’esperienza di volontariato più vicina alle tue passioni e competenze.<br>
    Fisseremo un appuntamento individuale, online oppure in presenza a Trento.<br>
            </div>
            <div class="question-cta">
                <a class="scopri-cta bt" rel="nofollow" target="_blank" href="https://gestionale.volontariatotrentino.it/Frontend/ServizioPublic.aspx?IDServizio=68">
                  Scopri di più
                </a>
                <a class="app-cta bt" rel="nofollow" target="_blank" href="https://gestionale.volontariatotrentino.it/Frontend/Default.aspx">
                  Prenota un appuntamento
                </a>
              </div>
          </div>
        </div>
      </div>
    </div>
    <div class="image-sect">
        <img src="/images/guys.jpg">
    </div>
    <div class="question-sect">
      <div class="container">
        <div class="row">
          <div class="col-md-12">
            <div class="intro-subtitle med-text">
              Vuoi fare volontariato internazionale?
            </div>
            <div class="text">
                Se hai meno di 35 anni puoi fare anche una esperienza di volontariato all’estero.
  Con l’associazione InCo-Interculturalità e Comunicazione scoprirai le numerose<br>
  opportunità per partire con un progetto di volontariato internazionale.<br>
            </div>
            <div class="question-cta">
              <a class="scopri-cta bt" rel="nofollow" target="_blank" href="https://gestionale.volontariatotrentino.it/Frontend/ServizioPublic.aspx?IDServizio=68">
                Scopri di più
              </a>
              <a class="app-cta bt" rel="nofollow" target="_blank" href="https://gestionale.volontariatotrentino.it/Frontend/Default.aspx">
                Prenota un appuntamento
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="box-sect">
      <div class="container">
        <div class="row">
          <div class="col-md-6">
            <div class="intro-subtitle med-text">
              Sei un’organizzazione?
            </div>
            <div class="box-box">
              <div class="text">
                Stai cercando nuovi volontarie
    o volontari da attivare nei tuoi servizi,
    progetti e/o eventi?
              </div>
              <a class="richiesta-cta bt" rel="nofollow" target="_blank" href="https://gestionale.volontariatotrentino.it/Frontend/Default.aspx?IDPadre=1221">
                Carica richiesta
              </a>
            </div>
          </div>
          <div class="col-md-6">
            <div class="intro-subtitle med-text">
              Resta aggiornato
            </div>
            <div class="box-box">
              <div class="text">
                Iscriviti alla newsletter del CSV di
    Trento e non perdere nessuna notizia,
    curiosità, opportunità di volontariato.
              </div>
              <a class="richiesta-cta bt" rel="nofollow" target="_blank" href="https://www.volontariatotrentino.it/newsletter">
                Iscriviti alla newsletter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col">
            <div class="footer-logo">
              Un progetto di
              <a href="https://www.trentovolo.capital/it" rel="nofollow">
                <img src="/images/logo-trentovolo.svg">
              </a>
            </div>
          </div>
          <div class="col">
            <div class="footer-logo">
              In collaborazione con
              <a href="https://www.volontariatotrentino.it" rel="nofollow">
                <img src="/images/csv.svg">
              </a>
            </div>
          </div>
          <div class="col">
            Via Lunelli, 4 - 38121 Trento<br>
    0461 916604<br>
    C.F. 96061940225<br>
    P. IVA 01852790227<br>
          </div>
          <div class="col">
            Scarica l'app
            <div class="footer-links">
              <a href="https://apps.apple.com/it/app/attivati/id6736770067" rel="nofollow">Apple store</a>
              <a href="https://play.google.com/store/apps/details?id=it.volontariatotrentino.attivati" rel="nofollow">Google Play</a>
            </div>
          </div>
          <div class="col">
            Link utili
            <div class="footer-links">
              <a href="/terms-of-service">Termini e condizioni</a>
              <a href="/privacy-policy">Privacy policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  <?php endif; ?>
  <script src="js/app.js"></script>
</body>
</html>
