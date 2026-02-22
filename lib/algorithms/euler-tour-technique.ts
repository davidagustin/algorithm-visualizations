import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const eulerTourTechnique: AlgorithmDefinition = {
  id: 'euler-tour-technique',
  title: 'Euler Tour Technique',
  leetcodeNumber: undefined,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'The Euler Tour of a tree visits each node multiple times: once when entering and once after each child is processed. This "flattens" the tree into an array of length 2n-1. Key property: the subtree of node v corresponds to the contiguous range [tin[v], tout[v]] in the euler tour array. This enables O(1) subtree sum queries (with prefix sums) and O(log n) LCA queries.',
  tags: ['Tree', 'Dynamic Programming', 'Euler Tour', 'LCA'],
  code: {
    pseudocode: `function eulerTour(root):
  euler = []
  tin = {}   # entry time
  tout = {}  # exit time
  timer = 0

  function dfs(node, parent):
    tin[node] = timer
    euler.append(node)
    timer++
    for each child c (c != parent):
      dfs(c, node)
      euler.append(node)  # re-visit after child
      timer++
    tout[node] = timer - 1

  dfs(root, -1)
  return euler, tin, tout`,
    python: `def eulerTour(tree):
    euler = []; tin = {}; tout = {}; timer = [0]
    def dfs(idx, parent):
        if idx >= len(tree) or tree[idx] is None: return
        tin[idx] = timer[0]
        euler.append(tree[idx]); timer[0] += 1
        for child in [2*idx+1, 2*idx+2]:
            if child < len(tree) and tree[child] is not None:
                dfs(child, idx)
                euler.append(tree[idx]); timer[0] += 1
        tout[idx] = timer[0] - 1
    dfs(0, -1)
    return euler, tin, tout`,
    javascript: `function eulerTour(tree) {
  const euler = [], tin = {}, tout = {};
  let timer = 0;
  function dfs(idx, parent) {
    if (idx >= tree.length || tree[idx] == null) return;
    tin[idx] = timer; euler.push(tree[idx]); timer++;
    for (const c of [2*idx+1, 2*idx+2])
      if (c < tree.length && tree[c] != null) {
        dfs(c, idx); euler.push(tree[idx]); timer++;
      }
    tout[idx] = timer - 1;
  }
  dfs(0, -1);
  return { euler, tin, tout };
}`,
    java: `void eulerTour(Integer[] tree, List<Integer> euler, int[] tin, int[] tout) {
    int[] timer = {0};
    dfs(0, -1, tree, euler, tin, tout, timer);
}
void dfs(int idx, int p, Integer[] tree, List<Integer> euler, int[] tin, int[] tout, int[] timer) {
    if (idx >= tree.length || tree[idx] == null) return;
    tin[idx] = timer[0]; euler.add(tree[idx]); timer[0]++;
    for (int c : new int[]{2*idx+1, 2*idx+2})
        if (c < tree.length && tree[c] != null) { dfs(c,idx,tree,euler,tin,tout,timer); euler.add(tree[idx]); timer[0]++; }
    tout[idx] = timer[0]-1;
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
      helperText: 'Level-order tree. Euler tour visits each node multiple times.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const euler: number[] = [];
    const tin: Record<number, number> = {};
    const tout: Record<number, number> = {};
    let timer = 0;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Euler Tour Technique: DFS visits each node when entering and re-visits after each child returns. Produces an array where subtree(v) = euler[tin[v]..tout[v]].',
      variables: { euler: [], timer: 0 },
      visualization: makeViz(0),
    });

    function dfs(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      const val = tree[idx] as number;
      tin[idx] = timer;
      euler.push(val);
      timer++;

      steps.push({
        line: 7,
        explanation: `Enter node ${val} (index ${idx}): tin[${idx}]=${tin[idx]}. euler=[${euler.join(',')}].`,
        variables: { node: val, tin: tin[idx], euler: [...euler] },
        visualization: makeViz(idx, { [idx]: 'active' }),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      for (const childIdx of [leftIdx, rightIdx]) {
        if (childIdx < tree.length && tree[childIdx] != null) {
          dfs(childIdx);
          euler.push(val);
          timer++;

          steps.push({
            line: 9,
            explanation: `Return to node ${val} after child ${tree[childIdx]}. Re-visit ${val}. euler=[${euler.join(',')}].`,
            variables: { node: val, afterChild: tree[childIdx], euler: [...euler] },
            visualization: makeViz(idx, { [idx]: 'comparing', [childIdx]: 'visited' }),
          });
        }
      }

      tout[idx] = timer - 1;

      steps.push({
        line: 10,
        explanation: `Done with node ${val}: tout[${idx}]=${tout[idx]}. Subtree of ${val} covers euler[${tin[idx]}..${tout[idx]}].`,
        variables: { node: val, tin: tin[idx], tout: tout[idx], subtreeRange: `[${tin[idx]}, ${tout[idx]}]` },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });
    }

    dfs(0);

    steps.push({
      line: 12,
      explanation: `Euler tour complete! euler=[${euler.join(',')}]. Length=${euler.length}. Subtree queries now O(1) with prefix sums. LCA = minimum depth node in euler[tin[u]..tin[v]].`,
      variables: { euler, length: euler.length },
      visualization: makeViz(null, { 0: 'found' }),
    });

    return steps;
  },
};

export default eulerTourTechnique;
