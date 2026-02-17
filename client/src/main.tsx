import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

if (!navigator.cookieEnabled) {
  // You could also render a static "Enable Cookies" component here
  alert("Cookies are disabled. This app will not work correctly.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
