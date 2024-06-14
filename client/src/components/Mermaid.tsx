/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

interface MermaidWrapperProps {
  graphDefinition: string;
}

const MermaidWrapper: FC<MermaidWrapperProps> = ({ graphDefinition }) => {
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
    const parser = (diagram.getParser() as any).yy;

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

export default MermaidWrapper;
