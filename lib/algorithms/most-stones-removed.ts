import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mostStonesRemoved: AlgorithmDefinition = {
  id: 'most-stones-removed',
  title: 'Most Stones Removed with Same Row or Column',
  leetcodeNumber: 947,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Stones can be removed if they share a row or column with another stone. Find the maximum stones that can be removed. Use Union-Find: stones sharing a row or column are in the same connected component. Answer is total stones minus number of components (one stone must remain per component).',
  tags: ['graph', 'union find', 'dfs', 'connected components'],

  code: {
    pseudocode: `function removeStones(stones):
  parent = {}

  def find(x):
    if x not in parent: parent[x] = x
    if parent[x] != x: parent[x] = find(parent[x])
    return parent[x]

  def union(x, y):
    parent[find(x)] = find(y)

  for each stone (r, c):
    union(r, c + 10001)  // offset cols to avoid row-col collision

  components = count unique roots for all stone positions
  return len(stones) - components`,

    python: `def removeStones(stones):
    parent = {}

    def find(x):
        if x not in parent:
            parent[x] = x
        if parent[x] != x:
            parent[x] = find(parent[x])
        return parent[x]

    def union(x, y):
        parent[find(x)] = find(y)

    for r, c in stones:
        union(r, c + 10001)

    roots = {find(r) for r, c in stones}
    return len(stones) - len(roots)`,

    javascript: `function removeStones(stones) {
  const parent = {};
  const find = x => {
    if (!(x in parent)) parent[x] = x;
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x, y) => { parent[find(x)] = find(y); };
  for (const [r, c] of stones) union(r, c + 10001);
  const roots = new Set(stones.map(([r]) => find(r)));
  return stones.length - roots.size;
}`,

    java: `public int removeStones(int[][] stones) {
    Map<Integer, Integer> parent = new HashMap<>();
    for (int[] s : stones) union(parent, s[0], s[1] + 10001);
    Set<Integer> roots = new HashSet<>();
    for (int[] s : stones) roots.add(find(parent, s[0]));
    return stones.length - roots.size();
}
int find(Map<Integer,Integer> p, int x) {
    p.putIfAbsent(x, x);
    if (p.get(x) != x) p.put(x, find(p, p.get(x)));
    return p.get(x);
}
void union(Map<Integer,Integer> p, int x, int y) { p.put(find(p,x), find(p,y)); }`,
  },

  defaultInput: {
    stones: [[0,0],[0,1],[1,0],[1,2],[2,1],[2,2]],
  },

  inputFields: [
    {
      name: 'stones',
      label: 'Stones (row,col pairs)',
      type: 'array',
      defaultValue: [0, 0, 0, 1, 1, 0, 1, 2, 2, 1, 2, 2],
      placeholder: '0,0,0,1,1,0,...',
      helperText: 'Pairs of (row, col) coordinates',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stones = input.stones as number[][];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `${stones.length} stones on grid. Stones sharing row or column can remove all but one. Use Union-Find with row and (col+10001) as keys to avoid collision.`,
      variables: { totalStones: stones.length },
      visualization: {
        type: 'array',
        array: stones.flat(),
        highlights: Object.fromEntries(stones.map((_, i) => [i * 2, 'active'])),
        labels: Object.fromEntries(stones.map((s, i) => [i * 2, `(${s[0]},${s[1]})`])),
      } as ArrayVisualization,
    });

    const parent: Record<number, number> = {};

    function find(x: number): number {
      if (!(x in parent)) parent[x] = x;
      if (parent[x] !== x) parent[x] = find(parent[x]);
      return parent[x];
    }

    function union(x: number, y: number): void {
      parent[find(x)] = find(y);
    }

    for (let i = 0; i < stones.length; i++) {
      const [r, c] = stones[i];
      union(r, c + 10001);

      const roots = new Set(stones.slice(0, i + 1).map(([sr]) => find(sr)));

      steps.push({
        line: 10,
        explanation: `Union stone ${i} at (${r},${c}): connect row key ${r} with col key ${c + 10001}. Components so far: ${roots.size}.`,
        variables: { stone: i, row: r, col: c, components: roots.size },
        visualization: {
          type: 'array',
          array: stones.map(s => find(s[0])),
          highlights: { [i]: 'active' },
          labels: Object.fromEntries(stones.map((s, idx) => [idx, `root=${find(s[0])}`])),
        } as ArrayVisualization,
      });
    }

    const roots = new Set(stones.map(([r]) => find(r)));
    const result = stones.length - roots.size;

    steps.push({
      line: 12,
      explanation: `All stones processed. Unique component roots: ${roots.size}. Max removable = ${stones.length} - ${roots.size} = ${result}.`,
      variables: { components: roots.size, totalStones: stones.length, result },
      visualization: {
        type: 'array',
        array: stones.map(s => find(s[0])),
        highlights: Object.fromEntries(stones.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(stones.map((s, i) => [i, `root=${find(s[0])}`])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 13,
      explanation: `Result: ${result} stones can be removed. Each connected component keeps exactly 1 stone.`,
      variables: { result, kept: roots.size },
      visualization: {
        type: 'array',
        array: [stones.length, roots.size, result],
        highlights: { 0: 'active', 1: 'comparing', 2: 'found' },
        labels: { 0: 'total', 1: 'components', 2: 'removed' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default mostStonesRemoved;
