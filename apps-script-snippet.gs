// ===== Add to your existing Apps Script =====
// Where your auth page is hosted (GitHub Pages / Netlify - free):
const AUTH_PAGE = 'https://YOUR-NAME.github.io/auth-link/';

// Builds the link with the job details filled in
function buildAuthLink(info) {
  // info = {job, customer, phone, address, date, appliance, company}
  const parts = Object.keys(info)
    .filter(k => info[k])
    .map(k => k + '=' + encodeURIComponent(String(info[k])));
  return AUTH_PAGE + '?' + parts.join('&');
}

// Call this right after your script creates the calendar event:
//   const event = CalendarApp.getDefaultCalendar().createEvent(title, start, end, {...});
//   addAuthLink(event, {customer: name, phone: phone, address: addr,
//                       date: Utilities.formatDate(start, Session.getScriptTimeZone(), 'MMM d, h:mm a'),
//                       appliance: appliance, job: jobNo});
function addAuthLink(event, info) {
  const link = buildAuthLink(info);
  const old = event.getDescription() || '';
  event.setDescription(old + '\n\n🔑 Submit authorization:\n' + link);
  return link; // optional: also write it into a sheet column
}
