import React, { useEffect, useState, useRef } from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  Tooltip,
  useTheme,
  IconButton,
  Button,
  styled,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CopyIcon from "@mui/icons-material/ContentCopy";
import CleanIcon from "@mui/icons-material/Delete";

import AceEditor from "react-ace";
import "ace-builds/webpack-resolver";
import useClipboard from "react-use-clipboard";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/snippets/latex";
import "ace-builds/src-noconflict/ext-language_tools";
import { addCompleter } from "ace-builds/src-noconflict/ext-language_tools";

import json from "./mathjax.snippet.json";
import { Ace } from "ace-builds";

import "./create.css";

export default function LatexEditorView(props: {
  content: string;
  changeContent: React.Dispatch<React.SetStateAction<string>>;
  isCompile: React.Dispatch<React.SetStateAction<boolean>>;
  compile: boolean;
}) {
  const [open, setOpen] = useState(false);
  const editorRef = useRef(null as any);
  const [isCopied, setCopied] = useClipboard(props.content);
  const theme = useTheme();

  const [annotations, setAnnotations] = useState([] as Ace.Annotation[]);

  useEffect(() => {
    //Set content from network
  }, [props]);

  useEffect(() => {
    const completer = {
      getCompletions: function (
        editor: any,
        session: any,
        pos: any,
        prefix: any,
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

  const handleEditorChange = (value: string, event: any) => {
    props.changeContent(value);
  };

  const handleClearClick = () => {
    props.changeContent("");
    editorRef.current?.focus();
  };

  const handleSaveClick = () => {
    let blob = new Blob([props.content], {
      type: "text/plain",
    });
    let a = document.createElement("a");
    a.download = "latex.tex";
    a.href = window.URL.createObjectURL(blob);
    a.click();
  };

  const handleCopyClick = () => {
    setCopied();
    navigator.clipboard.writeText(props.content);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  document.body.style.setProperty(
    "--primary-color",
    theme.palette.primary.main
  );
  document.body.style.setProperty(
    "--accent-color",
    theme.palette.secondary.main
  );
  document.body.style.setProperty(
    "--nav-section-text-color",
    theme.palette.secondary.main
  );
  document.body.style.setProperty("--body-color", "#fff");
  document.body.style.setProperty("--nav-item-color", "#fff");
  document.body.style.setProperty("--body-accent-color", "#e1e4e8");
  document.body.style.setProperty("--alternate-table-color", "#eaecef");
  document.body.style.setProperty(
    "--primary-text-color",
    theme.palette.primary.contrastText
  );
  document.body.style.setProperty("--link-color", "var(--primary-color)");
  document.body.style.setProperty("--table-border-color", "#ddd");
  document.body.style.setProperty(
    "--source-code-font",
    "Source Code Pro, monospace"
  );
  document.body.style.setProperty("--open-sans-font", "Open Sans, sans-serif");
  document.body.style.setProperty("--color-transition", "0.3s ease-out");

  return (
    <div>
      <div className="latex-edit scroll">
        <div className="section-title">
          <h3>Latex editor</h3>
          <div className="right-section">
            <Tooltip title="Save Latex">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<SaveIcon />}
                onClick={handleSaveClick}
              >
                Save
              </Button>
            </Tooltip>
            <Tooltip title="Copy to Clipboard">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CopyIcon />}
                onClick={handleCopyClick}
              >
                Copy
              </Button>
            </Tooltip>
            <Tooltip title="Clean">
              <Button
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                startIcon={<CleanIcon />}
                onClick={handleClearClick}
              >
                Copy
              </Button>
            </Tooltip>
          </div>
        </div>

        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity="success"
            elevation={6}
            variant="filled"
          >
            <AlertTitle>Copied</AlertTitle>
            The latex is copied to your clipboard
          </Alert>
        </Snackbar>
        <AceEditor
          style={{
            background: theme.palette.background.default,
          }}
          mode="latex"
          value={props.content}
          theme={theme.palette.mode === "dark" ? "monokai" : "textmate"}
          className="editable editor"
          onChange={handleEditorChange}
          onValidate={setAnnotations}
          name="editor"
          height="96%"
          width="100%"
          fontSize="15px"
          ref={editorRef.current}
          annotations={annotations}
          enableBasicAutocompletion={true}
          enableLiveAutocompletion={true}
          enableSnippets={true}
          editorProps={{ $blockScrolling: true }}
        />
      </div>
    </div>
  );
}
