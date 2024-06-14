/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App.scss";
import MermaidWrapper, {
  MermaidEdgeDefinition,
} from "./components/mermaid/MermaidView";

function App() {
  const [graphDefinition, setGraphDefinition] = useState(`flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]`);

  function handleMermaidDefinitionChange(
    mermaidEdges: MermaidEdgeDefinition[]
  ) {
    console.log("*0*0*0*0*0*", { mermaidEdges });
  }

  return (
    <>
      {/* General Editor Layout */}
      <div className="editor-layout">
        {/* Mermaid Side */}
        <div className="mermaid-editor">
          {/* Input Container */}
          <div className="input-container">
            <textarea
              value={graphDefinition}
              onChange={(e) => setGraphDefinition(e.target.value)}
              style={{
                width: "700px",
                height: "200px",
                padding: "10px",
                fontSize: "16px",
              }}
            ></textarea>
          </div>

          {/* Preview Container */}
          <div className="preview-container">
            <MermaidWrapper
              graphDefinition={graphDefinition}
              onMermaidDefinitionChange={(event: MermaidEdgeDefinition[]) =>
                handleMermaidDefinitionChange(event)
              }
            />
          </div>
        </div>

        {/* Reactflow Side */}
        <div className="react-flow-editor"></div>
      </div>
    </>
  );
}

export default App;
