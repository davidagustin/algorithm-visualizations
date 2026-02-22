import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const evenOddTree: AlgorithmDefinition = {
  id: 'even-odd-tree',
  title: 'Even Odd Tree',
  leetcodeNumber: 1609,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'A binary tree is Even-Odd if: even-indexed levels have odd values in strictly increasing order, and odd-indexed levels have even values in strictly decreasing order. Use BFS level by level to verify each level satisfies the conditions.',
  tags: ['Tree', 'BFS', 'Level Order'],
  code: {
    pseudocode: `function isEvenOddTree(root):
  queue = [root]
  level = 0
  while queue not empty:
    prev = +Infinity if level is odd else -Infinity
    for each node in current level:
      if level is even:
        if node.val is even or node.val <= prev: return false
      else:
        if node.val is odd or node.val >= prev: return false
      prev = node.val
      enqueue children
    level++
  return true`,
    python: `def isEvenOddTree(root):
    queue = deque([root])
    level = 0
    while queue:
        prev = float('inf') if level % 2 else float('-inf')
        for _ in range(len(queue)):
            node = queue.popleft()
            if level % 2 == 0:
                if node.val % 2 == 0 or node.val <= prev: return False
            else:
                if node.val % 2 == 1 or node.val >= prev: return False
            prev = node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        level += 1
    return True`,
    javascript: `function isEvenOddTree(root) {
  const queue = [root];
  let level = 0;
  while (queue.length) {
    let prev = level % 2 === 0 ? -Infinity : Infinity;
    const size = queue.length;
    for (let i = 0; i < size; i++) {
      const node = queue.shift();
      if (level % 2 === 0) {
        if (node.val % 2 === 0 || node.val <= prev) return false;
      } else {
        if (node.val % 2 === 1 || node.val >= prev) return false;
      }
      prev = node.val;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    level++;
  }
  return true;
}`,
    java: `public boolean isEvenOddTree(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int level = 0;
    while (!queue.isEmpty()) {
        int size = queue.size(), prev = level % 2 == 0 ? 0 : Integer.MAX_VALUE;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (level % 2 == 0 && (node.val % 2 == 0 || node.val <= prev)) return false;
            if (level % 2 == 1 && (node.val % 2 == 1 || node.val >= prev)) return false;
            prev = node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        level++;
    }
    return true;
}`,
  },
  defaultInput: { tree: [1, 10, 4, 3, null, 7, 9, 12, 8, 6, null, null, 2] },
  inputFields: [
    {
      name: 'tree',
      label: 'Binary Tree (level-order)',
      type: 'tree',
      defaultValue: [1, 10, 4, 3, null, 7, 9, 12, 8, 6, null, null, 2],
      placeholder: 'e.g. 1,10,4,3,null,7,9',
      helperText: 'Level-order array. Use null for missing nodes.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const tree = (input.tree as (number | null)[]).slice();
    const steps: AlgorithmStep[] = [];

    function makeViz(highlights: Record<number, string>): TreeVisualization {
      return { type: 'tree', nodes: tree.slice(), highlights };
    }

    if (tree.length === 0 || tree[0] == null) {
      steps.push({ line: 2, explanation: 'Tree is empty. Return true.', variables: { result: true }, visualization: makeViz({}) });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: 'Check Even-Odd Tree property. Even levels: odd values, strictly increasing. Odd levels: even values, strictly decreasing.',
      variables: { root: tree[0] },
      visualization: makeViz({ 0: 'active' }),
    });

    let current: number[] = [0];
    let level = 0;
    const processed = new Set<number>();
    let isValid = true;

    while (current.length > 0 && isValid) {
      const valid = current.filter(i => i < tree.length && tree[i] != null);
      if (valid.length === 0) break;

      const next: number[] = [];
      let prev = level % 2 === 0 ? -Infinity : Infinity;
      const levelHighlights: Record<number, string> = {};
      processed.forEach(i => { levelHighlights[i] = 'visited'; });

      for (const idx of valid) {
        const val = tree[idx] as number;
        processed.add(idx);
        const l = 2 * idx + 1, r = 2 * idx + 2;
        if (l < tree.length && tree[l] != null) next.push(l);
        if (r < tree.length && tree[r] != null) next.push(r);

        let ok = true;
        if (level % 2 === 0) {
          ok = val % 2 === 1 && val > prev;
        } else {
          ok = val % 2 === 0 && val < prev;
        }

        levelHighlights[idx] = ok ? 'found' : 'mismatch';
        prev = val;

        if (!ok) isValid = false;
      }

      steps.push({
        line: 5,
        explanation: `Level ${level} (${level % 2 === 0 ? 'even' : 'odd'}): values=[${valid.map(i => tree[i]).join(',')}]. Rule=${level % 2 === 0 ? 'odd, increasing' : 'even, decreasing'}. Valid=${isValid}.`,
        variables: { level, values: valid.map(i => tree[i]), isValid },
        visualization: makeViz(levelHighlights),
      });

      current = next;
      level++;
    }

    const finalHighlights: Record<number, string> = {};
    processed.forEach(i => { finalHighlights[i] = isValid ? 'found' : 'mismatch'; });

    steps.push({
      line: 12,
      explanation: `isEvenOddTree = ${isValid}.`,
      variables: { result: isValid },
      visualization: makeViz(finalHighlights),
    });

    return steps;
  },
};

export default evenOddTree;
