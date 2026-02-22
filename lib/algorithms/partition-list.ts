import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const partitionList: AlgorithmDefinition = {
  id: 'partition-list',
  title: 'Partition List',
  leetcodeNumber: 86,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a linked list and a value x, partition the list so all nodes with values less than x come before nodes with values >= x. Maintain the original relative order within each partition.',
  tags: ['linked list', 'two pointers', 'partition', 'stable sort'],

  code: {
    pseudocode: `function partition(head, x):
  lessHead = ListNode(0)
  greaterHead = ListNode(0)
  less = lessHead
  greater = greaterHead
  curr = head
  while curr:
    if curr.val < x:
      less.next = curr; less = less.next
    else:
      greater.next = curr; greater = greater.next
    curr = curr.next
  greater.next = null
  less.next = greaterHead.next
  return lessHead.next`,

    python: `def partition(head, x: int):
    less_head = ListNode(0)
    greater_head = ListNode(0)
    less = less_head
    greater = greater_head
    curr = head
    while curr:
        if curr.val < x:
            less.next = curr
            less = less.next
        else:
            greater.next = curr
            greater = greater.next
        curr = curr.next
    greater.next = None
    less.next = greater_head.next
    return less_head.next`,

    javascript: `function partition(head, x) {
  let lessHead = new ListNode(0), greaterHead = new ListNode(0);
  let less = lessHead, greater = greaterHead, curr = head;
  while (curr) {
    if (curr.val < x) { less.next = curr; less = less.next; }
    else { greater.next = curr; greater = greater.next; }
    curr = curr.next;
  }
  greater.next = null;
  less.next = greaterHead.next;
  return lessHead.next;
}`,

    java: `public ListNode partition(ListNode head, int x) {
    ListNode lessHead = new ListNode(0), greaterHead = new ListNode(0);
    ListNode less = lessHead, greater = greaterHead, curr = head;
    while (curr != null) {
        if (curr.val < x) { less.next = curr; less = less.next; }
        else { greater.next = curr; greater = greater.next; }
        curr = curr.next;
    }
    greater.next = null;
    less.next = greaterHead.next;
    return lessHead.next;
}`,
  },

  defaultInput: { values: [1, 4, 3, 2, 5, 2], x: 3 },

  inputFields: [
    {
      name: 'values',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [1, 4, 3, 2, 5, 2],
      placeholder: '1,4,3,2,5,2',
      helperText: 'Node values of the linked list',
    },
    {
      name: 'x',
      label: 'Partition Value (x)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Values < x go to the left partition',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const values = (input.values as number[]) || [1, 4, 3, 2, 5, 2];
    const x = (input.x as number) ?? 3;
    const steps: AlgorithmStep[] = [];
    const n = values.length;

    const lessChain: number[] = [];
    const greaterChain: number[] = [];

    const makeViz = (
      currIdx: number,
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: values,
      highlights,
      labels,
      auxData: {
        label: `Partition by x=${x}`,
        entries: [
          { key: `< ${x} (less)`, value: lessChain.join(' → ') || 'empty' },
          { key: `>= ${x} (greater)`, value: greaterChain.join(' → ') || 'empty' },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Create two dummy heads: lessHead and greaterHead. Traverse and route each node to the appropriate chain based on x=${x}.`,
      variables: { x, n, lessChain: [], greaterChain: [] },
      visualization: makeViz(-1, {}, { 0: 'curr' }),
    });

    for (let i = 0; i < n; i++) {
      const val = values[i];
      const isLess = val < x;

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let j = 0; j < i; j++) h[j] = values[j] < x ? 'found' : 'active';
      h[i] = isLess ? 'comparing' : 'mismatch';
      l[i] = 'curr';

      steps.push({
        line: 7,
        explanation: `curr=${val}. ${val} ${isLess ? '<' : '>='} x=${x}. Append to ${isLess ? 'less' : 'greater'} chain.`,
        variables: { curr: val, x, isLess, lessChain: [...lessChain], greaterChain: [...greaterChain] },
        visualization: makeViz(i, h, l),
      });

      if (isLess) lessChain.push(val);
      else greaterChain.push(val);

      const h2: Record<number, string> = {};
      for (let j = 0; j <= i; j++) h2[j] = values[j] < x ? 'found' : 'active';

      steps.push({
        line: 8,
        explanation: `Added ${val} to ${isLess ? 'less' : 'greater'} chain. Less=[${lessChain.join(',')}], Greater=[${greaterChain.join(',')}].`,
        variables: { lessChain: [...lessChain], greaterChain: [...greaterChain] },
        visualization: makeViz(i, h2, { [i]: isLess ? 'to less' : 'to greater' }),
      });
    }

    steps.push({
      line: 12,
      explanation: `Connect: less chain tail → greaterHead.next. Result: [${[...lessChain, ...greaterChain].join(' → ')}].`,
      variables: { lessChain, greaterChain, result: [...lessChain, ...greaterChain] },
      visualization: makeViz(n, {}, {}),
    });

    const result = [...lessChain, ...greaterChain];

    steps.push({
      line: 13,
      explanation: `Partition complete! All values < ${x} come before values >= ${x}: ${result.join(' → ')}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: result,
        highlights: {
          ...Object.fromEntries(lessChain.map((_, i) => [i, 'found'])),
          ...Object.fromEntries(greaterChain.map((_, i) => [lessChain.length + i, 'active'])),
        },
        labels: {
          0: 'head',
          [lessChain.length - 1]: `< ${x} end`,
          [lessChain.length]: `>= ${x} start`,
          [result.length - 1]: 'tail',
        },
      },
    });

    return steps;
  },
};

export default partitionList;
