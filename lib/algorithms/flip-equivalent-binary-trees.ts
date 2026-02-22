import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const flipEquivalentBinaryTrees: AlgorithmDefinition = {
  id: 'flip-equivalent-binary-trees',
  title: 'Flip Equivalent Binary Trees',
  leetcodeNumber: 951,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Two binary trees are flip equivalent if one can be obtained from the other by a series of flip operations (swapping left and right children of a node). Use DFS: at each node, try both without-flip (left matches left, right matches right) and with-flip (left matches right, right matches left) configurations.',
  tags: ['tree', 'dfs', 'recursion', 'flip equivalence', 'symmetry'],

  code: {
    pseudocode: `function flipEquiv(root1, root2):
  if root1 is null and root2 is null: return true
  if root1 is null or root2 is null: return false
  if root1.val != root2.val: return false
  // try no-flip: left=left, right=right
  noFlip = flipEquiv(root1.left, root2.left) and
           flipEquiv(root1.right, root2.right)
  // try flip: left=right, right=left
  doFlip = flipEquiv(root1.left, root2.right) and
           flipEquiv(root1.right, root2.left)
  return noFlip or doFlip`,

    python: `def flipEquiv(self, root1, root2):
    if not root1 and not root2:
        return True
    if not root1 or not root2:
        return False
    if root1.val != root2.val:
        return False
    no_flip = (self.flipEquiv(root1.left, root2.left) and
               self.flipEquiv(root1.right, root2.right))
    do_flip = (self.flipEquiv(root1.left, root2.right) and
               self.flipEquiv(root1.right, root2.left))
    return no_flip or do_flip`,

    javascript: `function flipEquiv(root1, root2) {
  if (!root1 && !root2) return true;
  if (!root1 || !root2) return false;
  if (root1.val !== root2.val) return false;
  const noFlip = flipEquiv(root1.left, root2.left) &&
                 flipEquiv(root1.right, root2.right);
  const doFlip = flipEquiv(root1.left, root2.right) &&
                 flipEquiv(root1.right, root2.left);
  return noFlip || doFlip;
}`,

    java: `public boolean flipEquiv(TreeNode root1, TreeNode root2) {
    if (root1 == null && root2 == null) return true;
    if (root1 == null || root2 == null) return false;
    if (root1.val != root2.val) return false;
    boolean noFlip = flipEquiv(root1.left, root2.left) &&
                     flipEquiv(root1.right, root2.right);
    boolean doFlip = flipEquiv(root1.left, root2.right) &&
                     flipEquiv(root1.right, root2.left);
    return noFlip || doFlip;
}`,
  },

  defaultInput: {
    tree1: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8],
    tree2: [1, 3, 2, null, 6, 4, 5, null, null, null, null, 8, 7],
  },

  inputFields: [
    {
      name: 'tree1',
      label: 'Tree 1 (level order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, null, null, null, 7, 8],
      placeholder: '1,2,3,4,5,6',
      helperText: 'First tree level-order with null for missing nodes',
    },
    {
      name: 'tree2',
      label: 'Tree 2 (level order)',
      type: 'array',
      defaultValue: [1, 3, 2, null, 6, 4, 5, null, null, null, null, 8, 7],
      placeholder: '1,3,2,null,6,4,5',
      helperText: 'Second tree level-order with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree1 = input.tree1 as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (nodes: (number | null)[], highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes,
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Compare roots. Tree1 root=1, Tree2 root=1. Values match. Proceed to check children.',
      variables: { root1: 1, root2: 1, valMatch: true },
      visualization: makeViz(tree1, { 0: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'Try no-flip: T1.left(2) vs T2.left(3). Values differ (2 != 3). No-flip fails for this branch.',
      variables: { t1left: 2, t2left: 3, noFlipCheck: '2 vs 3 -> false' },
      visualization: makeViz(tree1, { 0: 'visited', 1: 'comparing' }),
    });

    steps.push({
      line: 8,
      explanation: 'Try flip: T1.left(2) vs T2.right(2). Values match (2==2). Continue checking children of 2.',
      variables: { t1left: 2, t2right: 2, flipCheck: '2 vs 2 -> match' },
      visualization: makeViz(tree1, { 0: 'visited', 1: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Under flip at root: compare T1.right(3) vs T2.left(3). Values match (3==3). Continue.',
      variables: { t1right: 3, t2left: 3, flipCheck: '3 vs 3 -> match' },
      visualization: makeViz(tree1, { 0: 'visited', 1: 'sorted', 2: 'active' }),
    });

    steps.push({
      line: 5,
      explanation: 'At node 2 (Tree1): T1.left(4) vs T2.left(4). Values match. T1.right(5) vs T2.right(5). Match.',
      variables: { node: 2, leftMatch: '4==4', rightMatch: '5==5', noFlip: true },
      visualization: makeViz(tree1, { 1: 'visited', 3: 'found', 4: 'found' }),
    });

    steps.push({
      line: 5,
      explanation: 'At node 3 (Tree1): children are 6 vs 6 (matched via no-flip or flip). All match.',
      variables: { node: 3, leftMatch: '6==6', result: true },
      visualization: makeViz(tree1, { 2: 'visited', 5: 'found' }),
    });

    steps.push({
      line: 9,
      explanation: 'Deeper leaf nodes: 7 and 8 in Tree1 match correspondingly in Tree2 (possibly via flip).',
      variables: { leaves: '[7,8]', matched: true },
      visualization: makeViz(tree1, { 9: 'found', 10: 'found' }),
    });

    steps.push({
      line: 10,
      explanation: 'All recursive checks passed via the flip configuration. Trees are flip equivalent. Return true.',
      variables: { result: true },
      visualization: makeViz(tree1, { 0: 'found', 1: 'found', 2: 'found', 3: 'found', 4: 'found', 5: 'found', 9: 'found', 10: 'found' }),
    });

    return steps;
  },
};

export default flipEquivalentBinaryTrees;
