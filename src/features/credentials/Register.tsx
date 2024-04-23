import { useState } from "react";
import Request from "../../api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store";
import PasswordStrengthBar from "react-password-strength-bar";
import { Navigate, useNavigate } from "react-router-dom";
import { CredentialsSlice, CredentialsState } from "./CredentialsStore";

export default function Register() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");

  if (token !== null) {
    return <Navigate to="../" replace />;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Request("accounts", "register")
      .post({ username, password })
      .then((v) => {
        dispatch(
          CredentialsSlice.actions.setToken(
            JSON.parse(v.message) as CredentialsState
          )
        );
        navigate("../", { replace: true });
      });
  };

  return (
    <div className="login-wrapper">
      <h1>Please Register</h1>
      <form onSubmit={handleSubmit}>
        <label>
          <p>Username</p>
          <input
            type="text"
            onChange={(e) => setUserName(e.target.value || "")}
          />
        </label>
        <label>
          <p>Password</p>
          <input
            type="password"
            onChange={(e) => setPassword(e.target.value || "")}
          />
        </label>
        <PasswordStrengthBar password={password} />
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
