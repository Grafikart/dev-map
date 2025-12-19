type Props = {
  fill: string;
  transform?: string;
  stroke: string;
};

/**
 * Draw an isometric circle
 * @param stroke
 * @param fill
 * @param transform
 * @constructor
 */
export function Circle({ stroke, fill, transform }: Props) {
  return (
    <g transform={`${transform ?? ""} scale(2)`}>
      <path
        d="M-0.123473 5.49772C5.39937 5.49772 9.87653 3.03529 9.87653 -0.00228071C9.87653 -3.03985 5.39937 -5.50228 -0.123473 -5.50228C-5.64632 -5.50228 -10.1235 -3.03985 -10.1235 -0.00228071C-10.1235 3.03529 -5.64632 5.49772 -0.123473 5.49772Z"
        stroke={stroke}
        fill={fill}
        strokeWidth={0.5}
      />
    </g>
  );
}
