/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import "./App.scss";
import MermaidWrapper from "./components/mermaid/MermaidView";
import {
  IMermaidEdgeDefinition,
  IMermaidNodeDefinition,
  MermaidChartDirection,
} from "./shared/models/mermaid.model";
import { Node, Edge, MarkerType } from "reactflow";
import ReactflowView from "./components/reactflow/ReactflowView";
import { v4 as uuidv4 } from "uuid";
import { MermaidParserEvent } from "./shared/models/mermaid.model";
import MonacoEditorView from "./components/monaco/MonacoView";

function App() {
  const [graphDefinition, setGraphDefinition] = useState(`flowchart TD
    A[Start] --> B{Is it?}
    B -- Yes --> C[OK]
    C --> D[Rethink]
    D --> B
    B -- No ----> E[End]`);

  const [reactflowNodes, setReactflowNodes] = useState<Node[]>([]);
  const [reactflowEdges, setReactflowEdges] = useState<Edge[]>([]);
  const [mermaidChartDirection, setMermaidChartDirection] =
    useState<MermaidChartDirection>(MermaidChartDirection.TD);

  function handleMermaidDefinitionChange(event: MermaidParserEvent) {
    const reactflowEdges: Edge[] = event.edges.map(
        (mermaidEdge: IMermaidEdgeDefinition, index: number) =>
          ({
            id: uuidv4(),
            source: mermaidEdge.start,
            target: mermaidEdge.end,
            type: "customEdgeType",
            markerStart: "oneOrMany",
            markerEnd: "arrow-end",
            style: { stroke: "#f6ab6c" },
            elementsSelectable: true,
            label: mermaidEdge.text,
            // markerEnd: {
            //   type: MarkerType.ArrowClosed,
            // },
            animated: false,
            data: {
              label: mermaidEdge.text,
              raw: mermaidEdge,
            },
          } as Edge)
      ),
      reactflowNodes: Node[] = event.nodes.map(
        (mermaidNode: IMermaidNodeDefinition, index: number) => ({
          id: mermaidNode.id,
          position: { x: index * 200, y: index * 200 },
          type: "customNodeType",
          dragHandle: ".custom-node",
          data: {
            label: mermaidNode.text,
            raw: mermaidNode,
            layoutDirection: event.direction,
          },
        })
      );

    console.log(
      reactflowNodes,
      reactflowNodes.map((item: any) => item.data.raw.text),
      event
    );

    setReactflowNodes(reactflowNodes);
    setReactflowEdges(reactflowEdges);
    setMermaidChartDirection(event.direction);
  }

  return (
    <>
      {/* General Editor Layout */}
      <div className="editor-layout">
        {/* Mermaid Side */}
        <div className="mermaid-editor">
          {/* Monaco Editor Container */}
          <div className="monaco-editor-container">
            <MonacoEditorView
              code={graphDefinition}
              onCodeChange={(event: string) => setGraphDefinition(event)}
            />
          </div>

          {/* Input Container */}
          {/* <div className="input-container">
            <textarea
              value={graphDefinition}
              onChange={(e) => setGraphDefinition(e.target.value)}
            ></textarea>
          </div> */}
          {/* Preview Container */}
          <div className="preview-container">
            <MermaidWrapper
              graphDefinition={graphDefinition}
              onMermaidDefinitionChange={(event: MermaidParserEvent) =>
                handleMermaidDefinitionChange(event)
              }
            />
          </div>
        </div>

        {/* Reactflow Side */}
        <div className="react-flow-editor">
          <ReactflowView
            nodes={reactflowNodes}
            edges={reactflowEdges}
            direction={mermaidChartDirection}
          ></ReactflowView>
        </div>
      </div>
    </>
  );
}

export default App;
