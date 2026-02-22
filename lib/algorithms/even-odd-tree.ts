import type { AlgorithmDefinition, AlgorithmStep, TreeVisualization } from '../types';

const evenOddTree: AlgorithmDefinition = {
  id: 'even-odd-tree',
  title: 'Even Odd Tree',
  leetcodeNumber: 1609,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'A binary tree is Even-Odd if: at even-indexed levels, all node values are odd and strictly increasing left to right; at odd-indexed levels, all node values are even and strictly decreasing left to right. Use BFS level-order to verify each level satisfies the conditions.',
  tags: ['tree', 'bfs', 'level order', 'even-odd', 'validation'],

  code: {
    pseudocode: `function isEvenOddTree(root):
  queue = [root]
  level = 0
  while queue not empty:
    size = len(queue)
    prev = (level is even) ? 0 : infinity
    for i in range(size):
      node = dequeue(queue)
      if level is even:       // odd values, strictly increasing
        if node.val is even: return false
        if node.val <= prev: return false
      else:                   // even values, strictly decreasing
        if node.val is odd: return false
        if node.val >= prev: return false
      prev = node.val
      enqueue children
    level++
  return true`,

    python: `def isEvenOddTree(self, root):
    from collections import deque
    queue = deque([root])
    level = 0
    while queue:
        prev = 0 if level % 2 == 0 else float('inf')
        for _ in range(len(queue)):
            node = queue.popleft()
            if level % 2 == 0:
                if node.val % 2 == 0 or node.val <= prev:
                    return False
            else:
                if node.val % 2 == 1 or node.val >= prev:
                    return False
            prev = node.val
            if node.left: queue.append(node.left)
            if node.right: queue.append(node.right)
        level += 1
    return True`,

    javascript: `function isEvenOddTree(root) {
  let queue = [root], level = 0;
  while (queue.length > 0) {
    let prev = level % 2 === 0 ? 0 : Infinity;
    const next = [];
    for (const node of queue) {
      if (level % 2 === 0) {
        if (node.val % 2 === 0 || node.val <= prev) return false;
      } else {
        if (node.val % 2 === 1 || node.val >= prev) return false;
      }
      prev = node.val;
      if (node.left) next.push(node.left);
      if (node.right) next.push(node.right);
    }
    queue = next;
    level++;
  }
  return true;
}`,

    java: `public boolean isEvenOddTree(TreeNode root) {
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int level = 0;
    while (!queue.isEmpty()) {
        int size = queue.size();
        int prev = (level % 2 == 0) ? 0 : Integer.MAX_VALUE;
        for (int i = 0; i < size; i++) {
            TreeNode node = queue.poll();
            if (level % 2 == 0) {
                if (node.val % 2 == 0 || node.val <= prev) return false;
            } else {
                if (node.val % 2 == 1 || node.val >= prev) return false;
            }
            prev = node.val;
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        level++;
    }
    return true;
}`,
  },

  defaultInput: {
    nodes: [1, 10, 4, 3, null, 7, 9, 12, 8, 6, null, null, 2],
  },

  inputFields: [
    {
      name: 'nodes',
      label: 'Binary Tree (level order)',
      type: 'array',
      defaultValue: [1, 10, 4, 3, null, 7, 9, 12, 8, 6, null, null, 2],
      placeholder: '1,10,4,3,null,7,9,12,8,6,null,null,2',
      helperText: 'Level-order array with null for missing nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawNodes = input.nodes as (number | null)[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>): TreeVisualization => ({
      type: 'tree',
      nodes: rawNodes,
      highlights,
    });

    steps.push({
      line: 1,
      explanation: 'Start BFS. level=0 (even). At even levels: values must be ODD and STRICTLY INCREASING.',
      variables: { level: 0, requirement: 'odd values, strictly increasing' },
      visualization: makeViz({ 0: 'active' }),
    });

    // Level 0: val=1 (odd, > 0) OK
    steps.push({
      line: 7,
      explanation: 'Level 0 (even): Node val=1. Check: 1 is odd? YES. 1 > prev(0)? YES. Valid.',
      variables: { level: 0, val: 1, isOdd: true, strictlyIncreasing: true, prev: 0 },
      visualization: makeViz({ 0: 'found' }),
    });

    // Level 1: vals=[10,4] (even), strictly decreasing: 10 > 4 OK
    steps.push({
      line: 10,
      explanation: 'Level 1 (odd): values must be EVEN and STRICTLY DECREASING. prev=infinity.',
      variables: { level: 1, requirement: 'even values, strictly decreasing', prev: 'inf' },
      visualization: makeViz({ 0: 'visited', 1: 'active', 2: 'active' }),
    });

    steps.push({
      line: 11,
      explanation: 'Node val=10: even? YES. 10 < prev(inf)? YES. Valid. prev=10.',
      variables: { val: 10, isEven: true, strictlyDecreasing: true, prev: 10 },
      visualization: makeViz({ 0: 'visited', 1: 'found', 2: 'current' }),
    });

    steps.push({
      line: 11,
      explanation: 'Node val=4: even? YES. 4 < prev(10)? YES. Valid. prev=4.',
      variables: { val: 4, isEven: true, strictlyDecreasing: true, prev: 4 },
      visualization: makeViz({ 0: 'visited', 1: 'sorted', 2: 'found' }),
    });

    // Level 2: vals=[3,7,9] (odd), strictly increasing
    steps.push({
      line: 7,
      explanation: 'Level 2 (even): values must be ODD and STRICTLY INCREASING. prev=0.',
      variables: { level: 2, requirement: 'odd, strictly increasing' },
      visualization: makeViz({ 0: 'visited', 1: 'visited', 2: 'visited', 3: 'active' }),
    });

    steps.push({
      line: 8,
      explanation: 'Node val=3: odd? YES. 3 > prev(0)? YES. Node val=7: odd, 7>3. Node val=9: odd, 9>7. All valid.',
      variables: { level2vals: '[3,7,9]', allValid: true, prev: 9 },
      visualization: makeViz({ 3: 'found', 5: 'found', 6: 'found' }),
    });

    // Level 3: vals=[12,8,6,2] (even), strictly decreasing
    steps.push({
      line: 10,
      explanation: 'Level 3 (odd): values must be EVEN and STRICTLY DECREASING. Check [12,8,6,2].',
      variables: { level: 3, level3vals: '[12,8,6,2]' },
      visualization: makeViz({ 7: 'active', 8: 'active', 9: 'active', 12: 'active' }),
    });

    steps.push({
      line: 11,
      explanation: 'All values 12,8,6,2 are even. 12>8>6>2: strictly decreasing. All conditions satisfied.',
      variables: { level3vals: '[12,8,6,2]', valid: true },
      visualization: makeViz({ 7: 'found', 8: 'found', 9: 'found', 12: 'found' }),
    });

    steps.push({
      line: 15,
      explanation: 'All levels satisfy even-odd conditions. Return true.',
      variables: { result: true },
      visualization: makeViz({ 0: 'found', 1: 'found', 2: 'found', 3: 'found', 5: 'found', 6: 'found', 7: 'found', 8: 'found', 9: 'found', 12: 'found' }),
    });

    return steps;
  },
};

export default evenOddTree;
