import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const grumpyBookstoreOwner: AlgorithmDefinition = {
  id: 'grumpy-bookstore-owner',
  title: 'Grumpy Bookstore Owner',
  leetcodeNumber: 1052,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A bookstore owner can be grumpy some minutes. Customers only stay satisfied when the owner is not grumpy. The owner can use a technique to suppress grumpiness for k consecutive minutes. Find the maximum satisfied customers.',
  tags: ['sliding window', 'fixed window', 'greedy', 'array'],

  code: {
    pseudocode: `function maxSatisfied(customers, grumpy, k):
  base = sum(customers[i] for i where grumpy[i] == 0)
  gain = sum(customers[0..k-1] where grumpy[i] == 1)
  maxGain = gain
  for right = k to len(customers)-1:
    if grumpy[right] == 1: gain += customers[right]
    if grumpy[right-k] == 1: gain -= customers[right-k]
    maxGain = max(maxGain, gain)
  return base + maxGain`,

    python: `def maxSatisfied(customers, grumpy, k):
    base = sum(c for c, g in zip(customers, grumpy) if g == 0)
    gain = sum(c for c, g in zip(customers[:k], grumpy[:k]) if g == 1)
    max_gain = gain
    for right in range(k, len(customers)):
        if grumpy[right] == 1:
            gain += customers[right]
        if grumpy[right - k] == 1:
            gain -= customers[right - k]
        max_gain = max(max_gain, gain)
    return base + max_gain`,

    javascript: `function maxSatisfied(customers, grumpy, k) {
  let base = 0;
  for (let i = 0; i < customers.length; i++)
    if (grumpy[i] === 0) base += customers[i];
  let gain = 0;
  for (let i = 0; i < k; i++)
    if (grumpy[i] === 1) gain += customers[i];
  let maxGain = gain;
  for (let right = k; right < customers.length; right++) {
    if (grumpy[right] === 1) gain += customers[right];
    if (grumpy[right - k] === 1) gain -= customers[right - k];
    maxGain = Math.max(maxGain, gain);
  }
  return base + maxGain;
}`,

    java: `public int maxSatisfied(int[] customers, int[] grumpy, int k) {
    int base = 0;
    for (int i = 0; i < customers.length; i++)
        if (grumpy[i] == 0) base += customers[i];
    int gain = 0;
    for (int i = 0; i < k; i++)
        if (grumpy[i] == 1) gain += customers[i];
    int maxGain = gain;
    for (int right = k; right < customers.length; right++) {
        if (grumpy[right] == 1) gain += customers[right];
        if (grumpy[right - k] == 1) gain -= customers[right - k];
        maxGain = Math.max(maxGain, gain);
    }
    return base + maxGain;
}`,
  },

  defaultInput: {
    customers: [1, 0, 1, 2, 1, 1, 7, 5],
    grumpy: [0, 1, 0, 1, 0, 1, 0, 1],
    k: 3,
  },

  inputFields: [
    {
      name: 'customers',
      label: 'Customers per Minute',
      type: 'array',
      defaultValue: [1, 0, 1, 2, 1, 1, 7, 5],
      placeholder: '1,0,1,2,1,1,7,5',
      helperText: 'Number of customers each minute',
    },
    {
      name: 'grumpy',
      label: 'Grumpy Minutes (0/1)',
      type: 'array',
      defaultValue: [0, 1, 0, 1, 0, 1, 0, 1],
      placeholder: '0,1,0,1,0,1,0,1',
      helperText: '1 = grumpy, 0 = not grumpy',
    },
    {
      name: 'k',
      label: 'Suppression Duration (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Minutes the owner can suppress grumpiness',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const customers = (input.customers as number[]) || [1, 0, 1, 2, 1, 1, 7, 5];
    const grumpy = (input.grumpy as number[]) || [0, 1, 0, 1, 0, 1, 0, 1];
    const k = (input.k as number) ?? 3;
    const n = customers.length;
    const steps: AlgorithmStep[] = [];

    let base = 0;
    for (let i = 0; i < n; i++) if (grumpy[i] === 0) base += customers[i];

    const makeViz = (
      windowLeft: number,
      windowRight: number,
      highlights: Record<number, string>,
      labels: Record<number, string>,
      gain: number,
      maxGain: number
    ): ArrayVisualization => ({
      type: 'array',
      array: customers,
      highlights,
      labels,
      auxData: {
        label: 'Satisfaction Stats',
        entries: [
          { key: 'base satisfied', value: `${base}` },
          { key: 'current gain', value: `${gain}` },
          { key: 'max gain', value: `${maxGain}` },
          { key: 'total', value: `${base + maxGain}` },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Compute base satisfaction (when not grumpy): sum customers where grumpy[i]=0. Base=${base}.`,
      variables: { base, k },
      visualization: makeViz(
        -1,
        -1,
        Object.fromEntries(customers.map((_, i) => [i, grumpy[i] === 0 ? 'found' : 'default'])),
        Object.fromEntries(customers.map((_, i) => [i, grumpy[i] === 1 ? 'G' : 'H'])),
        0,
        0
      ),
    });

    let gain = 0;
    for (let i = 0; i < k; i++) if (grumpy[i] === 1) gain += customers[i];
    let maxGain = gain;
    let bestWindowStart = 0;

    const initH: Record<number, string> = {};
    const initL: Record<number, string> = {};
    for (let i = 0; i < k; i++) {
      initH[i] = grumpy[i] === 1 ? 'active' : 'sorted';
      initL[i] = grumpy[i] === 1 ? 'G' : 'H';
    }
    initL[0] = 'L';
    initL[k - 1] = 'R';

    steps.push({
      line: 2,
      explanation: `Initialize window [0..${k - 1}]. Gain from suppressing grumpy minutes in this window: ${gain}.`,
      variables: { gain, maxGain, k, windowStart: 0 },
      visualization: makeViz(0, k - 1, initH, initL, gain, maxGain),
    });

    for (let right = k; right < n; right++) {
      const left = right - k;
      if (grumpy[right] === 1) gain += customers[right];
      if (grumpy[left] === 1) gain -= customers[left];
      if (gain > maxGain) {
        maxGain = gain;
        bestWindowStart = left + 1;
      }

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let i = 0; i < left + 1; i++) h[i] = 'visited';
      for (let i = left + 1; i <= right; i++) h[i] = grumpy[i] === 1 ? 'active' : 'sorted';
      for (let i = right + 1; i < n; i++) h[i] = 'default';
      l[left + 1] = 'L';
      l[right] = 'R';

      steps.push({
        line: 8,
        explanation: `Slide window to [${left + 1}..${right}]. Add minute ${right} (grumpy=${grumpy[right]}, gain${grumpy[right] ? '+' : ''}${grumpy[right] ? customers[right] : 0}), remove minute ${left} (grumpy=${grumpy[left]}). Current gain=${gain}, maxGain=${maxGain}.`,
        variables: { windowStart: left + 1, right, gain, maxGain, total: base + maxGain },
        visualization: makeViz(left + 1, right, h, l, gain, maxGain),
      });
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (i >= bestWindowStart && i < bestWindowStart + k) {
        finalH[i] = 'found';
      } else {
        finalH[i] = grumpy[i] === 0 ? 'sorted' : 'default';
      }
    }
    finalL[bestWindowStart] = 'start';
    finalL[bestWindowStart + k - 1] = 'end';

    steps.push({
      line: 9,
      explanation: `Done! Best suppression window starts at minute ${bestWindowStart}. Total satisfied = base(${base}) + maxGain(${maxGain}) = ${base + maxGain}.`,
      variables: { base, maxGain, result: base + maxGain, bestWindowStart },
      visualization: makeViz(bestWindowStart, bestWindowStart + k - 1, finalH, finalL, maxGain, maxGain),
    });

    return steps;
  },
};

export default grumpyBookstoreOwner;
