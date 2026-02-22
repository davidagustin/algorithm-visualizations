import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const constructStringFromBinaryTree: AlgorithmDefinition = {
  id: 'construct-string-from-binary-tree',
  title: 'Construct String from Binary Tree',
  leetcodeNumber: 606,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, construct a string with parentheses representing the tree. Use preorder traversal. Omit empty parentheses pairs that do not affect the one-to-one mapping. If a node has no right child but has a left child, include the left parentheses. If a node has no left child but has a right child, include empty left parentheses.',
  tags: ['tree', 'preorder', 'string', 'recursion', 'parentheses'],

  code: {
    pseudocode: `function tree2str(root):
  if root is null: return ""
  result = str(root.val)
  if root.left or root.right:
    result += "(" + tree2str(root.left) + ")"
  if root.right:
    result += "(" + tree2str(root.right) + ")"
  return result`,

    python: `def tree2str(root):
    if not root:
        return ""
    res = str(root.val)
    if root.left or root.right:
        res += "(" + tree2str(root.left) + ")"
    if root.right:
        res += "(" + tree2str(root.right) + ")"
    return res`,

    javascript: `function tree2str(root) {
  if (!root) return "";
  let res = String(root.val);
  if (root.left || root.right) {
    res += "(" + tree2str(root.left) + ")";
  }
  if (root.right) {
    res += "(" + tree2str(root.right) + ")";
  }
  return res;
}`,

    java: `public String tree2str(TreeNode root) {
    if (root == null) return "";
    String res = String.valueOf(root.val);
    if (root.left != null || root.right != null) {
        res += "(" + tree2str(root.left) + ")";
    }
    if (root.right != null) {
        res += "(" + tree2str(root.right) + ")";
    }
    return res;
}`,
  },

  defaultInput: {
    tree: [1, 2, 3, 4],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Build parenthesized string from tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Use preorder traversal.`,
      variables: { result: '' },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    const visitOrder: number[] = [];

    function tree2str(pos: number): string {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return '';

      const val = tree[pos] as number;
      const leftPos = 2 * pos + 1;
      const rightPos = 2 * pos + 2;
      const hasLeft = leftPos < tree.length && tree[leftPos] !== null && tree[leftPos] !== undefined;
      const hasRight = rightPos < tree.length && tree[rightPos] !== null && tree[rightPos] !== undefined;

      visitOrder.push(pos);

      steps.push({
        line: 3,
        explanation: `At node ${val}. hasLeft=${hasLeft}, hasRight=${hasRight}. Start building string fragment.`,
        variables: { val, hasLeft, hasRight },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, 'visited'])),
            [pos]: 'active',
          },
        },
      });

      let res = String(val);

      if (hasLeft || hasRight) {
        const leftStr = tree2str(leftPos);
        res += '(' + leftStr + ')';
        steps.push({
          line: 4,
          explanation: `Added left child subtree "(${leftStr})". Current string: "${res}".`,
          variables: { val, currentResult: res, leftStr },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visitOrder.map(p => [p, 'visited'])),
              [pos]: 'active',
            },
          },
        });
      }

      if (hasRight) {
        const rightStr = tree2str(rightPos);
        res += '(' + rightStr + ')';
        steps.push({
          line: 6,
          explanation: `Added right child subtree "(${rightStr})". Current string: "${res}".`,
          variables: { val, currentResult: res },
          visualization: {
            type: 'tree',
            nodes: [...tree] as number[],
            highlights: {
              ...Object.fromEntries(visitOrder.map(p => [p, 'visited'])),
              [pos]: 'found',
            },
          },
        });
      }

      return res;
    }

    const result = tree2str(0);

    steps.push({
      line: 7,
      explanation: `String construction complete. Result: "${result}".`,
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(visitOrder.map(p => [p, 'found'])),
      },
    });

    return steps;
  },
};

export default constructStringFromBinaryTree;
