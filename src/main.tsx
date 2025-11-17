
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import "./styles/globals.css";

  // Load cache debug utility in development
  if (import.meta.env.DEV) {
    import('./utils/cacheDebug');
  }

  createRoot(document.getElementById("root")!).render(<App />);
  