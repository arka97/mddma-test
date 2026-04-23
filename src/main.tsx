import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Register PWA manifest dynamically (safer than relying solely on link tag)
if ("serviceWorker" in navigator) {
  // No service worker registered on purpose — install-only PWA per design.
}

createRoot(document.getElementById("root")!).render(<App />);
