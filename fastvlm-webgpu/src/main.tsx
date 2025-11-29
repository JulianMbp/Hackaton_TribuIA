import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { InterviewProvider } from "./context/InterviewContext.tsx";
import { VLMProvider } from "./context/VLMContext.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <VLMProvider>
      <InterviewProvider>
        <App />
      </InterviewProvider>
    </VLMProvider>
  </React.StrictMode>,
);
