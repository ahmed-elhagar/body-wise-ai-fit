
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import "./i18n/config.ts"; // Import i18n configuration

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

// Initialize the React app
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
