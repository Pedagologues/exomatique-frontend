import React, { useEffect, useState, useRef } from "react";
import {
  Tooltip,
  useTheme,
  Button,
  Typography,
  Paper,
  Container,
  FormControl,
  Autocomplete,
  TextField,
  Checkbox,
  IconButton,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/snippets/latex";
import "ace-builds/src-noconflict/ext-language_tools";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";

import json from "./mathjax.snippet.json";
import { Ace } from "ace-builds";

import { Document, Page, pdfjs } from "react-pdf";
import "./pdf.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import Split from "react-split";

import { renderToStaticMarkup } from "react-dom/server";
import Request from "../../../api/Request";
import useEffectOnce from "../../../api/hook/fetch_once";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../Store";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
// https://github.com/dvddhln/latexit/

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

type IExercice = {
  id: string;
  raw: string;
  title: string;
  author: string;
  tags: string[];
  visible: boolean;
};

export default function EditorView() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const { id } = useParams();
  const [available_tags, setAvailableTags] = React.useState<any>([]);
  const [exercice, setExercice] = useState({
    id,
    title: "Default title",
    visible: true,
    tags: [] as string[],
  } as IExercice);
  const editorRef = useRef(null as any);
  const theme = useTheme();

  const [compile, setIsCompile] = useState(false);

  const [annotations, setAnnotations] = useState([] as Ace.Annotation[]);

  const [link, setLink] = useState(undefined as string | undefined);

  const [rawResponse, setRawResponse] = useState({});

  useEffectOnce(() => {
    Request("exercises", "tags")
      .get()
      .then((v) => {
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  useEffectOnce(() => {
    Request("exercises", ":token", ":id", "json")
      .params({ token, id })
      .get()
      .then((v) => {
        if (v.message === "Invalid token") return;
        if (v.message === "No json was found") return;
        setExercice({
          id: v._id,
          title: v.title,
          raw: v.raw,
          visible: v.visible,
          tags: v.tags,
          author: v.author,
        });
        if (v.link) setLink(v.link);
      });
  });

  useEffect(() => {
    const completer = {
      getCompletions: function (
        _editor: any,
        _session: any,
        _pos: any,
        _prefix: any,
        callback: any
      ) {
        var completions = json.map((v) => {
          return {
            caption: v.label,
            snippet: v.snippet,
            type: v.type,
          };
        });

        callback(null, completions);
      },
      identifierRegexps: [
        /[a-zA-Z_0-9\\$\-\u00A2-\u2000\u2070-\uFFFF]/ as RegExp,
      ],
    };

    addCompleter(completer);
  }, []);

  const handleEditorChange = (value: string) => {
    setExercice({
      ...exercice,
      raw: value,
    });
  };

  const handleSaveClick = () => {
    if ((exercice.title || "").trim() === "") {
      alert("Please write a valid title");
      return;
    }
    setLink(undefined);
    setIsCompile(true);
    Request("exercises", "edit", "json")
      .post({ ...exercice, token })
      .then((response) => {
        setAnnotations(response.annotations);
        if (response.$ok) {
          setLink(response.link);
        } else {
          setRawResponse(response.error);
          throw Error(response.error);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setIsCompile(false));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const code = event.which || event.keyCode;

      let charCode = String.fromCharCode(code).toLowerCase();
      if ((event.ctrlKey || event.metaKey) && charCode === "s") {
        event.preventDefault();
        handleSaveClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const [numPages, setNumPages] = useState<number>();

  const [scale, setScale] = useState<number>(2);

  const range = (n: number): number[] => {
    let l = [];
    for (let i = 0; i < n; i++) {
      l.push(i);
    }
    return l;
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <Paper
      elevation={3}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: 0,
        padding: 0,
        flex: 1,
        overflow: "hidden",
        overflowY: "scroll",
      }}
    >
      <Container
        maxWidth={false}
        style={{
          width: "100%",
          gap: 25,
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          margin: 5,
          padding: 0,
        }}
      >
        <TextField
          fullWidth={true}
          label="Title"
          variant="outlined"
          error={(exercice.title || "").trim() === ""}
          value={exercice.title}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setExercice({
              ...exercice,
              title: event.target.value.trimStart(),
            });
          }}
        />

        <Tooltip title="Save">
          <Button
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
            startIcon={<SaveIcon />}
            onClick={() => compile || handleSaveClick()}
            color={compile ? "warning" : "primary"}
            disabled={compile}
          >
            Save
          </Button>
        </Tooltip>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          <Tooltip title="Zoom+">
            <IconButton
              aria-label="zomm in"
              onClick={(e) => setScale(Math.ceil(100 * scale + 10) / 100)}
              size="large"
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
          <TextField
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
            value={Math.ceil(scale * 100)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              let current_v = scale;
              try {
                let v = Number.parseFloat(event.target.value) / 100;
                setScale(Number.isNaN(v) ? 1 : v);
              } catch (error) {
                setScale(Number.isNaN(current_v) ? 1 : current_v);
              }
            }}
          />
          <Tooltip title="Zoom-">
            <IconButton
              aria-label="zomm out"
              onClick={(e) => setScale(Math.ceil(100 * scale - 10) / 100)}
              size="large"
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </Container>

      <Container
        maxWidth={false}
        style={{
          marginTop: "auto",
          justifyContent: "center",
          overflow: "hidden",
          overflowY: "scroll",
          padding: 0,
          margin: 0,
          left: 0,
          flex: 1,
        }}
      >
        <Split
          className="wrapper-card"
          minSize={300}
          sizes={[50, 50]}
          expandToMin={false}
          gutterSize={40}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          gutter={() => {
            const gutterWrapper = document.createElement("div");
            gutterWrapper.innerHTML = renderToStaticMarkup(
              <div
                className="gutter"
                style={{
                  display: "flex",
                  height: "100%",
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    pointerEvents: "none",
                  }}
                >
                  <button
                    style={{
                      height: 50,
                      width: 10,
                      margin: 0,
                      padding: 0,
                      backgroundColor: "#697eca",
                      cursor: "pointer",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      pointerEvents: "all",
                    }}
                  >
                    <div>{">"}</div>
                    <div>{">"}</div>
                  </button>
                </div>
              </div>
            );
            return gutterWrapper;
          }}
        >
          <AceEditor
            style={{
              background: theme.palette.background.default,
              position: "relative",
              height: "100%",
              width: "100%",
              top: 0,
              left: 0,
              flex: 1,
              aspectRatio: 1,
              margin: 0,
              padding: 0,
            }}
            mode="latex"
            value={exercice.raw}
            theme={theme.palette.mode === "dark" ? "monokai" : "textmate"}
            className="editable editor"
            onChange={handleEditorChange}
            onValidate={setAnnotations}
            name="editor"
            width="100%"
            fontSize="15px"
            ref={editorRef.current}
            annotations={annotations}
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            enableSnippets={true}
            editorProps={{ $blockScrolling: true }}
          />

          <Container
            maxWidth={false}
            style={{
              aspectRatio: 1,
              display: "flex",
              justifyContent: "center",
              overflow: "hidden",
              overflowY: "scroll",
              overflowX: "scroll",
              margin: 0,
              padding: 0,
            }}
          >
            {JSON.stringify(rawResponse) !== "{}" ? (
              JSON.stringify(rawResponse)
            ) : (
              <div className="">
                <Document
                  className="document-class"
                  file={link}
                  options={options}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  {range(numPages || 0).map((i) => {
                    return (
                      <Page
                        key={i.toString()}
                        className="document-page"
                        pageNumber={i + 1}
                        scale={scale}
                      />
                    );
                  })}
                </Document>
              </div>
            )}
          </Container>
        </Split>
      </Container>

      <Container
        maxWidth={false}
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          alignItems: "center",
          margin: 0,
          padding: 0,
        }}
      >
        <FormControl
          variant="outlined"
          disabled={compile}
          style={{
            width: "75%",
            display: "flex",
            flexDirection: "row",
            margin: 0,
            padding: 0,
          }}
        >
          <Autocomplete
            style={{
              width: "100%",
            }}
            multiple={true}
            value={exercice.tags}
            disableCloseOnSelect={true}
            onChange={(e: any, newValue: string[] | null) => {
              setExercice({
                ...exercice,
                tags: newValue || [],
              });
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            options={available_tags}
            sx={{ width: 300 }}
            freeSolo
            renderInput={(params) => <TextField {...params} label="Tags" />}
          />
        </FormControl>

        <Button size="large">Go to Correction</Button>

        <Typography
          variant="h4"
          style={{
            display: "flex",
            alignContent: "center",
            alignItems: "center",
            margin: 10,
            gap: 10,
          }}
        >
          Visible
          <Checkbox
            size="large"
            disabled={link === undefined}
            checked={exercice.visible && !(link === undefined && !compile)}
            onChange={(e, b) => setExercice({ ...exercice, visible: b })}
          />
        </Typography>
      </Container>
    </Paper>
  );
}