/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App.scss";
import MermaidWrapper, {
  MermaidEdgeDefinition,
  MermaidNodeDefinition,
} from "./components/mermaid/MermaidView";
import { Node, Edge, MarkerType } from "reactflow";
import ReactflowView from "./components/reactflow/ReactflowView";
import { v4 as uuidv4 } from "uuid";

function App() {
  const [graphDefinition, setGraphDefinition] = useState(`flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]`);

  const [reactflowNodes, setReactflowNodes] = useState<Node[]>([]);
  const [reactflowEdges, setReactflowEdges] = useState<Edge[]>([]);

  function handleMermaidDefinitionChange(
    mermaidNodes: MermaidNodeDefinition[],
    mermaidEdges: MermaidEdgeDefinition[]
  ) {
    const reactflowEdges: Edge[] = mermaidEdges.map(
        (mermaidEdge: MermaidEdgeDefinition, index: number) =>
          ({
            id: uuidv4(),
            source: mermaidEdge.start,
            target: mermaidEdge.end,
            type: "customEdgeType",
            markerStart: "oneOrMany",
            markerEnd: "oneOnlyOne",
            // sourceHandle:
            //   sourceNode.data.fields[
            //     faker.number.int({
            //       min: 0,
            //       max: sourceNode.data.fields.length - 1,
            //     })
            //   ].id,
            // targetHandle:
            //   targetNode.data.fields[
            //     faker.number.int({
            //       min: 0,
            //       max: targetNode.data.fields.length - 1,
            //     })
            //   ].id,
            animated: false,
            data: {
              label: mermaidEdge.text,
              raw: mermaidEdge,
            },
          } as Edge)
      ),
      reactflowNodes: Node[] = mermaidNodes.map(
        (mermaidNode: MermaidNodeDefinition, index: number) => ({
          id: mermaidNode.id,
          position: { x: index * 200, y: index * 200 },
          data: {
            label: mermaidNode.text,
            raw: mermaidNode,
          },
        })
      );

    console.log(
      reactflowNodes,
      reactflowNodes.map((item: any) => item.data.raw.text),
      mermaidEdges
    );

    setReactflowNodes(reactflowNodes);
    setReactflowEdges(reactflowEdges);
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
            ></textarea>
          </div>

          {/* Preview Container */}
          <div className="preview-container">
            <MermaidWrapper
              graphDefinition={graphDefinition}
              onMermaidDefinitionChange={(
                mermaidNodes: MermaidNodeDefinition[],
                mermaidEdges: MermaidEdgeDefinition[]
              ) => handleMermaidDefinitionChange(mermaidNodes, mermaidEdges)}
            />
          </div>
        </div>

        {/* Reactflow Side */}
        <div className="react-flow-editor">
          <ReactflowView
            nodes={reactflowNodes}
            edges={reactflowEdges}
          ></ReactflowView>
        </div>
      </div>
    </>
  );
}

export default App;
