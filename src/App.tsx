import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/credentials/Login";
import Logout from "./features/credentials/Logout";
import Register from "./features/credentials/Register";
import Home from "./features/home/Home";
import { NewExerciseRedirection } from "./features/exercises/CreateExercise";
import { ExercisesList } from "./features/exercises/Exercise";
import useEffectOnce from "./api/hook/fetch_once";
import { useState } from "react";
import Request from "./api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./Store";
import { CredentialsSlice } from "./features/credentials/CredentialsStore";
import Header from "./features/header/Header";
import { Box } from "@mui/material";
import EditorView from "./features/exercises/components/EditorView";

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
                  dispatch(CredentialsSlice.actions.setToken(v))
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
        <BrowserRouter>
          <Header />
          {online && (
            <Routes>
              <Route path="/">
                <Route index element={<Home />} />
                <Route path="home" element={<Navigate to={"/"} replace />} />
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
                <Route path="*" element={<div>Where the fuck are you ?</div>} />
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
