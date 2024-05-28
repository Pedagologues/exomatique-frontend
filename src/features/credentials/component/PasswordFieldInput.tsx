import { TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Request from "../../../api/Request";
import { codePointAt } from "@uiw/react-codemirror";
import PasswordStrengthBar from "react-password-strength-bar";

type PasswordFieldInputProps = {
  onValidTextChange?: (v: string) => void;
  onValidBoolChange?: (b: boolean) => void;
};

export default function PasswordFieldInput(props: PasswordFieldInputProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(undefined as React.ReactNode | undefined);
  const [valid, setValid] = useState(false);
  const [score, setScore] = useState(0);
  const timeout = useRef(undefined as NodeJS.Timeout | undefined);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      let children: React.ReactNode[] = [];

      if (score < 2) {
        children.push("Password strength is too low");
      }

      console.log(score);
      let i = 0;
      if (children.length === 0) {
        setError(undefined);
        setValid(true);
        if (props.onValidTextChange) props.onValidTextChange(password);
        if (props.onValidBoolChange) props.onValidBoolChange(true);
      } else {
        if (props.onValidBoolChange) props.onValidBoolChange(false);
        setError(
          <>
            {children.map((v) => (
              <li key={i++}>{v}</li>
            ))}
          </>
        );
        setValid(false);
      }
      clearTimeout(timeout.current);
      timeout.current = undefined;
    }, 250);
  }, [password, score]);

  return (
    <div style={{
        width: "100%"
    }}>
      <TextField
        fullWidth={true}
        helperText={error}
        error={!valid && password != null && password.length > 0}
        label="Password"
        type="password"
        value={password || ""}
        onChange={(v) => setPassword(v.currentTarget.value)}
        margin="normal"
      />

      <PasswordStrengthBar
        password={password}
        onChangeScore={(e) => setScore(e)}
      />
    </div>
  );
}
