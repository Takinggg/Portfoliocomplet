import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/globals.css";

async function bootstrap() {
  const { initSafeStorage } = await import("./utils/safeStorage");
  initSafeStorage();

  if (import.meta.env.DEV) {
    import("./utils/cacheDebug");
  }

  const { default: App } = await import("./App.tsx");
  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Failed to locate #root element");
  }

  createRoot(rootElement).render(<App />);
}

bootstrap().catch((error) => {
  console.error("Failed to bootstrap application", error);
});
