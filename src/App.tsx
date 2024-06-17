import { useState } from "react";
import "./App.scss";
import MermaidWrapper from "./components/mermaid/MermaidView";
import {
  IMermaidEdgeDefinition,
  IMermaidNodeDefinition,
  MermaidChartDirection,
} from "./shared/models/mermaid.model";
import { Node, Edge } from "reactflow";
import ReactflowView from "./components/reactflow/ReactflowView";
import { v4 as uuidv4 } from "uuid";
import { MermaidParserEvent } from "./shared/models/mermaid.model";
import MonacoEditorView from "./components/monaco/MonacoView";
import { Allotment } from "allotment";
import { editor } from "monaco-editor";

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
  const [editorInstance, setEditorInstance] =
    useState<editor.IStandaloneCodeEditor>();

  function handleMermaidDefinitionChange(event: MermaidParserEvent) {
    const reactflowEdges: Edge[] = event.edges.map(
        (mermaidEdge: IMermaidEdgeDefinition) =>
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

    setReactflowNodes(reactflowNodes);
    setReactflowEdges(reactflowEdges);
    setMermaidChartDirection(event.direction);
  }

  function resetEditorLayout(): void {
    editorInstance?.layout();
  }

  function onEditorInit(editor: editor.IStandaloneCodeEditor) {
    setEditorInstance(editor);

    resetEditorLayout();
  }

  return (
    <>
      {/* General Editor Layout */}
      <div className="editor-layout">
        <Allotment
          onChange={() => resetEditorLayout()}
          onDragEnd={() => resetEditorLayout()}
        >
          {/* Mermaid Side */}
          <Allotment.Pane minSize={500}>
            <div className="mermaid-editor">
              <h1>Mermaid Editor</h1>

              {/* Monaco Editor Container */}
              <div className="monaco-editor-container">
                <MonacoEditorView
                  code={graphDefinition}
                  onCodeChange={(event: string) => setGraphDefinition(event)}
                  onInit={(editor: editor.IStandaloneCodeEditor) =>
                    onEditorInit(editor)
                  }
                />
              </div>

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
          </Allotment.Pane>

          {/* Reactflow Side */}
          <Allotment.Pane minSize={500}>
            <div className="react-flow-editor">
              <h1>Reactflow Editor</h1>

              <ReactflowView
                nodes={reactflowNodes}
                edges={reactflowEdges}
                direction={mermaidChartDirection}
              ></ReactflowView>
            </div>
          </Allotment.Pane>
        </Allotment>
      </div>
    </>
  );
}

export default App;
