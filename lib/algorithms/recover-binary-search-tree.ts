import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const recoverBinarySearchTree: AlgorithmDefinition = {
  id: 'recover-binary-search-tree',
  title: 'Recover Binary Search Tree',
  leetcodeNumber: 99,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'You are given the root of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure. We use inorder traversal: in a valid BST inorder gives sorted values. When two nodes are swapped, there will be one or two "inversions" in the inorder sequence. We identify the first and second out-of-order nodes and swap them back.',
  tags: ['Tree', 'DFS', 'Inorder', 'BST'],
  code: {
    pseudocode: `function recoverTree(root):
  first = second = prev = null
  function inorder(node):
    if node is null: return
    inorder(node.left)
    if prev and prev.val > node.val:
      if first is null: first = prev
      second = node
    prev = node
    inorder(node.right)
  inorder(root)
  swap(first.val, second.val)`,
    python: `def recoverTree(root):
    first = second = prev = None
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        inorder(node.left)
        if prev and prev.val > node.val:
            if not first:
                first = prev
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
    int temp = first.val;
    first.val = second.val;
    second.val = temp;
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
  defaultInput: { tree: [1, 3, null, null, 2] },
  inputFields: [
    {
      name: 'tree',
      label: 'BST with Two Swapped Nodes (level-order)',
      type: 'tree',
      defaultValue: [1, 3, null, null, 2],
      placeholder: 'e.g. 1,3,null,null,2',
      helperText: 'A BST where exactly two nodes have been swapped. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    const inorderIndices: number[] = [];
    let firstIdx = -1;
    let secondIdx = -1;
    let prevIdx = -1;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) highlights[idx] = 'visited';
      }
      if (firstIdx >= 0) highlights[firstIdx] = 'swapping';
      if (secondIdx >= 0) highlights[secondIdx] = 'swapping';
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Tree is empty. Nothing to recover.',
        variables: { root: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Recover BST where two nodes were swapped. Use inorder traversal to find the out-of-order nodes.`,
      variables: { root: tree[0] },
      visualization: makeViz(0),
    });

    function inorder(idx: number): void {
      if (idx >= tree.length || tree[idx] == null) return;

      inorder(2 * idx + 1);

      const val = tree[idx] as number;
      visited.add(idx);
      inorderIndices.push(idx);

      steps.push({
        line: 6,
        explanation: `Inorder visit node ${val}. Inorder so far: [${inorderIndices.map(i => tree[i]).join(', ')}].`,
        variables: { node: val, prev: prevIdx >= 0 ? tree[prevIdx] : null },
        visualization: makeViz(idx),
      });

      if (prevIdx >= 0) {
        const prevVal = tree[prevIdx] as number;
        if (prevVal > val) {
          steps.push({
            line: 7,
            explanation: `Inversion found! prev=${prevVal} > current=${val}. This is an out-of-order pair.`,
            variables: { prev: prevVal, current: val, firstFound: firstIdx === -1 },
            visualization: makeViz(idx, { [prevIdx]: 'swapping', [idx]: 'swapping' }),
          });

          if (firstIdx === -1) {
            firstIdx = prevIdx;
            steps.push({
              line: 8,
              explanation: `First swapped node identified: ${prevVal} (index ${prevIdx}).`,
              variables: { firstSwapped: prevVal },
              visualization: makeViz(null, { [firstIdx]: 'swapping' }),
            });
          }
          secondIdx = idx;
          steps.push({
            line: 9,
            explanation: `Second swapped node updated: ${val} (index ${idx}).`,
            variables: { secondSwapped: val },
            visualization: makeViz(null, { [firstIdx]: 'swapping', [secondIdx]: 'swapping' }),
          });
        }
      }

      prevIdx = idx;
      inorder(2 * idx + 2);
    }

    inorder(0);

    if (firstIdx >= 0 && secondIdx >= 0) {
      const firstVal = tree[firstIdx] as number;
      const secondVal = tree[secondIdx] as number;

      steps.push({
        line: 11,
        explanation: `Swap nodes: first=${firstVal} (index ${firstIdx}) ↔ second=${secondVal} (index ${secondIdx}).`,
        variables: { first: firstVal, second: secondVal },
        visualization: makeViz(null, { [firstIdx]: 'swapping', [secondIdx]: 'swapping' }),
      });

      tree[firstIdx] = secondVal;
      tree[secondIdx] = firstVal;

      steps.push({
        line: 11,
        explanation: `Swap complete! Node ${firstVal} and ${secondVal} exchanged. BST is now valid.`,
        variables: { swapped: [firstVal, secondVal] },
        visualization: {
          type: 'tree',
          nodes: tree.slice(),
          highlights: {
            [firstIdx]: 'found',
            [secondIdx]: 'found',
          },
        },
      });
    }

    steps.push({
      line: 11,
      explanation: `BST recovered! The two misplaced nodes have been swapped back to their correct positions.`,
      variables: { recovered: true },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null)
        ),
      },
    });

    return steps;
  },
};

export default recoverBinarySearchTree;
