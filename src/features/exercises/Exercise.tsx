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
interface IExercise {
  id: string;
  author: string;
  title: string;
  link: string;
  tags: string[];
}
const pdfjsVersion = packageJson.dependencies["pdfjs-dist"];

export function Exercise(props:{exercise: IExercise}) {
  return (
    <div>
      <h1>{props.exercise.title}</h1>
      <Worker
        workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjsVersion}/build/pdf.worker.min.js`}
      >
        <Viewer defaultScale={1} fileUrl={props.exercise.link} />
      </Worker>
    </div>
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
  return !fetched.current ? (
    <div></div>
  ) : (
    <ul>
      {exercises.map((v) => {
        return <li key={v.id}><Exercise exercise={v}/></li>;
      })}
    </ul>
  );
}
