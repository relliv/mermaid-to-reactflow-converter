/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { memo } from "react";
import { Handle, Position } from "reactflow";

export const RFCustomNode = memo(({ data }: any) => {
  return (
    <>
      <span>{data.label}</span>

      <Handle type="source" position={Position.Top} id="a" />
      <Handle type="source" position={Position.Right} id="b" />
      <Handle type="source" position={Position.Bottom} id="c" />
      <Handle type="source" position={Position.Left} id="d" />
    </>
  );
});
