import { FC, MutableRefObject, useRef } from "react";
import {
  EdgeProps,
  getBezierPath,
  EdgeLabelRenderer,
  BaseEdge,
} from "reactflow";

const RFCustomEdge: FC<EdgeProps> = ({
  id,
  style,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  markerStart,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const contentEditableLabelRef: MutableRefObject<HTMLDivElement | undefined> =
    useRef<HTMLDivElement>();

  function onLabelClick(): void {
    if (contentEditableLabelRef.current) {
      contentEditableLabelRef.current.contentEditable = "true";
      contentEditableLabelRef.current.focus();
    }
  }

  function onLabelBlur(): void {
    if (contentEditableLabelRef.current) {
      contentEditableLabelRef.current.contentEditable = "false";
    }
  }

  return (
    <>
      {/* Base Edge */}
      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={50}
        style={style}
        markerEnd={!data.erdReadyToConnect ? markerEnd : ""}
        markerStart={!data.erdReadyToConnect ? markerStart : ""}
      />

      <EdgeLabelRenderer>
        <div
          contentEditable="true"
          onClick={() => onLabelClick()}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            display: data.label.length > 0 ? "block" : "none",
          }}
          onBlur={() => onLabelBlur()}
          suppressContentEditableWarning={true}
          className="custom-edge-label nodrag nopan"
        >
          {data.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default RFCustomEdge;
