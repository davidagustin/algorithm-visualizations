import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const plusOneLinkedList: AlgorithmDefinition = {
  id: 'plus-one-linked-list',
  title: 'Plus One Linked List',
  leetcodeNumber: 369,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given a number represented as a linked list (most significant digit first), add one to the number. Find the rightmost non-9 digit, increment it, and set all digits to the right to 0. If all digits are 9, prepend a new node with value 1.',
  tags: ['linked list', 'math', 'carry'],

  code: {
    pseudocode: `function plusOne(head):
  sentinel = Node(0)
  sentinel.next = head
  lastNotNine = sentinel
  cur = head
  while cur != null:
    if cur.val != 9:
      lastNotNine = cur
    cur = cur.next
  lastNotNine.val += 1
  cur = lastNotNine.next
  while cur != null:
    cur.val = 0
    cur = cur.next
  return sentinel if sentinel.val != 0 else sentinel.next`,

    python: `def plusOne(head):
    sentinel = ListNode(0)
    sentinel.next = head
    not_nine = sentinel
    cur = head
    while cur:
        if cur.val != 9:
            not_nine = cur
        cur = cur.next
    not_nine.val += 1
    cur = not_nine.next
    while cur:
        cur.val = 0
        cur = cur.next
    return sentinel if sentinel.val != 0 else sentinel.next`,

    javascript: `function plusOne(head) {
  const sentinel = { val: 0, next: head };
  let notNine = sentinel;
  let cur = head;
  while (cur) {
    if (cur.val !== 9) notNine = cur;
    cur = cur.next;
  }
  notNine.val++;
  cur = notNine.next;
  while (cur) {
    cur.val = 0;
    cur = cur.next;
  }
  return sentinel.val !== 0 ? sentinel : sentinel.next;
}`,

    java: `public ListNode plusOne(ListNode head) {
    ListNode sentinel = new ListNode(0);
    sentinel.next = head;
    ListNode notNine = sentinel;
    ListNode cur = head;
    while (cur != null) {
        if (cur.val != 9) notNine = cur;
        cur = cur.next;
    }
    notNine.val++;
    cur = notNine.next;
    while (cur != null) {
        cur.val = 0;
        cur = cur.next;
    }
    return sentinel.val != 0 ? sentinel : sentinel.next;
}`,
  },

  defaultInput: {
    nums: [1, 2, 9, 9],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Number as linked list',
      type: 'array',
      defaultValue: [1, 2, 9, 9],
      placeholder: '1,2,9,9',
      helperText: 'Digits of the number (most significant first)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

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
      explanation: `Add one to number represented as linked list: [${nums.join(' -> ')}]. Find rightmost non-9 digit.`,
      variables: { number: nums.join('') },
      visualization: makeViz([...nums], {}, {}),
    });

    // Find rightmost non-9
    let lastNotNine = -1;
    for (let i = 0; i < n; i++) {
      if (nums[i] !== 9) {
        lastNotNine = i;
      }
      steps.push({
        line: 6,
        explanation: `Check index ${i}: value = ${nums[i]}${nums[i] !== 9 ? ', not 9 - update lastNotNine' : ', is 9 - skip'}.`,
        variables: { index: i, value: nums[i], lastNotNine },
        visualization: makeViz(
          [...nums],
          { [i]: nums[i] !== 9 ? 'active' : 'comparing' },
          { [i]: 'cur', ...(lastNotNine >= 0 ? { [lastNotNine]: 'notNine' } : {}) }
        ),
      });
    }

    const result = [...nums];

    if (lastNotNine === -1) {
      // All 9s - prepend 1
      steps.push({
        line: 9,
        explanation: 'All digits are 9. Sentinel becomes 1. Prepend new node with value 1.',
        variables: { allNines: true },
        visualization: makeViz(
          [1, ...nums],
          { 0: 'found' },
          { 0: 'new' }
        ),
      });

      const finalResult = [1, ...nums.map(() => 0)];
      steps.push({
        line: 14,
        explanation: `Result: [${finalResult.join(' -> ')}]. All original digits set to 0, new leading 1 added.`,
        variables: { result: finalResult.join('') },
        visualization: makeViz(
          finalResult,
          Object.fromEntries(finalResult.map((_, i) => [i, 'found'])),
          { 0: 'head' }
        ),
      });
    } else {
      result[lastNotNine] += 1;
      for (let i = lastNotNine + 1; i < n; i++) result[i] = 0;

      steps.push({
        line: 9,
        explanation: `Increment index ${lastNotNine} (value ${nums[lastNotNine]} -> ${result[lastNotNine]}). Set all following digits to 0.`,
        variables: { incrementIdx: lastNotNine, newVal: result[lastNotNine] },
        visualization: makeViz(
          [...result],
          { [lastNotNine]: 'active' },
          { [lastNotNine]: '+1' }
        ),
      });

      steps.push({
        line: 14,
        explanation: `Result: [${result.join(' -> ')}]. Number is now ${result.join('')}.`,
        variables: { result: result.join('') },
        visualization: makeViz(
          result,
          Object.fromEntries(result.map((_, i) => [i, 'found'])),
          { 0: 'head' }
        ),
      });
    }

    return steps;
  },
};

export default plusOneLinkedList;
