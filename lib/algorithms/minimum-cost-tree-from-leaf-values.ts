import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const minimumCostTreeFromLeafValues: AlgorithmDefinition = {
  id: 'minimum-cost-tree-from-leaf-values',
  title: 'Minimum Cost Tree from Leaf Values',
  leetcodeNumber: 1130,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array of leaf values, build a binary tree where each non-leaf node value equals the product of its left and right subtree maximums. Minimize the sum of all non-leaf node values. Use a monotonic decreasing stack: when a leaf is smaller than its neighbors, multiply it with the smaller neighbor and add to the answer.',
  tags: ['stack', 'monotonic stack', 'greedy', 'dynamic programming', 'tree'],

  code: {
    pseudocode: `function mctFromLeafValues(arr):
  stack = [Infinity]
  ans = 0
  for each a in arr:
    while stack.top <= a:
      mid = stack.pop()
      ans += mid * min(stack.top, a)
    stack.push(a)
  while len(stack) > 2:
    ans += stack.pop() * stack.top
  return ans`,

    python: `def mctFromLeafValues(arr: list[int]) -> int:
    stack = [float('inf')]
    ans = 0
    for a in arr:
        while stack[-1] <= a:
            mid = stack.pop()
            ans += mid * min(stack[-1], a)
        stack.append(a)
    while len(stack) > 2:
        ans += stack.pop() * stack[-1]
    return ans`,

    javascript: `function mctFromLeafValues(arr) {
  const stack = [Infinity];
  let ans = 0;
  for (const a of arr) {
    while (stack.at(-1) <= a) {
      const mid = stack.pop();
      ans += mid * Math.min(stack.at(-1), a);
    }
    stack.push(a);
  }
  while (stack.length > 2) {
    ans += stack.pop() * stack.at(-1);
  }
  return ans;
}`,

    java: `public int mctFromLeafValues(int[] arr) {
    Deque<Integer> stack = new ArrayDeque<>();
    stack.push(Integer.MAX_VALUE);
    int ans = 0;
    for (int a : arr) {
        while (stack.peek() <= a) {
            int mid = stack.pop();
            ans += mid * Math.min(stack.peek(), a);
        }
        stack.push(a);
    }
    while (stack.size() > 2) {
        ans += stack.pop() * stack.peek();
    }
    return ans;
}`,
  },

  defaultInput: {
    arr: [6, 2, 4],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Leaf Values',
      type: 'array',
      defaultValue: [6, 2, 4],
      placeholder: '6,2,4',
      helperText: 'Comma-separated positive integers (leaf values)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [Infinity];
    let ans = 0;

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(v => v === Infinity ? 'INF' : String(v)),
      inputChars: arr.map(v => String(v)),
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `arr = [${arr.join(', ')}]. Initialize stack = [INF], ans = 0. Use monotonic decreasing stack.`,
      variables: { arr: [...arr], stack: ['INF'], ans: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];

      while (stack[stack.length - 1] <= a) {
        const mid = stack.pop()!;
        const cost = mid * Math.min(stack[stack.length - 1] === Infinity ? 999999 : stack[stack.length - 1], a);
        ans += cost;
        steps.push({
          line: 4,
          explanation: `arr[${i}]=${a} >= stack top ${mid === Infinity ? 'INF' : mid}. Pop ${mid}. Multiply with min(${stack[stack.length - 1] === Infinity ? 'INF' : stack[stack.length - 1]}, ${a}) = ${Math.min(stack[stack.length - 1], a)}. Cost = ${cost}. ans = ${ans}.`,
          variables: { a, mid, cost, ans, stack: stack.map(v => v === Infinity ? Infinity : v) },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(a);
      steps.push({
        line: 5,
        explanation: `Push ${a} onto stack. Stack = [${stack.map(v => v === Infinity ? 'INF' : v).join(', ')}].`,
        variables: { a, ans, stack: stack.map(v => v === Infinity ? 'INF' : v) },
        visualization: makeViz(i, 'push'),
      });
    }

    while (stack.length > 2) {
      const top = stack.pop()!;
      const cost = top * stack[stack.length - 1];
      ans += cost;
      steps.push({
        line: 8,
        explanation: `Cleanup: pop ${top}, multiply with ${stack[stack.length - 1]}. Cost = ${cost}. ans = ${ans}.`,
        variables: { top, cost, ans },
        visualization: makeViz(arr.length, 'pop'),
      });
    }

    steps.push({
      line: 9,
      explanation: `Minimum cost tree answer = ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(arr.length, 'match'),
    });

    return steps;
  },
};

export default minimumCostTreeFromLeafValues;
