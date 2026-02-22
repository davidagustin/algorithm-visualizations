import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const flipEquivalentBinaryTreesII: AlgorithmDefinition = {
  id: 'flip-equivalent-binary-trees-ii',
  title: 'Flip Equivalent Binary Trees II',
  leetcodeNumber: 951,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Two binary trees are flip equivalent if one can be transformed into the other by a series of flip operations (swapping left and right children at any node). Recursively check: either children match directly or are flipped.',
  tags: ['Tree', 'DFS', 'Recursion', 'Flip Equivalence'],
  code: {
    pseudocode: `function flipEquiv(root1, root2):
  if both null: return true
  if one null or values differ: return false
  // No flip at root: match left-left and right-right
  noFlip = flipEquiv(root1.left, root2.left) and
           flipEquiv(root1.right, root2.right)
  // Flip at root: match left-right and right-left
  flip = flipEquiv(root1.left, root2.right) and
         flipEquiv(root1.right, root2.left)
  return noFlip or flip`,
    python: `def flipEquiv(root1, root2):
    if not root1 and not root2: return True
    if not root1 or not root2 or root1.val != root2.val: return False
    no_flip = (flipEquiv(root1.left, root2.left) and
               flipEquiv(root1.right, root2.right))
    flip = (flipEquiv(root1.left, root2.right) and
            flipEquiv(root1.right, root2.left))
    return no_flip or flip`,
    javascript: `function flipEquiv(root1, root2) {
  if (!root1 && !root2) return true;
  if (!root1 || !root2 || root1.val !== root2.val) return false;
  const noFlip = flipEquiv(root1.left, root2.left) &&
                 flipEquiv(root1.right, root2.right);
  const flip = flipEquiv(root1.left, root2.right) &&
               flipEquiv(root1.right, root2.left);
  return noFlip || flip;
}`,
    java: `public boolean flipEquiv(TreeNode r1, TreeNode r2) {
    if (r1 == null && r2 == null) return true;
    if (r1 == null || r2 == null || r1.val != r2.val) return false;
    boolean noFlip = flipEquiv(r1.left, r2.left) && flipEquiv(r1.right, r2.right);
    boolean flip = flipEquiv(r1.left, r2.right) && flipEquiv(r1.right, r2.left);
    return noFlip || flip;
}`,
  },
  defaultInput: {
    tree1: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8],
    tree2: [1, 3, 2, null, 6, 4, 5, null, null, null, null, 8, 7],
  },
  inputFields: [
    {
      name: 'tree1',
      label: 'Tree 1 (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8],
      placeholder: 'e.g. 1,2,3,4,5,6',
    },
    {
      name: 'tree2',
      label: 'Tree 2 (level-order)',
      type: 'tree',
      defaultValue: [1, 3, 2, null, 6, 4, 5, null, null, null, null, 8, 7],
      placeholder: 'e.g. 1,3,2,null,6,4,5',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = (input.tree1 as (number | null)[]).slice();
    const tree2 = (input.tree2 as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Check if tree1 and tree2 are flip equivalent. At each node, try matching children directly or with a flip.`,
      variables: { tree1: tree1.filter(v => v != null), tree2: tree2.filter(v => v != null) },
      visualization: { type: 'tree', nodes: tree1.slice(), highlights: { 0: 'active' } },
    });

    function getVal(arr: (number | null)[], idx: number): number | null {
      return idx < arr.length ? arr[idx] : null;
    }

    let result = true;

    function check(idx1: number, idx2: number): boolean {
      const v1 = getVal(tree1, idx1);
      const v2 = getVal(tree2, idx2);

      if (v1 == null && v2 == null) return true;
      if (v1 == null || v2 == null || v1 !== v2) {
        steps.push({
          line: 3,
          explanation: `Mismatch at tree1[${idx1}]=${v1 ?? 'null'} vs tree2[${idx2}]=${v2 ?? 'null'}. NOT flip equivalent.`,
          variables: { t1: v1, t2: v2 },
          visualization: {
            type: 'tree',
            nodes: tree1.slice(),
            highlights: { ...(idx1 < tree1.length ? { [idx1]: 'swapping' } : {}) },
          },
        });
        return false;
      }

      steps.push({
        line: 5,
        explanation: `Both nodes = ${v1}. Try no-flip and flip combinations for children.`,
        variables: { node: v1, idx1, idx2 },
        visualization: {
          type: 'tree',
          nodes: tree1.slice(),
          highlights: { [idx1]: 'active' },
        },
      });

      const noFlip = check(2 * idx1 + 1, 2 * idx2 + 1) && check(2 * idx1 + 2, 2 * idx2 + 2);
      const flip = check(2 * idx1 + 1, 2 * idx2 + 2) && check(2 * idx1 + 2, 2 * idx2 + 1);
      return noFlip || flip;
    }

    result = check(0, 0);

    steps.push({
      line: 10,
      explanation: result ? 'Trees ARE flip equivalent!' : 'Trees are NOT flip equivalent.',
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: tree1.slice(),
        highlights: Object.fromEntries(tree1.map((_, i) => [i, result ? 'found' : 'swapping']).filter(([i]) => tree1[i as number] != null)),
      },
    });

    return steps;
  },
};

export default flipEquivalentBinaryTreesII;
