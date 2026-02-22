import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumNumberOfRefuelingStopsHeap: AlgorithmDefinition = {
  id: 'minimum-number-of-refueling-stops-heap',
  title: 'Minimum Number of Refueling Stops (Heap)',
  leetcodeNumber: 871,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'A car starts at position 0 with startFuel. At each gas station you may refuel. Return the minimum number of refueling stops to reach target. Greedy: keep driving, accumulate stations passed, and when stuck use the largest available fuel from a max heap.',
  tags: ['heap', 'greedy', 'dynamic programming'],

  code: {
    pseudocode: `function minRefuelStops(target, startFuel, stations):
  maxHeap = max heap of fuel amounts
  fuel = startFuel
  stops = 0
  prev = 0  // previous position
  for pos, f in stations + [(target, 0)]:
    fuel -= (pos - prev)  // drive to pos
    prev = pos
    while fuel < 0 and maxHeap not empty:
      fuel += pop maxHeap
      stops++
    if fuel < 0: return -1
    push f to maxHeap
  return stops`,

    python: `import heapq

def minRefuelStops(target: int, startFuel: int, stations: list[list[int]]) -> int:
    heap = []
    fuel = startFuel
    stops = 0
    prev = 0
    for pos, f in stations + [[target, 0]]:
        fuel -= pos - prev
        prev = pos
        while fuel < 0 and heap:
            fuel -= heapq.heappop(heap)  # negated max heap
            stops += 1
        if fuel < 0:
            return -1
        heapq.heappush(heap, -f)
    return stops`,

    javascript: `function minRefuelStops(target, startFuel, stations) {
  let heap = [], fuel = startFuel, stops = 0, prev = 0;
  for (const [pos, f] of [...stations, [target, 0]]) {
    fuel -= pos - prev;
    prev = pos;
    while (fuel < 0 && heap.length) {
      heap.sort((a,b)=>b-a);
      fuel += heap.shift();
      stops++;
    }
    if (fuel < 0) return -1;
    heap.push(f);
  }
  return stops;
}`,

    java: `public int minRefuelStops(int target, int startFuel, int[][] stations) {
    PriorityQueue<Integer> heap = new PriorityQueue<>(Collections.reverseOrder());
    int fuel = startFuel, stops = 0, prev = 0;
    for (int[] s : stations) {
        fuel -= s[0] - prev; prev = s[0];
        while (fuel < 0 && !heap.isEmpty()) {
            fuel += heap.poll(); stops++;
        }
        if (fuel < 0) return -1;
        heap.offer(s[1]);
    }
    fuel -= target - prev;
    while (fuel < 0 && !heap.isEmpty()) {
        fuel += heap.poll(); stops++;
    }
    return fuel >= 0 ? stops : -1;
}`,
  },

  defaultInput: {
    target: 100,
    startFuel: 10,
    stations: [10, 60, 20, 30, 30, 30, 60, 40],
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 100,
      placeholder: '100',
      helperText: 'Distance to travel',
    },
    {
      name: 'startFuel',
      label: 'Starting Fuel',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Initial fuel',
    },
    {
      name: 'stations',
      label: 'Stations (position,fuel pairs)',
      type: 'array',
      defaultValue: [10, 60, 20, 30, 30, 30, 60, 40],
      placeholder: '10,60,20,30,30,30,60,40',
      helperText: 'Pairs of position,fuel for each station',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number;
    const startFuel = input.startFuel as number;
    const flatStations = input.stations as number[];
    const steps: AlgorithmStep[] = [];

    const stations: [number, number][] = [];
    for (let i = 0; i + 1 < flatStations.length; i += 2) {
      stations.push([flatStations[i], flatStations[i + 1]]);
    }

    let heap: number[] = [];
    let fuel = startFuel;
    let stops = 0;
    let prev = 0;
    const all: [number, number][] = [...stations, [target, 0]];

    steps.push({
      line: 1,
      explanation: `Start at position 0 with fuel=${startFuel}. Target=${target}. ${stations.length} stations. Greedy: use largest available fuel when stuck.`,
      variables: { target, startFuel, stations: stations.length },
      visualization: {
        type: 'array',
        array: stations.map(([pos]) => pos),
        highlights: {},
        labels: Object.fromEntries(stations.map(([pos, f], i) => [i, `p${pos}:f${f}`])),
      } as ArrayVisualization,
    });

    for (const [pos, f] of all) {
      const dist = pos - prev;
      fuel -= dist;
      const isTarget = pos === target;

      steps.push({
        line: 6,
        explanation: `Drive to ${isTarget ? 'TARGET' : `station`} at pos=${pos}. Used ${dist} fuel. Remaining fuel=${fuel}.`,
        variables: { pos, dist, fuel, stops, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: heap.length > 0 ? [...heap].sort((a, b) => b - a) : [0],
          highlights: heap.length > 0 ? { 0: 'active' } : {},
          labels: { 0: fuel >= 0 ? `fuel=${fuel}` : 'STUCK' },
        } as ArrayVisualization,
      });

      while (fuel < 0 && heap.length > 0) {
        heap.sort((a, b) => b - a);
        const best = heap.shift()!;
        fuel += best;
        stops++;

        steps.push({
          line: 9,
          explanation: `Fuel < 0! Use best available fuel=${best} from heap. Fuel now=${fuel}. Total stops=${stops}.`,
          variables: { usedFuel: best, fuel, stops, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: heap.length > 0 ? [...heap].sort((a, b) => b - a) : [0],
            highlights: { 0: fuel >= 0 ? 'found' : 'mismatch' },
            labels: { 0: `fuel=${fuel}` },
          } as ArrayVisualization,
        });
      }

      if (fuel < 0) {
        steps.push({
          line: 10,
          explanation: `Cannot reach target. Heap exhausted with fuel=${fuel}. Return -1.`,
          variables: { result: -1 },
          visualization: {
            type: 'array',
            array: [fuel],
            highlights: { 0: 'mismatch' },
            labels: { 0: 'IMPOSSIBLE' },
          } as ArrayVisualization,
        });
        return steps;
      }

      prev = pos;
      if (!isTarget) heap.push(f);
    }

    steps.push({
      line: 12,
      explanation: `Reached target=${target} with ${stops} refueling stop(s). Remaining fuel=${fuel}.`,
      variables: { result: stops, fuel },
      visualization: {
        type: 'array',
        array: [stops],
        highlights: { 0: 'found' },
        labels: { 0: `stops=${stops}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default minimumNumberOfRefuelingStopsHeap;
