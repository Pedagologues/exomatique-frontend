import { useState } from "react";
import * as prism from "prismjs";
import "prismjs/components/prism-latex";
import Editor from "react-simple-code-editor";
import "../../api/prisms.css";
import "./create_exercises.css";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import Request from "../../api/Request";
import { useParams } from "react-router-dom";
import { Worker } from "@react-pdf-viewer/core";
import { Viewer } from "@react-pdf-viewer/core";

// Import the styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";

// Import styles
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

export default function CreateExercises() {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    setInitialTab: (doc) => Promise.resolve(0),
  });
  const [code, setCode] = useState(`
  % This is a simple sample document.  For more complicated documents take a look in the exercise tab. Note that everything that comes after a % symbol is treated as comment and ignored when the code is compiled.
  
  \\documentclass{article} % \\documentclass{} is the first command in any LaTeX code.  It is used to define what kind of document you are creating such as an article or a book, and begins the document preamble
  
  \\usepackage{amsmath} % \\usepackage is a command that allows you to add functionality to your LaTeX code
  
  \\title{Simple Sample} % Sets article title
  \\author{My Name} % Sets authors name
  \\date{\\today} % Sets date for date compiled
  
  % The preamble ends with the command \\begin{document}
  \\begin{document} % All begin commands must be paired with an end command somewhere
      \\\\maketitle % creates title using information in preamble (title, author, date)
      
      \\section{Hello World!} % creates a section
      
      \\textbf{Hello World!} Today I am learning \\LaTeX. %notice how the command will end at the first non-alphabet charecter such as the . after \\LaTeX
       \\LaTeX{} is a great program for writing math. I can write in line math such as $a^2+b^2=c^2$ %$ tells LaTexX to compile as math
       . I can also give equations their own space: 
      \\begin{equation} % Creates an equation environment and is compiled as math
      \\gamma^2+\\theta^2=\\omega^2
      \\end{equation}
      If I do not leave any blank lines \\LaTeX{} will continue  this text without making it into a new paragraph.  Notice how there was no indentation in the text after equation (1).  
      Also notice how even though I hit enter after that sentence and here $\\downarrow$
       \\LaTeX{} formats the sentence without any break.  Also   look  how      it   doesn't     matter          how    many  spaces     I put     between       my    words.
      
      For a new paragraph I can leave a blank space in my code. 
  
  \\end{document} % This is the end of the document`);
  const token = useSelector((state: RootState) => state.credentials.token);
  let { id } = useParams();

  const [hasClicked, setClicked] = useState(false);
  const [hasPdf, setHasPdf] = useState(null as string | null);

  const onClick = () => {
    if (hasClicked) return;
    setHasPdf(null);
    setTimeout(() => {
      Request("exercises")
        .post({ token, id, latex: code })
        .then((v) => {
          if (v.message === "Invalid token") return;
          console.log(v);
          setHasPdf(JSON.parse(v.message).link);
        })
        .finally(() => setClicked(false));
    }, 200);
    setClicked(false);
  };

  return (
    <div className="editor">
      <div className="code">
        <Editor
          value={code}
          onValueChange={(code) => setCode(code)}
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
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js"></Worker>
          <Viewer defaultScale={1} fileUrl={hasPdf} plugins={[defaultLayoutPluginInstance]} />
        </div>
      )}
    </div>
  );
}
