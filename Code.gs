// Google Apps Script - backend para Álbum Matemático Virtual
// -----------------------------------------------------------
// Hoja esperada: "Progress"
// Columnas:
// A username
// B fullName
// C unlockedByPageJSON
// D usedCodesByPageJSON
// E validatedByPageJSON
// F unlockedAtJSON
// G reflectionByPageJSON (antes notesByPageJSON)
// H achievementsJSON
// I updatedAt
// J insigniasJSON
// K celebrationsJSON

const SHEET_NAME = "Progress";
const CODES_SHEET_NAME = "Codes";
const HEADERS = [
  "username",
  "fullName",
  "unlockedByPageJSON",
  "usedCodesByPageJSON",
  "validatedByPageJSON",
  "unlockedAtJSON",
  "reflectionByPageJSON",
  "achievementsJSON",
  "updatedAt",
  "insigniasJSON",
  "celebrationsJSON"
];
const CODE_HEADERS = [
  "code",
  "pageKey",
  "cardIndex",
  "type",
  "active",
  "usedBy",
  "usedAt",
  "createdAt",
  "note"
];

function doGet(e) {
  const action = (e.parameter.action || "").toLowerCase();
  if (action === "load") {
    return handleLoad_(e.parameter.username);
  }
  if (action === "loadall") {
    return handleLoadAll_(e.parameter.adminCode);
  }
  return json_({ ok: true, message: "Álbum Matemático API" });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  const action = (data.action || "").toLowerCase();

  if (action === "save") {
    return handleSave_(data);
  }
  if (action === "admincheck") {
    return json_({ ok: isAdminCodeValid_(data.adminCode) });
  }
  if (action === "reset") {
    return handleReset_(data);
  }
  if (action === "validatecode") {
    return handleValidateCode_(data);
  }
  if (action === "generatecodes") {
    return handleGenerateCodes_(data);
  }

  return json_({ ok: false, message: "Acción no soportada" });
}

