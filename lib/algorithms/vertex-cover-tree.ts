import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const vertexCoverTree: AlgorithmDefinition = {
  id: 'vertex-cover-tree',
  title: 'Minimum Vertex Cover on Tree',
  leetcodeNumber: undefined,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A vertex cover is a set of vertices such that every edge has at least one endpoint in the set. Find the minimum vertex cover on a tree. Tree DP: dp[v][0] = min cover of subtree v where v is NOT in cover; dp[v][1] = min cover where v IS in cover. Transition: if v not in cover, all children must be in cover. If v in cover, each child can be in or not.',
  tags: ['Tree', 'Dynamic Programming', 'DFS', 'Graph Theory'],
  code: {
    pseudocode: `function minVertexCover(root):
  function dfs(node) -> (not_covered, covered):
    if null: return (0, 0)
    (lnc, lc) = dfs(left)
    (rnc, rc) = dfs(right)
    # v NOT in cover: all children must be in cover
    not_covered = lc + rc
    # v IN cover: each child takes min of its two states
    covered = 1 + min(lnc,lc) + min(rnc,rc)
    return (not_covered, covered)
  nc, c = dfs(root)
  return min(nc, c)`,
    python: `def minVertexCover(root):
    def dfs(idx):
        if idx >= len(tree) or tree[idx] is None:
            return (0, 0)
        lnc, lc = dfs(2*idx+1)
        rnc, rc = dfs(2*idx+2)
        not_cov = lc + rc
        cov = 1 + min(lnc, lc) + min(rnc, rc)
        return (not_cov, cov)
    nc, c = dfs(0)
    return min(nc, c)`,
    javascript: `function minVertexCover(tree) {
  function dfs(idx) {
    if (idx >= tree.length || tree[idx] == null) return [0, 0];
    const [lnc, lc] = dfs(2*idx+1), [rnc, rc] = dfs(2*idx+2);
    return [lc + rc, 1 + Math.min(lnc,lc) + Math.min(rnc,rc)];
  }
  return Math.min(...dfs(0));
}`,
    java: `int minVertexCover(Integer[] tree) {
    int[] res = dfs(tree, 0);
    return Math.min(res[0], res[1]);
}
int[] dfs(Integer[] tree, int idx) {
    if (idx >= tree.length || tree[idx] == null) return new int[]{0, 0};
    int[] l = dfs(tree, 2*idx+1), r = dfs(tree, 2*idx+2);
    return new int[]{l[1]+r[1], 1+Math.min(l[0],l[1])+Math.min(r[0],r[1])};
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
      helperText: 'Level-order tree. Find minimum set of nodes covering all edges.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const coverSet = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = { ...extra };
      for (const idx of coverSet) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'found';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: 'Minimum Vertex Cover on Tree: dp[v] = (not_covered_cost, covered_cost). If v not in cover, all children must be. If v in cover, each child takes its minimum.',
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
        explanation: `Visit node ${val} at index ${idx}. Recurse left and right.`,
        variables: { node: val, index: idx },
        visualization: makeViz(idx),
      });

      const [lnc, lc] = dfs(leftIdx);
      const [rnc, rc] = dfs(rightIdx);

      const notCov = lc + rc;
      const cov = 1 + Math.min(lnc, lc) + Math.min(rnc, rc);

      steps.push({
        line: 8,
        explanation: `Node ${val}: if NOT covered: children must be covered = ${notCov}. If IN cover: 1 + min(${lnc},${lc}) + min(${rnc},${rc}) = ${cov}.`,
        variables: { node: val, notCovered: notCov, covered: cov },
        visualization: makeViz(idx, { [idx]: cov < notCov ? 'found' : 'visited' }),
      });

      if (cov <= notCov) coverSet.add(idx);

      return [notCov, cov];
    }

    const [nc, c] = dfs(0);
    const answer = Math.min(nc, c);

    steps.push({
      line: 10,
      explanation: `Minimum vertex cover size = min(${nc}, ${c}) = ${answer}. Highlighted nodes form the cover.`,
      variables: { answer, notCoveredRoot: nc, coveredRoot: c },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default vertexCoverTree;
