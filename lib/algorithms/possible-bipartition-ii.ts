import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const possibleBipartitionII: AlgorithmDefinition = {
  id: 'possible-bipartition-ii',
  title: 'Possible Bipartition II',
  leetcodeNumber: 886,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n people (1 to n) and a list of dislike pairs, determine if we can split everyone into two groups such that no two people who dislike each other are in the same group. This is equivalent to checking if the dislikes graph is bipartite.',
  tags: ['Graph', 'BFS', 'Bipartite', '2-Coloring'],
  code: {
    pseudocode: `function possibleBipartition(n, dislikes):
  build adjacency list from dislikes
  color = [-1] * (n+1)
  for i in 1..n:
    if color[i] != -1: continue
    queue = [i], color[i] = 0
    while queue not empty:
      node = queue.dequeue()
      for nb in adj[node]:
        if color[nb] == -1:
          color[nb] = 1 - color[node]; queue.push(nb)
        elif color[nb] == color[node]: return false
  return true`,
    python: `def possibleBipartition(n, dislikes):
    adj = defaultdict(list)
    for u, v in dislikes:
        adj[u].append(v); adj[v].append(u)
    color = [-1] * (n + 1)
    for i in range(1, n+1):
        if color[i] != -1: continue
        queue = deque([i])
        color[i] = 0
        while queue:
            node = queue.popleft()
            for nb in adj[node]:
                if color[nb] == -1:
                    color[nb] = 1 - color[node]
                    queue.append(nb)
                elif color[nb] == color[node]:
                    return False
    return True`,
    javascript: `function possibleBipartition(n, dislikes) {
  const adj = Array.from({length: n+1}, () => []);
  for (const [u, v] of dislikes) {
    adj[u].push(v); adj[v].push(u);
  }
  const color = new Array(n+1).fill(-1);
  for (let i = 1; i <= n; i++) {
    if (color[i] !== -1) continue;
    const q = [i]; color[i] = 0;
    while (q.length > 0) {
      const node = q.shift();
      for (const nb of adj[node]) {
        if (color[nb] === -1) { color[nb] = 1-color[node]; q.push(nb); }
        else if (color[nb] === color[node]) return false;
      }
    }
  }
  return true;
}`,
    java: `public boolean possibleBipartition(int n, int[][] dislikes) {
    List<Integer>[] adj = new List[n+1];
    for (int i=0;i<=n;i++) adj[i]=new ArrayList<>();
    for (int[] d:dislikes){adj[d[0]].add(d[1]);adj[d[1]].add(d[0]);}
    int[] color = new int[n+1]; Arrays.fill(color,-1);
    for (int i=1;i<=n;i++) {
        if (color[i]!=-1) continue;
        Queue<Integer> q=new LinkedList<>();
        q.offer(i); color[i]=0;
        while (!q.isEmpty()) {
            int node=q.poll();
            for (int nb:adj[node]) {
                if (color[nb]==-1){color[nb]=1-color[node];q.offer(nb);}
                else if (color[nb]==color[node]) return false;
            }
        }
    }
    return true;
}`,
  },
  defaultInput: {
    n: 4,
    dislikes: [[1,2],[1,3],[2,4]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of People',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'People are numbered 1 to n',
    },
    {
      name: 'dislikes',
      label: 'Dislikes [a, b]',
      type: 'array',
      defaultValue: [[1,2],[1,3],[2,4]],
      placeholder: '[[1,2],[1,3]]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const dislikes = input.dislikes as number[][];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [u, v] of dislikes) {
      adj[u].push(v);
      adj[v].push(u);
    }

    const color = new Array(n + 1).fill(-1);
    let bipartite = true;

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: color.slice(1),
        highlights,
        labels: Object.fromEntries(color.slice(1).map((c, i) => [i, `p${i+1}:${c === -1 ? 'none' : c === 0 ? 'G1' : 'G2'}`])),
        auxData: {
          label: 'Possible Bipartition',
          entries: [
            { key: 'Group 1', value: color.map((c, i) => c === 0 ? i : null).filter(x => x !== null && x > 0).join(', ') || 'empty' },
            { key: 'Group 2', value: color.map((c, i) => c === 1 ? i : null).filter(x => x !== null && x > 0).join(', ') || 'empty' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} people, ${dislikes.length} dislike pairs. Check if dislikes graph is bipartite (2-colorable).`,
      variables: { n, dislikesCount: dislikes.length },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])), 'Not started'),
    });

    outer: for (let i = 1; i <= n; i++) {
      if (color[i] !== -1) continue;
      const queue: number[] = [i];
      color[i] = 0;

      steps.push({
        line: 5,
        explanation: `Person ${i} uncolored. Start BFS. Assign Group 1.`,
        variables: { person: i },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: n }, (_, j) => [j, color[j+1] === -1 ? 'default' : color[j+1] === 0 ? 'active' : 'found'])),
          `BFS from person ${i}`
        ),
      });

      while (queue.length > 0) {
        const node = queue.shift()!;
        for (const nb of adj[node]) {
          if (color[nb] === -1) {
            color[nb] = 1 - color[node];
            queue.push(nb);
            steps.push({
              line: 10,
              explanation: `Person ${node} (G${color[node]+1}) dislikes ${nb}. Assign ${nb} to G${color[nb]+1}.`,
              variables: { node, nb, group: color[nb] + 1 },
              visualization: makeViz(
                Object.fromEntries(Array.from({ length: n }, (_, j) => [j, color[j+1] === -1 ? 'default' : color[j+1] === 0 ? 'active' : 'found'])),
                `Person ${nb} → Group ${color[nb]+1}`
              ),
            });
          } else if (color[nb] === color[node]) {
            bipartite = false;
            steps.push({
              line: 12,
              explanation: `Conflict! Person ${node} and ${nb} dislike each other but both in Group ${color[node]+1}. Impossible!`,
              variables: { node, nb, group: color[node]+1 },
              visualization: makeViz({ [node-1]: 'mismatch', [nb-1]: 'mismatch' }, 'CONFLICT — not bipartite'),
            });
            break outer;
          }
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = bipartite ? (color[i+1] === 0 ? 'active' : 'found') : 'mismatch';
    steps.push({
      line: 13,
      explanation: bipartite ? `Possible bipartition: Group1={${color.map((c,i)=>c===0?i:null).filter(x=>x!==null&&x>0).join(',')}}, Group2={${color.map((c,i)=>c===1?i:null).filter(x=>x!==null&&x>0).join(',')}}` : 'Not possible — conflict found.',
      variables: { result: bipartite },
      visualization: makeViz(finalH, `Result: ${bipartite}`),
    });

    return steps;
  },
};

export default possibleBipartitionII;
