import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import { IconButton, TextField, Tooltip } from "@mui/material";

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
// import "pdfjs-dist/web/pdf_viewer.css"
import "./reactpdf.css"


pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

export default function PdfViewer(props: {
  data: string;
  initialScale?: number;
}) {
  let { data, initialScale } = props;

  const [scale, setScale] = useState(initialScale || 2);
  const [numPages, setNumPages] = useState<number | undefined>(undefined);

  const range = (n: number): number[] => {
    let l = [];
    for (let i = 0; i < n; i++) {
      l.push(i);
    }
    return l;
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "red",
      }}
    >
      <link
        rel="stylesheet"
        type="text/html"
        href="../../node_modules/pdfjs-dist/web/pdf_viewer.css"
      />
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",

          overflow: "hidden",
          overflowY: "scroll",
          overflowX: "scroll",
        }}
      >
        <div
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            backgroundColor: "white",

            overflow: "hidden",
            overflowY: "scroll",
            overflowX: "scroll",
            padding: 10,
          }}
        >
          <Document
            className="document-class"
            file={
              data.length === 0
                ? undefined
                : `data:application/pdf;base64,${data}`
            }
            options={options}
            onLoadSuccess={(d) => setNumPages(d.numPages)}
          >
            {range(numPages || 0).map((i) => {
              return (
                <Page
                  key={scale + "@" + i.toString()}
                  className="document-page"
                  pageNumber={i + 1}
                  scale={scale}
                />
              );
            })}
          </Document>
        </div>
      </div>
      <div
        className="pdf_toolbar"
        style={{
          position: "absolute",
          display: "flex",
          top: 0,
          width: "100%",
          justifyContent: "center",
          minWidth: 0,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            backgroundColor: "#aaaf",
            padding: 10,
            minHeight: 80,
            borderRadius: 20,
          }}
        >
          <Tooltip title="Zoom-">
            <IconButton
              aria-label="zomm out"
              onClick={() => setScale(Math.ceil(100 * scale - 10) / 100)}
              size="large"
            >
              <ZoomOutIcon />
            </IconButton>
          </Tooltip>
          <TextField
            id="outlined-basic"
            label="Zoom"
            variant="outlined"
            value={Math.ceil(scale * 100)}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              let current_v = scale;
              try {
                let v = Number.parseFloat(event.target.value) / 100;
                setScale(Number.isNaN(v) ? 0 : v);
              } catch (error) {
                setScale(Number.isNaN(current_v) ? 1 : current_v);
              }
            }}
          />
          <Tooltip title="Zoom+">
            <IconButton
              aria-label="zomm in"
              onClick={() => setScale(Math.ceil(100 * scale + 10) / 100)}
              size="large"
            >
              <ZoomInIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
