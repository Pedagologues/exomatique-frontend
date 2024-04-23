import { useEffect, useRef, useState } from "react";
import * as prism from "prismjs";
import "prismjs/components/prism-latex";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import Request from "../../api/Request";
import { useNavigate, useParams } from "react-router-dom";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Editor from "react-simple-code-editor";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";
import "../../api/prisms.css";
import "./create_exercises.css";
import packageJson from "../../../package.json";
import CreatableSelect from "react-select/creatable";
import makeAnimated from "react-select/animated";
import { Checkbox } from "@mui/material";
import { MultiValue } from "react-select";

const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

export default function CreateExercise() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const { id } = useParams();
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    setInitialTab: (doc) => Promise.resolve(0),
  });
  const [raw, setRaw] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState([] as string[]);
  const [visible, setVisible] = useState(false);

  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    Request("exercises", ":token", ":id", "json")
      .params({ token, id })
      .get()
      .then((v) => {
        if (v.message === "Invalid token") return;
        if (v.message === "No json was found") return;
        let parsed = JSON.parse(v.message);
        console.log("PARSED "+JSON.stringify(parsed));
        setTitle(parsed.title);
        setRaw(parsed.raw);
        setVisible(parsed.visible);
        setTags(parsed.tags as string[]);
        setAuthor(parsed.author);
      });
  });
  const fetched2 = useRef(false);
  const [availableTags, setAvailableTags] = useState([] as string[]);
  const animatedComponents = makeAnimated();
  useEffect(() => {
    if (fetched2.current) return;
    fetched2.current = true;

    Request("exercises", "tags")
      .get()
      .then((v) => {
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  const [hasClicked, setClicked] = useState(false);
  const [hasPdf, setHasPdf] = useState(
    ("http://localhost:3002/exercises/" + id + "/" + id + ".pdf") as
      | string
      | null
  );

  const onClick = () => {
    console.log("CLICKED");
    if (hasClicked) return;
    setHasPdf(null);
    setTimeout(() => {
      console.log("PASSED");
      Request("exercises", "edit", "json")
        .post({ token, id, raw, title, author, tags, visible })
        .then((v) => {
          console.log("RETURN " + v.message);
          if (v.message === "Invalid token") return;
          setHasPdf(JSON.parse(v.message).link);
        })
        .catch((e) => console.error(e))
        .finally(() => setClicked(false));
    }, 200);
    setClicked(false);
  };

  const handleChangeVisibility = (e: any, b: boolean) => {
    setVisible(b);
  };
  type Option = {
    value: string
  }

  const handleChangeTags = (mv:MultiValue<unknown>, e:any) => {
    setTags(mv.map(v=>(v as Option).value))
  }

  return (
    <div>
      <div className="editor">
        <div className="code">
          <Editor
            value={raw}
            onValueChange={(code) => setRaw(code)}
            highlight={(code) =>
              prism.highlight(code, prism.languages.latex, "latex")
            }
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 12,
            }}
          />
          <button
            disabled={hasClicked}
            onClick={(e) => {
              onClick();
            }}
          >
            SAVE
          </button>
        </div>

        {!hasPdf ? (
          <div className="render">PDF</div>
        ) : (
          <div className="render">
            <Worker
              workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
            >
              <Viewer
                defaultScale={1}
                fileUrl={hasPdf}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          </div>
        )}
      </div>
      <CreatableSelect
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti={true}
        value={tags.map((v, _1, _2) => {
          return { value: v, label: v };
        })}
        options={availableTags.map((v, _1, _2) => {
          return { value: v, label: v };
        })}

        onChange={handleChangeTags}
      />
      <div>
        Visible
        <Checkbox
          title="Visible"
          checked={visible}
          onChange={handleChangeVisibility}
        />
      </div>
    </div>
  );
}

export function NewExerciseRedirection() {
  const token = useSelector((state: RootState) => state.credentials.token);
  const navigate = useNavigate();
  const fetched = useRef(false);
  useEffect(() => {
    if (fetched.current) return;
    fetched.current = true;
    Request("exercises", ":token", "new")
      .params({ token })
      .post({})
      .then((v): undefined => {
        if (v.message === "Invalid token") return;
        console.log("AZEBYIVAZOËBHVIAZOEKHAZIPBGVLEUI");
        if (v.$ok) {
          navigate("/exercises/edit/" + JSON.parse(v.message).id, {
            replace: true,
          });
        } else {
          navigate("/exercises/error", { replace: true });
        }
      });
  });

  return <div>Waiting for redirection ...</div>;
}
