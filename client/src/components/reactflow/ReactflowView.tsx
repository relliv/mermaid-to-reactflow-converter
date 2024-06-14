/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  MiniMap,
  Controls,
  Background,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionMode,
  OnSelectionChangeParams,
  ReactFlowProvider,
  NodeChange,
  EdgeChange,
  useReactFlow,
  useViewport,
  useKeyPress,
  Panel,
  ControlButton,
  getRectOfNodes,
  getTransformForBounds,
} from "reactflow";

const nodeTypes = {
    // customEntityNodeType: RFCustomNode,
  },
  edgeTypes = {
    // customEdgeType: EdgeNode,
  };

export interface ReactflowViewProps {
  nodes: Node[];
  edges: Edge[];
}

const ReactflowView = (props: ReactflowViewProps): JSX.Element => {
  // react flow hooks
  const reactFlowInstance = useReactFlow();

  // shared states
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  return (
    <>
      {/* Reactflow Board */}
      <ReactFlow
        fitView
        nodes={props.nodes}
        edges={props.edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
        elementsSelectable={true}
        connectionMode={ConnectionMode.Loose}
        nodesConnectable={selectedNode !== null}
        multiSelectionKeyCode={null} // disable multi selection
        contextMenu="true"
        onlyRenderVisibleElements={true}
        // context menu events
        // onPaneContextMenu={showBoardContextMenu}
        // onNodeContextMenu={showNodeContextMenu}
        // onEdgeContextMenu={showEdgeContextMenu}
        // // edge events
        // onConnect={onEdgeConnect}
        // onEdgeClick={onEdgeClick}
        // onEdgeMouseEnter={onEdgeMouseEnter}
        // onEdgeMouseLeave={onEdgeMouseLeave}
        // onEdgesChange={onCustomEdgesChangeHandler}
        // // node events
        // onNodeClick={onNodeClick}
        // onNodesChange={onCustomNodesChangeHandler}
        // onNodeMouseEnter={onNodeMouseEnter}
        // onNodeMouseLeave={onNodeMouseLeave}
        // onSelectionChange={onNodeSelectionChange}
        // onNodeDragStop={onNodeDragStop}
        // // board events
        // onMoveStart={onBoardMoveStart}
        // // onInit={onBoardInit}
      >
        <MiniMap zoomable pannable className="minimap" />

        <Background
          gap={20}
          className="erd-bg"
          variant={BackgroundVariant.Dots}
        />
      </ReactFlow>
    </>
  );
};

/**
 * Creates an ErdBuilder component wrapped with ReactFlowProvider, passing down the provided props.
 *
 * @param {any} props - the props to be passed down to the ErdBuilder component
 * @return {JSX.Element} the wrapped ErdBuilder component
 */
const ReactflowViewWithProvider = (props: any): JSX.Element => {
  return (
    <ReactFlowProvider>
      <ReactflowView {...props} />
    </ReactFlowProvider>
  );
};

export default ReactflowViewWithProvider;
