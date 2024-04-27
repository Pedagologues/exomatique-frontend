import { useState } from "react";
import useEffectOnce from "../../api/hook/fetch_once";
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
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  IconButton,
  List,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// https://github.com/dvddhln/latexit/

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

interface IExercise {
  id: string;
  author: string;
  authorId: string;
  title: string;
  link: string;
  tags: string[];
}

export function Exercise(props: { exercise: IExercise }) {
  const accountId = useSelector((state: RootState) => state.credentials.id);
  let { exercise } = props;

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const theme = useTheme();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Card
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
            >
              <Page
                pageNumber={currentPage + 1}
                className="document-page relative"
                width={600}
              ></Page>
            </Document>
          </Container>

          {(numPages || 0 )> 1 ? (
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

export function ExercisesList(props: {
  whitelist_tags: string[];
  begin?: string;
}) {
  let [exercises, setExercises] = useState([] as IExercise[]);

  let fetched = useEffectOnce(() => {
    Request("exercises", "request", ":size", ":begin")
      .params({
        size: 10,
        begin: props.begin || "0",
      })
      .get()
      .then((v) => {
        setExercises(v as IExercise[]);
      });
  });
  const [availableTags, setAvailableTags] = useState([] as string[]);
  let fecthed2 = useEffectOnce(() => {
    Request("exercises", "tags")
      .get()
      .then((v) => {
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  if (!fetched.current || !fecthed2.current) return <div></div>;
  return (
    <Paper
      style={{
        paddingTop: 20,
        flex: 1,
        height: "100%",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          display: "flex",
        }}
      >
        <Paper
          elevation={5}
          style={{
            margin: 20,
            padding: 20,
            display: "flex",
            width: "100%",
            height: 200,
            flex:1,
          }}
        >
          <List
            style={{
              padding: 5,
              display: "flex",
              flexDirection: "column",
              justifyContent: "left"
            }}
          >
            {availableTags.map((v) => {
              return (
                <FormControlLabel key={v} control={<Checkbox />} label={v} labelPlacement="start"/>
              );
            })}
          </List>
        </Paper>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        <Paper
          style={{
            width: "75%",
          }}
        >
          <ul
            style={{
              margin: 0,
              padding: 0,
            }}
          >
            {exercises.map((v) => {
              return (
                <li
                  key={v.id}
                  style={{
                    listStyleType: "none",
                    margin: 0,
                    padding: 0,
                    width: "100%",
                  }}
                >
                  <Exercise exercise={v} />
                </li>
              );
            })}
          </ul>
        </Paper>
      </div>
    </Paper>
  );
}
