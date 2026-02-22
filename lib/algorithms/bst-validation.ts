import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const bstValidation: AlgorithmDefinition = {
  id: 'bst-validation',
  title: 'BST Validation',
  leetcodeNumber: 98,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST has every left descendant strictly less than the node and every right descendant strictly greater. We perform DFS passing along min/max constraints to each subtree.',
  tags: ['Tree', 'BST', 'DFS'],
  code: {
    pseudocode: `function isValidBST(root):
  return validate(root, -infinity, +infinity)

function validate(node, min, max):
  if node is null: return true
  if node.val <= min or node.val >= max:
    return false
  return validate(node.left, min, node.val)
     AND validate(node.right, node.val, max)`,
    python: `def isValidBST(root):
    return validate(root, float('-inf'), float('inf'))

def validate(node, min_val, max_val):
    if not node:
        return True
    if node.val <= min_val or node.val >= max_val:
        return False
    return (validate(node.left, min_val, node.val) and
            validate(node.right, node.val, max_val))`,
    javascript: `function isValidBST(root) {
  return validate(root, -Infinity, Infinity);
}
function validate(node, min, max) {
  if (node === null) return true;
  if (node.val <= min || node.val >= max) return false;
  return validate(node.left, min, node.val)
      && validate(node.right, node.val, max);
}`,
    java: `public boolean isValidBST(TreeNode root) {
    return validate(root, Long.MIN_VALUE, Long.MAX_VALUE);
}
boolean validate(TreeNode node, long min, long max) {
    if (node == null) return true;
    if (node.val <= min || node.val >= max) return false;
    return validate(node.left, min, node.val)
        && validate(node.right, node.val, max);
}`,
  },
  defaultInput: { tree: [5, 1, 7, null, null, 3, 8] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [5, 1, 7, null, null, 3, 8],
      placeholder: 'e.g. 5,1,7,null,null,3,8',
      helperText: 'Level-order. This default is invalid: 3 < 5 but is in right subtree.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const validated = new Set<number>();

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of validated) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'found';
        }
      }
      for (const [k, v] of Object.entries(extra)) {
        highlights[Number(k)] = v;
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 4,
        explanation: 'The tree is empty. An empty tree is a valid BST.',
        variables: { result: true },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Start BST validation. Root = ${tree[0]}. Each node must be within a valid (min, max) range.`,
      variables: { root: tree[0], min: '-inf', max: '+inf' },
      visualization: makeViz(0),
    });

    function formatBound(v: number): string {
      if (v === -Infinity) return '-inf';
      if (v === Infinity) return '+inf';
      return String(v);
    }

    function validate(idx: number, min: number, max: number): boolean {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 4,
          explanation: `Node at index ${idx} is null. Valid (base case).`,
          variables: { node: null },
          visualization: makeViz(null),
        });
        return true;
      }

      const val = tree[idx] as number;

      steps.push({
        line: 5,
        explanation: `Check node ${val} (index ${idx}). Valid range: (${formatBound(min)}, ${formatBound(max)}). Is ${formatBound(min)} < ${val} < ${formatBound(max)}?`,
        variables: { node: val, min: formatBound(min), max: formatBound(max) },
        visualization: makeViz(idx),
      });

      if (val <= min || val >= max) {
        steps.push({
          line: 6,
          explanation: `INVALID! Node ${val} violates BST property: ${val} is NOT in range (${formatBound(min)}, ${formatBound(max)}). Return false.`,
          variables: { node: val, min: formatBound(min), max: formatBound(max), valid: false },
          visualization: makeViz(null, { [idx]: 'mismatch' }),
        });
        return false;
      }

      steps.push({
        line: 7,
        explanation: `Node ${val} is within range (${formatBound(min)}, ${formatBound(max)}). Check left subtree with range (${formatBound(min)}, ${val}).`,
        variables: { node: val, leftRange: `(${formatBound(min)}, ${val})` },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      if (!validate(leftIdx, min, val)) {
        return false;
      }

      steps.push({
        line: 8,
        explanation: `Left subtree of node ${val} is valid. Check right subtree with range (${val}, ${formatBound(max)}).`,
        variables: { node: val, rightRange: `(${val}, ${formatBound(max)})` },
        visualization: makeViz(idx),
      });

      if (!validate(rightIdx, val, max)) {
        return false;
      }

      validated.add(idx);

      steps.push({
        line: 8,
        explanation: `Both subtrees of node ${val} are valid. Node ${val} passes BST validation.`,
        variables: { node: val, valid: true },
        visualization: makeViz(null, { [idx]: 'found' }),
      });

      return true;
    }

    const isValid = validate(0, -Infinity, Infinity);

    steps.push({
      line: 1,
      explanation: isValid
        ? 'The tree IS a valid BST. All nodes satisfy the BST property.'
        : 'The tree is NOT a valid BST. A node violated the range constraint.',
      variables: { isValidBST: isValid },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, isValid ? 'found' : 'visited']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default bstValidation;
