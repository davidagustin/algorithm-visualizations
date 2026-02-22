import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designUndergroundSystem: AlgorithmDefinition = {
  id: 'design-underground-system',
  title: 'Design Underground System',
  leetcodeNumber: 1396,
  difficulty: 'Medium',
  category: 'Design',
  description:
    'Design a system to track customer check-in and check-out times at metro stations, then answer queries about the average travel time between two stations. Use two hash maps: one for active trips (id -> station, time) and one for accumulated route data (route -> total time, count).',
  tags: ['hash map', 'design', 'simulation', 'average'],

  code: {
    pseudocode: `class UndergroundSystem:
  checkIns = {}   // id -> (station, time)
  trips = {}      // route -> (totalTime, count)

  checkIn(id, station, time):
    checkIns[id] = (station, time)

  checkOut(id, station, time):
    startStation, startTime = checkIns[id]
    delete checkIns[id]
    route = startStation + "-" + station
    trips[route].totalTime += time - startTime
    trips[route].count += 1

  getAverageTime(from, to):
    route = from + "-" + to
    return trips[route].totalTime / trips[route].count`,

    python: `class UndergroundSystem:
    def __init__(self):
        self.check_ins = {}  # id -> (station, time)
        self.trips = {}      # route -> [total, count]

    def checkIn(self, id: int, stationName: str, t: int) -> None:
        self.check_ins[id] = (stationName, t)

    def checkOut(self, id: int, stationName: str, t: int) -> None:
        start, start_t = self.check_ins.pop(id)
        route = (start, stationName)
        if route not in self.trips:
            self.trips[route] = [0, 0]
        self.trips[route][0] += t - start_t
        self.trips[route][1] += 1

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        total, count = self.trips[(startStation, endStation)]
        return total / count`,

    javascript: `class UndergroundSystem {
  constructor() {
    this.checkIns = new Map();
    this.trips = new Map();
  }

  checkIn(id, stationName, t) {
    this.checkIns.set(id, [stationName, t]);
  }

  checkOut(id, stationName, t) {
    const [start, startT] = this.checkIns.get(id);
    this.checkIns.delete(id);
    const route = start + '-' + stationName;
    const cur = this.trips.get(route) || [0, 0];
    this.trips.set(route, [cur[0] + t - startT, cur[1] + 1]);
  }

  getAverageTime(startStation, endStation) {
    const [total, count] = this.trips.get(startStation + '-' + endStation);
    return total / count;
  }
}`,

    java: `class UndergroundSystem {
    Map<Integer, String[]> checkIns = new HashMap<>();
    Map<String, int[]> trips = new HashMap<>();

    public void checkIn(int id, String stationName, int t) {
        checkIns.put(id, new String[]{stationName, String.valueOf(t)});
    }

    public void checkOut(int id, String stationName, int t) {
        String[] entry = checkIns.remove(id);
        String route = entry[0] + "-" + stationName;
        int[] data = trips.getOrDefault(route, new int[]{0, 0});
        data[0] += t - Integer.parseInt(entry[1]);
        data[1]++;
        trips.put(route, data);
    }

    public double getAverageTime(String startStation, String endStation) {
        int[] data = trips.get(startStation + "-" + endStation);
        return (double) data[0] / data[1];
    }
}`,
  },

  defaultInput: {
    events: [10, 20, 30, 40],
  },

  inputFields: [
    {
      name: 'events',
      label: 'Customer IDs',
      type: 'array',
      defaultValue: [10, 20, 30, 40],
      placeholder: '10,20,30,40',
      helperText: 'Customer IDs that will check in and out',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Simulate a fixed scenario for visualization
    const checkIns: Record<number, [string, number]> = {};
    const trips: Record<string, [number, number]> = {};

    const stations = ['Leyton', 'Waterloo', 'Euston', 'Victoria'];
    const events: Array<{ type: string; id: number; station: string; time: number }> = [
      { type: 'checkIn', id: 1, station: 'Leyton', time: 3 },
      { type: 'checkIn', id: 2, station: 'Waterloo', time: 5 },
      { type: 'checkOut', id: 1, station: 'Waterloo', time: 15 },
      { type: 'checkIn', id: 3, station: 'Leyton', time: 10 },
      { type: 'checkOut', id: 2, station: 'Euston', time: 20 },
      { type: 'checkOut', id: 3, station: 'Waterloo', time: 25 },
      { type: 'query', id: 0, station: 'Leyton-Waterloo', time: 0 },
    ];

    steps.push({
      line: 1,
      explanation: 'Initialize two hash maps: checkIns for active passengers, trips for route statistics.',
      variables: { checkIns: '{}', trips: '{}' },
      visualization: {
        type: 'array',
        array: [0, 0, 0, 0],
        highlights: {},
        labels: { 0: 'Leyton', 1: 'Waterloo', 2: 'Euston', 3: 'Victoria' },
      },
    });

    for (const event of events) {
      if (event.type === 'checkIn') {
        checkIns[event.id] = [event.station, event.time];
        const stationIdx = stations.indexOf(event.station);
        steps.push({
          line: 5,
          explanation: `checkIn(id=${event.id}, station="${event.station}", t=${event.time}): Store check-in info. Active passengers: ${Object.keys(checkIns).length}.`,
          variables: { id: event.id, station: event.station, time: event.time, activePassengers: Object.keys(checkIns).length },
          visualization: {
            type: 'array',
            array: [0, 0, 0, 0],
            highlights: { [stationIdx]: 'active' },
            labels: { 0: 'Leyton', 1: 'Waterloo', 2: 'Euston', 3: 'Victoria', [stationIdx]: `id=${event.id} IN` },
          },
        });
      } else if (event.type === 'checkOut') {
        const [startStation, startTime] = checkIns[event.id];
        delete checkIns[event.id];
        const route = `${startStation}-${event.station}`;
        const duration = event.time - startTime;
        if (!trips[route]) trips[route] = [0, 0];
        trips[route][0] += duration;
        trips[route][1] += 1;
        const avg = trips[route][0] / trips[route][1];
        const startIdx = stations.indexOf(startStation);
        const endIdx = stations.indexOf(event.station);
        steps.push({
          line: 8,
          explanation: `checkOut(id=${event.id}, station="${event.station}", t=${event.time}): Trip from "${startStation}" to "${event.station}" took ${duration}. Route avg now ${avg.toFixed(1)}.`,
          variables: { id: event.id, route, duration, routeAvg: avg.toFixed(2), tripCount: trips[route][1] },
          visualization: {
            type: 'array',
            array: [0, 0, 0, 0],
            highlights: { [startIdx]: 'found', [endIdx]: 'found' },
            labels: { 0: 'Leyton', 1: 'Waterloo', 2: 'Euston', 3: 'Victoria', [startIdx]: 'FROM', [endIdx]: 'TO' },
          },
        });
      } else {
        // query
        const route = event.station;
        const [total, count] = trips[route] || [0, 1];
        const avg = total / count;
        const parts = route.split('-');
        const startIdx = stations.indexOf(parts[0]);
        const endIdx = stations.indexOf(parts[1]);
        steps.push({
          line: 14,
          explanation: `getAverageTime("${parts[0]}", "${parts[1]}"): totalTime=${total}, count=${count}. Average = ${avg.toFixed(2)}.`,
          variables: { route, totalTime: total, tripCount: count, average: avg.toFixed(2) },
          visualization: {
            type: 'array',
            array: [0, 0, 0, 0],
            highlights: { [startIdx]: 'pointer', [endIdx]: 'pointer' },
            labels: { 0: 'Leyton', 1: 'Waterloo', 2: 'Euston', 3: 'Victoria', [startIdx]: `avg=${avg.toFixed(1)}` },
          },
        });
      }
    }

    return steps;
  },
};

export default designUndergroundSystem;
