// Álbum Matemático Virtual con sincronización a Google Sheets vía Apps Script
// ------------------------------------------------------------------------
// Antes de usar:
// 1) Reemplaza API_URL con la URL del Web App de Apps Script.
// 2) Ajusta las rutas de imágenes dentro de la carpeta /images.
// 3) Si agregas páginas, replica el formato del arreglo PAGES.
//
// Formato de imágenes:
//   images/<pageKey>/1.png
//   images/<pageKey>/2.png
//   ...
//   images/<pageKey>/6.png
//
// Si una imagen no existe, la tarjeta mostrará un marcador sin romper la app.

const API_URL = "https://script.google.com/macros/s/AKfycbySycS9KtrHdzvrjVsCwmgOAOcDasvp0Lr7oVNn-Fqy5oBN_8ndXmONKEmWHZSGehyM/exec";
 

const STUDENTS = {
  "89B-01-EMILYN": "Álvarez Ballesteros Emilyn Natalia",
  "89B-02-VALERIA": "Álvarez Guerra Valeria Alejandra",
  "89B-03-MARIANGEL": "Álvarez Sotomayor Mariángel",
  "89B-04-CALEB": "Angulo Dominguez Caleb",
  "89B-05-ANTHONY": "Araque Bedoya Anthony",
  "89B-06-SIMON": "Arboleda Palacio Simón",
  "89B-07-DIEGO": "Benavides Paniagua Diego Alejandro",
  "89B-08-FELIPE": "Blandón Samuel Felipe",
  "89B-09-MELANY": "Bracamonte Tabares Melany Andrea",
  "89B-10-CAMILA": "Cadavid Montoya María Camila",
  "89B-11-YARA": "Diaz Pamplona Yara Nicole",
  "89B-12-MATIAS": "Echavarría Arias Matías",
  "89B-13-JHOSUA": "Fernández Herrera Jhosua",
  "89B-14-PAULA": "Gil Domicó Paula Andrea",
  "89B-15-SEBASTIAN": "Giraldo Mejía Juan Sebastián",
  "89B-16-CHARICK": "Giraldo Villada Charick Lorena",
  "89B-17-MELISA": "Gómez Urrego Melisa",
  "89B-18-LINA": "González Cuervo Lina Stefany",
  "89B-19-SOFIA": "Hurtado Villa Sofía",
  "89B-20-SALOME": "Londoño Arenas Salomé",
  "89B-21-SAMUEL": "Mejía Marulanda Samuel David",
  "89B-22-VALENTINA": "Piza Herrera Valentina",
  "89B-23-DEIBY": "Ramírez Ramírez Deiby Alexander",
  "89B-24-JEILER": "Ríos Duque Jeiler Adrián",
  "89B-25-HEIDYS": "Ríos Martínez Heidys",
  "89B-26-CAMILA2": "Rondón Quiñones Camila Alejandra",
  "89B-27-LUCIANA": "Sierra Zapata Luciana",
  "89B-28-SOFIA2": "Úsuga Mazo Sofía",
  "89B-29-LUISA": "Velasquez Berrio Luisa Fernanda",
  "89B-30-SALOME2": "Velásquez Londoño Salomé",
  "89B-31-MARIANA": "Villada Villa Mariana"
};

