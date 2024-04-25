import { useEffect, useState } from "react";
import useEffectOnce from "../../api/hook/fetch_once";
import Request from "../../api/Request";
// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";

import packageJson from "../../../package.json";
import {
  Card,
  Checkbox,
  FormControlLabel,
  List,
  Paper,
  useTheme,
} from "@mui/material";
interface IExercise {
  id: string;
  author: string;
  title: string;
  link: string;
  tags: string[];
}
const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

export function Exercise(props: { exercise: IExercise }) {
  const theme = useTheme();
  return (
    <Card>
      <h1>{props.exercise.title}</h1>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
      >
        <Viewer
          defaultScale={1}
          fileUrl={props.exercise.link}
          theme={theme.palette.mode}
        />
      </Worker>
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
        console.log(v);
        setAvailableTags(JSON.parse(v.message).tags);
      });
  });

  if (!fetched.current || !fecthed2.current) return <div></div>;
  console.log(availableTags);
  return (
    <Paper
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      <div
        style={{
          width: "30%",
          marginLeft: 0,
          padding: 5,
          display: "flex",
        }}
      >
        <Paper
          elevation={5}
          style={{
            display: "flex",
            width: "100%",
            height: 200,
            color: "red",
            flexGrow: 1,
          }}
        >
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              alignContent: "center",
            }}
          >
            {["Complexité", "Programmation dynamique"].map((v) => {
              return (
                <FormControlLabel control={<Checkbox />} label={v} />
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
          flexGrow: 1,
        }}
      >
        <Paper
          style={{
            width: "50%",
          }}
        >
          <ul>
            {exercises.map((v) => {
              return (
                <li
                  key={v.id}
                  style={{
                    listStyleType: "none",
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
