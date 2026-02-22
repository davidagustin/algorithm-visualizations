import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const diameterOfNAryTree: AlgorithmDefinition = {
  id: 'diameter-of-n-ary-tree',
  title: 'Diameter of N-ary Tree',
  leetcodeNumber: 1522,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'The diameter of an N-ary tree is the length of the longest path between any two nodes. This path may or may not pass through the root. Use DFS: at each node, find the two longest child paths and update the global maximum.',
  tags: ['Tree', 'DFS', 'Diameter'],
  code: {
    pseudocode: `diameter = 0
function dfs(node):
  if node is null: return 0
  top1 = top2 = 0
  for child in node.children:
    h = dfs(child)
    if h > top1: top2=top1; top1=h
    elif h > top2: top2=h
  diameter = max(diameter, top1 + top2)
  return top1 + 1`,
    python: `def diameter(root):
    ans = 0
    def dfs(node):
        nonlocal ans
        if not node: return 0
        top = sorted([dfs(c) for c in node.children], reverse=True)[:2]
        while len(top) < 2: top.append(0)
        ans = max(ans, top[0] + top[1])
        return top[0] + 1
    dfs(root)
    return ans`,
    javascript: `function diameter(root) {
  let ans = 0;
  function dfs(node) {
    if (!node) return 0;
    const heights = node.children.map(dfs).sort((a,b)=>b-a);
    const top1 = heights[0] || 0, top2 = heights[1] || 0;
    ans = Math.max(ans, top1 + top2);
    return top1 + 1;
  }
  dfs(root);
  return ans;
}`,
    java: `public int diameter(Node root) {
    int[] ans = {0};
    dfs(root, ans);
    return ans[0];
}
int dfs(Node node, int[] ans) {
    if (node == null) return 0;
    int top1 = 0, top2 = 0;
    for (Node child : node.children) {
        int h = dfs(child, ans);
        if (h > top1) { top2 = top1; top1 = h; }
        else if (h > top2) top2 = h;
    }
    ans[0] = Math.max(ans[0], top1 + top2);
    return top1 + 1;
}`,
  },
  defaultInput: { tree: [1, null, 3, 2, 4, null, 5, 6] },
  inputFields: [
    {
      name: 'tree',
      label: 'N-ary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, null, 3, 2, 4, null, 5, 6],
      placeholder: 'e.g. 1,null,3,2,4,null,5,6',
      helperText: 'Visualized as binary tree for display.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawTree = (input.tree as (number | null)[]).filter(v => v !== null) as number[];
    const tree: (number | null)[] = rawTree;
    const steps: AlgorithmStep[] = [];
    let diameter = 0;
    const visited = new Set<number>();

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0) {
      steps.push({ line: 2, explanation: 'Tree is empty. Diameter = 0.', variables: { diameter: 0 }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Find tree diameter. At each node, combine the two longest child paths.',
      variables: { root: tree[0], diameter: 0 },
      visualization: makeViz({ 0: 'active' }),
    });

    function dfs(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) return 0;
      visited.add(idx);

      const l = 2 * idx + 1, r = 2 * idx + 2;
      const leftH = dfs(l);
      const rightH = dfs(r);

      const top1 = Math.max(leftH, rightH);
      const top2 = Math.min(leftH, rightH);
      const pathThrough = top1 + top2;

      if (pathThrough > diameter) diameter = pathThrough;

      const highlights: Record<number, string> = {};
      visited.forEach(i => { highlights[i] = 'visited'; });
      highlights[idx] = 'active';

      steps.push({
        line: 8,
        explanation: `Node ${tree[idx]}: left height=${leftH}, right height=${rightH}. Path through=${pathThrough}. Diameter=${diameter}.`,
        variables: { node: tree[idx], leftH, rightH, pathThrough, diameter },
        visualization: makeViz(highlights),
      });

      return top1 + 1;
    }

    dfs(0);

    const finalHighlights: Record<number, string> = {};
    visited.forEach(i => { finalHighlights[i] = 'found'; });

    steps.push({
      line: 9,
      explanation: `Diameter computation complete. Tree diameter = ${diameter}.`,
      variables: { diameter },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default diameterOfNAryTree;
