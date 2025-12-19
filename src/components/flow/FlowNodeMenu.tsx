import type { Node } from "../../type.ts";
import type { Vec2 } from "../../utils/2d.ts";
import type { ComponentProps } from "react";

type Props = {
  node: Node;
  position: Vec2;
  onNodeChange: (node: Node) => void;
};

export function FlowNodeMenu(props: Props) {
  const onTypeChange = (type: string) => {
    props.onNodeChange({
      ...props.node,
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
      <Button onClick={() => onTypeChange("formation")}>Formation</Button>
      <Button onClick={() => onTypeChange("fork")}>Carrefour</Button>
      <Button onClick={() => onTypeChange("gate")}>Porte</Button>
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
