import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { persist_store, store } from "./Store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider, THEME_ID, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {},
});
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

function Root() {
  const [mode, setMode] = React.useState<"light" | "dark">(localStorage["mode"] || "light");

  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          let next_mode : "light" | "dark" = (prevMode === "light" ? "dark" : "light")
          localStorage["mode"] = next_mode;
          return next_mode;
        } 
    );
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
        components: {
          MuiAppBar: {
            styleOverrides: {
              colorPrimary: {
                backgroundColor: "#121212"
              }
            }
          }
        }
      }),
    [mode]
  );

  return (
    <React.StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persist_store}>
          <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
              <CssBaseline enableColorScheme />
              <App />
            </ThemeProvider>
          </ColorModeContext.Provider>
        </PersistGate>
      </Provider>
    </React.StrictMode>
  );
}

root.render(<Root />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
