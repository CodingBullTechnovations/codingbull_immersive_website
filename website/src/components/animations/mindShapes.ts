/**
 * Shape library for the particle mind.
 *
 * Every chapter of the homepage story gets a *meaningful* formation instead of
 * a generic sphere: an ECG pulse for healthcare, a cart for commerce, a people
 * grid for HRMS, a node graph for custom systems, a circuit lattice for the
 * engineering chapter, and the bull logo as the opening and closing bookend.
 *
 * All generators return a Float32Array of `count * 3` positions in the same
 * world space as the logo sampling (~6 units tall), so the renderer can blend
 * between any two shapes without rescaling.
 */

export type MindShapeName =
  | 'logo'
  | 'healthcare'
  | 'commerce'
  | 'hrms'
  | 'custom'
  | 'lattice';

/** Deterministic pseudo-random so formations are identical on every load. */
function noise(index: number, salt = 0) {
  const value = Math.sin(index * 91.731 + salt * 13.117 + 17.113) * 43758.5453;
  return value - Math.floor(value);
}

type Point = [number, number];

/**
 * Distributes `count` particles along a set of polylines, allocating points in
 * proportion to segment length so strokes read at an even density.
 */
function samplePolylines(polylines: Point[][], count: number, jitter = 0.05, salt = 0): Float32Array {
  const segments: Array<{ ax: number; ay: number; bx: number; by: number; length: number }> = [];
  let total = 0;

  for (const line of polylines) {
    for (let i = 0; i < line.length - 1; i += 1) {
      const [ax, ay] = line[i];
      const [bx, by] = line[i + 1];
      const length = Math.hypot(bx - ax, by - ay);
      if (length <= 0.0001) continue;
      segments.push({ ax, ay, bx, by, length });
      total += length;
    }
  }

  const out = new Float32Array(count * 3);
  if (segments.length === 0 || total === 0) return out;

  let cursor = 0;
  let accumulated = 0;

  for (let index = 0; index < count; index += 1) {
    // Walk the concatenated segment list proportionally to length.
    const target = (index / count) * total;
    while (cursor < segments.length - 1 && accumulated + segments[cursor].length < target) {
      accumulated += segments[cursor].length;
      cursor += 1;
    }
    const segment = segments[cursor];
    const t = segment.length > 0 ? Math.min(1, Math.max(0, (target - accumulated) / segment.length)) : 0;

    const jx = (noise(index, salt + 1) - 0.5) * jitter;
    const jy = (noise(index, salt + 2) - 0.5) * jitter;
    const jz = (noise(index, salt + 3) - 0.5) * 0.28;

    out[index * 3] = segment.ax + (segment.bx - segment.ax) * t + jx;
    out[index * 3 + 1] = segment.ay + (segment.by - segment.ay) * t + jy;
    out[index * 3 + 2] = jz;
  }

  return out;
}

/** Circle helper used only for small details (cart wheels, glyph heads). */
function circle(cx: number, cy: number, radius: number, steps = 22): Point[] {
  const points: Point[] = [];
  for (let i = 0; i <= steps; i += 1) {
    const angle = (i / steps) * Math.PI * 2;
    points.push([cx + Math.cos(angle) * radius, cy + Math.sin(angle) * radius]);
  }
  return points;
}

function rect(cx: number, cy: number, width: number, height: number): Point[] {
  const hw = width / 2;
  const hh = height / 2;
  return [
    [cx - hw, cy - hh],
    [cx + hw, cy - hh],
    [cx + hw, cy + hh],
    [cx - hw, cy + hh],
    [cx - hw, cy - hh],
  ];
}

/** Healthcare — an ECG pulse. Reads instantly, nothing like a sphere. */
function healthcareShape(count: number): Float32Array {
  const trace: Point[] = [
    [-3.6, 0], [-2.4, 0], [-2.05, 0.34], [-1.7, -0.42], [-1.35, 0], [-0.55, 0],
    [-0.2, 1.75], [0.2, -1.55], [0.6, 0.45], [0.95, 0], [1.9, 0],
    [2.25, 0.3], [2.6, -0.24], [2.95, 0], [3.6, 0],
  ];
  // A second, fainter baseline gives the formation body.
  const baseline: Point[] = [[-3.6, -1.5], [3.6, -1.5]];
  const upper: Point[] = [[-3.6, 1.5], [3.6, 1.5]];
  return samplePolylines([trace, trace, trace, baseline, upper], count, 0.06, 11);
}