const PAGES = [
  {
    key: "mixtos",
    menuTitle: "Mixtos",
    title: "Página 1 · Números mixtos",
    description: "Da tus primeros pasos como amigo de las matemáticas comprendiendo y transformando números mixtos en diferentes formas.",
    teacherValidationCode: "VAL-MIX-01",
    cards: [
      { title: "Número mixto", image: "images/mixtos/1.png", unlockCodes: [
        "MIX-X9Q7-4K2","MIX-B7L2-Z9P","MIX-R3T8-1VX","MIX-Q6M4-W2A",
        "MIX-Z8P1-K7D","MIX-H5X9-2NB","MIX-C2V7-R8Y","MIX-T9K3-L4W",
        "MIX-J4N8-X6Q","MIX-F8R1-P3Z"
      ] },
      { title: "De mixto a impropia", image: "images/mixtos/2.png", unlockCodes: [
        "MIX-Y7D2-8QK","MIX-K3P9-X5T","MIX-V8A4-R2M","MIX-N6Z1-W7L","MIX-P4T8-3XB",
        "MIX-L9Q2-V6H","MIX-A5R7-J8C","MIX-W2X9-M4D","MIX-D8K3-P1Y","MIX-X7M5-T9R"
      ] },
      { title: "De impropia a mixto", image: "images/mixtos/3.png", unlockCodes: [
        "MIX-Q8Z3-V2P","MIX-M4T7-K9A","MIX-B9X1-R6D","MIX-T3P8-W5N","MIX-L7K2-Y4Q",
        "MIX-R2V9-J8M","MIX-Z5A4-P3X","MIX-H8D1-T7L","MIX-X6N3-Q9K","MIX-C4M8-V2R"
      ] },
      { title: "Error común", image: "images/mixtos/4.png", unlockCodes: [
        "MIX-D7Q1-L9X","MIX-P8M3-R2K","MIX-Y4T9-A6V","MIX-K2X8-N7D",
        "MIX-W9R5-Z1P","MIX-F3L7-Q8M","MIX-J6P2-T4Y","MIX-V1N9-X3K",
        "MIX-X8C4-R7L","MIX-Z2M6-P9D"
      ] },
      { title: "Aplicación en receta", image: "images/mixtos/5.png", unlockCodes: [
        "MIX-T9X2-Q4M","MIX-A3K8-L7P","MIX-M6R1-V9D","MIX-Q2P7-X5Z",
        "MIX-K8D4-N3T","MIX-L1Z9-R6M","MIX-V5X3-A8K","MIX-Y7M2-Q9L",
        "MIX-R4T8-P1X","MIX-X9L6-D2K"
      ] },
      { title: "Reto final", image: "images/mixtos/6.png", unlockCodes: [
        "MIX-Z9X4-P7K","MIX-K2R8-M5Q","MIX-T7L3-X9D","MIX-P6A1-V8N",
        "MIX-X4Q9-K2M","MIX-M8D2-R7T","MIX-Y3P6-Z1X","MIX-R9N5-L4K",
        "MIX-V2X7-P8A","MIX-D6K1-T9Q"
      ] }
    ]
  },

  {
    key: "enteros",
    menuTitle: "Enteros",
    title: "Página 2 · Números enteros",
    description: "Sigue tu camino como amigo de las matemáticas dominando los números enteros en la recta numérica y en la vida real.",
    teacherValidationCode: "VAL-ENT-02",
    cards: [
      { title: "Recta numérica", image: "images/enteros/1.png", unlockCodes: [
        "ENT-X7K2-9QP","ENT-B4M8-R2L","ENT-Z9A1-W3X","ENT-T5Q7-K8N",
        "ENT-P2V6-L4D","ENT-H8R3-Y7F","ENT-C6N1-X9M","ENT-J3K5-P2W",
        "ENT-F9L2-R8Z","ENT-M7Q4-T1A"
      ] },
      { title: "Suma de enteros", image: "images/enteros/2.png", unlockCodes: [
        "ENT-A9K3-2LM","ENT-D4P8-X7Q","ENT-R2W6-5NB","ENT-K8T1-Z3V",
        "ENT-Y7L4-M9C","ENT-Q3X2-8RP","ENT-B6N5-L2F","ENT-H1Z9-K4W",
        "ENT-U5M7-3XA","ENT-P8R2-6JD"
      ] },
      { title: "Resta de enteros", image: "images/enteros/3.png", unlockCodes: [
        "ENT-V3Q8-1ZT","ENT-L9K2-7MP","ENT-X5N4-2RW","ENT-T1B7-9QC",
        "ENT-M6R3-K8A","ENT-Z2P5-4YL","ENT-J8W1-X6F","ENT-C4T9-3NB",
        "ENT-F7L2-8QX","ENT-A1D6-5RM"
      ] },
      { title: "Valor absoluto", image: "images/enteros/4.png", unlockCodes: [
        "ENT-E7K3-9XP","ENT-R5M2-4LQ","ENT-B9T6-1ZW","ENT-Y3N8-7RC",
        "ENT-H2P4-X5M","ENT-K6W1-8JD","ENT-Z8L7-2QA","ENT-U4X9-3TB",
        "ENT-Q1R5-6NP","ENT-D7C2-8LM"
      ] },
      { title: "Aplicación real", image: "images/enteros/5.png", unlockCodes: [
        "ENT-G8K2-4ZR","ENT-T3M9-1WP","ENT-L5X6-7QB","ENT-R9P2-3NK",
        "ENT-W1C8-6XM","ENT-B7Q4-2ZT","ENT-M3D5-9LP","ENT-X8F1-4RW",
        "ENT-P6T2-7KA","ENT-Y4N9-5JC"
      ] },
      { title: "Reto final", image: "images/enteros/6.png", unlockCodes: [
        "ENT-Z7Q1-3XM","ENT-K4P8-9LR","ENT-M2T6-5WB","ENT-X9C3-1QN",
        "ENT-R8L5-2YD","ENT-B3N7-6XP","ENT-H1Q4-8ZT","ENT-F6W2-9KM",
        "ENT-J5R3-7LA","ENT-D2X8-4PC"
      ] }
    ]
  },

  {
    key: "fracciones",
    menuTitle: "Fracciones",
    title: "Página 3 · Operaciones con fracciones",
    description: "Conviértete en un verdadero amigo de las matemáticas dominando las operaciones con fracciones y resolviendo desafíos cada vez más complejos.",
    teacherValidationCode: "VAL-FRA-03",
    cards: [
      { title: "Fracciones equivalentes", image: "images/fracciones/1.png", unlockCodes: [
        "FRA-X9K2-4QP","FRA-B7M3-R8L","FRA-Z4T1-W6X","FRA-T8Q5-K2N",
        "FRA-P6V2-L9D","FRA-H3R7-Y4F","FRA-C1N8-X5M","FRA-J9K4-P7W",
        "FRA-F2L6-R3Z","FRA-M8Q1-T5A"
      ] },
      { title: "Suma de fracciones", image: "images/fracciones/2.png", unlockCodes: [
        "FRA-A8K3-2LM","FRA-D1P7-X4Q","FRA-R6W2-5NB","FRA-K9T5-Z1V",
        "FRA-Y4L8-M2C","FRA-Q2X6-7RP","FRA-B3N9-L1F","FRA-H7Z4-K5W",
        "FRA-U1M3-8XA","FRA-P5R9-2JD"
      ] },
      { title: "Resta de fracciones", image: "images/fracciones/3.png", unlockCodes: [
        "FRA-V2Q7-1ZT","FRA-L8K4-6MP","FRA-X3N5-9RW","FRA-T7B2-4QC",
        "FRA-M1R8-K6A","FRA-Z9P3-2YL","FRA-J5W6-X1F","FRA-C8T4-7NB",
        "FRA-F6L2-3QX","FRA-A4D9-5RM"
      ] },
      { title: "Multiplicación", image: "images/fracciones/4.png", unlockCodes: [
        "FRA-E9K4-3XP","FRA-R2M7-8LQ","FRA-B5T1-6ZW","FRA-Y8N3-2RC",
        "FRA-H6P9-X4M","FRA-K1W5-7JD","FRA-Z3L8-9QA","FRA-U7X2-6TB",
        "FRA-Q4R1-5NP","FRA-D8C6-2LM"
      ] },
      { title: "División de fracciones", image: "images/fracciones/5.png", unlockCodes: [
        "FRA-G2K9-8ZR","FRA-T6M1-4WP","FRA-L3X7-2QB","FRA-R8P5-6NK",
        "FRA-W4C2-9XM","FRA-B9Q8-1ZT","FRA-M7D3-5LP","FRA-X1F6-8RW",
        "FRA-P2T4-7KA","FRA-Y5N8-3JC"
      ] },
      { title: "Reto final", image: "images/fracciones/6.png", unlockCodes: [
        "FRA-Z3Q8-1XM","FRA-K7P2-9LR","FRA-M5T4-6WB","FRA-X2C9-3QN",
        "FRA-R1L7-8YD","FRA-B6N5-4XP","FRA-H8Q3-2ZT","FRA-F4W1-7KM",
        "FRA-J9R6-5LA","FRA-D2X7-8PC"
      ] }
    ]
  }
];

const app = {
  user: null,
  pageIndex: 0,
  state: null
};

const $ = (id) => document.getElementById(id);

const dom = {
  loginScreen: $("loginScreen"),
  albumScreen: $("albumScreen"),
  adminScreen: $("adminScreen"),
  usernameInput: $("usernameInput"),
  enterBtn: $("enterBtn"),
  loginFeedback: $("loginFeedback"),
  studentLine: $("studentLine"),
  codeInput: $("codeInput"),
  useCodeBtn: $("useCodeBtn"),
  feedback: $("feedback"),
  progressFill: $("progressFill"),
  progressText: $("progressText"),
  completeBox: $("completeBox"),
  validatedBox: $("validatedBox"),
  validatedText: $("validatedText"),
  teacherValidateBtn: $("teacherValidateBtn"),
  teacherModal: $("teacherModal"),
  teacherCodeInput: $("teacherCodeInput"),
  confirmTeacherBtn: $("confirmTeacherBtn"),
  closeTeacherBtn: $("closeTeacherBtn"),
  teacherFeedback: $("teacherFeedback"),
  pageTabs: $("pageTabs"),
  albumGrid: $("albumGrid"),
  pageTitle: $("pageTitle"),
  pageMeta: $("pageMeta"),
  backBtn: $("backBtn"),
};

function normalizeUser(value) {
  return String(value || "").trim().toUpperCase();
}

function defaultState() {
  const unlockedByPage = {};
  const usedCodesByPage = {};
  const validatedByPage = {};

  for (const page of PAGES) {
    unlockedByPage[page.key] = Array(page.cards.length).fill(false);
    usedCodesByPage[page.key] = [];
    validatedByPage[page.key] = { done: false, date: "" };
  }

  return { unlockedByPage, usedCodesByPage, validatedByPage };
}

