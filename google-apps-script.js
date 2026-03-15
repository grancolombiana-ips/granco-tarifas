// ============================================================
// GOOGLE APPS SCRIPT - Registro de consultas Grancolombiana
// ============================================================
// INSTRUCCIONES:
// 1. Abre Google Sheets en una hoja nueva
// 2. En la fila 1 escribe los encabezados: Fecha | Correo | Institución
// 3. Ve a Extensiones → Apps Script
// 4. Borra el código existente y pega TODO este código
// 5. Haz clic en Guardar
// 6. Haz clic en Implementar → Nueva implementación
//    - Tipo: Aplicación web
//    - Ejecutar como: Yo
//    - Quién tiene acceso: Cualquier persona
// 7. Copia la URL generada
// 8. Pégala en index.html en la variable SHEETS_URL
// ============================================================

const SHEET_NAME = 'Hoja 1'; // Cambia si tu hoja tiene otro nombre

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
    const fecha = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });
    sheet.appendRow([fecha, data.correo, data.institucion]);
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService
    .createTextOutput('Servicio activo - Grancolombiana IPS')
    .setMimeType(ContentService.MimeType.TEXT);
}
