import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfPlatforms: AlgorithmDefinition = {
  id: 'minimum-number-of-platforms',
  title: 'Minimum Number of Platforms',
  leetcodeNumber: 0,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given arrival and departure times of trains, find the minimum number of platforms required so no train waits. Sort both arrays, then use a two-pointer greedy: when a train arrives before another departs, add a platform; when a train departs, free a platform.',
  tags: ['greedy', 'sorting', 'two pointers', 'array'],

  code: {
    pseudocode: `function minPlatforms(arrival, departure):
  sort arrival, sort departure
  platforms = 0, maxPlatforms = 0
  i = 0, j = 0
  while i < n:
    if arrival[i] <= departure[j]:
      platforms++, i++
    else:
      platforms--, j++
    maxPlatforms = max(maxPlatforms, platforms)
  return maxPlatforms`,

    python: `def minPlatforms(arr: list[int], dep: list[int]) -> int:
    arr.sort()
    dep.sort()
    platforms = 0
    max_platforms = 0
    i = j = 0
    n = len(arr)
    while i < n:
        if arr[i] <= dep[j]:
            platforms += 1
            i += 1
        else:
            platforms -= 1
            j += 1
        max_platforms = max(max_platforms, platforms)
    return max_platforms`,

    javascript: `function minPlatforms(arr, dep) {
  arr.sort((a, b) => a - b);
  dep.sort((a, b) => a - b);
  let platforms = 0, maxPlatforms = 0;
  let i = 0, j = 0;
  while (i < arr.length) {
    if (arr[i] <= dep[j]) { platforms++; i++; }
    else { platforms--; j++; }
    maxPlatforms = Math.max(maxPlatforms, platforms);
  }
  return maxPlatforms;
}`,

    java: `public int minPlatforms(int[] arr, int[] dep) {
    Arrays.sort(arr);
    Arrays.sort(dep);
    int platforms = 0, maxPlatforms = 0, i = 0, j = 0;
    while (i < arr.length) {
        if (arr[i] <= dep[j]) { platforms++; i++; }
        else { platforms--; j++; }
        maxPlatforms = Math.max(maxPlatforms, platforms);
    }
    return maxPlatforms;
}`,
  },

  defaultInput: {
    arrival: [900, 940, 950, 1100, 1500, 1800],
    departure: [910, 1200, 1120, 1130, 1900, 2000],
  },

  inputFields: [
    {
      name: 'arrival',
      label: 'Arrival Times',
      type: 'array',
      defaultValue: [900, 940, 950, 1100, 1500, 1800],
      placeholder: '900,940,950,1100,1500,1800',
      helperText: 'Train arrival times (HHMM format)',
    },
    {
      name: 'departure',
      label: 'Departure Times',
      type: 'array',
      defaultValue: [910, 1200, 1120, 1130, 1900, 2000],
      placeholder: '910,1200,1120,1130,1900,2000',
      helperText: 'Train departure times (HHMM format)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arrivalRaw = input.arrival as number[];
    const departureRaw = input.departure as number[];
    const steps: AlgorithmStep[] = [];

    const arr = [...arrivalRaw].sort((a, b) => a - b);
    const dep = [...departureRaw].sort((a, b) => a - b);
    const n = arr.length;

    const makeViz = (
      array: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort arrivals: [${arr.join(', ')}] and departures: [${dep.join(', ')}]`,
      variables: { arr: arr.join(','), dep: dep.join(',') },
      visualization: makeViz(arr, Object.fromEntries(arr.map((_, k) => [k, 'sorted'])), {}),
    });

    let platforms = 0;
    let maxPlatforms = 0;
    let i = 0;
    let j = 0;

    steps.push({
      line: 2,
      explanation: 'Initialize platforms=0, i=0 (arrival pointer), j=0 (departure pointer).',
      variables: { platforms, maxPlatforms, i, j },
      visualization: makeViz(arr, { [i]: 'active' }, { [i]: 'arr[i]' }),
    });

    while (i < n) {
      if (arr[i] <= dep[j]) {
        platforms++;
        steps.push({
          line: 5,
          explanation: `arr[${i}]=${arr[i]} <= dep[${j}]=${dep[j]}: a train arrives before next departure. Need one more platform. platforms=${platforms}.`,
          variables: { i, j, 'arr[i]': arr[i], 'dep[j]': dep[j], platforms, maxPlatforms },
          visualization: makeViz(arr, { [i]: 'active' }, { [i]: 'arrive' }),
        });
        i++;
      } else {
        platforms--;
        steps.push({
          line: 7,
          explanation: `arr[${i}]=${arr[i]} > dep[${j}]=${dep[j]}: a train departs, freeing a platform. platforms=${platforms}.`,
          variables: { i, j, 'arr[i]': arr[i], 'dep[j]': dep[j], platforms, maxPlatforms },
          visualization: makeViz(dep, { [j]: 'found' }, { [j]: 'depart' }),
        });
        j++;
      }
      maxPlatforms = Math.max(maxPlatforms, platforms);

      steps.push({
        line: 8,
        explanation: `Update maxPlatforms = max(${maxPlatforms}, ${platforms}) = ${maxPlatforms}.`,
        variables: { platforms, maxPlatforms, i, j },
        visualization: makeViz(arr, { [Math.min(i, n - 1)]: 'pointer' }, { [Math.min(i, n - 1)]: 'i' }),
      });
    }

    steps.push({
      line: 9,
      explanation: `All trains processed. Minimum platforms required = ${maxPlatforms}.`,
      variables: { result: maxPlatforms },
      visualization: makeViz(arr, Object.fromEntries(arr.map((_, k) => [k, 'found'])), {}),
    });

    return steps;
  },
};

export default minimumNumberOfPlatforms;
