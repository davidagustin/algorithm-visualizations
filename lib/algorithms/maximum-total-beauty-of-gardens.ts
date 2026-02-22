import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumTotalBeautyOfGardens: AlgorithmDefinition = {
  id: 'maximum-total-beauty-of-gardens',
  title: 'Maximum Total Beauty of the Gardens',
  leetcodeNumber: 2234,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'Given flower gardens with current counts, a target, full points, partial points, and newFlowers budget, maximize total beauty. Full gardens give full points, incomplete gardens give partial * min flower count among incomplete. Greedy: sort, use prefix sums to efficiently compute optimal split between how many gardens to complete vs maximize the minimum of the rest.',
  tags: ['greedy', 'sorting', 'binary search', 'prefix sum'],

  code: {
    pseudocode: `function maximumBeauty(flowers, newFlowers, target, full, partial):
  sort flowers
  n = length(flowers)
  // Cap values at target
  for i from 0 to n-1:
    flowers[i] = min(flowers[i], target)
  prefix = prefix sums of flowers
  result = 0
  j = n  // number of full gardens from the right
  for i from 0 to n: // i = number of non-full gardens
    // Greedily compute max min among first i gardens
    ...
    result = max(result, score)
  return result`,

    python: `def maximumBeauty(flowers, newFlowers, target, full, partial):
    flowers = sorted(min(f, target) for f in flowers)
    n = len(flowers)
    if flowers[0] == target:
        return n * full
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + flowers[i]
    result = 0
    j = n - 1
    while j >= 0 and flowers[j] == target:
        j -= 1
    budget = newFlowers
    for i in range(j + 1, -1, -1):
        completeFull = n - 1 - j + (j + 1 - i)
        if i > 0:
            lo, hi = flowers[0], target - 1
            while lo < hi:
                mid = (lo + hi + 1) // 2
                cost = mid * i - prefix[i]
                if cost <= budget:
                    lo = mid
                else:
                    hi = mid - 1
            minVal = lo
            result = max(result, completeFull * full + minVal * partial)
        else:
            result = max(result, completeFull * full)
        if i > 0:
            budget -= target - flowers[i - 1]
            if budget < 0:
                break
    return result`,

    javascript: `function maximumBeauty(flowers, newFlowers, target, full, partial) {
  flowers = flowers.map(f => Math.min(f, target)).sort((a, b) => a - b);
  const n = flowers.length;
  const prefix = [0];
  for (const f of flowers) prefix.push(prefix[prefix.length - 1] + f);
  let j = n - 1;
  while (j >= 0 && flowers[j] === target) j--;
  let budget = newFlowers, result = 0;
  for (let i = j + 1; i >= 0; i--) {
    const fullCount = (n - 1 - j) + (j + 1 - i);
    if (i > 0) {
      let lo = flowers[0], hi = target - 1;
      while (lo < hi) {
        const mid = (lo + hi + 1) >> 1;
        const cost = mid * i - prefix[i];
        if (cost <= budget) lo = mid; else hi = mid - 1;
      }
      result = Math.max(result, fullCount * full + lo * partial);
    } else {
      result = Math.max(result, fullCount * full);
    }
    if (i > 0) { budget -= target - flowers[i - 1]; if (budget < 0) break; }
  }
  return result;
}`,

    java: `public long maximumBeauty(int[] flowers, long newFlowers, int target, int full, int partial) {
    int n = flowers.length;
    int[] f = Arrays.stream(flowers).map(x -> Math.min(x, target)).sorted().toArray();
    long[] prefix = new long[n + 1];
    for (int i = 0; i < n; i++) prefix[i + 1] = prefix[i] + f[i];
    int j = n - 1;
    while (j >= 0 && f[j] == target) j--;
    long budget = newFlowers, result = 0;
    for (int i = j + 1; i >= 0; i--) {
        long fullCount = (n - 1 - j) + (j + 1 - i);
        if (i > 0) {
            long lo = f[0], hi = target - 1;
            while (lo < hi) {
                long mid = (lo + hi + 1) / 2;
                if (mid * i - prefix[i] <= budget) lo = mid; else hi = mid - 1;
            }
            result = Math.max(result, fullCount * full + lo * partial);
        } else result = Math.max(result, fullCount * full);
        if (i > 0) { budget -= target - f[i - 1]; if (budget < 0) break; }
    }
    return result;
}`,
  },

  defaultInput: {
    flowers: [1, 3, 1, 1],
    newFlowers: 7,
    target: 6,
    full: 12,
    partial: 1,
  },

  inputFields: [
    {
      name: 'flowers',
      label: 'Flower Counts',
      type: 'array',
      defaultValue: [1, 3, 1, 1],
      placeholder: '1,3,1,1',
      helperText: 'Current flowers in each garden',
    },
    {
      name: 'newFlowers',
      label: 'New Flowers Budget',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total flowers you can add',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Flowers needed for a full garden',
    },
    {
      name: 'full',
      label: 'Full Garden Points',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Points for a full garden',
    },
    {
      name: 'partial',
      label: 'Partial Garden Points (per flower)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Points per minimum flower in incomplete gardens',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flowersRaw = input.flowers as number[];
    let newFlowers = input.newFlowers as number;
    const target = input.target as number;
    const full = input.full as number;
    const partial = input.partial as number;
    const steps: AlgorithmStep[] = [];

    const flowers = flowersRaw.map(f => Math.min(f, target)).sort((a, b) => a - b);
    const n = flowers.length;
    const prefix = [0];
    for (const f of flowers) prefix.push(prefix[prefix.length - 1] + f);

    steps.push({
      line: 1,
      explanation: `Sort flowers (capped at target): [${flowers.join(', ')}]. Target=${target}, full points=${full}, partial points=${partial}, budget=${newFlowers}.`,
      variables: { flowers: [...flowers], target, full, partial, newFlowers },
      visualization: {
        type: 'array',
        array: [...flowers],
        highlights: {},
        labels: Object.fromEntries(flowers.map((f, i) => [i, f === target ? 'full' : `${target - f} needed`])) as Record<number, string>,
      },
    });

    let j = n - 1;
    while (j >= 0 && flowers[j] === target) j--;

    steps.push({
      line: 6,
      explanation: `Gardens ${j + 1} to ${n - 1} are already full. j=${j} is the rightmost non-full garden index.`,
      variables: { j, alreadyFull: n - 1 - j },
      visualization: {
        type: 'array',
        array: [...flowers],
        highlights: Object.fromEntries(flowers.map((_, i) => [i, i > j ? 'found' : 'active'])) as Record<number, string>,
        labels: { [j]: 'j' } as Record<number, string>,
      },
    });

    let result = 0;
    let budget = newFlowers;

    for (let i = j + 1; i >= 0; i--) {
      const fullCount = (n - 1 - j) + (j + 1 - i);

      let score = 0;
      if (i > 0) {
        let lo = flowers[0];
        let hi = target - 1;
        while (lo < hi) {
          const mid = Math.ceil((lo + hi) / 2);
          const cost = mid * i - prefix[i];
          if (cost <= budget) lo = mid;
          else hi = mid - 1;
        }
        const minVal = lo;
        score = fullCount * full + minVal * partial;
        steps.push({
          line: 10,
          explanation: `With ${i} incomplete gardens: complete ${fullCount} gardens. Best min flower count for incomplete: ${minVal}. Score = ${fullCount}*${full} + ${minVal}*${partial} = ${score}.`,
          variables: { i, fullCount, minVal, score, budget, result },
          visualization: {
            type: 'array',
            array: [...flowers],
            highlights: {
              ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'comparing'])),
              ...Object.fromEntries(Array.from({ length: n - i }, (_, k) => [i + k, 'found'])),
            } as Record<number, string>,
            labels: { 0: `min=${minVal}` } as Record<number, string>,
          },
        });
      } else {
        score = fullCount * full;
        steps.push({
          line: 12,
          explanation: `All gardens complete (i=0). Score = ${fullCount}*${full} = ${score}.`,
          variables: { fullCount, score, budget },
          visualization: {
            type: 'array',
            array: [...flowers],
            highlights: Object.fromEntries(flowers.map((_, idx) => [idx, 'found'])) as Record<number, string>,
            labels: {},
          },
        });
      }

      result = Math.max(result, score);

      if (i > 0) {
        budget -= target - flowers[i - 1];
        if (budget < 0) break;
      }
    }

    steps.push({
      line: 13,
      explanation: `Maximum total beauty of gardens: ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [...flowers],
        highlights: Object.fromEntries(flowers.map((_, i) => [i, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumTotalBeautyOfGardens;
