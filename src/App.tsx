import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/credentials/Login";
import Logout from "./features/credentials/Logout";
import Register from "./features/credentials/Register";
import Home from "./features/home/Home";
import Header from "./features/home/Header";
import CreateExercises from "./features/create_exercises/CreateExercises";
import CreateExercise, {
  NewExerciseRedirection,
} from "./features/exercises/CreateExercise";
import { ExercisesList } from "./features/exercises/Exercise";
import useEffectOnce from "./api/hook/fetch_once";
import { useState } from "react";
import Request from "./api/Request";

const isAppOnline = async () => {
  if (!window.navigator.onLine) return false;

  const url = new URL(window.location.origin);
  url.searchParams.set("q", new Date().toString());

  try {
    const response = await fetch(url.toString(), { method: "HEAD" });

    return response.ok;
  } catch {
    return false;
  }
};

function App() {
  let [online, setOnline] = useState(null as boolean | null);

  useEffectOnce(async () => {
    Request("ping")
      .get()
      .then((v) => {
        setOnline(v.message === "Pong");
      })
      .catch((e) => setOnline(false));
  });

  if (online) {
    return (
      <div>
        <Header />
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="home" element={<Navigate to={"/"} replace />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="logout" element={<Logout />} />

              <Route path="exercises">
                <Route index element={<ExercisesList whitelist_tags={[]} />} />
                <Route path="edit/:id" element={<CreateExercise />} />
                <Route path="new" element={<NewExerciseRedirection />} />
              </Route>
              <Route path="*" element={<div>Where the fuck are you ?</div>} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
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
