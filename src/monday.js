// src/monday.js
import mondaySdk from "monday-sdk-js";

const monday = mondaySdk();

// Add proper error handling for WebSocket connections
monday.listen("context", (res) => {
  console.log("Context changed:", res);
}).catch(err => {
  console.warn("WebSocket connection error (non-critical):", err);
});

export default monday;
