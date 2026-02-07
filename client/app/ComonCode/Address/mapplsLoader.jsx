let loaderPromise = null;

export function ensureMapplsPluginsLoaded(key) {
  if (!key) return Promise.reject(new Error("MAPPLS key missing"));

  if (loaderPromise) return loaderPromise;

  loaderPromise = new Promise((resolve, reject) => {
    if (window.mappls?.search && window.mappls?.getPinDetails) {
      resolve(window.mappls);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://apis.mappls.com/advancedmaps/api/${key}/map_sdk_plugins?v=3.0&libraries=search,getPinDetails`;
    script.async = true;

    script.onload = () => {
      setTimeout(() => {
        if (window.mappls?.search && window.mappls?.getPinDetails) {
          resolve(window.mappls);
        } else {
          reject(new Error("Mappls plugin loaded but APIs missing"));
        }
      }, 40);
    };

    script.onerror = () => {
      reject(new Error("Failed to load Mappls plugin script"));
    };

    document.body.appendChild(script);
  });

  return loaderPromise;
}

export const debounce = (fn, delay) => {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
};