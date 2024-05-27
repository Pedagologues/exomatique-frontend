import { useState } from "react";
import Request from "../../api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store";
import { CredentialsSlice, CredentialsState } from "./CredentialsStore";
import { Navigate, useNavigate } from "react-router-dom";
import "./login.css";
import {
  Box,
  Button,
  Checkbox,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

export default function Login() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  if (token !== null) {
    return <Navigate to="../" replace />;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Request("accounts", "login")
      .post({ username, password })
      .then((v) => {
        if (v.$ok) {
          let state: CredentialsState = {
            token: v.token,
            name: v.username,
            id: v.id,
            expiration: v.expiration,
            clearOnLoad: !remember,
          };
          dispatch(CredentialsSlice.actions.setCredentials(state));
          navigate("../", { replace: true });
        }else setError(true);
      });
  };

  return (
    <Paper
      elevation={10}
      style={{
        margin: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        padding: 30,
      }}
    >
      <TextField
        error={error}
        label="Login"
        fullWidth
        onChange={(e) => {
          setError(false);
          return setUserName(e.target.value || "");
        }}
      />
      <TextField
        error={error}
        label="Password"
        type="password"
        fullWidth
        onChange={(e) => {
          setError(false);
          return setPassword(e.target.value || "");
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "right",
        }}
      >
        <Typography>
          Remember me
          <Checkbox
            aria-label="remember-me"
            onChange={(e) => setRemember(e.target.checked)}
          />
        </Typography>
      </div>

      <Button variant="outlined" color="primary" onClick={handleSubmit}>
        <Typography>Login</Typography>
      </Button>
    </Paper>
  );
}
