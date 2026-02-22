import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const twoSumIvInputIsBst: AlgorithmDefinition = {
  id: 'two-sum-iv-input-is-bst',
  title: 'Two Sum IV - Input is a BST',
  leetcodeNumber: 653,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a BST and a target integer k, return true if there exist two elements in the BST such that their sum equals k. Perform inorder traversal to get a sorted array, then use two pointers to find the pair.',
  tags: ['tree', 'BST', 'hash set', 'two pointers', 'inorder'],

  code: {
    pseudocode: `function findTarget(root, k):
  sorted = inorderTraversal(root)
  left = 0, right = len(sorted) - 1
  while left < right:
    sum = sorted[left] + sorted[right]
    if sum == k: return true
    if sum < k: left++
    else: right--
  return false`,

    python: `def findTarget(root, k):
    def inorder(node, result):
        if not node: return
        inorder(node.left, result)
        result.append(node.val)
        inorder(node.right, result)

    sorted_vals = []
    inorder(root, sorted_vals)
    left, right = 0, len(sorted_vals) - 1
    while left < right:
        s = sorted_vals[left] + sorted_vals[right]
        if s == k: return True
        if s < k: left += 1
        else: right -= 1
    return False`,

    javascript: `function findTarget(root, k) {
  const vals = [];
  function inorder(node) {
    if (!node) return;
    inorder(node.left);
    vals.push(node.val);
    inorder(node.right);
  }
  inorder(root);
  let left = 0, right = vals.length - 1;
  while (left < right) {
    const sum = vals[left] + vals[right];
    if (sum === k) return true;
    if (sum < k) left++;
    else right--;
  }
  return false;
}`,

    java: `public boolean findTarget(TreeNode root, int k) {
    List<Integer> list = new ArrayList<>();
    inorder(root, list);
    int left = 0, right = list.size() - 1;
    while (left < right) {
        int sum = list.get(left) + list.get(right);
        if (sum == k) return true;
        if (sum < k) left++;
        else right--;
    }
    return false;
}`,
  },

  defaultInput: {
    tree: [5, 3, 6, 2, 4, null, 7],
    k: 9,
  },

  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'array',
      defaultValue: [5, 3, 6, 2, 4, null, 7],
      placeholder: '5,3,6,2,4,null,7',
      helperText: 'Level-order representation of the BST',
    },
    {
      name: 'k',
      label: 'Target Sum',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'Target sum to find among two distinct BST nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find two nodes in BST that sum to ${k}. First do inorder traversal to get sorted array.`,
      variables: { k },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: { 0: 'active' },
      },
    });

    // Build sorted inorder array
    const sorted: number[] = [];
    function inorder(pos: number): void {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return;
      inorder(2 * pos + 1);
      sorted.push(tree[pos] as number);
      inorder(2 * pos + 2);
    }
    inorder(0);

    steps.push({
      line: 2,
      explanation: `Inorder traversal gives sorted array: [${sorted}]. Now use two-pointer technique.`,
      variables: { sorted: JSON.stringify(sorted), k },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: { 0: 'pointer', [sorted.length - 1]: 'pointer' },
        labels: { 0: 'L', [sorted.length - 1]: 'R' },
      },
    });

    let left = 0;
    let right = sorted.length - 1;

    while (left < right) {
      const sum = sorted[left] + sorted[right];
      steps.push({
        line: 5,
        explanation: `sorted[${left}] + sorted[${right}] = ${sorted[left]} + ${sorted[right]} = ${sum}. Target = ${k}.`,
        variables: { left, right, sum, k },
        visualization: {
          type: 'array',
          array: [...sorted],
          highlights: { [left]: 'active', [right]: 'active' },
          labels: { [left]: 'L', [right]: 'R' },
        },
      });

      if (sum === k) {
        steps.push({
          line: 6,
          explanation: `Found pair: ${sorted[left]} + ${sorted[right]} = ${k}. Return true.`,
          variables: { left, right, val1: sorted[left], val2: sorted[right], result: true },
          visualization: {
            type: 'array',
            array: [...sorted],
            highlights: { [left]: 'found', [right]: 'found' },
            labels: { [left]: 'L', [right]: 'R' },
          },
        });
        return steps;
      } else if (sum < k) {
        steps.push({
          line: 7,
          explanation: `Sum ${sum} < ${k}. Move left pointer right to increase sum.`,
          variables: { left: left + 1, right, sum, k },
          visualization: {
            type: 'array',
            array: [...sorted],
            highlights: { [left]: 'comparing', [right]: 'pointer' },
            labels: { [left]: 'L++', [right]: 'R' },
          },
        });
        left++;
      } else {
        steps.push({
          line: 8,
          explanation: `Sum ${sum} > ${k}. Move right pointer left to decrease sum.`,
          variables: { left, right: right - 1, sum, k },
          visualization: {
            type: 'array',
            array: [...sorted],
            highlights: { [left]: 'pointer', [right]: 'comparing' },
            labels: { [left]: 'L', [right]: 'R--' },
          },
        });
        right--;
      }
    }

    steps.push({
      line: 8,
      explanation: `Pointers crossed. No pair sums to ${k}. Return false.`,
      variables: { result: false },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: {},
      },
    });

    return steps;
  },
};

export default twoSumIvInputIsBst;
