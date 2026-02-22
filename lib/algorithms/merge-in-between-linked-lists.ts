import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mergeInBetweenLinkedLists: AlgorithmDefinition = {
  id: 'merge-in-between-linked-lists',
  title: 'Merge In Between Linked Lists',
  leetcodeNumber: 1669,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given two linked lists list1 and list2, and integers a and b, remove nodes from list1 from index a to index b (inclusive), and put list2 in their place. Find node at index a-1 (nodeA) and node at index b+1 (nodeB), then connect nodeA to list2 head and list2 tail to nodeB.',
  tags: ['linked list', 'pointer manipulation'],

  code: {
    pseudocode: `function mergeInBetween(list1, a, b, list2):
  nodeA = list1 at index a-1
  nodeB = list1 at index b+1
  nodeA.next = list2
  tail2 = list2 tail
  tail2.next = nodeB
  return list1`,

    python: `def mergeInBetween(list1, a, b, list2):
    cur = list1
    for i in range(a - 1): cur = cur.next
    nodeA = cur
    for i in range(b - a + 2): cur = cur.next
    nodeB = cur
    nodeA.next = list2
    cur = list2
    while cur.next: cur = cur.next
    cur.next = nodeB
    return list1`,

    javascript: `function mergeInBetween(list1, a, b, list2) {
  let cur = list1;
  for (let i = 0; i < a - 1; i++) cur = cur.next;
  const nodeA = cur;
  for (let i = 0; i < b - a + 2; i++) cur = cur.next;
  const nodeB = cur;
  nodeA.next = list2;
  cur = list2;
  while (cur.next) cur = cur.next;
  cur.next = nodeB;
  return list1;
}`,

    java: `public ListNode mergeInBetween(ListNode list1, int a, int b, ListNode list2) {
    ListNode cur = list1;
    for (int i = 0; i < a - 1; i++) cur = cur.next;
    ListNode nodeA = cur;
    for (int i = 0; i < b - a + 2; i++) cur = cur.next;
    ListNode nodeB = cur;
    nodeA.next = list2;
    cur = list2;
    while (cur.next != null) cur = cur.next;
    cur.next = nodeB;
    return list1;
}`,
  },

  defaultInput: {
    list1: [0, 1, 2, 3, 4, 5],
    a: 3,
    b: 4,
    list2: [1000000, 1000001, 1000002],
  },

  inputFields: [
    {
      name: 'list1',
      label: 'List 1',
      type: 'array',
      defaultValue: [0, 1, 2, 3, 4, 5],
      placeholder: '0,1,2,3,4,5',
      helperText: 'First linked list',
    },
    {
      name: 'a',
      label: 'Start Index (a)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Start index of nodes to remove from list1 (inclusive)',
    },
    {
      name: 'b',
      label: 'End Index (b)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'End index of nodes to remove from list1 (inclusive)',
    },
    {
      name: 'list2',
      label: 'List 2',
      type: 'array',
      defaultValue: [1000000, 1000001, 1000002],
      placeholder: '1000000,1000001,1000002',
      helperText: 'List to insert in place of removed nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const list1 = input.list1 as number[];
    const a = input.a as number;
    const b = input.b as number;
    const list2 = input.list2 as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Merge list2 into list1 between indices ${a} and ${b}. Remove nodes at indices ${a}..${b} from list1, insert list2 there.`,
      variables: { a, b, 'list1 length': list1.length, 'list2 length': list2.length },
      visualization: makeViz([...list1],
        { ...Object.fromEntries(Array.from({ length: b - a + 1 }, (_, i) => [a + i, 'mismatch'])), [a - 1]: 'active', [b + 1]: 'pointer' },
        { [a - 1]: 'nodeA', [a]: `del start`, [b]: 'del end', [b + 1]: 'nodeB' }),
    });

    const nodeAIdx = a - 1;
    const nodeBIdx = b + 1;

    steps.push({
      line: 2,
      explanation: `Find nodeA at index ${nodeAIdx} (value ${list1[nodeAIdx]}): the node just before the removed range.`,
      variables: { nodeA: nodeAIdx, 'nodeA value': list1[nodeAIdx] },
      visualization: makeViz([...list1], { [nodeAIdx]: 'found' }, { [nodeAIdx]: 'nodeA' }),
    });

    steps.push({
      line: 3,
      explanation: `Find nodeB at index ${nodeBIdx} (value ${list1[nodeBIdx]}): the node just after the removed range.`,
      variables: { nodeB: nodeBIdx, 'nodeB value': list1[nodeBIdx] },
      visualization: makeViz([...list1],
        { [nodeAIdx]: 'active', [nodeBIdx]: 'found' },
        { [nodeAIdx]: 'nodeA', [nodeBIdx]: 'nodeB' }),
    });

    steps.push({
      line: 4,
      explanation: `Connect nodeA.next = list2 head (value ${list2[0]}). The gap in list1 now points to list2.`,
      variables: { 'nodeA.next': `list2 head (${list2[0]})` },
      visualization: makeViz([...list2], { 0: 'active' }, { 0: 'L2 head' }),
    });

    steps.push({
      line: 5,
      explanation: `Connect list2 tail (value ${list2[list2.length - 1]}) to nodeB (value ${list1[nodeBIdx]}).`,
      variables: { 'list2 tail': list2[list2.length - 1], 'nodeB value': list1[nodeBIdx] },
      visualization: makeViz([...list2], { [list2.length - 1]: 'active' }, { [list2.length - 1]: 'L2 tail' }),
    });

    // Build result
    const result = [...list1.slice(0, a), ...list2, ...list1.slice(b + 1)];

    steps.push({
      line: 7,
      explanation: `Merge complete. Result: [${result.join(', ')}]. Nodes at indices ${a}-${b} replaced with list2.`,
      variables: { result },
      visualization: makeViz([...result],
        { ...Object.fromEntries(Array.from({ length: a }, (_, i) => [i, 'visited'])), ...Object.fromEntries(Array.from({ length: list2.length }, (_, i) => [a + i, 'found'])), ...Object.fromEntries(Array.from({ length: list1.length - b - 1 }, (_, i) => [a + list2.length + i, 'visited'])) },
        { [a - 1]: 'nodeA', [a]: 'L2 start', [a + list2.length - 1]: 'L2 end', [a + list2.length]: 'nodeB' }),
    });

    return steps;
  },
};

export default mergeInBetweenLinkedLists;
