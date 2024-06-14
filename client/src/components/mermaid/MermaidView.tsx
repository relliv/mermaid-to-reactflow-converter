/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { ParserDefinition } from "mermaid/dist/diagram-api/types.js";
import {
  IMermaidNodeDefinition,
  IMermaidEdgeDefinition,
  MermaidParserEvent,
} from "../../shared/models/mermaid.model";

interface MermaidViewProps {
  graphDefinition: string;
  onMermaidDefinitionChange: (event: MermaidParserEvent) => void;
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

    const mermaidEdges = (parser.getEdges() as IMermaidEdgeDefinition[]) || [],
      mermaidNodes = (parser.getVertices() as IMermaidNodeDefinition[]) || [];

    onMermaidDefinitionChange({
      nodes: Object.values(mermaidNodes),
      edges: mermaidEdges,
      direction: parser.getDirection(),
    });

    // TODO: remogve unused variables
    const outputParser = {
      title: parser.getDiagramTitle(),
      accTitle: parser.getAccTitle(),
      edges: parser.getEdges(),
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
