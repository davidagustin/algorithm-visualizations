import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flipBinaryTreeToMatchPreorder: AlgorithmDefinition = {
  id: 'flip-binary-tree-to-match-preorder',
  title: 'Flip Binary Tree To Match Preorder Traversal',
  leetcodeNumber: 971,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree where each node has a unique value, and a voyage sequence, determine the minimum number of node flips (swapping left and right children) needed so that the preorder traversal of the tree matches the voyage. If impossible, return [-1]. DFS: at each node, if the left child does not match the expected voyage value, flip the node and record the flip.',
  tags: ['tree', 'dfs', 'greedy', 'preorder'],

  code: {
    pseudocode: `function flipMatchVoyage(root, voyage):
  flips = []
  index = 0

  function dfs(node):
    if node is null: return true
    if node.val != voyage[index]: return false
    index += 1
    if node.left and node.left.val != voyage[index]:
      flips.append(node.val)  # flip this node
      swap(node.left, node.right)
    return dfs(node.left) and dfs(node.right)

  if dfs(root):
    return flips
  return [-1]`,
    python: `def flipMatchVoyage(root, voyage):
    flips = []
    idx = [0]
    def dfs(node):
        if not node: return True
        if node.val != voyage[idx[0]]: return False
        idx[0] += 1
        if node.left and node.left.val != voyage[idx[0]]:
            flips.append(node.val)
            node.left, node.right = node.right, node.left
        return dfs(node.left) and dfs(node.right)
    return flips if dfs(root) else [-1]`,
    javascript: `function flipMatchVoyage(root, voyage) {
  const flips = [];
  let idx = 0;
  function dfs(node) {
    if (!node) return true;
    if (node.val !== voyage[idx]) return false;
    idx++;
    if (node.left && node.left.val !== voyage[idx]) {
      flips.push(node.val);
      [node.left, node.right] = [node.right, node.left];
    }
    return dfs(node.left) && dfs(node.right);
  }
  return dfs(root) ? flips : [-1];
}`,
    java: `List<Integer> flips = new ArrayList<>();
int idx = 0;
public List<Integer> flipMatchVoyage(TreeNode root, int[] voyage) {
    return dfs(root, voyage) ? flips : Arrays.asList(-1);
}
private boolean dfs(TreeNode node, int[] v) {
    if (node == null) return true;
    if (node.val != v[idx++]) return false;
    if (node.left != null && node.left.val != v[idx]) {
        flips.add(node.val);
        TreeNode tmp = node.left; node.left = node.right; node.right = tmp;
    }
    return dfs(node.left, v) && dfs(node.right, v);
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
    voyage: [1, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order)',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Level-order binary tree (all values unique)',
    },
    {
      name: 'voyage',
      label: 'Target Voyage (Preorder)',
      type: 'array',
      defaultValue: [1, 3, 2],
      placeholder: '1,3,2',
      helperText: 'Desired preorder traversal sequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const voyage = input.voyage as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Match tree preorder to voyage [${voyage.join(', ')}]. DFS: if left child does not match next voyage value, flip the current node.`,
      variables: { voyage, flips: [] },
      visualization: makeViz(nums, {}, {}),
    });

    const flips: number[] = [];
    let idx = 0;
    let impossible = false;
    const treeArr = [...nums];

    function dfs(treeIdx: number): boolean {
      if (treeIdx >= treeArr.length || treeArr[treeIdx] === 0) return true;
      if (idx >= voyage.length || treeArr[treeIdx] !== voyage[idx]) {
        impossible = true;
        steps.push({
          line: 4,
          explanation: `Node[${treeIdx}]=${treeArr[treeIdx]} does not match voyage[${idx}]=${voyage[idx]}. IMPOSSIBLE - return [-1].`,
          variables: { nodeVal: treeArr[treeIdx], expected: voyage[idx], idx },
          visualization: makeViz([...treeArr], { [treeIdx]: 'mismatch' }, { [treeIdx]: 'MISMATCH' }),
        });
        return false;
      }

      steps.push({
        line: 5,
        explanation: `Node[${treeIdx}]=${treeArr[treeIdx]} matches voyage[${idx}]=${voyage[idx]}. Advance index.`,
        variables: { nodeVal: treeArr[treeIdx], voyageVal: voyage[idx], idx },
        visualization: makeViz([...treeArr], { [treeIdx]: 'active' }, { [treeIdx]: `v[${idx}]` }),
      });

      idx++;
      const li = 2 * treeIdx + 1;
      const ri = 2 * treeIdx + 2;

      if (li < treeArr.length && treeArr[li] !== 0 && idx < voyage.length && treeArr[li] !== voyage[idx]) {
        flips.push(treeArr[treeIdx]);
        // Swap children in our array representation
        const lVal = li < treeArr.length ? treeArr[li] : 0;
        const rVal = ri < treeArr.length ? treeArr[ri] : 0;
        if (li < treeArr.length) treeArr[li] = rVal;
        if (ri < treeArr.length) treeArr[ri] = lVal;

        steps.push({
          line: 8,
          explanation: `Left child=${lVal} does not match voyage[${idx}]=${voyage[idx]}. FLIP node ${treeArr[treeIdx]}! Swap children. flips=[${flips.join(', ')}].`,
          variables: { flippedNode: treeArr[treeIdx], newLeft: treeArr[li], newRight: treeArr[ri], flips: [...flips] },
          visualization: makeViz([...treeArr], { [treeIdx]: 'found', [li]: 'swapping', [ri]: 'swapping' }, { [treeIdx]: 'FLIP', [li]: 'new L', [ri]: 'new R' }),
        });
      }

      return dfs(li) && dfs(ri);
    }

    const success = dfs(0);

    steps.push({
      line: 12,
      explanation: success
        ? `Voyage matched with ${flips.length} flip(s) at nodes: [${flips.join(', ')}].`
        : 'Cannot match voyage. Return [-1].',
      variables: { result: success ? flips : [-1] },
      visualization: makeViz([...treeArr], Object.fromEntries(treeArr.map((_, i) => [i, success ? 'sorted' : 'mismatch'])), {}),
    });

    return steps;
  },
};

export default flipBinaryTreeToMatchPreorder;
