import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const convertBinaryNumberInLinkedList: AlgorithmDefinition = {
  id: 'convert-binary-number-in-linked-list',
  title: 'Convert Binary Number in a Linked List to Integer',
  leetcodeNumber: 1290,
  difficulty: 'Easy',
  category: 'Linked List',
  description:
    'Given head of a linked list where each node contains a binary digit (0 or 1), return the decimal value of the binary number the list represents. Traverse from head to tail: for each bit, shift the current result left by 1 (multiply by 2) and add the current bit.',
  tags: ['linked list', 'bit manipulation', 'math'],

  code: {
    pseudocode: `function getDecimalValue(head):
  result = 0
  cur = head
  while cur != null:
    result = result * 2 + cur.val
    cur = cur.next
  return result`,

    python: `def getDecimalValue(head):
    result = 0
    cur = head
    while cur:
        result = result * 2 + cur.val
        cur = cur.next
    return result`,

    javascript: `function getDecimalValue(head) {
  let result = 0;
  let cur = head;
  while (cur) {
    result = result * 2 + cur.val;
    cur = cur.next;
  }
  return result;
}`,

    java: `public int getDecimalValue(ListNode head) {
    int result = 0;
    ListNode cur = head;
    while (cur != null) {
        result = result * 2 + cur.val;
        cur = cur.next;
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [1, 0, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Binary Linked List',
      type: 'array',
      defaultValue: [1, 0, 1],
      placeholder: '1,0,1',
      helperText: 'Binary digits (0 or 1) representing a binary number from most significant to least significant bit',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
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

    const binaryStr = nums.join('');
    const expectedDecimal = parseInt(binaryStr, 2);

    steps.push({
      line: 1,
      explanation: `Convert binary linked list [${nums.join(' -> ')}] to decimal. Binary string "${binaryStr}" should equal ${expectedDecimal}.`,
      variables: { result: 0, cur: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'cur' }),
    });

    let result = 0;
    for (let i = 0; i < n; i++) {
      const bit = nums[i];
      const prev = result;
      result = result * 2 + bit;

      steps.push({
        line: 4,
        explanation: `Process bit ${bit} at index ${i}. result = ${prev} * 2 + ${bit} = ${prev * 2} + ${bit} = ${result}.`,
        variables: { 'current bit': bit, 'previous result': prev, result },
        visualization: makeViz(
          { [i]: 'active', ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])) },
          { [i]: 'cur', ...(i > 0 ? { [i - 1]: 'done' } : {}) }
        ),
      });
    }

    steps.push({
      line: 6,
      explanation: `All bits processed. Final decimal value: ${result}. Binary [${binaryStr}] = ${result} in decimal.`,
      variables: { result, 'binary string': binaryStr },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        { 0: 'MSB', [n - 1]: 'LSB' }
      ),
    });

    return steps;
  },
};

export default convertBinaryNumberInLinkedList;
