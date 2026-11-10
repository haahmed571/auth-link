// ========================================
// REPAIR AUTHORIZATION LINK  (paste at the very bottom of your script)
// Adds a link to every calendar event. The technician opens it, fills
// model / serial / parts / labor, and sends it on WhatsApp or text.
// ========================================

const AUTH_PAGE_URL = 'https://haahmed571.github.io/auth-link/';

function authLinkText_(row, start) {
  const sheet = SpreadsheetApp.getActiveSheet();
  const v = sheet.getRange(row, 1, 1, 9).getValues()[0]; // columns A..I
  const info = {
    job:       v[0],  // A  Work Order
    company:   v[1],  // B  Company
    customer:  v[2],  // C  Customer
    address:   v[3],  // D  Address
    phone:     v[4],  // E  Phone
    appliance: v[6],  // G  Item(s)
    date: Utilities.formatDate(start, Session.getScriptTimeZone(), 'EEE M/d, h:mm a')
  };
  const query = Object.keys(info)
    .filter(k => info[k] !== '' && info[k] !== null)
    .map(k => k + '=' + encodeURIComponent(String(info[k]).trim()))
    .join('&');
  return '\n\n📝 Repair authorization (tech fills & sends):\n' + AUTH_PAGE_URL + '?' + query;
}
