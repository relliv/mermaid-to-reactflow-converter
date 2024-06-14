/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import React from "react";
import { memo, useCallback } from "react";
import { Handle, Position } from "reactflow";

const handleStyle = { left: 10 };

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
          {data.label}
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
