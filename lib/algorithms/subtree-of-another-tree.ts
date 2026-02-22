import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const subtreeOfAnotherTree: AlgorithmDefinition = {
  id: 'subtree-of-another-tree',
  title: 'Subtree of Another Tree',
  leetcodeNumber: 572,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and node values as subRoot, and false otherwise. A subtree of root is a tree that consists of a node in root and all of this node\'s descendants. We use DFS: at each node of root, check if the tree rooted there is identical to subRoot.',
  tags: ['Tree', 'DFS', 'Recursion'],
  code: {
    pseudocode: `function isSubtree(root, subRoot):
  if root is null: return false
  if isSameTree(root, subRoot): return true
  return isSubtree(root.left, subRoot) or
         isSubtree(root.right, subRoot)

function isSameTree(p, q):
  if p is null and q is null: return true
  if p is null or q is null: return false
  return p.val == q.val and
         isSameTree(p.left, q.left) and
         isSameTree(p.right, q.right)`,
    python: `def isSubtree(root, subRoot):
    if not root:
        return False
    if isSameTree(root, subRoot):
        return True
    return (isSubtree(root.left, subRoot) or
            isSubtree(root.right, subRoot))

def isSameTree(p, q):
    if not p and not q: return True
    if not p or not q: return False
    return (p.val == q.val and
            isSameTree(p.left, q.left) and
            isSameTree(p.right, q.right))`,
    javascript: `function isSubtree(root, subRoot) {
  if (!root) return false;
  if (isSameTree(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
function isSameTree(p, q) {
  if (!p && !q) return true;
  if (!p || !q) return false;
  return p.val === q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
    java: `public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    if (isSameTree(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
private boolean isSameTree(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null) return false;
    return p.val == q.val && isSameTree(p.left, q.left) && isSameTree(p.right, q.right);
}`,
  },
  defaultInput: { root: [3, 4, 5, 1, 2], subRoot: [4, 1, 2] },
  inputFields: [
    {
      name: 'root',
      label: 'Main Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 4, 5, 1, 2],
      placeholder: 'e.g. 3,4,5,1,2',
      helperText: 'The main binary tree. Use null for missing nodes.',
    },
    {
      name: 'subRoot',
      label: 'Subtree (level-order)',
      type: 'tree',
      defaultValue: [4, 1, 2],
      placeholder: 'e.g. 4,1,2',
      helperText: 'The subtree to search for.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const root = (input.root as (number | null)[]).slice();
    const subRoot = (input.subRoot as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    const visited = new Set<number>();
    let foundIdx = -1;

    function makeViz(activeIdx: number | null, extra: Record<number, string> = {}): TreeVisualization {
      const highlights: Record<number, string> = {};
      for (const idx of visited) {
        if (idx < root.length && root[idx] != null) highlights[idx] = 'visited';
      }
      for (const [k, v] of Object.entries(extra)) highlights[Number(k)] = v;
      if (activeIdx !== null && activeIdx < root.length && root[activeIdx] != null) {
        highlights[activeIdx] = 'active';
      }
      return { type: 'tree', nodes: root.slice(), highlights };
    }

    function isSameTree(rIdx: number, sIdx: number): boolean {
      const rNull = rIdx >= root.length || root[rIdx] == null;
      const sNull = sIdx >= subRoot.length || subRoot[sIdx] == null;
      if (rNull && sNull) return true;
      if (rNull || sNull) return false;
      if (root[rIdx] !== subRoot[sIdx]) return false;
      return isSameTree(2 * rIdx + 1, 2 * sIdx + 1) && isSameTree(2 * rIdx + 2, 2 * sIdx + 2);
    }

    if (root.length === 0 || root[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Main tree is empty. subRoot cannot be a subtree. Return false.',
        variables: { root: null, result: false },
        visualization: { type: 'tree', nodes: [], highlights: {} },
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Check if subRoot [${subRoot.filter(v => v != null).join(', ')}] is a subtree of root. DFS through root, checking each node.`,
      variables: { root: root[0], subRootVal: subRoot[0] },
      visualization: makeViz(0),
    });

    function dfs(idx: number): boolean {
      if (idx >= root.length || root[idx] == null) {
        steps.push({
          line: 2,
          explanation: `Reached null node. subRoot not found along this path.`,
          variables: { node: null },
          visualization: makeViz(null),
        });
        return false;
      }

      const val = root[idx] as number;
      visited.add(idx);

      steps.push({
        line: 3,
        explanation: `At node ${val}. Check if tree rooted here matches subRoot (root = ${subRoot[0]}).`,
        variables: { node: val, subRootVal: subRoot[0] },
        visualization: makeViz(idx),
      });

      const same = isSameTree(idx, 0);

      if (same) {
        foundIdx = idx;
        steps.push({
          line: 3,
          explanation: `Tree rooted at ${val} is identical to subRoot! Found the subtree.`,
          variables: { node: val, found: true },
          visualization: makeViz(null, { [idx]: 'found' }),
        });
        return true;
      }

      steps.push({
        line: 4,
        explanation: `Subtree rooted at ${val} doesn't match. Search left and right subtrees.`,
        variables: { node: val },
        visualization: makeViz(idx),
      });

      const leftResult = dfs(2 * idx + 1);
      if (leftResult) return true;

      const rightResult = dfs(2 * idx + 2);
      return rightResult;
    }

    const result = dfs(0);

    steps.push({
      line: 5,
      explanation: `Search complete. subRoot ${result ? 'IS' : 'IS NOT'} a subtree of root.`,
      variables: { result },
      visualization: {
        type: 'tree',
        nodes: root.slice(),
        highlights: {
          ...(foundIdx >= 0 ? { [foundIdx]: 'found' } : {}),
          ...Object.fromEntries(
            root.map((_, i) => [i, 'visited']).filter(([i]) => root[i as number] != null && i !== foundIdx)
          ),
        },
      },
    });

    return steps;
  },
};

export default subtreeOfAnotherTree;
