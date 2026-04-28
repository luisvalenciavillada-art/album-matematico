// Google Apps Script - backend para Álbum Matemático Virtual
// -----------------------------------------------------------
// Hoja esperada: "Progress"
// Columnas:
// A username
// B fullName
// C unlockedByPageJSON
// D usedCodesByPageJSON
// E validatedByPageJSON
// F updatedAt

const SHEET_NAME = "Progress";

function doGet(e) {
  const action = (e.parameter.action || "").toLowerCase();
  if (action === "load") {
    return handleLoad_(e.parameter.username);
  }
  if (action === "loadall") {
    return handleLoadAll_();
  }
  return json_({ ok: true, message: "Álbum Matemático API" });
}

function doPost(e) {
  const data = JSON.parse(e.postData.contents || "{}");
  const action = (data.action || "").toLowerCase();

  if (action === "save") {
    return handleSave_(data);
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
          validatedByPage: safeParseJson_(values[i][4], {})
        }
      });
    }
  }

  return json_({
    ok: true,
    state: {
      unlockedByPage: {},
      usedCodesByPage: {},
      validatedByPage: {}
    }
  });
}

function handleLoadAll_() {
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
        updatedAt: String(values[i][5] || "")
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
    new Date()
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

function getSheet_(ss) {
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "username",
      "fullName",
      "unlockedByPageJSON",
      "usedCodesByPageJSON",
      "validatedByPageJSON",
      "updatedAt"
    ]);
  } else {
    const headers = sheet.getRange(1, 1, 1, Math.max(sheet.getLastColumn(), 6)).getValues()[0];
    if (String(headers[0]).toLowerCase() !== "username") {
      sheet.clear();
      sheet.appendRow([
        "username",
        "fullName",
        "unlockedByPageJSON",
        "usedCodesByPageJSON",
        "validatedByPageJSON",
        "updatedAt"
      ]);
    }
  }

  return sheet;
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