function getUserState() {
  return app.state || defaultState();
}

function currentPage() {
  return PAGES[app.pageIndex];
}

function studentName() {
  return STUDENTS[app.user] || app.user || "";
}

function storageSnapshot() {
  const s = getUserState();
  return {
    username: app.user,
    fullName: studentName(),
    unlockedByPage: s.unlockedByPage,
    usedCodesByPage: s.usedCodesByPage,
    validatedByPage: s.validatedByPage,
    updatedAt: new Date().toISOString()
  };
}

function playTone({ frequency = 440, duration = 120, type = "sine", gain = 0.04, startAfter = 0 }) {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = playTone.ctx || (playTone.ctx = new AudioCtx());
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime + startAfter;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, now);
  amp.gain.setValueAtTime(0.0001, now);
  amp.gain.exponentialRampToValueAtTime(gain, now + 0.01);
  amp.gain.exponentialRampToValueAtTime(0.0001, now + duration / 1000);

  osc.connect(amp);
  amp.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration / 1000 + 0.02);
}

function successSound() {
  playTone({ frequency: 660, duration: 90, type: "square", gain: 0.03 });
  playTone({ frequency: 880, duration: 110, type: "square", gain: 0.025, startAfter: 0.1 });
}

function errorSound() {
  playTone({ frequency: 180, duration: 170, type: "sawtooth", gain: 0.03 });
  playTone({ frequency: 140, duration: 170, type: "sawtooth", gain: 0.02, startAfter: 0.08 });
}

function setScreen(name) {
  dom.loginScreen.classList.toggle("screen--active", name === "login");
  dom.albumScreen.classList.toggle("screen--active", name === "album");
  if (adminDom.adminScreen) {
    adminDom.adminScreen.classList.toggle("screen--active", name === "admin");
  }
}

function showLoginFeedback(message, kind = "info") {
  dom.loginFeedback.textContent = message;
  dom.loginFeedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--muted)";

  dom.loginFeedback.classList.remove("show");
  void dom.loginFeedback.offsetWidth;
  dom.loginFeedback.classList.add("show");
}

function showFeedback(message, kind = "info") {
  dom.feedback.textContent = message;
  dom.feedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--text)";

  dom.feedback.classList.remove("show");
  void dom.feedback.offsetWidth;
  dom.feedback.classList.add("show");
}

function showTeacherFeedback(message, kind = "info") {
  dom.teacherFeedback.textContent = message;
  dom.teacherFeedback.style.color =
    kind === "success" ? "var(--success)" :
    kind === "error" ? "var(--danger)" :
    "var(--text)";

  dom.teacherFeedback.classList.remove("show");
  void dom.teacherFeedback.offsetWidth;
  dom.teacherFeedback.classList.add("show");
}

function updateHeader() {
  dom.studentLine.textContent = `${studentName()} · ${app.user} · Grupo 8-9 B`;
  dom.pageTitle.textContent = currentPage().title;
  dom.pageMeta.textContent = currentPage().description;
}

function renderStats() {
  const statsEl = document.getElementById("statsContent");
  if (!statsEl || !app.state) return;
  
  let totalUnlocked = 0;
  let totalCards = 0;
  let validatedPages = 0;
  
  for (const page of PAGES) {
    const unlocked = app.state.unlockedByPage?.[page.key] || [];
    totalUnlocked += unlocked.filter(Boolean).length;
    totalCards += page.cards.length;
    if (app.state.validatedByPage?.[page.key]?.done) validatedPages++;
  }
  
  statsEl.innerHTML = `
    <div><strong>${totalUnlocked}</strong> / ${totalCards} láminas</div>
    <div><strong>${validatedPages}</strong> / ${PAGES.length} páginas validadas</div>
  `;
}

function renderTabs() {
  dom.pageTabs.innerHTML = "";

  PAGES.forEach((page, idx) => {
    const btn = document.createElement("button");
    const state = getPageState(page.key);

    let icon = "";
    if (state === "validated") icon = "🟢";
    else if (state === "completed") icon = "🟠";
    else if (state === "inprogress") icon = "🟡";
    else icon = "🔴";

    btn.className = `page-tab ${idx === app.pageIndex ? "is-active" : ""}`;

    const name = page.menuTitle || page.title;
    btn.textContent = `${icon} ${name}`;

    btn.onclick = () => {
      app.pageIndex = idx;
      dom.feedback.textContent = "";
      renderAll();
    };

    dom.pageTabs.appendChild(btn);
  });
}

function ensurePageState() {
  if (!app.state) app.state = defaultState();

  const key = currentPage().key;
  if (!Array.isArray(app.state.unlockedByPage[key])) {
    app.state.unlockedByPage[key] = Array(currentPage().cards.length).fill(false);
  }
  if (!Array.isArray(app.state.usedCodesByPage[key])) {
    app.state.usedCodesByPage[key] = [];
  }
  if (!app.state.validatedByPage[key]) {
    app.state.validatedByPage[key] = { done: false, date: "" };
  }
}

function ensurePageStateFor(pageKey) {
  if (!app.state) app.state = defaultState();

  const page = PAGES.find((p) => p.key === pageKey);
  if (!page) return;

  if (!Array.isArray(app.state.unlockedByPage[pageKey])) {
    app.state.unlockedByPage[pageKey] = Array(page.cards.length).fill(false);
  }
  if (!Array.isArray(app.state.usedCodesByPage[pageKey])) {
    app.state.usedCodesByPage[pageKey] = [];
  }
  if (!app.state.validatedByPage[pageKey]) {
    app.state.validatedByPage[pageKey] = { done: false, date: "" };
  }
}

function findMatchingCard(code) {
  const normalized = normalizeUser(code);

  for (let pageIndex = 0; pageIndex < PAGES.length; pageIndex++) {
    const page = PAGES[pageIndex];

    for (let cardIndex = 0; cardIndex < page.cards.length; cardIndex++) {
      const card = page.cards[cardIndex];
      const match = card.unlockCodes.some((c) => normalizeUser(c) === normalized);

      if (match) {
        return {
          pageKey: page.key,
          pageIndex,
          cardIndex,
          card
        };
      }
    }
  }

  return null;
}

function isCodeUsedAnywhere(code) {
  const normalized = normalizeUser(code);

  return PAGES.some((page) => {
    const used = app.state?.usedCodesByPage?.[page.key] || [];
    return used.some((c) => normalizeUser(c) === normalized);
  });
}

function currentUnlocked() {
  ensurePageState();
  return app.state.unlockedByPage[currentPage().key];
}

function currentUsedCodes() {
  ensurePageState();
  return app.state.usedCodesByPage[currentPage().key];
}

function currentValidated() {
  ensurePageState();
  return app.state.validatedByPage[currentPage().key];
}

