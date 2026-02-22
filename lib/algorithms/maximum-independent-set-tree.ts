import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const maximumIndependentSetTree: AlgorithmDefinition = {
  id: 'maximum-independent-set-tree',
  title: 'Maximum Independent Set on Tree',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'An independent set is a set of vertices with no two adjacent. Find the maximum independent set on a tree. Tree DP: dp[v][0] = max IS size in subtree of v when v is NOT selected; dp[v][1] = max IS size when v IS selected. Transition: if v selected, no children can be selected. If v not selected, each child can be selected or not.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Independent Set'],
  code: {
    pseudocode: `function maxIndependentSet(root):
  function dfs(node) -> (not_selected, selected):
    if null: return (0, 0)
    (lns, ls) = dfs(left)
    (rns, rs) = dfs(right)
    # v selected: children must NOT be selected
    selected = 1 + lns + rns
    # v not selected: children can be either
    not_selected = max(lns,ls) + max(rns,rs)
    return (not_selected, selected)
  ns, s = dfs(root)
  return max(ns, s)`,
    python: `def maxIndependentSet(tree):
    def dfs(idx):
        if idx >= len(tree) or tree[idx] is None:
            return (0, 0)
        lns, ls = dfs(2*idx+1)
        rns, rs = dfs(2*idx+2)
        selected = 1 + lns + rns
        not_sel = max(lns, ls) + max(rns, rs)
        return (not_sel, selected)
    ns, s = dfs(0)
    return max(ns, s)`,
    javascript: `function maxIndependentSet(tree) {
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] == null) return [0, 0];
    const [lns, ls] = dfs(2*idx+1), [rns, rs] = dfs(2*idx+2);
    return [Math.max(lns,ls)+Math.max(rns,rs), 1+lns+rns];
  }
  return Math.max(...dfs(0));
}`,
    java: `int maxIS(Integer[] tree) {
    int[] r = dfs(tree, 0);
    return Math.max(r[0], r[1]);
}
int[] dfs(Integer[] tree, int idx) {
    if (idx >= tree.length || tree[idx] == null) return new int[]{0,0};
    int[] l = dfs(tree,2*idx+1), r = dfs(tree,2*idx+2);
    return new int[]{Math.max(l[0],l[1])+Math.max(r[0],r[1]), 1+l[0]+r[0]};
}`,
  },
  defaultInput: { tree: [1, 2, 3, 4, 5, 6, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: 'e.g. 1,2,3,4,5,6,7',
      helperText: 'Level-order tree. Find max set of non-adjacent nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const selectedSet = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      for (const idx of selectedSet) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'found';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Maximum Independent Set on Tree: dp[v] = (not_selected_max, selected_max). If v selected, children cannot be. If v not selected, each child takes its maximum.',
      variables: {},
      visualization: makeViz(0),
    });

    function dfs(idx: number): [number, number] {
      if (idx >= tree.length || tree[idx] == null) return [0, 0];

      const val = tree[idx];
      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      steps.push({
        line: 3,
        explanation: `Visit node ${val} at index ${idx}. Computing max IS for subtree.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const [lns, ls] = dfs(leftIdx);
      const [rns, rs] = dfs(rightIdx);

      const selected = 1 + lns + rns;
      const notSelected = Math.max(lns, ls) + Math.max(rns, rs);

      steps.push({
        line: 8,
        explanation: `Node ${val}: selected = 1 + ${lns} + ${rns} = ${selected}. Not selected = max(${lns},${ls}) + max(${rns},${rs}) = ${notSelected}. Pick ${selected >= notSelected ? 'selected' : 'not selected'}.`,
        variables: { node: val, selected, notSelected },
        visualization: makeViz(idx, { [idx]: selected >= notSelected ? 'found' : 'visited' }),
      });

      if (selected >= notSelected) selectedSet.add(idx);

      return [notSelected, selected];
    }

    const [ns, s] = dfs(0);
    const answer = Math.max(ns, s);

    steps.push({
      line: 11,
      explanation: `Maximum Independent Set size = max(${ns}, ${s}) = ${answer}. Highlighted nodes form the independent set.`,
      variables: { answer, notSelected: ns, selected: s },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default maximumIndependentSetTree;