function handleLoad_(username) {
  if (!username) return json_({ ok: false, message: "Falta username" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet_(ss);
  const values = sheet.getDataRange().getValues();

  for (let i = values.length - 1; i >= 1; i--) {
    if (String(values[i][0]).trim().toUpperCase() === String(username).trim().toUpperCase()) {
      return json_({
        ok: true,
        state: {
          unlockedByPage: safeParseJson_(values[i][2], {}),
          usedCodesByPage: safeParseJson_(values[i][3], {}),
          validatedByPage: safeParseJson_(values[i][4], {}),
          unlockedAt: safeParseJson_(values[i][5], {}),
          reflectionByPage: safeParseJson_(values[i][6], {}),
          achievements: safeParseJson_(values[i][7], {}),
          insignias: safeParseJson_(values[i][9], {}),
          celebrations: safeParseJson_(values[i][10], {})
        }
      });
    }
  }

  return json_({
    ok: true,
    state: {
      unlockedByPage: {},
      usedCodesByPage: {},
      validatedByPage: {},
      unlockedAt: {},
      reflectionByPage: {},
      achievements: {},
      insignias: {},
      celebrations: {}
    }
  });
}

function handleLoadAll_(adminCode) {
  if (!isAdminCodeValid_(adminCode)) {
    return json_({ ok: false, message: "Codigo de administrador incorrecto" });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet_(ss);
  const values = sheet.getDataRange().getValues();
  
  const allStudents = {};
  
  // Empezar desde la fila 2 (índice 1) para omitir encabezados
  for (let i = 1; i < values.length; i++) {
    const username = String(values[i][0] || "").trim().toUpperCase();
    if (username) {
      allStudents[username] = {
        fullName: String(values[i][1] || ""),
        unlockedByPage: safeParseJson_(values[i][2], {}),
        usedCodesByPage: safeParseJson_(values[i][3], {}),
        validatedByPage: safeParseJson_(values[i][4], {}),
        unlockedAt: safeParseJson_(values[i][5], {}),
        reflectionByPage: safeParseJson_(values[i][6], {}),
        achievements: safeParseJson_(values[i][7], {}),
        insignias: safeParseJson_(values[i][9], {}),
        celebrations: safeParseJson_(values[i][10], {}),
        updatedAt: String(values[i][8] || "")
      };
    }
  }
  
  return json_({ ok: true, students: allStudents });
}

function handleSave_(data) {
  if (!data.username) return json_({ ok: false, message: "Falta username" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet_(ss);
  const values = sheet.getDataRange().getValues();
  const username = String(data.username).trim().toUpperCase();

  const rowData = [
    username,
    data.fullName || "",
    JSON.stringify(data.unlockedByPage || {}),
    JSON.stringify(data.usedCodesByPage || {}),
    JSON.stringify(data.validatedByPage || {}),
    JSON.stringify(data.unlockedAt || {}),
    JSON.stringify(data.reflectionByPage || {}),
    JSON.stringify(data.achievements || {}),
    new Date(),
    JSON.stringify(data.insignias || {}),
    JSON.stringify(data.celebrations || {})
  ];

  let existingRow = -1;
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim().toUpperCase() === username) {
      existingRow = i + 1; // 1-based row index
      break;
    }
  }

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, rowData.length).setValues([rowData]);
  } else {
    sheet.appendRow(rowData);
  }

  return json_({ ok: true, message: "Guardado" });
}

function handleReset_(data) {
  if (!isAdminCodeValid_(data.adminCode)) {
    return json_({ ok: false, message: "Codigo de administrador incorrecto" });
  }
  if (!data.username) return json_({ ok: false, message: "Falta username" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getSheet_(ss);
  const values = sheet.getDataRange().getValues();
  const username = String(data.username).trim().toUpperCase();

  // 1. Eliminar fila en hoja Progress
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]).trim().toUpperCase() === username) {
      sheet.deleteRow(i + 1);
      break;
    }
  }

  // 2. Limpiar códigos usados en hoja Codes
  const codesSheet = getCodesSheet_(ss);
  const codeValues = codesSheet.getDataRange().getValues();
  const headers = codeValues[0];
  const usedByCol = headers.indexOf("usedBy");
  const usedAtCol = headers.indexOf("usedAt");
  
  if (usedByCol !== -1 && usedAtCol !== -1) {
    // Buscar y limpiar códigos usados por este estudiante
    for (let i = 1; i < codeValues.length; i++) {
      if (String(codeValues[i][usedByCol] || "").trim().toUpperCase() === username) {
        // Limpiar las columnas usedBy y usedAt (dejar código activo de nuevo)
        codesSheet.getRange(i + 1, usedByCol + 1).setValue("");
        codesSheet.getRange(i + 1, usedAtCol + 1).setValue("");
      }
    }
  }

  return json_({ ok: true, message: "Progreso y códigos eliminados" });
}

function handleValidateCode_(data) {
  const username = String(data.username || "").trim().toUpperCase();
  const code = String(data.code || "").trim().toUpperCase();
  const requestedType = String(data.type || "unlock").trim().toLowerCase();
  const requestedPageKey = String(data.pageKey || "").trim();

  if (!username) return json_({ ok: false, message: "Falta username" });
  if (!code) return json_({ ok: false, message: "Falta codigo" });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getCodesSheet_(ss);
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    const rowCode = String(values[i][0] || "").trim().toUpperCase();
    const pageKey = String(values[i][1] || "").trim();
    const cardIndex = values[i][2] === "" ? "" : Number(values[i][2]);
    const type = String(values[i][3] || "unlock").trim().toLowerCase();
    const active = String(values[i][4]).toLowerCase() !== "false";
    const usedBy = String(values[i][5] || "").trim();

    if (rowCode !== code) continue;
    if (type !== requestedType) return json_({ ok: false, message: "El codigo no corresponde a esta accion" });
    if (!active) return json_({ ok: false, message: "El codigo esta inactivo" });
    if (requestedPageKey && pageKey && pageKey !== requestedPageKey) {
      return json_({ ok: false, message: "El codigo no corresponde a esta pagina" });
    }

    if (type === "teacher") {
      if (usedBy) return json_({ ok: false, message: "Este codigo ya fue utilizado" });
      sheet.getRange(i + 1, 6, 1, 2).setValues([[username, new Date()]]);
    }

    return json_({
      ok: true,
      type: type,
      code: code,
      pageKey: pageKey,
      cardIndex: cardIndex,
      message: type === "teacher" ? "Pagina validada" : "Lamina desbloqueada"
    });
  }

  return json_({ ok: false, message: "Codigo incorrecto" });
}

