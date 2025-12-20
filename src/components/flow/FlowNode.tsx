import { Handle, type NodeProps, Position } from "@xyflow/react";
import { type ChangeEventHandler, memo, useState } from "react";
import { snapGrid } from "../../utils/2d.ts";
import { clsx } from "clsx";
import { Circle } from "../isometric/Circle.tsx";
import type { Node } from "../../type.ts";
import { slugify } from "../../utils/string.ts";
import { useNodeUpdate } from "../../hooks/useGraph.ts";
import useToggle from "../../hooks/useToggle.tsx";
import { url } from "../../utils/url.ts";

type Props = NodeProps & Node;

const width = Math.round(snapGrid[0] * 2);
const height = Math.round(snapGrid[1] * 2);

export const FlowNode = memo(({ data, id, selected, type }: Props) => {
  const updateNode = useNodeUpdate();
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    updateNode({
      id: id,
      data: {
        ...data,
        name: e.target.value,
      },
    });
  };
  const [edit, setEdit] = useState(data.name === "");
  const [showImage, toggleImage] = useToggle(true);
  const toggleEdit = () => {
    setEdit((e) => !e);
  };

  const strokeColor = selected
    ? "oklch(44.8% 0.119 151.328)"
    : "var(--color-gray-500)";
  const fill = selected
    ? "oklch(89.7% 0.196 126.665)"
    : "var(--color-gray-200)";
  const titleStyle = clsx(
    "text-lg font-bold absolute -bottom-12 -translate-x-1/2 text-border text-center z-3",
    type === "gate" && "text-amber-600",
  );

  return (
    <div className="relative size-[1px]">
      <svg
        className="absolute top-0 left-0 -translate-1/2"
        width={width}
        height={height}
        viewBox={`${-width / 2} ${-height / 2} ${width} ${height}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        {type === "fork" && <Circle fill="#FFFFFFDD" stroke="#FFF" />}
        {(type === "default" || type === "formation") && (
          <>
            <Circle
              fill={strokeColor}
              stroke={strokeColor}
              transform="translate(0, 2)"
            />
            <Circle fill={fill} stroke={strokeColor} />
          </>
        )}
      </svg>
      {type === "fork" && (
        <div className="absolute -inset-5 skew-15 -rotate-45">
          <img
            alt=""
            width="30"
            height="30"
            src={url("roundabout.svg")}
            className="size-10 animate-spin duration-[2s] opacity-50"
            style={{ animationDuration: "10s", animationDirection: "reverse" }}
          />
        </div>
      )}
      {type === "gate" && (
        <img
          alt=""
          width={30}
          height={30}
          className="size-18 absolute -bottom-2 left-0 -translate-x-1/2 translate-y-2 transition-all"
          src={url(`${type}.svg`)}
        />
      )}
      {["default", "formation"].includes(type) && showImage && (
        <img
          alt=""
          width={50}
          onError={toggleImage}
          height={50}
          className="size-15 absolute bottom-2 left-0 -translate-x-1/2 hover:-translate-y-1 transition-all"
          src={url(`logos/${slugify(data.name)}.svg`)}
        />
      )}{" "}
      {edit ? (
        <input
          autoFocus
          className={clsx(titleStyle, "w-100")}
          defaultValue={data.name}
          onChange={onChange}
          onBlur={toggleEdit}
        />
      ) : (
        <div className={clsx(titleStyle, "w-max")} onClick={toggleEdit}>
          {data.name}
        </div>
      )}
      {/* @ts-expect-error We are loose, Handle accept no type */}
      <Handle position={Position.Top} className="react-flow__handle" />
    </div>
  );
});
