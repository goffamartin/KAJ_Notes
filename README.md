# Notes App

Jednoduchá webová Single-Page aplikace pro správu poznámek s podporou složek, obrázků, zvuku, videí a offline režimu (PWA).

---

## ✨ Funkce

- **Přehledná správa poznámek** – text, obrázek, zvuk, video
- **Složky pro lepší organizaci**
- **Možnost editace a mazání poznámek**
- **Offline režim** – funguje i bez připojení k internetu (Service Worker)
- **Bezpečnost proti XSS** – uživatelský obsah se escapuje při výpisu
- **Rychlý a moderní design (CSS + per-page styly)**
- **Lokální úložiště** – data zůstávají ve vašem zařízení (localStorage, localForage)

---

## 🛠️ Technologie

- HTML5, CSS3 (rozdělené na globální a per-page styly)
- JavaScript (modulární – každý "page" má svůj JS soubor)
- [localForage](https://github.com/localForage/localForage) pro blob data (obrázky, zvuk)
- **Service Worker** pro offline režim
- SPA router bez knihovny
- SVG ikony

---

## 📦 Struktura projektu

/index.html
/main.js
/router.js
/service-worker.js
/pages/
page-list.js
page-detail.js
page-form.js
page-folders.js
page-404.js
/styles/
style.css
page-list.css
page-detail.css
page-form.css
page-folders.css
/assets/
icons.svg
logo.svg
/libs/
localforage.min.js

---

## 🚀 Spuštění

**Doporučeno:** Použijte Python HTTP server pro korektní servírování assetů!

1. Ověřte, že máte [Python 3](https://www.python.org/downloads/)  
2. V terminálu spusťte ve složce projektu:
python -m http.server 5500

3. Otevřete v prohlížeči [http://127.0.0.1:5500/](http://127.0.0.1:5500/)

> Nepoužívejte VS Code Live Server (má SPA fallback, který může rozbít načítání JS při testování Offline přístupu).

---

## 👨‍💻 Vývoj

- Každá stránka (`list`, `form`, `folders`, `detail`, `404`) má vlastní JS a CSS.
- Globální styly v `/styles/style.css`, pouze speciální věci na stránkách v per-page CSS.
- Kód je rozdělen do modulů – lze snadno rozšířit.

---

## 🔒 Bezpečnost

- **Veškerý uživatelský obsah je escapován až při výpisu do HTML** (`escapeHtml` utilita).
- Není možné vložit do poznámek HTML nebo <script> (ochrana proti XSS).
- Offline režim je sandboxovaný (data jen u uživatele).

---

## 🌐 Offline / PWA

- Veškeré assety jsou cachovány při prvním načtení (viz `service-worker.js`).
- Po opětovném otevření funguje aplikace plně offline.
- Pro správnou funkci cache je nutné spouštět přes static server.
