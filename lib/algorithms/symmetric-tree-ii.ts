import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const symmetricTreeII: AlgorithmDefinition = {
  id: 'symmetric-tree-ii',
  title: 'Symmetric Tree II',
  leetcodeNumber: 101,
  difficulty: 'Easy',
  category: 'Tree',
  description:
    'Check whether a binary tree is symmetric (mirror of itself) using an iterative BFS approach. Use a queue storing pairs of nodes that should be mirrors. For each pair, check values match and enqueue mirrored children.',
  tags: ['Tree', 'BFS', 'Queue', 'Symmetry', 'Iterative'],
  code: {
    pseudocode: `function isSymmetric(root):
  if root is null: return true
  queue = [(root.left, root.right)]
  while queue not empty:
    (left, right) = dequeue(queue)
    if both null: continue
    if one null or values differ: return false
    enqueue((left.left, right.right))
    enqueue((left.right, right.left))
  return true`,
    python: `from collections import deque
def isSymmetric(root):
    if not root: return True
    q = deque([(root.left, root.right)])
    while q:
        l, r = q.popleft()
        if not l and not r: continue
        if not l or not r or l.val != r.val: return False
        q.append((l.left, r.right))
        q.append((l.right, r.left))
    return True`,
    javascript: `function isSymmetric(root) {
  if (!root) return true;
  const queue = [[root.left, root.right]];
  while (queue.length) {
    const [l, r] = queue.shift();
    if (!l && !r) continue;
    if (!l || !r || l.val !== r.val) return false;
    queue.push([l.left, r.right]);
    queue.push([l.right, r.left]);
  }
  return true;
}`,
    java: `public boolean isSymmetric(TreeNode root) {
    if (root == null) return true;
    Queue<TreeNode> q = new LinkedList<>();
    q.add(root.left); q.add(root.right);
    while (!q.isEmpty()) {
        TreeNode l = q.poll(), r = q.poll();
        if (l == null && r == null) continue;
        if (l == null || r == null || l.val != r.val) return false;
        q.add(l.left); q.add(r.right);
        q.add(l.right); q.add(r.left);
    }
    return true;
}`,
  },
  defaultInput: { tree: [1, 2, 2, 3, 4, 4, 3] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 2, 2, 3, 4, 4, 3],
      placeholder: 'e.g. 1,2,2,3,4,4,3',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function getVal(idx: number): number | null {
      return idx < tree.length ? tree[idx] : null;
    }

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({
        line: 2,
        explanation: 'Empty tree is symmetric.',
        variables: { result: true },
        visualization: makeViz({}),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Check if tree is symmetric. Compare mirrored node pairs using BFS.`,
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    // BFS queue holds [leftIdx, rightIdx] pairs
    const queue: [number, number][] = [[1, 2]];
    let symmetric = true;

    while (queue.length > 0 && symmetric) {
      const [li, ri] = queue.shift()!;
      const lv = getVal(li);
      const rv = getVal(ri);

      if (lv == null && rv == null) {
        steps.push({
          line: 4,
          explanation: `Both positions ${li} and ${ri} are null. Symmetric here — continue.`,
          variables: { leftIdx: li, rightIdx: ri },
          visualization: makeViz({}),
        });
        continue;
      }

      if (lv == null || rv == null || lv !== rv) {
        symmetric = false;
        steps.push({
          line: 6,
          explanation: `Mismatch! Left=${lv ?? 'null'} at ${li}, Right=${rv ?? 'null'} at ${ri}. Tree is NOT symmetric.`,
          variables: { left: lv, right: rv, result: false },
          visualization: makeViz({ [li]: 'mismatch', [ri]: 'mismatch' }),
        });
        break;
      }

      steps.push({
        line: 5,
        explanation: `Match: ${lv} at index ${li} equals ${rv} at index ${ri}. Enqueue mirror children.`,
        variables: { left: lv, right: rv },
        visualization: makeViz({ [li]: 'found', [ri]: 'found' }),
      });

      // Enqueue mirrored pairs
      queue.push([2 * li + 1, 2 * ri + 2]);
      queue.push([2 * li + 2, 2 * ri + 1]);
    }

    steps.push({
      line: 10,
      explanation: symmetric ? 'Tree is SYMMETRIC!' : 'Tree is NOT symmetric.',
      variables: { result: symmetric },
      visualization: makeViz(
        symmetric
          ? Object.fromEntries(tree.map((_, i) => [i, 'found']).filter(([i]) => tree[i as number] != null))
          : {}
      ),
    });

    return steps;
  },
};

export default symmetricTreeII;
