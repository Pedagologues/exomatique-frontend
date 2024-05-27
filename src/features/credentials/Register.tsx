import { useState } from "react";
import Request from "../../api/Request";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Store";
import PasswordStrengthBar from "react-password-strength-bar";
import { Navigate, useNavigate } from "react-router-dom";
import { CredentialsSlice, CredentialsState } from "./CredentialsStore";
import { Button, Paper, TextField, Typography } from "@mui/material";
import UsernameFieldInput from "./component/UsernameFieldInput";
import PasswordFieldInput from "./component/PasswordFieldInput";

export default function Register() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [score, setScore] = useState(0);

  if (token !== null) {
    return <Navigate to="../" replace />;
  }

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    Request("accounts", "register")
      .post({ username, password })
      .then((v) => {
        dispatch(
          CredentialsSlice.actions.setCredentials(
            JSON.parse(v.message) as CredentialsState
          )
        );
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
      <UsernameFieldInput onValidTextChange={(v) => setUserName(v)} />
      <PasswordFieldInput onValidTextChange={(v) => setPassword(v)} />

      <Button
        variant="outlined"
        color="primary"
        onClick={handleSubmit}
        disabled={score < 2}
      >
        <Typography>Register</Typography>
      </Button>
    </Paper>
  );
}
