import { TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Request from "../../../api/Request";
import { codePointAt } from "@uiw/react-codemirror";

type UsernameFieldInputProps = {
  onValidTextChange?: (v: string) => void;
  onValidBoolChange?: (b: boolean) => void;
};

export default function UsernameFieldInput(props: UsernameFieldInputProps) {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(undefined as React.ReactNode | undefined);
  const [valid, setValid] = useState(false);
  const timeout = useRef(undefined as NodeJS.Timeout | undefined);

  useEffect(() => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(async () => {
      let children: React.ReactNode[] = [];
      if (username.match(/[^a-zA-Z0-9 ]/g)) {
        children.push("Username only contains alphanumerical characters");
      }
      if (
        username &&
        !(username.length >= 4 && username.length < 16) &&
        username.length > 0
      ) {
        children.push("Username length should be between 4 and 16");
      }
      if (children.length === 0 && username.length > 0) {
        if (timeout.current) clearTimeout(timeout.current);
        timeout;
        await Request("accounts", "availability", ":s")
          .params({ s: username })
          .get()
          .then((v) => {
            if (!v.available) {
              children.push("Username is not avaiable");
            }
          });
      }

      let i = 0;
      if (children.length === 0) {
        setError(undefined);
        setValid(true);
        if (props.onValidBoolChange) props.onValidBoolChange(true);
        if (props.onValidTextChange) props.onValidTextChange(username);
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
  }, [username]);

  return (
    <TextField
      helperText={error}
      error={!valid && (username != null && username.length > 0)}
      label="Username"
      type="text"
      value={username || ""}
      onChange={(v) => setUsername(v.currentTarget.value)}
      margin="normal"
    />
  );
}
