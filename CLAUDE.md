# pelletteria

Sito Jekyll su GitHub Pages: https://cialdecompatibili-netizen.github.io/pelletteria/ (repo cialdecompatibili-netizen/pelletteria, cartella Desktop\repository\pelletteria). Clone di prodottidigitali, riscritto come negozio di pelletteria con due reparti (Donna, Uomo) e le sottocategorie sotto ciascuno. Prodotti ancora da inserire.

## Filosofia del codice
- Niente hard coded: tutto adattivo e dinamico. Percorsi, nomi, URL, brand e liste arrivano da dati o da variabili, mai scritti a mano nel codice, cosi' tutto funziona subito su altre repository o altri siti puntati.
- Esempio qui: `site_pelle.py` calcola il percorso della repo da solo (variabile `SITE_ROOT` per cambiarlo) e da li' derivano brand, reparti, testi e menu.

## Dati e script (Desktop\claudetemp)
- `site_pelle.py`: unica fonte dei dati (brand, reparti, sottocategorie, testi della home, categorie del blog, icone si/no).
- `rebrand_pelle.py`: struttura e testi (catalogo, pagine /negozio/, menu, blocchi home, config, about, SEO). Rilanciabile.
- `lusso_pelle.py`: stile luxury (palette avorio/nero/oro, Cormorant Garamond + Jost, angoli netti). Rilanciabile; il blocco CSS in fondo a `assets/css/main.scss` tra LUSSO-BEGIN e LUSSO-END e' generato dallo script: non si modifica a mano. Ordine: prima rebrand, poi lusso.
- Palette e font sono in cima a `lusso_pelle.py` (PALETTE, TEMA, FONT_*): per cambiare aspetto si tocca solo li'.

## Cose che funzionano
- Skill Impeccable (design): installata a livello progetto con `npx --yes impeccable install --providers=claude --scope=project` dalla radice del progetto. I flag evitano le domande interattive. Dopo l'installazione, in Claude Code (anche nella scheda Code di Claude Desktop) lanciare `/impeccable init`.
- Controllo design senza LLM: `npx impeccable detect --json _layouts _includes index.html` (trova per esempio testo con contrasto sotto 4.5:1).- La home e' fatta di blocchi in `_data/blocks_home.json` (campi id, nome, enabled, html), letti anche dall'admin: modificare solo il contenuto di `html`, mai la struttura. Fare prima un backup e verificare il JSON riletto dopo la scrittura.
- Comandi PowerShell molto lunghi falliscono (limite della riga di comando): salvare lo script in un file .ps1 e lanciarlo con `powershell -NoProfile -ExecutionPolicy Bypass -File`.
- Anteprima prima di pubblicare: creare un HTML statico con i blocchi e fare lo screenshot con `chrome.exe --headless=new --screenshot=... --window-size=1440,3000`. La larghezza minima di Chrome headless e' 500 px, sotto viene ritagliata.
- Link interni sotto sottopercorso GitHub Pages (baseurl): nei blocchi di `_data/blocks_home.json` usare `href=\"__BASEURL__/contatti/\"` (render-blocks.html sostituisce il segnaposto), nei template `{{ '/x/' | relative_url }}`. Il link autore in `_config.yml` (author.links.url) non passa da relative_url: va scritto con il baseurl davanti e rimesso a mano se il baseurl cambia. Verifica rapida: scaricare le pagine online e cercare href/src che iniziano con `/` ma non con il baseurl.
- Il motore binario di Impeccable non e' nel repo (e' in .gitignore): si riscarica al primo uso.

- Il detector su cartella (`npx impeccable detect .`) NON legge i blocchi di `_data/blocks_home.json`: per controllare la home scansionare l'URL online (`npx impeccable detect --json <url>`) dopo il deploy. In PowerShell 5 il JSON restituito e' un array annidato: scorrerlo con due foreach.

## Da sistemare
- Inserire i prodotti in `_data/catalogo.json` (campo categoria = id della sottocategoria, es. donna-borse-mano). Fino ad allora le pagine categoria mostrano "arrivano presto".
- Il blocco cta della home e' spento perche' dice quasi la stessa cosa del blocco pricing.
- Immagini: il sito luxury e' pensato per foto dei prodotti (nessuna per ora); `ex-hero` e' solo tipografico.

