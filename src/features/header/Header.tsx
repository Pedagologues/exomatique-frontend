import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Button, Container, Menu, MenuItem, useTheme } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { ColorModeContext } from "../..";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function ExerciceButton(props: any) {
  let { selected } = props;
  const isOnline = useSelector(
    (state: RootState) => state.credentials.token !== null
  );
  const navigate = useNavigate();

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
    <Button
      variant={selected}
      color="inherit"
      href="/exercises"
      onMouseOver={handleClick}
      onMouseLeave={handleClose}
    >
      <Typography variant="h5">Exercices</Typography>
      {!isOnline || (
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
          <MenuItem onMouseEnter={handleHover}  onClick={() => {
              handleClose();
              navigate("/exercises/yours", { replace: true });
            }}>
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
      )}
    </Button>
  );
}

function AccountButton() {
  const isOnline = useSelector(
    (state: RootState) => state.credentials.token !== null
  );
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return isOnline ? (
    <div>
      <Button
        id="account-button"
        aria-controls={open ? "account-button" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <AccountCircleIcon/>
      </Button>
      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "account-button",
        }}
      >
        <MenuItem onClick={() => navigate("/logout", { replace: true })} >Logout</MenuItem>
      </Menu>
    </div>
  ) : (
    <Button
      color="inherit"
      variant="contained"
      onClick={() => navigate("/login", { replace: true })}
    >
      Login
    </Button>
  );
}

export default function Header() {
  const colorMode = React.useContext(ColorModeContext);
  const navigate = useNavigate();

  const theme = useTheme();
  const { pathname } = useLocation();

  const showCurrentlySelected = (...key: string[]): "outlined" | "text" => {
    if (key[0] === "/home" && pathname === "/") return "outlined";
    return key.find((v) => pathname.startsWith(v)) ? "outlined" : "text";
  };

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
            Exomatique
          </Typography>
          <Container sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              variant={showCurrentlySelected("/home")}
              color="inherit"
              href="/"
            >
              <Typography variant="h5">Accueil</Typography>
            </Button>
            <ExerciceButton selected={showCurrentlySelected("/exercises")} />
            <Button
              variant={showCurrentlySelected("/contact")}
              color="inherit"
              href="/contact"
            >
              <Typography variant="h5">Contact</Typography>
            </Button>
          </Container>

          <AccountButton />

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
