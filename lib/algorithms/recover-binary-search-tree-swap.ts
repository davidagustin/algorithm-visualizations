import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const recoverBinarySearchTreeSwap: AlgorithmDefinition = {
  id: 'recover-binary-search-tree-swap',
  title: 'Recover Binary Search Tree',
  leetcodeNumber: 99,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Two nodes in a BST are swapped by mistake. Recover the tree without changing its structure. Use in-order traversal (which should yield sorted values for a valid BST). Find the two nodes that are out of order: the first is where we see a descent (prev > current), the second is the current node at the second descent. Swap their values to fix the BST.',
  tags: ['tree', 'dfs', 'inorder', 'bst'],

  code: {
    pseudocode: `function recoverTree(root):
  first = null
  second = null
  prev = null

  function inorder(node):
    if node is null: return
    inorder(node.left)
    if prev is not null and prev.val > node.val:
      if first is null:
        first = prev  # first wrong node
      second = node   # second wrong node (updated on each violation)
    prev = node
    inorder(node.right)

  inorder(root)
  swap(first.val, second.val)`,
    python: `def recoverTree(root):
    first = second = prev = None
    def inorder(node):
        nonlocal first, second, prev
        if not node: return
        inorder(node.left)
        if prev and prev.val > node.val:
            if not first: first = prev
            second = node
        prev = node
        inorder(node.right)
    inorder(root)
    first.val, second.val = second.val, first.val`,
    javascript: `function recoverTree(root) {
  let first = null, second = null, prev = null;
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    if (prev && prev.val > node.val) {
      if (!first) first = prev;
      second = node;
    }
    prev = node;
    inorder(node.right);
  }
  inorder(root);
  [first.val, second.val] = [second.val, first.val];
}`,
    java: `TreeNode first, second, prev;
public void recoverTree(TreeNode root) {
    inorder(root);
    int tmp = first.val; first.val = second.val; second.val = tmp;
}
private void inorder(TreeNode node) {
    if (node == null) return;
    inorder(node.left);
    if (prev != null && prev.val > node.val) {
        if (first == null) first = prev;
        second = node;
    }
    prev = node;
    inorder(node.right);
}`,
  },

  defaultInput: {
    nums: [3, 1, 4, 0, 0, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'BST with 2 Swapped Nodes (level-order, 0=null)',
      type: 'array',
      defaultValue: [3, 1, 4, 0, 0, 2],
      placeholder: '3,1,4,0,0,2',
      helperText: 'Level-order BST where exactly two nodes are swapped (0 = null)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Recover BST by finding two swapped nodes via in-order traversal. In-order should be sorted; violations reveal swapped nodes.',
      variables: { first: 'null', second: 'null', prev: 'null' },
      visualization: makeViz([...nums], {}, {}),
    });

    let firstIdx: number | null = null;
    let secondIdx: number | null = null;
    let prevIdx: number | null = null;
    const inorderArr: number[] = [];

    // Collect in-order
    function collectInorder(idx: number) {
      if (idx >= nums.length || nums[idx] === 0) return;
      collectInorder(2 * idx + 1);
      inorderArr.push(idx);
      collectInorder(2 * idx + 2);
    }
    collectInorder(0);

    steps.push({
      line: 5,
      explanation: `In-order traversal visits: [${inorderArr.map(i => nums[i]).join(', ')}]. This should be sorted for a valid BST. Finding violations.`,
      variables: { inorderValues: inorderArr.map(i => nums[i]) },
      visualization: makeViz([...nums], Object.fromEntries(inorderArr.map(i => [i, 'visiting'])), Object.fromEntries(inorderArr.map((i, pos) => [i, `io${pos}`]))),
    });

    for (let i = 0; i < inorderArr.length; i++) {
      const idx = inorderArr[i];

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};

      if (prevIdx !== null) {
        h[prevIdx] = 'comparing';
        l[prevIdx] = 'prev';
      }
      h[idx] = 'active';
      l[idx] = 'cur';
      if (firstIdx !== null) {
        h[firstIdx] = 'mismatch';
        l[firstIdx] = 'FIRST';
      }
      if (secondIdx !== null) {
        h[secondIdx] = 'mismatch';
        l[secondIdx] = 'SECOND';
      }

      if (prevIdx !== null && nums[prevIdx] > nums[idx]) {
        if (firstIdx === null) {
          firstIdx = prevIdx;
        }
        secondIdx = idx;

        steps.push({
          line: 9,
          explanation: `VIOLATION! prev=${nums[prevIdx]} > cur=${nums[idx]}. ${firstIdx === prevIdx ? 'First violation: first=' + nums[firstIdx] : 'Second violation: second=' + nums[secondIdx]}. Both marked as swap candidates.`,
          variables: { prevVal: nums[prevIdx], curVal: nums[idx], firstVal: firstIdx !== null ? nums[firstIdx] : null, secondVal: secondIdx !== null ? nums[secondIdx] : null },
          visualization: makeViz([...nums], h, l),
        });
      } else {
        steps.push({
          line: 7,
          explanation: `In-order: node[${idx}]=${nums[idx]}${prevIdx !== null ? ', prev=' + nums[prevIdx] : ''}. No violation here.`,
          variables: { curVal: nums[idx], prevVal: prevIdx !== null ? nums[prevIdx] : null },
          visualization: makeViz([...nums], h, l),
        });
      }

      prevIdx = idx;
    }

    // Swap
    const fixed = [...nums];
    if (firstIdx !== null && secondIdx !== null) {
      const tmp = fixed[firstIdx];
      fixed[firstIdx] = fixed[secondIdx];
      fixed[secondIdx] = tmp;

      steps.push({
        line: 13,
        explanation: `Swap first=${nums[firstIdx]} (index ${firstIdx}) and second=${nums[secondIdx]} (index ${secondIdx}). BST recovered!`,
        variables: { swapped: [nums[firstIdx], nums[secondIdx]], after: [fixed[firstIdx], fixed[secondIdx]] },
        visualization: makeViz(fixed, { [firstIdx]: 'found', [secondIdx]: 'found' }, { [firstIdx]: 'fixed', [secondIdx]: 'fixed' }),
      });
    }

    steps.push({
      line: 14,
      explanation: `BST recovered. Original swapped values: ${firstIdx !== null ? nums[firstIdx] : '?'} and ${secondIdx !== null ? nums[secondIdx] : '?'}.`,
      variables: { recovered: [...fixed] },
      visualization: makeViz(fixed, Object.fromEntries(fixed.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default recoverBinarySearchTreeSwap;
