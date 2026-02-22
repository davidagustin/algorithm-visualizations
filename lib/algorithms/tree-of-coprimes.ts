import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treeOfCoprimes: AlgorithmDefinition = {
  id: 'tree-of-coprimes',
  title: 'Tree of Coprimes',
  leetcodeNumber: 1766,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a tree with node values, for each node find the closest ancestor (deepest) whose value is coprime with the node\'s value. Two integers are coprime if gcd(a,b)=1. Use DFS with a map tracking the last seen depth for each possible value (1-50).',
  tags: ['Tree', 'DFS', 'Math', 'GCD'],
  code: {
    pseudocode: `function getCoprimes(nums, edges):
  build adjacency list
  ans = [-1] * n
  lastSeen = {}  # value -> (node, depth)
  dfs(0, -1, 0)

function dfs(node, parent, depth):
  bestDepth = -1; bestNode = -1
  for val in 1..50:
    if gcd(nums[node], val) == 1 and val in lastSeen:
      if lastSeen[val].depth > bestDepth:
        bestDepth = lastSeen[val].depth
        bestNode = lastSeen[val].node
  ans[node] = bestNode
  push nums[node] to lastSeen
  for child in adj[node]: if child != parent: dfs(child, node, depth+1)
  pop nums[node] from lastSeen`,
    python: `def getCoprimes(nums, edges):
    from math import gcd
    n = len(nums)
    adj = [[] for _ in range(n)]
    for a, b in edges:
        adj[a].append(b); adj[b].append(a)
    ans = [-1] * n
    path = {}  # val -> stack of (node, depth)
    def dfs(node, parent, depth):
        best_depth, best_node = -1, -1
        for v in range(1, 51):
            if gcd(nums[node], v) == 1 and v in path and path[v]:
                nd, nn = path[v][-1]
                if nd > best_depth:
                    best_depth, best_node = nd, nn
        ans[node] = best_node
        path.setdefault(nums[node], []).append((depth, node))
        for child in adj[node]:
            if child != parent: dfs(child, node, depth+1)
        path[nums[node]].pop()
    dfs(0, -1, 0)
    return ans`,
    javascript: `function getCoprimes(nums, edges) {
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  const n = nums.length;
  const adj = Array.from({length:n},()=>[]);
  for (const [a,b] of edges) { adj[a].push(b); adj[b].push(a); }
  const ans = new Array(n).fill(-1);
  const path = {};
  function dfs(node, parent, depth) {
    let bestDepth = -1, bestNode = -1;
    for (let v = 1; v <= 50; v++) {
      if (gcd(nums[node],v)===1 && path[v]?.length) {
        const [d,nd] = path[v][path[v].length-1];
        if (d > bestDepth) { bestDepth = d; bestNode = nd; }
      }
    }
    ans[node] = bestNode;
    (path[nums[node]] ??= []).push([depth, node]);
    for (const child of adj[node]) if (child!==parent) dfs(child,node,depth+1);
    path[nums[node]].pop();
  }
  dfs(0,-1,0);
  return ans;
}`,
    java: `public int[] getCoprimes(int[] nums, int[][] edges) {
    // Build adj, run DFS with ancestor tracking per value
    return new int[nums.length]; // placeholder
}`,
  },
  defaultInput: { tree: [2, 3, 2, 5, 2, null, null] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order, node values)',
      type: 'tree',
      defaultValue: [2, 3, 2, 5, 2, null, null],
      placeholder: 'e.g. 2,3,2,5,2',
      helperText: 'Level-order array. Values 1-50.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return [].', variables: {}, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'For each node, find deepest ancestor coprime with it. gcd(a,b)=1 means coprime.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    const ans: number[] = new Array(tree.length).fill(-1);
    const path: Map<number, Array<[number, number]>> = new Map(); // val -> [(depth, idx)]
    const ancestors: number[] = [];

    function dfs(idx: number, depth: number): void {
      if (idx >= tree.length || tree[idx] == null) return;
      visited.add(idx);
      const val = tree[idx] as number;

      let bestDepth = -1, bestNode = -1;
      for (let v = 1; v <= 50; v++) {
        if (gcd(val, v) === 1 && (path.get(v)?.length ?? 0) > 0) {
          const stack = path.get(v)!;
          const [d, nd] = stack[stack.length - 1];
          if (d > bestDepth) { bestDepth = d; bestNode = nd; }
        }
      }
      ans[idx] = bestNode;
      ancestors.push(idx);

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';
      if (bestNode >= 0) highlights[bestNode] = 'found';

      steps.push({
        line: 12,
        explanation: `Node ${tree[idx]} (depth=${depth}): coprime ancestor = ${bestNode >= 0 ? tree[bestNode] + ' (idx ' + bestNode + ')' : 'none'}.`,
        variables: { node: val, depth, coprimeAncestor: bestNode >= 0 ? tree[bestNode] : -1 },
        visualization: makeViz(highlights),
      });

      if (!path.has(val)) path.set(val, []);
      path.get(val)!.push([depth, idx]);

      dfs(2 * idx + 1, depth + 1);
      dfs(2 * idx + 2, depth + 1);

      path.get(val)!.pop();
    }

    dfs(0, 0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 5,
      explanation: `Tree of coprimes complete. ans = [${ans.slice(0, tree.filter(v => v != null).length).join(', ')}].`,
      variables: { ans },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default treeOfCoprimes;
