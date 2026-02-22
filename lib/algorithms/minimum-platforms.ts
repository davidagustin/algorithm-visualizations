import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumPlatforms: AlgorithmDefinition = {
  id: 'minimum-platforms',
  title: 'Minimum Platforms',
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Find the minimum number of railway platforms needed so no train has to wait. Sort arrival and departure arrays. Use two pointers: if the next event is an arrival, increment platforms needed; if departure, decrement. Track the maximum simultaneously needed platforms.',
  tags: ['Greedy', 'Sorting', 'Interval'],
  code: {
    pseudocode: `function minPlatforms(arrival, departure):
  sort arrival, sort departure
  platforms = 0, maxPlatforms = 0
  i = 0, j = 0
  while i < n:
    if arrival[i] <= departure[j]:
      platforms++
      maxPlatforms = max(maxPlatforms, platforms)
      i++
    else:
      platforms--
      j++
  return maxPlatforms`,
    python: `def minPlatforms(arrival, departure):
    arrival.sort()
    departure.sort()
    platforms = max_platforms = 0
    i = j = 0
    while i < len(arrival):
        if arrival[i] <= departure[j]:
            platforms += 1
            max_platforms = max(max_platforms, platforms)
            i += 1
        else:
            platforms -= 1
            j += 1
    return max_platforms`,
    javascript: `function minPlatforms(arrival, departure) {
  arrival.sort((a, b) => a - b);
  departure.sort((a, b) => a - b);
  let platforms = 0, maxPlatforms = 0, i = 0, j = 0;
  while (i < arrival.length) {
    if (arrival[i] <= departure[j]) {
      platforms++;
      maxPlatforms = Math.max(maxPlatforms, platforms);
      i++;
    } else {
      platforms--;
      j++;
    }
  }
  return maxPlatforms;
}`,
    java: `public int minPlatforms(int[] arr, int[] dep) {
    Arrays.sort(arr); Arrays.sort(dep);
    int platforms = 0, max = 0, i = 0, j = 0;
    while (i < arr.length) {
        if (arr[i] <= dep[j]) {
            platforms++; max = Math.max(max, platforms); i++;
        } else { platforms--; j++; }
    }
    return max;
}`,
  },
  defaultInput: { arrival: [900, 940, 950, 1100, 1500, 1800], departure: [910, 1200, 1120, 1130, 1900, 2000] },
  inputFields: [
    {
      name: 'arrival',
      label: 'Arrival Times',
      type: 'array',
      defaultValue: [900, 940, 950, 1100, 1500, 1800],
      placeholder: 'e.g. 900,940,950,1100,1500,1800',
      helperText: 'Train arrival times (24-hour format as integers)',
    },
    {
      name: 'departure',
      label: 'Departure Times',
      type: 'array',
      defaultValue: [910, 1200, 1120, 1130, 1900, 2000],
      placeholder: 'e.g. 910,1200,1120,1130,1900,2000',
      helperText: 'Train departure times (same length as arrival)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arrival = (input.arrival as number[]).slice().sort((a, b) => a - b);
    const departure = (input.departure as number[]).slice().sort((a, b) => a - b);
    const n = arrival.length;
    const steps: AlgorithmStep[] = [];
    let platforms = 0, maxPlatforms = 0, i = 0, j = 0;

    function makeViz(arrPtr: number, depPtr: number, event: 'arrive' | 'depart' | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let k = 0; k < n; k++) {
        labels[k] = String(arrival[k]);
        if (k < arrPtr) highlights[k] = 'visited';
        else if (k === arrPtr) highlights[k] = event === 'arrive' ? 'active' : 'default';
        else highlights[k] = 'default';
      }
      return {
        type: 'array',
        array: arrival.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Platform Counter',
          entries: [
            { key: 'Sorted arrivals', value: arrival.join(', ') },
            { key: 'Sorted departures', value: departure.join(', ') },
            { key: 'Arrival ptr (i)', value: String(arrPtr) },
            { key: 'Departure ptr (j)', value: String(depPtr) },
            { key: 'Platforms in use', value: String(platforms) },
            { key: 'Max platforms', value: String(maxPlatforms) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort arrivals: [${arrival.join(', ')}]. Sort departures: [${departure.join(', ')}]. Use two-pointer sweep.`,
      variables: { arrival: arrival.slice(), departure: departure.slice() },
      visualization: makeViz(0, 0, null),
    });

    steps.push({
      line: 2,
      explanation: 'Initialize platforms=0, maxPlatforms=0, i=0 (arrival pointer), j=0 (departure pointer).',
      variables: { platforms, maxPlatforms, i, j },
      visualization: makeViz(0, 0, null),
    });

    while (i < n) {
      if (arrival[i] <= departure[j]) {
        platforms++;
        if (platforms > maxPlatforms) maxPlatforms = platforms;
        steps.push({
          line: 6,
          explanation: `arrival[${i}]=${arrival[i]} <= departure[${j}]=${departure[j]}. Train arrives. platforms=${platforms}, maxPlatforms=${maxPlatforms}.`,
          variables: { event: 'arrive', arrivalTime: arrival[i], platforms, maxPlatforms },
          visualization: makeViz(i, j, 'arrive'),
        });
        i++;
      } else {
        platforms--;
        steps.push({
          line: 10,
          explanation: `arrival[${i}]=${arrival[i]} > departure[${j}]=${departure[j]}. Train departs. platforms=${platforms}.`,
          variables: { event: 'depart', departureTime: departure[j], platforms },
          visualization: makeViz(i, j, 'depart'),
        });
        j++;
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Minimum platforms needed: ${maxPlatforms}.`,
      variables: { maxPlatforms },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let k = 0; k < n; k++) { l[k] = String(arrival[k]); h[k] = 'found'; }
        return {
          type: 'array' as const,
          array: arrival.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Min platforms', value: String(maxPlatforms) },
              { key: 'Trains', value: String(n) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default minimumPlatforms;
