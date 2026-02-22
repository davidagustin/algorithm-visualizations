import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const mostFrequentSubtreeSum: AlgorithmDefinition = {
  id: 'most-frequent-subtree-sum',
  title: 'Most Frequent Subtree Sum',
  leetcodeNumber: 508,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return the most frequent subtree sum. The subtree sum of a node is defined as the sum of all node values in the subtree rooted at that node. Use postorder traversal to compute each subtree sum and track frequencies in a hash map.',
  tags: ['tree', 'postorder', 'hash map', 'frequency', 'subtree sum'],

  code: {
    pseudocode: `function findFrequentTreeSum(root):
  freq = {}
  maxFreq = 0
  function postorder(node) -> sum:
    if null: return 0
    sum = node.val + postorder(left) + postorder(right)
    freq[sum] = freq.get(sum, 0) + 1
    maxFreq = max(maxFreq, freq[sum])
    return sum
  postorder(root)
  return all keys in freq where freq[key] == maxFreq`,

    python: `def findFrequentTreeSum(root):
    freq = {}
    max_freq = [0]

    def postorder(node):
        if not node: return 0
        s = node.val + postorder(node.left) + postorder(node.right)
        freq[s] = freq.get(s, 0) + 1
        max_freq[0] = max(max_freq[0], freq[s])
        return s

    postorder(root)
    return [k for k, v in freq.items() if v == max_freq[0]]`,

    javascript: `function findFrequentTreeSum(root) {
  const freq = new Map();
  let maxFreq = 0;
  function postorder(node) {
    if (!node) return 0;
    const s = node.val + postorder(node.left) + postorder(node.right);
    freq.set(s, (freq.get(s) || 0) + 1);
    maxFreq = Math.max(maxFreq, freq.get(s));
    return s;
  }
  postorder(root);
  return [...freq.entries()].filter(([, v]) => v === maxFreq).map(([k]) => k);
}`,

    java: `public int[] findFrequentTreeSum(TreeNode root) {
    Map<Integer, Integer> freq = new HashMap<>();
    int[] maxFreq = {0};
    postorder(root, freq, maxFreq);
    return freq.entrySet().stream()
        .filter(e -> e.getValue() == maxFreq[0])
        .mapToInt(Map.Entry::getKey).toArray();
}`,
  },

  defaultInput: {
    tree: [5, 2, -3],
  },

  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'array',
      defaultValue: [5, 2, -3],
      placeholder: '5,2,-3',
      helperText: 'Level-order representation of the binary tree',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).map(v => (v === null ? null : Number(v)));
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Find most frequent subtree sum in tree: [${tree.map(v => v === null ? 'null' : v).join(', ')}]. Compute each subtree sum via postorder.`,
      variables: { freq: '{}', maxFreq: 0 },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: {},
      },
    });

    const freq: Record<number, number> = {};
    let maxFreq = 0;
    const visitOrder: number[] = [];
    const subtreeSums: Record<number, number> = {};

    function postorder(pos: number): number {
      if (pos >= tree.length || tree[pos] === null || tree[pos] === undefined) return 0;

      const leftSum = postorder(2 * pos + 1);
      const rightSum = postorder(2 * pos + 2);
      const val = tree[pos] as number;
      const sum = val + leftSum + rightSum;
      subtreeSums[pos] = sum;
      visitOrder.push(pos);

      freq[sum] = (freq[sum] || 0) + 1;
      if (freq[sum] > maxFreq) maxFreq = freq[sum];

      steps.push({
        line: 5,
        explanation: `Subtree at node ${val} (pos ${pos}): sum = ${val} + ${leftSum} + ${rightSum} = ${sum}. Frequency of ${sum}: ${freq[sum]}. maxFreq = ${maxFreq}.`,
        variables: { val, leftSum, rightSum, sum, freqOfSum: freq[sum], maxFreq },
        visualization: {
          type: 'tree',
          nodes: [...tree] as number[],
          highlights: {
            ...Object.fromEntries(visitOrder.slice(0, -1).map(p => [p, freq[subtreeSums[p]] === maxFreq ? 'found' : 'visited'])),
            [pos]: 'active',
          },
        },
      });

      return sum;
    }

    postorder(0);

    const result = Object.entries(freq).filter(([, v]) => v === maxFreq).map(([k]) => Number(k));

    steps.push({
      line: 8,
      explanation: `Subtree sums computed. Frequency map: ${JSON.stringify(freq)}. Most frequent sum(s): [${result.join(', ')}] with frequency ${maxFreq}.`,
      variables: { result: JSON.stringify(result), freq: JSON.stringify(freq), maxFreq },
      visualization: {
        type: 'tree',
        nodes: [...tree] as number[],
        highlights: Object.fromEntries(
          visitOrder.map(p => [p, result.includes(subtreeSums[p]) ? 'found' : 'visited'])
        ),
      },
    });

    return steps;
  },
};

export default mostFrequentSubtreeSum;
