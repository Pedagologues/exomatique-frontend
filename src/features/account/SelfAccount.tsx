import {
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Paper,
  TextField,
  Typography,
  DialogActions,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { CredentialsState } from "../credentials/CredentialsStore";
import { useState } from "react";
import UsernameFieldInput from "../credentials/component/UsernameFieldInput";
import PasswordFieldInput from "../credentials/component/PasswordFieldInput";
import Request from "../../api/Request";
import { useNavigate } from "react-router-dom";

type modify_account = {
  username: string | undefined;
  password: string | undefined;
};

export default function SelfAccount() {
  const account_details: CredentialsState = useSelector(
    (state: RootState) => state.credentials
  );

  const [modification, setModification] = useState({
    username: undefined,
    password: undefined,
  } as modify_account);

  const [openPasswordPrompt, setOpenPasswordPrompt] = useState(false);
  const [passwordPromptError, setPasswordPrompError] = useState(false);

  const navigate = useNavigate();
  return (
    <div
      style={{
        margin: 25,
        display: "flex",
        flexDirection: "row",
        background: "none",
        gap: "5%",
      }}
    >
      <Paper
        elevation={2}
        style={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          minHeight: 0,
          padding: 25,
          justifyContent: "center",
          alignContent: "center",
        }}
      >
        <svg
          width="256"
          height="256"
          style={{
            alignSelf: "center",
          }}
        >
          <defs>
            <mask id="body">
              <rect width="100%" height="100%" fill="white" />
              <circle r="45%" cx="50%" cy="100%" fill="black" />
              <circle r="20%" cx="50%" cy="40%" fill="black" />
            </mask>
          </defs>

          <circle id="donut" r="49%" cx="50%" cy="50%" fill="white" />
          <circle
            r="49%"
            cx="50%"
            cy="50%"
            fill="none"
            stroke="black"
            strokeWidth="1%"
          />
          <circle id="donut" r="49%" cx="50%" cy="50%" mask="url(#body)" />
        </svg>

        <Typography
          variant="h2"
          style={{
            alignSelf: "center",
            marginBottom: 5,
          }}
        >
          {account_details.name}
        </Typography>
      </Paper>

      <Paper
        elevation={2}
        style={{
          flexGrow: 3,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          paddingLeft: 25,
        }}
      >
        <UsernameFieldInput
          onValidTextChange={(v) =>
            setModification({ ...modification, username: v })
          }
          onValidBoolChange={(v) => {
            if (!v) setModification({ ...modification, username: undefined });
          }}
        />
        <PasswordFieldInput
          onValidTextChange={(v) =>
            setModification({ ...modification, password: v })
          }
          onValidBoolChange={(v) => {
            if (!v) setModification({ ...modification, password: undefined });
          }}
        />

        <Button
          variant="outlined"
          color="primary"
          style={{
            width: "fit-content",
            alignSelf: "center",
          }}
          onClick={() => setOpenPasswordPrompt(true)}
          disabled={
            modification.username || modification.password ? false : true
          }
        >
          <Typography>Modifier</Typography>
        </Button>
      </Paper>
      <Dialog
        open={openPasswordPrompt}
        onClose={() => setOpenPasswordPrompt(false)}
        PaperProps={{
          component: "form",
          onSubmit: (event: any) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());

            let password = formJson.password;

            Request("accounts", "edit")
              .post({
                username: account_details.name,
                password: password,
                modification,
              })
              .then((v) => {
                if (v.message === "Could not login") {
                  setPasswordPrompError(true);
                } else if (v.$ok) {
                  navigate("/", { replace: true });
                }
              });
          },
        }}
      >
        <DialogTitle>Mot de passe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Pour modifier votre compte, veuillez entrer votre mot de passe
            ci-dessous :
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="password"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            error={passwordPromptError}
            onChange={(e) => setPasswordPrompError(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordPrompt(false)}>Annuler</Button>
          <Button type="submit">Modifier</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
