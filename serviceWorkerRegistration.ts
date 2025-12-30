
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      // Use window.location.origin to ensure we target the current domain for the SW file,
      // ignoring any <base> tags that might point to a CDN (which causes origin mismatch errors).
      const swUrl = `${window.location.origin}/sw.js`;
      
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        })
        .catch((error) => {
          // Log as warning to differentiate from application errors
          console.warn('ServiceWorker registration failed:', error);
        });
    });
  }
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
