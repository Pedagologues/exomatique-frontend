import { useState } from "react";
import Request from "../../api/Request";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

import {
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import IExercise from "./IExercise";
import ExerciseView from "./ExerciseView";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// https://github.com/dvddhln/latexit/

export default function ExerciseCard(props: {
  exercise: IExercise;
  setExercise: (exercise: IExercise) => void;
  viewMode: boolean;
  setViewMode: (b: boolean) => void;
}) {
  const accountId = useSelector((state: RootState) => state.credentials.id);

  const accountToken = useSelector(
    (state: RootState) => state.credentials.token
  );
  let { exercise, viewMode, setViewMode } = props;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  function onViewClick(): void {
    setViewMode(true);
  }

  if (viewMode)
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        setViewMode(false);
      }
    });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      {!viewMode || (
        <div
          className="grayed_view"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            backgroundColor: "#333b",
            width: "100%",
            height: "100%",
            zIndex: 100,
            padding: 40,
          }}
          onClick={(e) => {
            if (e.defaultPrevented) return;
            e.preventDefault();

            setViewMode(false);
          }}
        >
          <div
            style={{
              width: "100%",
              height: "100%",
            }}
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <ExerciseView
              disable={() => setViewMode(false)}
              exercise={exercise}
            />
          </div>
        </div>
      )}
      <Card
        key={exercise.id}
        style={{
          padding: 5,
          margin: 10,
          display: "flex",
          width: "100%",
          gap: 0,
          flexDirection: "column",
          whiteSpace: "nowrap",
          background: exercise.removed ? "#240b0a" : undefined,
        }}
      >
        <Container
          maxWidth={false}
          style={{
            display: "flex",
            gap: 0,
            margin: 0,
            padding: 0,
          }}
        >
          <Typography
            variant="h4"
            onClick={onViewClick}
            style={{
              cursor: "pointer",
              userSelect: "none",
            }}
            sx={{ "&:hover": { color: "blue" } }}
          >
            {props.exercise.title}
          </Typography>
          <div
            style={{
              flex: 1,
            }}
          ></div>
          <Button
            variant="outlined"
            endIcon={<VisibilityIcon />}
            color="primary"
            style={{
              marginRight: 10,
            }}
            onClick={onViewClick}
          >
            View
          </Button>
          {exercise.authorId === accountId ? (
            <div>
              <IconButton
                aria-label="more"
                id="more-button"
                aria-haspopup="true"
                aria-controls={open ? "more-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="more-menu"
                MenuListProps={{
                  "aria-labelledby": "long-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                style={{
                  flexDirection: "row",
                }}
              >
                <MenuItem key="removeOrRestore">
                  <Button
                    variant="outlined"
                    endIcon={!exercise.removed ? <DeleteIcon /> : <SaveIcon />}
                    color={!exercise.removed ? "error" : "info"}
                    onClick={async (e) => {
                      e.preventDefault();
                      await Request(
                        "exercises",
                        "edit",
                        !exercise.removed ? "remove" : "restore"
                      )
                        .post({
                          id: exercise.id,
                          token: accountToken,
                        })
                        .catch((e) =>
                          console.error("Failed to change removed state")
                        )
                        .then(() => {
                          exercise.removed = !exercise.removed;
                          props.setExercise(exercise);
                        });
                    }}
                  >
                    {!exercise.removed ? "Remove" : "Restore"}
                  </Button>
                </MenuItem>
                <MenuItem key={"edit"}>
                  <Button
                    variant="outlined"
                    endIcon={<EditIcon />}
                    href={"/exercises/edit/" + exercise.id}
                  >
                    Edit
                  </Button>
                </MenuItem>
              </Menu>
            </div>
          ) : undefined}
        </Container>

        <Stack
          direction="row"
          useFlexGap
          flexWrap="wrap"
          style={{
            width: "100%",
          }}
        >
          {exercise.tags.map((v) => (
            <Chip
              size="small"
              key={v}
              label={v}
              variant="outlined"
              style={{
                userSelect: "none",
                margin: "5pt",
              }}
            />
          ))}
        </Stack>

        <Paper
          elevation={4}
          style={{
            padding: "5pt",
            display: "flex",
            justifyContent: "right",
          }}
        >
          <Typography variant="subtitle2">
            Author: {props.exercise.author}
          </Typography>
          <div
            style={{
              flex: 1,
            }}
          ></div>
          <Typography variant="subtitle2">Ref: #{props.exercise.id}</Typography>
        </Paper>
      </Card>
    </div>
  );
}
