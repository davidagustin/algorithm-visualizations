import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const mergeTwoBinaryTreesII: AlgorithmDefinition = {
  id: 'merge-two-binary-trees-ii',
  title: 'Merge Two Binary Trees II',
  leetcodeNumber: 617,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Merge two binary trees by overlapping them. When two nodes overlap, sum their values. If only one node exists at a position, use that node. Recursively merge left and right subtrees.',
  tags: ['Tree', 'DFS', 'Recursion', 'Merge'],
  code: {
    pseudocode: `function mergeTrees(t1, t2):
  if t1 is null: return t2
  if t2 is null: return t1
  t1.val += t2.val
  t1.left = mergeTrees(t1.left, t2.left)
  t1.right = mergeTrees(t1.right, t2.right)
  return t1`,
    python: `def mergeTrees(t1, t2):
    if not t1: return t2
    if not t2: return t1
    t1.val += t2.val
    t1.left = mergeTrees(t1.left, t2.left)
    t1.right = mergeTrees(t1.right, t2.right)
    return t1`,
    javascript: `function mergeTrees(t1, t2) {
  if (!t1) return t2;
  if (!t2) return t1;
  t1.val += t2.val;
  t1.left = mergeTrees(t1.left, t2.left);
  t1.right = mergeTrees(t1.right, t2.right);
  return t1;
}`,
    java: `public TreeNode mergeTrees(TreeNode t1, TreeNode t2) {
    if (t1 == null) return t2;
    if (t2 == null) return t1;
    t1.val += t2.val;
    t1.left = mergeTrees(t1.left, t2.left);
    t1.right = mergeTrees(t1.right, t2.right);
    return t1;
}`,
  },
  defaultInput: {
    tree1: [1, 3, 2, 5],
    tree2: [2, 1, 3, null, 4, null, 7],
  },
  inputFields: [
    {
      name: 'tree1',
      label: 'Tree 1 (level-order)',
      type: 'tree',
      defaultValue: [1, 3, 2, 5],
      placeholder: 'e.g. 1,3,2,5',
    },
    {
      name: 'tree2',
      label: 'Tree 2 (level-order)',
      type: 'tree',
      defaultValue: [2, 1, 3, null, 4, null, 7],
      placeholder: 'e.g. 2,1,3,null,4,null,7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = (input.tree1 as (number | null)[]).slice();
    const tree2 = (input.tree2 as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const merged: (number | null)[] = [];

    function ensureSize(idx: number): void {
      while (merged.length <= idx) merged.push(null);
    }

    function makeViz(activeIdx: number | null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < merged.length; i++) {
        if (merged[i] != null) highlights[i] = 'visited';
      }
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'tree', nodes: merged.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Merge tree1 [${tree1.filter(v => v != null).join(',')}] and tree2 [${tree2.filter(v => v != null).join(',')}].`,
      variables: { tree1: tree1.filter(v => v != null), tree2: tree2.filter(v => v != null) },
      visualization: { type: 'tree', nodes: [], highlights: {} },
    });

    function merge(idx: number): void {
      const v1 = idx < tree1.length ? tree1[idx] : null;
      const v2 = idx < tree2.length ? tree2[idx] : null;

      if (v1 == null && v2 == null) return;

      ensureSize(idx);
      if (v1 == null) {
        merged[idx] = v2;
        steps.push({
          line: 2,
          explanation: `Only tree2 has node ${v2} at index ${idx}. Use ${v2}.`,
          variables: { t1: null, t2: v2, merged: v2 },
          visualization: makeViz(idx),
        });
      } else if (v2 == null) {
        merged[idx] = v1;
        steps.push({
          line: 3,
          explanation: `Only tree1 has node ${v1} at index ${idx}. Use ${v1}.`,
          variables: { t1: v1, t2: null, merged: v1 },
          visualization: makeViz(idx),
        });
      } else {
        merged[idx] = (v1 as number) + (v2 as number);
        steps.push({
          line: 4,
          explanation: `Both trees have nodes at index ${idx}: ${v1} + ${v2} = ${merged[idx]}.`,
          variables: { t1: v1, t2: v2, sum: merged[idx] },
          visualization: makeViz(idx),
        });
      }

      merge(2 * idx + 1);
      merge(2 * idx + 2);
    }

    merge(0);

    steps.push({
      line: 7,
      explanation: 'Merge complete!',
      variables: { result: merged.filter(v => v != null) },
      visualization: {
        type: 'tree',
        nodes: merged.slice(),
        highlights: Object.fromEntries(merged.map((_, i) => [i, 'found']).filter(([i]) => merged[i as number] != null)),
      },
    });

    return steps;
  },
};

export default mergeTwoBinaryTreesII;
