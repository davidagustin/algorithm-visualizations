import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addTwoNumbersIi: AlgorithmDefinition = {
  id: 'add-two-numbers-ii',
  title: 'Add Two Numbers II',
  leetcodeNumber: 445,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given two non-empty linked lists representing two non-negative integers where digits are stored in most-significant-first order, add the two numbers and return the sum as a linked list. Use two stacks to reverse the order of digits, then add from least significant to most significant, carrying over as needed.',
  tags: ['linked list', 'stack', 'math', 'carry'],

  code: {
    pseudocode: `function addTwoNumbers(l1, l2):
  stack1 = push all l1 values
  stack2 = push all l2 values
  carry = 0, head = null
  while stack1 or stack2 or carry:
    sum = carry
    if stack1: sum += stack1.pop()
    if stack2: sum += stack2.pop()
    carry = sum // 10
    node = new Node(sum % 10)
    node.next = head
    head = node
  return head`,

    python: `def addTwoNumbers(l1, l2):
    s1, s2 = [], []
    while l1: s1.append(l1.val); l1 = l1.next
    while l2: s2.append(l2.val); l2 = l2.next
    carry, head = 0, None
    while s1 or s2 or carry:
        s = carry
        if s1: s += s1.pop()
        if s2: s += s2.pop()
        carry, rem = divmod(s, 10)
        node = ListNode(rem)
        node.next = head
        head = node
    return head`,

    javascript: `function addTwoNumbers(l1, l2) {
  const s1 = [], s2 = [];
  for (let c = l1; c; c = c.next) s1.push(c.val);
  for (let c = l2; c; c = c.next) s2.push(c.val);
  let carry = 0, head = null;
  while (s1.length || s2.length || carry) {
    let sum = carry;
    if (s1.length) sum += s1.pop();
    if (s2.length) sum += s2.pop();
    carry = Math.floor(sum / 10);
    const node = { val: sum % 10, next: head };
    head = node;
  }
  return head;
}`,

    java: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    Deque<Integer> s1 = new ArrayDeque<>(), s2 = new ArrayDeque<>();
    for (ListNode c = l1; c != null; c = c.next) s1.push(c.val);
    for (ListNode c = l2; c != null; c = c.next) s2.push(c.val);
    int carry = 0; ListNode head = null;
    while (!s1.isEmpty() || !s2.isEmpty() || carry != 0) {
        int sum = carry;
        if (!s1.isEmpty()) sum += s1.pop();
        if (!s2.isEmpty()) sum += s2.pop();
        carry = sum / 10;
        ListNode node = new ListNode(sum % 10); node.next = head; head = node;
    }
    return head;
}`,
  },

  defaultInput: {
    l1: [7, 2, 4, 3],
    l2: [5, 6, 4],
  },

  inputFields: [
    {
      name: 'l1',
      label: 'First Number (Linked List)',
      type: 'array',
      defaultValue: [7, 2, 4, 3],
      placeholder: '7,2,4,3',
      helperText: 'Digits of first number, most significant first',
    },
    {
      name: 'l2',
      label: 'Second Number (Linked List)',
      type: 'array',
      defaultValue: [5, 6, 4],
      placeholder: '5,6,4',
      helperText: 'Digits of second number, most significant first',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const l1 = input.l1 as number[];
    const l2 = input.l2 as number[];
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

    const num1 = parseInt(l1.join(''));
    const num2 = parseInt(l2.join(''));
    const total = num1 + num2;

    steps.push({
      line: 1,
      explanation: `Add ${l1.join('')} + ${l2.join('')} = ${total}. Push both lists onto stacks to process from least significant digit.`,
      variables: { 'L1 number': num1, 'L2 number': num2, 'expected sum': total },
      visualization: makeViz([...l1], { 0: 'active' }, { 0: 'L1 MSB', [l1.length - 1]: 'L1 LSB' }),
    });

    steps.push({
      line: 2,
      explanation: `Stack 1 (L1): [${[...l1].reverse().join(', ')}] (top = LSB). Stack 2 (L2): [${[...l2].reverse().join(', ')}] (top = LSB).`,
      variables: { stack1: [...l1].reverse(), stack2: [...l2].reverse() },
      visualization: makeViz([...l2], { 0: 'pointer' }, { 0: 'L2 MSB', [l2.length - 1]: 'L2 LSB' }),
    });

    const s1 = [...l1].reverse();
    const s2 = [...l2].reverse();
    const resultDigits: number[] = [];
    let carry = 0;
    let step = 0;

    while (s1.length > 0 || s2.length > 0 || carry > 0) {
      const d1 = s1.length > 0 ? s1.pop()! : 0;
      const d2 = s2.length > 0 ? s2.pop()! : 0;
      const sum = d1 + d2 + carry;
      carry = Math.floor(sum / 10);
      const digit = sum % 10;
      resultDigits.unshift(digit);

      steps.push({
        line: 6,
        explanation: `Step ${step + 1}: ${d1} + ${d2} + carry(${carry > 0 ? sum - digit - carry * 10 + carry : 0}) = ${sum}. Digit = ${digit}, new carry = ${carry}. Result so far: [${resultDigits.join(', ')}].`,
        variables: { d1, d2, carry, digit, 'result so far': [...resultDigits] },
        visualization: makeViz([...resultDigits], Object.fromEntries(resultDigits.map((_, i) => [i, i === 0 ? 'active' : 'found'])), { 0: 'newest' }),
      });

      step++;
    }

    steps.push({
      line: 11,
      explanation: `Addition complete. Result list: [${resultDigits.join(' -> ')}] representing the number ${resultDigits.join('')}.`,
      variables: { result: resultDigits, 'decimal value': parseInt(resultDigits.join('')) },
      visualization: makeViz([...resultDigits], Object.fromEntries(resultDigits.map((_, i) => [i, 'found'])), { 0: 'MSB', [resultDigits.length - 1]: 'LSB' }),
    });

    return steps;
  },
};

export default addTwoNumbersIi;
