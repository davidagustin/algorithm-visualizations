import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addTwoNumbersReverse: AlgorithmDefinition = {
  id: 'add-two-numbers-reverse',
  title: 'Add Two Numbers (Reverse Order)',
  leetcodeNumber: 2,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Add two numbers represented as reversed linked lists (least significant digit first). Traverse both lists simultaneously, adding corresponding digits plus carry. Create new nodes for each digit of the result. Handle different lengths and final carry.',
  tags: ['linked list', 'math', 'carry', 'addition'],

  code: {
    pseudocode: `function addTwoNumbers(l1, l2):
  dummy = Node(0)
  cur = dummy
  carry = 0
  while l1 or l2 or carry:
    val = carry
    if l1: val += l1.val; l1 = l1.next
    if l2: val += l2.val; l2 = l2.next
    carry = val // 10
    cur.next = Node(val % 10)
    cur = cur.next
  return dummy.next`,

    python: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    cur = dummy
    carry = 0
    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val
            l1 = l1.next
        if l2:
            val += l2.val
            l2 = l2.next
        carry, val = divmod(val, 10)
        cur.next = ListNode(val)
        cur = cur.next
    return dummy.next`,

    javascript: `function addTwoNumbers(l1, l2) {
  const dummy = { val: 0, next: null };
  let cur = dummy;
  let carry = 0;
  while (l1 || l2 || carry) {
    let val = carry;
    if (l1) { val += l1.val; l1 = l1.next; }
    if (l2) { val += l2.val; l2 = l2.next; }
    carry = Math.floor(val / 10);
    cur.next = { val: val % 10, next: null };
    cur = cur.next;
  }
  return dummy.next;
}`,

    java: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0);
    ListNode cur = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        int val = carry;
        if (l1 != null) { val += l1.val; l1 = l1.next; }
        if (l2 != null) { val += l2.val; l2 = l2.next; }
        carry = val / 10;
        cur.next = new ListNode(val % 10);
        cur = cur.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: {
    nums: [2, 4, 3],
    target: 5,
    k: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'First number (reversed digits)',
      type: 'array',
      defaultValue: [2, 4, 3],
      placeholder: '2,4,3',
      helperText: 'Digits of first number in reverse (342)',
    },
    {
      name: 'target',
      label: 'Second number first digit',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Used as [target, 6, 4] for second number (465)',
    },
    {
      name: 'k',
      label: 'Second number second digit',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Second digit of second number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const l1 = input.nums as number[];
    const l2 = [input.target as number, input.k as number, 4];
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
      explanation: `Add two reversed lists: L1=[${l1.join('->')}] (=${[...l1].reverse().join('')}), L2=[${l2.join('->')}] (=${[...l2].reverse().join('')}).`,
      variables: { l1: l1.join('->'), l2: l2.join('->') },
      visualization: makeViz([...l1], {}, { 0: 'l1' }),
    });

    const result: number[] = [];
    let carry = 0;
    let i = 0;

    const maxLen = Math.max(l1.length, l2.length);

    while (i < maxLen || carry > 0) {
      const d1 = i < l1.length ? l1[i] : 0;
      const d2 = i < l2.length ? l2[i] : 0;
      const sum = d1 + d2 + carry;
      const digit = sum % 10;
      carry = Math.floor(sum / 10);
      result.push(digit);

      steps.push({
        line: 6,
        explanation: `Position ${i}: d1=${d1} + d2=${d2} + carry=${carry > 0 ? Math.floor((d1 + d2 + (carry > 0 ? carry - Math.floor(sum / 10) : 0)) / 10) : 0} = ${sum}. New digit=${digit}, carry=${carry}.`,
        variables: { d1, d2, sum, digit, carry, position: i },
        visualization: makeViz(
          [...result],
          { [result.length - 1]: carry > 0 ? 'active' : 'found' },
          { [result.length - 1]: `pos${i}`, ...(carry > 0 ? { [result.length - 1]: 'carry+' } : {}) }
        ),
      });

      i++;
    }

    const num1 = [...l1].reverse().join('');
    const num2 = [...l2].reverse().join('');
    steps.push({
      line: 11,
      explanation: `Result: [${result.join(' -> ')}] = ${[...result].reverse().join('')}. (${num1} + ${num2} = ${parseInt(num1) + parseInt(num2)}).`,
      variables: { result: result.join('->'), decimal: [...result].reverse().join('') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, idx) => [idx, 'found'])),
        { 0: 'LSD', [result.length - 1]: 'MSD' }
      ),
    });

    return steps;
  },
};

export default addTwoNumbersReverse;
