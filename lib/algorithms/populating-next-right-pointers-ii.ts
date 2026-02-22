import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const populatingNextRightPointersIi: AlgorithmDefinition = {
  id: 'populating-next-right-pointers-ii',
  title: 'Populating Next Right Pointers in Each Node II',
  leetcodeNumber: 117,
  difficulty: 'Medium',
  category: 'Tree',
  description:
    'Given a binary tree (not necessarily perfect), populate each next pointer to point to its next right node. If there is no next right node, the next pointer is set to null. Uses a BFS level-order approach with O(1) extra space using the next pointers already established at the previous level.',
  tags: ['tree', 'bfs', 'linked list', 'level order'],

  code: {
    pseudocode: `function connect(root):
  cur = root
  while cur is not null:
    dummy = new Node(0)
    tail = dummy
    # Build next level linked list
    while cur is not null:
      if cur.left is not null:
        tail.next = cur.left
        tail = tail.next
      if cur.right is not null:
        tail.next = cur.right
        tail = tail.next
      cur = cur.next
    cur = dummy.next  # move to next level
  return root`,
    python: `def connect(root):
    cur = root
    while cur:
        dummy = Node(0)
        tail = dummy
        while cur:
            if cur.left:
                tail.next = cur.left
                tail = tail.next
            if cur.right:
                tail.next = cur.right
                tail = tail.next
            cur = cur.next
        cur = dummy.next
    return root`,
    javascript: `function connect(root) {
  let cur = root;
  while (cur) {
    const dummy = new Node(0);
    let tail = dummy;
    while (cur) {
      if (cur.left) { tail.next = cur.left; tail = tail.next; }
      if (cur.right) { tail.next = cur.right; tail = tail.next; }
      cur = cur.next;
    }
    cur = dummy.next;
  }
  return root;
}`,
    java: `public Node connect(Node root) {
    Node cur = root;
    while (cur != null) {
        Node dummy = new Node(0);
        Node tail = dummy;
        while (cur != null) {
            if (cur.left != null) { tail.next = cur.left; tail = tail.next; }
            if (cur.right != null) { tail.next = cur.right; tail = tail.next; }
            cur = cur.next;
        }
        cur = dummy.next;
    }
    return root;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5, 0, 7],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Tree (level-order, 0 = null)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 0, 7],
      placeholder: '1,2,3,4,5,0,7',
      helperText: 'Level-order binary tree (0 = null node)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: 'Connect nodes at same level using next pointers. Process level by level using the next pointers of the current level.',
      variables: { level: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'root' }),
    });

    // Build level groups
    const levels: number[][] = [];
    let queue = [0];
    while (queue.length > 0) {
      const level: number[] = [];
      const next: number[] = [];
      for (const idx of queue) {
        if (idx < nums.length && nums[idx] !== 0) {
          level.push(idx);
          const l = 2 * idx + 1;
          const r = 2 * idx + 2;
          if (l < nums.length && nums[l] !== 0) next.push(l);
          if (r < nums.length && nums[r] !== 0) next.push(r);
        }
      }
      if (level.length > 0) levels.push(level);
      queue = next;
    }

    for (let lvl = 0; lvl < levels.length; lvl++) {
      const level = levels[lvl];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      level.forEach((idx, pos) => {
        highlights[idx] = 'active';
        labels[idx] = pos < level.length - 1 ? `${nums[idx]}->` : `${nums[idx]}->N`;
      });

      steps.push({
        line: 4,
        explanation: `Level ${lvl}: nodes [${level.map(i => nums[i]).join(', ')}]. Connect each to its next right neighbor.`,
        variables: { level: lvl, nodes: level.map(i => nums[i]) },
        visualization: makeViz(highlights, labels),
      });

      for (let i = 0; i < level.length - 1; i++) {
        const cur = level[i];
        const nxt = level[i + 1];
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        h[cur] = 'comparing';
        h[nxt] = 'pointer';
        l[cur] = 'cur';
        l[nxt] = 'next';
        steps.push({
          line: 9,
          explanation: `Connect node ${nums[cur]} -> node ${nums[nxt]} (same level next pointer).`,
          variables: { from: nums[cur], to: nums[nxt] },
          visualization: makeViz(h, l),
        });
      }

      // Mark last node next = null
      const last = level[level.length - 1];
      steps.push({
        line: 11,
        explanation: `Node ${nums[last]} is the last at level ${lvl}. Its next pointer = null.`,
        variables: { node: nums[last], next: 'null' },
        visualization: makeViz({ [last]: 'found' }, { [last]: 'null' }),
      });
    }

    const allHighlights: Record<number, string> = {};
    levels.flat().forEach(idx => { allHighlights[idx] = 'sorted'; });

    steps.push({
      line: 14,
      explanation: 'All next pointers populated. Each node points to its right neighbor at the same level.',
      variables: { done: true },
      visualization: makeViz(allHighlights, {}),
    });

    return steps;
  },
};

export default populatingNextRightPointersIi;
