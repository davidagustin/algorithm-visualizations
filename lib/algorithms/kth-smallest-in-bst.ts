import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const kthSmallestInBST: AlgorithmDefinition = {
  id: 'kth-smallest-in-bst',
  title: 'Kth Smallest in BST',
  leetcodeNumber: 230,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given the root of a BST and an integer k, return the kth smallest element. In-order traversal of a BST visits nodes in ascending order, so we simply count nodes visited and stop at k.',
  tags: ['Tree', 'BST', 'DFS'],
  code: {
    pseudocode: `function kthSmallest(root, k):
  count = 0
  result = -1
  inorder(root)
  return result

function inorder(node):
  if node is null: return
  inorder(node.left)
  count += 1
  if count == k:
    result = node.val
    return
  inorder(node.right)`,
    python: `def kthSmallest(root, k):
    count = [0]
    result = [None]
    def inorder(node):
        if not node or result[0] is not None:
            return
        inorder(node.left)
        count[0] += 1
        if count[0] == k:
            result[0] = node.val
            return
        inorder(node.right)
    inorder(root)
    return result[0]`,
    javascript: `function kthSmallest(root, k) {
  let count = 0, result = -1;
  function inorder(node) {
    if (!node || result !== -1) return;
    inorder(node.left);
    count++;
    if (count === k) { result = node.val; return; }
    inorder(node.right);
  }
  inorder(root);
  return result;
}`,
    java: `int count = 0, result = -1;
public int kthSmallest(TreeNode root, int k) {
    inorder(root, k);
    return result;
}
void inorder(TreeNode node, int k) {
    if (node == null || count >= k) return;
    inorder(node.left, k);
    count++;
    if (count == k) { result = node.val; return; }
    inorder(node.right, k);
}`,
  },
  defaultInput: { tree: [5, 3, 6, 2, 4, null, null, 1], k: 3 },
  inputFields: [
    {
      name: 'tree',
      label: 'BST (level-order)',
      type: 'tree',
      defaultValue: [5, 3, 6, 2, 4, null, null, 1],
      placeholder: 'e.g. 5,3,6,2,4,null,null,1',
      helperText: 'Level-order BST. Use null for missing nodes.',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Find the kth smallest element.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    let count = 0;
    let result: number | null = null;
    const visited = new Set<number>();
    const inorderList: number[] = [];

    function makeViz(activeIdx: number | null, foundIdx: number | null = null): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'visited';
        }
      }
      if (foundIdx !== null) {
        highlights[foundIdx] = 'found';
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 7,
        explanation: 'The tree is empty. Cannot find kth smallest.',
        variables: { k, result: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Find the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest element in the BST. In-order traversal visits BST nodes in sorted order.`,
      variables: { k, root: tree[0] },
      visualization: makeViz(0),
    });

    function inorder(idx: number): void {
      if (idx >= tree.length || tree[idx] == null || result !== null) return;

      const val = tree[idx] as number;

      steps.push({
        line: 7,
        explanation: `Visit node ${val} (index ${idx}). Go left first for in-order traversal.`,
        variables: { node: val, count },
        visualization: makeViz(idx),
      });

      // Go left
      inorder(2 * idx + 1);

      if (result !== null) return;

      // Process current node
      count++;
      visited.add(idx);
      inorderList.push(val);

      if (count === k) {
        result = val;
        steps.push({
          line: 10,
          explanation: `In-order count = ${count} == k = ${k}. Found the answer: ${val}! In-order so far: [${inorderList.join(', ')}].`,
          variables: { node: val, count, k, result: val, inorder: inorderList.slice() },
          visualization: makeViz(null, idx),
        });
        return;
      }

      steps.push({
        line: 9,
        explanation: `Process node ${val}. In-order count = ${count}. Not yet at k=${k}. In-order so far: [${inorderList.join(', ')}]. Go right.`,
        variables: { node: val, count, k, inorder: inorderList.slice() },
        visualization: makeViz(idx),
      });

      // Go right
      inorder(2 * idx + 2);
    }

    inorder(0);

    steps.push({
      line: 4,
      explanation: result !== null
        ? `The ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} smallest element is ${result}. In-order: [${inorderList.join(', ')}].`
        : `k=${k} exceeds the number of nodes. No result found.`,
      variables: { k, result, inorder: inorderList },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          [...visited].map(i => [i, i === tree.indexOf(result) ? 'found' : 'visited'])
        ),
      },
    });

    return steps;
  },
};

export default kthSmallestInBST;
