import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const carPooling: AlgorithmDefinition = {
  id: 'car-pooling',
  title: 'Car Pooling',
  leetcodeNumber: 1094,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given trips [numPassengers, from, to] and car capacity, determine if all trips can be completed. Use a difference array (bucket sort by stop) to track net passenger changes at each location. At each point check if capacity is exceeded.',
  tags: ['greedy', 'array', 'sorting', 'prefix sum'],

  code: {
    pseudocode: `function carPooling(trips, capacity):
  stops = array of size 1001, all zeros
  for each trip [num, from, to]:
    stops[from] += num
    stops[to] -= num
  currentPassengers = 0
  for each delta in stops:
    currentPassengers += delta
    if currentPassengers > capacity:
      return false
  return true`,

    python: `def carPooling(trips: list[list[int]], capacity: int) -> bool:
    stops = [0] * 1001
    for num, frm, to in trips:
        stops[frm] += num
        stops[to] -= num
    current = 0
    for delta in stops:
        current += delta
        if current > capacity:
            return False
    return True`,

    javascript: `function carPooling(trips, capacity) {
  const stops = new Array(1001).fill(0);
  for (const [num, from, to] of trips) {
    stops[from] += num;
    stops[to] -= num;
  }
  let current = 0;
  for (const delta of stops) {
    current += delta;
    if (current > capacity) return false;
  }
  return true;
}`,

    java: `public boolean carPooling(int[][] trips, int capacity) {
    int[] stops = new int[1001];
    for (int[] trip : trips) {
        stops[trip[1]] += trip[0];
        stops[trip[2]] -= trip[0];
    }
    int current = 0;
    for (int delta : stops) {
        current += delta;
        if (current > capacity) return false;
    }
    return true;
}`,
  },

  defaultInput: {
    trips: [2, 1, 5, 3, 3, 7],
    capacity: 4,
  },

  inputFields: [
    {
      name: 'trips',
      label: 'Trips (interleaved num,from,to triples)',
      type: 'array',
      defaultValue: [2, 1, 5, 3, 3, 7],
      placeholder: '2,1,5,3,3,7',
      helperText: 'Triples: numPassengers,from,to for each trip',
    },
    {
      name: 'capacity',
      label: 'Car Capacity',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Maximum passengers the car can hold',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.trips as number[];
    const capacity = input.capacity as number;
    const steps: AlgorithmStep[] = [];

    const trips: [number, number, number][] = [];
    for (let i = 0; i + 2 < flat.length; i += 3) {
      trips.push([flat[i], flat[i + 1], flat[i + 2]]);
    }

    steps.push({
      line: 1,
      explanation: `${trips.length} trips, capacity=${capacity}. Build difference array: +passengers at start, -passengers at end.`,
      variables: { trips: trips.map(t => '[' + t.join(',') + ']').join(', '), capacity },
      visualization: {
        type: 'array',
        array: flat,
        highlights: Object.fromEntries(flat.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    const maxStop = Math.max(...trips.map(t => t[2])) + 1;
    const stops = new Array(maxStop).fill(0);

    for (const [num, from, to] of trips) {
      stops[from] += num;
      stops[to] -= num;

      steps.push({
        line: 3,
        explanation: `Trip [${num},${from},${to}]: stops[${from}] += ${num}, stops[${to}] -= ${num}. Stops: [${stops.slice(0, maxStop).join(', ')}]`,
        variables: { num, from, to, 'stops[from]': stops[from], 'stops[to]': stops[to] },
        visualization: {
          type: 'array',
          array: stops.slice(0, maxStop),
          highlights: { [from]: 'found', [to]: 'active' },
          labels: { [from]: '+' + num, [to]: '-' + num },
        },
      });
    }

    steps.push({
      line: 5,
      explanation: `Difference array complete: [${stops.slice(0, maxStop).join(', ')}]. Now scan to find peak occupancy.`,
      variables: { stops: stops.slice(0, maxStop).join(', ') },
      visualization: {
        type: 'array',
        array: stops.slice(0, maxStop),
        highlights: Object.fromEntries(stops.slice(0, maxStop).map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    let current = 0;
    for (let i = 0; i < maxStop; i++) {
      current += stops[i];

      steps.push({
        line: 7,
        explanation: `Stop ${i}: delta=${stops[i]}, currentPassengers=${current}, capacity=${capacity}. ${current > capacity ? 'OVERFLOW! Return false.' : 'OK.'}`,
        variables: { stop: i, delta: stops[i], currentPassengers: current, capacity },
        visualization: {
          type: 'array',
          array: stops.slice(0, maxStop),
          highlights: { [i]: current > capacity ? 'mismatch' : current === capacity ? 'found' : 'active' },
          labels: { [i]: current + '/' + capacity },
        },
      });

      if (current > capacity) {
        steps.push({
          line: 8,
          explanation: `Capacity exceeded at stop ${i} (${current} > ${capacity}). Return false.`,
          variables: { result: false, stop: i, current, capacity },
          visualization: {
            type: 'array',
            array: stops.slice(0, maxStop),
            highlights: { [i]: 'mismatch' },
            labels: { [i]: 'FAIL' },
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 9,
      explanation: `All stops checked. Capacity never exceeded. Return true.`,
      variables: { result: true, capacity },
      visualization: {
        type: 'array',
        array: stops.slice(0, maxStop),
        highlights: Object.fromEntries(stops.slice(0, maxStop).map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default carPooling;
