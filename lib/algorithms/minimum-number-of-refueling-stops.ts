import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumNumberOfRefuelingStops: AlgorithmDefinition = {
  id: 'minimum-number-of-refueling-stops',
  title: 'Minimum Number of Refueling Stops',
  leetcodeNumber: 871,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A car starts at position 0 with startFuel and must reach target. Gas stations are along the road with fuel amounts. Find the minimum number of stops to reach target. Greedy approach: always refuel at the highest-fuel station seen so far when you run out. Uses a max-heap of past stations.',
  tags: ['dynamic programming', 'greedy', 'heap', 'priority queue'],

  code: {
    pseudocode: `function minRefuelStops(target, startFuel, stations):
  maxHeap = empty max-heap
  fuel = startFuel
  stops = 0
  prev = 0
  for each station (pos, cap):
    fuel -= (pos - prev)
    prev = pos
    heappush(maxHeap, cap)
    while fuel < 0 and maxHeap not empty:
      fuel += heappop(maxHeap)
      stops++
  fuel -= (target - prev)
  while fuel < 0 and maxHeap not empty:
    fuel += heappop(maxHeap); stops++
  return stops if fuel >= 0 else -1`,

    python: `def minRefuelStops(target, startFuel, stations):
    import heapq
    heap = []
    fuel = startFuel
    stops = 0
    prev = 0
    for pos, cap in stations + [(target, 0)]:
        fuel -= pos - prev
        prev = pos
        while fuel < 0 and heap:
            fuel += -heapq.heappop(heap)
            stops += 1
        if fuel < 0:
            return -1
        heapq.heappush(heap, -cap)
    return stops`,

    javascript: `function minRefuelStops(target, startFuel, stations) {
  // Use sorted array as max-heap simulation
  const all = [...stations, [target, 0]];
  let fuel = startFuel, stops = 0, prev = 0;
  const available = [];
  for (const [pos, cap] of all) {
    fuel -= pos - prev; prev = pos;
    available.push(cap); available.sort((a,b)=>b-a);
    while (fuel < 0 && available.length > 0) {
      fuel += available.shift(); stops++;
    }
    if (fuel < 0) return -1;
  }
  return stops;
}`,

    java: `public int minRefuelStops(int target, int startFuel, int[][] stations) {
    PriorityQueue<Integer> pq = new PriorityQueue<>(Collections.reverseOrder());
    int fuel=startFuel, stops=0, prev=0;
    for (int[] s : stations) {
        fuel -= s[0]-prev; prev=s[0]; pq.offer(s[1]);
        while (fuel<0 && !pq.isEmpty()){fuel+=pq.poll();stops++;}
        if (fuel<0) return -1;
    }
    fuel -= target-prev;
    while (fuel<0 && !pq.isEmpty()){fuel+=pq.poll();stops++;}
    return fuel<0?-1:stops;
}`,
  },

  defaultInput: {
    target: 100,
    startFuel: 10,
    stations: [[10, 60], [20, 30], [30, 30], [60, 40]],
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target Distance',
      type: 'number',
      defaultValue: 100,
      placeholder: '100',
      helperText: 'Distance to the destination',
    },
    {
      name: 'startFuel',
      label: 'Starting Fuel',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Initial fuel in the tank',
    },
    {
      name: 'stations',
      label: 'Stations [position, fuel]',
      type: 'array',
      defaultValue: [[10, 60], [20, 30], [30, 30], [60, 40]],
      placeholder: '[[10,60],[20,30]]',
      helperText: 'Gas stations as [position, fuel_available]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const target = input.target as number;
    const startFuel = input.startFuel as number;
    const stations = input.stations as number[][];
    const steps: AlgorithmStep[] = [];

    let fuel = startFuel;
    let stops = 0;
    let prev = 0;
    const available: number[] = [];

    steps.push({
      line: 1,
      explanation: `Start at 0 with fuel=${startFuel}. Target=${target}. Stations: ${stations.map(s => `(pos=${s[0]},fuel=${s[1]})`).join(', ')}. Greedy: refuel at best past station when stuck.`,
      variables: { target, startFuel, stationCount: stations.length },
      visualization: {
        type: 'array',
        array: stations.map(s => s[1]),
        highlights: {},
        labels: Object.fromEntries(stations.map((s, i) => [i, `pos${s[0]}`])),
      },
    });

    const allStops = [...stations, [target, 0]];
    for (let si = 0; si < allStops.length; si++) {
      const [pos, cap] = allStops[si];
      const consumed = pos - prev;
      fuel -= consumed;
      prev = pos;
      if (cap > 0) available.push(cap);
      available.sort((a, b) => b - a);

      steps.push({
        line: 5,
        explanation: `Drove ${consumed} units to ${pos === target ? 'target' : `station at ${pos}`}. Fuel left: ${fuel}. Available past stations: [${available.join(', ')}].`,
        variables: { position: pos, fuelAfterDriving: fuel, availableRefuels: [...available] },
        visualization: {
          type: 'array',
          array: stations.map(s => s[1]),
          highlights: { [si]: 'active' },
          labels: Object.fromEntries(stations.map((s, i) => [i, `p${s[0]}`])),
        },
      });

      let refueled = false;
      while (fuel < 0 && available.length > 0) {
        const best = available.shift()!;
        fuel += best;
        stops++;
        refueled = true;
        steps.push({
          line: 9,
          explanation: `Out of fuel! Retroactively stop at best past station (+${best} fuel). Total stops: ${stops}. Fuel now: ${fuel}.`,
          variables: { fuelAdded: best, totalStops: stops, fuelNow: fuel },
          visualization: {
            type: 'array',
            array: stations.map(s => s[1]),
            highlights: { [si]: 'found' },
            labels: Object.fromEntries(stations.map((s, i) => [i, `p${s[0]}`])),
          },
        });
      }

      if (fuel < 0) {
        steps.push({
          line: 11,
          explanation: `Cannot reach target! No more stations to refuel. Return -1.`,
          variables: { answer: -1 },
          visualization: {
            type: 'array',
            array: stations.map(s => s[1]),
            highlights: {},
            labels: Object.fromEntries(stations.map((s, i) => [i, `p${s[0]}`])),
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 13,
      explanation: `Reached target with ${stops} refueling stop(s). Minimum stops: ${stops}.`,
      variables: { answer: stops, fuelRemaining: fuel },
      visualization: {
        type: 'array',
        array: stations.map(s => s[1]),
        highlights: {},
        labels: Object.fromEntries(stations.map((s, i) => [i, `p${s[0]}`])),
      },
    });

    return steps;
  },
};

export default minimumNumberOfRefuelingStops;
