/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";
import Markdown from "react-markdown";

export default memo(({ id, data, isConnectable }: any) => {
  const onChange = useCallback((evt: any) => {
    console.log(evt.target.innerText);
  }, []);

  return (
    <div className="custom-node">
      <Handle
        id={id}
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />

      <div>
        <div
          contentEditable="true"
          id="text"
          onBlur={onChange}
          className="nodrag"
        >
          <Markdown>{data.label}</Markdown>
        </div>
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
