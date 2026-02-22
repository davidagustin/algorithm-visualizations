import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const doubleANumberInLinkedList: AlgorithmDefinition = {
  id: 'double-a-number-in-linked-list',
  title: 'Double a Number Represented as a Linked List',
  leetcodeNumber: 2816,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Double the value of a number stored in a linked list (most significant digit first). Reverse the list, double each digit while propagating carry, then reverse back. Alternatively, use a stack to process from least significant to most significant digit.',
  tags: ['linked list', 'math', 'carry', 'reverse'],

  code: {
    pseudocode: `function doubleIt(head):
  // approach: reverse, double with carry, reverse back
  // or use stack to avoid modifying
  stack = []
  cur = head
  while cur: stack.push(cur.val); cur = cur.next
  carry = 0
  cur = null
  while stack or carry:
    val = (stack.pop() if stack else 0) * 2 + carry
    carry = val // 10
    node = Node(val % 10)
    node.next = cur
    cur = node
  return cur`,

    python: `def doubleIt(head):
    stack = []
    cur = head
    while cur:
        stack.append(cur.val)
        cur = cur.next
    carry = 0
    cur = None
    while stack or carry:
        val = (stack.pop() if stack else 0) * 2 + carry
        carry = val // 10
        node = ListNode(val % 10)
        node.next = cur
        cur = node
    return cur`,

    javascript: `function doubleIt(head) {
  const stack = [];
  let cur = head;
  while (cur) { stack.push(cur.val); cur = cur.next; }
  let carry = 0, newHead = null;
  while (stack.length || carry) {
    const val = (stack.pop() || 0) * 2 + carry;
    carry = Math.floor(val / 10);
    const node = { val: val % 10, next: newHead };
    newHead = node;
  }
  return newHead;
}`,

    java: `public ListNode doubleIt(ListNode head) {
    Deque<Integer> stack = new ArrayDeque<>();
    ListNode cur = head;
    while (cur != null) { stack.push(cur.val); cur = cur.next; }
    int carry = 0;
    ListNode newHead = null;
    while (!stack.isEmpty() || carry > 0) {
        int val = (stack.isEmpty() ? 0 : stack.pop()) * 2 + carry;
        carry = val / 10;
        ListNode node = new ListNode(val % 10);
        node.next = newHead;
        newHead = node;
    }
    return newHead;
}`,
  },

  defaultInput: {
    nums: [1, 8, 9],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Number as linked list',
      type: 'array',
      defaultValue: [1, 8, 9],
      placeholder: '1,8,9',
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
      explanation: `Double the number [${nums.join('')}] stored as linked list. Push all digits to stack to process from least significant.`,
      variables: { number: nums.join('') },
      visualization: makeViz([...nums], {}, {}),
    });

    // Push to stack
    steps.push({
      line: 4,
      explanation: `Stack (top = least significant): [${[...nums].reverse().join(', ')}]. Process from right to left.`,
      variables: { stack: [...nums].reverse().join(', ') },
      visualization: makeViz(
        [...nums].reverse(),
        { 0: 'active' },
        { 0: 'top(LSD)' }
      ),
    });

    const stack = [...nums].reverse();
    const result: number[] = [];
    let carry = 0;

    while (stack.length > 0 || carry > 0) {
      const digit = stack.length > 0 ? stack.shift()! : 0;
      const val = digit * 2 + carry;
      const newDigit = val % 10;
      carry = Math.floor(val / 10);

      steps.push({
        line: 9,
        explanation: `Digit ${digit} * 2 + carry ${carry > 0 ? `(prev) = ${digit * 2 + (carry > 0 ? carry - Math.floor((digit * 2) / 10) : 0)}` : `= ${val}`}. New digit = ${newDigit}, carry = ${carry}.`,
        variables: { digit, doubled: digit * 2, carry, newDigit },
        visualization: makeViz(
          [...nums],
          { [nums.length - result.length - 1]: 'active' },
          { [nums.length - result.length - 1]: `x2=${newDigit}` }
        ),
      });

      result.unshift(newDigit);
    }

    steps.push({
      line: 13,
      explanation: `Doubling complete. Result: [${result.join('')}]. List: [${result.join(' -> ')}].`,
      variables: { result: result.join('') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default doubleANumberInLinkedList;
