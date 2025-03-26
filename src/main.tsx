import React from "react";
import ReactDOM from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import App from "./App.tsx";
import { HashRouter } from "react-router-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import "./globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <HashRouter>
        <Auth0Provider
          domain="dev-suxrwhhd6z20gwnv.us.auth0.com"
          clientId="18BHs1ZffPwCWtbooI8GCtN55JTxKmhM"
          authorizationParams={{
            redirect_uri: window.location.origin,
          }}
        >
          <App />
        </Auth0Provider>
      </HashRouter>
    </StyledEngineProvider>
  </React.StrictMode>
);
