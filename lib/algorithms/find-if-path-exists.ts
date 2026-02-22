import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findIfPathExists: AlgorithmDefinition = {
  id: 'find-if-path-exists',
  title: 'Find if Path Exists in Graph',
  leetcodeNumber: 1971,
  difficulty: 'Easy',
  category: 'Graph',
  description:
    'Given an undirected graph with n nodes and a list of edges, determine whether a path exists between the source and destination. Uses BFS starting from the source and checks if the destination is reachable.',
  tags: ['graph', 'bfs', 'dfs', 'union find', 'path'],

  code: {
    pseudocode: `function validPath(n, edges, source, destination):
  if source == destination: return true
  build adjacency list from edges
  visited = set()
  queue = [source]
  visited.add(source)
  while queue not empty:
    curr = queue.dequeue()
    if curr == destination: return true
    for each neighbor of curr:
      if neighbor not in visited:
        visited.add(neighbor)
        queue.enqueue(neighbor)
  return false`,

    python: `def validPath(n, edges, source, destination):
    if source == destination:
        return True
    adj = defaultdict(list)
    for u, v in edges:
        adj[u].append(v)
        adj[v].append(u)
    visited = {source}
    queue = deque([source])
    while queue:
        curr = queue.popleft()
        if curr == destination:
            return True
        for neighbor in adj[curr]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    return False`,

    javascript: `function validPath(n, edges, source, destination) {
  if (source === destination) return true;
  const adj = Array.from({length: n}, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  const visited = new Set([source]);
  const queue = [source];
  while (queue.length) {
    const curr = queue.shift();
    if (curr === destination) return true;
    for (const neighbor of adj[curr]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return false;
}`,

    java: `public boolean validPath(int n, int[][] edges, int source, int destination) {
    if (source == destination) return true;
    List<List<Integer>> adj = new ArrayList<>();
    for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
    for (int[] e : edges) {
        adj.get(e[0]).add(e[1]);
        adj.get(e[1]).add(e[0]);
    }
    Set<Integer> visited = new HashSet<>();
    Queue<Integer> queue = new LinkedList<>();
    queue.add(source);
    visited.add(source);
    while (!queue.isEmpty()) {
        int curr = queue.poll();
        if (curr == destination) return true;
        for (int neighbor : adj.get(curr)) {
            if (!visited.contains(neighbor)) {
                visited.add(neighbor);
                queue.add(neighbor);
            }
        }
    }
    return false;
}`,
  },

  defaultInput: {
    n: 6,
    edgesFlat: [0, 1, 0, 2, 3, 5, 5, 4, 4, 3],
    source: 0,
    destination: 5,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'edgesFlat',
      label: 'Edges (flattened pairs)',
      type: 'array',
      defaultValue: [0, 1, 0, 2, 3, 5, 5, 4, 4, 3],
      placeholder: '0,1,0,2,3,5,5,4,4,3',
      helperText: 'Edge pairs [u1,v1,u2,v2,...]',
    },
    {
      name: 'source',
      label: 'Source Node',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      name: 'destination',
      label: 'Destination Node',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edgesFlat = input.edgesFlat as number[];
    const source = input.source as number;
    const destination = input.destination as number;
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i + 1 < edgesFlat.length; i += 2) {
      const u = edgesFlat[i], v = edgesFlat[i + 1];
      if (u < n && v < n) {
        adj[u].push(v);
        adj[v].push(u);
      }
    }

    const nodeVals = Array.from({ length: n }, (_, i) => i);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: nodeVals,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find if path exists from node ${source} to node ${destination} in a graph with ${n} nodes.`,
      variables: { source, destination, n },
      visualization: makeViz({ [source]: 'active', [destination]: 'found' }, { [source]: 'src', [destination]: 'dst' }),
    });

    if (source === destination) {
      steps.push({
        line: 2,
        explanation: `Source equals destination (${source}). Path trivially exists.`,
        variables: { result: true },
        visualization: makeViz({ [source]: 'found' }, { [source]: 'src=dst' }),
      });
      return steps;
    }

    const visited = new Set<number>([source]);
    const queue: number[] = [source];

    steps.push({
      line: 5,
      explanation: `Initialize BFS queue with source node ${source}. Mark it visited.`,
      variables: { queue: [source], visited: [source] },
      visualization: makeViz({ [source]: 'active', [destination]: 'pointer' }, { [source]: 'src', [destination]: 'dst' }),
    });

    let found = false;

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'visited'; lb[v] = 'vis'; }
      hl[curr] = 'active';
      lb[curr] = 'curr';
      hl[destination] = 'pointer';
      lb[destination] = 'dst';

      steps.push({
        line: 7,
        explanation: `Dequeue node ${curr}. Check if it is the destination (${destination}).`,
        variables: { current: curr, visited: [...visited], queue: [...queue] },
        visualization: makeViz(hl, lb),
      });

      if (curr === destination) {
        found = true;
        hl[curr] = 'found';
        lb[curr] = 'FOUND!';
        steps.push({
          line: 8,
          explanation: `Reached destination ${destination}! Path exists from ${source} to ${destination}.`,
          variables: { result: true },
          visualization: makeViz(hl, lb),
        });
        break;
      }

      for (const neighbor of adj[curr]) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          const nhl = { ...hl };
          const nlb = { ...lb };
          nhl[neighbor] = 'comparing';
          nlb[neighbor] = 'enq';

          steps.push({
            line: 10,
            explanation: `Unvisited neighbor ${neighbor} of node ${curr}. Enqueue it.`,
            variables: { neighbor, queue: [...queue] },
            visualization: makeViz(nhl, nlb),
          });
        }
      }
    }

    if (!found) {
      steps.push({
        line: 12,
        explanation: `BFS exhausted. No path exists from ${source} to ${destination}.`,
        variables: { result: false },
        visualization: makeViz(
          Object.fromEntries([...visited].map(v => [v, 'mismatch'])),
          { [source]: 'src', [destination]: 'dst' }
        ),
      });
    }

    return steps;
  },
};

export default findIfPathExists;
