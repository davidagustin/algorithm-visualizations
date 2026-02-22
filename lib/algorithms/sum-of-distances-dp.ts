import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const sumOfDistances: AlgorithmDefinition = {
  id: 'sum-of-distances-dp',
  title: 'Sum of Distances in Tree',
  leetcodeNumber: 834,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given an undirected tree with n nodes, return an array where answer[i] is the sum of distances from node i to all other nodes. Solve in O(n) with two DFS passes: first pass computes subtree sizes and distances from root; second pass uses re-rooting to compute distances for all nodes.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph'],
  code: {
    pseudocode: `function sumOfDistancesInTree(n, edges):
  build adjacency list
  count[i] = subtree size, ans[i] = dist from root
  DFS1(root=0): compute count[] and ans[0]
  DFS2(node, parent):
    for each child:
      ans[child] = ans[node] - count[child] + (n - count[child])
      DFS2(child, node)
  return ans`,
    python: `def sumOfDistancesInTree(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v); graph[v].append(u)
    count = [1] * n
    ans = [0] * n
    def dfs1(node, parent):
        for child in graph[node]:
            if child != parent:
                dfs1(child, node)
                count[node] += count[child]
                ans[node] += ans[child] + count[child]
    def dfs2(node, parent):
        for child in graph[node]:
            if child != parent:
                ans[child] = ans[node] - count[child] + (n - count[child])
                dfs2(child, node)
    dfs1(0, -1); dfs2(0, -1)
    return ans`,
    javascript: `function sumOfDistancesInTree(n, edges) {
  const graph = Array.from({length: n}, () => []);
  for (const [u, v] of edges) { graph[u].push(v); graph[v].push(u); }
  const count = new Array(n).fill(1), ans = new Array(n).fill(0);
  function dfs1(node, parent) {
    for (const child of graph[node]) {
      if (child !== parent) { dfs1(child, node); count[node] += count[child]; ans[node] += ans[child] + count[child]; }
    }
  }
  function dfs2(node, parent) {
    for (const child of graph[node]) {
      if (child !== parent) { ans[child] = ans[node] - count[child] + (n - count[child]); dfs2(child, node); }
    }
  }
  dfs1(0, -1); dfs2(0, -1);
  return ans;
}`,
    java: `public int[] sumOfDistancesInTree(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    for (int i = 0; i < n; i++) graph.add(new ArrayList<>());
    for (int[] e : edges) { graph.get(e[0]).add(e[1]); graph.get(e[1]).add(e[0]); }
    int[] count = new int[n], ans = new int[n];
    Arrays.fill(count, 1);
    dfs1(0, -1, graph, count, ans);
    dfs2(0, -1, n, graph, count, ans);
    return ans;
}`,
  },
  defaultInput: { tree: [0, 1, 2, 3, 4, 5] },
  inputFields: [
    {
      name: 'tree',
      label: 'Tree nodes (level-order)',
      type: 'tree',
      defaultValue: [0, 1, 2, 3, 4, 5],
      placeholder: 'e.g. 0,1,2,3,4,5',
      helperText: 'Node indices as level-order tree. Parent of node i is at floor((i-1)/2).',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = tree.filter(v => v != null).length;
    const count: number[] = new Array(n).fill(1);
    const ans: number[] = new Array(n).fill(0);

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Sum of Distances: two-pass DFS. Pass 1 computes subtree sizes and ans[root]. Pass 2 re-roots to fill all ans[]. n=${n} nodes.`,
      variables: { n },
      visualization: makeViz(0),
    });

    function dfs1(idx: number, parentIdx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      steps.push({
        line: 5,
        explanation: `DFS1: visit node at index ${idx} (value=${tree[idx]}). Will process children and accumulate count and distance.`,
        variables: { node: tree[idx], index: idx, parentIdx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      if (leftIdx < tree.length && tree[leftIdx] != null) {
        dfs1(leftIdx, idx);
        count[idx] += count[leftIdx];
        ans[idx] += ans[leftIdx] + count[leftIdx];
      }
      if (rightIdx < tree.length && tree[rightIdx] != null) {
        dfs1(rightIdx, idx);
        count[idx] += count[rightIdx];
        ans[idx] += ans[rightIdx] + count[rightIdx];
      }

      steps.push({
        line: 7,
        explanation: `DFS1 done at node ${tree[idx]}: count[${idx}]=${count[idx]}, ans[${idx}]=${ans[idx]}.`,
        variables: { node: tree[idx], count: count[idx], ans: ans[idx] },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });
    }

    function dfs2(idx: number, parentIdx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          const oldAns = ans[childIdx];
          ans[childIdx] = ans[idx] - count[childIdx] + (n - count[childIdx]);
          steps.push({
            line: 9,
            explanation: `DFS2: ans[${childIdx}] = ans[${idx}](${ans[idx]}) - count[${childIdx}](${count[childIdx]}) + (${n} - ${count[childIdx]}) = ${ans[childIdx]}.`,
            variables: { child: tree[childIdx], oldAns, newAns: ans[childIdx] },
            visualization: makeViz(childIdx, { [childIdx]: 'comparing', [idx]: 'visited' }),
          });
          dfs2(childIdx, idx);
        }
      }
    }

    dfs1(0, -1);
    steps.push({
      line: 8,
      explanation: `DFS1 complete. ans[0]=${ans[0]} (total distances from root). Now run DFS2 to re-root.`,
      variables: { ansRoot: ans[0], countRoot: count[0] },
      visualization: makeViz(0, { 0: 'found' }),
    });

    dfs2(0, -1);

    steps.push({
      line: 11,
      explanation: `Done! Sum of distances: [${ans.slice(0, n).join(', ')}].`,
      variables: { answer: ans.slice(0, n) },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default sumOfDistances;
