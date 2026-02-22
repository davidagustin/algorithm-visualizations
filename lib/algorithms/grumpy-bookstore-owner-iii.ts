import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const grumpyBookstoreOwnerIii: AlgorithmDefinition = {
  id: 'grumpy-bookstore-owner-iii',
  title: 'Grumpy Bookstore Owner III',
  leetcodeNumber: 1052,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A bookstore owner can suppress grumpiness for minutes consecutive minutes. Given customers[] and grumpy[], find the max customers satisfied. Base = sum of customers where owner is not grumpy. Bonus = max extra customers gained by the sliding window of size minutes where grumpy=1. Answer = base + max bonus.',
  tags: ['Sliding Window', 'Array', 'Greedy'],
  code: {
    pseudocode: `function maxSatisfied(customers, grumpy, minutes):
  base = sum of customers[i] where grumpy[i] == 0
  bonus = extra customers[i] where grumpy[i] == 1 in window
  maxBonus = sliding window of size minutes over grumpy moments
  return base + maxBonus`,
    python: `def maxSatisfied(customers, grumpy, minutes):
    base = sum(c for c, g in zip(customers, grumpy) if g == 0)
    bonus = sum(c for c, g in zip(customers[:minutes], grumpy[:minutes]) if g == 1)
    max_bonus = bonus
    for i in range(minutes, len(customers)):
        if grumpy[i] == 1: bonus += customers[i]
        if grumpy[i-minutes] == 1: bonus -= customers[i-minutes]
        max_bonus = max(max_bonus, bonus)
    return base + max_bonus`,
    javascript: `function maxSatisfied(customers, grumpy, minutes) {
  let base=0, bonus=0;
  for(let i=0;i<customers.length;i++) if(!grumpy[i]) base+=customers[i];
  for(let i=0;i<minutes;i++) if(grumpy[i]) bonus+=customers[i];
  let maxBonus=bonus;
  for(let i=minutes;i<customers.length;i++){
    if(grumpy[i]) bonus+=customers[i];
    if(grumpy[i-minutes]) bonus-=customers[i-minutes];
    maxBonus=Math.max(maxBonus,bonus);
  }
  return base+maxBonus;
}`,
    java: `public int maxSatisfied(int[] customers, int[] grumpy, int minutes) {
    int base=0,bonus=0;
    for(int i=0;i<customers.length;i++) if(grumpy[i]==0) base+=customers[i];
    for(int i=0;i<minutes;i++) if(grumpy[i]==1) bonus+=customers[i];
    int maxBonus=bonus;
    for(int i=minutes;i<customers.length;i++){
        if(grumpy[i]==1)bonus+=customers[i];
        if(grumpy[i-minutes]==1)bonus-=customers[i-minutes];
        maxBonus=Math.max(maxBonus,bonus);
    }
    return base+maxBonus;
}`,
  },
  defaultInput: { customers: [1, 0, 1, 2, 1, 1, 7, 5], grumpy: [0, 1, 0, 1, 0, 1, 0, 1], minutes: 3 },
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
      label: 'Grumpy (0 or 1)',
      type: 'array',
      defaultValue: [0, 1, 0, 1, 0, 1, 0, 1],
      placeholder: '0,1,0,1,0,1,0,1',
      helperText: '1 if owner is grumpy that minute',
    },
    {
      name: 'minutes',
      label: 'Suppress Minutes',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Consecutive minutes owner can suppress grumpiness',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const customers = input.customers as number[];
    const grumpy = input.grumpy as number[];
    const minutes = input.minutes as number;
    const steps: AlgorithmStep[] = [];
    const n = customers.length;

    const base = customers.reduce((sum, c, i) => sum + (grumpy[i] === 0 ? c : 0), 0);
    let bonus = 0;
    for (let i = 0; i < minutes; i++) if (grumpy[i] === 1) bonus += customers[i];
    let maxBonus = bonus;
    let bestWindowStart = 0;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, curBonus: number, maxBon: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...customers],
        highlights,
        labels,
        auxData: {
          label: 'Grumpy Bookstore Owner',
          entries: [
            { key: 'Base Satisfied', value: String(base) },
            { key: 'Current Bonus', value: String(curBonus) },
            { key: 'Max Bonus', value: String(maxBon) },
            { key: 'Best Total', value: String(base + maxBon) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Base satisfied (non-grumpy minutes) = ${base}. Slide window of size ${minutes} to find max extra customers from grumpy minutes.`,
      variables: { base, minutes, n },
      visualization: makeViz({}, {}, 0, 0),
    });

    const h0: Record<number, string> = {};
    const l0: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      h0[i] = grumpy[i] === 0 ? 'found' : 'visited';
      l0[i] = grumpy[i] === 0 ? `+${customers[i]}` : `(${customers[i]})`;
    }
    steps.push({
      line: 2,
      explanation: `Mark non-grumpy minutes (base). Base = ${base}. Grumpy minutes shown in parens.`,
      variables: { base },
      visualization: makeViz(h0, l0, 0, 0),
    });

    // Initial window
    const h1: Record<number, string> = {};
    const l1: Record<number, string> = {};
    for (let i = 0; i < minutes; i++) { h1[i] = 'active'; l1[i] = grumpy[i] === 1 ? `+${customers[i]}` : ''; }
    steps.push({
      line: 4,
      explanation: `Initial window [0..${minutes - 1}] bonus = ${bonus} (extra from grumpy customers). maxBonus=${maxBonus}.`,
      variables: { windowBonus: bonus, maxBonus },
      visualization: makeViz(h1, l1, bonus, maxBonus),
    });

    for (let i = minutes; i < n; i++) {
      if (grumpy[i] === 1) bonus += customers[i];
      if (grumpy[i - minutes] === 1) bonus -= customers[i - minutes];
      if (bonus > maxBonus) { maxBonus = bonus; bestWindowStart = i - minutes + 1; }

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let j = i - minutes + 1; j <= i; j++) { h[j] = 'active'; l[j] = grumpy[j] === 1 ? `+${customers[j]}` : ''; }

      steps.push({
        line: 7,
        explanation: `Slide window to [${i - minutes + 1}..${i}]. Bonus=${bonus}. maxBonus=${maxBonus}. Best total=${base + maxBonus}.`,
        variables: { windowStart: i - minutes + 1, windowEnd: i, bonus, maxBonus, total: base + maxBonus },
        visualization: makeViz(h, l, bonus, maxBonus),
      });
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      if (i >= bestWindowStart && i < bestWindowStart + minutes) { finalH[i] = 'match'; finalL[i] = 'supp'; }
      else if (grumpy[i] === 0) { finalH[i] = 'found'; finalL[i] = String(customers[i]); }
      else { finalH[i] = 'visited'; finalL[i] = '0'; }
    }
    steps.push({
      line: 9,
      explanation: `Best suppress window: [${bestWindowStart}..${bestWindowStart + minutes - 1}]. Total satisfied = ${base} + ${maxBonus} = ${base + maxBonus}.`,
      variables: { result: base + maxBonus, base, maxBonus },
      visualization: makeViz(finalH, finalL, maxBonus, maxBonus),
    });

    return steps;
  },
};

export default grumpyBookstoreOwnerIii;
