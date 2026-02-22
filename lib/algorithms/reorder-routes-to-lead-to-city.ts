import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reorderRoutesToLeadToCity: AlgorithmDefinition = {
  id: 'reorder-routes-to-lead-to-city',
  title: 'Reorder Routes to Make All Paths Lead to the City Zero',
  leetcodeNumber: 1466,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a tree rooted at city 0 with directed roads, find the minimum number of edges that must be reversed so all cities can reach city 0. BFS from city 0: if an edge leads away from 0 (we traverse it in reverse), we must flip it, costing 1. Edges already pointing toward 0 cost 0.',
  tags: ['Graph', 'BFS', 'Topological Sort', 'Tree'],
  code: {
    pseudocode: `function minReorder(n, connections):
  adj = build adjacency list
  // store (neighbor, cost): cost=1 if edge goes away from 0
  // when we traverse an original edge, it points away -> flip (cost 1)
  // when we traverse a reverse edge, it points toward 0 -> no flip (cost 0)
  queue = [0]
  visited = {0}
  flips = 0
  while queue:
    city = queue.dequeue()
    for neighbor, cost in adj[city]:
      if neighbor not in visited:
        flips += cost
        visited.add(neighbor)
        queue.enqueue(neighbor)
  return flips`,
    python: `def minReorder(n, connections):
    adj = defaultdict(list)
    for u, v in connections:
        adj[u].append((v, 1))  # original edge: costs 1 to flip
        adj[v].append((u, 0))  # reverse edge: already points toward 0
    q = deque([0])
    visited = {0}
    flips = 0
    while q:
        city = q.popleft()
        for nb, cost in adj[city]:
            if nb not in visited:
                flips += cost
                visited.add(nb)
                q.append(nb)
    return flips`,
    javascript: `function minReorder(n, connections) {
  const adj = Array.from({length:n}, ()=>[]);
  for (const [u,v] of connections) {
    adj[u].push([v, 1]);  // must flip: away from 0
    adj[v].push([u, 0]);  // no flip: toward 0
  }
  const queue=[0], visited=new Set([0]);
  let flips=0;
  while(queue.length){
    const city=queue.shift();
    for(const[nb,cost]of adj[city]){
      if(!visited.has(nb)){
        flips+=cost; visited.add(nb); queue.push(nb);
      }
    }
  }
  return flips;
}`,
    java: `public int minReorder(int n, int[][] connections) {
    List<int[]>[]adj=new List[n];
    for(int i=0;i<n;i++)adj[i]=new ArrayList<>();
    for(int[]c:connections){adj[c[0]].add(new int[]{c[1],1});adj[c[1]].add(new int[]{c[0],0});}
    Queue<Integer>q=new LinkedList<>();q.add(0);
    boolean[]vis=new boolean[n];vis[0]=true;int flips=0;
    while(!q.isEmpty()){
        int city=q.poll();
        for(int[]e:adj[city])if(!vis[e[0]]){flips+=e[1];vis[e[0]]=true;q.add(e[0]);}
    }
    return flips;
}`,
  },
  defaultInput: {
    n: 6,
    connections: [[0, 1], [1, 3], [2, 3], [4, 0], [4, 5]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Cities labeled 0 to n-1',
    },
    {
      name: 'connections',
      label: 'Connections [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [1, 3], [2, 3], [4, 0], [4, 5]],
      placeholder: '[[0,1],[1,3],[2,3],[4,0],[4,5]]',
      helperText: 'Directed roads from u to v',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const connections = input.connections as number[][];
    const steps: AlgorithmStep[] = [];

    // adj[u] = [[neighbor, cost]]
    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v] of connections) {
      adj[u].push([v, 1]); // original: must flip to reach 0
      adj[v].push([u, 0]); // reverse: already points toward 0
    }

    const visited = new Set<number>([0]);
    let flips = 0;

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[],
      totalFlips: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => visited.has(i) ? 1 : 0),
        highlights,
        labels,
        auxData: {
          label: 'Reorder Routes to City 0',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Total Flips', value: String(totalFlips) },
            { key: 'Visited', value: [...visited].sort((a, b) => a - b).join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `BFS from city 0. For each edge traversed: if original direction (away from 0) -> flip (+1 cost). If reverse (toward 0) -> free.`,
      variables: { n, edges: connections.length },
      visualization: makeViz(
        { 0: 'active' },
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i}`])),
        [0],
        0
      ),
    });

    const queue: number[] = [0];

    while (queue.length > 0) {
      const city = queue.shift()!;

      steps.push({
        line: 8,
        explanation: `Process city ${city}. Neighbors (with cost): [${adj[city].map(([nb, c]) => `${nb}:${c}`).join(', ')}].`,
        variables: { city, neighbors: adj[city].map(([nb, c]) => `${nb}(cost=${c})`) },
        visualization: makeViz(
          { [city]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, visited.has(i) ? 'c' + i : `?c${i}`])),
          [...queue],
          flips
        ),
      });

      for (const [nb, cost] of adj[city]) {
        if (!visited.has(nb)) {
          flips += cost;
          visited.add(nb);
          queue.push(nb);

          steps.push({
            line: 10,
            explanation: `City ${nb} reached from ${city}. ${cost === 1 ? 'Original edge (away from 0): FLIP needed (+1).' : 'Reverse edge (toward 0): no flip needed.'} Total flips: ${flips}.`,
            variables: { nb, cost, flips },
            visualization: makeViz(
              { [city]: 'found', [nb]: cost === 1 ? 'comparing' : 'active' },
              Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i}${visited.has(i) ? ':ok' : ''}`])),
              [...queue],
              flips
            ),
          });
        }
      }
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'found';

    steps.push({
      line: 14,
      explanation: `All ${n} cities visited. Minimum flips to route all to city 0: ${flips}.`,
      variables: { result: flips },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `c${i}`])),
        [],
        flips
      ),
    });

    return steps;
  },
};

export default reorderRoutesToLeadToCity;
