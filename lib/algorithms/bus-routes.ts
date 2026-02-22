import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const busRoutes: AlgorithmDefinition = {
  id: 'bus-routes',
  title: 'Bus Routes',
  leetcodeNumber: 815,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'You are given an array of bus routes where routes[i] contains stops of the i-th bus. You start at stop source and want to reach stop target. Return the minimum number of buses needed, or -1 if impossible. BFS treats each bus route as a node and stops as edges connecting routes.',
  tags: ['bfs', 'graph', 'bus routes', 'shortest path'],

  code: {
    pseudocode: `function numBusesToDestination(routes, source, target):
  if source == target: return 0
  stopToRoutes = map each stop to its routes
  visited_stops = {source}
  visited_routes = set()
  queue = [source]
  buses = 0
  while queue not empty:
    buses += 1
    next_queue = []
    for stop in queue:
      for route in stopToRoutes[stop]:
        if route in visited_routes: continue
        visited_routes.add(route)
        for each s in routes[route]:
          if s == target: return buses
          if s not in visited_stops:
            visited_stops.add(s)
            next_queue.append(s)
    queue = next_queue
  return -1`,

    python: `from collections import defaultdict, deque

def numBusesToDestination(routes, source, target):
    if source == target: return 0
    stop_to_routes = defaultdict(set)
    for i, route in enumerate(routes):
        for stop in route:
            stop_to_routes[stop].add(i)
    visited_stops = {source}
    visited_routes = set()
    queue = deque([source])
    buses = 0
    while queue:
        buses += 1
        for _ in range(len(queue)):
            stop = queue.popleft()
            for route in stop_to_routes[stop]:
                if route in visited_routes: continue
                visited_routes.add(route)
                for s in routes[route]:
                    if s == target: return buses
                    if s not in visited_stops:
                        visited_stops.add(s)
                        queue.append(s)
    return -1`,

    javascript: `function numBusesToDestination(routes, source, target) {
  if (source === target) return 0;
  const stopToRoutes = new Map();
  for (let i = 0; i < routes.length; i++) {
    for (const stop of routes[i]) {
      if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
      stopToRoutes.get(stop).push(i);
    }
  }
  const visitedStops = new Set([source]);
  const visitedRoutes = new Set();
  let queue = [source];
  let buses = 0;
  while (queue.length) {
    buses++;
    const next = [];
    for (const stop of queue) {
      for (const route of (stopToRoutes.get(stop) || [])) {
        if (visitedRoutes.has(route)) continue;
        visitedRoutes.add(route);
        for (const s of routes[route]) {
          if (s === target) return buses;
          if (!visitedStops.has(s)) {
            visitedStops.add(s);
            next.push(s);
          }
        }
      }
    }
    queue = next;
  }
  return -1;
}`,

    java: `public int numBusesToDestination(int[][] routes, int source, int target) {
    if (source == target) return 0;
    Map<Integer, List<Integer>> stopToRoutes = new HashMap<>();
    for (int i = 0; i < routes.length; i++) {
        for (int stop : routes[i]) {
            stopToRoutes.computeIfAbsent(stop, k -> new ArrayList<>()).add(i);
        }
    }
    Set<Integer> visitedStops = new HashSet<>(Arrays.asList(source));
    Set<Integer> visitedRoutes = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>(Arrays.asList(source));
    int buses = 0;
    while (!queue.isEmpty()) {
        buses++;
        int size = queue.size();
        while (size-- > 0) {
            int stop = queue.poll();
            for (int route : stopToRoutes.getOrDefault(stop, new ArrayList<>())) {
                if (visitedRoutes.contains(route)) continue;
                visitedRoutes.add(route);
                for (int s : routes[route]) {
                    if (s == target) return buses;
                    if (!visitedStops.contains(s)) {
                        visitedStops.add(s);
                        queue.offer(s);
                    }
                }
            }
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    routes: [[1, 2, 7], [3, 6, 7]],
    source: 1,
    target: 6,
  },

  inputFields: [
    {
      name: 'source',
      label: 'Source Stop',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Starting bus stop',
    },
    {
      name: 'target',
      label: 'Target Stop',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Destination bus stop',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const routes = input.routes as number[][];
    const source = input.source as number;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start at stop ${source}, need to reach stop ${target}. Building stop-to-route mapping.`,
      variables: { source, target, numRoutes: routes.length },
      visualization: {
        type: 'array',
        array: [source, target, routes.length],
        highlights: { 0: 'active', 1: 'pointer', 2: 'current' },
        labels: { 0: 'source', 1: 'target', 2: 'numRoutes' },
      } as ArrayVisualization,
    });

    if (source === target) {
      steps.push({
        line: 2,
        explanation: 'Source equals target, already at destination. Return 0 buses.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [source, target, 0],
          highlights: { 0: 'found', 1: 'found', 2: 'found' },
          labels: { 0: 'source', 1: 'target', 2: 'buses' },
        } as ArrayVisualization,
      });
      return steps;
    }

    const stopToRoutes = new Map<number, number[]>();
    for (let i = 0; i < routes.length; i++) {
      for (const stop of routes[i]) {
        if (!stopToRoutes.has(stop)) stopToRoutes.set(stop, []);
        stopToRoutes.get(stop)!.push(i);
      }
    }

    steps.push({
      line: 3,
      explanation: `Built stop-to-route map. Stop ${source} is on route(s): [${stopToRoutes.get(source)?.join(', ') ?? 'none'}].`,
      variables: { stopToRoutesSize: stopToRoutes.size },
      visualization: {
        type: 'array',
        array: routes.map(r => r.length),
        highlights: Object.fromEntries(routes.map((_, i) => [i, 'visited'])),
        labels: Object.fromEntries(routes.map((_, i) => [i, `route${i}`])),
      } as ArrayVisualization,
    });

    const visitedStops = new Set<number>([source]);
    const visitedRoutes = new Set<number>();
    let queue = [source];
    let buses = 0;

    while (queue.length > 0) {
      buses++;
      const next: number[] = [];

      steps.push({
        line: 8,
        explanation: `Bus ${buses}: Processing ${queue.length} stop(s) in current frontier.`,
        variables: { buses, queueSize: queue.length },
        visualization: {
          type: 'array',
          array: queue.slice(0, 8),
          highlights: Object.fromEntries(queue.slice(0, 8).map((_, i) => [i, 'active'])),
          labels: Object.fromEntries(queue.slice(0, 8).map((_, i) => [i, `stop`])),
        } as ArrayVisualization,
      });

      for (const stop of queue) {
        const routesForStop = stopToRoutes.get(stop) ?? [];
        for (const route of routesForStop) {
          if (visitedRoutes.has(route)) continue;
          visitedRoutes.add(route);

          for (const s of routes[route]) {
            if (s === target) {
              steps.push({
                line: 13,
                explanation: `Found target stop ${target} via route ${route} using ${buses} bus(es).`,
                variables: { result: buses, foundOnRoute: route },
                visualization: {
                  type: 'array',
                  array: routes[route].slice(0, 8),
                  highlights: Object.fromEntries(
                    routes[route].slice(0, 8).map((v, i) => [i, v === target ? 'found' : 'visited'])
                  ),
                  labels: { 0: `route${route}` },
                } as ArrayVisualization,
              });
              return steps;
            }
            if (!visitedStops.has(s)) {
              visitedStops.add(s);
              next.push(s);
            }
          }
        }
      }
      queue = next;

      if (steps.length > 20) break;
    }

    steps.push({
      line: 17,
      explanation: `BFS exhausted. Cannot reach stop ${target} from stop ${source}. Return -1.`,
      variables: { result: -1 },
      visualization: {
        type: 'array',
        array: [source, target, -1],
        highlights: { 0: 'mismatch', 1: 'mismatch', 2: 'mismatch' },
        labels: { 0: 'source', 1: 'target', 2: 'result' },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default busRoutes;
