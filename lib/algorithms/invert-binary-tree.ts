import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const invertBinaryTree: AlgorithmDefinition = {
  id: 'invert-binary-tree',
  title: 'Invert Binary Tree',
  leetcodeNumber: 226,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the root of a binary tree, invert the tree (mirror it) so that every left child becomes the right child and vice versa. We use a recursive DFS approach, swapping children at each node.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function invertTree(root):
  if root is null:
    return null
  swap root.left and root.right
  invertTree(root.left)
  invertTree(root.right)
  return root`,
    python: `def invertTree(root):
    if root is None:
        return None
    root.left, root.right = root.right, root.left
    invertTree(root.left)
    invertTree(root.right)
    return root`,
    javascript: `function invertTree(root) {
  if (root === null) return null;
  [root.left, root.right] = [root.right, root.left];
  invertTree(root.left);
  invertTree(root.right);
  return root;
}`,
    java: `public TreeNode invertTree(TreeNode root) {
    if (root == null) return null;
    TreeNode temp = root.left;
    root.left = root.right;
    root.right = temp;
    invertTree(root.left);
    invertTree(root.right);
    return root;
}`,
  },
  defaultInput: { tree: [4, 2, 7, 1, 3, 6, 9] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [4, 2, 7, 1, 3, 6, 9],
      placeholder: 'e.g. 4,2,7,1,3,6,9',
      helperText: 'Level-order traversal. Use empty spots for null nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const inputTree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    // Working copy of the tree that we mutate as we invert
    const tree: (number | null)[] = inputTree.slice();
    // Track which nodes have been fully processed
    const processed = new Set<number>();

    function makeViz(
      activeIdx: number | null,
      swappedIndices: number[] | null,
    ): TreeVisualization {
      const highlights: Record<number, string> = {};

      Array.from(processed).forEach((idx) => {
        if (tree[idx] !== null && tree[idx] !== undefined) {
          highlights[idx] = 'visited';
        }
      });

      if (swappedIndices) {
        for (const idx of swappedIndices) {
          if (idx < tree.length && tree[idx] !== null && tree[idx] !== undefined) {
            highlights[idx] = 'found';
          }
        }
      }

      if (activeIdx !== null) {
        highlights[activeIdx] = 'active';
      }

      return {
        type: 'tree',
        nodes: tree.slice(),
        highlights,
      };
    }

    if (tree.length === 0 || tree[0] === null) {
      steps.push({
        line: 2,
        explanation: 'The tree is empty (root is null). Nothing to invert.',
        variables: { root: null },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    // Initial step
    steps.push({
      line: 1,
      explanation: `Start invertTree with root = ${tree[0]}. We will recursively visit each node and swap its children.`,
      variables: { root: tree[0] },
      visualization: makeViz(0, null),
    });

    // Recursive DFS inversion
    function dfs(idx: number, depth: number): void {
      if (idx >= tree.length || tree[idx] === null || tree[idx] === undefined) {
        steps.push({
          line: 2,
          explanation: `Node at index ${idx} is null. Return (base case).`,
          variables: { node: null, index: idx },
          visualization: makeViz(null, null),
        });
        return;
      }

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;
      const leftVal = leftIdx < tree.length ? tree[leftIdx] : null;
      const rightVal = rightIdx < tree.length ? tree[rightIdx] : null;

      // Step: Visit node, about to swap
      steps.push({
        line: 1,
        explanation: `Visit node ${tree[idx]}. Left child = ${leftVal ?? 'null'}, Right child = ${rightVal ?? 'null'}.`,
        variables: {
          node: tree[idx],
          left: leftVal,
          right: rightVal,
          depth,
        },
        visualization: makeViz(idx, null),
      });

      // Perform the swap in our tree array
      // We need to swap entire subtrees, not just single nodes
      function swapSubtrees(li: number, ri: number): void {
        if (li >= tree.length && ri >= tree.length) return;

        // Ensure tree is long enough
        const maxIdx = Math.max(li, ri);
        while (tree.length <= maxIdx) {
          tree.push(null);
        }

        const temp = tree[li] ?? null;
        tree[li] = tree[ri] ?? null;
        tree[ri] = temp;

        // Recursively swap children of swapped nodes
        swapSubtrees(2 * li + 1, 2 * ri + 1);
        swapSubtrees(2 * li + 2, 2 * ri + 2);
      }

      if (leftIdx < tree.length || rightIdx < tree.length) {
        swapSubtrees(leftIdx, rightIdx);

        const newLeftVal = leftIdx < tree.length ? tree[leftIdx] : null;
        const newRightVal = rightIdx < tree.length ? tree[rightIdx] : null;

        const swappedHighlights: number[] = [];
        if (newLeftVal !== null && newLeftVal !== undefined && leftIdx < tree.length)
          swappedHighlights.push(leftIdx);
        if (newRightVal !== null && newRightVal !== undefined && rightIdx < tree.length)
          swappedHighlights.push(rightIdx);

        // Step: Swap complete
        steps.push({
          line: 4,
          explanation: `Swap children of node ${tree[idx]}: left becomes ${newLeftVal ?? 'null'}, right becomes ${newRightVal ?? 'null'}.`,
          variables: {
            node: tree[idx],
            newLeft: newLeftVal,
            newRight: newRightVal,
            depth,
          },
          visualization: makeViz(idx, swappedHighlights),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Node ${tree[idx]} is a leaf node. No children to swap.`,
          variables: { node: tree[idx], left: null, right: null, depth },
          visualization: makeViz(idx, null),
        });
      }

      // Recurse left
      steps.push({
        line: 5,
        explanation: `Recurse into left subtree of node ${tree[idx]}.`,
        variables: { node: tree[idx], recursingInto: 'left', depth },
        visualization: makeViz(idx, null),
      });
      dfs(leftIdx, depth + 1);

      // Recurse right
      steps.push({
        line: 6,
        explanation: `Recurse into right subtree of node ${tree[idx]}.`,
        variables: { node: tree[idx], recursingInto: 'right', depth },
        visualization: makeViz(idx, null),
      });
      dfs(rightIdx, depth + 1);

      // Mark this node as fully processed
      processed.add(idx);

      // Step: Return from this node
      steps.push({
        line: 7,
        explanation: `Done processing node ${tree[idx]}. Subtree rooted here is fully inverted.`,
        variables: { node: tree[idx], depth },
        visualization: makeViz(idx, null),
      });
    }

    dfs(0, 0);

    // Final step
    steps.push({
      line: 7,
      explanation: `Tree inversion complete! The tree is now mirrored.`,
      variables: {
        result: tree.filter((v) => v !== null && v !== undefined),
      },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: Object.fromEntries(
          tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] !== null && tree[i as number] !== undefined)
        ),
      },
    });

    return steps;
  },
};

export default invertBinaryTree;
