import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumRecolorsToGetKBlack: AlgorithmDefinition = {
  id: 'minimum-recolors-to-get-k-black',
  title: 'Minimum Recolors to Get K Consecutive Black Blocks',
  leetcodeNumber: 2379,
  difficulty: 'Easy',
  category: 'Sliding Window',
  description:
    'Given a string blocks of B and W characters and an integer k, in one operation you can change a W to B. Return the minimum number of operations needed to have at least k consecutive black blocks. Use a fixed-size sliding window counting white blocks.',
  tags: ['sliding window', 'string'],

  code: {
    pseudocode: `function minimumRecolors(blocks, k):
  whites = count W in blocks[0..k-1]
  result = whites
  for i in range(k, len(blocks)):
    if blocks[i] == 'W': whites++
    if blocks[i-k] == 'W': whites--
    result = min(result, whites)
  return result`,

    python: `def minimumRecolors(blocks: str, k: int) -> int:
    whites = blocks[:k].count('W')
    result = whites
    for i in range(k, len(blocks)):
        if blocks[i] == 'W': whites += 1
        if blocks[i-k] == 'W': whites -= 1
        result = min(result, whites)
    return result`,

    javascript: `function minimumRecolors(blocks, k) {
  let whites = 0;
  for (let i = 0; i < k; i++) if (blocks[i] === 'W') whites++;
  let result = whites;
  for (let i = k; i < blocks.length; i++) {
    if (blocks[i] === 'W') whites++;
    if (blocks[i-k] === 'W') whites--;
    result = Math.min(result, whites);
  }
  return result;
}`,

    java: `public int minimumRecolors(String blocks, int k) {
    int whites = 0;
    for (int i = 0; i < k; i++) if (blocks.charAt(i) == 'W') whites++;
    int result = whites;
    for (int i = k; i < blocks.length(); i++) {
        if (blocks.charAt(i) == 'W') whites++;
        if (blocks.charAt(i-k) == 'W') whites--;
        result = Math.min(result, whites);
    }
    return result;
}`,
  },

  defaultInput: {
    blocks: 'WBBWWBBWBW',
    k: 7,
  },

  inputFields: [
    {
      name: 'blocks',
      label: 'Blocks String',
      type: 'string',
      defaultValue: 'WBBWWBBWBW',
      placeholder: 'WBBWWBBWBW',
      helperText: 'String of B (black) and W (white) characters',
    },
    {
      name: 'k',
      label: 'Consecutive Black k',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Required consecutive black blocks',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const blocks = input.blocks as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = blocks.length;

    const arr = blocks.split('').map(c => c === 'B' ? 1 : 0);

    let whites = 0;
    for (let i = 0; i < k; i++) if (blocks[i] === 'W') whites++;

    steps.push({
      line: 1,
      explanation: `Initial window [0..${k - 1}]: "${blocks.slice(0, k)}". Contains ${whites} white blocks. Need to recolor ${whites} blocks to get ${k} consecutive black.`,
      variables: { whites, result: whites, k },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(Array.from({ length: k }, (_, i) => [i, blocks[i] === 'B' ? 'found' : 'mismatch'])),
        labels: { 0: 'L', [k - 1]: 'R' },
      } as ArrayVisualization,
    });

    let result = whites;

    for (let i = k; i < n; i++) {
      if (blocks[i] === 'W') whites++;
      if (blocks[i - k] === 'W') whites--;
      if (whites < result) result = whites;
      const winStart = i - k + 1;

      steps.push({
        line: 5,
        explanation: `Slide to window [${winStart}..${i}]: "${blocks.slice(winStart, i + 1)}". Add "${blocks[i]}", remove "${blocks[i - k]}". White count = ${whites}. Best = ${result}.`,
        variables: { windowStart: winStart, windowEnd: i, whites, result },
        visualization: {
          type: 'array',
          array: arr,
          highlights: {
            ...Object.fromEntries(Array.from({ length: k }, (_, idx) => [winStart + idx, blocks[winStart + idx] === 'B' ? 'found' : 'mismatch'])),
            [i - k]: 'sorted',
          },
          labels: { [winStart]: 'L', [i]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Minimum recolors needed = ${result}. The best window of size ${k} already has ${k - result} black blocks.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumRecolorsToGetKBlack;
