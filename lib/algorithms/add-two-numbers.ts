import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const addTwoNumbers: AlgorithmDefinition = {
  id: 'add-two-numbers',
  title: 'Add Two Numbers',
  leetcodeNumber: 2,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Two non-empty linked lists represent two non-negative integers in reverse order. Add the two numbers and return the sum as a linked list. Iterate both lists simultaneously, carrying over when the sum >= 10.',
  tags: ['linked list', 'math', 'carry', 'simulation'],

  code: {
    pseudocode: `function addTwoNumbers(l1, l2):
  dummy = ListNode(0)
  curr = dummy
  carry = 0
  while l1 or l2 or carry:
    val = carry
    if l1: val += l1.val; l1 = l1.next
    if l2: val += l2.val; l2 = l2.next
    carry = val // 10
    curr.next = ListNode(val % 10)
    curr = curr.next
  return dummy.next`,

    python: `def addTwoNumbers(l1, l2):
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    while l1 or l2 or carry:
        val = carry
        if l1:
            val += l1.val
            l1 = l1.next
        if l2:
            val += l2.val
            l2 = l2.next
        carry, digit = divmod(val, 10)
        curr.next = ListNode(digit)
        curr = curr.next
    return dummy.next`,

    javascript: `function addTwoNumbers(l1, l2) {
  let dummy = new ListNode(0), curr = dummy, carry = 0;
  while (l1 || l2 || carry) {
    let val = carry;
    if (l1) { val += l1.val; l1 = l1.next; }
    if (l2) { val += l2.val; l2 = l2.next; }
    carry = Math.floor(val / 10);
    curr.next = new ListNode(val % 10);
    curr = curr.next;
  }
  return dummy.next;
}`,

    java: `public ListNode addTwoNumbers(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode(0), curr = dummy;
    int carry = 0;
    while (l1 != null || l2 != null || carry != 0) {
        int val = carry;
        if (l1 != null) { val += l1.val; l1 = l1.next; }
        if (l2 != null) { val += l2.val; l2 = l2.next; }
        carry = val / 10;
        curr.next = new ListNode(val % 10);
        curr = curr.next;
    }
    return dummy.next;
}`,
  },

  defaultInput: { l1: [2, 4, 3], l2: [5, 6, 4] },

  inputFields: [
    {
      name: 'l1',
      label: 'First Number (reverse order)',
      type: 'array',
      defaultValue: [2, 4, 3],
      placeholder: '2,4,3',
      helperText: 'Digits in reverse order (e.g. [2,4,3] = 342)',
    },
    {
      name: 'l2',
      label: 'Second Number (reverse order)',
      type: 'array',
      defaultValue: [5, 6, 4],
      placeholder: '5,6,4',
      helperText: 'Digits in reverse order (e.g. [5,6,4] = 465)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const l1 = (input.l1 as number[]) || [2, 4, 3];
    const l2 = (input.l2 as number[]) || [5, 6, 4];
    const steps: AlgorithmStep[] = [];

    const result: number[] = [];
    let carry = 0;
    let i1 = 0;
    let i2 = 0;

    const num1 = parseInt(l1.slice().reverse().join(''), 10);
    const num2 = parseInt(l2.slice().reverse().join(''), 10);

    // Combined array for visualization: show l1, separator, l2, separator, result
    const makeViz = (
      pos1: number,
      pos2: number,
      resultSoFar: number[],
      carry: number
    ): ArrayVisualization => {
      const maxLen = Math.max(l1.length, l2.length) + 2;
      const displayArr = [...l1, -1, ...l2, -1, ...resultSoFar];
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};

      // Highlight active nodes
      if (pos1 < l1.length) { h[pos1] = 'active'; l[pos1] = 'p1'; }
      const l2Start = l1.length + 1;
      if (pos2 < l2.length) { h[l2Start + pos2] = 'pointer'; l[l2Start + pos2] = 'p2'; }
      // Highlight result
      const resStart = l1.length + 1 + l2.length + 1;
      for (let r = 0; r < resultSoFar.length; r++) {
        h[resStart + r] = 'found';
        if (r === resultSoFar.length - 1) l[resStart + r] = 'new';
      }
      // Separator labels
      l[l1.length] = '+';
      l[l2Start + l2.length] = '=';

      return {
        type: 'array',
        array: displayArr.map((v) => v === -1 ? 0 : v),
        highlights: h,
        labels: l,
        auxData: {
          label: 'Addition State',
          entries: [
            { key: 'l1 digit', value: pos1 < l1.length ? `${l1[pos1]}` : '-' },
            { key: 'l2 digit', value: pos2 < l2.length ? `${l2[pos2]}` : '-' },
            { key: 'carry', value: `${carry}` },
            { key: 'result so far', value: resultSoFar.length > 0 ? `[${resultSoFar.join(',')}]` : '[]' },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Add ${num1} + ${num2} = ${num1 + num2}. Lists are in reverse order. Traverse both simultaneously with a carry.`,
      variables: { l1, l2, carry: 0 },
      visualization: makeViz(0, 0, [], 0),
    });

    while (i1 < l1.length || i2 < l2.length || carry > 0) {
      let val = carry;
      const d1 = i1 < l1.length ? l1[i1] : 0;
      const d2 = i2 < l2.length ? l2[i2] : 0;
      val += d1 + d2;
      carry = Math.floor(val / 10);
      const digit = val % 10;
      result.push(digit);

      steps.push({
        line: 5,
        explanation: `Position ${Math.max(i1, i2)}: ${d1} + ${d2} + carry(${carry > 0 ? val - digit - carry * 10 + carry : 0}) = ${val}. Write digit ${digit}, carry=${carry}.`,
        variables: {
          i1, i2, d1, d2,
          sum: val,
          digit,
          carry,
          resultSoFar: [...result],
        },
        visualization: makeViz(i1, i2, [...result], carry),
      });

      i1++;
      i2++;
    }

    steps.push({
      line: 10,
      explanation: `Done! ${num1} + ${num2} = ${num1 + num2}. Result list (reverse): [${result.join(' -> ')}] = ${parseInt(result.slice().reverse().join(''), 10)}.`,
      variables: { result, number: num1 + num2 },
      visualization: makeViz(i1, i2, result, 0),
    });

    return steps;
  },
};

export default addTwoNumbers;
