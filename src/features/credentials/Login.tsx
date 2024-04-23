import { useState } from "react";
import Request from "../../api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store";
import { CredentialsSlice, CredentialsState } from "./CredentialsStore";
import { Navigate, useNavigate } from "react-router-dom";

export default function Login() {
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
    Request("accounts", "login")
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
      <h1>Please Log In</h1>
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
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}