function getPageState(pageKey) {
  const state = app.state || defaultState();
  const unlocked = state.unlockedByPage[pageKey] || [];
  const validated = state.validatedByPage[pageKey]?.done;

  const done = unlocked.filter(Boolean).length;
  const total = unlocked.length;

  if (validated) return "validated";
  if (done === total && total > 0) return "completed";
  if (done > 0) return "inprogress";
  return "notstarted";
}

function setDefaultFeedback(message, kind = "info") {
  showFeedback(message, kind);
}

function renderProgress() {
  const unlocked = currentUnlocked();
  const done = unlocked.filter(Boolean).length;
  const total = unlocked.length;

  const isCompleted = done === total;
  const isValidated = currentValidated().done;

  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressText.textContent = `${done} / ${total} láminas`;

  dom.completeBox?.classList.toggle("hidden", !isCompleted || isValidated);
  dom.validatedBox?.classList.toggle("hidden", !isValidated);

  if (isValidated) {
    dom.validatedText.textContent = `Validada el ${currentValidated().date || "sin fecha"}.`;
  }

  if (!isCompleted) {
    setDefaultFeedback("Ingresa un código para desbloquear una lámina.", "info");
  } else if (isCompleted && !isValidated) {
    setDefaultFeedback("🎉 Página completada. Solicita validación del docente.", "success");
  } else if (isValidated) {
    setDefaultFeedback("✅ Página validada. Puedes continuar con la siguiente.", "success");
  }

  dom.codeInput.disabled = isValidated;
  dom.useCodeBtn.disabled = isValidated;

  if (isValidated) {
    dom.codeInput.placeholder = "Página validada ✔";
  } else {
    dom.codeInput.placeholder = "Ej: MIX-A7K-101";
  }

  dom.codeInput.style.opacity = isValidated ? "0.5" : "1";
  dom.useCodeBtn.style.opacity = isValidated ? "0.5" : "1";
}

async function imageExists(path) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = path;
  });
}

async function buildCard(card, index) {
  const unlocked = currentUnlocked()[index];
  const wrapper = document.createElement("article");
  wrapper.className = `card ${unlocked ? "card--unlocked" : ""}`;

  if (!unlocked) {
    wrapper.innerHTML = `
      <div class="card__lock">🔒</div>
      <div class="card__title">${card.title}</div>
    `;
    return wrapper;
  }

  const exists = await imageExists(card.image);
  if (exists) {
    wrapper.innerHTML = `
      <img class="card__img" src="${card.image}" alt="${card.title}" />
      <div class="card__title">${card.title}</div>
    `;
  } else {
    wrapper.innerHTML = `
      <div class="card__lock" style="font-size:1.55rem;background:linear-gradient(180deg, rgba(16,26,51,.9), rgba(11,15,31,.96));">
        🖼️ Imagen no cargada
      </div>
      <div class="card__title">${card.title}</div>
    `;
  }

  return wrapper;
}

async function renderAlbum() {
  dom.albumGrid.innerHTML = "";
  const page = currentPage();

  for (let i = 0; i < page.cards.length; i++) {
    const node = await buildCard(page.cards[i], i);
    dom.albumGrid.appendChild(node);
  }

  renderProgress();
  renderTabs();
  updateHeader();
}

async function renderAll() {
  updateHeader();
  renderTabs();
  renderStats();
  await renderAlbum();
}

function saveToCloud() {
  if (!app.user) return Promise.resolve();

  const snapshot = storageSnapshot();
  const localKey = `albumState_${app.user}`;
  
  // Siempre guardar en localStorage primero (más confiable)
  try {
    localStorage.setItem(localKey, JSON.stringify(snapshot));
    console.log("💾 Guardado en localStorage:", app.user);
  } catch (e) {
    console.warn("Error guardando en localStorage:", e);
  }

  // Luego intentar guardar en la nube
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
      action: "save",
      ...snapshot
    })
  }).catch((err) => {
    console.warn("No se pudo guardar en la nube (usando localStorage):", err.message);
  });
}

async function loadFromCloud(username) {
  const localKey = `albumState_${username}`;
  try {
    const url = `${API_URL}?action=load&username=${encodeURIComponent(username)}`;
    const res = await fetch(url, { method: "GET", mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.state) {
      console.log("☁️ Cargando desde la nube:", username);
      localStorage.setItem(localKey, JSON.stringify(data.state));
      return data.state;
    }
  } catch (err) {
    console.warn("Error cargando desde la nube:", err.message);
  }
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      console.log("📦 Cargando desde localStorage:", username);
      return parsed;
    } catch (e) {
      console.warn("Error parseando localStorage:", e);
    }
  }
  console.log("📝 Usando estado por defecto:", username);
  return defaultState();
}

