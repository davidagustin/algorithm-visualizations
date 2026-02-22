import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumBagsWithFullCapacity: AlgorithmDefinition = {
  id: 'maximum-bags-with-full-capacity',
  title: 'Maximum Bags With Full Capacity of Rocks',
  leetcodeNumber: 2279,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'There are n bags where the i-th bag has a capacity and currently holds some rocks. You have additionalRocks to distribute. Maximize the number of bags that are completely full. Greedy approach: sort bags by remaining capacity (capacity - rocks) ascending and greedily fill the easiest bags first.',
  tags: ['greedy', 'sorting', 'array'],

  code: {
    pseudocode: `function maximumBags(capacity, rocks, additionalRocks):
  remaining = [capacity[i] - rocks[i] for each i]
  sort remaining ascending
  count = 0
  for space in remaining:
    if additionalRocks >= space:
      additionalRocks -= space
      count++
    else:
      break
  return count`,

    python: `def maximumBags(capacity: list[int], rocks: list[int], additionalRocks: int) -> int:
    remaining = sorted(c - r for c, r in zip(capacity, rocks))
    count = 0
    for space in remaining:
        if additionalRocks >= space:
            additionalRocks -= space
            count += 1
        else:
            break
    return count`,

    javascript: `function maximumBags(capacity, rocks, additionalRocks) {
  const remaining = capacity.map((c, i) => c - rocks[i]).sort((a, b) => a - b);
  let count = 0;
  for (const space of remaining) {
    if (additionalRocks >= space) {
      additionalRocks -= space;
      count++;
    } else {
      break;
    }
  }
  return count;
}`,

    java: `public int maximumBags(int[] capacity, int[] rocks, int additionalRocks) {
    int n = capacity.length;
    int[] remaining = new int[n];
    for (int i = 0; i < n; i++) remaining[i] = capacity[i] - rocks[i];
    Arrays.sort(remaining);
    int count = 0;
    for (int space : remaining) {
        if (additionalRocks >= space) {
            additionalRocks -= space;
            count++;
        } else break;
    }
    return count;
}`,
  },

  defaultInput: {
    capacity: [2, 3, 4, 5],
    rocks: [1, 2, 4, 4],
    additionalRocks: 2,
  },

  inputFields: [
    {
      name: 'capacity',
      label: 'Bag Capacities',
      type: 'array',
      defaultValue: [2, 3, 4, 5],
      placeholder: '2,3,4,5',
      helperText: 'Max capacity of each bag',
    },
    {
      name: 'rocks',
      label: 'Current Rocks',
      type: 'array',
      defaultValue: [1, 2, 4, 4],
      placeholder: '1,2,4,4',
      helperText: 'Current rocks in each bag',
    },
    {
      name: 'additionalRocks',
      label: 'Additional Rocks',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Extra rocks to distribute',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const capacity = input.capacity as number[];
    const rocks = input.rocks as number[];
    let additionalRocks = input.additionalRocks as number;
    const steps: AlgorithmStep[] = [];
    const n = capacity.length;

    const remaining = capacity.map((c, i) => c - rocks[i]);

    steps.push({
      line: 1,
      explanation: `Compute remaining space for each bag: [${remaining.join(', ')}]. We have ${additionalRocks} additional rocks.`,
      variables: { remaining: [...remaining], additionalRocks },
      visualization: {
        type: 'array',
        array: [...remaining],
        highlights: {},
        labels: Object.fromEntries(remaining.map((r, i) => [i, `need ${r}`])) as Record<number, string>,
      },
    });

    const sorted = [...remaining].sort((a, b) => a - b);

    steps.push({
      line: 2,
      explanation: `Sort remaining spaces ascending: [${sorted.join(', ')}]. Fill bags with smallest remaining space first.`,
      variables: { sorted: [...sorted] },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: {},
        labels: Object.fromEntries(sorted.map((_, i) => [i, `bag${i}`])) as Record<number, string>,
      },
    });

    let count = 0;
    for (let idx = 0; idx < sorted.length; idx++) {
      const space = sorted[idx];
      if (additionalRocks >= space) {
        additionalRocks -= space;
        count++;
        steps.push({
          line: 6,
          explanation: `Bag ${idx} needs ${space} more rocks. Use ${space} of remaining ${additionalRocks + space} rocks to fill it. Bags full: ${count}. Rocks left: ${additionalRocks}.`,
          variables: { idx, space, additionalRocks, count },
          visualization: {
            type: 'array',
            array: [...sorted],
            highlights: {
              ...Object.fromEntries(Array.from({ length: count }, (_, j) => [j, 'found'])),
              [idx]: 'active',
            } as Record<number, string>,
            labels: { [idx]: 'filled' } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 8,
          explanation: `Bag ${idx} needs ${space} rocks but only ${additionalRocks} remain. Stop here.`,
          variables: { idx, space, additionalRocks, count },
          visualization: {
            type: 'array',
            array: [...sorted],
            highlights: {
              ...Object.fromEntries(Array.from({ length: count }, (_, j) => [j, 'found'])),
              [idx]: 'mismatch',
            } as Record<number, string>,
            labels: { [idx]: 'skip' } as Record<number, string>,
          },
        });
        break;
      }
    }

    steps.push({
      line: 9,
      explanation: `Maximum bags that can be completely filled: ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...sorted],
        highlights: Object.fromEntries(sorted.map((_, i) => [i, i < count ? 'found' : 'visited'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default maximumBagsWithFullCapacity;
