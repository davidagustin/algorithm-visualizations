import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const convexHull: AlgorithmDefinition = {
  id: 'convex-hull',
  title: 'Convex Hull',
  leetcodeNumber: 587,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Given a set of points, find the convex hull - the smallest convex polygon containing all points. Uses Andrew\'s monotone chain algorithm: sort by x then y, build lower hull and upper hull, each checking left turns via cross product.',
  tags: ['math', 'geometry', 'convex hull', 'sorting'],

  code: {
    pseudocode: `function convexHull(points):
  sort points by (x, y)
  // Build lower hull
  lower = []
  for p in points:
    while len(lower)>=2 and cross(lower[-2],lower[-1],p)<=0:
      lower.pop()
    lower.append(p)
  // Build upper hull (reverse)
  upper = []
  for p in reversed(points):
    while len(upper)>=2 and cross(upper[-2],upper[-1],p)<=0:
      upper.pop()
    upper.append(p)
  return lower[:-1] + upper[:-1]`,

    python: `def outerTrees(trees):
    def cross(O, A, B):
        return (A[0]-O[0])*(B[1]-O[1]) - (A[1]-O[1])*(B[0]-O[0])
    trees.sort()
    n = len(trees)
    hull = []
    # Lower hull
    for p in trees:
        while len(hull)>=2 and cross(hull[-2],hull[-1],p)<0:
            hull.pop()
        hull.append(p)
    # Upper hull
    for p in reversed(trees):
        while len(hull)>=2 and cross(hull[-2],hull[-1],p)<0:
            hull.pop()
        hull.append(p)
    return list(set(map(tuple, hull)))`,

    javascript: `function outerTrees(trees) {
  const cross = (O,A,B) =>
    (A[0]-O[0])*(B[1]-O[1])-(A[1]-O[1])*(B[0]-O[0]);
  trees.sort((a,b)=>a[0]!==b[0]?a[0]-b[0]:a[1]-b[1]);
  const n = trees.length, hull = [];
  for (let i=0;i<n;i++) {
    while(hull.length>=2&&cross(hull.at(-2),hull.at(-1),trees[i])<0)
      hull.pop();
    hull.push(trees[i]);
  }
  for (let i=n-1;i>=0;i--) {
    while(hull.length>=2&&cross(hull.at(-2),hull.at(-1),trees[i])<0)
      hull.pop();
    hull.push(trees[i]);
  }
  return [...new Set(hull.map(p=>JSON.stringify(p)))].map(JSON.parse);
}`,

    java: `public int[][] outerTrees(int[][] trees) {
    Arrays.sort(trees,(a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    int n=trees.length; int[][]hull=new int[2*n][2]; int k=0;
    for(int[]p:trees){
        while(k>=2&&cross(hull[k-2],hull[k-1],p)<0)k--;
        hull[k++]=p;
    }
    for(int i=n-1;i>=0;i--){
        while(k>=2&&cross(hull[k-2],hull[k-1],trees[i])<0)k--;
        hull[k++]=trees[i];
    }
    return Arrays.copyOf(hull,k);
}`,
  },

  defaultInput: { points: [[1, 1], [2, 2], [2, 0], [2, 4], [3, 3], [4, 2]] },

  inputFields: [
    { name: 'points', label: 'Points', type: 'array', defaultValue: [[1, 1], [2, 2], [2, 0], [2, 4], [3, 3], [4, 2]], helperText: 'Array of [x,y] coordinate pairs' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const points = (input.points as number[][]).map(p => [...p] as [number, number]);
    const steps: AlgorithmStep[] = [];

    const cross = (O: number[], A: number[], B: number[]): number =>
      (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);

    const sorted = [...points].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    const n = sorted.length;

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 2,
      explanation: `Sort ${n} points by x then y. Sorted: ${sorted.map(p => `(${p[0]},${p[1]})`).join(', ')}.`,
      variables: { n, sorted: sorted.map(p => `(${p[0]},${p[1]})`).join(',') },
      visualization: makeViz(
        sorted.map((_, i) => i),
        Object.fromEntries(sorted.map((_, i) => [i, 'default'])),
        Object.fromEntries(sorted.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    const hull: number[][] = [];
    const hullIndices: number[] = [];

    // Lower hull
    for (let i = 0; i < n; i++) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) < 0) {
        hull.pop();
        hullIndices.pop();
      }
      hull.push(sorted[i]);
      hullIndices.push(i);

      steps.push({
        line: 6,
        explanation: `Lower hull: add (${sorted[i][0]},${sorted[i][1]}). Hull: [${hull.map(p => `(${p[0]},${p[1]})`).join(', ')}].`,
        variables: { hullSize: hull.length, point: `(${sorted[i][0]},${sorted[i][1]})` },
        visualization: makeViz(
          sorted.map((_, idx) => idx),
          Object.fromEntries(sorted.map((_, idx) => [idx, hullIndices.includes(idx) ? 'found' : idx === i ? 'active' : 'default'])),
          Object.fromEntries(sorted.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
        ),
      });
    }

    // Upper hull
    const lowerSize = hull.length;
    for (let i = n - 1; i >= 0; i--) {
      while (hull.length > lowerSize && cross(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) < 0) {
        hull.pop();
        hullIndices.pop();
      }
      hull.push(sorted[i]);
      hullIndices.push(i);
    }
    hull.pop();

    steps.push({
      line: 14,
      explanation: `Convex hull found: ${hull.length} points: ${hull.map(p => `(${p[0]},${p[1]})`).join(', ')}.`,
      variables: { hullSize: hull.length },
      visualization: makeViz(
        sorted.map((_, i) => i),
        Object.fromEntries(sorted.map((_, i) => [i, hullIndices.slice(0, hull.length).includes(i) ? 'found' : 'visited'])),
        Object.fromEntries(sorted.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    return steps;
  },
};

export default convexHull;
