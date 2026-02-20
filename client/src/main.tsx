import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import StoreProvider from "./providers/StoreProvider.tsx";
import { SidebarManager } from "./components/SidebarManager.tsx";

if (!navigator.cookieEnabled) {
  alert("Cookies are disabled. This app will not work correctly.");
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <SidebarManager />
      <App />
    </StoreProvider>
  </StrictMode>,
);
