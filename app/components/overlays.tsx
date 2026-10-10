// Fractal overlays drawn as tiling SVG patterns, black on transparent.
//
// Grid fractals are a `base`×`base` grid where the listed `cells` hold a copy
// of the previous level, so level k is `base`^k units square and the markup
// grows linearly with `levels` instead of exponentially.
//
// Curve fractals are a single space-filling path, computed once.

type Cell = [col: number, row: number];

type GridFractal = {
  kind: "grid";
  base: number;
  cells: Cell[];
  levels: number;
  /** Rendered tile size; the smallest square is tilePx / base^levels. */
  tilePx: number;
  /** Paint everything except the fractal. */
  invert?: boolean;
};

type HilbertCurve = {
  kind: "hilbert";
  /** The curve visits a 2^order × 2^order grid. */
  order: number;
  tilePx: number;
  /** Line width as a fraction of one grid step. */
  stroke: number;
};

type Overlay = GridFractal | HilbertCurve;

const CORNERS: Cell[] = [
  [0, 0],
  [2, 0],
  [0, 2],
  [2, 2],
];
const EDGES: Cell[] = [
  [1, 0],
  [0, 1],
  [2, 1],
  [1, 2],
];
const CENTRE: Cell = [1, 1];

export const OVERLAYS = {
  // Remove the centre ninth, repeat.
  "sierpinski-carpet": {
    kind: "grid",
    base: 3,
    cells: [...CORNERS, ...EDGES],
    levels: 4,
    tilePx: 243,
  },
  // Only the removed centres: black squares at every scale.
  "carpet-holes": {
    kind: "grid",
    base: 3,
    cells: [...CORNERS, ...EDGES],
    levels: 4,
    tilePx: 243,
    invert: true,
  },
  // Pascal's triangle mod 2: keep three of four quadrants.
  "sierpinski-triangle": {
    kind: "grid",
    base: 2,
    cells: [
      [0, 0],
      [1, 0],
      [0, 1],
    ],
    levels: 6,
    tilePx: 192,
  },
  // Diagonal Vicsek; tiles meet at the corners in a lattice.
  "vicsek-saltire": {
    kind: "grid",
    base: 3,
    cells: [CENTRE, ...CORNERS],
    levels: 3,
    tilePx: 243,
  },
  // Everything but Cantor dust: a grid of bars that thins as it recurses.
  "cantor-grid": {
    kind: "grid",
    base: 3,
    cells: CORNERS,
    levels: 3,
    tilePx: 243,
    invert: true,
  },
  // One line through every cell; tiles join end to end along each row.
  hilbert: {
    kind: "hilbert",
    order: 5,
    tilePx: 320,
    stroke: 0.3,
  },
} satisfies Record<string, Overlay>;

export type OverlayName = keyof typeof OVERLAYS;
export const OVERLAY_NAMES = Object.keys(OVERLAYS) as OverlayName[];

// Index → cell along a Hilbert curve, running from (0,0) to (n-1,0).
function hilbertPoint(n: number, index: number): Cell {
  let x = 0;
  let y = 0;
  for (let s = 1, t = index; s < n; s *= 2, t = Math.floor(t / 4)) {
    const rx = 1 & (t >> 1);
    const ry = 1 & (t ^ rx);
    if (ry === 0) {
      if (rx === 1) {
        x = s - 1 - x;
        y = s - 1 - y;
      }
      [x, y] = [y, x];
    }
    x += s * rx;
    y += s * ry;
  }
  return [x, y];
}

function hilbertPath(order: number) {
  const n = 2 ** order;
  const points = Array.from({ length: n * n }, (_, i) => hilbertPoint(n, i));
  // Run through cell centres, extended half a step past each end so the curve
  // meets its neighbour at the tile edge.
  const line = points.map(([x, y]) => `${x + 0.5} ${y + 0.5}`).join("L");
  return `M0 0.5L${line}L${n} 0.5`;
}

function Tile({ id, overlay }: { id: string; overlay: Overlay }) {
  if (overlay.kind === "hilbert") {
    return (
      <path
        d={hilbertPath(overlay.order)}
        fill="none"
        stroke="black"
        strokeWidth={overlay.stroke}
        strokeLinecap="square"
      />
    );
  }
  const { base, cells, levels } = overlay;
  return (
    <>
      <rect id={`${id}-0`} width={1} height={1} />
      {Array.from({ length: levels }, (_, i) => (
        <g key={i} id={`${id}-${i + 1}`}>
          {cells.map(([col, row]) => (
            <use
              key={`${col}-${row}`}
              href={`#${id}-${i}`}
              x={col * base ** i}
              y={row * base ** i}
            />
          ))}
        </g>
      ))}
    </>
  );
}

export function FractalOverlay({ name }: { name: OverlayName }) {
  const overlay: Overlay = OVERLAYS[name];
  const id = `fnf-${name}`;
  const size =
    overlay.kind === "hilbert"
      ? 2 ** overlay.order
      : overlay.base ** overlay.levels;
  const invert = overlay.kind === "grid" && overlay.invert;
  const pattern = `url(#${id}-pattern)`;

  return (
    <svg
      aria-hidden
      className="absolute inset-0 h-full w-full opacity-30"
      shapeRendering={overlay.kind === "grid" ? "crispEdges" : undefined}
    >
      <defs>
        <pattern
          id={`${id}-pattern`}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform={`scale(${overlay.tilePx / size})`}
        >
          {overlay.kind === "grid" ? (
            <>
              <defs>
                <Tile id={id} overlay={overlay} />
              </defs>
              <use href={`#${id}-${overlay.levels}`} fill="black" />
            </>
          ) : (
            <Tile id={id} overlay={overlay} />
          )}
        </pattern>
        {invert && (
          // White shows, black hides: punch the fractal out of a full layer.
          <mask id={`${id}-mask`}>
            <rect width="100%" height="100%" fill="white" />
            <rect width="100%" height="100%" fill={pattern} />
          </mask>
        )}
      </defs>
      {invert ? (
        <rect
          width="100%"
          height="100%"
          fill="black"
          mask={`url(#${id}-mask)`}
        />
      ) : (
        <rect width="100%" height="100%" fill={pattern} />
      )}
    </svg>
  );
}
