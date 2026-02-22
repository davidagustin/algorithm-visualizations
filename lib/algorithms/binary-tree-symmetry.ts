import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const binaryTreeSymmetry: AlgorithmDefinition = {
  id: 'binary-tree-symmetry',
  title: 'Binary Tree Symmetry',
  leetcodeNumber: 101,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Check whether a binary tree is symmetric (a mirror of itself). We compare mirror positions recursively: the left subtree\'s left child must equal the right subtree\'s right child, and vice versa.',
  tags: ['Tree', 'Recursion', 'BFS'],
  code: {
    pseudocode: `function isSymmetric(root):
  if root is null: return true
  return isMirror(root.left, root.right)

function isMirror(left, right):
  if left is null and right is null: return true
  if left is null or right is null: return false
  if left.val != right.val: return false
  return isMirror(left.left, right.right)
     AND isMirror(left.right, right.left)`,
    python: `def isSymmetric(root):
    if not root:
        return True
    return isMirror(root.left, root.right)

def isMirror(left, right):
    if not left and not right:
        return True
    if not left or not right:
        return False
    if left.val != right.val:
        return False
    return (isMirror(left.left, right.right) and
            isMirror(left.right, right.left))`,
    javascript: `function isSymmetric(root) {
  if (!root) return true;
  return isMirror(root.left, root.right);
}
function isMirror(left, right) {
  if (!left && !right) return true;
  if (!left || !right) return false;
  if (left.val !== right.val) return false;
  return isMirror(left.left, right.right)
      && isMirror(left.right, right.left);
}`,
    java: `public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    return isMirror(root.left, root.right);
}
boolean isMirror(TreeNode left, TreeNode right) {
    if (left == null && right == null) return true;
    if (left == null || right == null) return false;
    if (left.val != right.val) return false;
    return isMirror(left.left, right.right)
        && isMirror(left.right, right.left);
}`,
  },
  defaultInput: { tree: [1, 2, 2, 3, 4, 4, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 2, 3, 4, 4, 3],
      placeholder: 'e.g. 1,2,2,3,4,4,3',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const matchedPairs = new Set<string>();

    function makeViz(leftIdx: number | null, rightIdx: number | null, status: 'comparing' | 'match' | 'mismatch'): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const key of matchedPairs) {
        const [a, b] = key.split(',').map(Number);
        if (a < tree.length && tree[a] != null) highlights[a] = 'found';
        if (b < tree.length && tree[b] != null) highlights[b] = 'found';
      }
      if (leftIdx !== null && leftIdx < tree.length && tree[leftIdx] != null) {
        highlights[leftIdx] = status;
      }
      if (rightIdx !== null && rightIdx < tree.length && tree[rightIdx] != null) {
        highlights[rightIdx] = status;
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty. An empty tree is symmetric.',
        variables: { result: true },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start symmetry check. Root = ${tree[0]}. Compare left and right subtrees as mirrors.`,
      variables: { root: tree[0] },
      visualization: { type: 'tree', nodes: tree.slice(), highlights: { 0: 'active' } },
    });

    function isMirror(leftIdx: number, rightIdx: number): boolean {
      const leftNull = leftIdx >= tree.length || tree[leftIdx] == null;
      const rightNull = rightIdx >= tree.length || tree[rightIdx] == null;

      if (leftNull && rightNull) {
        steps.push({
          line: 6,
          explanation: `Both nodes at indices ${leftIdx} and ${rightIdx} are null. Mirror match (base case).`,
          variables: { leftNode: null, rightNode: null, result: true },
          visualization: makeViz(null, null, 'match'),
        });
        return true;
      }

      if (leftNull || rightNull) {
        steps.push({
          line: 7,
          explanation: `One node is null and the other isn't (indices ${leftIdx}, ${rightIdx}). NOT symmetric.`,
          variables: { leftNode: leftNull ? null : tree[leftIdx], rightNode: rightNull ? null : tree[rightIdx], result: false },
          visualization: makeViz(leftNull ? null : leftIdx, rightNull ? null : rightIdx, 'mismatch'),
        });
        return false;
      }

      const leftVal = tree[leftIdx] as number;
      const rightVal = tree[rightIdx] as number;

      steps.push({
        line: 5,
        explanation: `Compare mirror pair: node ${leftVal} (index ${leftIdx}) vs node ${rightVal} (index ${rightIdx}).`,
        variables: { leftNode: leftVal, rightNode: rightVal },
        visualization: makeViz(leftIdx, rightIdx, 'comparing'),
      });

      if (leftVal !== rightVal) {
        steps.push({
          line: 8,
          explanation: `Values differ: ${leftVal} != ${rightVal}. NOT symmetric!`,
          variables: { leftNode: leftVal, rightNode: rightVal, result: false },
          visualization: makeViz(leftIdx, rightIdx, 'mismatch'),
        });
        return false;
      }

      matchedPairs.add(`${leftIdx},${rightIdx}`);

      steps.push({
        line: 8,
        explanation: `Values match: ${leftVal} == ${rightVal}. Now check their children as mirror pairs.`,
        variables: { leftNode: leftVal, rightNode: rightVal },
        visualization: makeViz(leftIdx, rightIdx, 'match'),
      });

      // Check outer pair: left.left vs right.right
      const outerResult = isMirror(2 * leftIdx + 1, 2 * rightIdx + 2);
      if (!outerResult) return false;

      // Check inner pair: left.right vs right.left
      const innerResult = isMirror(2 * leftIdx + 2, 2 * rightIdx + 1);
      return innerResult;
    }

    const result = isMirror(1, 2);

    steps.push({
      line: 1,
      explanation: result
        ? 'The tree IS symmetric! All mirror pairs match.'
        : 'The tree is NOT symmetric. A mirror pair did not match.',
      variables: { isSymmetric: result },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, result ? 'found' : 'visited']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default binaryTreeSymmetry;
