import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const nextGreaterNodeLinkedList: AlgorithmDefinition = {
  id: 'next-greater-node-linked-list',
  title: 'Next Greater Node In Linked List',
  leetcodeNumber: 1019,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given the head of a linked list, return an array of the next greater node values. For each node, find the first node to the right with a strictly greater value. If no such node exists, output 0. Convert the linked list to an array, then use a monotonic decreasing stack to find the next greater element for each index.',
  tags: ['stack', 'monotonic stack', 'linked list', 'array'],

  code: {
    pseudocode: `function nextLargerNodes(head):
  vals = []
  while head: vals.append(head.val); head = head.next
  n = len(vals)
  result = [0] * n
  stack = []  // indices with no answer yet
  for i in 0..n-1:
    while stack and vals[stack.top()] < vals[i]:
      result[stack.pop()] = vals[i]
    stack.push(i)
  return result`,

    python: `def nextLargerNodes(head):
    vals = []
    while head:
        vals.append(head.val)
        head = head.next
    n = len(vals)
    result = [0] * n
    stack = []
    for i in range(n):
        while stack and vals[stack[-1]] < vals[i]:
            result[stack.pop()] = vals[i]
        stack.append(i)
    return result`,

    javascript: `function nextLargerNodes(head) {
  const vals = [];
  while (head) { vals.push(head.val); head = head.next; }
  const n = vals.length;
  const result = new Array(n).fill(0);
  const stack = [];
  for (let i = 0; i < n; i++) {
    while (stack.length && vals[stack.at(-1)] < vals[i]) {
      result[stack.pop()] = vals[i];
    }
    stack.push(i);
  }
  return result;
}`,

    java: `public int[] nextLargerNodes(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    while (head != null) { vals.add(head.val); head = head.next; }
    int n = vals.size();
    int[] result = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && vals.get(stack.peek()) < vals.get(i)) {
            result[stack.pop()] = vals.get(i);
        }
        stack.push(i);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [2, 1, 5, 6, 2, 3],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [2, 1, 5, 6, 2, 3],
      placeholder: '2,1,5,6,2,3',
      helperText: 'Values representing a linked list from head to tail',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const vals = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = vals.length;
    const result: number[] = new Array(n).fill(0);
    const stack: number[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(i => `[${i}]=${vals[i]}`),
      inputChars: vals.map(String),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Convert linked list to array: [${vals.join(' -> ')}]. Use monotonic decreasing stack to find next greater elements.`,
      variables: { vals: [...vals], result: [...result], stack: [] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 6,
        explanation: `Index ${i}, value ${vals[i]}. Check stack for indices with smaller values.`,
        variables: { i, val: vals[i], stack: [...stack] },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && vals[stack[stack.length - 1]] < vals[i]) {
        const j = stack.pop()!;
        result[j] = vals[i];
        steps.push({
          line: 7,
          explanation: `vals[${j}]=${vals[j]} < vals[${i}]=${vals[i]}. Next greater for index ${j} is ${vals[i]}. Pop index ${j}.`,
          variables: { j, valJ: vals[j], nextGreater: vals[i], result: [...result] },
          visualization: makeViz(i, 'match'),
        });
      }

      stack.push(i);
      steps.push({
        line: 8,
        explanation: `Push index ${i} (value ${vals[i]}) onto stack. Still searching for its next greater.`,
        variables: { i, val: vals[i], stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 9,
      explanation: `Remaining stack indices [${stack.join(', ')}] have no next greater element (result remains 0).`,
      variables: { remaining: [...stack], result: [...result] },
      visualization: makeViz(n - 1, 'idle'),
    });

    steps.push({
      line: 10,
      explanation: `Result: [${result.join(', ')}]. Each value is the next greater element in the original linked list.`,
      variables: { result: [...result] },
      visualization: makeViz(-1, 'found'),
    });

    return steps;
  },
};

export default nextGreaterNodeLinkedList;
