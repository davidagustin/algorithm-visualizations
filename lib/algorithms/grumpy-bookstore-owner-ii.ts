import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const grumpyBookstoreOwnerIi: AlgorithmDefinition = {
  id: 'grumpy-bookstore-owner-ii',
  title: 'Grumpy Bookstore Owner (Sliding Window Variant)',
  leetcodeNumber: 1052,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A bookstore owner has customers[i] customers on day i. The owner is grumpy[i] on some days. The owner can use a secret technique for minutes consecutive minutes to suppress grumpiness. Find the maximum customers who can be satisfied. Base satisfied + sliding window to find best extra gain window.',
  tags: ['sliding window', 'array', 'greedy'],

  code: {
    pseudocode: `function maxSatisfied(customers, grumpy, minutes):
  base = sum(customers[i] for i where grumpy[i]==0)
  extra = sum(customers[i] for i in 0..minutes-1 where grumpy[i]==1)
  maxExtra = extra
  for i in range(minutes, len(customers)):
    if grumpy[i] == 1: extra += customers[i]
    if grumpy[i-minutes] == 1: extra -= customers[i-minutes]
    maxExtra = max(maxExtra, extra)
  return base + maxExtra`,

    python: `def maxSatisfied(customers, grumpy, minutes):
    base = sum(c for c, g in zip(customers, grumpy) if g == 0)
    extra = sum(c for c, g in zip(customers[:minutes], grumpy[:minutes]) if g == 1)
    best = extra
    for i in range(minutes, len(customers)):
        if grumpy[i] == 1: extra += customers[i]
        if grumpy[i-minutes] == 1: extra -= customers[i-minutes]
        best = max(best, extra)
    return base + best`,

    javascript: `function maxSatisfied(customers, grumpy, minutes) {
  let base = 0, extra = 0;
  for (let i = 0; i < customers.length; i++) {
    if (grumpy[i] === 0) base += customers[i];
    if (i < minutes && grumpy[i] === 1) extra += customers[i];
  }
  let best = extra;
  for (let i = minutes; i < customers.length; i++) {
    if (grumpy[i] === 1) extra += customers[i];
    if (grumpy[i - minutes] === 1) extra -= customers[i - minutes];
    best = Math.max(best, extra);
  }
  return base + best;
}`,

    java: `public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
    int base = 0, extra = 0;
    for (int i = 0; i < customers.length; i++) {
        if (grumpy[i] == 0) base += customers[i];
        if (i < minutes && grumpy[i] == 1) extra += customers[i];
    }
    int best = extra;
    for (int i = minutes; i < customers.length; i++) {
        if (grumpy[i] == 1) extra += customers[i];
        if (grumpy[i - minutes] == 1) extra -= customers[i - minutes];
        best = Math.max(best, extra);
    }
    return base + best;
}`,
  },

  defaultInput: {
    customers: [1, 0, 1, 2, 1, 1, 7, 5],
    grumpy: [0, 1, 0, 1, 0, 1, 0, 1],
    minutes: 3,
  },

  inputFields: [
    {
      name: 'customers',
      label: 'Customers per Day',
      type: 'array',
      defaultValue: [1, 0, 1, 2, 1, 1, 7, 5],
      placeholder: '1,0,1,2,1,1,7,5',
      helperText: 'Number of customers each day',
    },
    {
      name: 'grumpy',
      label: 'Grumpy Days (0/1)',
      type: 'array',
      defaultValue: [0, 1, 0, 1, 0, 1, 0, 1],
      placeholder: '0,1,0,1,0,1,0,1',
      helperText: '1 = grumpy, 0 = not grumpy',
    },
    {
      name: 'minutes',
      label: 'Technique Duration',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Consecutive minutes of technique',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const customers = input.customers as number[];
    const grumpy = input.grumpy as number[];
    const minutes = input.minutes as number;
    const steps: AlgorithmStep[] = [];
    const n = customers.length;

    let base = 0;
    let extra = 0;
    for (let i = 0; i < n; i++) {
      if (grumpy[i] === 0) base += customers[i];
      if (i < minutes && grumpy[i] === 1) extra += customers[i];
    }

    steps.push({
      line: 1,
      explanation: `Base satisfied (non-grumpy days) = ${base}. First window [0..${minutes - 1}] extra gain = ${extra} (grumpy days with technique applied).`,
      variables: { base, extra, minutes, bestExtra: extra },
      visualization: {
        type: 'array',
        array: [...customers],
        highlights: Object.fromEntries(customers.map((_, i) => [i, grumpy[i] === 0 ? 'found' : i < minutes ? 'active' : 'default'])),
        labels: Object.fromEntries(grumpy.map((g, i) => [i, g === 1 ? 'G' : 'OK'])),
      } as ArrayVisualization,
    });

    let best = extra;

    for (let i = minutes; i < n; i++) {
      if (grumpy[i] === 1) extra += customers[i];
      if (grumpy[i - minutes] === 1) extra -= customers[i - minutes];
      if (extra > best) best = extra;
      const winStart = i - minutes + 1;

      steps.push({
        line: 6,
        explanation: `Slide technique window to [${winStart}..${i}]. Extra gain from suppressed grumpy days = ${extra}. Best extra = ${best}. Max total = ${base + best}.`,
        variables: { windowStart: winStart, windowEnd: i, extra, best, totalIfBest: base + best },
        visualization: {
          type: 'array',
          array: [...customers],
          highlights: {
            ...Object.fromEntries(Array.from({ length: minutes }, (_, idx) => [winStart + idx, grumpy[winStart + idx] === 1 ? 'active' : 'found'])),
            [i - minutes]: 'sorted',
          },
          labels: { [winStart]: 'L', [i]: 'R' },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 8,
      explanation: `Maximum satisfied = base ${base} + best extra ${best} = ${base + best}.`,
      variables: { base, bestExtra: best, result: base + best },
      visualization: {
        type: 'array',
        array: [...customers],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default grumpyBookstoreOwnerIi;
