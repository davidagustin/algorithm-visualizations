import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumSwapsToGroupAllOnes: AlgorithmDefinition = {
  id: 'minimum-swaps-to-group-all-ones',
  title: 'Minimum Swaps to Group All 1s Together II',
  leetcodeNumber: 2134,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a circular binary array data, return the minimum number of swaps required to group all 1s in any location in the circular array. Count total 1s, then use a sliding window of that size to find the window with the maximum number of 1s already in place.',
  tags: ['sliding window', 'array', 'circular', 'greedy'],

  code: {
    pseudocode: `function minSwaps(data):
  totalOnes = sum(data)
  windowOnes = sum(data[0..totalOnes-1])
  maxOnes = windowOnes
  n = len(data)
  for i in range(totalOnes, n + totalOnes):
    windowOnes += data[i % n]
    windowOnes -= data[(i - totalOnes) % n]
    maxOnes = max(maxOnes, windowOnes)
  return totalOnes - maxOnes`,

    python: `def minSwaps(data: list[int]) -> int:
    total = sum(data)
    window = sum(data[:total])
    best = window
    n = len(data)
    for i in range(total, n + total):
        window += data[i % n]
        window -= data[(i - total) % n]
        best = max(best, window)
    return total - best`,

    javascript: `function minSwaps(data) {
  const total = data.reduce((s, x) => s + x, 0);
  let window = data.slice(0, total).reduce((s, x) => s + x, 0);
  let best = window;
  const n = data.length;
  for (let i = total; i < n + total; i++) {
    window += data[i % n];
    window -= data[(i - total) % n];
    best = Math.max(best, window);
  }
  return total - best;
}`,

    java: `public int minSwaps(int[] data) {
    int total = 0;
    for (int x : data) total += x;
    int window = 0;
    for (int i = 0; i < total; i++) window += data[i];
    int best = window;
    int n = data.length;
    for (int i = total; i < n + total; i++) {
        window += data[i % n];
        window -= data[(i - total) % n];
        best = Math.max(best, window);
    }
    return total - best;
}`,
  },

  defaultInput: {
    data: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
  },

  inputFields: [
    {
      name: 'data',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1, 0, 0, 1, 1, 0],
      placeholder: '1,0,1,0,1,0,0,1,1,0',
      helperText: 'Circular binary array of 0s and 1s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const data = input.data as number[];
    const steps: AlgorithmStep[] = [];
    const n = data.length;

    const totalOnes = data.reduce((s, x) => s + x, 0);

    steps.push({
      line: 1,
      explanation: `Count total 1s in array: ${totalOnes}. The window size is ${totalOnes} since we want all 1s grouped together.`,
      variables: { totalOnes, windowSize: totalOnes },
      visualization: {
        type: 'array',
        array: [...data],
        highlights: Object.fromEntries(data.map((v, i) => [i, v === 1 ? 'found' : 'default'])),
        labels: {},
      } as ArrayVisualization,
    });

    let windowOnes = 0;
    for (let i = 0; i < totalOnes; i++) windowOnes += data[i];
    let maxOnes = windowOnes;

    steps.push({
      line: 2,
      explanation: `Initial window [0..${totalOnes - 1}] contains ${windowOnes} ones. Swaps needed = ${totalOnes} - ${windowOnes} = ${totalOnes - windowOnes}.`,
      variables: { windowOnes, maxOnes, swapsNeeded: totalOnes - windowOnes },
      visualization: {
        type: 'array',
        array: [...data],
        highlights: Object.fromEntries(Array.from({ length: totalOnes }, (_, i) => [i, 'active'])),
        labels: { 0: 'L', [totalOnes - 1]: 'R' },
      } as ArrayVisualization,
    });

    for (let i = totalOnes; i < n + totalOnes; i++) {
      const addIdx = i % n;
      const removeIdx = (i - totalOnes) % n;
      windowOnes += data[addIdx];
      windowOnes -= data[removeIdx];
      if (windowOnes > maxOnes) maxOnes = windowOnes;

      const left = removeIdx + 1 < n ? removeIdx + 1 : 0;
      const right = addIdx;

      steps.push({
        line: 5,
        explanation: `Slide window: add data[${addIdx}]=${data[addIdx]}, remove data[${removeIdx}]=${data[removeIdx]}. Window now has ${windowOnes} ones. Best = ${maxOnes}.`,
        variables: { left, right: addIdx, windowOnes, maxOnes, swapsNeeded: totalOnes - maxOnes },
        visualization: {
          type: 'array',
          array: [...data],
          highlights: { [addIdx]: 'found', [removeIdx]: 'sorted' },
          labels: { [addIdx]: 'in', [removeIdx]: 'out' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Best window had ${maxOnes} ones already in place. Minimum swaps = ${totalOnes} - ${maxOnes} = ${totalOnes - maxOnes}.`,
      variables: { totalOnes, maxOnes, result: totalOnes - maxOnes },
      visualization: {
        type: 'array',
        array: [...data],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumSwapsToGroupAllOnes;
