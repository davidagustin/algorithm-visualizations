import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const earliestPossibleDayOfFullBloom: AlgorithmDefinition = {
  id: 'earliest-possible-day-of-full-bloom',
  title: 'Earliest Possible Day of Full Bloom',
  leetcodeNumber: 2136,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'You have n flower seeds. Each seed i takes plantTime[i] days to plant and growTime[i] days to grow after planting. You can plant only one seed per day. Find the earliest possible day when all flowers are in full bloom. The greedy key insight: sort seeds by growTime in descending order - seeds that take longer to grow should be planted first.',
  tags: ['greedy', 'sorting', 'scheduling'],

  code: {
    pseudocode: `function earliestFullBloom(plantTime, growTime):
  n = length(plantTime)
  order = indices sorted by growTime descending
  day = 0
  result = 0
  for i in order:
    day += plantTime[i]
    bloomDay = day + growTime[i]
    result = max(result, bloomDay)
  return result`,

    python: `def earliestFullBloom(plantTime: list[int], growTime: list[int]) -> int:
    n = len(plantTime)
    order = sorted(range(n), key=lambda i: -growTime[i])
    day = result = 0
    for i in order:
        day += plantTime[i]
        result = max(result, day + growTime[i])
    return result`,

    javascript: `function earliestFullBloom(plantTime, growTime) {
  const n = plantTime.length;
  const order = Array.from({length: n}, (_, i) => i)
    .sort((a, b) => growTime[b] - growTime[a]);
  let day = 0, result = 0;
  for (const i of order) {
    day += plantTime[i];
    result = Math.max(result, day + growTime[i]);
  }
  return result;
}`,

    java: `public int earliestFullBloom(int[] plantTime, int[] growTime) {
    int n = plantTime.length;
    Integer[] order = new Integer[n];
    for (int i = 0; i < n; i++) order[i] = i;
    Arrays.sort(order, (a, b) -> growTime[b] - growTime[a]);
    int day = 0, result = 0;
    for (int i : order) {
        day += plantTime[i];
        result = Math.max(result, day + growTime[i]);
    }
    return result;
}`,
  },

  defaultInput: {
    plantTime: [1, 4, 3],
    growTime: [2, 3, 1],
  },

  inputFields: [
    {
      name: 'plantTime',
      label: 'Plant Times',
      type: 'array',
      defaultValue: [1, 4, 3],
      placeholder: '1,4,3',
      helperText: 'Days needed to plant each seed',
    },
    {
      name: 'growTime',
      label: 'Grow Times',
      type: 'array',
      defaultValue: [2, 3, 1],
      placeholder: '2,3,1',
      helperText: 'Days needed to grow after planting',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const plantTime = input.plantTime as number[];
    const growTime = input.growTime as number[];
    const steps: AlgorithmStep[] = [];
    const n = plantTime.length;

    steps.push({
      line: 1,
      explanation: `We have ${n} seeds. Sort them by growTime descending so seeds needing longest growth are planted first.`,
      variables: { plantTime: [...plantTime], growTime: [...growTime] },
      visualization: {
        type: 'array',
        array: [...growTime],
        highlights: {},
        labels: Object.fromEntries(growTime.map((_, i) => [i, `g${i}`])) as Record<number, string>,
      },
    });

    const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => growTime[b] - growTime[a]);

    steps.push({
      line: 2,
      explanation: `Sorted planting order by growTime descending: [${order.join(', ')}]. Seed ${order[0]} has longest grow time (${growTime[order[0]]}).`,
      variables: { order: [...order] },
      visualization: {
        type: 'array',
        array: order.map(i => growTime[i]),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(order.map((seed, pos) => [pos, `s${seed}`])) as Record<number, string>,
      },
    });

    let day = 0;
    let result = 0;

    for (let pos = 0; pos < order.length; pos++) {
      const i = order[pos];
      day += plantTime[i];
      const bloomDay = day + growTime[i];
      const prevResult = result;
      result = Math.max(result, bloomDay);

      steps.push({
        line: 6,
        explanation: `Plant seed ${i} (plantTime=${plantTime[i]}, growTime=${growTime[i]}). Finish planting on day ${day}. Blooms on day ${bloomDay}. Result = max(${prevResult}, ${bloomDay}) = ${result}.`,
        variables: { seed: i, day, bloomDay, result },
        visualization: {
          type: 'array',
          array: order.map(idx => growTime[idx]),
          highlights: { [pos]: bloomDay === result ? 'found' : 'active' } as Record<number, string>,
          labels: { [pos]: `day${bloomDay}` } as Record<number, string>,
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Earliest possible day all flowers fully bloom: day ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: order.map(i => growTime[i]),
        highlights: Object.fromEntries(order.map((_, pos) => [pos, 'sorted'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default earliestPossibleDayOfFullBloom;
