import { Handle, type NodeProps, Position } from "@xyflow/react";
import { type ChangeEventHandler, memo, useState } from "react";
import { clsx } from "clsx";

type Props = NodeProps & {
  id: string;
  data: {
    name: string;
  };
};

export const CustomNode = memo(({ data, id, selected, ...props }: Props) => {
  console.log(props);
  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    document.body.dispatchEvent(
      new CustomEvent("namechange", {
        detail: {
          value: e.target.value,
          id: id,
        },
      }),
    );
  };
  const [edit, setEdit] = useState(data.name === "");
  const toggleEdit = () => {
    setEdit((e) => !e);
  };
  return (
    <div
      className={clsx(
        "px-4 py-2 shadow-md rounded-md bg-white border-2",
        selected ? "border-teal-500" : "border-stone-400",
      )}
    >
      {edit ? (
        <input
          autoFocus
          className="text-lg font-bold"
          defaultValue={data.name}
          onChange={onChange}
          onBlur={toggleEdit}
        />
      ) : (
        <div className="text-lg font-bold" onClick={toggleEdit}>
          {data.name}
        </div>
      )}
      <Handle
        type="target"
        position={Position.Top}
        className="!size-2 !bg-purple-500"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!size-2 !bg-teal-500"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!size-2 !bg-amber-500"
      />
      <Handle
        type="source"
        position={Position.Left}
        id={"left"}
        className="!size-2 !bg-amber-500"
      />
    </div>
  );
});
