import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { store } from "./app/store";
import "./styles/globals.css";

const STORAGE_KEY = "jira_clone_settings";

const getInitialTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      return parsed?.appearance?.theme || "light";
    }
  } catch {
    // Ignore invalid localStorage data.
  }

  return "light";
};

const applyTheme = (theme) => {
  const root = document.documentElement;

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  root.classList.toggle("dark", isDark);

  root.setAttribute(
    "data-theme",
    isDark ? "dark" : "light"
  );

  root.style.colorScheme = isDark
    ? "dark"
    : "light";
};

const initialTheme = getInitialTheme();

applyTheme(initialTheme);

if (initialTheme === "system") {
  const mediaQuery = window.matchMedia(
    "(prefers-color-scheme: dark)"
  );

  const handleSystemThemeChange = () => {
    applyTheme("system");
  };

  mediaQuery.addEventListener(
    "change",
    handleSystemThemeChange
  );
}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#0f172a",
              color: "#f8fafc",
              border: "1px solid #334155",
            },
          }}
        />

        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
