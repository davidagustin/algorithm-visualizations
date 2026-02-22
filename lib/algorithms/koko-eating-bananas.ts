import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kokoEatingBananas: AlgorithmDefinition = {
  id: 'koko-eating-bananas',
  title: 'Koko Eating Bananas',
  leetcodeNumber: 875,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Koko loves bananas. Given piles of bananas and h hours, find the minimum eating speed k such that all piles can be finished within h hours. Each hour Koko eats k bananas from one pile. Binary search on the speed, checking feasibility using ceil(pile/k) for each pile.',
  tags: ['binary search', 'greedy', 'array'],

  code: {
    pseudocode: `function minEatingSpeed(piles, h):
  left = 1
  right = max(piles)
  while left < right:
    mid = (left + right) / 2
    hours = sum(ceil(p / mid) for p in piles)
    if hours <= h:
      right = mid
    else:
      left = mid + 1
  return left`,

    python: `import math
def minEatingSpeed(piles: list[int], h: int) -> int:
    left, right = 1, max(piles)
    while left < right:
        mid = (left + right) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            right = mid
        else:
            left = mid + 1
    return left`,

    javascript: `function minEatingSpeed(piles, h) {
  let left = 1, right = Math.max(...piles);
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    const hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) right = mid;
    else left = mid + 1;
  }
  return left;
}`,

    java: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 0;
    for (int p : piles) right = Math.max(right, p);
    while (left < right) {
        int mid = (left + right) / 2;
        int hours = 0;
        for (int p : piles) hours += Math.ceil((double) p / mid);
        if (hours <= h) right = mid;
        else left = mid + 1;
    }
    return left;
}`,
  },

  defaultInput: {
    piles: [3, 6, 7, 11],
    h: 8,
  },

  inputFields: [
    {
      name: 'piles',
      label: 'Banana Piles',
      type: 'array',
      defaultValue: [3, 6, 7, 11],
      placeholder: '3,6,7,11',
      helperText: 'Comma-separated pile sizes',
    },
    {
      name: 'h',
      label: 'Hours Available',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Total hours Koko has to eat all bananas',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const piles = input.piles as number[];
    const h = input.h as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...piles],
      highlights,
      labels,
    });

    let left = 1;
    let right = Math.max(...piles);

    steps.push({
      line: 1,
      explanation: `Piles: [${piles.join(', ')}]. Hours available: ${h}. Binary search speed from 1 to ${right}.`,
      variables: { left, right, h },
      visualization: makeViz(
        piles.reduce((acc, _, i) => ({ ...acc, [i]: 'pointer' }), {}),
        piles.reduce((acc, p, i) => ({ ...acc, [i]: `${p}` }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      let hours = 0;
      for (const p of piles) hours += Math.ceil(p / mid);

      steps.push({
        line: 4,
        explanation: `Try speed k=${mid} bananas/hour. Total hours needed = ${hours}. Limit = ${h}.`,
        variables: { left, right, speed: mid, hoursNeeded: hours, h },
        visualization: makeViz(
          piles.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
          piles.reduce((acc, p, i) => ({ ...acc, [i]: `${Math.ceil(p / mid)}h` }), {})
        ),
      });

      if (hours <= h) {
        steps.push({
          line: 7,
          explanation: `${hours} hours <= ${h} limit. Speed k=${mid} works. Try slower: right = ${mid}.`,
          variables: { left, right, speed: mid, hoursNeeded: hours },
          visualization: makeViz(
            piles.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
            { 0: `k=${mid} ok` }
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `${hours} hours > ${h} limit. Speed k=${mid} too slow. Try faster: left = ${mid + 1}.`,
          variables: { left, right, speed: mid, hoursNeeded: hours },
          visualization: makeViz(
            piles.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            { 0: `k=${mid} slow` }
          ),
        });
        left = mid + 1;
      }
    }

    steps.push({
      line: 10,
      explanation: `Minimum eating speed found: k=${left} bananas per hour.`,
      variables: { result: left },
      visualization: makeViz(
        piles.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        { 0: `min k=${left}` }
      ),
    });

    return steps;
  },
};

export default kokoEatingBananas;
