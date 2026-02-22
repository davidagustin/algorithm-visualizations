import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countVisitedNodesInDirectedGraph: AlgorithmDefinition = {
  id: 'count-visited-nodes-in-directed-graph',
  title: 'Count Visited Nodes in a Directed Graph',
  leetcodeNumber: 2876,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'In a directed graph where each node has exactly one outgoing edge (edges[i] = j), starting from each node, count how many distinct nodes are visited before revisiting a node (entering a cycle). Use topological sort to process non-cycle nodes and cycle detection to handle cycle nodes.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Cycle Detection'],
  code: {
    pseudocode: `function countVisitedNodes(edges):
  n = len(edges)
  inDegree = [0]*n
  for e in edges: inDegree[e]++
  // topo sort: leaf nodes first
  ans = [0]*n
  queue = nodes with inDegree 0
  while queue:
    node = queue.dequeue()
    nb = edges[node]
    ans[node] = ans[nb] + 1
    inDegree[nb]--
    if inDegree[nb]==0: queue.add(nb)
  // remaining nodes are in cycles
  visited = [false]*n
  for i in range(n):
    if not visited[i] and inDegree[i]>0:
      cycle = trace cycle
      for node in cycle: ans[node] = len(cycle)
      mark cycle nodes as visited
  return ans`,
    python: `def countVisitedNodes(edges):
    n=len(edges)
    inDeg=[0]*n
    for e in edges: inDeg[e]+=1
    ans=[0]*n
    q=deque(i for i in range(n) if inDeg[i]==0)
    while q:
        node=q.popleft(); nb=edges[node]
        ans[node]=ans[nb]+1
        inDeg[nb]-=1
        if inDeg[nb]==0: q.append(nb)
    visited=[False]*n
    for i in range(n):
        if not visited[i] and inDeg[i]>0:
            cycle=[]; cur=i
            while not visited[cur]:
                visited[cur]=True; cycle.append(cur); cur=edges[cur]
            for node in cycle: ans[node]=len(cycle)
    return ans`,
    javascript: `function countVisitedNodes(edges) {
  const n=edges.length, inDeg=new Array(n).fill(0);
  for(const e of edges) inDeg[e]++;
  const ans=new Array(n).fill(0);
  const q=[];for(let i=0;i<n;i++)if(!inDeg[i])q.push(i);
  while(q.length){
    const node=q.shift(), nb=edges[node];
    ans[node]=ans[nb]+1;
    if(--inDeg[nb]===0)q.push(nb);
  }
  const visited=new Array(n).fill(false);
  for(let i=0;i<n;i++){
    if(!visited[i]&&inDeg[i]>0){
      const cycle=[];let cur=i;
      while(!visited[cur]){visited[cur]=true;cycle.push(cur);cur=edges[cur];}
      for(const node of cycle)ans[node]=cycle.length;
    }
  }
  return ans;
}`,
    java: `public int[] countVisitedNodes(List<Integer> edges) {
    int n=edges.size(); int[]inDeg=new int[n],ans=new int[n];
    for(int e:edges)inDeg[e]++;
    Queue<Integer>q=new LinkedList<>();
    for(int i=0;i<n;i++)if(inDeg[i]==0)q.add(i);
    while(!q.isEmpty()){
        int node=q.poll(),nb=edges.get(node);
        ans[node]=ans[nb]+1;
        if(--inDeg[nb]==0)q.add(nb);
    }
    boolean[]vis=new boolean[n];
    for(int i=0;i<n;i++){
        if(!vis[i]&&inDeg[i]>0){
            List<Integer>cycle=new ArrayList<>();int cur=i;
            while(!vis[cur]){vis[cur]=true;cycle.add(cur);cur=edges.get(cur);}
            for(int node:cycle)ans[node]=cycle.size();
        }
    }
    return ans;
}`,
  },
  defaultInput: {
    edges: [1, 2, 0, 0],
  },
  inputFields: [
    {
      name: 'edges',
      label: 'Edges (functional graph)',
      type: 'array',
      defaultValue: [1, 2, 0, 0],
      placeholder: '[1,2,0,0]',
      helperText: 'edges[i] = the single node that node i points to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const edges = input.edges as number[];
    const n = edges.length;
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);
    for (const e of edges) inDegree[e]++;

    const ans = new Array(n).fill(0);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...ans],
        highlights,
        labels,
        auxData: {
          label: 'Count Visited Nodes',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'InDegrees', value: inDegree.join(', ') },
            { key: 'Answers', value: ans.map((a, i) => `${i}:${a}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Functional graph: each node has exactly 1 outgoing edge. edges=[${edges.join(',')}]. In-degrees: [${inDegree.join(', ')}].`,
      variables: { edges, inDegree: [...inDegree] },
      visualization: makeViz(
        Object.fromEntries(inDegree.map((d, i) => [i, d === 0 ? 'active' : 'default'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:in${inDegree[i]}`])),
        []
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

    steps.push({
      line: 7,
      explanation: `Leaf nodes (in-degree 0): [${queue.join(', ')}]. Process backwards from leaves to find chain lengths.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:ans${ans[i]}`])),
        [...queue]
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      const nb = edges[node];
      ans[node] = ans[nb] + 1;
      inDegree[nb]--;
      if (inDegree[nb] === 0) queue.push(nb);

      steps.push({
        line: 9,
        explanation: `Node ${node} -> ${nb}: ans[${node}] = ans[${nb}]+1 = ${ans[nb]}+1 = ${ans[node]}. In-degree[${nb}]=${inDegree[nb]}.`,
        variables: { node, nb, ans: ans[node] },
        visualization: makeViz(
          { [node]: 'found', [nb]: inDegree[nb] === 0 ? 'active' : 'comparing' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:ans${ans[i]}`])),
          [...queue]
        ),
      });
    }

    // Process cycle nodes
    const visited = new Array(n).fill(false);
    for (let i = 0; i < n; i++) {
      if (!visited[i] && inDegree[i] > 0) {
        const cycle: number[] = [];
        let cur = i;
        while (!visited[cur]) {
          visited[cur] = true;
          cycle.push(cur);
          cur = edges[cur];
        }
        for (const node of cycle) ans[node] = cycle.length;

        const cycleHighlights: Record<number, string> = {};
        for (const c of cycle) cycleHighlights[c] = 'sorted';

        steps.push({
          line: 17,
          explanation: `Cycle detected: [${cycle.join('->')}->]. Length=${cycle.length}. Each node in cycle visits all ${cycle.length} cycle nodes.`,
          variables: { cycle, length: cycle.length },
          visualization: makeViz(
            cycleHighlights,
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:ans${ans[i]}`])),
            []
          ),
        });
      }
    }

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'found';

    steps.push({
      line: 20,
      explanation: `Final answer: [${ans.join(', ')}]. Each value is the count of distinct nodes visited starting from that node.`,
      variables: { result: [...ans] },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `n${i}:${ans[i]}`])),
        []
      ),
    });

    return steps;
  },
};

export default countVisitedNodesInDirectedGraph;
