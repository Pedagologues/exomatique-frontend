import { useState } from "react";
import Request from "../../api/Request";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "../reactpdf.css";

import {
  Button,
  Card,
  Chip,
  Container,
  IconButton,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import IExercise from "./IExercise";
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// https://github.com/dvddhln/latexit/

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function ExerciseCard(props: {
  exercise: IExercise;
  setExercise: (exercise: IExercise) => void;
}) {
  const accountId = useSelector((state: RootState) => state.credentials.id);
  const accountToken = useSelector(
    (state: RootState) => state.credentials.token
  );
  let { exercise } = props;

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Card
      key={exercise.id}
      style={{
        padding: 5,
        display: "flex",
        width: "100%",
        flexDirection: "column",
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
        <Typography variant="h4">Titre : {props.exercise.title}</Typography>
        <div
          style={{
            flex: 1,
          }}
        ></div>

        {exercise.authorId === accountId ? (
          <div>
            {!exercise.removed ? (
              <Button
                variant="outlined"
                endIcon={<DeleteIcon />}
                color="error"
                style={{
                  margin: 5,
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  await Request("exercises", "edit", "remove")
                    .post({
                      id: exercise.id,
                      token: accountToken,
                    })
                    .catch((e) => console.error("Failed to remove"))
                    .then(() => {
                      exercise.removed = true;
                      props.setExercise(exercise);
                    });
                }}
              >
                Remove
              </Button>
            ) : (
              <Button
                variant="outlined"
                endIcon={<SaveIcon />}
                color="info"
                style={{
                  margin: 5,
                }}
                onClick={async (e) => {
                  e.preventDefault();
                  await Request("exercises", "edit", "restore")
                    .post({
                      id: exercise.id,
                      token: accountToken,
                    })
                    .catch((e) => console.error("Failed to restore"))
                    .then(() => {
                      exercise.removed = false;
                      props.setExercise(exercise);
                    });
                }}
              >
                Restore
              </Button>
            )}
            <Button
              variant="outlined"
              endIcon={<EditIcon />}
              style={{
                margin: 5,
              }}
              href={"/exercises/edit/" + exercise.id}
            >
              Edit
            </Button>
          </div>
        ) : undefined}
      </Container>
      <Container
        maxWidth={false}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "right",
          padding: 0,
          margin: 5,
          gap: 25,
        }}
      >
        <Container
          style={{
            marginTop: 30,
            width: 400,
            display: " flex",
            justifyContent: "left",
            overflow: "hidden",
            overflowY: "scroll",
            overflowX: "scroll",
            flexDirection: "column",
          }}
        >
          <Typography variant="subtitle1">Tags :</Typography>
          {exercise.tags.map((v) => (
            <Chip key={v} label={v} variant="outlined" />
          ))}
        </Container>
        <Container
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Container
            maxWidth={false}
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "right",
              overflow: "hidden",
              overflowY: "scroll",
              overflowX: "scroll",
              height: 400,
            }}
          >
            <Document
              className="document-class"
              file={exercise.link}
              options={options}
              onLoadSuccess={onDocumentLoadSuccess}
              onError={(e) => {}}
              onLoadError={(e) => {}}
              onSourceError={(e) => {}}
            >
              <Page
                pageNumber={currentPage + 1}
                className="document-page relative"
                width={600}
              ></Page>
            </Document>
          </Container>

          {(numPages || 0) > 1 ? (
            <div
              style={{
                display: "block",
                margin: "auto",
              }}
            >
              <div>
                <IconButton
                  className="page-button"
                  aria-label="Page précédente"
                  color="primary"
                  disabled={currentPage <= 0}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  <ArrowBackIcon />
                </IconButton>
                <IconButton
                  className="page-button"
                  aria-label="Page suivante"
                  color="primary"
                  disabled={currentPage >= (numPages || 0) - 1}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            </div>
          ) : undefined}
        </Container>
      </Container>

      <Container
        maxWidth={false}
        style={{
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
      </Container>
    </Card>
  );
}