- Menu: voci principali in _data/navigation.yml, tendine in _data/sottomenu.yml (chiave = title della voce). L'admin > Menu gestisce entrambi (bottone Sottomenu su ogni riga, un solo livello, separatori, riordino); salvando riscrive i due file e conserva il commento in testa a sottomenu.yml.

- L'indice automatico (JS 'INDICE AUTOMATICO' in `_includes/head/custom.html`) scatta su qualunque `.page__content` con almeno 3 H2: sulle pagine del negozio va escluso (ora lo e' per `.nz-*` e per i percorsi negozio/carrello/ordine/grazie), altrimenti compare sull'ordine. Verifica: `chrome --headless=new --dump-dom URL` e cercare `article-auto-toc`.

- Angoli del negozio: in `assets/css/negozio.css` i raggi passano da due variabili in cima (`--nz-r: 0` per pulsanti, quantita', chip e campi; `--nz-rl: 0` per riquadri, foto e finestre: angoli netti dello stile luxury, impostati da `lusso_pelle.py`). Per cambiare lo stile di tutto il negozio basta toccare quelle due righe; niente valori scritti a mano (le pillole 999px davano un effetto misto con gli angoli quadrati del tema). Verifica con screenshot headless di /negozio/ e di una scheda prodotto.

- Carrello su mobile: sotto i 768px `assets/js/menu.js` sposta l'elemento `.nz-cartw` (lo stesso, con id `nz-cart` e anteprima) dalla voce di menu alla barra, a sinistra del pulsante hamburger, e lo rimette al suo posto da 768px in su. Non duplicare il carrello nel markup: `carrello.js` cerca `#nz-cart` per id. CSS in fondo al blocco carrello di `negozio.css`. Verifica con screenshot headless a 500 px e a 1280 px.

## E-commerce (porting da ecommercealfolio1)
- Interruttore: `ecommerce: true|false` in `_config.yml` (admin > Impostazioni > Abilita e-commerce). Solo true accende. Spento: spariscono voce Negozio nel menu, carrello, CSS/JS; /negozio/ /carrello/ /ordine/ e le schede mostrano "non disponibile". Prodotti e categorie restano salvati.
- Fonte unica: `_data/catalogo.json` (categorie + prodotti, prezzo_centesimi = euro x 100, tipo fisico|digitale, visibile false = nascosto). Lo legge /negozio/, il carrello nel menu (`_includes/masthead.html`), le schede e l'admin (gruppo E-commerce, `admin/js/ecommerce.js`).
- File: pagine `_pages/negozio.md carrello.md ordine.md grazie.md`, `assets/js/carrello.js`, `assets/css/negozio.css` (caricati da `_includes/head/custom.html` solo se acceso), layout `_layouts/negozio-prodotto.html` e `negozio-categoria.html`, include `negozio-riga.html`.
- DIFFERENZA dal sito originale: qui il build di GitHub Pages e' quello classico, quindi il plugin Ruby `_plugins/ecommerce.rb` NON gira. Le schede `/negozio/<id>/` e `/negozio/categoria/<id>/` sono piccoli file in `_negozio/` (solo front matter con `pid`/`cid`) che l'admin crea e toglie da solo; i testi vengono sempre dal catalogo. Se il catalogo e' modificato a mano: admin > Prodotti negozio > "Rigenera pagine".
- Ordini (smoke test, nessun pagamento): `ordini.tracker` in `_config.yml` = URL di un Apps Script Google. Vuoto = il pulsante "Invia richiesta d'ordine" resta spento. Per pagamenti veri vedi `_ecommerce` in box-ecommerce (Stripe + D1).
- Il vecchio shop (`_pages/shop*.md`, collezione `products`, admin Prodotti/Categorie Shop) resta com'era e non e' collegato al menu; con l'e-commerce acceso l'icona carrello del vecchio shop sparisce.
- Immagini prodotto: `assets/img/negozio/` (caricate dall'admin) o URL.
- Clonare una repo in un colpo: `powershell -NoProfile -ExecutionPolicy Bypass -File C:\Users\mirco\Desktop\claudetemp\clone_repo.ps1 -src <repo-origine> -dst <nuova-repo>` (copia i file, cambia il baseurl in _config.yml, crea la repo su GitHub, la pusha e attiva Pages da main). Provato il 19/10/2026: prodottidigitali da serverai in circa un minuto. Poi riscrivere questo blocco e i contenuti.
