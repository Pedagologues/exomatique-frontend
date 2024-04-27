import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import {
  Button,
  Container,
  Menu,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import SettingsSharpIcon from "@mui/icons-material/SettingsSharp";
import { ColorModeContext } from "../..";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export default function Header() {
  const colorMode = React.useContext(ColorModeContext);
  const isOnline = useSelector(
    (state: RootState) => state.credentials.token !== null
  );
  const navigate = useNavigate();

  const theme = useTheme();
  const { hash, pathname, search } = useLocation();

  const showCurrentlySelected = (...key: string[]): "outlined" | "text" => {
    if (key[0] === "/home" && pathname === "/") return "outlined";
    return key.find((v) => pathname.startsWith(v)) ? "outlined" : "text";
  };

  let currentlyHovering = false;

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event: any) {
    if (anchorEl !== event.currentTarget) {
      setAnchorEl(event.currentTarget);
    }
  }

  function handleHover() {
    currentlyHovering = true;
  }

  function handleClose() {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        setAnchorEl(null);
      }
    }, 50);
  }

  function handleCloseHover() {
    currentlyHovering = false;
    setTimeout(() => {
      if (!currentlyHovering) {
        setAnchorEl(null);
      }
    }, 50);
  }

  return (
    <Box>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            m={1}
            onClick={() => navigate("/", { replace: true })}
            sx={{
              cursor: "pointer",
            }}
          >
            BibInfo
          </Typography>
          <Container sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant={showCurrentlySelected("/home")}
              color="inherit"
              href="/"
            >
              <Typography variant="h5">Accueil</Typography>
            </Button>

            <Button
              variant={showCurrentlySelected("/exercises")}
              color="inherit"
              href="/exercises"
              onMouseOver={handleClick}
              onMouseLeave={handleClose}
            >
              <Typography variant="h5">Exercices</Typography>
            </Button>
            <Menu
              id="simple-menu"
              open={Boolean(anchorEl)}
              anchorEl={anchorEl}
              onClose={handleClose}
              MenuListProps={{
                onMouseEnter: handleHover,
                onMouseLeave: handleCloseHover,
                style: { pointerEvents: "auto" },
              }}
              style={{
                pointerEvents: "none",
              }}
              disableAutoFocusItem
            >
              <MenuItem onMouseEnter={handleHover} onClick={handleClose}>
                Vos exercices
              </MenuItem>
              <MenuItem
                onMouseEnter={handleHover}
                onClick={() => {
                  handleClose();
                  navigate("/exercises/new", { replace: true });
                }}
              >
                Ajouter un exercice
              </MenuItem>
            </Menu>
            <Button
              variant={showCurrentlySelected("/contact")}
              color="inherit"
              href="/contact"
            >
              <Typography variant="h5">Contact</Typography>
            </Button>
          </Container>

          {isOnline ? (
            <Button color="inherit" endIcon={<SettingsSharpIcon />}>
              Settings
            </Button>
          ) : (
            <Button
              color="inherit"
              variant="contained"
              onClick={() => navigate("/login", { replace: true })}
            >
              Login
            </Button>
          )}

          <IconButton
            sx={{ ml: 1 }}
            onClick={colorMode.toggleColorMode}
            color="inherit"
          >
            {theme.palette.mode === "dark" ? (
              <Brightness7Icon />
            ) : (
              <Brightness4Icon />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
