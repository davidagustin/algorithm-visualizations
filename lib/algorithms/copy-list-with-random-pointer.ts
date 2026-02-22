import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const copyListWithRandomPointer: AlgorithmDefinition = {
  id: 'copy-list-with-random-pointer',
  title: 'Copy List with Random Pointer',
  leetcodeNumber: 138,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Deep copy a linked list where each node has a next pointer and a random pointer. Uses a hash map to map original nodes to their copies, then sets next and random pointers in a second pass.',
  tags: ['linked list', 'hash map', 'deep copy', 'two-pass'],

  code: {
    pseudocode: `function copyRandomList(head):
  if not head: return null
  map = {}  // original → copy
  // Pass 1: create all copies
  curr = head
  while curr:
    map[curr] = Node(curr.val)
    curr = curr.next
  // Pass 2: set next and random
  curr = head
  while curr:
    if curr.next: map[curr].next = map[curr.next]
    if curr.random: map[curr].random = map[curr.random]
    curr = curr.next
  return map[head]`,

    python: `def copyRandomList(head):
    if not head:
        return None
    node_map = {}
    curr = head
    while curr:
        node_map[curr] = Node(curr.val)
        curr = curr.next
    curr = head
    while curr:
        if curr.next:
            node_map[curr].next = node_map[curr.next]
        if curr.random:
            node_map[curr].random = node_map[curr.random]
        curr = curr.next
    return node_map[head]`,

    javascript: `function copyRandomList(head) {
  if (!head) return null;
  const map = new Map();
  let curr = head;
  while (curr) { map.set(curr, { val: curr.val, next: null, random: null }); curr = curr.next; }
  curr = head;
  while (curr) {
    if (curr.next) map.get(curr).next = map.get(curr.next);
    if (curr.random) map.get(curr).random = map.get(curr.random);
    curr = curr.next;
  }
  return map.get(head);
}`,

    java: `public Node copyRandomList(Node head) {
    if (head == null) return null;
    Map<Node, Node> map = new HashMap<>();
    Node curr = head;
    while (curr != null) { map.put(curr, new Node(curr.val)); curr = curr.next; }
    curr = head;
    while (curr != null) {
        if (curr.next != null) map.get(curr).next = map.get(curr.next);
        if (curr.random != null) map.get(curr).random = map.get(curr.random);
        curr = curr.next;
    }
    return map.get(head);
}`,
  },

  defaultInput: {
    values: [7, 13, 11, 10, 1],
    random: [null, 0, 4, 2, 0],
  },

  inputFields: [
    {
      name: 'values',
      label: 'Node Values',
      type: 'array',
      defaultValue: [7, 13, 11, 10, 1],
      placeholder: '7,13,11,10,1',
      helperText: 'Values of the linked list nodes',
    },
    {
      name: 'random',
      label: 'Random Pointer Indices (null or index)',
      type: 'array',
      defaultValue: [null, 0, 4, 2, 0],
      placeholder: 'null,0,4,2,0',
      helperText: 'Index of the node each random pointer points to (null = no random)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]) || [7, 13, 11, 10, 1];
    const random = (input.random as (number | null)[]) || [null, 0, 4, 2, 0];
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      phase: string,
      mapEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: values,
      highlights,
      labels,
      auxData: {
        label: `Phase: ${phase}`,
        entries: mapEntries,
      },
    });

    steps.push({
      line: 2,
      explanation: `Start Pass 1: traverse original list and create a copy of each node. Map original → copy.`,
      variables: { n, values },
      visualization: makeViz(
        {},
        Object.fromEntries(values.map((_, i) => [i, `n${i}`])),
        'Pass 1: Create copies',
        []
      ),
    });

    const mapEntries: { key: string; value: string }[] = [];

    for (let i = 0; i < n; i++) {
      mapEntries.push({ key: `node[${i}](${values[i]})`, value: `copy[${i}](${values[i]})` });

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let j = 0; j < i; j++) { h[j] = 'visited'; l[j] = `copied`; }
      h[i] = 'active';
      l[i] = 'curr';

      steps.push({
        line: 6,
        explanation: `Create copy of node[${i}] (val=${values[i]}). Add to hash map. Map now has ${i + 1} entries.`,
        variables: { index: i, val: values[i], mapSize: i + 1 },
        visualization: makeViz(h, l, 'Pass 1: Create copies', [...mapEntries]),
      });
    }

    steps.push({
      line: 9,
      explanation: `Pass 1 complete. All ${n} nodes copied. Now Pass 2: set next and random pointers using the map.`,
      variables: { mapSize: n },
      visualization: makeViz(
        Object.fromEntries(values.map((_, i) => [i, 'found'])),
        Object.fromEntries(values.map((_, i) => [i, `node[${i}]`])),
        'Pass 2: Set pointers',
        [...mapEntries]
      ),
    });

    for (let i = 0; i < n; i++) {
      const nextStr = i + 1 < n ? `copy[${i + 1}](${values[i + 1]})` : 'null';
      const randStr = random[i] !== null ? `copy[${random[i]}](${values[random[i] as number]})` : 'null';

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      h[i] = 'active';
      l[i] = 'curr';
      if (i + 1 < n) { h[i + 1] = 'pointer'; l[i + 1] = 'next'; }
      if (random[i] !== null && random[i] !== i && random[i] !== i + 1) {
        h[random[i] as number] = 'comparing';
        l[random[i] as number] = 'random';
      }

      steps.push({
        line: 12,
        explanation: `Set copy[${i}].next = ${nextStr}. Set copy[${i}].random = ${randStr}.`,
        variables: {
          index: i,
          val: values[i],
          nextPtr: nextStr,
          randomPtr: randStr,
        },
        visualization: makeViz(h, l, 'Pass 2: Set pointers', [...mapEntries]),
      });
    }

    steps.push({
      line: 15,
      explanation: `Deep copy complete! Returned copy[0] as the new head. All next and random pointers correctly set.`,
      variables: { result: 'copy[0]', values, random },
      visualization: makeViz(
        Object.fromEntries(values.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(values.map((_, i) => [i, `copy[${i}]`])),
        'Complete',
        mapEntries
      ),
    });

    return steps;
  },
};

export default copyListWithRandomPointer;
