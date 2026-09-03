import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@myorg/ui/styles";
import "./index.css";
import { AppLayout } from "./layouts/AppLayout";
import { HomePage } from "./pages/HomePage";
import { ExamplesPage } from "./pages/ExamplesPage";
import { StatusPage } from "./pages/StatusPage";
import { ComponentsPage } from "./pages/ComponentsPage";

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element #root not found. Check index.html.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/examples" element={<ExamplesPage />} />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/components" element={<ComponentsPage />} />
          <Route
            path="*"
            element={
              <div style={{ textAlign: "center", padding: "4rem" }}>
                <h1 style={{ fontSize: "3rem", color: "#6366f1" }}>404</h1>
                <p style={{ color: "#64748b" }}>Page not found</p>
              </div>
            }
          />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  </React.StrictMode>
);
