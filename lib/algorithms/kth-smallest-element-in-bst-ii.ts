import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kthSmallestElementInBSTII: AlgorithmDefinition = {
  id: 'kth-smallest-element-in-bst-ii',
  title: 'Kth Smallest Element in BST II',
  leetcodeNumber: 230,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 230: Find the kth smallest element in a BST. Inorder traversal of BST visits nodes in ascending order. Simulate inorder traversal and return the kth visited node.',
  tags: ['Binary Search', 'Tree', 'Depth-First Search', 'BST', 'Sorting'],
  code: {
    pseudocode: `function kthSmallest(root, k):
  count = 0, result = 0
  stack = []
  curr = root
  while curr or stack:
    while curr:
      stack.push(curr)
      curr = curr.left
    curr = stack.pop()
    count++
    if count == k: return curr.val
    curr = curr.right`,
    python: `def kthSmallest(root, k):
    stack = []
    curr = root
    count = 0
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        curr = stack.pop()
        count += 1
        if count == k:
            return curr.val
        curr = curr.right`,
    javascript: `function kthSmallest(root, k) {
  const stack = [];
  let curr = root, count = 0;
  while (curr || stack.length) {
    while (curr) { stack.push(curr); curr = curr.left; }
    curr = stack.pop();
    if (++count === k) return curr.val;
    curr = curr.right;
  }
}`,
    java: `public int kthSmallest(TreeNode root, int k) {
    Deque<TreeNode> stack = new ArrayDeque<>();
    TreeNode curr = root;
    int count = 0;
    while (curr != null || !stack.isEmpty()) {
        while (curr != null) { stack.push(curr); curr = curr.left; }
        curr = stack.pop();
        if (++count == k) return curr.val;
        curr = curr.right;
    }
    return -1;
}`,
  },
  defaultInput: { tree: [3, 1, 4, null, 2], k: 1 },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level order)',
      type: 'array',
      defaultValue: [3, 1, 4, null, 2],
      placeholder: '3,1,4,null,2',
      helperText: 'BST in level-order (null for missing nodes)',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Find kth smallest',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    // Build inorder traversal from level-order array
    const vals: number[] = tree.filter(v => v !== null) as number[];
    vals.sort((a, b) => a - b);

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Kth Smallest BST', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Find ${k}th smallest in BST. Inorder traversal gives sorted order.`,
      variables: { tree: [...tree], k },
      visualization: makeViz(vals,
        Object.fromEntries(vals.map((_, i) => [i, 'comparing'])),
        {},
        [{ key: 'k', value: String(k) }, { key: 'Inorder', value: vals.join(',') }],
      ),
    });

    for (let i = 0; i < vals.length; i++) {
      const isTarget = i + 1 === k;
      steps.push({
        line: i + 1 === k ? 9 : 6,
        explanation: `Inorder visit #${i + 1}: value=${vals[i]}. ${isTarget ? `This is the ${k}th smallest!` : `count=${i + 1} < k=${k}, continue.`}`,
        variables: { count: i + 1, value: vals[i], k },
        visualization: makeViz(vals,
          {
            ...Object.fromEntries(vals.slice(0, i).map((_, j) => [j, 'visited'])),
            [i]: isTarget ? 'found' : 'active',
          },
          { [i]: `#${i + 1}` },
          [{ key: 'Visit', value: `#${i + 1}=${vals[i]}` }, { key: isTarget ? 'Answer' : 'k', value: isTarget ? String(vals[i]) : String(k) }],
        ),
      });
      if (isTarget) break;
    }

    const result = vals[k - 1];
    steps.push({
      line: 1,
      explanation: `The ${k}th smallest element in the BST is ${result}.`,
      variables: { result, k },
      visualization: makeViz(vals,
        {
          ...Object.fromEntries(vals.slice(0, k).map((_, i) => [i, 'visited'])),
          [k - 1]: 'found',
        },
        { [k - 1]: `${k}th` },
        [{ key: 'Answer', value: String(result) }],
      ),
    });

    return steps;
  },
};

export default kthSmallestElementInBSTII;
