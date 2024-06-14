/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ParserDefinition } from "mermaid/dist/diagram-api/types.js";

export interface MermaidEdgeDefinition {
  start: string;
  end: string;
  type: string;
  text: string;
  labelType: string;
  stroke: string;
  length: number;
}

export interface MermaidNodeDefinition {
  id: string;
  labelType: string;
  domId: string;
  styles: any[];
  classes: any[];
  text: string;
  type: string;
  props: any;
}

interface MermaidViewProps {
  graphDefinition: string;
  onMermaidDefinitionChange: (
    mermaidNodes: MermaidNodeDefinition[],
    mermaidEdges: MermaidEdgeDefinition[]
  ) => void;
}

const MermaidView: FC<MermaidViewProps> = ({
  graphDefinition,
  onMermaidDefinitionChange,
}) => {
  const [currentGraphDefinition, setCrrentGraphDefinition] = useState<
    string | null
  >(null);
  const mermaidChartElementRef: any = useRef<HTMLDivElement>();

  useEffect(() => {
    setTimeout(() => {
      if (graphDefinition !== currentGraphDefinition) {
        (async () => {
          await renderMermaidChart(graphDefinition);
          await parseMermaidChart(graphDefinition);
        })();

        setCrrentGraphDefinition(graphDefinition);
      }
    }, 500);
  }, [currentGraphDefinition, graphDefinition]);

  /**
   * Re-renders the mermaid chart
   */
  async function renderMermaidChart(
    graphDefinitionText: string
  ): Promise<void> {
    mermaid.initialize({
      startOnLoad: false,
    });

    const renderResult = await mermaid.render(
      "mermaidChart",
      graphDefinitionText
    );

    if (!renderResult) {
      alert("Could not render mermaid chart");
    }

    mermaidChartElementRef.current!.innerHTML = renderResult.svg;
  }

  /**
   * Parse the mermaid chart
   */
  async function parseMermaidChart(graphDefinitionText: string): Promise<void> {
    const diagram = await mermaid.mermaidAPI.getDiagramFromText(
      graphDefinitionText
    );
    const parser = (diagram.getParser() as ParserDefinition as any).yy;

    const mermaidEdges = (parser.getEdges() as MermaidEdgeDefinition[]) || [],
      mermaidNodes = (parser.getVertices() as MermaidNodeDefinition[]) || [];

    onMermaidDefinitionChange(Object.values(mermaidNodes), mermaidEdges);

    // TODO: remogve unused variables
    const outputParser = {
      title: parser.getDiagramTitle(),
      accTitle: parser.getAccTitle(),
      edges: parser.getEdges() as MermaidEdgeDefinition[],
      vertices: parser.getVertices(),
      tooltip: parser.getTooltip(),
      direction: parser.getDirection(),
      classes: parser.getClasses(),
      subGraphs: parser.getSubGraphs(),
    };
    console.log("------> outputParser", outputParser);
  }

  return (
    <>
      {graphDefinition ? (
        <div
          className="mermaid"
          id="mermaidChartt"
          ref={mermaidChartElementRef}
        >
          {graphDefinition}
        </div>
      ) : null}
    </>
  );
};

export default MermaidView;
