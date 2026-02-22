import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestTriangleArea: AlgorithmDefinition = {
  id: 'largest-triangle-area',
  title: 'Largest Triangle Area',
  leetcodeNumber: 812,
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Given an array of points in the XY plane, find and return the maximum area of a triangle formed by any 3 of the points. Use the shoelace formula for triangle area: |x1(y2-y3) + x2(y3-y1) + x3(y1-y2)| / 2.',
  tags: ['math', 'geometry', 'brute force'],

  code: {
    pseudocode: `function largestTriangleArea(points):
  maxArea = 0
  for i in range(n):
    for j in range(i+1, n):
      for k in range(j+1, n):
        area = |x1*(y2-y3) + x2*(y3-y1) + x3*(y1-y2)| / 2
        maxArea = max(maxArea, area)
  return maxArea`,

    python: `def largestTriangleArea(points):
    n = len(points)
    maxArea = 0.0
    for i in range(n):
        for j in range(i+1, n):
            for k in range(j+1, n):
                x1,y1 = points[i]; x2,y2 = points[j]; x3,y3 = points[k]
                area = abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2)) / 2
                maxArea = max(maxArea, area)
    return maxArea`,

    javascript: `function largestTriangleArea(points) {
  let maxArea = 0;
  const n = points.length;
  for (let i = 0; i < n; i++)
    for (let j = i+1; j < n; j++)
      for (let k = j+1; k < n; k++) {
        const [x1,y1]=points[i],[x2,y2]=points[j],[x3,y3]=points[k];
        const area = Math.abs(x1*(y2-y3)+x2*(y3-y1)+x3*(y1-y2))/2;
        maxArea = Math.max(maxArea, area);
      }
  return maxArea;
}`,

    java: `public double largestTriangleArea(int[][] points) {
    double max = 0;
    int n = points.length;
    for (int i = 0; i < n; i++)
      for (int j = i+1; j < n; j++)
        for (int k = j+1; k < n; k++) {
            double area = Math.abs(
                points[i][0]*(points[j][1]-points[k][1]) +
                points[j][0]*(points[k][1]-points[i][1]) +
                points[k][0]*(points[i][1]-points[j][1])) / 2.0;
            max = Math.max(max, area);
        }
    return max;
}`,
  },

  defaultInput: { points: [[0, 0], [0, 1], [1, 0], [0, 2], [2, 0]] },

  inputFields: [
    { name: 'points', label: 'Points', type: 'array', defaultValue: [[0, 0], [0, 1], [1, 0], [0, 2], [2, 0]], helperText: 'Array of [x,y] coordinate pairs' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = input.points as number[][];
    const steps: AlgorithmStep[] = [];
    const n = points.length;

    const triangleArea = (i: number, j: number, k: number): number => {
      const [x1, y1] = points[i];
      const [x2, y2] = points[j];
      const [x3, y3] = points[k];
      return Math.abs(x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2;
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: points.map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find largest triangle area from ${n} points. Using shoelace formula. Will check all C(${n},3) = ${Math.floor(n * (n - 1) * (n - 2) / 6)} triangles.`,
      variables: { n, maxArea: 0 },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, 'default'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    let maxArea = 0;
    let bestI = -1, bestJ = -1, bestK = -1;

    for (let i = 0; i < n && i < 5; i++) {
      for (let j = i + 1; j < n && j < 6; j++) {
        for (let k = j + 1; k < n && k < 7; k++) {
          const area = triangleArea(i, j, k);
          const improved = area > maxArea;
          if (improved) { maxArea = area; bestI = i; bestJ = j; bestK = k; }

          steps.push({
            line: 5,
            explanation: `Triangle (${i},${j},${k}): points (${points[i]}),(${points[j]}),(${points[k]}). Area=${area.toFixed(2)}. ${improved ? `New max!` : `Not better than ${maxArea.toFixed(2)}.`}`,
            variables: { i, j, k, area: Math.round(area * 100) / 100, maxArea: Math.round(maxArea * 100) / 100 },
            visualization: makeViz(
              Object.fromEntries(points.map((_, idx) => [idx, idx === i || idx === j || idx === k ? (improved ? 'found' : 'comparing') : 'default'])),
              Object.fromEntries(points.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
            ),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Maximum triangle area = ${maxArea.toFixed(2)}. Best triangle: indices (${bestI},${bestJ},${bestK}).`,
      variables: { maxArea: Math.round(maxArea * 100) / 100 },
      visualization: makeViz(
        Object.fromEntries(points.map((_, i) => [i, i === bestI || i === bestJ || i === bestK ? 'found' : 'visited'])),
        Object.fromEntries(points.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    return steps;
  },
};

export default largestTriangleArea;
