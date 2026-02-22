import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const balancedBinaryTreeValidation: AlgorithmDefinition = {
  id: 'balanced-binary-tree-validation',
  title: 'Balanced Binary Tree Validation',
  leetcodeNumber: 110,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is one in which the depth of the two subtrees of every node never differs by more than one. We use a bottom-up DFS approach that returns the height at each node and checks the balance condition.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function isBalanced(root):
  return checkHeight(root) != -1

function checkHeight(node):
  if node is null:
    return 0
  leftHeight = checkHeight(node.left)
  if leftHeight == -1: return -1
  rightHeight = checkHeight(node.right)
  if rightHeight == -1: return -1
  if abs(leftHeight - rightHeight) > 1:
    return -1
  return max(leftHeight, rightHeight) + 1`,
    python: `def isBalanced(root):
    return checkHeight(root) != -1

def checkHeight(node):
    if not node:
        return 0
    left = checkHeight(node.left)
    if left == -1:
        return -1
    right = checkHeight(node.right)
    if right == -1:
        return -1
    if abs(left - right) > 1:
        return -1
    return max(left, right) + 1`,
    javascript: `function isBalanced(root) {
  return checkHeight(root) !== -1;
}
function checkHeight(node) {
  if (node === null) return 0;
  const left = checkHeight(node.left);
  if (left === -1) return -1;
  const right = checkHeight(node.right);
  if (right === -1) return -1;
  if (Math.abs(left - right) > 1) return -1;
  return Math.max(left, right) + 1;
}`,
    java: `public boolean isBalanced(TreeNode root) {
    return checkHeight(root) != -1;
}
int checkHeight(TreeNode node) {
    if (node == null) return 0;
    int left = checkHeight(node.left);
    if (left == -1) return -1;
    int right = checkHeight(node.right);
    if (right == -1) return -1;
    if (Math.abs(left - right) > 1) return -1;
    return Math.max(left, right) + 1;
}`,
  },
  defaultInput: { tree: [3, 9, 20, null, null, 15, 7] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 9, 20, null, null, 15, 7],
      placeholder: 'e.g. 3,9,20,null,null,15,7',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const heights: Record<number, number> = {};

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'visited';
        }
      }
      for (const [k, v] of Object.entries(extra)) {
        highlights[Number(k)] = v;
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights, depthValues: { ...heights } };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 4,
        explanation: 'The tree is empty. An empty tree is balanced with height 0.',
        variables: { result: true, height: 0 },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start isBalanced check. We will use bottom-up DFS, computing heights and checking balance at each node.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function checkHeight(idx: number): number {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 4,
          explanation: `Node at index ${idx} is null. Return height 0 (base case).`,
          variables: { node: null, height: 0 },
          visualization: makeViz(null),
        });
        return 0;
      }

      steps.push({
        line: 3,
        explanation: `Visit node ${tree[idx]} (index ${idx}). Compute left subtree height first.`,
        variables: { node: tree[idx], index: idx },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const leftHeight = checkHeight(leftIdx);

      if (leftHeight === -1) {
        return -1;
      }

      steps.push({
        line: 8,
        explanation: `Back at node ${tree[idx]}. Left subtree height = ${leftHeight}. Now compute right subtree height.`,
        variables: { node: tree[idx], leftHeight },
        visualization: makeViz(idx),
      });

      const rightHeight = checkHeight(rightIdx);

      if (rightHeight === -1) {
        return -1;
      }

      const diff = Math.abs(leftHeight - rightHeight);
      if (diff > 1) {
        steps.push({
          line: 10,
          explanation: `Node ${tree[idx]}: leftHeight=${leftHeight}, rightHeight=${rightHeight}, diff=${diff} > 1. UNBALANCED! Return -1.`,
          variables: { node: tree[idx], leftHeight, rightHeight, diff, balanced: false },
          visualization: makeViz(idx, { [idx]: 'mismatch' }),
        });
        visited.add(idx);
        return -1;
      }

      const h = Math.max(leftHeight, rightHeight) + 1;
      heights[idx] = h;
      visited.add(idx);

      steps.push({
        line: 12,
        explanation: `Node ${tree[idx]}: leftHeight=${leftHeight}, rightHeight=${rightHeight}, diff=${diff} <= 1. Balanced here. Height = ${h}.`,
        variables: { node: tree[idx], leftHeight, rightHeight, height: h, balanced: true },
        visualization: makeViz(idx, { [idx]: 'found' }),
      });

      return h;
    }

    const result = checkHeight(0);
    const isBalanced = result !== -1;

    steps.push({
      line: 1,
      explanation: isBalanced
        ? `Tree is balanced! Every node has subtree height difference <= 1. Overall height = ${result}.`
        : `Tree is NOT balanced. At least one node has subtree height difference > 1.`,
      variables: { isBalanced, finalHeight: result },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, isBalanced ? 'found' : 'visited']).filter(([i]) => tree[i as number] != null)
        ),
        depthValues: heights,
      },
    });

    return steps;
  },
};

export default balancedBinaryTreeValidation;
