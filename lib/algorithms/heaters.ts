import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const heaters: AlgorithmDefinition = {
  id: 'heaters',
  title: 'Heaters',
  leetcodeNumber: 475,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given positions of houses and heaters, find the minimum radius so every house is covered by at least one heater. Sort heaters, then binary search to find the closest heater for each house; the answer is the maximum of all minimum distances.',
  tags: ['binary search', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function findRadius(houses, heaters):
  sort heaters
  radius = 0
  for each house in houses:
    lo = 0, hi = len(heaters) - 1
    dist = infinity
    while lo <= hi:
      mid = (lo + hi) / 2
      dist = min(dist, abs(heaters[mid] - house))
      if heaters[mid] < house: lo = mid + 1
      else: hi = mid - 1
    radius = max(radius, dist)
  return radius`,
    python: `import bisect
def findRadius(houses: list[int], heaters: list[int]) -> int:
    heaters.sort()
    radius = 0
    for house in houses:
        pos = bisect.bisect_left(heaters, house)
        dist = float('inf')
        if pos < len(heaters):
            dist = min(dist, heaters[pos] - house)
        if pos > 0:
            dist = min(dist, house - heaters[pos - 1])
        radius = max(radius, dist)
    return radius`,
    javascript: `function findRadius(houses, heaters) {
  heaters.sort((a, b) => a - b);
  let radius = 0;
  for (const house of houses) {
    let lo = 0, hi = heaters.length - 1, dist = Infinity;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      dist = Math.min(dist, Math.abs(heaters[mid] - house));
      if (heaters[mid] < house) lo = mid + 1;
      else hi = mid - 1;
    }
    radius = Math.max(radius, dist);
  }
  return radius;
}`,
    java: `public int findRadius(int[] houses, int[] heaters) {
    Arrays.sort(heaters);
    int radius = 0;
    for (int house : houses) {
        int lo = 0, hi = heaters.length - 1;
        int dist = Integer.MAX_VALUE;
        while (lo <= hi) {
            int mid = (lo + hi) / 2;
            dist = Math.min(dist, Math.abs(heaters[mid] - house));
            if (heaters[mid] < house) lo = mid + 1;
            else hi = mid - 1;
        }
        radius = Math.max(radius, dist);
    }
    return radius;
}`,
  },

  defaultInput: {
    houses: [1, 2, 3, 4],
    heaters: [1, 4],
  },

  inputFields: [
    {
      name: 'houses',
      label: 'House Positions',
      type: 'array',
      defaultValue: [1, 2, 3, 4],
      placeholder: '1,2,3,4',
      helperText: 'Positions of houses on a number line',
    },
    {
      name: 'heaters',
      label: 'Heater Positions',
      type: 'array',
      defaultValue: [1, 4],
      placeholder: '1,4',
      helperText: 'Positions of heaters on a number line',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const houses = input.houses as number[];
    const heaters = [...(input.heaters as number[])].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...heaters],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort heaters: [${heaters.join(', ')}]. Process each house to find closest heater.`,
      variables: { heaters: heaters.join(','), houses: houses.join(',') },
      visualization: makeViz({}, {}),
    });

    let radius = 0;

    for (const house of houses) {
      let lo = 0;
      let hi = heaters.length - 1;
      let dist = Infinity;

      steps.push({
        line: 3,
        explanation: `Processing house at position ${house}. Binary search for closest heater.`,
        variables: { house, radius },
        visualization: makeViz({}, {}),
      });

      while (lo <= hi) {
        const mid = (lo + hi) >> 1;
        const d = Math.abs(heaters[mid] - house);
        dist = Math.min(dist, d);

        steps.push({
          line: 8,
          explanation: `mid=${mid}, heaters[mid]=${heaters[mid]}, dist to house ${house} = ${d}. Current min dist=${dist}.`,
          variables: { lo, mid, hi, 'heaters[mid]': heaters[mid], d, dist },
          visualization: makeViz(
            { [mid]: 'comparing' },
            { [mid]: `d=${d}` }
          ),
        });

        if (heaters[mid] < house) {
          lo = mid + 1;
        } else {
          hi = mid - 1;
        }
      }

      const prevRadius = radius;
      radius = Math.max(radius, dist);

      steps.push({
        line: 12,
        explanation: `Closest heater for house ${house} is distance ${dist}. Radius updated: max(${prevRadius}, ${dist}) = ${radius}.`,
        variables: { house, dist, radius },
        visualization: makeViz(
          dist < Infinity ? { [heaters.findIndex(h => Math.abs(h - house) === dist)]: 'found' } : {},
          {}
        ),
      });
    }

    steps.push({
      line: 13,
      explanation: `All houses processed. Minimum radius to cover all houses = ${radius}.`,
      variables: { result: radius },
      visualization: makeViz(
        heaters.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        {}
      ),
    });

    return steps;
  },
};

export default heaters;
