import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfDaysToMakeBouquets: AlgorithmDefinition = {
  id: 'minimum-number-of-days-to-make-bouquets',
  title: 'Minimum Number of Days to Make m Bouquets',
  leetcodeNumber: 1482,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given bloom days for each flower, find the minimum number of days to make m bouquets of k adjacent flowers. Binary search on the answer (number of days): check if by day d we have enough groups of k consecutive bloomed flowers to form m bouquets.',
  tags: ['binary search', 'array', 'greedy'],

  code: {
    pseudocode: `function minDays(bloomDay, m, k):
  if m * k > n: return -1
  lo = min(bloomDay), hi = max(bloomDay)
  while lo < hi:
    mid = (lo + hi) / 2
    if canMake(bloomDay, mid, m, k):
      hi = mid
    else:
      lo = mid + 1
  return lo

function canMake(bloomDay, day, m, k):
  bouquets = 0, consecutive = 0
  for d in bloomDay:
    if d <= day: consecutive++
    else: consecutive = 0
    if consecutive == k:
      bouquets++, consecutive = 0
  return bouquets >= m`,
    python: `def minDays(bloomDay: list[int], m: int, k: int) -> int:
    n = len(bloomDay)
    if m * k > n: return -1
    def canMake(day):
        bouquets = consecutive = 0
        for d in bloomDay:
            if d <= day:
                consecutive += 1
                if consecutive == k:
                    bouquets += 1
                    consecutive = 0
            else:
                consecutive = 0
        return bouquets >= m
    lo, hi = min(bloomDay), max(bloomDay)
    while lo < hi:
        mid = (lo + hi) // 2
        if canMake(mid): hi = mid
        else: lo = mid + 1
    return lo`,
    javascript: `function minDays(bloomDay, m, k) {
  const n = bloomDay.length;
  if (m * k > n) return -1;
  const canMake = (day) => {
    let b = 0, c = 0;
    for (const d of bloomDay) {
      if (d <= day) { if (++c === k) { b++; c = 0; } }
      else c = 0;
    }
    return b >= m;
  };
  let lo = Math.min(...bloomDay), hi = Math.max(...bloomDay);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canMake(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int minDays(int[] bloomDay, int m, int k) {
    int n = bloomDay.length;
    if ((long)m * k > n) return -1;
    int lo = Integer.MAX_VALUE, hi = Integer.MIN_VALUE;
    for (int d : bloomDay) { lo = Math.min(lo, d); hi = Math.max(hi, d); }
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int b = 0, c = 0;
        for (int d : bloomDay) {
            if (d <= mid) { if (++c == k) { b++; c = 0; } } else c = 0;
        }
        if (b >= m) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    bloomDay: [1, 10, 3, 10, 2],
    m: 3,
    k: 1,
  },

  inputFields: [
    {
      name: 'bloomDay',
      label: 'Bloom Days',
      type: 'array',
      defaultValue: [1, 10, 3, 10, 2],
      placeholder: '1,10,3,10,2',
      helperText: 'Day each flower blooms',
    },
    {
      name: 'm',
      label: 'm (bouquets needed)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of bouquets required',
    },
    {
      name: 'k',
      label: 'k (flowers per bouquet)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Consecutive flowers needed per bouquet',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bloomDay = input.bloomDay as number[];
    const m = input.m as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const n = bloomDay.length;

    if (m * k > n) {
      steps.push({
        line: 1,
        explanation: `m*k=${m * k} > n=${n}. Impossible to make ${m} bouquets of ${k} flowers. Return -1.`,
        variables: { m, k, n, result: -1 },
        visualization: {
          type: 'array',
          array: [...bloomDay],
          highlights: {},
          labels: {},
        },
      });
      return steps;
    }

    const canMake = (day: number): { result: boolean; bouquets: number } => {
      let b = 0;
      let c = 0;
      for (const d of bloomDay) {
        if (d <= day) {
          c++;
          if (c === k) { b++; c = 0; }
        } else {
          c = 0;
        }
      }
      return { result: b >= m, bouquets: b };
    };

    let lo = Math.min(...bloomDay);
    let hi = Math.max(...bloomDay);

    steps.push({
      line: 1,
      explanation: `bloomDay=[${bloomDay.join(', ')}], m=${m}, k=${k}. Binary search days from ${lo} to ${hi}.`,
      variables: { lo, hi, m, k },
      visualization: {
        type: 'array',
        array: [...bloomDay],
        highlights: {},
        labels: bloomDay.reduce((acc, d, i) => ({ ...acc, [i]: `d=${d}` }), {}),
      },
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const { result, bouquets } = canMake(mid);

      const highlights: Record<number, string> = {};
      bloomDay.forEach((d, i) => { highlights[i] = d <= mid ? 'found' : 'mismatch'; });

      steps.push({
        line: 5,
        explanation: `day=mid=${mid}. Bloomed: ${bloomDay.filter(d => d <= mid).length} flowers. Can make ${bouquets} bouquets (need ${m}). ${result ? 'YES' : 'NO'}.`,
        variables: { lo, mid, hi, bouquets, needed: m, result },
        visualization: {
          type: 'array',
          array: [...bloomDay],
          highlights,
          labels: bloomDay.reduce((acc, d, i) => ({ ...acc, [i]: d <= mid ? 'bloom' : 'wait' }), {}),
        },
      });

      if (result) {
        hi = mid;
      } else {
        lo = mid + 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Minimum days = ${lo}. With ${lo} days, we can make ${m} bouquets of ${k} consecutive flowers.`,
      variables: { result: lo },
      visualization: {
        type: 'array',
        array: [...bloomDay],
        highlights: bloomDay.reduce((acc, d, i) => ({ ...acc, [i]: d <= lo ? 'sorted' : 'active' }), {}),
        labels: bloomDay.reduce((acc, d, i) => ({ ...acc, [i]: d <= lo ? 'bloom' : 'wait' }), {}),
      },
    });

    return steps;
  },
};

export default minimumNumberOfDaysToMakeBouquets;
