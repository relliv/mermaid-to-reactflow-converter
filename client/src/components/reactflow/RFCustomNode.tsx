/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { memo, useRef } from "react";
import { Handle, Position } from "reactflow";
import { Tooltip } from "react-tooltip";
import Markdown from "react-markdown";
import { MermaidChartDirection } from "../../shared/models/mermaid.model";

export default memo(({ id, data, isConnectable }: any) => {
  const contentEditableLabelRef: any = useRef<HTMLDivElement>();

  function onLabelDoubleClick(): void {
    contentEditableLabelRef.current.contentEditable = "true";
    contentEditableLabelRef.current.focus();
  }

  function onLabelBlur(): void {
    contentEditableLabelRef.current.contentEditable = "false";
  }

  return (
    <div className="custom-node" onDoubleClick={() => onLabelDoubleClick()}>
      <Handle
        id={id}
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <Tooltip
        delayShow={1000}
        variant="info"
        id="double-click-to-edit"
        place={
          data.layoutDirection === MermaidChartDirection.LR ? "bottom" : "right"
        }
        content="Double Click to Edit"
      />
      <div
        data-tooltip-id="double-click-to-edit"
        ref={contentEditableLabelRef}
        contentEditable="false"
        onBlur={onLabelBlur}
        className="custom-node-label"
      >
        <Markdown>{data.label}</Markdown>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        id="a"
        isConnectable={isConnectable}
      />

      <Handle
        id={id}
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});
