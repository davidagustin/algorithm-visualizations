import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const shortestPathWithAlternatingColorsIi: AlgorithmDefinition = {
  id: 'shortest-path-with-alternating-colors-ii',
  title: 'Shortest Path with Alternating Colors II',
  leetcodeNumber: 1129,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find shortest paths from node 0 to all nodes using alternating red and blue edges. BFS state tracks (node, lastColor). Start with both colors possible from node 0. On each step, only traverse an edge of the opposite color from the last used.',
  tags: ['graph', 'BFS', 'colored edges', 'alternating', 'state BFS'],

  code: {
    pseudocode: `function shortestAlternatingPaths(n, redEdges, blueEdges):
  build red graph and blue graph
  dist = array of -1, dist[0] = 0
  queue = [(0, RED), (0, BLUE)]  // start with either color
  visited = {(0, RED), (0, BLUE)}
  steps = 0
  while queue not empty:
    for each (node, color) at this level:
      nextColor = 1-color
      for each nb in graph[nextColor][node]:
        if (nb, nextColor) not visited:
          visited.add((nb, nextColor))
          if dist[nb] == -1: dist[nb] = steps+1
          enqueue (nb, nextColor)
    steps++
  return dist`,

    python: `from collections import deque
def shortestAlternatingPaths(n, redEdges, blueEdges):
    RED,BLUE=0,1
    graph=[[[],[]] for _ in range(n)]
    for u,v in redEdges: graph[u][RED].append(v)
    for u,v in blueEdges: graph[u][BLUE].append(v)
    dist=[-1]*n; dist[0]=0
    q=deque([(0,RED),(0,BLUE)])
    visited={(0,RED),(0,BLUE)}
    steps=0
    while q:
        for _ in range(len(q)):
            node,color=q.popleft()
            nc=1-color
            for nb in graph[node][nc]:
                if (nb,nc) not in visited:
                    visited.add((nb,nc))
                    if dist[nb]==-1: dist[nb]=steps+1
                    q.append((nb,nc))
        steps+=1
    return dist`,

    javascript: `function shortestAlternatingPaths(n, redEdges, blueEdges) {
  const graph=Array.from({length:n},()=>[[],[]]);
  for(const[u,v] of redEdges) graph[u][0].push(v);
  for(const[u,v] of blueEdges) graph[u][1].push(v);
  const dist=new Array(n).fill(-1); dist[0]=0;
  const q=[[0,0],[0,1]]; const vis=new Set(['0,0','0,1']);
  let qi=0, steps=0;
  while(qi<q.length) {
    const size=q.length-qi;
    for(let i=0;i<size;i++) {
      const[node,color]=q[qi++]; const nc=1-color;
      for(const nb of graph[node][nc]) {
        const key=nb+','+nc;
        if(!vis.has(key)){vis.add(key);if(dist[nb]===-1)dist[nb]=steps+1;q.push([nb,nc]);}
      }
    }
    steps++;
  }
  return dist;
}`,

    java: `public int[] shortestAlternatingPaths(int n, int[][] redEdges, int[][] blueEdges) {
    List<Integer>[][] graph=new List[n][2];
    for(int i=0;i<n;i++){graph[i][0]=new ArrayList<>();graph[i][1]=new ArrayList<>();}
    for(int[]e:redEdges) graph[e[0]][0].add(e[1]);
    for(int[]e:blueEdges) graph[e[0]][1].add(e[1]);
    int[] dist=new int[n]; Arrays.fill(dist,-1); dist[0]=0;
    Queue<int[]> q=new LinkedList<>(); q.offer(new int[]{0,0}); q.offer(new int[]{0,1});
    boolean[][]vis=new boolean[n][2]; vis[0][0]=vis[0][1]=true;
    int steps=0;
    while(!q.isEmpty()){
        for(int sz=q.size();sz>0;sz--){
            int[]cur=q.poll(); int node=cur[0],nc=1-cur[1];
            for(int nb:graph[node][nc]) if(!vis[nb][nc]){vis[nb][nc]=true;if(dist[nb]==-1)dist[nb]=steps+1;q.offer(new int[]{nb,nc});}
        }
        steps++;
    }
    return dist;
}`,
  },

  defaultInput: {
    n: 5,
    redEdges: [[0,1],[1,2],[2,3]],
    blueEdges: [[1,2],[2,3],[3,4]],
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Nodes numbered 0 to n-1',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const redEdges = input.redEdges as number[][];
    const blueEdges = input.blueEdges as number[][];
    const steps: AlgorithmStep[] = [];

    const RED = 0;
    const BLUE = 1;
    const graph: number[][][] = Array.from({ length: n }, () => [[], []]);
    for (const [u, v] of redEdges) graph[u][RED].push(v);
    for (const [u, v] of blueEdges) graph[u][BLUE].push(v);

    const dist = new Array(n).fill(-1);
    dist[0] = 0;
    const queue: Array<[number, number]> = [[0, RED], [0, BLUE]];
    const visited = new Set<string>(['0,0', '0,1']);
    let qi = 0;
    let bfsStep = 0;

    steps.push({
      line: 2,
      explanation: `Init: dist[0]=0. Enqueue (0, RED) and (0, BLUE) - node 0 can start with either color. n=${n}.`,
      variables: { redEdges: redEdges.length, blueEdges: blueEdges.length },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: { 0: 'active' },
        labels: { 0: 'src=0' },
      },
    });

    let iterations = 0;
    while (qi < queue.length && iterations < 30) {
      const levelSize = queue.length - qi;
      iterations++;

      steps.push({
        line: 7,
        explanation: `BFS level ${bfsStep}: Processing ${levelSize} state(s). Distances so far: [${dist.join(', ')}].`,
        variables: { level: bfsStep, statesInLevel: levelSize },
        visualization: {
          type: 'array',
          array: dist.map(d => (d === -1 ? -1 : d)),
          highlights: {},
          labels: { 0: 'src' },
        },
      });

      for (let i = 0; i < levelSize; i++) {
        const [node, color] = queue[qi++];
        const nextColor = 1 - color;
        const colorName = nextColor === RED ? 'RED' : 'BLUE';

        for (const nb of graph[node][nextColor]) {
          const key = `${nb},${nextColor}`;
          if (!visited.has(key)) {
            visited.add(key);
            if (dist[nb] === -1) {
              dist[nb] = bfsStep + 1;
            }
            queue.push([nb, nextColor]);
            steps.push({
              line: 10,
              explanation: `From (${node}, ${color === RED ? 'RED' : 'BLUE'}): traverse ${colorName} edge to ${nb}. dist[${nb}]=${dist[nb]}.`,
              variables: { from: node, to: nb, edgeColor: colorName, dist: dist[nb] },
              visualization: {
                type: 'array',
                array: dist.map(d => (d === -1 ? -1 : d)),
                highlights: { [node]: 'active', [nb]: 'comparing' },
                labels: { [nb]: `d=${dist[nb]}` },
              },
            });
          }
        }
      }

      bfsStep++;
    }

    steps.push({
      line: 14,
      explanation: `Result: [${dist.join(', ')}]. -1 means unreachable with alternating colors.`,
      variables: { result: dist.join(', ') },
      visualization: {
        type: 'array',
        array: dist.map(d => (d === -1 ? -1 : d)),
        highlights: Object.fromEntries(dist.map((d, i) => [i, d >= 0 ? 'found' : 'mismatch'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default shortestPathWithAlternatingColorsIi;
