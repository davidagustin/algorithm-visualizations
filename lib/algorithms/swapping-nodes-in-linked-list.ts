import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const swappingNodesInLinkedList: AlgorithmDefinition = {
  id: 'swapping-nodes-in-linked-list',
  title: 'Swapping Nodes in a Linked List',
  leetcodeNumber: 1721,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list and an integer k, swap the values of the kth node from the beginning and the kth node from the end. Find the kth node from the beginning directly. Then use two pointers: advance one pointer k steps, then advance both until the leading pointer reaches the end.',
  tags: ['linked list', 'two pointers'],

  code: {
    pseudocode: `function swapNodes(head, k):
  // Find kth from beginning
  first = head
  for i in range(k - 1):
    first = first.next
  // Find kth from end using two pointers
  second = head
  cur = first.next
  while cur != null:
    second = second.next
    cur = cur.next
  // Swap values
  swap(first.val, second.val)
  return head`,

    python: `def swapNodes(head, k):
    first = head
    for _ in range(k - 1): first = first.next
    second, cur = head, first.next
    while cur:
        second = second.next
        cur = cur.next
    first.val, second.val = second.val, first.val
    return head`,

    javascript: `function swapNodes(head, k) {
  let first = head;
  for (let i = 1; i < k; i++) first = first.next;
  let second = head, cur = first.next;
  while (cur) { second = second.next; cur = cur.next; }
  [first.val, second.val] = [second.val, first.val];
  return head;
}`,

    java: `public ListNode swapNodes(ListNode head, int k) {
    ListNode first = head;
    for (int i = 1; i < k; i++) first = first.next;
    ListNode second = head, cur = first.next;
    while (cur != null) { second = second.next; cur = cur.next; }
    int tmp = first.val; first.val = second.val; second.val = tmp;
    return head;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 4, 5],
    k: 2,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Comma-separated integers representing linked list',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Swap kth from beginning with kth from end (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const arr = [...nums];

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

    const firstIdx = k - 1;
    const secondIdx = n - k;

    steps.push({
      line: 1,
      explanation: `Swap kth node from beginning (k=${k}) with kth from end. List: [${arr.join(', ')}].`,
      variables: { k, 'list length': n },
      visualization: makeViz([...arr], { 0: 'active' }, { 0: 'start' }),
    });

    // Find first (kth from beginning)
    for (let i = 0; i < k - 1; i++) {
      steps.push({
        line: 3,
        explanation: `Advance to find kth from beginning: step ${i + 1} of ${k - 1}. Now at index ${i + 1}.`,
        variables: { step: i + 1, index: i + 1 },
        visualization: makeViz([...arr], { [i + 1]: 'active' }, { [i + 1]: 'advancing' }),
      });
    }

    steps.push({
      line: 4,
      explanation: `Found kth from beginning: index ${firstIdx} (value ${arr[firstIdx]}).`,
      variables: { 'first index': firstIdx, 'first value': arr[firstIdx] },
      visualization: makeViz([...arr], { [firstIdx]: 'found' }, { [firstIdx]: `1st(k=${k})` }),
    });

    // Find second (kth from end) using two pointers
    steps.push({
      line: 6,
      explanation: `Initialize second pointer at head. Advance cur = first.next. Both pointers move together until cur reaches null.`,
      variables: { second: 0, cur: firstIdx + 1 },
      visualization: makeViz([...arr], { [firstIdx]: 'found', 0: 'active', [firstIdx + 1]: 'pointer' }, { [firstIdx]: '1st', 0: '2nd', [firstIdx + 1]: 'cur' }),
    });

    let second = 0;
    let cur = firstIdx + 1;
    while (cur < n) {
      second++;
      cur++;
      steps.push({
        line: 8,
        explanation: `Advance second to index ${second} (value ${arr[second]}), cur to index ${cur < n ? cur : 'end'}.`,
        variables: { second, cur: Math.min(cur, n) },
        visualization: makeViz([...arr], { [firstIdx]: 'found', [second]: 'active', ...(cur < n ? { [cur]: 'pointer' } : {}) }, { [firstIdx]: '1st', [second]: '2nd', ...(cur < n ? { [cur]: 'cur' } : {}) }),
      });
    }

    steps.push({
      line: 10,
      explanation: `Found kth from end: index ${second} (value ${arr[second]}). Now swap values: ${arr[firstIdx]} <-> ${arr[second]}.`,
      variables: { 'second index': second, 'second value': arr[second], 'first value': arr[firstIdx] },
      visualization: makeViz([...arr], { [firstIdx]: 'swapping', [second]: 'swapping' }, { [firstIdx]: 'swap A', [second]: 'swap B' }),
    });

    const tmp = arr[firstIdx];
    arr[firstIdx] = arr[second];
    arr[second] = tmp;

    steps.push({
      line: 11,
      explanation: `Swap complete. Result: [${arr.join(', ')}]. Positions ${firstIdx} and ${second} have been swapped.`,
      variables: { result: arr },
      visualization: makeViz([...arr], { [firstIdx]: 'found', [second]: 'found' }, { [firstIdx]: 'swapped', [second]: 'swapped' }),
    });

    return steps;
  },
};

export default swappingNodesInLinkedList;
