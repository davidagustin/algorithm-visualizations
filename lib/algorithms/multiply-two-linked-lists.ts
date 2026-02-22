import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const multiplyTwoLinkedLists: AlgorithmDefinition = {
  id: 'multiply-two-linked-lists',
  title: 'Multiply Two Numbers as Linked Lists',
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Multiply two non-negative integers represented as linked lists (most significant digit first). Traverse each list to reconstruct the integers, multiply them, then convert the result back to a linked list. Handle edge case where either number is zero.',
  tags: ['linked list', 'math', 'multiplication', 'number representation'],

  code: {
    pseudocode: `function multiply(l1, l2):
  num1 = 0
  cur = l1
  while cur != null:
    num1 = num1 * 10 + cur.val
    cur = cur.next
  num2 = 0
  cur = l2
  while cur != null:
    num2 = num2 * 10 + cur.val
    cur = cur.next
  product = num1 * num2
  // convert product to linked list
  if product == 0: return Node(0)
  head = null
  while product > 0:
    node = Node(product % 10)
    node.next = head
    head = node
    product //= 10
  return head`,

    python: `def multiply(l1, l2):
    def toNum(node):
        num = 0
        while node:
            num = num * 10 + node.val
            node = node.next
        return num
    product = toNum(l1) * toNum(l2)
    if product == 0:
        return ListNode(0)
    head = None
    while product > 0:
        node = ListNode(product % 10)
        node.next = head
        head = node
        product //= 10
    return head`,

    javascript: `function multiply(l1, l2) {
  const toNum = (node) => {
    let num = 0;
    while (node) { num = num * 10 + node.val; node = node.next; }
    return num;
  };
  let product = toNum(l1) * toNum(l2);
  if (product === 0) return { val: 0, next: null };
  let head = null;
  while (product > 0) {
    const node = { val: product % 10, next: head };
    head = node;
    product = Math.floor(product / 10);
  }
  return head;
}`,

    java: `public ListNode multiply(ListNode l1, ListNode l2) {
    long num1 = 0, num2 = 0;
    for (ListNode c = l1; c != null; c = c.next) num1 = num1 * 10 + c.val;
    for (ListNode c = l2; c != null; c = c.next) num2 = num2 * 10 + c.val;
    long product = num1 * num2;
    if (product == 0) return new ListNode(0);
    ListNode head = null;
    while (product > 0) {
        ListNode node = new ListNode((int)(product % 10));
        node.next = head;
        head = node;
        product /= 10;
    }
    return head;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3],
    target: 4,
    k: 5,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'First number digits',
      type: 'array',
      defaultValue: [1, 2, 3],
      placeholder: '1,2,3',
      helperText: 'Digits of first number (123)',
    },
    {
      name: 'target',
      label: 'Second number first digit',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'First digit of second number',
    },
    {
      name: 'k',
      label: 'Second number second digit',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Second digit of second number (forms 45)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const l1 = input.nums as number[];
    const l2 = [input.target as number, input.k as number];
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
      explanation: `Multiply L1=[${l1.join('->')}] (=${l1.join('')}) by L2=[${l2.join('->')}] (=${l2.join('')}).`,
      variables: { l1Str: l1.join(''), l2Str: l2.join('') },
      visualization: makeViz([...l1], {}, { 0: 'l1' }),
    });

    // Convert L1 to number
    let num1 = 0;
    for (let i = 0; i < l1.length; i++) {
      num1 = num1 * 10 + l1[i];
      steps.push({
        line: 3,
        explanation: `L1 digit ${l1[i]}: num1 = ${num1 === l1[i] ? '0' : (num1 - l1[i]) / 10} * 10 + ${l1[i]} = ${num1}.`,
        variables: { digit: l1[i], num1 },
        visualization: makeViz(
          [...l1],
          { [i]: 'active' },
          { [i]: `x10+${l1[i]}` }
        ),
      });
    }

    // Convert L2 to number
    let num2 = 0;
    for (let i = 0; i < l2.length; i++) {
      num2 = num2 * 10 + l2[i];
    }

    steps.push({
      line: 6,
      explanation: `L1 = ${num1}, L2 = ${num2}. Compute product: ${num1} * ${num2} = ${num1 * num2}.`,
      variables: { num1, num2, product: num1 * num2 },
      visualization: makeViz([...l2], {}, { 0: 'l2' }),
    });

    const product = num1 * num2;

    // Convert product to linked list
    const digits = product === 0 ? [0] : product.toString().split('').map(Number);

    steps.push({
      line: 13,
      explanation: `Convert product ${product} to linked list: [${digits.join(' -> ')}].`,
      variables: { product, digits: digits.join('') },
      visualization: makeViz(
        digits,
        Object.fromEntries(digits.map((_, i) => [i, 'found'])),
        { 0: 'head', [digits.length - 1]: 'tail' }
      ),
    });

    for (let i = 0; i < digits.length; i++) {
      steps.push({
        line: 15,
        explanation: `Prepend digit ${digits[i]} to result list. Partial result: [${digits.slice(0, i + 1).join(' -> ')}].`,
        variables: { digit: digits[i], position: i },
        visualization: makeViz(
          digits.slice(0, i + 1),
          { [i]: 'active' },
          { [i]: 'new' }
        ),
      });
    }

    steps.push({
      line: 18,
      explanation: `Multiplication complete. ${num1} * ${num2} = ${product}. Result list: [${digits.join(' -> ')}].`,
      variables: { num1, num2, product },
      visualization: makeViz(
        digits,
        Object.fromEntries(digits.map((_, i) => [i, 'sorted'])),
        { 0: 'head' }
      ),
    });

    return steps;
  },
};

export default multiplyTwoLinkedLists;
