import React from "react";
import ReactDOM from "react-dom/client";
import "./main.css";

import { QueryClient } from "@tanstack/react-query";
import App from "./App.tsx";
import { BaseOpsProvider } from "./BaseOpsProvider.tsx";
import { I18nProvider } from "./i18n.tsx";
import { Theme } from "@radix-ui/themes";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <I18nProvider>
        <BaseOpsProvider queryClient={queryClient}>
          <App />
        </BaseOpsProvider>
      </I18nProvider>
    </Theme>
  </React.StrictMode>
);