async function loadAllStudentsFromCloud() {
  try {
    const url = `${API_URL}?action=loadall`;
    const res = await fetch(url, { method: "GET", mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (data && data.students) {
      console.log("☁️ Estudiantes cargados:", Object.keys(data.students).length);
      return data.students;
    }
  } catch (err) {
    console.warn("Error cargando estudiantes:", err.message);
  }

  // ELIMINÉ LA LLAVE QUE CERRABA AQUÍ PREMATURAMENTE
  
  // Si la nube falla o no hay datos, intentar desde localStorage
  const localData = localStorage.getItem(localKey);
  if (localData) {
    try {
      const parsed = JSON.parse(localData);
      console.log("📦 Cargando desde localStorage (fallback):", username);
      return parsed;
    } catch (e) {
      console.warn("Error parseando localStorage:", e);
    }
  }
  
  console.log("📝 Usando estado por defecto:", username);
  return defaultState();
} // ESTA ES LA LLAVE QUE CIERRA LA FUNCIÓN CORRECTAMENTE

function findMatchingSlot(code) {
  const normalized = normalizeUser(code);
  const page = currentPage();
  const unlocked = currentUnlocked();

  return page.cards.findIndex((card, idx) => {
    const notYet = !unlocked[idx];
    const match = card.unlockCodes.some((c) => normalizeUser(c) === normalized);
    return notYet && match;
  });
}

async function login() {
  const user = normalizeUser(dom.usernameInput.value);

  if (!user) {
    errorSound();
    showLoginFeedback("Escribe tu usuario.", "error");
    return;
  }

  if (!STUDENTS[user]) {
    errorSound();
    showLoginFeedback("Ese usuario no está registrado.", "error");
    return;
  }

  try {
    app.user = user;
    localStorage.setItem("albumUser", user);

    showLoginFeedback("Cargando progreso...");
    app.state = await loadFromCloud(user);
    ensurePageState();
    setScreen("album");

    // Mostrar información de origen de datos
    const hasLocal = localStorage.getItem(`albumState_${user}`);
    showFeedback(hasLocal 
      ? `☁️ Datos cargados desde la nube. Bienvenido.` 
      : `📦 No había datos previos. Comenzaste desde cero.`, "info");
    showLoginFeedback("", "info");

    successSound();
    await renderAll();
  } catch (err) {
    console.error(err);
    errorSound();
    showLoginFeedback("Error al cargar. Usando datos locales.", "error");
    app.state = defaultState();
    ensurePageState();
    setScreen("album");
    await renderAll();
  }
}

function logout() {
  app.user = null;
  localStorage.removeItem("albumUser");

  app.pageIndex = 0;
  app.state = null;
  dom.usernameInput.value = "";
  dom.codeInput.value = "";
  dom.feedback.textContent = "";
  dom.studentLine.textContent = "";
  dom.albumGrid.innerHTML = "";
  dom.progressFill.style.width = "0%";
  dom.progressText.textContent = "0 / 6 láminas";
  dom.completeBox.classList.add("hidden");
  dom.validatedBox.classList.add("hidden");
  setScreen("login");
}

async function useCode() {
  const code = normalizeUser(dom.codeInput.value);

  if (!code) {
    errorSound();
    showFeedback("Ingresa un código primero.", "error");
    return;
  }

  let match = null;

  for (let p = 0; p < PAGES.length; p++) {
    const page = PAGES[p];

    for (let c = 0; c < page.cards.length; c++) {
      const card = page.cards[c];

      const found = card.unlockCodes.some((k) => normalizeUser(k) === code);

      if (found) {
        match = {
          pageKey: page.key,
          pageIndex: p,
          cardIndex: c,
          card
        };
        break;
      }
    }

    if (match) break;
  }

  if (!match) {
    errorSound();
    showFeedback("Código incorrecto.", "error");
    return;
  }

  if (isCodeUsedAnywhere(code)) {
    errorSound();
    showFeedback("Este código ya fue utilizado.", "error");
    return;
  }

  ensurePageStateFor(match.pageKey);

  const unlocked = app.state.unlockedByPage[match.pageKey];

  if (unlocked[match.cardIndex]) {
    errorSound();
    showFeedback("Esa lámina ya estaba desbloqueada.", "error");
    return;
  }

  unlocked[match.cardIndex] = true;
  app.state.usedCodesByPage[match.pageKey].push(code);

  dom.codeInput.value = "";

  const pageName = PAGES[match.pageIndex].title;

  if (match.pageKey === currentPage().key) {
    showFeedback(`¡Lámina desbloqueada! (${match.card.title})`, "success");
  } else {
    showFeedback(`🎯 Desbloqueaste una lámina en otra página: ${pageName}`, "success");
  }

  successSound();

  await saveToCloud();
  
  // Verificar logros
  checkAchievements(app.state);
  
  await renderAll();

  const pageState = app.state.unlockedByPage[match.pageKey] || [];
  const unlockedCount = pageState.filter(Boolean).length;

  if (unlockedCount === pageState.length && pageState.length > 0) {
    setTimeout(() => {
      successSound();
      if (match.pageKey === currentPage().key) {
        showFeedback("🎉 ¡Página completada! Ve donde tu profe, sustenta y valida la página.", "success");
      } else {
        showFeedback(`🎉 ¡La página ${pageName} quedó completa!`, "success");
      }
    }, 220);
  }
}

function openTeacherModal() {
  if (currentUnlocked().filter(Boolean).length !== currentUnlocked().length) {
    errorSound();
    showFeedback("Primero completa las 6 láminas.", "error");
    return;
  }

  dom.teacherCodeInput.value = "";
  showTeacherFeedback("");
  dom.teacherModal.classList.remove("hidden");
  dom.teacherModal.setAttribute("aria-hidden", "false");
}

function closeTeacherModal() {
  dom.teacherModal.classList.add("hidden");
  dom.teacherModal.setAttribute("aria-hidden", "true");
}

async function confirmTeacherValidation() {
  const currentIndex = PAGES.findIndex((p) => p.key === currentPage().key);

  if (currentIndex > 0) {
    const prevPage = PAGES[currentIndex - 1];
    const prevValidated = app.state.validatedByPage[prevPage.key];

    if (!prevValidated || !prevValidated.done) {
      errorSound();
      showTeacherFeedback("Debes validar la página anterior primero.", "error");
      return;
    }
  }

  const code = normalizeUser(dom.teacherCodeInput.value);

  if (!code) {
    errorSound();
    showTeacherFeedback("Ingresa el código de validación.", "error");
    return;
  }

  if (code !== normalizeUser(currentPage().teacherValidationCode)) {
    errorSound();
    showTeacherFeedback("Código de validación incorrecto.", "error");
    return;
  }

  currentValidated().done = true;
  currentValidated().date = new Date().toLocaleDateString("es-CO");

  await saveToCloud();
  
  // Verificar logros después de validar
  checkAchievements(app.state);

  successSound();
  showTeacherFeedback("Página marcada como evaluada.", "success");

  closeTeacherModal();
  await renderAll();

  showFeedback("✅ Página evaluada y registrada en la nube.", "success");
}

function wireEvents() {
  dom.enterBtn.addEventListener("click", login);
  dom.usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") login();
  });

  dom.useCodeBtn.addEventListener("click", useCode);
  dom.codeInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") useCode();
  });

  dom.teacherValidateBtn.addEventListener("click", openTeacherModal);
  dom.confirmTeacherBtn.addEventListener("click", confirmTeacherValidation);
  dom.closeTeacherBtn.addEventListener("click", closeTeacherModal);
  dom.teacherModal.addEventListener("click", (e) => {
    if (e.target === dom.teacherModal) closeTeacherModal();
  });

  dom.backBtn.addEventListener("click", logout);

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Escape closes modals
    if (e.key === "Escape") {
      closeTeacherModal();
      closeAdminModal();
    }
    // Ctrl+K para focus en código
    if (e.ctrlKey && e.key === "k") {
      e.preventDefault();
      dom.codeInput.focus();
    }
    // Ctrl+Shift+A para Admin
    if (e.ctrlKey && e.shiftKey && e.key === "A") {
      e.preventDefault();
      if (app.user === "ADMIN") {
        setScreen("admin");
        renderAdminWelcome();
      }
    }
  });
}

// ==========================================
// SISTEMA DE LOGROS / ACHIEVEMENTS
// ==========================================

const ACHIEVEMENTS = [
  { id: "firstCard", title: "Primera Lámina", icon: "🌟", description: "Desbloquea tu primera lámina", condition: (s) => countTotalUnlocked(s) >= 1 },
  { id: "fiveCards", title: "Coleccionista", icon: "📚", description: "Desbloquea 5 láminas", condition: (s) => countTotalUnlocked(s) >= 5 },
  { id: "pageComplete", title: "Página Completa", icon: "📄", description: "Completa una página", condition: (s) => anyPageComplete(s) },
  { id: "firstValidated", title: "Aprobado", icon: "✅", description: "Valida tu primera página", condition: (s) => anyPageValidated(s) },
  { id: "allPages", title: "Matemático Maestro", icon: "🏆", description: "Valida todas las páginas", condition: (s) => allPagesValidated(s) },
  { id: "fastUnlock", title: "Velocista", icon: "⚡", description: "Desbloquea 3 láminas en un día", condition: (s) => hasFastUnlocks(s) }
];

