import GitHubIcon from "@mui/icons-material/GitHub";
import { IconButton, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <Paper
      style={{
        margin: 20,
        height: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <Typography variant="h1" color="error" style={{
          textAlign: "center"
        }}>
          Ce site est en pré-alpha
        </Typography>
        
        <Typography variant="h5" margin={5}>
          Si vous voulez contribuer au code, donner une idée ou bien faire connaître un bug n'hésitez pas à le mettre sur le GitHub. (lien en bas à droite)

          Ce projet est par essence communautaire, si vous avez un avis (constructif) on serait ravis de l'entendre !
        </Typography>
      </div>

      <IconButton
        style={{
          position: "absolute",
          right: 0,
          bottom: 0,
        }}
        size="large"
        href="https://github.com/Pedagologues/exomatique"
        target="_blank"
        rel="noopener noreferrer"
      >
        <GitHubIcon style={{ fontSize: 60 }} />
      </IconButton>
    </Paper>
  );
}