function handleGenerateCodes_(data) {
  if (!isAdminCodeValid_(data.adminCode)) {
    return json_({ ok: false, message: "Codigo de administrador incorrecto" });
  }

  const pageKey = String(data.pageKey || "").trim();
  const cardIndex = Number(data.cardIndex);
  const type = String(data.type || "unlock").trim().toLowerCase();
  const quantity = Math.min(Math.max(Number(data.quantity || 5), 1), 100);

  if (!pageKey) return json_({ ok: false, message: "Falta pageKey" });
  if (type === "unlock" && !Number.isFinite(cardIndex)) {
    return json_({ ok: false, message: "Falta cardIndex" });
  }

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = getCodesSheet_(ss);
  const existing = getExistingCodes_(sheet);
  const codes = [];
  const prefix = pageKey.substring(0, 3).toUpperCase();

  while (codes.length < quantity) {
    const code = `${type === "teacher" ? "VAL" : prefix}-${randomChunk_(4)}-${randomChunk_(3)}`;
    if (existing[code]) continue;
    existing[code] = true;
    codes.push(code);
  }

  const rows = codes.map(function(code) {
    return [
      code,
      pageKey,
      type === "teacher" ? "" : cardIndex,
      type,
      true,
      "",
      "",
      new Date(),
      ""
    ];
  });
  sheet.getRange(sheet.getLastRow() + 1, 1, rows.length, CODE_HEADERS.length).setValues(rows);

  return json_({ ok: true, codes: codes });
}

function getSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
  } else {
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), HEADERS.length)).getValues()[0];
    if (String(headers[0]).toLowerCase() !== "username") {
      sheet.clear();
      sheet.appendRow(HEADERS);
    } else {
      for (let i = 0; i < HEADERS.length; i++) {
        if (headers[i] !== HEADERS[i]) {
          sheet.getRange(1, i + 1).setValue(HEADERS[i]);
        }
      }
    }
  }

  return sheet;
}

function getCodesSheet_(ss) {
  let sheet = ss.getSheetByName(CODES_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(CODES_SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(CODE_HEADERS);
  } else {
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), CODE_HEADERS.length)).getValues()[0];
    if (String(headers[0]).toLowerCase() !== "code") {
      sheet.clear();
      sheet.appendRow(CODE_HEADERS);
    } else {
      for (let i = 0; i < CODE_HEADERS.length; i++) {
        if (headers[i] !== CODE_HEADERS[i]) {
          sheet.getRange(1, i + 1).setValue(CODE_HEADERS[i]);
        }
      }
    }
  }

  return sheet;
}

function getExistingCodes_(sheet) {
  const values = sheet.getDataRange().getValues();
  const existing = {};
  for (let i = 1; i < values.length; i++) {
    const code = String(values[i][0] || "").trim().toUpperCase();
    if (code) existing[code] = true;
  }
  return existing;
}

function randomChunk_(length) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}

function isAdminCodeValid_(adminCode) {
  const configured = PropertiesService.getScriptProperties().getProperty("ADMIN_CODE") || "ADMIN2024";
  return String(adminCode || "") === configured;
}

function safeParseJson_(value, fallback) {
  try {
    if (value === null || value === "" || typeof value === "undefined") return fallback;
    return JSON.parse(value);
  } catch (err) {
    return fallback;
  }
}

function json_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
