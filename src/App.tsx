import "./App.css";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import loadable from "@loadable/component";
import useEffectOnce from "./api/hook/fetch_once";
import { Suspense, useState } from "react";
import Request from "./api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Store";
import { CredentialsSlice } from "./features/credentials/CredentialsStore";
import { Box } from "@mui/material";
import NewExerciseRedirection from "./features/exercises/NewExerciseRedirection";
import ExercisesList from "./features/exercises/ExercisesPane";

const Header = loadable(() => import("./features/header/Header"));
const Login = loadable(() => import("./features/credentials/Login"));
const Logout = loadable(() => import("./features/credentials/Logout"));
const Register = loadable(() => import("./features/credentials/Register"));
const Home = loadable(() => import("./features/home/Home"));
const Contact = loadable(() => import("./features/contact/Contact"));
const EditorView = loadable(
  () => import("./features/exercises/editor/ExerciseEditorPane")
);

const BACK_URL = import.meta.env.VITE_REACT_APP_BACKEND_HOST;
const BACK_PORT = import.meta.env.VITE_REACT_APP_BACKEND_PORT;

function App() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const clearOnLoad = useSelector(
    (state: RootState) => state.credentials.clearOnLoad
  ); //TODO forget the token at webclosing instead of at the next visit
  const dispatch = useDispatch();

  let [online, setOnline] = useState(null as boolean | null);

  useEffectOnce(async () => {
    Request("ping")
      .get()
      .then((v) => {
        let b = v.message === "Pong";
        setOnline(b);
        if (b) {
          if (clearOnLoad) {
            dispatch(CredentialsSlice.actions.reset());
          } else if (token !== null) {
            Request("accounts", "login")
              .post({ token })
              .then(
                (v) => {
                  if (v.message === "Could not login")
                    dispatch(CredentialsSlice.actions.reset());
                  else dispatch(CredentialsSlice.actions.setToken(v));
                },
                (v) => {
                  dispatch(CredentialsSlice.actions.reset());
                }
              )
              .catch(() => {});
          }
        }
      })
      .catch((e) => {
        setOnline(false);
      });
  });

  if (online !== false) {
    return (
      <Box height="100vh" display="flex" flexDirection="column">
        <link
          rel="preconnect"
          href={BACK_URL + (BACK_PORT !== "" ? ":" + BACK_PORT : "") + "/"}
        />
        <BrowserRouter>
          <link
            rel="preconnect"
            href={BACK_URL + (BACK_PORT !== "" ? ":" + BACK_PORT : "") + "/"}
          />
          <Header />
          {online && (
              <Routes>
                <Route path="/">
                  <Route index element={<Home />} />
                  <Route path="home" element={<Navigate to={"/"} replace />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="logout" element={<Logout />} />

                  <Route path="exercises">
                    <Route
                      index
                      element={<ExercisesList isPrivate={false} />}
                    />
                    <Route
                      path="yours"
                      element={<ExercisesList isPrivate={true} />}
                    />
                    <Route path="edit/:id" element={<EditorView />} />
                    <Route path="new" element={<NewExerciseRedirection />} />
                  </Route>
                  <Route
                    path="*"
                    element={<div>Where the fuck are you ?</div>}
                  />
                </Route>
              </Routes>
          )}
        </BrowserRouter>
      </Box>
    );
  }
  return (
    <div id={!online ? "overlay" : ""}>
      <div id="overlayed-error">
        Désolé il semblerait que notre serveur ne soit pas accessible.
      </div>
    </div>
  );
}

export default App;
