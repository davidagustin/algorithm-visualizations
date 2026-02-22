import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reorderRoutesToMakeAllPathsLeadToCityZero: AlgorithmDefinition = {
  id: 'reorder-routes-to-make-all-paths-lead-to-city-zero',
  title: 'Reorder Routes to Make All Paths Lead to City Zero',
  leetcodeNumber: 1466,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'There are n cities connected by directed edges. Find the minimum number of edges that need to be reversed so that every city can reach city 0. Use BFS from city 0: when traversing an original directed edge away from 0, that edge needs to be reversed (count +1). Reverse edges are free.',
  tags: ['graph', 'bfs', 'dfs', 'directed graph', 'tree'],

  code: {
    pseudocode: `function minReorder(n, connections):
  build undirected graph: store (neighbor, cost)
    cost=1 for original direction, cost=0 for reverse
  queue = [0], visited = {0}, ans = 0
  while queue not empty:
    curr = queue.dequeue()
    for each (neighbor, cost) adjacent to curr:
      if neighbor not visited:
        ans += cost  // cost=1 means we need to reverse
        visited.add(neighbor)
        queue.enqueue(neighbor)
  return ans`,

    python: `def minReorder(n, connections):
    adj = defaultdict(list)
    for u, v in connections:
        adj[u].append((v, 1))  # original direction costs 1 to reverse
        adj[v].append((u, 0))  # reverse direction is free
    visited = {0}
    queue = deque([0])
    ans = 0
    while queue:
        curr = queue.popleft()
        for neighbor, cost in adj[curr]:
            if neighbor not in visited:
                ans += cost
                visited.add(neighbor)
                queue.append(neighbor)
    return ans`,

    javascript: `function minReorder(n, connections) {
  const adj = Array.from({length:n},()=>[]);
  for (const [u,v] of connections) {
    adj[u].push([v,1]);
    adj[v].push([u,0]);
  }
  const visited = new Set([0]);
  const queue = [0];
  let ans = 0;
  while (queue.length) {
    const curr = queue.shift();
    for (const [nb,cost] of adj[curr]) {
      if (!visited.has(nb)) {
        ans += cost;
        visited.add(nb);
        queue.push(nb);
      }
    }
  }
  return ans;
}`,

    java: `public int minReorder(int n, int[][] connections) {
    List<int[]>[] adj = new List[n];
    for (int i=0;i<n;i++) adj[i]=new ArrayList<>();
    for (int[] c:connections) { adj[c[0]].add(new int[]{c[1],1}); adj[c[1]].add(new int[]{c[0],0}); }
    boolean[] visited = new boolean[n];
    Queue<Integer> queue = new LinkedList<>();
    queue.add(0); visited[0]=true;
    int ans=0;
    while (!queue.isEmpty()) {
        int curr=queue.poll();
        for (int[] nb:adj[curr]) if(!visited[nb[0]]) { ans+=nb[1]; visited[nb[0]]=true; queue.add(nb[0]); }
    }
    return ans;
}`,
  },

  defaultInput: {
    n: 6,
    connectionsFlat: [0, 1, 1, 3, 2, 3, 4, 0, 4, 5],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'connectionsFlat',
      label: 'Connections (flattened pairs)',
      type: 'array',
      defaultValue: [0, 1, 1, 3, 2, 3, 4, 0, 4, 5],
      placeholder: '0,1,1,3,2,3,4,0,4,5',
      helperText: 'Directed edge pairs [from1,to1,from2,to2,...]. Target: all cities reach city 0.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const conFlat = input.connectionsFlat as number[];
    const steps: AlgorithmStep[] = [];

    const connections: [number, number][] = [];
    for (let i = 0; i + 1 < conFlat.length; i += 2) {
      connections.push([conFlat[i], conFlat[i + 1]]);
    }

    const adj: [number, number][][] = Array.from({ length: n }, () => []);
    for (const [u, v] of connections) {
      if (u < n && v < n) {
        adj[u].push([v, 1]); // original: cost 1 to reverse
        adj[v].push([u, 0]); // free direction
      }
    }

    const cities = Array.from({ length: n }, (_, i) => i);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: cities,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `${n} cities. Find minimum edges to reverse so every city reaches city 0. BFS from city 0 outward.`,
      variables: { n, edgeCount: connections.length },
      visualization: makeViz({ 0: 'found' }, { 0: 'city 0' }),
    });

    steps.push({
      line: 2,
      explanation: `Build undirected graph: original edges cost 1 (need reversal), reverse edges cost 0 (free). BFS from city 0.`,
      variables: { edges: connections.map(([u, v]) => `${u}->${v}`).join(', ') },
      visualization: makeViz(
        cities.reduce((acc, c) => { acc[c] = 'visited'; return acc; }, {} as Record<number, string>),
        { 0: 'start' }
      ),
    });

    const visited = new Set<number>([0]);
    const queue: number[] = [0];
    let ans = 0;

    steps.push({
      line: 3,
      explanation: `Initialize BFS with city 0 as root. All roads that point away from city 0 (in BFS tree) must be reversed.`,
      variables: { queue: [0], ans: 0 },
      visualization: makeViz({ 0: 'active' }, { 0: 'root' }),
    });

    while (queue.length > 0) {
      const curr = queue.shift()!;
      const hl: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const v of visited) { hl[v] = 'visited'; lb[v] = `vis`; }
      hl[curr] = 'active';
      lb[curr] = `curr`;
      hl[0] = 'found';
      lb[0] = 'city0';

      steps.push({
        line: 5,
        explanation: `Process city ${curr}. Check its neighbors.`,
        variables: { current: curr, ans, visited: [...visited].join(',') },
        visualization: makeViz(hl, lb),
      });

      for (const [nb, cost] of adj[curr]) {
        if (!visited.has(nb)) {
          ans += cost;
          visited.add(nb);
          queue.push(nb);

          const nhl = { ...hl };
          const nlb = { ...lb };
          nhl[nb] = cost === 1 ? 'mismatch' : 'comparing';
          nlb[nb] = cost === 1 ? 'reverse!' : 'free';

          steps.push({
            line: 7,
            explanation: `City ${nb} from city ${curr}: cost=${cost}. ${cost === 1 ? 'Edge must be REVERSED (cost +1).' : 'Edge is already pointing toward city 0 (free).'} ans=${ans}.`,
            variables: { neighbor: nb, cost, totalAns: ans },
            visualization: makeViz(nhl, nlb),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `BFS complete. Minimum number of edges to reverse = ${ans}.`,
      variables: { result: ans },
      visualization: makeViz(
        cities.reduce((acc, c) => { acc[c] = 'sorted'; return acc; }, {} as Record<number, string>),
        { 0: `ans=${ans}` }
      ),
    });

    return steps;
  },
};

export default reorderRoutesToMakeAllPathsLeadToCityZero;
