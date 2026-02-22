import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const collectCoinsInTree: AlgorithmDefinition = {
  id: 'collect-coins-in-tree',
  title: 'Collect Coins in a Tree',
  leetcodeNumber: 2603,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a tree where each node has some coins, collect all coins using the minimum number of edges traversed. From any node you can collect coins within 2 hops. Strategy: (1) Trim all leaf nodes with 0 coins repeatedly (topological sort), (2) trim 2 more rounds, (3) answer is 2 * remaining edges.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Tree'],
  code: {
    pseudocode: `function collectTheCoins(coins, edges):
  n = len(coins)
  adj = build adjacency list
  degree = degree of each node
  // Round 1: trim 0-coin leaf nodes
  queue = leaf nodes (degree==1) with coins[i]==0
  while queue:
    node = queue.pop()
    for nb in adj[node]:
      degree[nb]--
      if degree[nb]==1 and coins[nb]==0: queue.add(nb)
    degree[node] = 0
  // Round 2: trim 2 more layers (regardless of coins)
  for _ in 0..1:
    queue = current leaf nodes (degree==1)
    for node in queue: degree[node]=0; decrement neighbors
  // Count remaining edges
  edges_left = count edges where both endpoints have degree>0
  return 2 * edges_left`,
    python: `def collectTheCoins(coins, edges):
    n=len(coins)
    adj=[set()for _ in range(n)]
    for u,v in edges: adj[u].add(v);adj[v].add(u)
    deg=[len(adj[i])for i in range(n)]
    # trim 0-coin leaves
    q=deque(i for i in range(n) if deg[i]==1 and coins[i]==0)
    while q:
        node=q.popleft(); deg[node]=0
        for nb in adj[node]:
            adj[nb].discard(node); deg[nb]-=1
            if deg[nb]==1 and coins[nb]==0: q.append(nb)
    # trim 2 more rounds
    for _ in range(2):
        q=deque(i for i in range(n) if deg[i]==1)
        for node in q:
            deg[node]=0
            for nb in adj[node]:
                adj[nb].discard(node); deg[nb]-=1
    return max(0, 2*(sum(1 for u,v in edges if deg[u]>0 and deg[v]>0)))`,
    javascript: `function collectTheCoins(coins, edges) {
  const n=coins.length;
  const adj=Array.from({length:n},()=>new Set());
  for(const[u,v]of edges){adj[u].add(v);adj[v].add(u);}
  const deg=adj.map(s=>s.size);
  let q=[];
  for(let i=0;i<n;i++)if(deg[i]===1&&!coins[i])q.push(i);
  while(q.length){
    const node=q.shift();deg[node]=0;
    for(const nb of adj[node]){adj[nb].delete(node);deg[nb]--;if(deg[nb]===1&&!coins[nb])q.push(nb);}
  }
  for(let r=0;r<2;r++){
    q=[...Array(n).keys()].filter(i=>deg[i]===1);
    for(const node of q){deg[node]=0;for(const nb of adj[node]){adj[nb].delete(node);deg[nb]--;}}
  }
  return Math.max(0,2*edges.filter(([u,v])=>deg[u]>0&&deg[v]>0).length);
}`,
    java: `public int collectTheCoins(int[] coins, int[][] edges) {
    int n=coins.length;
    Set<Integer>[]adj=new HashSet[n];
    for(int i=0;i<n;i++)adj[i]=new HashSet<>();
    for(int[]e:edges){adj[e[0]].add(e[1]);adj[e[1]].add(e[0]);}
    int[]deg=new int[n];for(int i=0;i<n;i++)deg[i]=adj[i].size();
    Queue<Integer>q=new LinkedList<>();
    for(int i=0;i<n;i++)if(deg[i]==1&&coins[i]==0)q.add(i);
    while(!q.isEmpty()){int node=q.poll();deg[node]=0;for(int nb:adj[node]){adj[nb].remove(node);deg[nb]--;if(deg[nb]==1&&coins[nb]==0)q.add(nb);}}
    for(int r=0;r<2;r++){q=new LinkedList<>();for(int i=0;i<n;i++)if(deg[i]==1)q.add(i);while(!q.isEmpty()){int node=q.poll();deg[node]=0;for(int nb:adj[node]){adj[nb].remove(node);deg[nb]--;}}}
    int res=0;for(int[]e:edges)if(deg[e[0]]>0&&deg[e[1]]>0)res++;
    return Math.max(0,2*res);
}`,
  },
  defaultInput: {
    coins: [1, 0, 0, 0, 0, 1],
    edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
  },
  inputFields: [
    {
      name: 'coins',
      label: 'Coins at Each Node',
      type: 'array',
      defaultValue: [1, 0, 0, 0, 0, 1],
      placeholder: '[1,0,0,0,0,1]',
      helperText: 'coins[i] = number of coins at node i',
    },
    {
      name: 'edges',
      label: 'Tree Edges [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
      placeholder: '[[0,1],[1,2],[2,3],[3,4],[4,5]]',
      helperText: 'Undirected tree edges',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const coins = input.coins as number[];
    const edgesInput = input.edges as number[][];
    const n = coins.length;
    const steps: AlgorithmStep[] = [];

    const adj: Set<number>[] = Array.from({ length: n }, () => new Set());
    for (const [u, v] of edgesInput) { adj[u].add(v); adj[v].add(u); }
    const deg = adj.map(s => s.size);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      phase: string,
      edgesLeft: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...deg],
        highlights,
        labels,
        auxData: {
          label: 'Collect Coins in Tree',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Degrees', value: deg.map((d, i) => `${i}:${d}`).join(' ') },
            { key: 'Edges Left', value: String(edgesLeft) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Tree with ${n} nodes. coins=[${coins.join(',')}]. Degrees: [${deg.join(', ')}].`,
      variables: { n, coins, deg: [...deg] },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:c${coins[i]}`])),
        'Init',
        edgesInput.length
      ),
    });

    // Round 1: trim zero-coin leaves
    const q: number[] = [];
    for (let i = 0; i < n; i++) if (deg[i] === 1 && coins[i] === 0) q.push(i);

    if (q.length > 0) {
      steps.push({
        line: 5,
        explanation: `Round 1: Trim 0-coin leaves: [${q.join(', ')}]. They can't contribute coins.`,
        variables: { leaves: [...q] },
        visualization: makeViz(
          Object.fromEntries(q.map(q => [q, 'visited'])),
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:c${coins[i]}`])),
          'Trim 0-coin leaves',
          edgesInput.length
        ),
      });

      const processed = [...q];
      while (q.length > 0) {
        const node = q.shift()!;
        deg[node] = 0;
        for (const nb of adj[node]) {
          adj[nb].delete(node);
          deg[nb]--;
          if (deg[nb] === 1 && coins[nb] === 0) q.push(nb);
        }
        adj[node].clear();
      }

      steps.push({
        line: 10,
        explanation: `After trimming 0-coin leaves. Remaining degrees: [${deg.join(', ')}].`,
        variables: { processed },
        visualization: makeViz(
          Object.fromEntries(processed.map(p => [p, 'visited'])),
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d${deg[i]}`])),
          'After Round 1',
          edgesInput.filter(([u, v]) => deg[u] > 0 && deg[v] > 0).length
        ),
      });
    }

    // Round 2: trim 2 more layers
    for (let round = 0; round < 2; round++) {
      const leaves: number[] = [];
      for (let i = 0; i < n; i++) if (deg[i] === 1) leaves.push(i);

      steps.push({
        line: 13,
        explanation: `Round ${round + 2}: Trim current leaf layer: [${leaves.join(', ')}]. This handles the 2-hop collection radius.`,
        variables: { round: round + 2, leaves },
        visualization: makeViz(
          Object.fromEntries(leaves.map(l => [l, 'comparing'])),
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:d${deg[i]}`])),
          `Trim Round ${round + 2}`,
          edgesInput.filter(([u, v]) => deg[u] > 0 && deg[v] > 0).length
        ),
      });

      for (const node of leaves) {
        deg[node] = 0;
        for (const nb of adj[node]) { adj[nb].delete(node); deg[nb]--; }
        adj[node].clear();
      }
    }

    const edgesLeft = edgesInput.filter(([u, v]) => deg[u] > 0 && deg[v] > 0).length;
    const result = Math.max(0, 2 * edgesLeft);

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = deg[i] > 0 ? 'found' : 'visited';

    steps.push({
      line: 18,
      explanation: `Remaining edges in core: ${edgesLeft}. Minimum edges to traverse: 2 * ${edgesLeft} = ${result}.`,
      variables: { edgesLeft, result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, deg[i] > 0 ? `n${i}` : 'trim'])),
        'Complete',
        edgesLeft
      ),
    });

    return steps;
  },
};

export default collectCoinsInTree;
