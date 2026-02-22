import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const lowestCommonAncestor: AlgorithmDefinition = {
  id: 'lowest-common-ancestor',
  title: 'Lowest Common Ancestor',
  leetcodeNumber: 236,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree and two nodes p and q, find their lowest common ancestor (LCA). The LCA is the deepest node that has both p and q as descendants (a node can be a descendant of itself). We use recursive DFS: if the current node is p or q, return it. Otherwise, recurse left and right; if both return non-null, current node is the LCA.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function lowestCommonAncestor(root, p, q):
  if root is null: return null
  if root == p or root == q:
    return root
  left = lowestCommonAncestor(root.left, p, q)
  right = lowestCommonAncestor(root.right, p, q)
  if left != null and right != null:
    return root
  return left if left != null else right`,
    python: `def lowestCommonAncestor(root, p, q):
    if not root:
        return None
    if root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right:
        return root
    return left if left else right`,
    javascript: `function lowestCommonAncestor(root, p, q) {
  if (!root) return null;
  if (root === p || root === q) return root;
  const left = lowestCommonAncestor(root.left, p, q);
  const right = lowestCommonAncestor(root.right, p, q);
  if (left && right) return root;
  return left || right;
}`,
    java: `public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
    if (root == null) return null;
    if (root == p || root == q) return root;
    TreeNode left = lowestCommonAncestor(root.left, p, q);
    TreeNode right = lowestCommonAncestor(root.right, p, q);
    if (left != null && right != null) return root;
    return left != null ? left : right;
}`,
  },
  defaultInput: { tree: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4], p: 5, q: 1 },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 5, 1, 6, 2, 0, 8, null, null, 7, 4],
      placeholder: 'e.g. 3,5,1,6,2,0,8,null,null,7,4',
      helperText: 'Level-order traversal. Use null for missing nodes.',
    },
    {
      name: 'p',
      label: 'Node p',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Value of node p.',
    },
    {
      name: 'q',
      label: 'Node q',
      type: 'number',
      defaultValue: 1,
      placeholder: 'e.g. 1',
      helperText: 'Value of node q.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const p = input.p as number;
    const q = input.q as number;
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();

    function findIndex(val: number): number {
      return tree.indexOf(val);
    }

    const pIdx = findIndex(p);
    const qIdx = findIndex(q);

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < tree.length && tree[idx] != null) {
          highlights[idx] = 'visited';
        }
      }
      if (pIdx >= 0) highlights[pIdx] = 'pointer';
      if (qIdx >= 0) highlights[qIdx] = 'pointer';
      for (const [k, v] of Object.entries(extra)) {
        highlights[Number(k)] = v;
      }
      if (activeIdx !== null && activeIdx < tree.length && tree[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    steps.push({
      line: 1,
      explanation: `Find LCA of nodes p=${p} and q=${q}. Use recursive DFS: return the node if it is p or q, otherwise check both subtrees.`,
      variables: { p, q, root: tree[0] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): number | null {
      if (idx >= tree.length || tree[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Node at index ${idx} is null. Return null.`,
          variables: { node: null },
          visualization: makeViz(null),
        });
        return null;
      }

      const val = tree[idx] as number;
      visited.add(idx);

      steps.push({
        line: 1,
        explanation: `Visit node ${val} (index ${idx}). Check if it is p(${p}) or q(${q}).`,
        variables: { node: val, isP: val === p, isQ: val === q },
        visualization: makeViz(idx),
      });

      if (val === p || val === q) {
        steps.push({
          line: 3,
          explanation: `Node ${val} matches ${val === p ? 'p' : 'q'}! Return this node.`,
          variables: { node: val, matchedTarget: val === p ? 'p' : 'q' },
          visualization: makeViz(null, { [idx]: 'found' }),
        });
        return val;
      }

      steps.push({
        line: 5,
        explanation: `Node ${val} is neither p nor q. Search left subtree.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      const leftIdx = 2 * idx + 1;
      const rightIdx = 2 * idx + 2;

      const leftResult = dfs(leftIdx);

      steps.push({
        line: 6,
        explanation: `Back at node ${val}. Left subtree returned ${leftResult ?? 'null'}. Now search right subtree.`,
        variables: { node: val, leftResult },
        visualization: makeViz(idx),
      });

      const rightResult = dfs(rightIdx);

      steps.push({
        line: 6,
        explanation: `Back at node ${val}. Left=${leftResult ?? 'null'}, Right=${rightResult ?? 'null'}.`,
        variables: { node: val, leftResult, rightResult },
        visualization: makeViz(idx),
      });

      if (leftResult !== null && rightResult !== null) {
        steps.push({
          line: 7,
          explanation: `Both subtrees of node ${val} returned non-null. This means p and q are on different sides. Node ${val} is the LCA!`,
          variables: { node: val, LCA: val },
          visualization: makeViz(null, { [idx]: 'found' }),
        });
        return val;
      }

      const result = leftResult !== null ? leftResult : rightResult;
      steps.push({
        line: 8,
        explanation: `Node ${val}: only one side returned non-null. Propagate ${result ?? 'null'} upward.`,
        variables: { node: val, returning: result },
        visualization: makeViz(idx),
      });

      return result;
    }

    const lca = dfs(0);

    const lcaIdx = lca !== null ? findIndex(lca) : -1;

    steps.push({
      line: 7,
      explanation: `LCA of p=${p} and q=${q} is node ${lca}.`,
      variables: { LCA: lca, p, q },
      visualization: {
        type: 'tree',
        nodes: tree.slice(),
        highlights: {
          ...(pIdx >= 0 ? { [pIdx]: 'pointer' } : {}),
          ...(qIdx >= 0 ? { [qIdx]: 'pointer' } : {}),
          ...(lcaIdx >= 0 ? { [lcaIdx]: 'found' } : {}),
        },
      },
    });

    return steps;
  },
};

export default lowestCommonAncestor;
