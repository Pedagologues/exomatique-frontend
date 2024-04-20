import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./features/credentials/Login";
import Logout from "./features/credentials/Logout";
import Register from "./features/credentials/Register";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="logout" element={<Logout />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
