import { Handle, Position } from "@xyflow/react";
import { type ChangeEventHandler, memo, useState } from "react";
import { clsx } from "clsx";
import { Circle } from "../isometric/Circle.tsx";
import { slugify } from "../../utils/string.ts";
import { useNodeUpdate } from "../../hooks/useGraph.ts";
import useToggle from "../../hooks/useToggle.tsx";
import { type Node } from "../../type.ts";
import { url } from "../../utils/url.ts";

type Props = {
  id: string;
  data: Node["data"];
  selected: boolean;
  type: string;
};

const size = 50;

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
  const isCompleted = data.progress === 100;

  const titleStyle = clsx(
    "text-lg font-bold absolute -bottom-12 -translate-x-1/2 text-border text-center z-3",
    type === "gate" && "text-amber-600",
  );

  return (
    <div
      className={clsx(
        "relative size-px",
        isCompleted && "is-completed",
        selected && "is-selected",
      )}
    >
      {(type === "default" || type === "formation") && (
        <SupportIcon completed={isCompleted} />
      )}
      {type === "fork" && (
        <>
          <svg
            className="absolute top-0 left-0 -translate-1/2"
            width={size}
            height={size}
            viewBox={`${-size / 2} ${-size / 2} ${size} ${size}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <Circle fill="#FFFFFFDD" stroke="#FFF" />
          </svg>
          <div className="absolute -inset-5 skew-15 -rotate-45">
            <img
              alt=""
              width="30"
              height="30"
              src={url("roundabout.svg")}
              className="size-10 animate-spin duration-[2s] opacity-50"
              style={{
                animationDuration: "10s",
                animationDirection: "reverse",
              }}
            />
          </div>
        </>
      )}
      {type === "gate" && (
        <img
          alt=""
          width={30}
          height={30}
          className="size-18 absolute -bottom-2 -left-6 -translate-x-1/2 translate-y-3 transition-all"
          src={url(`${type}${data.rotate ? "-r" : ""}.svg`)}
        />
      )}
      {["default", "formation"].includes(type) && showImage && (
        <img
          alt=""
          width={50}
          onError={toggleImage}
          height={50}
          className="size-12 absolute bottom-2 left-0 -translate-x-1/2 hover:-translate-y-1 transition-all"
          src={url(`logos/${slugify(data.name)}.svg`)}
        />
      )}
      {edit ? (
        <input
          autoFocus
          className={clsx(titleStyle, "w-100")}
          defaultValue={data.name}
          onChange={onChange}
          onBlur={toggleEdit}
        />
      ) : (
        <div
          className={clsx(titleStyle, "w-max", type === "gate" && "isometric")}
          onClick={toggleEdit}
        >
          {data.name}
        </div>
      )}
      {/* @ts-expect-error We are loose, Handle accept no type */}
      <Handle position={Position.Top} className="react-flow__handle" />
    </div>
  );
});

function SupportIcon(props: { completed: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      className="absolute top-0 left-0 -translate-1/2 w-10"
      viewBox="0 0 259 174"
    >
      <path
        fill="var(--node-stroke)"
        d="M220.6 151.45c-50.46 29.13-132.27 29.13-182.73 0C-5.5 126.41 2.06 112.29 0 75.1c50.46-29.13 208.04-27.63 258.5 1.5 0 45.65-.5 53.25-37.9 74.85Z"
      />
      <path
        fill="var(--node-fill)"
        stroke="var(--node-stroke)"
        strokeWidth="10"
        d="M129.23 5c32.42 0 64.58 7.16 88.87 21.18 24.32 14.04 35.34 31.74 35.34 48.42 0 16.68-11.02 34.38-35.34 48.42-24.3 14.02-56.45 21.18-88.87 21.18s-64.57-7.16-88.86-21.18C16.05 108.98 5.02 91.28 5.02 74.6c0-16.68 11.03-34.38 35.35-48.42C64.66 12.16 96.8 5 129.23 5Z"
      />
      {props.completed && (
        <>
          <path
            fill="url(#a)"
            d="M185.87 47.91c5.29-2.76 17.38-5.92 22.48-2.97 0 6.22 1.33 11.2-3.93 14.25l-90.38 52.17c-5.26 3.04-13.79 3.04-19.05 0L53.91 87.65c-4.28-2.47-3.92-10.4-3.92-14.66 5.26-3.04 17.71.62 22.97 3.66l31.55 18.21 80.86-46.67.5-.28Z"
          />
          <path
            fill="#016630"
            d="M185.87 38.91c5.29-2.76 13.45-2.67 18.55.28 5.26 3.03 5.26 7.96 0 11l-90.38 52.17c-5.26 3.04-13.79 3.04-19.05 0L53.91 78.65c-5.26-3.04-5.26-7.97 0-11 5.26-3.04 13.8-3.04 19.05 0l31.55 18.21 80.86-46.67.5-.28Z"
          />
          <defs>
            <linearGradient
              id="a"
              x1="115.69"
              x2="94.8"
              y1="108.23"
              y2="108.23"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#005226" />
              <stop offset="1" stopColor="#004621" />
            </linearGradient>
          </defs>
        </>
      )}
    </svg>
  );
}
