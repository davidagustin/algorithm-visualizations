import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maxChunksToMakeSortedI: AlgorithmDefinition = {
  id: 'max-chunks-to-make-sorted-i',
  title: 'Max Chunks To Make Sorted I',
  leetcodeNumber: 769,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given a permutation of [0..n-1], find the maximum number of chunks to sort independently. Since values are a permutation, a chunk boundary exists at index i if max(arr[0..i]) == i. Equivalently, use a monotonic stack approach tracking chunk maxima.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy'],
  code: {
    pseudocode: `function maxChunksToSorted(arr):
  // Simple O(n) approach: since it's a permutation
  maxSoFar = 0
  chunks = 0
  for i from 0 to n-1:
    maxSoFar = max(maxSoFar, arr[i])
    if maxSoFar == i:
      chunks += 1
  return chunks

// Monotonic stack approach:
function maxChunksStack(arr):
  stack = []
  for num in arr:
    curMax = num
    while stack not empty and stack.top > num:
      curMax = max(curMax, stack.pop())
    stack.push(curMax)
  return len(stack)`,
    python: `def maxChunksToSorted(arr):
    max_so_far = 0
    chunks = 0
    for i, v in enumerate(arr):
        max_so_far = max(max_so_far, v)
        if max_so_far == i:
            chunks += 1
    return chunks`,
    javascript: `function maxChunksToSorted(arr) {
  let maxSoFar = 0, chunks = 0;
  for (let i = 0; i < arr.length; i++) {
    maxSoFar = Math.max(maxSoFar, arr[i]);
    if (maxSoFar === i) chunks++;
  }
  return chunks;
}`,
    java: `public int maxChunksToSorted(int[] arr) {
    int maxSoFar = 0, chunks = 0;
    for (int i = 0; i < arr.length; i++) {
        maxSoFar = Math.max(maxSoFar, arr[i]);
        if (maxSoFar == i) chunks++;
    }
    return chunks;
}`,
  },
  defaultInput: { arr: [1, 0, 2, 3, 4] },
  inputFields: [
    {
      name: 'arr',
      label: 'Permutation Array',
      type: 'array',
      defaultValue: [1, 0, 2, 3, 4],
      placeholder: 'e.g. 1,0,2,3,4',
      helperText: 'Permutation of [0..n-1]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const n = arr.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = []; // monotonic stack tracking chunk maxima

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map((v, idx) => `chunk${idx + 1}:max=${v}`),
      inputChars: arr.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `arr=[${arr.join(', ')}] (permutation of [0..${n - 1}]). Monotonic stack approach: each stack entry = max of a chunk.`,
      variables: { arr: [...arr] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      const num = arr[i];
      let curMax = num;

      steps.push({
        line: 9,
        explanation: `arr[${i}]=${num}. curMax=${curMax}. Stack=[${stack.join(', ')}].`,
        variables: { i, num },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && stack[stack.length - 1] > num) {
        const popped = stack.pop()!;
        curMax = Math.max(curMax, popped);
        steps.push({
          line: 11,
          explanation: `Merge: top=${popped} > ${num}. Chunks must be merged. curMax=${curMax}.`,
          variables: { popped, curMax },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(curMax);
      steps.push({
        line: 12,
        explanation: `Push curMax=${curMax}. Now ${stack.length} chunk(s). Stack=[${stack.join(', ')}].`,
        variables: { stack: [...stack], chunks: stack.length },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 13,
      explanation: `Done. Max chunks = ${stack.length}.`,
      variables: { result: stack.length },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default maxChunksToMakeSortedI;