function countTotalUnlocked(state) {
  if (!state || !state.unlockedByPage) return 0;
  let total = 0;
  for (const key in state.unlockedByPage) {
    total += state.unlockedByPage[key].filter(Boolean).length;
  }
  return total;
}

function anyPageComplete(state) {
  if (!state || !state.unlockedByPage) return false;
  for (const key in state.unlockedByPage) {
    const unlocked = state.unlockedByPage[key];
    if (unlocked.length > 0 && unlocked.filter(Boolean).length === unlocked.length) {
      return true;
    }
  }
  return false;
}

function anyPageValidated(state) {
  if (!state || !state.validatedByPage) return false;
  for (const key in state.validatedByPage) {
    if (state.validatedByPage[key]?.done) return true;
  }
  return false;
}

function allPagesValidated(state) {
  if (!state || !state.validatedByPage) return false;
  for (const page of PAGES) {
    if (!state.validatedByPage[page.key]?.done) return false;
  }
  return true;
}

function hasFastUnlocks(state) {
  // Por ahora retorna false - se implementaría con timestamps
  return false;
}

function checkAchievements(state) {
  const earned = JSON.parse(localStorage.getItem("albumAchievements") || "[]");
  const newAchievements = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (!earned.includes(achievement.id) && achievement.condition(state)) {
      earned.push(achievement.id);
      newAchievements.push(achievement);
    }
  }
  
  if (newAchievements.length > 0) {
    localStorage.setItem("albumAchievements", JSON.stringify(earned));
    // Mostrar el primer logro nuevo
    showAchievement(newAchievements[0]);
  }
}

function showAchievement(achievement) {
  const toast = document.getElementById("achievementToast");
  if (!toast) return;
  
  const iconEl = toast.querySelector(".toast-icon");
  const titleEl = toast.querySelector(".toast-title");
  const descEl = toast.querySelector(".toast-description");
  
  if (iconEl) iconEl.textContent = achievement.icon;
  if (titleEl) titleEl.textContent = achievement.title;
  if (descEl) descEl.textContent = achievement.description;
  
  toast.classList.remove("hidden");
  
  // Auto-ocultar después de 4 segundos
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 4000);
}

function getEarnedAchievements() {
  return JSON.parse(localStorage.getItem("albumAchievements") || "[]");
}

// ==========================================
// ADMIN PANEL
// ==========================================

const ADMIN_CODE = "ADMIN2024";

const adminDom = {
  adminScreen: document.getElementById("adminScreen"),
  adminBackBtn: document.getElementById("adminBackBtn"),
  viewAllStudentsBtn: document.getElementById("viewAllStudentsBtn"),
  generateCodesBtn: document.getElementById("generateCodesBtn"),
  viewStatsBtn: document.getElementById("viewStatsBtn"),
  resetStudentBtn: document.getElementById("resetStudentBtn"),
  adminSearchInput: document.getElementById("adminSearchInput"),
  adminSearchResults: document.getElementById("adminSearchResults"),
  adminTitle: document.getElementById("adminTitle"),
  adminMeta: document.getElementById("adminMeta"),
  adminContent: document.getElementById("adminContent")
};

function openAdminLogin() {
  const code = prompt("Ingresa el código de administrador:");
  if (code === ADMIN_CODE) {
    app.user = "ADMIN";
    setScreen("admin");
    renderAdminWelcome();
  } else if (code) {
    errorSound();
    alert("Código incorrecto");
  }
}

function renderAdminWelcome() {
  if (!adminDom.adminTitle) return;
  adminDom.adminTitle.textContent = "Panel de Administración";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Selecciona una acción del panel lateral";
  
  if (adminDom.adminContent) {
    adminDom.adminContent.innerHTML = `
      <div class="admin-welcome">
        <div style="font-size:64px; margin-bottom:16px;">🎓</div>
        <h3>Bienvenido al Panel de Admin</h3>
        <p>Selecciona una opción para comenzar a gestionar el álbum.</p>
      </div>
    `;
  }
}

// Pega este bloque en tu app(1).js
// Reemplaza la función vieja renderAllStudents() y agrega viewStudentDetail().
// La API_URL puedes dejarla tal como está si esa es la implementación que ya te funciona.
// Si luego creas otro deployment de Apps Script, solo cambias la URL aquí.

function calculateStudentSummary(studentState) {
  const unlockedByPage = studentState?.unlockedByPage || {};
  const validatedByPage = studentState?.validatedByPage || {};

  let totalUnlocked = 0;
  let totalCards = 0;
  let validatedCount = 0;

  for (const page of PAGES) {
    const pageUnlocked = unlockedByPage[page.key] || [];
    totalUnlocked += pageUnlocked.filter(Boolean).length;
    totalCards += page.cards.length;
    if (validatedByPage[page.key]?.done) validatedCount++;
  }

  return {
    totalUnlocked,
    totalCards,
    validatedCount,
    progressPercent: totalCards > 0 ? Math.round((totalUnlocked / totalCards) * 100) : 0,
  };
}

