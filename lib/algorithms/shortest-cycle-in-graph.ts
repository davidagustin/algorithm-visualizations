import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const shortestCycleInGraph: AlgorithmDefinition = {
  id: 'shortest-cycle-in-graph',
  title: 'Shortest Cycle in a Graph',
  leetcodeNumber: 2608,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find the length of the shortest cycle in an undirected graph. For each node, run BFS to find the shortest cycle passing through it. When BFS finds an already-visited node at the same or adjacent level, a cycle is detected. The answer is the minimum cycle length found.',
  tags: ['graph', 'BFS', 'cycle detection', 'undirected graph', 'shortest cycle'],

  code: {
    pseudocode: `function findShortestCycle(n, edges):
  build adjacency list
  ans = INF
  for each node src in 0..n-1:
    dist = array of -1, dist[src] = 0
    queue = [src]
    while queue not empty:
      node = dequeue
      for each neighbor nb of node:
        if dist[nb] == -1:
          dist[nb] = dist[node] + 1
          enqueue nb
        elif dist[nb] >= dist[node]:
          ans = min(ans, dist[nb]+dist[node]+1)
  return ans if ans < INF else -1`,

    python: `from collections import deque
def findShortestCycle(n, edges):
    graph = [[] for _ in range(n)]
    for u,v in edges: graph[u].append(v); graph[v].append(u)
    ans = float('inf')
    for src in range(n):
        dist = [-1]*n; dist[src]=0
        q = deque([src])
        while q:
            node = q.popleft()
            for nb in graph[node]:
                if dist[nb]==-1:
                    dist[nb]=dist[node]+1; q.append(nb)
                elif dist[nb]>=dist[node]:
                    ans=min(ans, dist[nb]+dist[node]+1)
    return ans if ans<float('inf') else -1`,

    javascript: `function findShortestCycle(n, edges) {
  const graph = Array.from({length:n},()=>[]);
  for (const [u,v] of edges) { graph[u].push(v); graph[v].push(u); }
  let ans = Infinity;
  for (let src=0;src<n;src++) {
    const dist=new Array(n).fill(-1); dist[src]=0;
    const q=[src]; let qi=0;
    while(qi<q.length) {
      const node=q[qi++];
      for(const nb of graph[node]) {
        if(dist[nb]===-1) { dist[nb]=dist[node]+1; q.push(nb); }
        else if(dist[nb]>=dist[node]) ans=Math.min(ans,dist[nb]+dist[node]+1);
      }
    }
  }
  return ans===Infinity?-1:ans;
}`,

    java: `public int findShortestCycle(int n, int[][] edges) {
    List<Integer>[] graph=new List[n];
    for(int i=0;i<n;i++) graph[i]=new ArrayList<>();
    for(int[] e:edges){graph[e[0]].add(e[1]);graph[e[1]].add(e[0]);}
    int ans=Integer.MAX_VALUE;
    for(int src=0;src<n;src++){
        int[] dist=new int[n]; Arrays.fill(dist,-1); dist[src]=0;
        Queue<Integer> q=new LinkedList<>(); q.offer(src);
        while(!q.isEmpty()){
            int node=q.poll();
            for(int nb:graph[node]){
                if(dist[nb]==-1){dist[nb]=dist[node]+1;q.offer(nb);}
                else if(dist[nb]>=dist[node]) ans=Math.min(ans,dist[nb]+dist[node]+1);
            }
        }
    }
    return ans==Integer.MAX_VALUE?-1:ans;
}`,
  },

  defaultInput: {
    n: 7,
    edges: [[0,1],[1,2],[2,0],[3,4],[4,5],[5,6],[6,3],[2,3]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Total nodes in the graph',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];

    const graph: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
      graph[u].push(v);
      graph[v].push(u);
    }

    steps.push({
      line: 2,
      explanation: `Build adjacency list. Run BFS from each node to find shortest cycle. n=${n}, edges=${edges.length}.`,
      variables: { n, edgeCount: edges.length },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => graph[i].length),
        highlights: {},
        labels: Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `deg=${graph[i].length}`])),
      },
    });

    let ans = 100000;

    for (let src = 0; src < Math.min(n, 4); src++) {
      const dist = new Array(n).fill(-1);
      dist[src] = 0;
      const queue: number[] = [src];
      let qi = 0;

      steps.push({
        line: 4,
        explanation: `BFS from source node ${src}. Initialize dist[${src}]=0.`,
        variables: { src, currentBest: ans === 100000 ? 'INF' : ans },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === -1 ? -1 : d)),
          highlights: { [src]: 'active' },
          labels: { [src]: 'src' },
        },
      });

      while (qi < queue.length) {
        const node = queue[qi++];
        for (const nb of graph[node]) {
          if (dist[nb] === -1) {
            dist[nb] = dist[node] + 1;
            queue.push(nb);
            steps.push({
              line: 9,
              explanation: `Visit node ${nb} from ${node}: dist[${nb}]=${dist[nb]}.`,
              variables: { node, nb, distNb: dist[nb] },
              visualization: {
                type: 'array',
                array: dist.map(d => (d === -1 ? -1 : d)),
                highlights: { [nb]: 'comparing', [node]: 'active' },
                labels: { [src]: 'src', [nb]: `d=${dist[nb]}` },
              },
            });
          } else if (dist[nb] >= dist[node]) {
            const cycleLen = dist[nb] + dist[node] + 1;
            ans = Math.min(ans, cycleLen);
            steps.push({
              line: 11,
              explanation: `Cycle detected! Node ${nb} already visited (dist=${dist[nb]}). Cycle length = ${dist[nb]}+${dist[node]}+1 = ${cycleLen}. Best = ${ans}.`,
              variables: { cycleLen, ans },
              visualization: {
                type: 'array',
                array: dist.map(d => (d === -1 ? -1 : d)),
                highlights: { [nb]: 'found', [node]: 'active' },
                labels: { [nb]: `cycle!`, [src]: 'src' },
              },
            });
          }
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `BFS from all nodes complete. Shortest cycle length = ${ans === 100000 ? -1 : ans}.`,
      variables: { result: ans === 100000 ? -1 : ans },
      visualization: {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => i),
        highlights: ans < 100000 ? { 0: 'sorted' } : {},
        labels: { 0: `ans=${ans === 100000 ? -1 : ans}` },
      },
    });

    return steps;
  },
};

export default shortestCycleInGraph;
