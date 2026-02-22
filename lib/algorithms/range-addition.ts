import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeAddition: AlgorithmDefinition = {
  id: 'range-addition',
  title: 'Range Addition',
  leetcodeNumber: 370,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given length n and a list of update operations [startIndex, endIndex, inc], apply each operation by incrementing all elements in the range by inc. Use the prefix sum difference array technique: mark +inc at startIndex and -inc at endIndex+1, then take a running prefix sum to get final values in O(n + k) time.',
  tags: ['array', 'prefix sum', 'difference array'],

  code: {
    pseudocode: `function getModifiedArray(length, updates):
  diff = array of zeros size length+1
  for [start, end, inc] in updates:
    diff[start] += inc
    diff[end+1] -= inc
  result = []
  running = 0
  for i in 0..length-1:
    running += diff[i]
    result.append(running)
  return result`,
    python: `def getModifiedArray(length, updates):
    diff = [0] * (length + 1)
    for start, end, inc in updates:
        diff[start] += inc
        diff[end + 1] -= inc
    result, running = [], 0
    for i in range(length):
        running += diff[i]
        result.append(running)
    return result`,
    javascript: `function getModifiedArray(length, updates) {
  const diff = new Array(length + 1).fill(0);
  for (const [start, end, inc] of updates) {
    diff[start] += inc;
    diff[end + 1] -= inc;
  }
  const result = [];
  let running = 0;
  for (let i = 0; i < length; i++) {
    running += diff[i];
    result.push(running);
  }
  return result;
}`,
    java: `public int[] getModifiedArray(int length, int[][] updates) {
    int[] diff = new int[length + 1];
    for (int[] u : updates) {
        diff[u[0]] += u[2];
        diff[u[1] + 1] -= u[2];
    }
    int[] result = new int[length];
    int running = 0;
    for (int i = 0; i < length; i++) {
        running += diff[i];
        result[i] = running;
    }
    return result;
}`,
  },

  defaultInput: {
    length: 5,
    updates: [[1, 3, 2], [2, 4, 3], [0, 2, -2]],
  },

  inputFields: [
    {
      name: 'length',
      label: 'Array Length',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Length of the output array',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const length = (input.length as number) || 5;
    const updates = [[1, 3, 2], [2, 4, 3], [0, 2, -2]];
    const steps: AlgorithmStep[] = [];
    const diff = new Array(length + 1).fill(0);

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize difference array of size ${length + 1} with zeros.`,
      variables: { length, diff: diff.slice(0, length).join(', ') },
      visualization: makeViz(diff.slice(0, length), {}, {}),
    });

    for (const [start, end, inc] of updates) {
      diff[start] += inc;
      diff[end + 1] -= inc;
      steps.push({
        line: 3,
        explanation: `Update [${start}, ${end}, ${inc}]: diff[${start}] += ${inc}, diff[${end + 1}] -= ${inc}.`,
        variables: { start, end, inc, diff: diff.slice(0, length).join(', ') },
        visualization: makeViz(
          diff.slice(0, length),
          { [start]: 'active', [Math.min(end + 1, length - 1)]: 'comparing' },
          { [start]: `+${inc}`, [Math.min(end + 1, length - 1)]: `-${inc}` }
        ),
      });
    }

    const result: number[] = [];
    let running = 0;
    for (let i = 0; i < length; i++) {
      running += diff[i];
      result.push(running);
      steps.push({
        line: 8,
        explanation: `Prefix sum at index ${i}: running += diff[${i}] (${diff[i]}) = ${running}. result[${i}] = ${running}.`,
        variables: { i, 'diff[i]': diff[i], running, result: result.join(', ') },
        visualization: makeViz(
          [...result, ...new Array(length - result.length).fill(0)],
          { [i]: 'active' },
          { [i]: String(running) }
        ),
      });
    }

    steps.push({
      line: 10,
      explanation: `Final result after all range additions: [${result.join(', ')}].`,
      variables: { result: result.join(', ') },
      visualization: makeViz(result, Object.fromEntries(result.map((_, i) => [i, 'sorted'])), {}),
    });

    return steps;
  },
};

export default rangeAddition;
