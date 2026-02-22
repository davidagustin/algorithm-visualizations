import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const subtreeOfAnotherTreeII: AlgorithmDefinition = {
  id: 'subtree-of-another-tree-ii',
  title: 'Subtree of Another Tree II',
  leetcodeNumber: 572,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Given the roots of two binary trees root and subRoot, return true if there is a subtree of root with the same structure and values as subRoot. At each node in root, check if the subtree rooted there is identical to subRoot.',
  tags: ['Tree', 'DFS', 'Recursion', 'String Matching'],
  code: {
    pseudocode: `function isSubtree(root, subRoot):
  if root is null: return false
  if isSameTree(root, subRoot): return true
  return isSubtree(root.left, subRoot) or
         isSubtree(root.right, subRoot)

function isSameTree(p, q):
  if both null: return true
  if one null or values differ: return false
  return isSameTree(p.left, q.left) and
         isSameTree(p.right, q.right)`,
    python: `def isSubtree(root, subRoot):
    if not root: return False
    if isSame(root, subRoot): return True
    return isSubtree(root.left, subRoot) or isSubtree(root.right, subRoot)

def isSame(p, q):
    if not p and not q: return True
    if not p or not q or p.val != q.val: return False
    return isSame(p.left, q.left) and isSame(p.right, q.right)`,
    javascript: `function isSubtree(root, subRoot) {
  if (!root) return false;
  if (isSame(root, subRoot)) return true;
  return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
function isSame(p, q) {
  if (!p && !q) return true;
  if (!p || !q || p.val !== q.val) return false;
  return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
    java: `public boolean isSubtree(TreeNode root, TreeNode subRoot) {
    if (root == null) return false;
    if (isSame(root, subRoot)) return true;
    return isSubtree(root.left, subRoot) || isSubtree(root.right, subRoot);
}
boolean isSame(TreeNode p, TreeNode q) {
    if (p == null && q == null) return true;
    if (p == null || q == null || p.val != q.val) return false;
    return isSame(p.left, q.left) && isSame(p.right, q.right);
}`,
  },
  defaultInput: {
    root: [3, 4, 5, 1, 2],
    subRoot: [4, 1, 2],
  },
  inputFields: [
    {
      name: 'root',
      label: 'Root Tree (level-order)',
      type: 'tree',
      defaultValue: [3, 4, 5, 1, 2],
      placeholder: 'e.g. 3,4,5,1,2',
    },
    {
      name: 'subRoot',
      label: 'Sub-tree Root (level-order)',
      type: 'tree',
      defaultValue: [4, 1, 2],
      placeholder: 'e.g. 4,1,2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const root = (input.root as (number | null)[]).slice();
    const subRoot = (input.subRoot as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];
    let found = false;

    function makeViz(activeIdx: number | null, highlight: string = 'active'): TreeVisualization {
      const highlights: Record<number, string> = {};
      if (activeIdx !== null && root[activeIdx] != null) highlights[activeIdx] = highlight;
      return { type: 'tree', nodes: root.slice(), highlights };
    }

    function getVal(arr: (number | null)[], idx: number): number | null {
      return idx < arr.length ? arr[idx] : null;
    }

    function isSame(ri: number, si: number): boolean {
      const rv = getVal(root, ri);
      const sv = getVal(subRoot, si);
      if (rv == null && sv == null) return true;
      if (rv == null || sv == null || rv !== sv) return false;
      return isSame(2 * ri + 1, 2 * si + 1) && isSame(2 * ri + 2, 2 * si + 2);
    }

    function search(idx: number): void {
      if (idx >= root.length || root[idx] == null) return;
      const val = root[idx] as number;

      const match = isSame(idx, 0);
      if (match) {
        found = true;
        steps.push({
          line: 3,
          explanation: `Node ${val} at index ${idx}: subtree matches subRoot! Found.`,
          variables: { node: val, match: true },
          visualization: makeViz(idx, 'found'),
        });
        return;
      }

      steps.push({
        line: 2,
        explanation: `Node ${val} at index ${idx}: subtree does not match. Continue searching.`,
        variables: { node: val, match: false },
        visualization: makeViz(idx),
      });

      search(2 * idx + 1);
      search(2 * idx + 2);
    }

    steps.push({
      line: 1,
      explanation: `Check if subRoot [${subRoot.filter(v => v != null).join(',')}] is a subtree of root [${root.filter(v => v != null).join(',')}].`,
      variables: { root: root.filter(v => v != null), subRoot: subRoot.filter(v => v != null) },
      visualization: makeViz(0),
    });

    search(0);

    steps.push({
      line: 5,
      explanation: found ? `SubRoot IS a subtree of the main tree!` : `SubRoot is NOT a subtree of the main tree.`,
      variables: { result: found },
      visualization: {
        type: 'tree',
        nodes: root.slice(),
        highlights: Object.fromEntries(root.map((_, i) => [i, found ? 'found' : 'visited']).filter(([i]) => root[i as number] != null)),
      },
    });

    return steps;
  },
};

export default subtreeOfAnotherTreeII;
