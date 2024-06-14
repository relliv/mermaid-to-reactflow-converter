/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App.css";
import MermaidWrapper from "./components/Mermaid";

function App() {
  const [graphDefinition, setGraphDefinition] = useState(`flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]`);

  return (
    <>
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
      <MermaidWrapper graphDefinition={graphDefinition} />
    </>
  );
}

export default App;
