import "./App.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "./features/credentials/Login";
import Logout from "./features/credentials/Logout";
import Register from "./features/credentials/Register";
import Home from "./features/home/Home";
import Header from "./features/home/Header";

function App() {
  return (
    <div>
      <Header />
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
          <Route path="home" element={<Home />} />
          <Route path="/" element={<Navigate to={"home"} replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
