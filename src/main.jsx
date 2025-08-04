import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { TransacoesProvider } from "./context/TransacoesContext"; // ✅ Importa o contexto

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <TransacoesProvider>
        <App />
      </TransacoesProvider>
    </BrowserRouter>
  </React.StrictMode>
);
