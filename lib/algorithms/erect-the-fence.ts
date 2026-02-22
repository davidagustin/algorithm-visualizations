import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const erectTheFence: AlgorithmDefinition = {
  id: 'erect-the-fence',
  title: 'Erect the Fence',
  leetcodeNumber: 587,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Given tree positions, find all trees on the perimeter of the convex hull (the minimum fence). Uses Andrew\'s monotone chain algorithm with cross product. Points on the boundary edges (cross=0) must also be included.',
  tags: ['math', 'geometry', 'convex hull', 'sorting'],

  code: {
    pseudocode: `function outerTrees(trees):
  sort trees by (x, y)
  hull = []
  // Lower hull (allow collinear: cross >= 0)
  for each tree in order:
    while hull has 2+ points and cross(...) < 0:
      hull.pop()
    hull.push(tree)
  // Upper hull
  for each tree in reverse:
    while hull has 2+ points and cross(...) < 0:
      hull.pop()
    hull.push(tree)
  return unique points in hull`,

    python: `def outerTrees(trees):
    def cross(O,A,B):
        return (A[0]-O[0])*(B[1]-O[1])-(A[1]-O[1])*(B[0]-O[0])
    trees.sort(key=lambda p:(p[0],p[1]))
    n=len(trees); hull=[]
    for p in trees:
        while len(hull)>=2 and cross(hull[-2],hull[-1],p)<0:
            hull.pop()
        hull.append(p)
    for p in reversed(trees):
        while len(hull)>=2 and cross(hull[-2],hull[-1],p)<0:
            hull.pop()
        hull.append(p)
    return list(set(map(tuple,hull)))`,

    javascript: `function outerTrees(trees) {
  const cross=(O,A,B)=>(A[0]-O[0])*(B[1]-O[1])-(A[1]-O[1])*(B[0]-O[0]);
  trees.sort((a,b)=>a[0]!==b[0]?a[0]-b[0]:a[1]-b[1]);
  const n=trees.length, hull=[];
  for(let i=0;i<n;i++){
    while(hull.length>=2&&cross(hull.at(-2),hull.at(-1),trees[i])<0)hull.pop();
    hull.push(trees[i]);
  }
  for(let i=n-1;i>=0;i--){
    while(hull.length>=2&&cross(hull.at(-2),hull.at(-1),trees[i])<0)hull.pop();
    hull.push(trees[i]);
  }
  return [...new Set(hull.map(p=>JSON.stringify(p)))].map(JSON.parse);
}`,

    java: `public int[][] outerTrees(int[][] trees) {
    Arrays.sort(trees,(a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    int n=trees.length; int[][]h=new int[2*n][2]; int k=0;
    for(int[]p:trees){
        while(k>=2&&cross(h[k-2],h[k-1],p)<0)k--;h[k++]=p;
    }
    for(int i=n-1;i>=0;i--){
        while(k>=2&&cross(h[k-2],h[k-1],trees[i])<0)k--;h[k++]=trees[i];
    }
    Set<String>set=new HashSet<>();List<int[]>res=new ArrayList<>();
    for(int i=0;i<k;i++){
        String key=h[i][0]+","+h[i][1];
        if(set.add(key))res.add(h[i]);
    }
    return res.toArray(new int[0][]);
}`,
  },

  defaultInput: { trees: [[1, 1], [2, 2], [2, 0], [2, 4], [3, 3], [4, 2]] },

  inputFields: [
    { name: 'trees', label: 'Trees', type: 'array', defaultValue: [[1, 1], [2, 2], [2, 0], [2, 4], [3, 3], [4, 2]], helperText: 'Array of [x,y] tree positions' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const trees = (input.trees as number[][]).map(p => [...p] as number[]);
    const steps: AlgorithmStep[] = [];

    const cross = (O: number[], A: number[], B: number[]): number =>
      (A[0] - O[0]) * (B[1] - O[1]) - (A[1] - O[1]) * (B[0] - O[0]);

    const sorted = [...trees].sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);
    const n = sorted.length;

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array', array: arr, highlights, labels,
    });

    steps.push({
      line: 1,
      explanation: `Erect fence around ${n} trees. Sort by (x,y): ${sorted.map(p => `(${p[0]},${p[1]})`).join(', ')}.`,
      variables: { n },
      visualization: makeViz(
        sorted.map((_, i) => i),
        Object.fromEntries(sorted.map((_, i) => [i, 'default'])),
        Object.fromEntries(sorted.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    const hull: number[][] = [];
    const onHull = new Set<number>();

    for (let i = 0; i < n; i++) {
      while (hull.length >= 2 && cross(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) < 0) {
        hull.pop();
      }
      hull.push(sorted[i]);
      onHull.add(i);

      steps.push({
        line: 5,
        explanation: `Lower hull pass: add (${sorted[i][0]},${sorted[i][1]}). Hull size: ${hull.length}.`,
        variables: { hull: hull.length, point: `(${sorted[i][0]},${sorted[i][1]})` },
        visualization: makeViz(
          sorted.map((_, idx) => idx),
          Object.fromEntries(sorted.map((_, idx) => [idx, onHull.has(idx) ? 'found' : idx === i ? 'active' : 'default'])),
          Object.fromEntries(sorted.map((p, idx) => [idx, `(${p[0]},${p[1]})`]))
        ),
      });
    }

    const lower = hull.length;
    for (let i = n - 1; i >= 0; i--) {
      while (hull.length > lower && cross(hull[hull.length - 2], hull[hull.length - 1], sorted[i]) < 0) {
        hull.pop();
      }
      hull.push(sorted[i]);
      onHull.add(i);
    }

    const uniqueHull = [...new Set(hull.map(p => `${p[0]},${p[1]}`))].map(s => s.split(',').map(Number));

    steps.push({
      line: 12,
      explanation: `Fence complete: ${uniqueHull.length} trees on perimeter: ${uniqueHull.map(p => `(${p[0]},${p[1]})`).join(', ')}.`,
      variables: { fenceSize: uniqueHull.length },
      visualization: makeViz(
        sorted.map((_, i) => i),
        Object.fromEntries(sorted.map((p, i) => [i, onHull.has(i) ? 'found' : 'visited'])),
        Object.fromEntries(sorted.map((p, i) => [i, `(${p[0]},${p[1]})`]))
      ),
    });

    return steps;
  },
};

export default erectTheFence;