/** E-commerce — a shopping cart silhouette. */
function commerceShape(count: number): Float32Array {
  const basket: Point[] = [
    [-1.75, 0.75], [1.75, 0.75], [1.25, -0.75], [-1.25, -0.75], [-1.75, 0.75],
  ];
  const handle: Point[] = [[-1.75, 0.75], [-2.35, 1.55], [-3.05, 1.55]];
  const shelfA: Point[] = [[-1.5, 0.1], [1.5, 0.1]];
  const shelfB: Point[] = [[-1.05, 0.75], [-0.8, -0.75]];
  const shelfC: Point[] = [[0.15, 0.75], [0.15, -0.75]];
  const shelfD: Point[] = [[1.05, 0.75], [0.85, -0.75]];
  const wheelA = circle(-0.8, -1.45, 0.32);
  const wheelB = circle(0.9, -1.45, 0.32);
  return samplePolylines(
    [basket, basket, handle, shelfA, shelfB, shelfC, shelfD, wheelA, wheelB],
    count,
    0.05,
    22,
  );
}

/** HRMS — a workforce grid of person glyphs. */
function hrmsShape(count: number): Float32Array {
  const lines: Point[][] = [];
  const cols = 5;
  const rows = 3;
  const gapX = 1.55;
  const gapY = 1.65;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const cx = (col - (cols - 1) / 2) * gapX;
      const cy = ((rows - 1) / 2 - row) * gapY;
      lines.push(circle(cx, cy + 0.4, 0.24, 16));
      // Shoulders: a shallow arc under the head.
      const shoulders: Point[] = [];
      for (let i = 0; i <= 12; i += 1) {
        const t = i / 12;
        const angle = Math.PI * (1 - t);
        shoulders.push([cx + Math.cos(angle) * 0.5, cy - 0.32 + Math.sin(angle) * 0.34]);
      }
      lines.push(shoulders);
    }
  }
  return samplePolylines(lines, count, 0.04, 33);
}

/** Custom systems — a connected node graph (architecture, not decoration). */
function customShape(count: number): Float32Array {
  const nodes: Array<{ x: number; y: number }> = [
    { x: -2.9, y: 1.15 },
    { x: 0, y: 1.5 },
    { x: 2.9, y: 1.15 },
    { x: -1.55, y: -0.75 },
    { x: 1.55, y: -0.75 },
    { x: 0, y: -1.95 },
  ];
  const lines: Point[][] = nodes.map((node) => rect(node.x, node.y, 1.5, 0.72));

  const edges: Array<[number, number]> = [
    [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 5], [4, 5],
  ];
  for (const [a, b] of edges) {
    lines.push([[nodes[a].x, nodes[a].y], [nodes[b].x, nodes[b].y]]);
  }
  return samplePolylines(lines, count, 0.05, 44);
}

/** The engineering chapter — a printed-circuit lattice with junction pads. */
function latticeShape(count: number): Float32Array {
  const lines: Point[][] = [];
  const xs = [-3.6, -2.4, -1.2, 0, 1.2, 2.4, 3.6];
  const ys = [-2.1, -0.7, 0.7, 2.1];

  for (const y of ys) lines.push([[-3.9, y], [3.9, y]]);
  for (const x of xs) lines.push([[x, -2.4], [x, 2.4]]);
  // Junction pads make it read as engineered rather than as graph paper.
  for (const x of xs) {
    for (const y of ys) {
      if ((Math.abs(x) + Math.abs(y)) % 2.4 < 1.2) lines.push(circle(x, y, 0.16, 12));
    }
  }
  return samplePolylines(lines, count, 0.04, 55);
}

const builders: Record<Exclude<MindShapeName, 'logo'>, (count: number) => Float32Array> = {
  healthcare: healthcareShape,
  commerce: commerceShape,
  hrms: hrmsShape,
  custom: customShape,
  lattice: latticeShape,
};

/**
 * Builds every non-logo shape once. The logo formation comes from sampling the
 * real logo artwork and is supplied by the caller.
 */
export function buildMindShapes(count: number, logo: Float32Array): Record<MindShapeName, Float32Array> {
  return {
    logo,
    healthcare: builders.healthcare(count),
    commerce: builders.commerce(count),
    hrms: builders.hrms(count),
    custom: builders.custom(count),
    lattice: builders.lattice(count),
  };
}
