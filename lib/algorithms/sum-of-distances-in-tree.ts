import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sumOfDistancesInTree: AlgorithmDefinition = {
  id: 'sum-of-distances-in-tree',
  title: 'Sum of Distances in Tree',
  leetcodeNumber: 834,
  difficulty: 'Hard',
  category: 'Tree',
  description:
    'Given a tree with n nodes and edges, return an array where answer[i] is the sum of distances from node i to all other nodes. Two DFS passes: first DFS computes subtree sizes and answer[0] (sum of distances from root to all nodes). Second DFS re-roots: when moving root from parent to child, answer[child] = answer[parent] - count[child] + (n - count[child]).',
  tags: ['tree', 'dfs', 'rerooting', 'graph'],

  code: {
    pseudocode: `function sumOfDistancesInTree(n, edges):
  graph = build adjacency list
  count = [1] * n  # subtree sizes
  answer = [0] * n

  function dfs1(node, parent):
    for child in graph[node]:
      if child == parent: continue
      dfs1(child, node)
      count[node] += count[child]
      answer[node] += answer[child] + count[child]

  function dfs2(node, parent):
    for child in graph[node]:
      if child == parent: continue
      answer[child] = answer[node] - count[child] + (n - count[child])
      dfs2(child, node)

  dfs1(0, -1)
  dfs2(0, -1)
  return answer`,
    python: `def sumOfDistancesInTree(n, edges):
    from collections import defaultdict
    g = defaultdict(set)
    for u, v in edges:
        g[u].add(v); g[v].add(u)
    count = [1] * n
    ans = [0] * n
    def dfs1(node, parent):
        for child in g[node]:
            if child == parent: continue
            dfs1(child, node)
            count[node] += count[child]
            ans[node] += ans[child] + count[child]
    def dfs2(node, parent):
        for child in g[node]:
            if child == parent: continue
            ans[child] = ans[node] - count[child] + (n - count[child])
            dfs2(child, node)
    dfs1(0, -1); dfs2(0, -1)
    return ans`,
    javascript: `function sumOfDistancesInTree(n, edges) {
  const g = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { g[u].push(v); g[v].push(u); }
  const count = new Array(n).fill(1), ans = new Array(n).fill(0);
  function dfs1(node, parent) {
    for (const child of g[node]) {
      if (child === parent) continue;
      dfs1(child, node);
      count[node] += count[child];
      ans[node] += ans[child] + count[child];
    }
  }
  function dfs2(node, parent) {
    for (const child of g[node]) {
      if (child === parent) continue;
      ans[child] = ans[node] - count[child] + (n - count[child]);
      dfs2(child, node);
    }
  }
  dfs1(0, -1); dfs2(0, -1);
  return ans;
}`,
    java: `public int[] sumOfDistancesInTree(int n, int[][] edges) {
    List<List<Integer>> g = new ArrayList<>();
    for (int i = 0; i < n; i++) g.add(new ArrayList<>());
    for (int[] e : edges) { g.get(e[0]).add(e[1]); g.get(e[1]).add(e[0]); }
    int[] count = new int[n], ans = new int[n];
    Arrays.fill(count, 1);
    dfs1(g, 0, -1, count, ans);
    dfs2(g, 0, -1, count, ans, n);
    return ans;
}`,
  },

  defaultInput: {
    nums: [0, 1, 2, 3, 4, 5],
    edges: [0, 1, 0, 2, 2, 3, 2, 4, 2, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Nodes (0 to n-1)',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4, 5],
      placeholder: '0,1,2,3,4,5',
      helperText: 'Node indices (just for display)',
    },
    {
      name: 'edges',
      label: 'Edges (pairs: u1,v1,u2,v2,...)',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 2, 3, 2, 4, 2, 5],
      placeholder: '0,1,0,2,2,3,2,4,2,5',
      helperText: 'Edge pairs in sequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nodes = input.nums as number[];
    const edgeArr = input.edges as number[];
    const n = nodes.length;
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nodes],
      highlights,
      labels,
    });

    // Build adjacency
    const g: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i + 1 < edgeArr.length; i += 2) {
      const u = edgeArr[i], v = edgeArr[i + 1];
      g[u].push(v);
      g[v].push(u);
    }

    const count = new Array(n).fill(1);
    const ans = new Array(n).fill(0);

    steps.push({
      line: 1,
      explanation: `Tree with ${n} nodes. Two-pass DFS: first compute subtree sizes and distance sum from root. Then re-root to get distances for all nodes.`,
      variables: { n, count: '[1,1,...,1]', answer: '[0,0,...,0]' },
      visualization: makeViz({}, {}),
    });

    function dfs1(node: number, parent: number) {
      for (const child of g[node]) {
        if (child === parent) continue;
        dfs1(child, node);
        count[node] += count[child];
        ans[node] += ans[child] + count[child];
      }
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      nodes.forEach((_, i) => {
        highlights[i] = 'visited';
        labels[i] = `c=${count[i]}`;
      });
      highlights[node] = 'active';
      labels[node] = `c=${count[node]},a=${ans[node]}`;

      steps.push({
        line: 9,
        explanation: `DFS1 at node ${node}: subtreeSize=${count[node]}, answer[${node}]=${ans[node]} (sum of child subtree sizes).`,
        variables: { node, subtreeSize: count[node], distSum: ans[node] },
        visualization: makeViz(highlights, labels),
      });
    }

    dfs1(0, -1);

    steps.push({
      line: 12,
      explanation: `DFS1 complete. answer[0]=${ans[0]} (total distances from root to all nodes). Now re-root with DFS2.`,
      variables: { rootAnswer: ans[0], counts: [...count] },
      visualization: makeViz(
        Object.fromEntries(nodes.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(nodes.map((_, i) => [i, `a=${ans[i]}`]))
      ),
    });

    function dfs2(node: number, parent: number) {
      for (const child of g[node]) {
        if (child === parent) continue;
        const before = ans[child];
        ans[child] = ans[node] - count[child] + (n - count[child]);

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        nodes.forEach((_, i) => {
          highlights[i] = 'visited';
          labels[i] = `a=${ans[i]}`;
        });
        highlights[node] = 'comparing';
        highlights[child] = 'found';
        labels[child] = `a=${ans[child]}`;

        steps.push({
          line: 16,
          explanation: `DFS2: ans[${child}] = ans[${node}](${ans[node]}) - count[${child}](${count[child]}) + (${n} - ${count[child]}) = ${ans[child]}. Re-rooted from node ${node} to ${child}.`,
          variables: { parent: node, child, before, after: ans[child], formula: `${ans[node]} - ${count[child]} + ${n - count[child]}` },
          visualization: makeViz(highlights, labels),
        });

        dfs2(child, node);
      }
    }

    dfs2(0, -1);

    steps.push({
      line: 19,
      explanation: `Final answer: [${ans.join(', ')}]. Each ans[i] = sum of distances from node i to all other nodes.`,
      variables: { result: [...ans] },
      visualization: makeViz(
        Object.fromEntries(nodes.map((_, i) => [i, 'found'])),
        Object.fromEntries(nodes.map((_, i) => [i, `${ans[i]}`]))
      ),
    });

    return steps;
  },
};

export default sumOfDistancesInTree;
