import { Button, IconButton, Paper } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import IExercise from "./IExercise";
import Request from "../../api/Request";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

import "./exercise_view.css";

import PdfViewer from "../pdf_viewer/PdfViewer";

export default function ExerciseView(props: {
  exercise: IExercise;
  disable: () => void;
}) {
  const accountId = useSelector((state: RootState) => state.credentials.id);

  const accountToken = useSelector(
    (state: RootState) => state.credentials.token
  );

  let { exercise, disable } = props;
  let link = exercise.link;

  let [correction_mode, setCorrectionMode] = useState(false);
  const [pdfString, setPdfString] = useState("");

  const updatePdf = (): void => {
    const get_link = (): any => {
      if (link === undefined) return undefined;
      if (correction_mode) {
        return link + "_correction";
      }
      return link;
    };
    let new_link = get_link();
    if (new_link === undefined) return;
    Request(new_link)
      .env(false)
      .params({ id: accountId })
      .post({ token: accountToken })
      .then(async (response) => {
        if (response.$ok === undefined) {
          let reader = new FileReader();
          reader.readAsDataURL(await response.blob());
          reader.onloadend = () => {
            let base64String: string = String(reader.result) || "";
            setPdfString(base64String.substring(base64String.indexOf(",") + 1));
          };
        } else if (!response.$ok) {
          throw new Error("Invalid Pdf");
        } else if (response.$status === 202) {
          setTimeout(updatePdf, 5000);
          throw new Error("Pdf is being built");
        }
      })
      .catch((e) => {
        console.error(e);
        return setPdfString("");
      });
  };

  useEffect(updatePdf, [accountId, accountToken, correction_mode, link, updatePdf]);

  return (
    <Paper
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <IconButton
        color="error"
        size="large"
        style={{
          position: "absolute",
          right: 0,
          zIndex: 100,
        }}
        onClick={disable}
      >
        <CloseOutlinedIcon />
      </IconButton>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <PdfViewer data={pdfString} initialScale={3} />

        <div
          className="pdf_toolbar"
          style={{
            position: "absolute",
            display: "flex",
            bottom: 0,
            width: "100%",
            justifyContent: "center",
            minWidth: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#222f",
              padding: 10,
              minHeight: 80,
              borderRadius: 20,
              border: "outlined",
            }}
          >
            <Button
              size="large"
              onClick={() => setCorrectionMode(!correction_mode)}
            >
              {correction_mode ? "Switch to Exercise" : "Switch to Correction"}
            </Button>
          </div>
        </div>
      </div>
    </Paper>
  );
}
