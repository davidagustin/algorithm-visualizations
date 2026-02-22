import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const deepCopyLinkedListWithRandom: AlgorithmDefinition = {
  id: 'deep-copy-linked-list-with-random',
  title: 'Copy List with Random Pointer (Hash Map)',
  leetcodeNumber: 138,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Create a deep copy of a linked list where each node has a next and a random pointer. Use a hash map to map each original node to its copy. First pass creates all copies. Second pass assigns next and random pointers using the hash map.',
  tags: ['linked list', 'hash map', 'deep copy', 'random pointer'],

  code: {
    pseudocode: `function copyRandomList(head):
  if head is null: return null
  map = {}
  // First pass: create all copies
  cur = head
  while cur:
    map[cur] = Node(cur.val)
    cur = cur.next
  // Second pass: assign pointers
  cur = head
  while cur:
    if cur.next: map[cur].next = map[cur.next]
    if cur.random: map[cur].random = map[cur.random]
    cur = cur.next
  return map[head]`,

    python: `def copyRandomList(head):
    if not head: return None
    node_map = {}
    cur = head
    while cur:
        node_map[cur] = Node(cur.val)
        cur = cur.next
    cur = head
    while cur:
        if cur.next:
            node_map[cur].next = node_map[cur.next]
        if cur.random:
            node_map[cur].random = node_map[cur.random]
        cur = cur.next
    return node_map[head]`,

    javascript: `function copyRandomList(head) {
  if (!head) return null;
  const map = new Map();
  let cur = head;
  while (cur) { map.set(cur, { val: cur.val, next: null, random: null }); cur = cur.next; }
  cur = head;
  while (cur) {
    if (cur.next) map.get(cur).next = map.get(cur.next);
    if (cur.random) map.get(cur).random = map.get(cur.random);
    cur = cur.next;
  }
  return map.get(head);
}`,

    java: `public Node copyRandomList(Node head) {
    if (head == null) return null;
    Map<Node, Node> map = new HashMap<>();
    Node cur = head;
    while (cur != null) {
        map.put(cur, new Node(cur.val));
        cur = cur.next;
    }
    cur = head;
    while (cur != null) {
        if (cur.next != null) map.get(cur).next = map.get(cur.next);
        if (cur.random != null) map.get(cur).random = map.get(cur.random);
        cur = cur.next;
    }
    return map.get(head);
}`,
  },

  defaultInput: {
    nums: [7, 13, 11, 10, 1],
    target: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Node values',
      type: 'array',
      defaultValue: [7, 13, 11, 10, 1],
      placeholder: '7,13,11,10,1',
      helperText: 'Values of linked list nodes',
    },
    {
      name: 'target',
      label: 'Random pointer source index',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Index of node whose random pointer is visualized',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const randomSrc = input.target as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Deep copy linked list with random pointers. ${n} nodes. Use hash map: original -> copy.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    // First pass
    steps.push({
      line: 4,
      explanation: 'First pass: create a copy of every node and store in hash map (original -> copy).',
      variables: { pass: 1 },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 6,
        explanation: `Create copy of node[${i}] (value=${nums[i]}). map[original[${i}]] = Node(${nums[i]}).`,
        variables: { index: i, value: nums[i] },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: `orig[${i}]` }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: 'All nodes copied. Second pass: assign next and random pointers using the map.',
      variables: { pass: 2, nodesCreated: n },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    // Second pass
    for (let i = 0; i < n; i++) {
      const hasRandom = i === randomSrc && Math.floor(n / 2) !== i;
      const randomTarget = hasRandom ? Math.floor(n / 2) : null;

      steps.push({
        line: 12,
        explanation: `Node[${i}]: copy.next = copy of node[${Math.min(i + 1, n - 1)}]${hasRandom ? `. copy.random = copy of node[${randomTarget}]` : '. no random pointer'}.`,
        variables: { index: i, nextIdx: i + 1 < n ? i + 1 : 'null', randomIdx: randomTarget !== null ? randomTarget : 'null' },
        visualization: makeViz(
          {
            [i]: 'active',
            ...(i + 1 < n ? { [i + 1]: 'comparing' } : {}),
            ...(randomTarget !== null ? { [randomTarget]: 'pointer' } : {}),
          },
          {
            [i]: 'cur',
            ...(i + 1 < n ? { [i + 1]: 'next' } : {}),
            ...(randomTarget !== null ? { [randomTarget]: 'random' } : {}),
          }
        ),
      });
    }

    steps.push({
      line: 15,
      explanation: `Deep copy complete. New list of ${n} nodes with all next and random pointers correctly assigned.`,
      variables: { result: 'deep copy created', nodes: n },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: 'copy_head' }
      ),
    });

    return steps;
  },
};

export default deepCopyLinkedListWithRandom;
