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
        let state: CredentialsState = {
          ...v,
          clearOnLoad: !remember,
        };
        dispatch(CredentialsSlice.actions.setToken(state));
        navigate("../", { replace: true });
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
      <TextField label="Login" fullWidth onChange={(e) => setUserName(e.target.value || "")}/>
      <TextField label="Password" type="password" fullWidth onChange={(e) => setPassword(e.target.value || "")}/>

      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "right",
        }}
      >
        <Typography>
          Remember me
          <Checkbox aria-label="remember-me" onChange={(e) => setRemember(e.target.checked)}/>
        </Typography>
      </Box>

      <Button variant="outlined" color="primary" onClick={handleSubmit}>
        <Typography>
          Login
        </Typography>
      </Button>
    </Paper>
  );
}
