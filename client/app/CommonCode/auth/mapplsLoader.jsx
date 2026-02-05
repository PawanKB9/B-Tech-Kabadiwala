// Centralized loader for Mappls SDK and plugins.
// Usage: await ensureSdk(); await ensurePlugin('search', 'search');
// Provides safeGetPinDetails wrapper.

// NOTE: keep this file client-side (imported only from client components)
const MAPPLS_KEY = process.env.NEXT_PUBLIC_MAPPLS_KEY || "ee287c1a53dc92e27751abf2375968ef";

function loadScript(url, id) {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") return reject(new Error("Not in browser"));
    if (document.getElementById(id)) return resolve();
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.id = id;
    script.onload = () => resolve();
    script.onerror = (e) => reject(new Error("Failed to load script: " + url));
    document.body.appendChild(script);
  });
}

let sdkPromise = null;
const pluginPromises = {};

// Wait for a condition up to timeout, polling interval ms
function waitFor(conditionFn, timeout = 5000, interval = 100) {
  const start = Date.now();
  return new Promise((resolve, reject) => {
    (function check() {
      try {
        if (conditionFn()) return resolve(true);
      } catch (err) {
        // swallow
      }
      if (Date.now() - start >= timeout) return resolve(false);
      setTimeout(check, interval);
    })();
  });
}

// Ensure core Mappls SDK is loaded and window.mappls is present
export function ensureSdk() {
  if (sdkPromise) return sdkPromise;

  sdkPromise = (async () => {
    const sdkUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk?layer=vector&v=3.0`;
    try {
      // load sdk script (id prevents double insertion)
      await loadScript(sdkUrl, "mappls-sdk");
    } catch (err) {
      // script might already exist or fail; continue to wait for global
    }

    // Wait up to ~6s for window.mappls to be initialized
    const ok = await waitFor(() => typeof window.mappls === "object" && typeof window.mappls.Map === "function", 6000, 150);
    if (!ok) {
      // still return window.mappls if present; caller will handle absence
      return window.mappls || null;
    }
    return window.mappls;
  })();

  return sdkPromise;
}

// Ensure plugin script for given libraries is loaded. attachName is the window.mappls property to wait for (eg 'search' or 'getPinDetails').
export function ensurePlugin(libraries = "search", attachName = null) {
  const key = `${libraries}|${attachName || ""}`;
  if (pluginPromises[key]) return pluginPromises[key];

  pluginPromises[key] = (async () => {
    // Ensure SDK exists first
    await ensureSdk();

    const pluginUrl = `https://apis.mappls.com/advancedmaps/api/${MAPPLS_KEY}/map_sdk_plugins?v=3.0&libraries=${libraries}`;
    try {
      await loadScript(pluginUrl, `mappls-plugin-${libraries}`);
    } catch (err) {
      // ignore; may already be present or fail - we will still wait for attachName
    }

    if (!attachName) return true;

    // Wait up to 6s for the plugin attach (e.g. window.mappls.search)
    const ok = await waitFor(() => !!(window.mappls && window.mappls[attachName]), 6000, 100);
    if (!ok) {
      // plugin didn't attach; return false so callers can fallback gracefully
      return false;
    }
    return true;
  })();

  return pluginPromises[key];
}

// Safe wrapper for getPinDetails (calls only if available and catches errors)
export async function safeGetPinDetails(args, cb) {
  try {
    // Ensure plugin is loaded (best-effort)
    await ensurePlugin("getPinDetails", "getPinDetails");
    if (!window.mappls || typeof window.mappls.getPinDetails !== "function") {
      console.warn("safeGetPinDetails: getPinDetails not available");
      cb(null);
      return;
    }
    try {
      window.mappls.getPinDetails(args, (data) => {
        try {
          cb(data);
        } catch (inner) {
          console.error("safeGetPinDetails: callback threw", inner);
          cb(null);
        }
      });
    } catch (err) {
      console.error("safeGetPinDetails: getPinDetails threw synchronously", err);
      cb(null);
    }
  } catch (err) {
    console.error("safeGetPinDetails: unexpected error", err);
    cb(null);
  }
}