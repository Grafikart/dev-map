import type { Edge } from "../../type.ts";
import type { Vec2 } from "../../utils/2d.ts";
import type { ComponentProps } from "react";

type Props = {
  edge: Edge;
  position: Vec2;
  onEdgeChange: (edge: Edge) => void;
};

export function FlowEdgeMenu(props: Props) {
  const onTypeChange = (type: string) => {
    props.onEdgeChange({
      ...props.edge,
      type,
    });
  };

  return (
    <div
      className="border-gray-200 absolute bg-white  rounded-sm shadow min-w-30"
      style={{
        left: props.position.x,
        top: props.position.y,
      }}
    >
      <Button onClick={() => onTypeChange("primary")}>Principal</Button>
      <Button onClick={() => onTypeChange("secondary")}>Secondaire</Button>
    </div>
  );
}

function Button(props: ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="text-gray-800 p-2 px-4 cursor-pointer hover:text-gray-900 hover:bg-gray-100 w-full text-left border-b-gray-100 border-b"
    />
  );
}
