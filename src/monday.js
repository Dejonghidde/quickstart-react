// src/monday.js
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

// Initialize SDK safely (do not pass header options here)
try {
  if (process.env.REACT_APP_MONDAY_TOKEN) {
    monday.setToken(process.env.REACT_APP_MONDAY_TOKEN);
  }
} catch (err) {
  console.warn("monday SDK setToken warning:", err);
}

// Expose on window for other libs that expect it (non-invasive)
try {
  // only set if not present to avoid clobbering platform values
  if (typeof window !== "undefined" && !window.monday) {
    window.monday = monday;
  }
} catch (err) {
  /* ignore */
}

// monday.listen does not return a promise in the hosted environment — don't call .catch on it.
// Provide a safe wrapper to call listen without assuming a promise is returned.
function safeListen(eventName, cb) {
  try {
    monday.listen(eventName, cb);
  } catch (err) {
    // Non-fatal; log for diagnostics
    console.warn("monday.listen failed (non-fatal):", err);
  }
}

export default monday;
export { safeListen };
