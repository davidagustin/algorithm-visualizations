import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cuttingWood: AlgorithmDefinition = {
  id: 'cutting-wood',
  title: 'Cutting Wood (Koko Eating Bananas)',
  leetcodeNumber: 875,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Koko has piles of bananas and h hours to eat them all. She eats at speed k bananas/hour (one pile per hour, even if she finishes early). Find the minimum integer k such that she can eat all bananas within h hours. Binary search on the answer space from 1 to max(piles).',
  tags: ['Binary Search', 'Binary Search on Answer'],
  code: {
    pseudocode: `function minEatingSpeed(piles, h):
  left = 1
  right = max(piles)
  while left < right:
    mid = left + (right - left) / 2
    hours = sum(ceil(p / mid) for p in piles)
    if hours <= h:
      right = mid
    else:
      left = mid + 1
  return left`,
    python: `import math

def minEatingSpeed(piles, h):
    left, right = 1, max(piles)
    while left < right:
        mid = left + (right - left) // 2
        hours = sum(math.ceil(p / mid) for p in piles)
        if hours <= h:
            right = mid
        else:
            left = mid + 1
    return left`,
    javascript: `function minEatingSpeed(piles, h) {
  let left = 1;
  let right = Math.max(...piles);
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    const hours = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);
    if (hours <= h) {
      right = mid;
    } else {
      left = mid + 1;
    }
  }
  return left;
}`,
    java: `public int minEatingSpeed(int[] piles, int h) {
    int left = 1, right = 0;
    for (int p : piles) right = Math.max(right, p);
    while (left < right) {
        int mid = left + (right - left) / 2;
        int hours = 0;
        for (int p : piles) hours += (p + mid - 1) / mid;
        if (hours <= h) {
            right = mid;
        } else {
            left = mid + 1;
        }
    }
    return left;
}`,
  },
  defaultInput: { piles: [3, 6, 7, 11], h: 8 },
  inputFields: [
    {
      name: 'piles',
      label: 'Piles',
      type: 'array',
      defaultValue: [3, 6, 7, 11],
      placeholder: '3,6,7,11',
      helperText: 'Comma-separated pile sizes',
    },
    {
      name: 'h',
      label: 'Hours (h)',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Maximum hours allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const piles = input.piles as number[];
    const h = input.h as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...piles],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Binary Search State', entries: auxEntries } } : {}),
    });

    const maxPile = Math.max(...piles);

    steps.push({
      line: 1,
      explanation: `Find minimum eating speed k for piles [${piles.join(', ')}] within ${h} hours. Binary search k in range [1, ${maxPile}].`,
      variables: { piles, h, maxPile },
      visualization: makeViz({}, {}, [{ key: 'Search Range', value: `[1, ${maxPile}]` }]),
    });

    let left = 1;
    let right = maxPile;

    steps.push({
      line: 2,
      explanation: `Initialize: left=1 (minimum possible speed), right=${right} (maximum pile size, guarantees 1 hour per pile).`,
      variables: { left, right },
      visualization: makeViz({}, {}, [
        { key: 'left', value: String(left) },
        { key: 'right', value: String(right) },
      ]),
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      const hoursNeeded = piles.reduce((s, p) => s + Math.ceil(p / mid), 0);

      const pileHighlights: Record<number, string> = {};
      const pileLabels: Record<number, string> = {};
      piles.forEach((p, i) => {
        pileHighlights[i] = 'active';
        pileLabels[i] = `${Math.ceil(p / mid)}h`;
      });

      steps.push({
        line: 5,
        explanation: `Try speed k=${mid}. For each pile, hours = ceil(pile/k): [${piles.map(p => Math.ceil(p / mid)).join(', ')}]. Total = ${hoursNeeded} hours.`,
        variables: { left, right, mid, k: mid, hoursNeeded, h },
        visualization: makeViz(pileHighlights, pileLabels, [
          { key: 'k (speed)', value: String(mid) },
          { key: 'Hours needed', value: String(hoursNeeded) },
          { key: 'Hours allowed', value: String(h) },
        ]),
      });

      if (hoursNeeded <= h) {
        steps.push({
          line: 7,
          explanation: `${hoursNeeded} <= ${h}: speed ${mid} is fast enough. Try slower: right = ${mid}.`,
          variables: { left, right: mid, hoursNeeded, h },
          visualization: makeViz(
            Object.fromEntries(piles.map((_, i) => [i, 'found'])),
            {},
            [{ key: 'k (speed)', value: String(mid) }, { key: 'Result', value: 'Feasible' }, { key: 'New right', value: String(mid) }],
          ),
        });
        right = mid;
      } else {
        steps.push({
          line: 9,
          explanation: `${hoursNeeded} > ${h}: speed ${mid} is too slow. Need faster: left = ${mid + 1}.`,
          variables: { left: mid + 1, right, hoursNeeded, h },
          visualization: makeViz(
            Object.fromEntries(piles.map((_, i) => [i, 'mismatch'])),
            {},
            [{ key: 'k (speed)', value: String(mid) }, { key: 'Result', value: 'Too slow' }, { key: 'New left', value: String(mid + 1) }],
          ),
        });
        left = mid + 1;
      }
    }

    const finalHours = piles.reduce((s, p) => s + Math.ceil(p / left), 0);
    const finalLabels: Record<number, string> = {};
    piles.forEach((p, i) => { finalLabels[i] = `${Math.ceil(p / left)}h`; });

    steps.push({
      line: 10,
      explanation: `Binary search converged. Minimum eating speed k = ${left}. At this speed, Koko needs ${finalHours} hours (within ${h} hour limit).`,
      variables: { result: left, hoursNeeded: finalHours, h },
      visualization: makeViz(
        Object.fromEntries(piles.map((_, i) => [i, 'found'])),
        finalLabels,
        [{ key: 'Answer', value: `k = ${left}` }, { key: 'Hours', value: `${finalHours} / ${h}` }],
      ),
    });

    return steps;
  },
};

export default cuttingWood;
