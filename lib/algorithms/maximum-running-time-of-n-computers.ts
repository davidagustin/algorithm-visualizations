import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumRunningTimeOfNComputers: AlgorithmDefinition = {
  id: 'maximum-running-time-of-n-computers',
  title: 'Maximum Running Time of N Computers',
  leetcodeNumber: 2141,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given n computers and batteries with given capacities, find the maximum time T all n computers can run simultaneously. Binary search on T: check if total energy sufficient = min(battery, T) summed >= n*T.',
  tags: ['binary search', 'array', 'greedy'],

  code: {
    pseudocode: `function maxRunTime(n, batteries):
  lo = 1, hi = sum(batteries) / n
  while lo < hi:
    mid = (lo + hi + 1) / 2
    total = sum(min(b, mid) for b in batteries)
    if total >= n * mid:
      lo = mid
    else:
      hi = mid - 1
  return lo`,
    python: `def maxRunTime(n: int, batteries: list[int]) -> int:
    lo, hi = 1, sum(batteries) // n
    while lo < hi:
        mid = (lo + hi + 1) // 2
        total = sum(min(b, mid) for b in batteries)
        if total >= n * mid:
            lo = mid
        else:
            hi = mid - 1
    return lo`,
    javascript: `function maxRunTime(n, batteries) {
  let lo = 1, hi = Math.floor(batteries.reduce((a, b) => a + b, 0) / n);
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    const total = batteries.reduce((s, b) => s + Math.min(b, mid), 0);
    if (total >= n * mid) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}`,
    java: `public long maxRunTime(int n, int[] batteries) {
    long lo = 1, hi = 0;
    for (int b : batteries) hi += b;
    hi /= n;
    while (lo < hi) {
        long mid = (lo + hi + 1) / 2;
        long total = 0;
        for (int b : batteries) total += Math.min(b, mid);
        if (total >= (long) n * mid) lo = mid;
        else hi = mid - 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    n: 2,
    batteries: [3, 3, 3],
  },

  inputFields: [
    {
      name: 'n',
      label: 'n (computers)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of computers to run simultaneously',
    },
    {
      name: 'batteries',
      label: 'Battery Capacities',
      type: 'array',
      defaultValue: [3, 3, 3],
      placeholder: '3,3,3',
      helperText: 'Capacity of each battery',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const batteries = input.batteries as number[];
    const steps: AlgorithmStep[] = [];

    const totalEnergy = batteries.reduce((a, b) => a + b, 0);
    let lo = 1;
    let hi = Math.floor(totalEnergy / n);

    const computeTotal = (t: number) => batteries.reduce((s, b) => s + Math.min(b, t), 0);

    steps.push({
      line: 1,
      explanation: `n=${n} computers, batteries=[${batteries.join(', ')}]. Total energy=${totalEnergy}. Search T from 1 to ${hi}.`,
      variables: { n, totalEnergy, lo, hi },
      visualization: {
        type: 'array',
        array: [...batteries],
        highlights: {},
        labels: batteries.reduce((acc, b, i) => ({ ...acc, [i]: `b=${b}` }), {}),
      },
    });

    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      const total = computeTotal(mid);
      const needed = n * mid;

      steps.push({
        line: 4,
        explanation: `T=mid=${mid}. Effective energy=sum(min(b,${mid}))=${total}. Need n*T=${needed}.`,
        variables: { lo, mid, hi, total, needed },
        visualization: {
          type: 'array',
          array: batteries.map(b => Math.min(b, mid)),
          highlights: batteries.reduce((acc, _, i) => ({ ...acc, [i]: 'comparing' }), {}),
          labels: batteries.reduce((acc, b, i) => ({ ...acc, [i]: `min(${b},${mid})` }), {}),
        },
      });

      if (total >= needed) {
        steps.push({
          line: 6,
          explanation: `Energy ${total} >= needed ${needed}. T=${mid} is feasible. Try larger. lo=${mid}.`,
          variables: { lo: mid, hi },
          visualization: {
            type: 'array',
            array: batteries.map(b => Math.min(b, mid)),
            highlights: batteries.reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
            labels: {},
          },
        });
        lo = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `Energy ${total} < needed ${needed}. T=${mid} too large. hi=${mid - 1}.`,
          variables: { lo, hi: mid - 1 },
          visualization: {
            type: 'array',
            array: batteries.map(b => Math.min(b, mid)),
            highlights: batteries.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
            labels: {},
          },
        });
        hi = mid - 1;
      }
    }

    steps.push({
      line: 9,
      explanation: `Maximum running time for all ${n} computers = ${lo} minutes.`,
      variables: { result: lo, n },
      visualization: {
        type: 'array',
        array: batteries.map(b => Math.min(b, lo)),
        highlights: batteries.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: batteries.reduce((acc, b, i) => ({ ...acc, [i]: `use=${Math.min(b, lo)}` }), {}),
      },
    });

    return steps;
  },
};

export default maximumRunningTimeOfNComputers;
