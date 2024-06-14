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
  Position,
} from "reactflow";
import RFCustomEdge from "./RFCustomEdge";
import RFCustomNode from "./RFCustomNode";
import dagre from "dagre";

import { MermaidChartDirection } from "../../shared/models/mermaid.model";

const nodeTypes = {
    customNodeType: RFCustomNode,
  },
  edgeTypes = {
    customEdgeType: RFCustomEdge,
  };

const nodeWidth = 250;
const nodeHeight = 150;

export interface ReactflowViewProps {
  nodes: Node[];
  edges: Edge[];
  direction: MermaidChartDirection;
}

const ReactflowView = (props: ReactflowViewProps): JSX.Element => {
  // react flow hooks
  const reactFlowInstance = useReactFlow();

  // shared states
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(props.nodes || []);
    setEdges(props.edges || []);

    updateGraphLayout(props.nodes, props.edges, props.direction);
  }, [props.nodes, props.edges, props.direction]);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  /**
   * Updates the dagre graph layout
   *
   * @source https://reactflow.dev/examples/layout/dagre
   */
  const updateGraphLayout = (
    nodes: Node[],
    edges: Edge[],
    direction: MermaidChartDirection
  ): { nodes: Node[]; edges: Edge[] } => {
    const isHorizontal = direction === MermaidChartDirection.LR;

    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node: Node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge: Edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node: Node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? Position.Left : Position.Top;
      node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    setTimeout(() => {
      reactFlowInstance.fitView({
        duration: 1000,
        padding: 0.5,
        nodes: nodes,
      });
    }, 500);

    return { nodes, edges };
  };

  const onCustomNodesChangeHandler = (changes: NodeChange[]): void => {
    onNodesChange(changes);
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        version="1.1"
        fill="transparent"
        stroke="black"
        strokeWidth="4"
        width="24"
        height="24"
        viewBox="0 0 100 100"
        className="absolute"
      >
        {/* oneOnlyOne */}
        <marker
          id="oneOnlyOne"
          viewBox="0 0 100 100"
          markerHeight={20}
          markerWidth={20}
          refX={80}
          refY={50}
        >
          <path d="M0 50 L100 50 M25 25 L 25 75 M75 25 L75 75" />
        </marker>

        {/* oneOrMany */}
        <marker
          id="oneOrMany"
          viewBox="0 0 100 100"
          markerHeight={20}
          markerWidth={20}
          refX={28}
          refY={50}
        >
          <path d="M100 50 L0 50 M50 50 L 100 25 M50 50 L100 75 M25 25 L25 75" />
        </marker>
      </svg>

      {/* Reactflow Board */}
      <ReactFlow
        fitView
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapToGrid={true}
        snapGrid={[20, 20]}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
        attributionPosition="bottom-left"
        elementsSelectable={true}
        connectionMode={ConnectionMode.Loose}
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
        onNodesChange={onCustomNodesChangeHandler}
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
