import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumAreaRectangle: AlgorithmDefinition = {
  id: 'minimum-area-rectangle',
  title: 'Minimum Area Rectangle',
  leetcodeNumber: 939,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given points in the XY plane aligned to axes, find the minimum area rectangle that can be formed. For each pair of points as diagonal, check if the other two corners exist in a point set. Area = |dx| * |dy|.',
  tags: ['math', 'geometry', 'hash set', 'array'],

  code: {
    pseudocode: `function minAreaRect(points):
  pointSet = set of all points
  minArea = infinity
  for i in range(n):
    for j in range(i+1, n):
      if points[i] and points[j] form a valid diagonal:
        dx = x2-x1, dy = y2-y1
        if (x1,y2) in set and (x2,y1) in set:
          area = abs(dx) * abs(dy)
          minArea = min(minArea, area)
  return minArea if minArea < inf else 0`,

    python: `def minAreaRect(points):
    point_set = set(map(tuple, points))
    min_area = float('inf')
    n = len(points)
    for i in range(n):
        for j in range(i+1, n):
            x1,y1 = points[i]; x2,y2 = points[j]
            if x1 != x2 and y1 != y2:
                if (x1,y2) in point_set and (x2,y1) in point_set:
                    min_area = min(min_area, abs(x2-x1)*abs(y2-y1))
    return min_area if min_area < float('inf') else 0`,

    javascript: `function minAreaRect(points) {
  const set = new Set(points.map(([x,y]) => x+','+y));
  let minArea = Infinity;
  const n = points.length;
  for (let i = 0; i < n; i++)
    for (let j = i+1; j < n; j++) {
      const [x1,y1]=points[i],[x2,y2]=points[j];
      if (x1!==x2 && y1!==y2 &&
          set.has(x1+','+y2) && set.has(x2+','+y1)) {
        minArea = Math.min(minArea, Math.abs(x2-x1)*Math.abs(y2-y1));
      }
    }
  return minArea === Infinity ? 0 : minArea;
}`,

    java: `public int minAreaRect(int[][] points) {
    Set<String> set = new HashSet<>();
    for (int[] p : points) set.add(p[0]+","+p[1]);
    int min = Integer.MAX_VALUE;
    for (int i=0;i<points.length;i++)
      for (int j=i+1;j<points.length;j++) {
        int x1=points[i][0],y1=points[i][1],x2=points[j][0],y2=points[j][1];
        if (x1!=x2&&y1!=y2&&set.contains(x1+","+y2)&&set.contains(x2+","+y1))
          min=Math.min(min,Math.abs(x2-x1)*Math.abs(y2-y1));
      }
    return min==Integer.MAX_VALUE?0:min;
}`,
  },

  defaultInput: { points: [[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]] },

  inputFields: [
    { name: 'points', label: 'Points', type: 'array', defaultValue: [[1, 1], [1, 3], [3, 1], [3, 3], [2, 2]], helperText: 'Array of [x,y] points in the XY plane' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const n = points.length;
    const steps: AlgorithmStep[] = [];
    const pointSet = new Set(points.map(([x, y]) => `${x},${y}`));

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: points.map((_, i) => i), highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum axis-aligned rectangle from ${n} points. Build point set, then check all diagonal pairs.`,
      variables: { n, minArea: 'inf' },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, 'default'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    let minArea = Infinity;
    let bestPair: [number, number] = [-1, -1];

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const [x1, y1] = points[i];
        const [x2, y2] = points[j];

        if (x1 === x2 || y1 === y2) continue;

        const hasC1 = pointSet.has(`${x1},${y2}`);
        const hasC2 = pointSet.has(`${x2},${y1}`);

        if (hasC1 && hasC2) {
          const area = Math.abs(x2 - x1) * Math.abs(y2 - y1);
          const improved = area < minArea;
          if (improved) { minArea = area; bestPair = [i, j]; }

          steps.push({
            line: 8,
            explanation: `Diagonal (${i},${j}): corners exist! Area = |${x2}-${x1}|*|${y2}-${y1}| = ${area}. ${improved ? 'New minimum!' : `Not better than ${minArea}.`}`,
            variables: { i, j, area, minArea: minArea === Infinity ? 'inf' : minArea },
            visualization: makeViz(
              Object.fromEntries(points.map((_, idx) => [idx, idx === i || idx === j ? (improved ? 'found' : 'comparing') : 'default'])),
              Object.fromEntries(points.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
            ),
          });
        } else {
          steps.push({
            line: 6,
            explanation: `Pair (${i},${j}): (${x1},${y1})-(${x2},${y2}). Missing corners: ${!hasC1 ? `(${x1},${y2})` : ''}${!hasC2 ? ` (${x2},${y1})` : ''}. Skip.`,
            variables: { i, j, hasC1, hasC2 },
            visualization: makeViz(
              Object.fromEntries(points.map((_, idx) => [idx, idx === i || idx === j ? 'mismatch' : 'default'])),
              Object.fromEntries(points.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
            ),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Minimum rectangle area = ${minArea === Infinity ? 0 : minArea}. Best diagonal: indices (${bestPair[0]},${bestPair[1]}).`,
      variables: { result: minArea === Infinity ? 0 : minArea },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, i === bestPair[0] || i === bestPair[1] ? 'found' : 'visited'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    return steps;
  },
};

export default minimumAreaRectangle;
