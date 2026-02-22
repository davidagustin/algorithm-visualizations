import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const validateBinaryTreeNodes: AlgorithmDefinition = {
  id: 'validate-binary-tree-nodes',
  title: 'Validate Binary Tree Nodes',
  leetcodeNumber: 1361,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given n nodes labeled 0 to n-1 and two arrays leftChild and rightChild representing tree structure, return true if and only if all the given nodes form exactly one valid binary tree. Check: exactly one root (no parent), no node has two parents, no cycles, and all nodes are connected.',
  tags: ['tree', 'union find', 'graph', 'validation', 'BFS'],

  code: {
    pseudocode: `function validateBinaryTreeNodes(n, leftChild, rightChild):
  parent = array of -1 with size n
  root = -1
  for i in 0..n-1:
    for child in [leftChild[i], rightChild[i]]:
      if child == -1: continue
      if parent[child] != -1: return false  // two parents
      parent[child] = i
  for i in 0..n-1:
    if parent[i] == -1:
      if root != -1: return false  // two roots
      root = i
  if root == -1: return false
  return BFS/DFS visits all n nodes`,

    python: `def validateBinaryTreeNodes(n, leftChild, rightChild):
    parent = [-1] * n
    for i in range(n):
        for child in [leftChild[i], rightChild[i]]:
            if child == -1: continue
            if parent[child] != -1: return False
            parent[child] = i
    roots = [i for i in range(n) if parent[i] == -1]
    if len(roots) != 1: return False
    root = roots[0]
    visited = set()
    stack = [root]
    while stack:
        node = stack.pop()
        if node in visited: return False
        visited.add(node)
        if leftChild[node] != -1: stack.append(leftChild[node])
        if rightChild[node] != -1: stack.append(rightChild[node])
    return len(visited) == n`,

    javascript: `function validateBinaryTreeNodes(n, leftChild, rightChild) {
  const parent = new Array(n).fill(-1);
  for (let i = 0; i < n; i++) {
    for (const child of [leftChild[i], rightChild[i]]) {
      if (child === -1) continue;
      if (parent[child] !== -1) return false;
      parent[child] = i;
    }
  }
  const roots = Array.from({length: n}, (_, i) => i).filter(i => parent[i] === -1);
  if (roots.length !== 1) return false;
  const visited = new Set();
  const stack = [roots[0]];
  while (stack.length) {
    const node = stack.pop();
    if (visited.has(node)) return false;
    visited.add(node);
    if (leftChild[node] !== -1) stack.push(leftChild[node]);
    if (rightChild[node] !== -1) stack.push(rightChild[node]);
  }
  return visited.size === n;
}`,

    java: `public boolean validateBinaryTreeNodes(int n, int[] leftChild, int[] rightChild) {
    int[] parent = new int[n];
    Arrays.fill(parent, -1);
    for (int i = 0; i < n; i++) {
        for (int child : new int[]{leftChild[i], rightChild[i]}) {
            if (child == -1) continue;
            if (parent[child] != -1) return false;
            parent[child] = i;
        }
    }
    int root = -1;
    for (int i = 0; i < n; i++) {
        if (parent[i] == -1) { if (root != -1) return false; root = i; }
    }
    if (root == -1) return false;
    Set<Integer> visited = new HashSet<>();
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(root);
    while (!stack.isEmpty()) {
        int node = stack.pop();
        if (!visited.add(node)) return false;
        if (leftChild[node] != -1) stack.push(leftChild[node]);
        if (rightChild[node] != -1) stack.push(rightChild[node]);
    }
    return visited.size() == n;
}`,
  },

  defaultInput: {
    n: 4,
    leftChild: [1, -1, 3, -1],
    rightChild: [2, -1, -1, -1],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of nodes (n)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Total number of nodes labeled 0 to n-1',
    },
    {
      name: 'leftChild',
      label: 'Left Children',
      type: 'array',
      defaultValue: [1, -1, 3, -1],
      placeholder: '1,-1,3,-1',
      helperText: 'leftChild[i] = left child of node i (-1 if none)',
    },
    {
      name: 'rightChild',
      label: 'Right Children',
      type: 'array',
      defaultValue: [2, -1, -1, -1],
      placeholder: '2,-1,-1,-1',
      helperText: 'rightChild[i] = right child of node i (-1 if none)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const leftChild = input.leftChild as number[];
    const rightChild = input.rightChild as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Validate ${n} nodes form exactly one binary tree. Left children: [${leftChild}], Right children: [${rightChild}].`,
      variables: { n, leftChild: JSON.stringify(leftChild), rightChild: JSON.stringify(rightChild) },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `node ${i}`])),
      },
    });

    // Build parent array
    const parent: number[] = new Array(n).fill(-1);
    let valid = true;

    for (let i = 0; i < n; i++) {
      for (const child of [leftChild[i], rightChild[i]]) {
        if (child === -1) continue;
        if (parent[child] !== -1) {
          steps.push({
            line: 6,
            explanation: `Node ${child} already has parent ${parent[child]}. Trying to set parent to ${i} again. INVALID - two parents!`,
            variables: { node: child, existingParent: parent[child], newParent: i, valid: false },
            visualization: {
              type: 'array',
              array: [...parent],
              highlights: { [child]: 'mismatch' },
              labels: Object.fromEntries(parent.map((p, idx) => [idx, p === -1 ? 'no parent' : `parent:${p}`])),
            },
          });
          valid = false;
          break;
        }
        parent[child] = i;
        steps.push({
          line: 5,
          explanation: `Set parent of node ${child} to ${i}.`,
          variables: { child, parent: i, parentArray: JSON.stringify(parent) },
          visualization: {
            type: 'array',
            array: [...parent],
            highlights: { [child]: 'active', [i]: 'pointer' },
            labels: Object.fromEntries(parent.map((p, idx) => [idx, p === -1 ? 'root?' : `parent:${p}`])),
          },
        });
      }
      if (!valid) break;
    }

    if (!valid) {
      steps.push({
        line: 6,
        explanation: `Validation FAILED: a node has two parents. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: {},
        },
      });
      return steps;
    }

    // Find root(s)
    const roots = parent.map((p, i) => ({ p, i })).filter(({ p }) => p === -1).map(({ i }) => i);

    steps.push({
      line: 8,
      explanation: `Parent array complete: [${parent.join(', ')}]. Nodes with no parent (roots): [${roots.join(', ')}].`,
      variables: { parent: JSON.stringify(parent), roots: JSON.stringify(roots) },
      visualization: {
        type: 'array',
        array: [...parent],
        highlights: Object.fromEntries(roots.map(r => [r, 'found'])),
        labels: Object.fromEntries(parent.map((p, i) => [i, p === -1 ? 'ROOT' : `p:${p}`])),
      },
    });

    if (roots.length !== 1) {
      steps.push({
        line: 9,
        explanation: `Found ${roots.length} roots. A valid tree must have exactly 1 root. Return false.`,
        variables: { roots: JSON.stringify(roots), result: false },
        visualization: {
          type: 'array',
          array: [...parent],
          highlights: Object.fromEntries(roots.map(r => [r, 'mismatch'])),
        },
      });
      return steps;
    }

    // BFS to check connectivity
    const root = roots[0];
    const visited = new Set<number>();
    const queue = [root];

    while (queue.length > 0) {
      const node = queue.shift()!;
      if (visited.has(node)) {
        steps.push({
          line: 11,
          explanation: `Cycle detected visiting node ${node} again. Return false.`,
          variables: { node, result: false },
          visualization: {
            type: 'array',
            array: Array.from({ length: n }, (_, i) => i),
            highlights: { [node]: 'mismatch' },
          },
        });
        return steps;
      }
      visited.add(node);
      if (leftChild[node] !== -1) queue.push(leftChild[node]);
      if (rightChild[node] !== -1) queue.push(rightChild[node]);
    }

    const allConnected = visited.size === n;

    steps.push({
      line: 12,
      explanation: `BFS from root ${root} visited ${visited.size} of ${n} nodes. ${allConnected ? 'All nodes connected. Return true.' : 'Not all connected. Return false.'}`,
      variables: { visited: visited.size, n, allConnected, result: allConnected },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: Object.fromEntries(
          Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'found' : 'mismatch'])
        ),
      },
    });

    return steps;
  },
};

export default validateBinaryTreeNodes;
