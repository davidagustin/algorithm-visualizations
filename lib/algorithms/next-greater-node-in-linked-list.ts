import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const nextGreaterNodeInLinkedList: AlgorithmDefinition = {
  id: 'next-greater-node-in-linked-list',
  title: 'Next Greater Node In Linked List',
  leetcodeNumber: 1019,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Given the head of a linked list, return an array of the next greater value for each node. For each node, the next greater value is the first node to the right with a strictly larger value. If no such node exists, output 0. Use a monotonic decreasing stack to solve in O(n).',
  tags: ['linked list', 'stack', 'monotonic stack'],

  code: {
    pseudocode: `function nextLargerNodes(head):
  vals = collect all values from list
  result = array of zeros, length = len(vals)
  stack = []  // stores indices
  for i in range(len(vals)):
    while stack not empty and vals[stack.top()] < vals[i]:
      idx = stack.pop()
      result[idx] = vals[i]
    stack.push(i)
  return result`,

    python: `def nextLargerNodes(head):
    vals = []
    cur = head
    while cur:
        vals.append(cur.val)
        cur = cur.next
    result = [0] * len(vals)
    stack = []
    for i, v in enumerate(vals):
        while stack and vals[stack[-1]] < v:
            result[stack.pop()] = v
        stack.append(i)
    return result`,

    javascript: `function nextLargerNodes(head) {
  const vals = [];
  for (let cur = head; cur; cur = cur.next) vals.push(cur.val);
  const result = new Array(vals.length).fill(0);
  const stack = [];
  for (let i = 0; i < vals.length; i++) {
    while (stack.length && vals[stack[stack.length-1]] < vals[i]) {
      result[stack.pop()] = vals[i];
    }
    stack.push(i);
  }
  return result;
}`,

    java: `public int[] nextLargerNodes(ListNode head) {
    List<Integer> vals = new ArrayList<>();
    for (ListNode c = head; c != null; c = c.next) vals.add(c.val);
    int[] result = new int[vals.size()];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < vals.size(); i++) {
        while (!stack.isEmpty() && vals.get(stack.peek()) < vals.get(i))
            result[stack.pop()] = vals.get(i);
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
      label: 'Linked List',
      type: 'array',
      defaultValue: [2, 1, 5, 6, 2, 3],
      placeholder: '2,1,5,6,2,3',
      helperText: 'Comma-separated integers representing linked list values',
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

    const result = new Array(n).fill(0);
    const stack: number[] = [];

    steps.push({
      line: 1,
      explanation: `Collect values from linked list: [${nums.join(', ')}]. Initialize result array of zeros and empty monotonic stack.`,
      variables: { result: [...result], stack: [] },
      visualization: makeViz({ 0: 'active' }, { 0: 'start' }),
    });

    for (let i = 0; i < n; i++) {
      const hl: Record<number, string> = { [i]: 'active' };
      const lab: Record<number, string> = { [i]: 'cur' };
      stack.forEach(idx => { hl[idx] = 'pointer'; lab[idx] = 'stk'; });

      steps.push({
        line: 4,
        explanation: `Processing index ${i}, value ${nums[i]}. Check stack: top is ${stack.length > 0 ? `index ${stack[stack.length - 1]} (val ${nums[stack[stack.length - 1]]})` : 'empty'}.`,
        variables: { index: i, value: nums[i], stack: [...stack], result: [...result] },
        visualization: makeViz(hl, lab),
      });

      while (stack.length > 0 && nums[stack[stack.length - 1]] < nums[i]) {
        const popped = stack.pop()!;
        result[popped] = nums[i];

        const hl2: Record<number, string> = { [i]: 'found', [popped]: 'active' };
        stack.forEach(idx => { hl2[idx] = 'pointer'; });

        steps.push({
          line: 6,
          explanation: `nums[${popped}] = ${nums[popped]} < nums[${i}] = ${nums[i]}. Pop index ${popped}, set result[${popped}] = ${nums[i]}.`,
          variables: { 'popped index': popped, 'popped value': nums[popped], 'next greater': nums[i], result: [...result] },
          visualization: makeViz(hl2, { [i]: 'greater', [popped]: 'resolved' }),
        });
      }

      stack.push(i);

      steps.push({
        line: 8,
        explanation: `Push index ${i} (value ${nums[i]}) onto stack. Stack: [${stack.map(idx => `${idx}(${nums[idx]})`).join(', ')}].`,
        variables: { stack: [...stack], result: [...result] },
        visualization: makeViz(
          { [i]: 'active', ...Object.fromEntries(stack.slice(0, -1).map(idx => [idx, 'pointer'])) },
          { [i]: 'pushed', ...Object.fromEntries(stack.slice(0, -1).map(idx => [idx, 'stk'])) }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `All nodes processed. Remaining stack elements have no next greater node (result stays 0). Final result: [${result.join(', ')}].`,
      variables: { result },
      visualization: makeViz(Object.fromEntries(result.map((v, i) => [i, v > 0 ? 'found' : 'visited'])), Object.fromEntries(result.map((v, i) => [i, `${v}`]))),
    });

    return steps;
  },
};

export default nextGreaterNodeInLinkedList;
