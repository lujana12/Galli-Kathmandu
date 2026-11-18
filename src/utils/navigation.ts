import { WALKABLE_ZONES, type WalkableZone } from '../data/locations';

export interface Point2D {
  x: number;
  y: number;
}

const CHAR_RADIUS = 10;

export function isPointWalkable(x: number, y: number, pad = CHAR_RADIUS): boolean {
  for (const z of WALKABLE_ZONES) {
    if (
      x >= z.x + pad &&
      x <= z.x + z.w - pad &&
      y >= z.y + pad &&
      y <= z.y + z.h - pad
    ) {
      return true;
    }
  }
  return false;
}

export function getZoneAtPoint(x: number, y: number): WalkableZone | null {
  for (const z of WALKABLE_ZONES) {
    if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
      return z;
    }
  }
  return null;
}

export function moveWithCollision(
  x: number,
  y: number,
  dx: number,
  dy: number
): Point2D {
  let nextX = x;
  let nextY = y;

  if (isPointWalkable(x + dx, y + dy)) {
    return { x: x + dx, y: y + dy };
  }
  if (dx !== 0 && isPointWalkable(x + dx, y)) {
    nextX = x + dx;
  }
  if (dy !== 0 && isPointWalkable(nextX, y + dy)) {
    nextY = y + dy;
  }
  return { x: nextX, y: nextY };
}

export function clampToNearestWalkable(x: number, y: number): Point2D {
  if (isPointWalkable(x, y)) return { x, y };

  let bestDist = Infinity;
  let best: Point2D = { x: 320, y: 925 };
  const pad = CHAR_RADIUS + 4;

  for (const z of WALKABLE_ZONES) {
    const cx = Math.max(z.x + pad, Math.min(z.x + z.w - pad, x));
    const cy = Math.max(z.y + pad, Math.min(z.y + z.h - pad, y));
    const dist = Math.hypot(cx - x, cy - y);
    if (dist < bestDist) {
      bestDist = dist;
      best = { x: cx, y: cy };
    }
  }
  return best;
}

// Connected waypoint graph enforcing: Koncha Dyo <-> Siddhi Ganesh <-> Mhepi Ajima <-> Nanak Math
const GRAPH_NODES: { id: string; pos: Point2D; neighbors: string[] }[] = [
  { id: 'zone-siddhi', pos: { x: 380, y: 920 }, neighbors: ['stairs-koncha-lower', 'alley-siddhi-mhepi'] },
  { id: 'stairs-koncha-lower', pos: { x: 407, y: 690 }, neighbors: ['zone-siddhi', 'alley-koncha-landing'] },
  { id: 'alley-koncha-landing', pos: { x: 465, y: 612 }, neighbors: ['stairs-koncha-lower', 'stairs-koncha-upper'] },
  { id: 'stairs-koncha-upper', pos: { x: 522, y: 520 }, neighbors: ['alley-koncha-landing', 'zone-koncha'] },
  { id: 'zone-koncha', pos: { x: 520, y: 365 }, neighbors: ['stairs-koncha-upper'] },

  { id: 'alley-siddhi-mhepi', pos: { x: 740, y: 935 }, neighbors: ['zone-siddhi', 'zone-mhepi'] },
  { id: 'zone-mhepi', pos: { x: 1120, y: 920 }, neighbors: ['alley-siddhi-mhepi', 'stairs-nanak-lower', 'alley-mhepi-balaju'] },

  { id: 'stairs-nanak-lower', pos: { x: 1102, y: 690 }, neighbors: ['zone-mhepi', 'alley-nanak-ridge'] },
  { id: 'alley-nanak-ridge', pos: { x: 1025, y: 612 }, neighbors: ['stairs-nanak-lower', 'stairs-nanak-upper'] },
  { id: 'stairs-nanak-upper', pos: { x: 947, y: 515 }, neighbors: ['alley-nanak-ridge', 'zone-nanak-math'] },
  { id: 'zone-nanak-math', pos: { x: 945, y: 365 }, neighbors: ['stairs-nanak-upper'] },

  { id: 'alley-mhepi-balaju', pos: { x: 1470, y: 935 }, neighbors: ['zone-mhepi', 'zone-balaju'] },
  { id: 'zone-balaju', pos: { x: 1840, y: 925 }, neighbors: ['alley-mhepi-balaju', 'alley-balaju-sitala'] },
  { id: 'alley-balaju-sitala', pos: { x: 2070, y: 890 }, neighbors: ['zone-balaju', 'zone-sitala'] },
  { id: 'zone-sitala', pos: { x: 2255, y: 860 }, neighbors: ['alley-balaju-sitala'] },
];

export function computeWalkPath(
  startX: number,
  startY: number,
  rawTargetX: number,
  rawTargetY: number
): Point2D[] {
  const target = clampToNearestWalkable(rawTargetX, rawTargetY);
  const startZone = getZoneAtPoint(startX, startY);
  const endZone = getZoneAtPoint(target.x, target.y);

  if (!startZone || !endZone || startZone.id === endZone.id) {
    return [target];
  }

  const queue: string[][] = [[startZone.id]];
  const visited = new Set<string>([startZone.id]);

  while (queue.length > 0) {
    const path = queue.shift()!;
    const lastId = path[path.length - 1];
    if (lastId === endZone.id) {
      const waypoints: Point2D[] = [];
      // Add alignment node in starting zone if exiting onto a sideways corridor
      for (let i = 1; i < path.length - 1; i++) {
        const node = GRAPH_NODES.find((n) => n.id === path[i]);
        if (node) waypoints.push(node.pos);
      }
      waypoints.push(target);
      return waypoints;
    }

    const node = GRAPH_NODES.find((n) => n.id === lastId);
    if (!node) continue;
    for (const nextId of node.neighbors) {
      if (!visited.has(nextId)) {
        visited.add(nextId);
        queue.push([...path, nextId]);
      }
    }
  }

  return [target];
}
