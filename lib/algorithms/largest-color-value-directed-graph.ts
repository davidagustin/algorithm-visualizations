import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const largestColorValueDirectedGraph: AlgorithmDefinition = {
  id: 'largest-color-value-directed-graph',
  title: 'Largest Color Value in a Directed Graph',
  leetcodeNumber: 1857,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given a directed graph where each node has a color (a-z), find the largest number of nodes with the same color on any valid path. Use topological sort with DP: for each node, maintain a count array of colors seen on paths ending at that node. Propagate maximums through the DAG.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Dynamic Programming'],
  code: {
    pseudocode: `function largestPathValue(colors, edges):
  n = len(colors)
  inDegree = [0]*n; adj = adjacency list
  for u,v in edges: adj[u].add(v); inDegree[v]++
  dp = [[0]*26 for _ in range(n)]
  for i in 0..n-1: dp[i][color[i]] = 1
  queue = nodes with inDegree 0
  ans = 0; processed = 0
  while queue:
    node = queue.dequeue(); processed++
    ans = max(ans, max(dp[node]))
    for nb in adj[node]:
      for c in 0..25:
        extra = 1 if color[nb]==c else 0
        dp[nb][c] = max(dp[nb][c], dp[node][c]+extra)
      inDegree[nb]--
      if inDegree[nb]==0: queue.add(nb)
  return ans if processed==n else -1`,
    python: `def largestPathValue(colors, edges):
    n = len(colors)
    inDegree = [0]*n
    adj = [[] for _ in range(n)]
    for u,v in edges: adj[u].append(v); inDegree[v]+=1
    dp = [[0]*26 for _ in range(n)]
    for i in range(n): dp[i][ord(colors[i])-ord('a')] = 1
    q = deque(i for i in range(n) if inDegree[i]==0)
    ans = processed = 0
    while q:
        node = q.popleft(); processed += 1
        ans = max(ans, max(dp[node]))
        for nb in adj[node]:
            for c in range(26):
                extra = 1 if ord(colors[nb])-ord('a')==c else 0
                dp[nb][c] = max(dp[nb][c], dp[node][c]+extra)
            inDegree[nb] -= 1
            if inDegree[nb]==0: q.append(nb)
    return ans if processed==n else -1`,
    javascript: `function largestPathValue(colors, edges) {
  const n=colors.length, inDeg=new Array(n).fill(0);
  const adj=Array.from({length:n},()=>[]);
  for(const[u,v]of edges){adj[u].push(v);inDeg[v]++;}
  const dp=Array.from({length:n},()=>new Array(26).fill(0));
  for(let i=0;i<n;i++) dp[i][colors.charCodeAt(i)-97]=1;
  const q=[];for(let i=0;i<n;i++)if(!inDeg[i])q.push(i);
  let ans=0,proc=0;
  while(q.length){
    const node=q.shift();proc++;
    ans=Math.max(ans,...dp[node]);
    for(const nb of adj[node]){
      for(let c=0;c<26;c++){
        const ex=colors.charCodeAt(nb)-97===c?1:0;
        dp[nb][c]=Math.max(dp[nb][c],dp[node][c]+ex);
      }
      if(--inDeg[nb]===0)q.push(nb);
    }
  }
  return proc===n?ans:-1;
}`,
    java: `public int largestPathValue(String colors, int[][] edges) {
    int n=colors.length();int[]inDeg=new int[n];
    List<List<Integer>>adj=new ArrayList<>();
    for(int i=0;i<n;i++)adj.add(new ArrayList<>());
    for(int[]e:edges){adj.get(e[0]).add(e[1]);inDeg[e[1]]++;}
    int[][]dp=new int[n][26];
    for(int i=0;i<n;i++)dp[i][colors.charAt(i)-'a']=1;
    Queue<Integer>q=new LinkedList<>();
    for(int i=0;i<n;i++)if(inDeg[i]==0)q.add(i);
    int ans=0,proc=0;
    while(!q.isEmpty()){
        int node=q.poll();proc++;
        for(int c:dp[node])ans=Math.max(ans,c);
        for(int nb:adj.get(node)){
            for(int c=0;c<26;c++){
                int ex=colors.charAt(nb)-'a'==c?1:0;
                dp[nb][c]=Math.max(dp[nb][c],dp[node][c]+ex);
            }
            if(--inDeg[nb]==0)q.add(nb);
        }
    }
    return proc==n?ans:-1;
}`,
  },
  defaultInput: {
    colors: 'abaca',
    edges: [[0, 1], [0, 2], [2, 3], [3, 4]],
  },
  inputFields: [
    {
      name: 'colors',
      label: 'Node Colors (string)',
      type: 'string',
      defaultValue: 'abaca',
      placeholder: 'abaca',
      helperText: 'colors[i] is the color of node i (a-z)',
    },
    {
      name: 'edges',
      label: 'Directed Edges [u, v]',
      type: 'array',
      defaultValue: [[0, 1], [0, 2], [2, 3], [3, 4]],
      placeholder: '[[0,1],[0,2],[2,3],[3,4]]',
      helperText: 'Directed edges in the graph',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const colors = input.colors as string;
    const edges = input.edges as number[][];
    const n = colors.length;
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) { adj[u].push(v); inDegree[v]++; }

    // dp[i] = max count of each color on any path ending at i
    const dp: number[][] = Array.from({ length: n }, (_, i) => {
      const row = new Array(26).fill(0);
      row[colors.charCodeAt(i) - 97] = 1;
      return row;
    });

    // For visualization: show max color value per node
    function getMaxColor(node: number): number {
      return Math.max(...dp[node]);
    }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[],
      ans: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, i) => getMaxColor(i)),
        highlights,
        labels,
        auxData: {
          label: 'Largest Color Value (DAG DP)',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'Best Answer', value: String(ans) },
            { key: 'Colors', value: colors.split('').map((c, i) => `${i}:${c}`).join(' ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} nodes with colors "${colors}". Init dp[i][color[i]]=1. In-degrees: [${inDegree.join(', ')}].`,
      variables: { colors, inDegree: [...inDegree] },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${colors[i]}:1`])),
        [],
        0
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

    steps.push({
      line: 8,
      explanation: `Source nodes (in-degree 0): [${queue.join(', ')}]. Begin topological BFS.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${colors[i]}`])),
        [...queue],
        0
      ),
    });

    let ans = 0;
    let processed = 0;

    while (queue.length > 0) {
      const node = queue.shift()!;
      processed++;
      const nodeMax = getMaxColor(node);
      if (nodeMax > ans) ans = nodeMax;

      steps.push({
        line: 10,
        explanation: `Process node ${node} (color '${colors[node]}'). Max color count at this node: ${nodeMax}. Overall best: ${ans}.`,
        variables: { node, color: colors[node], maxAtNode: nodeMax, ans },
        visualization: makeViz(
          { [node]: 'found' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${colors[i]}:${getMaxColor(i)}`])),
          [...queue],
          ans
        ),
      });

      for (const nb of adj[node]) {
        for (let c = 0; c < 26; c++) {
          const extra = colors.charCodeAt(nb) - 97 === c ? 1 : 0;
          dp[nb][c] = Math.max(dp[nb][c], dp[node][c] + extra);
        }
        inDegree[nb]--;
        if (inDegree[nb] === 0) queue.push(nb);

        steps.push({
          line: 14,
          explanation: `Update dp[${nb}] from node ${node}. New max at node ${nb}: ${getMaxColor(nb)}. In-degree[${nb}]=${inDegree[nb]}.`,
          variables: { node, nb, newMax: getMaxColor(nb) },
          visualization: makeViz(
            { [node]: 'found', [nb]: inDegree[nb] === 0 ? 'active' : 'comparing' },
            Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${colors[i]}:${getMaxColor(i)}`])),
            [...queue],
            ans
          ),
        });
      }
    }

    const result = processed === n ? ans : -1;
    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = processed === n ? 'found' : 'mismatch';

    steps.push({
      line: 18,
      explanation: result === -1
        ? `Cycle detected! Not all nodes processed (${processed}/${n}). Return -1.`
        : `Largest color value on any path: ${result}. All ${n} nodes processed successfully.`,
      variables: { result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `${colors[i]}:${getMaxColor(i)}`])),
        [],
        ans
      ),
    });

    return steps;
  },
};

export default largestColorValueDirectedGraph;
