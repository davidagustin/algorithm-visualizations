import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const maxChunksToMakeSortedII: AlgorithmDefinition = {
  id: 'max-chunks-to-make-sorted-ii',
  title: 'Max Chunks To Make Sorted II',
  leetcodeNumber: 768,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given an array that may contain duplicates, find the maximum number of chunks it can be divided into such that sorting each chunk individually results in the whole array being sorted. Use a monotonic stack: maintain the max of each chunk; merge chunks when the next element is smaller than the top chunk\'s max.',
  tags: ['Stack', 'Monotonic Stack', 'Array', 'Greedy', 'Hard'],
  code: {
    pseudocode: `function maxChunksToSorted(arr):
  stack = []  // monotonic stack of chunk maxima
  for num in arr:
    if stack empty or stack.top <= num:
      stack.push(num)  // start new chunk
    else:
      curMax = stack.pop()  // save current max
      while stack not empty and stack.top > num:
        stack.pop()  // merge chunks
      stack.push(curMax)  // push merged chunk max
  return len(stack)`,
    python: `def maxChunksToSorted(arr):
    stack = []
    for num in arr:
        if not stack or stack[-1] <= num:
            stack.append(num)
        else:
            cur_max = stack.pop()
            while stack and stack[-1] > num:
                stack.pop()
            stack.append(cur_max)
    return len(stack)`,
    javascript: `function maxChunksToSorted(arr) {
  const stack = [];
  for (const num of arr) {
    if (!stack.length || stack[stack.length-1] <= num) {
      stack.push(num);
    } else {
      const curMax = stack.pop();
      while (stack.length && stack[stack.length-1] > num)
        stack.pop();
      stack.push(curMax);
    }
  }
  return stack.length;
}`,
    java: `public int maxChunksToSorted(int[] arr) {
    Deque<Integer> stack = new ArrayDeque<>();
    for (int num : arr) {
        if (stack.isEmpty() || stack.peek() <= num) {
            stack.push(num);
        } else {
            int curMax = stack.pop();
            while (!stack.isEmpty() && stack.peek() > num) stack.pop();
            stack.push(curMax);
        }
    }
    return stack.size();
}`,
  },
  defaultInput: { arr: [2, 1, 3, 4, 4] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 3, 4, 4],
      placeholder: 'e.g. 2,1,3,4,4',
      helperText: 'Comma-separated integers (may contain duplicates)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const n = arr.length;
    const steps: AlgorithmStep[] = [];
    const stack: number[] = [];

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map((v, idx) => `chunk${idx + 1}:max=${v}`),
      inputChars: arr.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `arr=[${arr.join(', ')}]. Stack stores max of each chunk. Goal: maximize chunks.`,
      variables: { arr: [...arr] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < n; i++) {
      const num = arr[i];

      steps.push({
        line: 3,
        explanation: `num=${num}. Stack=[${stack.join(',')}].`,
        variables: { num, stack: [...stack] },
        visualization: makeViz(i, 'idle'),
      });

      if (stack.length === 0 || stack[stack.length - 1] <= num) {
        stack.push(num);
        steps.push({
          line: 4,
          explanation: `stack empty or top=${stack[stack.length - 1] === num ? 'N/A' : stack[stack.length - 2] ?? 0} <= ${num}. Start new chunk with max=${num}.`,
          variables: { stack: [...stack], chunks: stack.length },
          visualization: makeViz(i, 'push'),
        });
      } else {
        const curMax = stack.pop()!;
        steps.push({
          line: 6,
          explanation: `stack.top=${curMax} > ${num}. Must merge chunks. Save curMax=${curMax}.`,
          variables: { curMax },
          visualization: makeViz(i, 'pop'),
        });

        while (stack.length > 0 && stack[stack.length - 1] > num) {
          const popped = stack.pop()!;
          steps.push({
            line: 7,
            explanation: `Merge: pop chunk with max=${popped} (> ${num}).`,
            variables: { popped, stack: [...stack] },
            visualization: makeViz(i, 'pop'),
          });
        }

        stack.push(curMax);
        steps.push({
          line: 8,
          explanation: `Restore curMax=${curMax} as merged chunk max. Stack=[${stack.join(',')}]. ${stack.length} chunks.`,
          variables: { stack: [...stack], chunks: stack.length },
          visualization: makeViz(i, 'push'),
        });
      }
    }

    steps.push({
      line: 9,
      explanation: `Done. Max chunks = ${stack.length}. Stack=[${stack.join(', ')}].`,
      variables: { result: stack.length },
      visualization: makeViz(n - 1, 'match'),
    });

    return steps;
  },
};

export default maxChunksToMakeSortedII;
