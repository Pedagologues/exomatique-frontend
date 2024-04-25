import React, { useState, useEffect } from "react";
import Split from "react-split";
import LatexEditorView from "./components/LatexEditorView";
import PdfEditorView from "./components/PdfEditorView";

export default function Test(){

  const [latex, setLatex] = useState("");
  const [orientation, setOrientation] = useState("horizontal" as  'horizontal' | 'vertical');
  const [compile, isCompile] = useState(true);

  useEffect(() => {
    let changeOrientation = () => {
      setOrientation(window.innerWidth < 600 ? "vertical" : "horizontal");
    };
    changeOrientation();
    window.onresize = changeOrientation;
  }, []);

  return <div className="work-area">
    <Split
      className="wrapper-card"
      sizes={[50, 50]}
      minSize={orientation === "horizontal" ? 300 : 100}
      expandToMin={true}
      gutterAlign="center"
      direction={orientation}
    >
      <LatexEditorView content={latex} changeContent={setLatex} isCompile={isCompile} compile={compile} />
      <PdfEditorView content={latex} isCompile={isCompile} />
    </Split>
  </div>
} 