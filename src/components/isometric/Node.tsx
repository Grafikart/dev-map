import { addVec2, toIsometric } from "../../utils/2d";

type Props = {
  x: number;
  y: number;
  label: string;
};

export function Node(props: Props) {
  const size = 50;

  const corners = [
    { x: size * -0.5, y: size * -0.5 },
    { x: size * 0.5, y: size * -0.5 },
    { x: size * 0.5, y: size * 0.5 },
    { x: size * -0.5, y: size * 0.5 },
  ].map((corner) => addVec2(toIsometric(corner), props));

  const pathData =
    `M ${corners[0].x} ${corners[0].y} ` +
    `L ${corners[1].x} ${corners[1].y} ` +
    `L ${corners[2].x} ${corners[2].y} ` +
    `L ${corners[3].x} ${corners[3].y} Z`;

  return (
    <>
      <path d={pathData} fill="#e2e8f0" stroke="#64748b" strokeWidth="1" />
      <text
        x={props.x}
        y={props.y - size * 0.4 + 2}
        stroke="white"
        fontWeight="bold"
        textAnchor="middle"
        fontSize={20}
        fill="#FFF"
      >
        {props.label}
      </text>
      <text
        x={props.x}
        y={props.y - size * 0.4}
        stroke="white"
        fontWeight="bold"
        textAnchor="middle"
        fontSize={20}
        fill="#374151"
      >
        {props.label}
      </text>
    </>
  );
}
