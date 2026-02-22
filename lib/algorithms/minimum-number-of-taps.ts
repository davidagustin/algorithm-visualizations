import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfTaps: AlgorithmDefinition = {
  id: 'minimum-number-of-taps',
  title: 'Minimum Number of Taps to Open to Water a Garden',
  leetcodeNumber: 1326,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'There is a one-dimensional garden from 0 to n. There are n+1 taps located at positions 0 through n. Given an array ranges where ranges[i] means the tap at position i can water the area [i-ranges[i], i+ranges[i]], find the minimum number of taps to open to water the entire garden. Uses a greedy interval-covering approach similar to Jump Game II.',
  tags: ['greedy', 'array', 'interval', 'dynamic programming'],

  code: {
    pseudocode: `function minTaps(n, ranges):
  maxReach = array of size n+1, all 0
  for i from 0 to n:
    left = max(0, i - ranges[i])
    right = min(n, i + ranges[i])
    maxReach[left] = max(maxReach[left], right)
  taps = 0, curEnd = 0, farthest = 0
  for i from 0 to n-1:
    farthest = max(farthest, maxReach[i])
    if i == curEnd:
      if farthest == curEnd: return -1
      taps++
      curEnd = farthest
  return taps`,

    python: `def minTaps(n: int, ranges: list[int]) -> int:
    max_reach = [0] * (n + 1)
    for i in range(n + 1):
        left = max(0, i - ranges[i])
        right = min(n, i + ranges[i])
        max_reach[left] = max(max_reach[left], right)
    taps = cur_end = farthest = 0
    for i in range(n):
        farthest = max(farthest, max_reach[i])
        if i == cur_end:
            if farthest == cur_end:
                return -1
            taps += 1
            cur_end = farthest
    return taps`,

    javascript: `function minTaps(n, ranges) {
  const maxReach = new Array(n + 1).fill(0);
  for (let i = 0; i <= n; i++) {
    const left = Math.max(0, i - ranges[i]);
    const right = Math.min(n, i + ranges[i]);
    maxReach[left] = Math.max(maxReach[left], right);
  }
  let taps = 0, curEnd = 0, farthest = 0;
  for (let i = 0; i < n; i++) {
    farthest = Math.max(farthest, maxReach[i]);
    if (i === curEnd) {
      if (farthest === curEnd) return -1;
      taps++;
      curEnd = farthest;
    }
  }
  return taps;
}`,

    java: `public int minTaps(int n, int[] ranges) {
    int[] maxReach = new int[n + 1];
    for (int i = 0; i <= n; i++) {
        int left = Math.max(0, i - ranges[i]);
        int right = Math.min(n, i + ranges[i]);
        maxReach[left] = Math.max(maxReach[left], right);
    }
    int taps = 0, curEnd = 0, farthest = 0;
    for (int i = 0; i < n; i++) {
        farthest = Math.max(farthest, maxReach[i]);
        if (i == curEnd) {
            if (farthest == curEnd) return -1;
            taps++;
            curEnd = farthest;
        }
    }
    return taps;
}`,
  },

  defaultInput: {
    n: 5,
    ranges: [3, 4, 1, 1, 0, 0],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Garden Length (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Length of the garden (0 to n)',
    },
    {
      name: 'ranges',
      label: 'Tap Ranges',
      type: 'array',
      defaultValue: [3, 4, 1, 1, 0, 0],
      placeholder: '3,4,1,1,0,0',
      helperText: 'Ranges for each tap position 0 to n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const ranges = input.ranges as number[];
    const steps: AlgorithmStep[] = [];

    const maxReach = new Array(n + 1).fill(0);

    steps.push({
      line: 1,
      explanation: `Initialize maxReach array of size ${n + 1} to track farthest right reach from each left endpoint.`,
      variables: { n, ranges: [...ranges] },
      visualization: {
        type: 'array',
        array: [...maxReach],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i <= n; i++) {
      const left = Math.max(0, i - ranges[i]);
      const right = Math.min(n, i + ranges[i]);
      maxReach[left] = Math.max(maxReach[left], right);
      steps.push({
        line: 3,
        explanation: `Tap at position ${i} with range ${ranges[i]} covers [${left}, ${right}]. Update maxReach[${left}] = ${maxReach[left]}.`,
        variables: { i, 'ranges[i]': ranges[i], left, right, 'maxReach[left]': maxReach[left] },
        visualization: {
          type: 'array',
          array: [...maxReach],
          highlights: { [left]: 'active', [right]: 'found' } as Record<number, string>,
          labels: { [left]: `L${i}` } as Record<number, string>,
        },
      });
    }

    let taps = 0;
    let curEnd = 0;
    let farthest = 0;

    steps.push({
      line: 6,
      explanation: 'Greedy sweep: treat maxReach as jump distances and count minimum jumps to cover 0..n.',
      variables: { taps, curEnd, farthest },
      visualization: {
        type: 'array',
        array: [...maxReach],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < n; i++) {
      farthest = Math.max(farthest, maxReach[i]);
      if (i === curEnd) {
        if (farthest === curEnd) {
          steps.push({
            line: 10,
            explanation: `Cannot extend coverage past position ${curEnd}. Return -1 (impossible to water entire garden).`,
            variables: { i, farthest, curEnd, taps },
            visualization: {
              type: 'array',
              array: [...maxReach],
              highlights: { [i]: 'mismatch' } as Record<number, string>,
              labels: {},
            },
          });
          return steps;
        }
        taps++;
        curEnd = farthest;
        steps.push({
          line: 11,
          explanation: `Reached boundary at position ${i}. Open tap to extend coverage to ${curEnd}. Total taps: ${taps}.`,
          variables: { i, farthest, curEnd, taps },
          visualization: {
            type: 'array',
            array: [...maxReach],
            highlights: { [i]: 'active', [curEnd]: 'found' } as Record<number, string>,
            labels: { [i]: `tap${taps}` } as Record<number, string>,
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Entire garden watered with ${taps} tap(s).`,
      variables: { taps, curEnd },
      visualization: {
        type: 'array',
        array: [...maxReach],
        highlights: Object.fromEntries(maxReach.map((_, idx) => [idx, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumNumberOfTaps;
