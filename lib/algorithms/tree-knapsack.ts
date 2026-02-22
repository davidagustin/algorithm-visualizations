import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const treeKnapsack: AlgorithmDefinition = {
  id: 'tree-knapsack',
  title: 'Tree Knapsack (Dependent Knapsack)',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Tree Knapsack (also called Dependent Knapsack) generalizes 0/1 knapsack to a tree structure: selecting a node requires selecting its parent. Given a tree where each node has a weight and value, and a budget W, maximize total value subject to total weight <= W and the dependency constraint. Use tree DP: dp[v][j] = max value using exactly j weight in subtree of v.',
  tags: ['Tree', 'Dynamic Programming', 'Knapsack', 'DFS'],
  code: {
    pseudocode: `function treeKnapsack(root, W, weight, value):
  function dfs(node) -> dp[0..W]:
    dp = new array of size W+1 filled -inf
    dp[weight[node]] = value[node]  # must include root
    for each child:
      childDP = dfs(child)
      # merge childDP into dp
      for j from W downto 0:
        for k from 0 to j-weight[node]:
          if dp[j-k] + childDP[k] > dp[j]:
            dp[j] = dp[j-k] + childDP[k]
    return dp
  rootDP = dfs(root)
  return max(max(rootDP), 0)  # 0 if not using tree`,
    python: `def treeKnapsack(n, W, parent, weight, value):
    children = defaultdict(list)
    for i in range(1, n):
        children[parent[i]].append(i)
    def dfs(v):
        dp = [-inf] * (W + 1)
        dp[weight[v]] = value[v]
        for child in children[v]:
            child_dp = dfs(child)
            new_dp = dp[:]
            for j in range(W, -1, -1):
                if dp[j] == -inf: continue
                for k in range(W - j + 1):
                    if child_dp[k] != -inf:
                        new_dp[j+k] = max(new_dp[j+k], dp[j]+child_dp[k])
            dp = new_dp
        return dp
    root_dp = dfs(0)
    return max(max(root_dp), 0)`,
    javascript: `function treeKnapsack(n, W, parent, weight, value) {
  const children = Array.from({length:n},()=>[]);
  for(let i=1;i<n;i++) children[parent[i]].push(i);
  function dfs(v) {
    const dp = new Array(W+1).fill(-Infinity);
    dp[weight[v]] = value[v];
    for(const c of children[v]) {
      const cdp = dfs(c);
      for(let j=W;j>=0;j--) if(dp[j]!==-Infinity)
        for(let k=0;k<=W-j;k++) if(cdp[k]!==-Infinity)
          dp[j+k] = Math.max(dp[j+k], dp[j]+cdp[k]);
    }
    return dp;
  }
  return Math.max(Math.max(...dfs(0)), 0);
}`,
    java: `int treeKnapsack(int n, int W, int[] parent, int[] weight, int[] value) {
    List<List<Integer>> children = new ArrayList<>();
    for(int i=0;i<n;i++) children.add(new ArrayList<>());
    for(int i=1;i<n;i++) children.get(parent[i]).add(i);
    int[] rootDp = dfs(0, W, weight, value, children);
    int ans = 0;
    for(int v : rootDp) ans = Math.max(ans, v);
    return ans;
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order, values as node values)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Node values. Weight capacity W=5. Weights are node indices+1.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const W = 5;
    const steps: AlgorithmStep[] = [];
    const NEG_INF = -Infinity;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Tree Knapsack: budget W=${W}. Each node has weight=(index+1), value=(node.val). Selecting a child requires selecting its parent. dp[v][j] = max value using exactly j weight in subtree rooted at v.`,
      variables: { W },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number[] {
      if (idx >= tree.length || tree[idx] == null) return new Array(W + 1).fill(0);

      const val = tree[idx] as number;
      const w = idx + 1; // weight = index + 1

      if (w > W) return new Array(W + 1).fill(0);

      const dp: number[] = new Array(W + 1).fill(NEG_INF);
      dp[w] = val;

      steps.push({
        line: 3,
        explanation: `Node ${val} (w=${w}): initialize dp[${w}]=${val}. All others = -INF (must include this node if we include subtree).`,
        variables: { node: val, weight: w, value: val },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          const cdp = dfs(childIdx);
          const newDp = [...dp];
          for (let j = W; j >= 0; j--) {
            if (dp[j] === NEG_INF) continue;
            for (let k = 0; k <= W - j; k++) {
              if (cdp[k] !== NEG_INF && cdp[k] > 0) {
                newDp[j + k] = Math.max(newDp[j + k], dp[j] + cdp[k]);
              }
            }
          }
          dp.splice(0, dp.length, ...newDp);

          steps.push({
            line: 9,
            explanation: `Merged child ${tree[childIdx]} into node ${val}'s dp. Best dp: [${dp.map(v => v === NEG_INF ? '-' : v).join(',')}].`,
            variables: { node: val, child: tree[childIdx], dp: dp.map(v => v === NEG_INF ? '-inf' : v) },
            visualization: makeViz(idx, { [idx]: 'comparing', [childIdx]: 'visited' }),
          });
        }
      }

      steps.push({
        line: 11,
        explanation: `Node ${val} dp complete: [${dp.map(v => v === NEG_INF ? '-' : v).join(',')}].`,
        variables: { node: val, dp: dp.map(v => v === NEG_INF ? '-inf' : v) },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });

      return dp;
    }

    const rootDp = dfs(0);
    const answer = Math.max(0, ...rootDp.filter(v => v !== NEG_INF));

    steps.push({
      line: 13,
      explanation: `Tree Knapsack complete! Max value with W=${W}: ${answer}.`,
      variables: { answer, W },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default treeKnapsack;
