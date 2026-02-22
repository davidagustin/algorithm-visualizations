import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const aggressiveCows: AlgorithmDefinition = {
  id: 'aggressive-cows',
  title: 'Aggressive Cows',
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given stall positions and c cows, find the maximum possible minimum distance between any two cows. Binary search on the minimum distance: check if we can place c cows such that any two are at least that distance apart.',
  tags: ['binary search', 'greedy', 'sorting', 'classic'],

  code: {
    pseudocode: `function aggressiveCows(stalls, c):
  sort stalls
  lo = 1, hi = stalls[n-1] - stalls[0]
  while lo < hi:
    mid = (lo + hi + 1) / 2
    if canPlace(stalls, c, mid):
      lo = mid
    else:
      hi = mid - 1
  return lo

function canPlace(stalls, c, minDist):
  count = 1, last = stalls[0]
  for i from 1 to n-1:
    if stalls[i] - last >= minDist:
      count++, last = stalls[i]
      if count == c: return true
  return count >= c`,
    python: `def aggressiveCows(stalls: list[int], c: int) -> int:
    stalls.sort()
    n = len(stalls)
    def canPlace(minDist):
        count, last = 1, stalls[0]
        for i in range(1, n):
            if stalls[i] - last >= minDist:
                count += 1
                last = stalls[i]
                if count == c:
                    return True
        return count >= c
    lo, hi = 1, stalls[-1] - stalls[0]
    while lo < hi:
        mid = (lo + hi + 1) // 2
        if canPlace(mid): lo = mid
        else: hi = mid - 1
    return lo`,
    javascript: `function aggressiveCows(stalls, c) {
  stalls.sort((a, b) => a - b);
  const n = stalls.length;
  const canPlace = (minDist) => {
    let count = 1, last = stalls[0];
    for (let i = 1; i < n; i++) {
      if (stalls[i] - last >= minDist) {
        count++;
        last = stalls[i];
        if (count === c) return true;
      }
    }
    return count >= c;
  };
  let lo = 1, hi = stalls[n - 1] - stalls[0];
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (canPlace(mid)) lo = mid; else hi = mid - 1;
  }
  return lo;
}`,
    java: `public int aggressiveCows(int[] stalls, int c) {
    Arrays.sort(stalls);
    int n = stalls.length, lo = 1, hi = stalls[n-1] - stalls[0];
    while (lo < hi) {
        int mid = (lo + hi + 1) / 2;
        int count = 1, last = stalls[0];
        for (int i = 1; i < n; i++) {
            if (stalls[i] - last >= mid) { count++; last = stalls[i]; }
        }
        if (count >= c) lo = mid; else hi = mid - 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    stalls: [1, 2, 8, 4, 9],
    c: 3,
  },

  inputFields: [
    {
      name: 'stalls',
      label: 'Stall Positions',
      type: 'array',
      defaultValue: [1, 2, 8, 4, 9],
      placeholder: '1,2,8,4,9',
      helperText: 'Positions of stalls (will be sorted)',
    },
    {
      name: 'c',
      label: 'c (number of cows)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of cows to place',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const stalls = [...(input.stalls as number[])].sort((a, b) => a - b);
    const c = input.c as number;
    const steps: AlgorithmStep[] = [];
    const n = stalls.length;

    const canPlace = (minDist: number): { result: boolean; placed: number[] } => {
      const placed = [stalls[0]];
      let last = stalls[0];
      for (let i = 1; i < n; i++) {
        if (stalls[i] - last >= minDist) {
          placed.push(stalls[i]);
          last = stalls[i];
          if (placed.length === c) break;
        }
      }
      return { result: placed.length >= c, placed };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...stalls],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sorted stalls=[${stalls.join(', ')}]. c=${c} cows. Binary search on minimum distance.`,
      variables: { stalls: stalls.join(','), c },
      visualization: makeViz({}, stalls.reduce((acc, s, i) => ({ ...acc, [i]: `s=${s}` }), {})),
    });

    let lo = 1;
    let hi = stalls[n - 1] - stalls[0];

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const { result, placed } = canPlace(mid);

      const highlights: Record<number, string> = {};
      stalls.forEach((s, i) => { highlights[i] = placed.includes(s) ? 'found' : 'comparing'; });

      steps.push({
        line: 5,
        explanation: `mid=${mid}. Place cows with min dist ${mid}: placed at [${placed.join(', ')}]. ${result ? 'Possible' : 'Not possible'}.`,
        variables: { lo, mid, hi, placed: placed.join(','), result },
        visualization: makeViz(highlights, stalls.reduce((acc, s, i) => ({ ...acc, [i]: placed.includes(s) ? 'cow' : `${s}` }), {})),
      });

      if (result) {
        steps.push({
          line: 6,
          explanation: `Min dist ${mid} works. Try larger distance. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: makeViz(highlights, {}),
        });
        lo = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `Min dist ${mid} fails. Try smaller distance. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: makeViz(stalls.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}), {}),
        });
        hi = mid - 1;
      }
    }

    const { placed } = canPlace(lo);
    const finalHighlights: Record<number, string> = {};
    stalls.forEach((s, i) => { finalHighlights[i] = placed.includes(s) ? 'sorted' : 'active'; });

    steps.push({
      line: 9,
      explanation: `Maximum minimum distance between cows = ${lo}. Cows placed at [${placed.join(', ')}].`,
      variables: { result: lo, cowPositions: placed.join(',') },
      visualization: makeViz(finalHighlights, {}),
    });

    return steps;
  },
};

export default aggressiveCows;
