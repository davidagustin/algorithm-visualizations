import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const sameTree: AlgorithmDefinition = {
  id: 'same-tree',
  title: 'Same Tree',
  leetcodeNumber: 100,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value. We recursively compare each corresponding pair of nodes.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function isSameTree(p, q):
  if p is null and q is null: return true
  if p is null or q is null: return false
  if p.val != q.val: return false
  return isSameTree(p.left, q.left) and
         isSameTree(p.right, q.right)`,
    python: `def isSameTree(p, q):
    if not p and not q:
        return True
    if not p or not q:
        return False
    if p.val != q.val:
        return False
    return (isSameTree(p.left, q.left) and
            isSameTree(p.right, q.right))`,
    javascript: `function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  if (p.val !== q.val) return false;
  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    java: `public boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    if (p.val != q.val) return false;
    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
  },
  defaultInput: { treeP: [1, 2, 3], treeQ: [1, 2, 3] },
  inputFields: [
    {
      name: 'treeP',
      label: 'Tree P (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3],
      placeholder: 'e.g. 1,2,3',
      helperText: 'First binary tree. Use null for missing nodes.',
    },
    {
      name: 'treeQ',
      label: 'Tree Q (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3],
      placeholder: 'e.g. 1,2,4',
      helperText: 'Second binary tree. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const treeP = (input.treeP as (number | null)[]).slice();
    const treeQ = (input.treeQ as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visitedP = new Set<number>();

    // We visualize tree P; annotate with match/mismatch
    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visitedP) {
        if (idx < treeP.length && treeP[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < treeP.length && treeP[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: treeP.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Check if two binary trees are identical. Compare node by node using DFS.`,
      variables: { treeP: treeP.filter(v => v != null), treeQ: treeQ.filter(v => v != null) },
      visualization: makeViz(0),
    });

    function dfs(pIdx: number, qIdx: number): boolean {
      const pNull = pIdx >= treeP.length || treeP[pIdx] == null;
      const qNull = qIdx >= treeQ.length || treeQ[qIdx] == null;

      if (pNull && qNull) {
        steps.push({
          line: 2,
          explanation: `Both nodes are null. They match. Return true.`,
          variables: { p: null, q: null, match: true },
          visualization: makeViz(null),
        });
        return true;
      }

      if (pNull || qNull) {
        steps.push({
          line: 3,
          explanation: `One node is null, other is not. Trees differ in structure! Return false.`,
          variables: { p: pNull ? null : treeP[pIdx], q: qNull ? null : treeQ[qIdx], match: false },
          visualization: makeViz(pNull ? null : pIdx, pNull ? {} : { [pIdx]: 'mismatch' }),
        });
        return false;
      }

      const pVal = treeP[pIdx] as number;
      const qVal = treeQ[qIdx] as number;
      visitedP.add(pIdx);

      steps.push({
        line: 4,
        explanation: `Compare p=${pVal} with q=${qVal}. ${pVal === qVal ? 'Values match!' : 'Values differ!'}`,
        variables: { p: pVal, q: qVal, match: pVal === qVal },
        visualization: makeViz(pIdx, { [pIdx]: pVal === qVal ? 'comparing' : 'mismatch' }),
      });

      if (pVal !== qVal) {
        steps.push({
          line: 4,
          explanation: `p.val (${pVal}) != q.val (${qVal}). Trees are different. Return false.`,
          variables: { p: pVal, q: qVal, match: false },
          visualization: makeViz(null, { [pIdx]: 'mismatch' }),
        });
        return false;
      }

      steps.push({
        line: 5,
        explanation: `Values match (${pVal}). Now compare left children.`,
        variables: { node: pVal },
        visualization: makeViz(pIdx, { [pIdx]: 'match' }),
      });

      const leftMatch = dfs(2 * pIdx + 1, 2 * qIdx + 1);
      if (!leftMatch) return false;

      steps.push({
        line: 6,
        explanation: `Left subtrees match. Now compare right children of node ${pVal}.`,
        variables: { node: pVal },
        visualization: makeViz(pIdx),
      });

      const rightMatch = dfs(2 * pIdx + 2, 2 * qIdx + 2);
      return rightMatch;
    }

    const result = dfs(0, 0);

    steps.push({
      line: 6,
      explanation: `Trees are ${result ? 'identical' : 'different'}!`,
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: treeP.slice(),
        highlights: Object.fromEntries(
          treeP.map((_, i) => [i, result ? 'found' : 'visited']).filter(([i]) => treeP[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default sameTree;
