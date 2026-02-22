import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumCollinearPoints: AlgorithmDefinition = {
  id: 'maximum-collinear-points',
  title: 'Maximum Collinear Points',
  leetcodeNumber: 149,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Find the maximum number of points that lie on the same straight line. For each point, group all other points by their slope relative to it. The largest group plus the point itself gives the answer.',
  tags: ['Math', 'Geometry', 'Hash Map'],
  code: {
    pseudocode: `function maxPoints(points):
  if n <= 2: return n
  maxCount = 2
  for i from 0 to n-1:
    slopes = hash map
    for j from 0 to n-1:
      if i == j: continue
      slope = getSlope(points[i], points[j])
      slopes[slope] += 1
    maxCount = max(maxCount, max(slopes.values) + 1)
  return maxCount`,
    python: `from math import gcd
def maxPoints(points):
    if len(points) <= 2:
        return len(points)
    max_count = 2
    for i in range(len(points)):
        slopes = {}
        for j in range(len(points)):
            if i == j: continue
            dx = points[j][0] - points[i][0]
            dy = points[j][1] - points[i][1]
            g = gcd(abs(dx), abs(dy))
            slope = (dx // g, dy // g)
            if slope[0] < 0:
                slope = (-slope[0], -slope[1])
            slopes[slope] = slopes.get(slope, 0) + 1
        if slopes:
            max_count = max(max_count, max(slopes.values()) + 1)
    return max_count`,
    javascript: `function maxPoints(points) {
  if (points.length <= 2) return points.length;
  let maxCount = 2;
  for (let i = 0; i < points.length; i++) {
    const slopes = {};
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue;
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx /= g; dy /= g;
      if (dx < 0) { dx = -dx; dy = -dy; }
      const key = dx + "," + dy;
      slopes[key] = (slopes[key] || 0) + 1;
    }
    for (const v of Object.values(slopes))
      maxCount = Math.max(maxCount, v + 1);
  }
  return maxCount;
}
function gcd(a, b) { return b === 0 ? a : gcd(b, a % b); }`,
    java: `public int maxPoints(int[][] points) {
    if (points.length <= 2) return points.length;
    int maxCount = 2;
    for (int i = 0; i < points.length; i++) {
        Map<String, Integer> slopes = new HashMap<>();
        for (int j = 0; j < points.length; j++) {
            if (i == j) continue;
            int dx = points[j][0] - points[i][0];
            int dy = points[j][1] - points[i][1];
            int g = gcd(Math.abs(dx), Math.abs(dy));
            dx /= g; dy /= g;
            if (dx < 0) { dx = -dx; dy = -dy; }
            String key = dx + "," + dy;
            slopes.merge(key, 1, Integer::sum);
        }
        for (int v : slopes.values())
            maxCount = Math.max(maxCount, v + 1);
    }
    return maxCount;
}
private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }`,
  },
  defaultInput: { points: [[1, 1], [2, 2], [3, 3], [1, 2]] },
  inputFields: [
    {
      name: 'points',
      label: 'Points',
      type: 'string',
      defaultValue: '1 1, 2 2, 3 3, 1 2',
      placeholder: 'e.g. 1 1, 2 2, 3 3, 1 2',
      helperText: 'Comma-separated points (x y pairs)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let points: number[][];
    if (Array.isArray(input.points) && Array.isArray(input.points[0])) {
      points = input.points as number[][];
    } else {
      const str = input.points as string;
      points = str.split(',').map(p => p.trim().split(/\s+/).map(Number));
    }

    const n = points.length;
    const steps: AlgorithmStep[] = [];

    // Flatten points for array visualization: show x-coordinates
    const flat = points.map((_, i) => i); // Use indices

    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }

    function getSlope(p1: number[], p2: number[]): string {
      let dx = p2[0] - p1[0];
      let dy = p2[1] - p1[1];
      if (dx === 0) return 'vertical';
      if (dy === 0) return 'horizontal';
      const g = gcd(Math.abs(dx), Math.abs(dy));
      dx /= g;
      dy /= g;
      if (dx < 0) { dx = -dx; dy = -dy; }
      return `${dy}/${dx}`;
    }

    steps.push({
      line: 1,
      explanation: `Find max collinear points among ${n} points: [${points.map(p => `(${p[0]},${p[1]})`).join(', ')}].`,
      variables: { n, points: points.map(p => `(${p[0]},${p[1]})`) },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'default'])),
        labels: Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`])),
        auxData: {
          label: 'Points',
          entries: points.map((p, i) => ({ key: `P${i}`, value: `(${p[0]}, ${p[1]})` })),
        },
      },
    });

    if (n <= 2) {
      steps.push({
        line: 2,
        explanation: `Only ${n} points. All are collinear. Return ${n}.`,
        variables: { result: n },
        visualization: {
          type: 'array',
          array: flat,
          highlights: Object.fromEntries(flat.map((_, i) => [i, 'found'])),
          labels: Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`])),
        },
      });
      return steps;
    }

    let maxCount = 2;

    for (let i = 0; i < n; i++) {
      const slopes = new Map<string, number>();

      steps.push({
        line: 4,
        explanation: `Fix point P${i} = (${points[i][0]}, ${points[i][1]}). Compute slopes to all other points.`,
        variables: { i, point: `(${points[i][0]},${points[i][1]})` },
        visualization: {
          type: 'array',
          array: flat,
          highlights: { ...Object.fromEntries(flat.map((_, j) => [j, 'default'])), [i]: 'active' },
          labels: Object.fromEntries(points.map((p, j) => [j, `(${p[0]},${p[1]})`])),
        },
      });

      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        const slope = getSlope(points[i], points[j]);
        slopes.set(slope, (slopes.get(slope) || 0) + 1);
      }

      const slopeEntries = [...slopes.entries()];
      const localMax = slopeEntries.length > 0 ? Math.max(...slopeEntries.map(e => e[1])) + 1 : 1;
      maxCount = Math.max(maxCount, localMax);

      // Find which points are in the best group
      const bestSlope = slopeEntries.find(e => e[1] + 1 === localMax);
      const collinearIndices = [i];
      if (bestSlope) {
        for (let j = 0; j < n; j++) {
          if (j !== i && getSlope(points[i], points[j]) === bestSlope[0]) {
            collinearIndices.push(j);
          }
        }
      }

      const h: Record<number, string> = {};
      for (let j = 0; j < n; j++) h[j] = 'default';
      h[i] = 'active';
      for (const ci of collinearIndices) h[ci] = 'found';

      steps.push({
        line: 9,
        explanation: `From P${i}: slopes = {${slopeEntries.map(e => `${e[0]}:${e[1]}`).join(', ')}}. Max collinear with P${i}: ${localMax}. Global max: ${maxCount}.`,
        variables: { slopes: Object.fromEntries(slopes), localMax, maxCount },
        visualization: {
          type: 'array',
          array: flat,
          highlights: h,
          labels: Object.fromEntries(points.map((p, j) => [j, `(${p[0]},${p[1]})`])),
          auxData: {
            label: 'Slope Groups',
            entries: [
              ...slopeEntries.map(([s, c]) => ({ key: `slope ${s}`, value: `${c} points` })),
              { key: 'Max collinear', value: String(maxCount) },
            ],
          },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Maximum collinear points: ${maxCount}.`,
      variables: { result: maxCount },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`])),
        auxData: {
          label: 'Result',
          entries: [{ key: 'Max collinear', value: String(maxCount) }],
        },
      },
    });

    return steps;
  },
};

export default maximumCollinearPoints;
