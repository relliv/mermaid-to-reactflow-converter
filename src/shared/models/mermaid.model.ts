export interface IMermaidEdgeDefinition {
  start: string;
  end: string;
  type: string;
  text: string;
  labelType: string;
  stroke: string;
  length: number;
}

export interface IMermaidNodeDefinition {
  id: string;
  labelType: string;
  domId: string;
  styles: string[];
  classes: string[];
  text: string;
  type: string;
  props: unknown;
}

export enum MermaidChartDirection {
  TD = "TD",
  LR = "LR",
}

export interface MermaidParserEvent {
  nodes: IMermaidNodeDefinition[];
  edges: IMermaidEdgeDefinition[];
  direction: MermaidChartDirection;
}