function renderAllStudents() {
  if (!adminDom.adminContent) return;

  adminDom.adminContent.innerHTML = `
    <div style="text-align:center; padding:40px;">
      <div style="font-size:32px; margin-bottom:16px;">⏳</div>
      <p>Cargando datos de estudiantes...</p>
    </div>
  `;

  loadAllStudentsFromCloud()
    .then((allStudents) => {
      const studentsData = allStudents || {};

      let html = `
        <div style="margin-bottom:16px;">
          <input type="text" id="adminStudentSearch" placeholder="🔍 Buscar estudiante..."
            style="width:100%; padding:12px 16px; border-radius:12px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); color:var(--text); font-size:1rem;">
        </div>
        <div style="overflow-x:auto;">
          <table class="admin-table" id="studentsTable">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Láminas</th>
                <th>Validadas</th>
                <th>Última actividad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
      `;

      for (const [user, name] of Object.entries(STUDENTS)) {
        const studentState = studentsData[user] || {};
        const summary = calculateStudentSummary(studentState);
        const lastActivity = studentState.updatedAt
          ? new Date(studentState.updatedAt).toLocaleDateString("es-CO")
          : "-";

        html += `
          <tr class="student-row" data-user="${user}" data-name="${name.toLowerCase()}">
            <td><strong>${user}</strong></td>
            <td>${name}</td>
            <td>
              <div class="progress-mini" title="${summary.totalUnlocked}/${summary.totalCards} láminas">
                <span style="width:${summary.progressPercent}%"></span>
              </div>
              <small>${summary.totalUnlocked}/${summary.totalCards}</small>
            </td>
            <td>${summary.validatedCount} / ${PAGES.length}</td>
            <td>${lastActivity}</td>
            <td>
              <button class="btn btn--ghost" style="padding:6px 12px; font-size:.85rem;"
                onclick="viewStudentDetail('${user}')">👁️ Ver</button>
            </td>
          </tr>
        `;
      }

      html += `
            </tbody>
          </table>
        </div>
        <p style="margin-top:16px; color:var(--muted); font-size:.9rem;">
          <em>💡 Doble clic en una fila o usa el botón para ver el detalle completo del estudiante.</em>
        </p>
      `;

      adminDom.adminContent.innerHTML = html;
      if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Todos los Estudiantes";
      if (adminDom.adminMeta) adminDom.adminMeta.textContent = `${Object.keys(STUDENTS).length} estudiantes registrados`;

      setTimeout(() => {
        const searchInput = document.getElementById("adminStudentSearch");
        if (searchInput) {
          searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            document.querySelectorAll(".student-row").forEach((row) => {
              const user = row.dataset.user.toLowerCase();
              const name = row.dataset.name;
              row.style.display = (user.includes(query) || name.includes(query)) ? "" : "none";
            });
          });
        }
      }, 100);
    })
    .catch((err) => {
      adminDom.adminContent.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--danger);">
          <div style="font-size:32px; margin-bottom:16px;">⚠️</div>
          <p>Error al cargar datos: ${err.message}</p>
          <button class="btn btn--primary" onclick="renderAllStudents()">🔄 Reintentar</button>
        </div>
      `;
    });
}

function viewStudentDetail(username) {
  const name = STUDENTS[username] || username;

  loadAllStudentsFromCloud()
    .then((allStudents) => {
      const studentState = allStudents?.[username] || {};
      const unlockedByPage = studentState.unlockedByPage || {};
      const validatedByPage = studentState.validatedByPage || {};
      const usedCodesByPage = studentState.usedCodesByPage || {};

      let detailHtml = `
        <div style="margin-bottom:24px;">
          <button class="btn btn--ghost" onclick="renderAllStudents()">← Volver a la lista</button>
        </div>
        <div style="background:rgba(255,255,255,.05); padding:20px; border-radius:16px; margin-bottom:24px;">
          <h3 style="margin:0 0 8px 0;">${name}</h3>
          <p style="margin:0; color:var(--muted);">${username}</p>
          <p style="margin:8px 0 0 0; color:var(--muted); font-size:.9rem;">
            Última actividad: ${studentState.updatedAt ? new Date(studentState.updatedAt).toLocaleString("es-CO") : "Sin registro"}
          </p>
        </div>
      `;

      for (const page of PAGES) {
        const pageUnlocked = unlockedByPage[page.key] || [];
        const pageValidated = validatedByPage[page.key] || {};
        const pageCodes = usedCodesByPage[page.key] || [];
        const unlockedCount = pageUnlocked.filter(Boolean).length;
        const totalCards = page.cards.length;
        const isValidated = !!pageValidated.done;
        const progressPercent = totalCards > 0 ? Math.round((unlockedCount / totalCards) * 100) : 0;

        detailHtml += `
          <div style="background:rgba(255,255,255,.03); padding:16px; border-radius:12px; margin-bottom:16px; border-left:4px solid ${isValidated ? 'var(--success)' : 'var(--muted)'}">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom:12px;">
              <h4 style="margin:0;">${page.menuTitle}</h4>
              <span style="background:${isValidated ? 'var(--success)' : 'rgba(255,255,255,.1)'}; padding:4px 12px; border-radius:20px; font-size:.85rem;">
                ${isValidated ? '✅ Validada' : '⏳ En progreso'}
              </span>
            </div>
            <div class="progress-mini" style="margin-bottom:8px;">
              <span style="width:${progressPercent}%"></span>
            </div>
            <p style="margin:0; font-size:.9rem; color:var(--muted);">
              ${unlockedCount} / ${totalCards} láminas desbloqueadas
              ${pageCodes.length > 0 ? ` • ${pageCodes.length} códigos usados` : ''}
              ${pageValidated.date ? ` • Validada el ${pageValidated.date}` : ''}
            </p>
          </div>
        `;
      }

      adminDom.adminContent.innerHTML = detailHtml;
      if (adminDom.adminTitle) adminDom.adminTitle.textContent = `Detalle: ${name}`;
      if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Vista detallada del estudiante";
    })
    .catch((err) => {
      adminDom.adminContent.innerHTML = `
        <div style="text-align:center; padding:40px; color:var(--danger);">
          <div style="font-size:32px; margin-bottom:16px;">⚠️</div>
          <p>Error al cargar detalle: ${err.message}</p>
          <button class="btn btn--primary" onclick="viewStudentDetail('${username}')">🔄 Reintentar</button>
        </div>
      `;
    });
}

window.viewStudentDetail = viewStudentDetail;


function renderGlobalStats() {
  if (!adminDom.adminContent) return;
  
  // Calcular estadísticas simuladas (en producción vendrían de la nube)
  const totalStudents = Object.keys(STUDENTS).length;
  const totalCards = PAGES.reduce((acc, p) => acc + p.cards.length, 0);
  const totalPages = PAGES.length;
  
  let html = `
    <div class="admin-stats-grid">
      <div class="admin-stat-card">
        <div class="stat-number">${totalStudents}</div>
        <div class="stat-label">Estudiantes</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${totalCards}</div>
        <div class="stat-label">Láminas Total</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${totalPages}</div>
        <div class="stat-label">Páginas</div>
      </div>
      <div class="admin-stat-card">
        <div class="stat-number">${Object.keys(STUDENTS).length * totalCards}</div>
        <div class="stat-label">Posibles Desbloqueos</div>
      </div>
    </div>
    
    <h3 style="margin-bottom:16px;">Distribución por Página</h3>
    <table class="admin-table">
      <thead>
        <tr>
          <th>Página</th>
          <th>Láminas</th>
          <th>Códigos Únicos</th>
        </tr>
      </thead>
      <tbody>
  `;
  
  for (const page of PAGES) {
    const codeCount = page.cards.reduce((acc, c) => acc + c.unlockCodes.length, 0);
    html += `
      <tr>
        <td><strong>${page.menuTitle}</strong></td>
        <td>${page.cards.length}</td>
        <td>${codeCount}</td>
      </tr>
    `;
  }
  
  html += `</tbody></table>`;
  
  adminDom.adminContent.innerHTML = html;
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Estísticas Globales";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Resumen del álbum completo";
}

function renderCodeGenerator() {
  if (!adminDom.adminContent) return;
  
  let html = `
    <div class="admin-code-generator">
      <div class="field">
        <label for="genPageSelect">Seleccionar Página</label>
        <select id="genPageSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
  `;
  
  for (const page of PAGES) {
    html += `<option value="${page.key}">${page.menuTitle} - ${page.title}</option>`;
  }
  
  html += `
        </select>
      </div>
      
      <div class="field">
        <label for="genCardSelect">Seleccionar Lámina</label>
        <select id="genCardSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
  `;
  
  const firstPage = PAGES[0];
  for (let i = 0; i < firstPage.cards.length; i++) {
    html += `<option value="${i}">${firstPage.cards[i].title}</option>`;
  }
  
  html += `
        </select>
      </div>
      
      <button id="generateBtn" class="btn btn--primary">🔢 Generar 5 Códigos Nuevos</button>
      
      <div class="admin-code-list" id="generatedCodes"></div>
    </div>
  `;
  
  adminDom.adminContent.innerHTML = html;
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Generador de Códigos";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Crea nuevos códigos para tus estudiantes";
  
  // Event listeners para los selects
  setTimeout(() => {
    const pageSelect = document.getElementById("genPageSelect");
    const cardSelect = document.getElementById("genCardSelect");
    
    if (pageSelect) {
      pageSelect.addEventListener("change", () => {
        const page = PAGES.find(p => p.key === pageSelect.value);
        if (page && cardSelect) {
          cardSelect.innerHTML = "";
          for (let i = 0; i < page.cards.length; i++) {
            const opt = document.createElement("option");
            opt.value = i;
            opt.textContent = page.cards[i].title;
            cardSelect.appendChild(opt);
          }
        }
      });
    }
    
    const genBtn = document.getElementById("generateBtn");
    if (genBtn) {
      genBtn.addEventListener("click", generateNewCodes);
    }
  }, 100);
}

function generateNewCodes() {
  const pageSelect = document.getElementById("genPageSelect");
  const cardSelect = document.getElementById("genCardSelect");
  const codesContainer = document.getElementById("generatedCodes");
  
  if (!pageSelect || !cardSelect || !codesContainer) return;
  
  const page = PAGES.find(p => p.key === pageSelect.value);
  const cardIndex = parseInt(cardSelect.value);
  
  if (!page || page.cards[cardIndex] === undefined) return;
  
  const card = page.cards[cardIndex];
  const prefix = page.key.toUpperCase().slice(0, 3);
  const newCodes = [];
  
  for (let i = 0; i < 5; i++) {
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    const code = `${prefix}-${randomPart}-${Math.floor(Math.random() * 900) + 100}`;
    newCodes.push(code);
  }
  
  let html = "<h4 style='margin-bottom:12px;'>Códigos generados:</h4>";
  for (const code of newCodes) {
    html += `
      <div class="admin-code-item">
        <span class="code">${code}</span>
        <span class="card-title">${card.title}</span>
      </div>
    `;
  }
  
  html += `
    <p style="margin-top:12px; color:var(--muted); font-size:.85rem;">
      Copia estos códigos y compártelos con tus estudiantes.
    </p>
  `;
  
  codesContainer.innerHTML = html;
  successSound();
}

function renderResetStudent() {
  if (!adminDom.adminContent) return;
  
  adminDom.adminContent.innerHTML = `
    <div class="field">
      <label for="resetStudentSelect">Seleccionar Estudiante</label>
      <select id="resetStudentSelect" style="width:100%; padding:14px 16px; border-radius:16px; background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.08); color:var(--text); font-size:1rem;">
        <option value="">-- Selecciona un estudiante --</option>
  `;
  
  for (const [user, name] of Object.entries(STUDENTS)) {
    adminDom.adminContent.innerHTML += `<option value="${user}">${name} (${user})</option>`;
  }
  
  adminDom.adminContent.innerHTML += `
      </select>
    </div>
    
    <div style="margin-top:20px; padding:16px; border-radius:12px; background:rgba(255,107,107,.1); border:1px solid rgba(255,107,107,.3);">
      <p style="color:var(--danger); font-weight:800; margin-bottom:8px;">⚠️ Advertencia</p>
      <p style="color:var(--muted); font-size:.9rem;">
        Esta acción eliminará todo el progreso del estudiante seleccionado incluyendo láminas desbloqueadas y validaciones. Esta acción no se puede deshacer.
      </p>
    </div>
    
    <button id="confirmResetBtn" class="btn btn--danger" style="margin-top:16px;">🔄 Confirmar Reset</button>
  `;
  
  if (adminDom.adminTitle) adminDom.adminTitle.textContent = "Resetear Estudiante";
  if (adminDom.adminMeta) adminDom.adminMeta.textContent = "Borrar todo el progreso de un estudiante";
  
  setTimeout(() => {
    const confirmBtn = document.getElementById("confirmResetBtn");
    const select = document.getElementById("resetStudentSelect");
    
    if (confirmBtn && select) {
      confirmBtn.addEventListener("click", () => {
        if (!select.value) {
          alert("Selecciona un estudiante primero");
          return;
        }
        if (confirm(`¿Estás seguro de resetear el progreso de ${select.value}?`)) {
          // Aquí iría la lógica para resetear en la nube
          alert(`Progreso de ${select.value} sería reseteado (funcionalidad cloud requerida)`);
        }
      });
    }
  }, 100);
}

function closeAdminModal() {
  // Placeholder para modales del admin si los hay
}

function adminSearch() {
  const query = normalizeUser(adminDom.adminSearchInput?.value || "");
  
  if (!adminDom.adminSearchResults || query.length < 2) {
    if (adminDom.adminSearchResults) adminDom.adminSearchResults.innerHTML = "";
    return;
  }
  
  let html = "";
  const matches = Object.entries(STUDENTS).filter(([user, name]) => 
    user.toLowerCase().includes(query.toLowerCase()) || 
    name.toLowerCase().includes(query.toLowerCase())
  );
  
  for (const [user, name] of matches.slice(0, 5)) {
    html += `
      <div class="admin-search-item" onclick="alert('Ver detalle de ${user}')">
        <strong>${name}</strong>
        <small>${user}</small>
      </div>
    `;
  }
  
  adminDom.adminSearchResults.innerHTML = html;
}

// Wire Admin events
function wireAdminEvents() {
  if (adminDom.adminBackBtn) {
    adminDom.adminBackBtn.addEventListener("click", () => {
      app.user = null;
      localStorage.removeItem("albumUser");
      setScreen("login");
    });
  }
  
  if (adminDom.viewAllStudentsBtn) {
    adminDom.viewAllStudentsBtn.addEventListener("click", renderAllStudents);
  }
  
  if (adminDom.generateCodesBtn) {
    adminDom.generateCodesBtn.addEventListener("click", renderCodeGenerator);
  }
  
  if (adminDom.viewStatsBtn) {
    adminDom.viewStatsBtn.addEventListener("click", renderGlobalStats);
  }
  
  if (adminDom.resetStudentBtn) {
    adminDom.resetStudentBtn.addEventListener("click", renderResetStudent);
  }
  
  if (adminDom.adminSearchInput) {
    adminDom.adminSearchInput.addEventListener("input", adminSearch);
  }
  
  // Botón secreto para acceder al admin desde login
  const enterBtn = document.getElementById("enterBtn");
  if (enterBtn) {
    enterBtn.addEventListener("dblclick", openAdminLogin);
  }
}

wireEvents();
wireAdminEvents();

window.addEventListener("load", async () => {
  const savedUser = localStorage.getItem("albumUser");

  try {
    if (savedUser) {
      app.user = savedUser;
      setScreen("album");

      app.state = await loadFromCloud(savedUser);
      ensurePageState();
      await renderAll();
    } else {
      setScreen("login");
    }
  } catch (err) {
    console.error(err);
    localStorage.removeItem("albumUser");
    setScreen("login");
  }

  const loading = document.getElementById("loadingScreen");
  if (loading) loading.style.display = "none";
});