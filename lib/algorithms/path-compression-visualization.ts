import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pathCompressionVisualization: AlgorithmDefinition = {
  id: 'path-compression-visualization',
  title: 'Path Compression Visualization',
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Path compression is an optimization for union-find (disjoint set union). When calling find(x), instead of traversing a long chain each time, we flatten the tree by making all nodes on the path point directly to the root. This brings the amortized complexity close to O(1) per operation.',
  tags: ['union find', 'graph', 'path compression', 'optimization'],

  code: {
    pseudocode: `// Without path compression: O(n) per find
function find_naive(parent, x):
  while parent[x] != x:
    x = parent[x]
  return x

// With path compression: amortized O(alpha(n))
function find(parent, x):
  while parent[x] != x:
    parent[x] = parent[parent[x]]  // halving trick
    x = parent[x]
  return x`,

    python: `# Without path compression
def find_naive(parent, x):
    while parent[x] != x:
        x = parent[x]
    return x

# With path compression (path halving)
def find(parent, x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]  # point to grandparent
        x = parent[x]
    return x`,

    javascript: `// Without path compression
function find_naive(parent, x) {
  while (parent[x] !== x) x = parent[x];
  return x;
}

// With path compression (path halving)
function find(parent, x) {
  while (parent[x] !== x) {
    parent[x] = parent[parent[x]]; // grandparent shortcut
    x = parent[x];
  }
  return x;
}`,

    java: `// Without path compression
int find_naive(int[] parent, int x) {
    while (parent[x] != x) x = parent[x];
    return x;
}

// With path compression (path halving)
int find(int[] parent, int x) {
    while (parent[x] != x) {
        parent[x] = parent[parent[x]]; // point to grandparent
        x = parent[x];
    }
    return x;
}`,
  },

  defaultInput: {
    parent: [0, 0, 1, 2, 3],
    queryNode: 4,
  },

  inputFields: [
    {
      name: 'parent',
      label: 'Parent Array',
      type: 'array',
      defaultValue: [0, 0, 1, 2, 3],
      placeholder: '0,0,1,2,3',
      helperText: 'parent[i] = parent of node i (root points to itself)',
    },
    {
      name: 'queryNode',
      label: 'Query Node',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Node to find the root for (demonstrates path compression)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origParent = input.parent as number[];
    const queryNode = input.queryNode as number;
    const steps: AlgorithmStep[] = [];

    // Clone for naive
    const naiveParent = [...origParent];
    const compressedParent = [...origParent];

    steps.push({
      line: 1,
      explanation: `Initial parent array: [${origParent}]. Node ${queryNode} needs to traverse to its root. Observe path: ${queryNode} -> ${naiveParent[queryNode]} -> ... Compare naive vs path-compressed approach.`,
      variables: { queryNode, parent: origParent.join(',') },
      visualization: {
        type: 'array',
        array: [...origParent],
        highlights: { [queryNode]: 'active' },
        labels: Object.fromEntries(origParent.map((v, i) => [i, `par:${v}`])),
      },
    });

    // Naive traversal - show each hop
    let x = queryNode;
    let hopCount = 0;
    const path: number[] = [x];

    steps.push({
      line: 2,
      explanation: `NAIVE find(${queryNode}): traverse chain without compression.`,
      variables: { method: 'naive', node: x },
      visualization: {
        type: 'array',
        array: [...naiveParent],
        highlights: { [x]: 'active' },
        labels: { [x]: 'start' },
      },
    });

    while (naiveParent[x] !== x) {
      const prev = x;
      x = naiveParent[x];
      path.push(x);
      hopCount++;

      steps.push({
        line: 3,
        explanation: `Naive: hop from node ${prev} to parent ${x}. Hop count: ${hopCount}. Path so far: [${path.join(' -> ')}].`,
        variables: { from: prev, to: x, hops: hopCount },
        visualization: {
          type: 'array',
          array: [...naiveParent],
          highlights: { [prev]: 'visited', [x]: 'active' },
          labels: Object.fromEntries(path.map((n, i) => [n, i === path.length - 1 ? 'cur' : `hop${i + 1}`])),
        },
      });
    }

    steps.push({
      line: 4,
      explanation: `Naive find complete. Root = ${x}. Took ${hopCount} hops. After this call, NO structure changes - next call for same node takes ${hopCount} hops again!`,
      variables: { root: x, totalHops: hopCount },
      visualization: {
        type: 'array',
        array: [...naiveParent],
        highlights: { [x]: 'found' },
        labels: { [x]: 'root' },
      },
    });

    // Path compression traversal
    steps.push({
      line: 7,
      explanation: `PATH COMPRESSION find(${queryNode}): during traversal, each node is made to point to its grandparent (path halving).`,
      variables: { method: 'compressed', node: queryNode },
      visualization: {
        type: 'array',
        array: [...compressedParent],
        highlights: { [queryNode]: 'active' },
        labels: { [queryNode]: 'start' },
      },
    });

    let y = queryNode;
    let compHops = 0;

    while (compressedParent[y] !== y) {
      const prev = y;
      const grandparent = compressedParent[compressedParent[y]];
      compressedParent[y] = grandparent; // path halving
      y = compressedParent[prev];
      compHops++;

      steps.push({
        line: 9,
        explanation: `Compress: node ${prev} now points to grandparent ${grandparent} instead of ${origParent[prev]}. Move to node ${y}. Compressed hops: ${compHops}.`,
        variables: { node: prev, newParent: grandparent, nextNode: y, compHops },
        visualization: {
          type: 'array',
          array: [...compressedParent],
          highlights: { [prev]: 'comparing', [grandparent]: 'found', [y]: 'active' },
          labels: { [prev]: `-> ${grandparent}`, [grandparent]: 'root?' },
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `Path compression complete. Root = ${y}. Took ${compHops} hops (vs ${hopCount} naive). Future calls on same path will be faster!`,
      variables: { root: y, compHops, naiveHops: hopCount, speedup: `${hopCount}x improvement on next call` },
      visualization: {
        type: 'array',
        array: [...compressedParent],
        highlights: Object.fromEntries(compressedParent.map((_, i) => [i, compressedParent[i] === i ? 'found' : 'visited'])),
        labels: Object.fromEntries(compressedParent.map((v, i) => [i, `par:${v}`])),
      },
    });

    return steps;
  },
};

export default pathCompressionVisualization;
