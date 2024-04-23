import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/credentials/Login";
import Logout from "./features/credentials/Logout";
import Register from "./features/credentials/Register";
import Home from "./features/home/Home";
import Header from "./features/home/Header";
import CreateExercises from "./features/create_exercises/CreateExercises";
import CreateExercise, { NewExerciseRedirection } from "./features/exercises/CreateExercise";
import { ExercisesList } from "./features/exercises/Exercise";

function App() {
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
              <Route index element={<ExercisesList whitelist_tags={[]}/>}/>
              <Route path="edit/:id" element={<CreateExercise/>} />
              <Route path="new" element={<NewExerciseRedirection/>}/>
            </Route>
            <Route path='*' element={<div>Where the fuck are you ?</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
