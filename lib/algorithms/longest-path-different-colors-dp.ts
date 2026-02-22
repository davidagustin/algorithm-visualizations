import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const longestPathDifferentColors: AlgorithmDefinition = {
  id: 'longest-path-different-colors-dp',
  title: 'Longest Path with Different Adjacent Colors',
  leetcodeNumber: 2246,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a tree (not necessarily binary) with colored nodes, find the longest path where no two adjacent nodes share the same color. Use tree DP: for each node, compute the longest downward path with a different color from the current node. The answer is updated as the sum of the two longest valid paths through each node.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph'],
  code: {
    pseudocode: `function longestPath(parent, color):
  build adjacency list from parent array
  ans = 1
  function dfs(node, parentNode):
    longest1 = 0, longest2 = 0
    for each child of node:
      if child == parentNode: skip
      childLen = dfs(child, node)
      if color[child] != color[node]:
        update longest1 and longest2
    ans = max(ans, longest1 + longest2 + 1)
    return longest1 + 1
  dfs(0, -1)
  return ans`,
    python: `def longestPath(parent, color):
    n = len(parent)
    children = [[] for _ in range(n)]
    for i in range(1, n):
        children[parent[i]].append(i)
    ans = [1]
    def dfs(node):
        top2 = [0, 0]
        for child in children[node]:
            length = dfs(child)
            if color[child] != color[node]:
                if length > top2[0]:
                    top2[1] = top2[0]; top2[0] = length
                elif length > top2[1]:
                    top2[1] = length
        ans[0] = max(ans[0], top2[0] + top2[1] + 1)
        return top2[0] + 1
    dfs(0)
    return ans[0]`,
    javascript: `function longestPath(parent, color) {
  const n = parent.length;
  const children = Array.from({length: n}, () => []);
  for (let i = 1; i < n; i++) children[parent[i]].push(i);
  let ans = 1;
  function dfs(node) {
    let top1 = 0, top2 = 0;
    for (const child of children[node]) {
      const len = dfs(child);
      if (color[child] !== color[node]) {
        if (len > top1) { top2 = top1; top1 = len; }
        else if (len > top2) top2 = len;
      }
    }
    ans = Math.max(ans, top1 + top2 + 1);
    return top1 + 1;
  }
  dfs(0);
  return ans;
}`,
    java: `public int longestPath(int[] parent, String color) {
    int n = parent.length;
    List<List<Integer>> children = new ArrayList<>();
    for (int i = 0; i < n; i++) children.add(new ArrayList<>());
    for (int i = 1; i < n; i++) children.get(parent[i]).add(i);
    int[] ans = {1};
    dfs(0, parent, color, children, ans);
    return ans[0];
}`,
  },
  defaultInput: { tree: [1, 2, 3, null, null, 4, 5], colors: [1, 2, 1, 1, 2, 1, 2] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, null, null, 4, 5],
      placeholder: 'e.g. 1,2,3,null,null,4,5',
      helperText: 'Node values (used as colors). Level-order with null for missing nodes.',
    },
    {
      name: 'colors',
      label: 'Colors (level-order)',
      type: 'array',
      defaultValue: [1, 2, 1, 1, 2, 1, 2],
      placeholder: 'e.g. 1,2,1,1,2,1,2',
      helperText: 'Color of each node in level-order.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const colors = (input.colors as number[]).slice();
    const steps: AlgorithmStep[] = [];
    let ans = 1;
    const dpLen: Record<number, number> = {};

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Longest Path with Different Adjacent Colors: for each node, find two longest paths through children with different color. ans = max path combining two directions.',
      variables: { ans: 1 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;

      const val = tree[idx];
      const color = colors[idx] ?? val;

      steps.push({
        line: 4,
        explanation: `Visit node ${val} (color=${color}) at index ${idx}.`,
        variables: { node: val, color, index: idx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const leftLen = dfs(leftIdx);
      const rightLen = dfs(rightIdx);

      const leftColor = leftIdx < tree.length ? (colors[leftIdx] ?? tree[leftIdx]) : -1;
      const rightColor = rightIdx < tree.length ? (colors[rightIdx] ?? tree[rightIdx]) : -1;

      const validLeft = tree[leftIdx] != null && leftColor !== color ? leftLen : 0;
      const validRight = tree[rightIdx] != null && rightColor !== color ? rightLen : 0;

      const pathLen = validLeft + validRight + 1;
      ans = Math.max(ans, pathLen);
      dpLen[idx] = Math.max(validLeft, validRight) + 1;

      steps.push({
        line: 9,
        explanation: `Node ${val}: validLeft=${validLeft}, validRight=${validRight}. Path through node = ${pathLen}. ans updated to ${ans}. Return ${dpLen[idx]}.`,
        variables: { node: val, validLeft, validRight, pathLen, ans, returning: dpLen[idx] },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });

      return dpLen[idx];
    }

    dfs(0);

    steps.push({
      line: 12,
      explanation: `Longest path with different adjacent colors = ${ans}.`,
      variables: { answer: ans },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default longestPathDifferentColors;
