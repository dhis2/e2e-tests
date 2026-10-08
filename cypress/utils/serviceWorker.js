// The app-shell service worker (PWA) races with Cypress' page loads and can leave the
// app blank for the rest of the spec. Keep it from registering and drop any
// registration left over from an earlier test. Registered globally in support/e2e.js.
export const disableServiceWorker = (win) => {
  const sw = win.navigator.serviceWorker;
  if (!sw) return;
  sw.register = () => new Promise(() => {});
  sw.getRegistrations().then((rs) => rs.forEach((r) => r.unregister()));
};
