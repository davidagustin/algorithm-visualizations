import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designUndergroundSystemIi: AlgorithmDefinition = {
  id: 'design-underground-system-ii',
  title: 'Design Underground System',
  leetcodeNumber: 1396,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a system for the London Underground to track passenger check-ins and check-outs. Calculate the average travel time between any two stations using two hash maps: one for active passengers and one for route statistics.',
  tags: ['Hash Map', 'Design', 'String'],
  code: {
    pseudocode: `class UndergroundSystem:
  function init():
    checkIns = {}  // id -> (station, time)
    routes = {}    // "A->B" -> [totalTime, count]
  function checkIn(id, station, time):
    checkIns[id] = (station, time)
  function checkOut(id, station, time):
    (startStation, startTime) = checkIns.pop(id)
    key = startStation + "->" + station
    routes[key][totalTime] += time - startTime
    routes[key][count] += 1
  function getAverageTime(start, end):
    key = start + "->" + end
    return routes[key].totalTime / routes[key].count`,
    python: `class UndergroundSystem:
    def __init__(self):
        self.check_ins = {}  # id -> (station, time)
        self.routes = {}     # "A->B" -> [total, count]

    def checkIn(self, id: int, stationName: str, t: int) -> None:
        self.check_ins[id] = (stationName, t)

    def checkOut(self, id: int, stationName: str, t: int) -> None:
        start, start_t = self.check_ins.pop(id)
        key = f"{start}->{stationName}"
        if key not in self.routes:
            self.routes[key] = [0, 0]
        self.routes[key][0] += t - start_t
        self.routes[key][1] += 1

    def getAverageTime(self, startStation: str, endStation: str) -> float:
        key = f"{startStation}->{endStation}"
        total, count = self.routes[key]
        return total / count`,
    javascript: `class UndergroundSystem {
  constructor() {
    this.checkIns = new Map();
    this.routes = new Map();
  }
  checkIn(id, station, t) {
    this.checkIns.set(id, [station, t]);
  }
  checkOut(id, station, t) {
    const [start, st] = this.checkIns.get(id);
    this.checkIns.delete(id);
    const key = \`\${start}->\${station}\`;
    const [tot, cnt] = this.routes.get(key) || [0, 0];
    this.routes.set(key, [tot + t - st, cnt + 1]);
  }
  getAverageTime(start, end) {
    const [tot, cnt] = this.routes.get(\`\${start}->\${end}\`);
    return tot / cnt;
  }
}`,
    java: `class UndergroundSystem {
    Map<Integer, Object[]> checkIns = new HashMap<>();
    Map<String, int[]> routes = new HashMap<>();
    public void checkIn(int id, String station, int t) {
        checkIns.put(id, new Object[]{station, t});
    }
    public void checkOut(int id, String station, int t) {
        Object[] ci = checkIns.remove(id);
        String key = ci[0] + "->" + station;
        int[] r = routes.getOrDefault(key, new int[]{0,0});
        r[0] += t - (int)ci[1]; r[1]++;
        routes.put(key, r);
    }
    public double getAverageTime(String start, String end) {
        int[] r = routes.get(start + "->" + end);
        return (double) r[0] / r[1];
    }
}`,
  },
  defaultInput: {
    operations: [
      ['checkIn', 45, 'Leyton', 3],
      ['checkIn', 32, 'Paradise', 8],
      ['checkIn', 27, 'Leyton', 10],
      ['checkOut', 45, 'Waterloo', 15],
      ['checkOut', 27, 'Waterloo', 20],
      ['checkOut', 32, 'Cambridge', 22],
      ['getAverageTime', 'Paradise', 'Cambridge'],
      ['getAverageTime', 'Leyton', 'Waterloo'],
    ],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'checkIn 45 Leyton 3, checkIn 32 Paradise 8, checkOut 45 Waterloo 15, getAverageTime Leyton Waterloo',
      placeholder: 'checkIn id station time, checkOut id station time, getAverageTime s e',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number | string[])[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number | string[])[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts[0] === 'checkIn') return [parts[0], Number(parts[1]), parts[2], Number(parts[3])];
        if (parts[0] === 'checkOut') return [parts[0], Number(parts[1]), parts[2], Number(parts[3])];
        if (parts[0] === 'getAverageTime') return [parts[0], parts[1], parts[2]];
        return parts;
      });
    }

    const steps: AlgorithmStep[] = [];
    const checkIns = new Map<number, [string, number]>();
    const routes = new Map<string, [number, number]>();

    function makeViz(label: string): ArrayVisualization {
      const routeKeys = Array.from(routes.keys());
      const arr = routeKeys.map(k => {
        const [tot, cnt] = routes.get(k)!;
        return Math.round((tot / cnt) * 100) / 100;
      });
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      routeKeys.forEach((k, i) => { highlights[i] = 'default'; lbls[i] = k; });
      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Underground System',
          entries: [
            { key: 'Action', value: label },
            { key: 'Active passengers', value: `${checkIns.size}` },
            { key: 'Routes tracked', value: `${routes.size}` },
            ...routeKeys.map(k => { const [tot, cnt] = routes.get(k)!; return { key: k, value: `avg=${(tot / cnt).toFixed(2)}` }; }),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize Underground System.', variables: {}, visualization: makeViz('Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'checkIn') {
        const id = Number(op[1]);
        const station = String(op[2]);
        const t = Number(op[3]);
        checkIns.set(id, [station, t]);
        steps.push({ line: 5, explanation: `checkIn(${id}, ${station}, ${t}): Passenger ${id} checks in at ${station} at time ${t}.`, variables: { id, station, t }, visualization: makeViz(`checkIn(${id},${station},${t})`) });
      } else if (opType === 'checkOut') {
        const id = Number(op[1]);
        const station = String(op[2]);
        const t = Number(op[3]);
        if (checkIns.has(id)) {
          const [startStation, startTime] = checkIns.get(id)!;
          checkIns.delete(id);
          const key = `${startStation}->${station}`;
          const [prevTot, prevCnt] = routes.get(key) || [0, 0];
          routes.set(key, [prevTot + t - startTime, prevCnt + 1]);
          steps.push({ line: 7, explanation: `checkOut(${id}, ${station}, ${t}): Passenger ${id} travels ${startStation}->${station} in ${t - startTime}s.`, variables: { id, station, t, travelTime: t - startTime }, visualization: makeViz(`checkOut(${id},${station},${t})`) });
        }
      } else if (opType === 'getAverageTime') {
        const startStation = String(op[1]);
        const endStation = String(op[2]);
        const key = `${startStation}->${endStation}`;
        const [tot, cnt] = routes.get(key) || [0, 1];
        const avg = tot / cnt;
        steps.push({ line: 11, explanation: `getAverageTime(${startStation}, ${endStation}): Average time = ${avg.toFixed(2)}s (${tot}/${cnt}).`, variables: { startStation, endStation, avg }, visualization: makeViz(`getAverageTime -> ${avg.toFixed(2)}`) });
      }
    }

    steps.push({ line: 12, explanation: `All operations complete. ${routes.size} routes tracked.`, variables: { routeCount: routes.size }, visualization: makeViz('Complete') });

    return steps;
  },
};

export default designUndergroundSystemIi;
