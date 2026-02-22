import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumCostToReachCityWithDiscounts: AlgorithmDefinition = {
  id: 'minimum-cost-to-reach-city-with-discounts',
  title: 'Minimum Cost to Reach City With Discounts',
  leetcodeNumber: 2093,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find minimum cost to travel from city 0 to city n-1 using at most k discounts. Each discount halves an edge cost. Uses Dijkstra with state (node, discountsUsed) as the state space. dist[node][d] = minimum cost to reach node using d discounts.',
  tags: ['graph', 'dijkstra', 'state space', 'shortest path', 'discounts'],

  code: {
    pseudocode: `function minimumCost(n, highways, discounts):
  graph = adjacency list
  dist[node][d] = INF, dist[0][0] = 0
  heap = [(0, 0, 0)] // cost, node, discountsUsed
  while heap not empty:
    cost, node, d = pop min
    if node == n-1: return cost
    if cost > dist[node][d]: continue
    // travel without discount
    for nb, w in graph[node]:
      if cost+w < dist[nb][d]:
        dist[nb][d] = cost+w; push
    // travel with discount
    if d < discounts:
      for nb, w in graph[node]:
        newCost = cost + w//2
        if newCost < dist[nb][d+1]:
          dist[nb][d+1] = newCost; push
  return -1`,

    python: `import heapq
def minimumCost(n, highways, discounts):
    INF = float('inf')
    graph = [[] for _ in range(n)]
    for u,v,w in highways:
        graph[u].append((v,w)); graph[v].append((u,w))
    dist = [[INF]*(discounts+1) for _ in range(n)]
    dist[0][0] = 0
    heap = [(0,0,0)]
    while heap:
        cost,node,d = heapq.heappop(heap)
        if node==n-1: return cost
        if cost>dist[node][d]: continue
        for nb,w in graph[node]:
            nc = cost+w
            if nc < dist[nb][d]: dist[nb][d]=nc; heapq.heappush(heap,(nc,nb,d))
            if d<discounts:
                nd=cost+w//2
                if nd<dist[nb][d+1]: dist[nb][d+1]=nd; heapq.heappush(heap,(nd,nb,d+1))
    return -1`,

    javascript: `function minimumCost(n, highways, discounts) {
  const INF = Infinity;
  const graph = Array.from({length:n},()=>[]);
  for (const [u,v,w] of highways) { graph[u].push([v,w]); graph[v].push([u,w]); }
  const dist = Array.from({length:n},()=>new Array(discounts+1).fill(INF));
  dist[0][0]=0;
  const heap=[[0,0,0]];
  while(heap.length) {
    heap.sort((a,b)=>a[0]-b[0]);
    const [cost,node,d]=heap.shift();
    if(node===n-1) return cost;
    if(cost>dist[node][d]) continue;
    for(const [nb,w] of graph[node]) {
      const nc=cost+w;
      if(nc<dist[nb][d]) { dist[nb][d]=nc; heap.push([nc,nb,d]); }
      if(d<discounts) {
        const nd=cost+Math.floor(w/2);
        if(nd<dist[nb][d+1]) { dist[nb][d+1]=nd; heap.push([nd,nb,d+1]); }
      }
    }
  }
  return -1;
}`,

    java: `public int minimumCost(int n, int[][] highways, int discounts) {
    List<int[]>[] graph = new List[n];
    for(int i=0;i<n;i++) graph[i]=new ArrayList<>();
    for(int[] h:highways){graph[h[0]].add(new int[]{h[1],h[2]});graph[h[1]].add(new int[]{h[0],h[2]});}
    int[][] dist=new int[n][discounts+1];
    for(int[] r:dist) Arrays.fill(r,Integer.MAX_VALUE);
    dist[0][0]=0;
    PriorityQueue<int[]> pq=new PriorityQueue<>((a,b)->a[0]-b[0]);
    pq.offer(new int[]{0,0,0});
    while(!pq.isEmpty()){
        int[] cur=pq.poll(); int cost=cur[0],node=cur[1],d=cur[2];
        if(node==n-1) return cost;
        if(cost>dist[node][d]) continue;
        for(int[] nb:graph[node]){
            if(cost+nb[1]<dist[nb[0]][d]){dist[nb[0]][d]=cost+nb[1];pq.offer(new int[]{dist[nb[0]][d],nb[0],d});}
            if(d<discounts&&cost+nb[1]/2<dist[nb[0]][d+1]){dist[nb[0]][d+1]=cost+nb[1]/2;pq.offer(new int[]{dist[nb[0]][d+1],nb[0],d+1});}
        }
    }
    return -1;
}`,
  },

  defaultInput: {
    n: 5,
    highways: [[0,1,4],[2,1,3],[1,4,11],[3,2,3],[3,4,2]],
    discounts: 1,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Total cities (0 to n-1)',
    },
    {
      name: 'discounts',
      label: 'Max Discounts',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of discount coupons available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const highways = input.highways as number[][];
    const discounts = input.discounts as number;
    const steps: AlgorithmStep[] = [];

    const INF = 100000;
    const graph: Array<Array<[number, number]>> = Array.from({ length: n }, () => []);
    for (const [u, v, w] of highways) {
      graph[u].push([v, w]);
      graph[v].push([u, w]);
    }

    const dist: number[][] = Array.from({ length: n }, () => new Array(discounts + 1).fill(INF));
    dist[0][0] = 0;
    const heap: Array<[number, number, number]> = [[0, 0, 0]];

    steps.push({
      line: 2,
      explanation: `Initialize state: dist[node][discountsUsed]. dist[0][0]=0. Using Dijkstra with state (cost, node, discountsUsed). Max discounts = ${discounts}.`,
      variables: { n, discounts, startCost: 0 },
      visualization: {
        type: 'array',
        array: dist.map(row => row[0]).map(d => (d === INF ? 999 : d)),
        highlights: { 0: 'active', [n - 1]: 'pointer' },
        labels: { 0: 'start', [n - 1]: 'dest' },
      },
    });

    let result = -1;
    let iterations = 0;
    while (heap.length > 0 && iterations < 25) {
      iterations++;
      heap.sort((a, b) => a[0] - b[0]);
      const [cost, node, d] = heap.shift()!;

      steps.push({
        line: 5,
        explanation: `Processing node ${node}, cost=${cost}, discountsUsed=${d}. Exploring neighbors.`,
        variables: { node, cost, discountsUsed: d },
        visualization: {
          type: 'array',
          array: dist.map(row => Math.min(...row)).map(v => (v === INF ? 999 : v)),
          highlights: { [node]: 'active', [n - 1]: 'pointer' },
          labels: { [node]: `d=${d}`, [n - 1]: 'dest' },
        },
      });

      if (node === n - 1) {
        result = cost;
        steps.push({
          line: 7,
          explanation: `Reached destination! Minimum cost = ${cost} using ${d} discounts.`,
          variables: { result: cost, discountsUsed: d },
          visualization: {
            type: 'array',
            array: dist.map(row => Math.min(...row)).map(v => (v === INF ? 999 : v)),
            highlights: { 0: 'found', [n - 1]: 'found' },
            labels: { 0: 'start', [n - 1]: `cost=${cost}` },
          },
        });
        break;
      }

      if (cost > dist[node][d]) continue;

      for (const [nb, w] of graph[node]) {
        // Without discount
        const nc = cost + w;
        if (nc < dist[nb][d]) {
          dist[nb][d] = nc;
          heap.push([nc, nb, d]);
          steps.push({
            line: 11,
            explanation: `No discount: ${node}->${nb} cost ${nc} (${cost}+${w}). Update dist[${nb}][${d}]=${nc}.`,
            variables: { from: node, to: nb, cost: nc, discountsUsed: d },
            visualization: {
              type: 'array',
              array: dist.map(row => Math.min(...row)).map(v => (v === INF ? 999 : v)),
              highlights: { [node]: 'active', [nb]: 'comparing' },
              labels: { [nb]: `=${nc}` },
            },
          });
        }
        // With discount
        if (d < discounts) {
          const dc = cost + Math.floor(w / 2);
          if (dc < dist[nb][d + 1]) {
            dist[nb][d + 1] = dc;
            heap.push([dc, nb, d + 1]);
            steps.push({
              line: 14,
              explanation: `With discount: ${node}->${nb} cost ${dc} (${cost}+${w}/2). Update dist[${nb}][${d + 1}]=${dc}.`,
              variables: { from: node, to: nb, discountCost: dc, discountsUsed: d + 1 },
              visualization: {
                type: 'array',
                array: dist.map(row => Math.min(...row)).map(v => (v === INF ? 999 : v)),
                highlights: { [node]: 'active', [nb]: 'found' },
                labels: { [nb]: `disc=${dc}` },
              },
            });
          }
        }
      }
    }

    if (result === -1) {
      steps.push({
        line: 15,
        explanation: 'No path found from city 0 to city n-1. Return -1.',
        variables: { result: -1 },
        visualization: {
          type: 'array',
          array: dist.map(row => Math.min(...row)).map(v => (v === INF ? 999 : v)),
          highlights: {},
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default minimumCostToReachCityWithDiscounts;
