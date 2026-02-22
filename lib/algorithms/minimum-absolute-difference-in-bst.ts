import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumAbsoluteDifferenceInBst: AlgorithmDefinition = {
  id: 'minimum-absolute-difference-in-bst',
  title: 'Minimum Absolute Difference in BST',
  leetcodeNumber: 530,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST, return the minimum absolute difference between the values of any two different nodes. Use inorder traversal which produces sorted values. The minimum difference is always between adjacent values in the sorted order.',
  tags: ['tree', 'BST', 'inorder', 'difference', 'sorted'],

  code: {
    pseudocode: `function getMinimumDifference(root):
  minDiff = infinity
  prevVal = null
  inorder(root):
    if prevVal is not null:
      minDiff = min(minDiff, node.val - prevVal)
    prevVal = node.val
  return minDiff`,

    python: `def getMinimumDifference(root):
    min_diff = float('inf')
    prev = [None]

    def inorder(node):
        if not node: return
        inorder(node.left)
        if prev[0] is not None:
            min_diff[0] = min(min_diff[0], node.val - prev[0])
        prev[0] = node.val
        inorder(node.right)

    min_diff = [float('inf')]
    inorder(root)
    return min_diff[0]`,

    javascript: `function getMinimumDifference(root) {
  let minDiff = Infinity, prev = null;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev !== null) minDiff = Math.min(minDiff, node.val - prev);
    prev = node.val;
    inorder(node.right);
  }
  inorder(root);
  return minDiff;
}`,

    java: `public int getMinimumDifference(TreeNode root) {
    int[] minDiff = {Integer.MAX_VALUE};
    int[] prev = {-1};
    inorder(root, prev, minDiff);
    return minDiff[0];
}
private void inorder(TreeNode node, int[] prev, int[] minDiff) {
    if (node == null) return;
    inorder(node.left, prev, minDiff);
    if (prev[0] != -1) minDiff[0] = Math.min(minDiff[0], node.val - prev[0]);
    prev[0] = node.val;
    inorder(node.right, prev, minDiff);
}`,
  },

  defaultInput: {
    tree: [4, 2, 6, 1, 3],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [4, 2, 6, 1, 3],
      placeholder: '4,2,6,1,3',
      helperText: 'Level-order representation of the BST',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find minimum absolute difference in BST: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Inorder gives sorted values; min diff is between adjacent sorted values.`,
      variables: { minDiff: 'Infinity', prevVal: null },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    let minDiff = Infinity;
    let prevVal: number | null = null;
    let prevPos: number | null = null;
    const visitOrder: number[] = [];

    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);

      const val = tree[pos] as number;
      visitOrder.push(pos);

      if (prevVal !== null) {
        const diff = val - prevVal;
        const improved = diff < minDiff;
        if (improved) minDiff = diff;

        steps.push({
          line: 4,
          explanation: `Compare ${val} and previous value ${prevVal}. Difference = ${diff}. ${improved ? `New minimum! minDiff = ${diff}.` : `minDiff stays at ${minDiff}.`}`,
          variables: { val, prevVal, diff, minDiff },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, 'visited'])),
              ...(prevPos !== null ? { [prevPos]: 'comparing' } : {}),
              [pos]: improved ? 'found' : 'active',
            },
          },
        });
      } else {
        steps.push({
          line: 3,
          explanation: `First inorder node: ${val}. No previous value yet, set prevVal = ${val}.`,
          variables: { val, prevVal: null, minDiff: 'Infinity' },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: { [pos]: 'active' },
          },
        });
      }

      prevPos = pos;
      prevVal = val;
      inorder(2 * pos + 2);
    }

    inorder(0);

    steps.push({
      line: 6,
      explanation: `Minimum absolute difference = ${minDiff}.`,
      variables: { result: minDiff },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(visitOrder.map(p => [p, 'found'])),
      },
    });

    return steps;
  },
};

export default minimumAbsoluteDifferenceInBst;
