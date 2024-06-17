import { useEffect } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Edge,
  Node,
  BackgroundVariant,
  ConnectionMode,
  ReactFlowProvider,
  NodeChange,
  useReactFlow,
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

// TODO: replace with dynamic calculation
const nodeWidth = 250;
const nodeHeight = 200;

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
  const [edges, setEdges] = useEdgesState([]);

  useEffect(() => {
    setNodes(props.nodes || []);
    setEdges(props.edges || []);

    updateGraphLayout(props.nodes, props.edges, props.direction);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        {/* arrow-end */}
        <marker
          id="arrow-end"
          viewBox="0 0 100 100"
          markerHeight={20}
          markerWidth={20}
          refX={50}
          refY={50}
        >
          {/* source: https://www.svgrepo.com/svg/108052/arrow-down-filled-triangle */}
          <path
            fill="#f6ab6c"
            stroke="#f6ab6c"
            d="M0.561,20.971l45.951,57.605c0.76,0.951,2.367,0.951,3.127,0l45.956-57.609c0.547-0.689,0.709-1.716,0.414-2.61
		c-0.061-0.187-0.129-0.33-0.186-0.437c-0.351-0.65-1.025-1.056-1.765-1.056H2.093c-0.736,0-1.414,0.405-1.762,1.056
		c-0.059,0.109-0.127,0.253-0.184,0.426C-0.15,19.251,0.011,20.28,0.561,20.971z"
          />
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
        onNodesChange={onCustomNodesChangeHandler}
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
 * @param {ReactflowViewProps} props - the props to be passed down to the ErdBuilder component
 * @return {JSX.Element} the wrapped ErdBuilder component
 */
const ReactflowViewWithProvider = (props: ReactflowViewProps): JSX.Element => {
  return (
    <ReactFlowProvider>
      <ReactflowView {...props} />
    </ReactFlowProvider>
  );
};

export default ReactflowViewWithProvider;
