import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reconstructItinerary: AlgorithmDefinition = {
  id: 'reconstruct-itinerary',
  title: 'Reconstruct Itinerary',
  leetcodeNumber: 332,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a list of airline tickets, reconstruct the itinerary starting from "JFK". You must use all tickets exactly once and the itinerary must be smallest in lexical order. Uses Hierholzer algorithm to find an Eulerian path in a directed multigraph.',
  tags: ['Eulerian path', 'Hierholzer', 'DFS', 'directed graph', 'graph'],

  code: {
    pseudocode: `function findItinerary(tickets):
  graph = {}
  for each (from, to) in tickets:
    sort destinations lexicographically
    graph[from].append(to)
  result = []
  function dfs(airport):
    while graph[airport] not empty:
      next = graph[airport].pop(0)
      dfs(next)
    result.prepend(airport)
  dfs("JFK")
  return result`,

    python: `from collections import defaultdict
def findItinerary(tickets):
    graph = defaultdict(list)
    for src, dst in sorted(tickets):
        graph[src].append(dst)
    result = []
    def dfs(airport):
        while graph[airport]:
            dfs(graph[airport].pop(0))
        result.append(airport)
    dfs("JFK")
    return result[::-1]`,

    javascript: `function findItinerary(tickets) {
  const graph = {};
  tickets.sort();
  for (const [from, to] of tickets) {
    if (!graph[from]) graph[from] = [];
    graph[from].push(to);
  }
  const result = [];
  function dfs(airport) {
    while (graph[airport] && graph[airport].length) {
      dfs(graph[airport].shift());
    }
    result.unshift(airport);
  }
  dfs('JFK');
  return result;
}`,

    java: `public List<String> findItinerary(List<List<String>> tickets) {
    Map<String, PriorityQueue<String>> graph = new HashMap<>();
    for (List<String> t : tickets) {
        graph.computeIfAbsent(t.get(0), k -> new PriorityQueue<>()).add(t.get(1));
    }
    LinkedList<String> result = new LinkedList<>();
    Deque<String> stack = new ArrayDeque<>();
    stack.push("JFK");
    while (!stack.isEmpty()) {
        while (graph.getOrDefault(stack.peek(), new PriorityQueue<>()).isEmpty())
            result.addFirst(stack.pop());
        stack.push(graph.get(stack.peek()).poll());
    }
    return result;
}`,
  },

  defaultInput: {
    tickets: ['JFK', 'MUC', 'MUC', 'LHR', 'JFK', 'SFO', 'SFO', 'SJC'],
  },

  inputFields: [
    {
      name: 'tickets',
      label: 'Tickets (from,to pairs flat)',
      type: 'array',
      defaultValue: ['JFK', 'MUC', 'MUC', 'LHR', 'JFK', 'SFO', 'SFO', 'SJC'],
      placeholder: 'JFK,MUC,MUC,LHR,...',
      helperText: 'Flat list of from,to airport pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ticketFlat = input.tickets as string[];
    const steps: AlgorithmStep[] = [];

    const ticketPairs: [string, string][] = [];
    for (let i = 0; i + 1 < ticketFlat.length; i += 2) {
      ticketPairs.push([ticketFlat[i], ticketFlat[i + 1]]);
    }
    ticketPairs.sort((a, b) => (a[0] + a[1]).localeCompare(b[0] + b[1]));

    const graph: Record<string, string[]> = {};
    for (const [from, to] of ticketPairs) {
      if (!graph[from]) graph[from] = [];
      graph[from].push(to);
    }

    const airports = Array.from(new Set(ticketFlat));
    const airportIdx = Object.fromEntries(airports.map((a, i) => [a, i]));

    const makeViz = (visited: string[], current: string): ArrayVisualization => ({
      type: 'array',
      array: airports.map((_, i) => i),
      highlights: Object.fromEntries(
        airports.map((a, i) => [
          i,
          a === current ? 'active' : visited.includes(a) ? 'visited' : 'default',
        ])
      ),
      labels: Object.fromEntries(airports.map((a, i) => [i, a])),
    });

    steps.push({
      line: 1,
      explanation: `Build adjacency list from ${ticketPairs.length} tickets (sorted lexicographically).`,
      variables: { graph: Object.fromEntries(Object.entries(graph).map(([k, v]) => [k, [...v]])) },
      visualization: makeViz([], 'JFK'),
    });

    const result: string[] = [];
    const visitedOrder: string[] = [];

    function dfs(airport: string) {
      visitedOrder.push(airport);
      steps.push({
        line: 7,
        explanation: `DFS at "${airport}". Remaining destinations: [${(graph[airport] || []).join(', ')}].`,
        variables: { airport, remaining: [...(graph[airport] || [])] },
        visualization: makeViz([...visitedOrder], airport),
      });

      while (graph[airport] && graph[airport].length > 0) {
        const next = graph[airport].shift()!;
        steps.push({
          line: 8,
          explanation: `Take ticket "${airport}" -> "${next}". Visit "${next}" next.`,
          variables: { from: airport, to: next },
          visualization: makeViz([...visitedOrder], next),
        });
        dfs(next);
      }

      result.unshift(airport);
      steps.push({
        line: 10,
        explanation: `No more destinations from "${airport}". Prepend to result. Result so far: [${result.join(', ')}].`,
        variables: { airport, result: [...result] },
        visualization: makeViz([...visitedOrder], airport),
      });
    }

    dfs('JFK');

    steps.push({
      line: 11,
      explanation: `Itinerary complete: [${result.join(' -> ')}].`,
      variables: { itinerary: result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(result.map((a, i) => [i, a])),
      },
    });

    return steps;
  },
};

export default reconstructItinerary;
