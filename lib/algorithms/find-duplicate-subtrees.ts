import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findDuplicateSubtrees: AlgorithmDefinition = {
  id: 'find-duplicate-subtrees',
  title: 'Find Duplicate Subtrees',
  leetcodeNumber: 652,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a binary tree, return all duplicate subtrees. Two trees are duplicate if they have the same structure and node values. Use post-order DFS to serialize each subtree as a string. Store serializations in a hash map: if a serialization appears a second time, add that node to the result. Return one representative node from each duplicate group.',
  tags: ['tree', 'dfs', 'hash map', 'serialization'],

  code: {
    pseudocode: `function findDuplicateSubtrees(root):
  seen = {}
  result = []

  function serialize(node):
    if node is null: return '#'
    left = serialize(node.left)
    right = serialize(node.right)
    key = left + ',' + right + ',' + str(node.val)
    seen[key] = seen.get(key, 0) + 1
    if seen[key] == 2:
      result.append(node)
    return key

  serialize(root)
  return result`,
    python: `def findDuplicateSubtrees(root):
    seen, res = {}, []
    def serialize(node):
        if not node: return '#'
        key = f"{serialize(node.left)},{serialize(node.right)},{node.val}"
        seen[key] = seen.get(key, 0) + 1
        if seen[key] == 2:
            res.append(node)
        return key
    serialize(root)
    return res`,
    javascript: `function findDuplicateSubtrees(root) {
  const seen = new Map(), res = [];
  function serialize(node) {
    if (!node) return '#';
    const key = \`\${serialize(node.left)},\${serialize(node.right)},\${node.val}\`;
    seen.set(key, (seen.get(key) || 0) + 1);
    if (seen.get(key) === 2) res.push(node);
    return key;
  }
  serialize(root);
  return res;
}`,
    java: `public List<TreeNode> findDuplicateSubtrees(TreeNode root) {
    Map<String, Integer> seen = new HashMap<>();
    List<TreeNode> res = new ArrayList<>();
    serialize(root, seen, res);
    return res;
}
private String serialize(TreeNode node, Map<String, Integer> seen, List<TreeNode> res) {
    if (node == null) return "#";
    String key = serialize(node.left, seen, res) + "," +
                 serialize(node.right, seen, res) + "," + node.val;
    seen.merge(key, 1, Integer::sum);
    if (seen.get(key) == 2) res.add(node);
    return key;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 0, 2, 4, 0, 0, 0, 0, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 0, 2, 4, 0, 0, 0, 0, 4],
      placeholder: '1,2,3,4,0,2,4',
      helperText: 'Level-order binary tree (0 = null node)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Serialize each subtree via post-order DFS. Store serializations in a map; when a serialization is seen twice, it is a duplicate.',
      variables: { seen: '{}', result: [] },
      visualization: makeViz({}, {}),
    });

    const seen: Map<string, number> = new Map();
    const duplicateIndices: number[] = [];
    const nodeSerializations: Map<number, string> = new Map();

    function serialize(idx: number): string {
      if (idx >= nums.length || nums[idx] === 0) return '#';
      const left = serialize(2 * idx + 1);
      const right = serialize(2 * idx + 2);
      const key = `${left},${right},${nums[idx]}`;

      nodeSerializations.set(idx, key);
      const count = (seen.get(key) || 0) + 1;
      seen.set(key, count);

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      nodeSerializations.forEach((_, i) => {
        highlights[i] = duplicateIndices.includes(i) ? 'found' : 'visited';
        labels[i] = `s${i}`;
      });
      highlights[idx] = count === 2 ? 'found' : 'active';
      labels[idx] = `val=${nums[idx]}`;

      steps.push({
        line: count === 2 ? 9 : 8,
        explanation: `Node[${idx}]=${nums[idx]}: serialized as "${key.slice(0, 20)}...". Count in map = ${count}. ${count === 2 ? 'DUPLICATE found!' : 'First occurrence.'}`,
        variables: { nodeIdx: idx, nodeVal: nums[idx], serialKey: key.slice(0, 30), count, duplicates: duplicateIndices.length },
        visualization: makeViz(highlights, labels),
      });

      if (count === 2) {
        duplicateIndices.push(idx);
      }

      return key;
    }

    serialize(0);

    const finalH: Record<number, string> = {};
    nums.forEach((v, i) => { if (v !== 0) finalH[i] = duplicateIndices.includes(i) ? 'found' : 'sorted'; });

    steps.push({
      line: 13,
      explanation: `Found ${duplicateIndices.length} duplicate subtree root(s) at indices [${duplicateIndices.join(', ')}] with values [${duplicateIndices.map(i => nums[i]).join(', ')}].`,
      variables: { result: duplicateIndices.map(i => nums[i]), count: duplicateIndices.length },
      visualization: makeViz(finalH, Object.fromEntries(duplicateIndices.map(i => [i, 'DUP']))),
    });

    return steps;
  },
};

export default findDuplicateSubtrees;
