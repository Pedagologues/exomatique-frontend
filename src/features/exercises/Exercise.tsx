import { useEffect, useRef, useState } from "react";
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
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  Container,
  FormControlLabel,
  IconButton,
  List,
  Paper,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSearchParams } from "react-router-dom";

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

export function Exercise(props: { exercise: IExercise; key: string }) {
  const accountId = useSelector((state: RootState) => state.credentials.id);
  let { exercise, key } = props;

  const [numPages, setNumPages] = useState<number>();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [scale, setScale] = useState<number>(1);
  const theme = useTheme();

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Card
      key={key}
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

interface IFilter {
  query: string;
  tags: string[];
}

export function ExercisesList(props: { isPrivate: boolean }) {

  const token = useSelector((state: RootState) => state.credentials.token);
  //Query all tags once
  const [availableTags, setAvailableTags] = useState(
    undefined as undefined | string[]
  );

  useEffectOnce(() => {
    Request("exercises", "tags")
      .get()
      .then((v) => {
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  let [urlParams, setUrlParams] = useSearchParams();
  const urlMatcher = new URLSearchParams(urlParams);

  let [filter, setFilter] = useState({
    query: "",
    tags: [] as string[],
  } as IFilter);

  useEffect(() => {
    let params = new URLSearchParams();
    params.append("q", btoa(filter.query));
    filter.tags.forEach((v) => params.append("tag", v));
    setUrlParams(params.toString());
  }, [filter, setUrlParams]);

  //Remember currently shown exercises
  let [exercises, setExercises] = useState([] as IExercise[]);
  const SIZE = 10;
  let [isSearching, setIsSearching] = useState(false);
  let [page, setPage] = useState(0);
  let [count, setCount] = useState(0);

  const searchInput: React.Ref<any> = useRef(null);

  const [lastFilter, setLastFilter] = useState(
    undefined as IFilter | undefined
  );
  const maxPage = Math.ceil(count / SIZE);

  const [lastPage, setLastPage] = useState(0);

  const onSearch = () => {
    if (isSearching) return;
    if (lastFilter === filter && lastPage === page) return;
    if (lastFilter !== filter) {
      setPage(0);
    }
    let safe_page = lastFilter === filter ? page : 0;
    setIsSearching(true);
    Request("exercises", "request", ":begin", ":end")
      .post({
        begin: safe_page * SIZE,
        end: (safe_page + 1) * SIZE,
        viewer : props.isPrivate ? token : undefined,
        ...filter,
      })
      .then((v) => {
        setCount(v.count);
        setExercises(v.exercises || ([] as IExercise[]));
      })
      .finally(() => {
        setLastFilter(filter);
        return setIsSearching(false);
      });
  };

  useEffectOnce(
    () => onSearch(),
    [
      setIsSearching,
      isSearching,
      filter,
      setExercises,
      lastFilter,
      page,
      lastPage,
    ]
  );
  if (availableTags === undefined || exercises === undefined)
    return <div></div>;
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
      <Paper
        elevation={5}
        style={{
          margin: 20,
          padding: 20,
          display: "flex",
          width: "100%",
          height: 200,
          flexDirection: "column",
          flex: 1,
        }}
      >
        <Container
          maxWidth={false}
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            gap: 5,
            flex: 1,
          }}
        >
          <TextField
            inputRef={searchInput}
            value={filter.query}
            fullWidth
            onChange={(e) =>
              setFilter({ ...filter, query: e.currentTarget.value })
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();

                setTimeout(() => {
                  if (searchInput.current) searchInput.current.blur();
                });
              }
            }}
          />
          <Button onClick={() => onSearch()}>SEARCH</Button>
        </Container>
        <List
          style={{
            padding: 5,
            display: "flex",
            flexDirection: "column",
            justifyContent: "left",
          }}
        >
          {(availableTags || []).map((v) => {
            return (
              <FormControlLabel
                key={v}
                control={
                  <Checkbox
                    checked={filter.tags.find((u) => u === v) !== undefined}
                    onChange={(e) => {
                      let tags2 = filter.tags.filter((u) => u !== v);
                      if (e.currentTarget.checked) {
                        tags2.push(v);
                      }
                      setFilter({ ...filter, tags: tags2 });
                    }}
                  />
                }
                label={v}
                labelPlacement="start"
              />
            );
          })}
        </List>
      </Paper>
      <Paper
        style={{
          width: "70%",
          display: "flex",
          flexDirection: "column",
          alignContent: "center",
          alignItems: "center",
          flex: 1,
        }}
      >
        {exercises.map((v) => {
          return <Exercise exercise={v} key={v.id} />;
        })}
      </Paper>
    </Paper>
  );
}
