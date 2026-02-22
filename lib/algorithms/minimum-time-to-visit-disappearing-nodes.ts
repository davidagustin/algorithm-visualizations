import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumTimeToVisitDisappearingNodes: AlgorithmDefinition = {
  id: 'minimum-time-to-visit-disappearing-nodes',
  title: 'Minimum Time to Visit Disappearing Nodes',
  leetcodeNumber: 3112,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the minimum time to reach each node from node 0, given that each node i disappears at time disappear[i]. You can only visit node i if you arrive strictly before disappear[i]. Uses Dijkstra but skips nodes that have disappeared.',
  tags: ['graph', 'dijkstra', 'heap', 'time constraint', 'shortest path'],

  code: {
    pseudocode: `function minimumTime(n, edges, disappear):
  graph = adjacency list
  dist = array of INF, dist[0] = 0
  heap = [(0, 0)]
  while heap not empty:
    time, node = pop min
    if time > dist[node]: continue
    for each nb, w in graph[node]:
      arrivalTime = time + w
      if arrivalTime < disappear[nb] and arrivalTime < dist[nb]:
        dist[nb] = arrivalTime
        push (arrivalTime, nb) to heap
  return [d if d < INF else -1 for d in dist]`,

    python: `import heapq
def minimumTime(n, edges, disappear):
    INF = float('inf')
    graph = [[] for _ in range(n)]
    for u,v,w in edges:
        graph[u].append((v,w)); graph[v].append((u,w))
    dist = [INF]*n; dist[0]=0
    heap = [(0,0)]
    while heap:
        t,u = heapq.heappop(heap)
        if t > dist[u]: continue
        for v,w in graph[u]:
            at = t+w
            if at < disappear[v] and at < dist[v]:
                dist[v]=at; heapq.heappush(heap,(at,v))
    return [d if d<INF else -1 for d in dist]`,

    javascript: `function minimumTime(n, edges, disappear) {
  const INF = Infinity;
  const graph = Array.from({length:n},()=>[]);
  for (const [u,v,w] of edges) { graph[u].push([v,w]); graph[v].push([u,w]); }
  const dist = new Array(n).fill(INF); dist[0]=0;
  const heap=[[0,0]];
  while(heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [t,u]=heap.shift();
    if(t>dist[u]) continue;
    for(const [v,w] of graph[u]) {
      const at=t+w;
      if(at<disappear[v] && at<dist[v]) { dist[v]=at; heap.push([at,v]); }
    }
  }
  return dist.map(d=>d===INF?-1:d);
}`,

    java: `public int[] minimumTime(int n, int[][] edges, int[] disappear) {
    List<int[]>[] graph=new List[n];
    for(int i=0;i<n;i++) graph[i]=new ArrayList<>();
    for(int[] e:edges){graph[e[0]].add(new int[]{e[1],e[2]});graph[e[1]].add(new int[]{e[0],e[2]});}
    int[] dist=new int[n]; Arrays.fill(dist,Integer.MAX_VALUE); dist[0]=0;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,0});
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int t=cur[0],u=cur[1];
        if(t>dist[u]) continue;
        for(int[] nb:graph[u]){
            int at=t+nb[1];
            if(at<disappear[nb[0]]&&at<dist[nb[0]]){dist[nb[0]]=at;pq.offer(new int[]{at,nb[0]});}
        }
    }
    int[] res=new int[n];
    for(int i=0;i<n;i++) res[i]=dist[i]==Integer.MAX_VALUE?-1:dist[i];
    return res;
}`,
  },

  defaultInput: {
    n: 5,
    edges: [[0,1,2],[0,2,1],[1,3,3],[2,3,1],[3,4,2]],
    disappear: [10, 5, 8, 6, 12],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total nodes in the graph',
    },
    {
      name: 'disappear',
      label: 'Disappear Times',
      type: 'array',
      defaultValue: [10, 5, 8, 6, 12],
      placeholder: '10,5,8,6,12',
      helperText: 'Node i disappears at time disappear[i]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const disappear = input.disappear as number[];
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, w] of edges) {
      graph[u].push([v, w]);
      graph[v].push([u, w]);
    }

    const dist = new Array(n).fill(INF);
    dist[0] = 0;
    const heap: Array<[number, number]> = [[0, 0]];

    steps.push({
      line: 2,
      explanation: `Dijkstra with disappear constraint. Node i is blocked if arrival >= disappear[i]. disappear: [${disappear.join(', ')}].`,
      variables: { disappear: disappear.join(', '), start: 0 },
      visualization: {
        type: 'array',
        array: disappear,
        highlights: { 0: 'active' },
        labels: { 0: 'start' },
      },
    });

    steps.push({
      line: 3,
      explanation: `Init: dist[0]=0, all others=INF. Process in order of earliest arrival.`,
      variables: { dist: dist.map(d => (d === INF ? 'INF' : d)) },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'active' },
        labels: { 0: 'src' },
      },
    });

    let iterations = 0;
    while (heap.length > 0 && iterations < 20) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [t, u] = heap.shift()!;

      if (t > dist[u]) continue;

      steps.push({
        line: 6,
        explanation: `Process node ${u} at time ${t}. disappear[${u}]=${disappear[u]}. Exploring neighbors.`,
        variables: { node: u, time: t, disappear: disappear[u] },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === INF ? 999 : d)),
          highlights: { [u]: 'active' },
          labels: { [u]: `t=${t}` },
        },
      });

      for (const [v, w] of graph[u]) {
        const arrivalTime = t + w;
        if (arrivalTime < disappear[v] && arrivalTime < dist[v]) {
          dist[v] = arrivalTime;
          heap.push([arrivalTime, v]);
          steps.push({
            line: 9,
            explanation: `Reach node ${v} at time ${arrivalTime} (${t}+${w}). disappear[${v}]=${disappear[v]}. ${arrivalTime} < ${disappear[v]}: allowed. Update dist[${v}]=${arrivalTime}.`,
            variables: { from: u, to: v, arrivalTime, disappear: disappear[v] },
            visualization: {
              type: 'array',
              array: dist.map(d => (d === INF ? 999 : d)),
              highlights: { [u]: 'active', [v]: 'found' },
              labels: { [v]: `t=${arrivalTime}` },
            },
          });
        } else if (arrivalTime >= disappear[v]) {
          steps.push({
            line: 9,
            explanation: `Cannot reach node ${v}: arrival ${arrivalTime} >= disappear[${v}]=${disappear[v]}. Node has disappeared.`,
            variables: { from: u, to: v, arrivalTime, disappear: disappear[v] },
            visualization: {
              type: 'array',
              array: dist.map(d => (d === INF ? 999 : d)),
              highlights: { [u]: 'active', [v]: 'mismatch' },
              labels: { [v]: 'gone!' },
            },
          });
        }
      }
    }

    const result = dist.map(d => (d === INF ? -1 : d));
    steps.push({
      line: 10,
      explanation: `Result: [${result.join(', ')}]. -1 means node is unreachable before it disappears.`,
      variables: { result: result.join(', ') },
      visualization: {
        type: 'array',
        array: result,
        highlights: Object.fromEntries(result.map((d, i) => [i, d === -1 ? 'mismatch' : 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default minimumTimeToVisitDisappearingNodes;
