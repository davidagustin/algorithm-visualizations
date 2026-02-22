import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const dailyTemperatures: AlgorithmDefinition = {
  id: 'daily-temperatures',
  title: 'Daily Temperatures',
  leetcodeNumber: 739,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Given an array of daily temperatures, return an array where each element is the number of days until a warmer temperature. Use a monotonic decreasing stack of indices. When a warmer temperature is found, pop all colder indices and compute the wait.',
  tags: ['Stack', 'Array', 'Monotonic Stack'],
  code: {
    pseudocode: `function dailyTemperatures(temps):
  n = length of temps
  answer = array of n zeros
  stack = []  // indices, decreasing temperature
  for i from 0 to n-1:
    while stack not empty and temps[i] > temps[stack.top]:
      j = stack.pop()
      answer[j] = i - j
    stack.push(i)
  return answer`,
    python: `def dailyTemperatures(temperatures):
    n = len(temperatures)
    answer = [0] * n
    stack = []  # indices
    for i, temp in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < temp:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer`,
    javascript: `function dailyTemperatures(temperatures) {
  const n = temperatures.length;
  const answer = new Array(n).fill(0);
  const stack = []; // indices
  for (let i = 0; i < n; i++) {
    while (stack.length && temperatures[stack[stack.length - 1]] < temperatures[i]) {
      const j = stack.pop();
      answer[j] = i - j;
    }
    stack.push(i);
  }
  return answer;
}`,
    java: `public int[] dailyTemperatures(int[] temperatures) {
    int n = temperatures.length;
    int[] answer = new int[n];
    Deque<Integer> stack = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!stack.isEmpty() && temperatures[stack.peek()] < temperatures[i]) {
            int j = stack.pop();
            answer[j] = i - j;
        }
        stack.push(i);
    }
    return answer;
}`,
  },
  defaultInput: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] },
  inputFields: [
    {
      name: 'temperatures',
      label: 'Temperatures',
      type: 'array',
      defaultValue: [73, 74, 75, 71, 69, 72, 76, 73],
      placeholder: 'e.g. 73,74,75,71,69,72,76,73',
      helperText: 'Comma-separated daily temperatures',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const temperatures = (input.temperatures as number[]).slice();
    const n = temperatures.length;
    const steps: AlgorithmStep[] = [];
    const answer: number[] = new Array(n).fill(0);
    const stack: number[] = []; // indices

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (answer[i] !== 0) {
          highlights[i] = 'found';
          labels[i] = `+${answer[i]}d`;
        } else if (stack.includes(i)) {
          highlights[i] = 'active';
          labels[i] = stack[stack.length - 1] === i ? 'top' : 'stk';
        } else if (i === activeIdx) {
          highlights[i] = 'comparing';
        } else {
          highlights[i] = 'default';
        }
        if (i === activeIdx) {
          labels[i] = (labels[i] ? labels[i] + ' ' : '') + 'curr';
          highlights[i] = 'current';
        }
      }

      return {
        type: 'array',
        array: temperatures,
        highlights,
        labels,
        auxData: {
          label: 'Stack (indices) & Answer',
          entries: [
            { key: 'Stack indices', value: stack.length > 0 ? `[${stack.join(', ')}]` : 'empty' },
            { key: 'Stack temps', value: stack.length > 0 ? `[${stack.map(i => temperatures[i]).join(', ')}]` : 'empty' },
            { key: 'Answer', value: `[${answer.join(', ')}]` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Initialize answer array with zeros and an empty stack (stores indices). Iterate left to right.',
      variables: { temperatures, answer: [...answer] },
      visualization: makeViz(null),
    });

    for (let i = 0; i < n; i++) {
      steps.push({
        line: 5,
        explanation: `Day ${i}: temperature = ${temperatures[i]}. Check if this is warmer than days waiting in stack.`,
        variables: { i, temp: temperatures[i], stack: [...stack] },
        visualization: makeViz(i),
      });

      while (stack.length > 0 && temperatures[stack[stack.length - 1]] < temperatures[i]) {
        const j = stack.pop()!;
        answer[j] = i - j;
        steps.push({
          line: 6,
          explanation: `temperatures[${j}]=${temperatures[j]} < temperatures[${i}]=${temperatures[i]}. Pop index ${j}. answer[${j}] = ${i} - ${j} = ${answer[j]} days.`,
          variables: { popped: j, 'answer[j]': answer[j], stack: [...stack] },
          visualization: makeViz(i),
        });
      }

      stack.push(i);
      steps.push({
        line: 8,
        explanation: `Push index ${i} (temp=${temperatures[i]}) onto stack. No warmer day found yet for this index.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 9,
      explanation: `All days processed. Remaining indices in stack have no warmer future day (answer stays 0). Final: [${answer.join(', ')}].`,
      variables: { answer: [...answer] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          h[i] = answer[i] !== 0 ? 'found' : 'visited';
          l[i] = `${answer[i]}d`;
        }
        return {
          type: 'array' as const,
          array: temperatures,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Final Answer',
            entries: [{ key: 'Answer', value: `[${answer.join(', ')}]` }],
          },
        };
      })(),
    });

    return steps;
  },
};

export default dailyTemperatures;
