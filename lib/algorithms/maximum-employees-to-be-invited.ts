import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumEmployeesToBeInvited: AlgorithmDefinition = {
  id: 'maximum-employees-to-be-invited',
  title: 'Maximum Employees to Be Invited to a Meeting',
  leetcodeNumber: 2127,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Each employee i wants to sit next to favorite[i]. Arrange them around a circular table such that each employee sits next to their favorite. Find the maximum number of employees that can be invited. Use topological sort to find chain lengths into cycles, then handle cycles of length 2 (mutual favorites) vs longer cycles separately.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Cycle Detection'],
  code: {
    pseudocode: `function maximumInvitations(favorite):
  n = len(favorite)
  inDegree = [0]*n
  for f in favorite: inDegree[f]++
  // topo sort to find chain depths
  depth = [1]*n
  queue = nodes with inDegree 0
  while queue:
    node = queue.dequeue()
    nb = favorite[node]
    depth[nb] = max(depth[nb], depth[node]+1)
    inDegree[nb]--
    if inDegree[nb]==0: queue.add(nb)
  // remaining nodes are in cycles
  visited = set()
  ans1 = 0  // largest single cycle
  ans2 = 0  // sum of 2-cycles + their chains
  for i in range(n):
    if inDegree[i]>0 and i not in visited:
      cycle = trace cycle starting at i
      if len(cycle)==2: ans2 += depth[cycle[0]]+depth[cycle[1]]
      else: ans1 = max(ans1, len(cycle))
  return max(ans1, ans2)`,
    python: `def maximumInvitations(favorite):
    n = len(favorite)
    inDeg = [0]*n
    for f in favorite: inDeg[f]+=1
    depth = [1]*n
    q = deque(i for i in range(n) if inDeg[i]==0)
    while q:
        node=q.popleft(); nb=favorite[node]
        depth[nb]=max(depth[nb],depth[node]+1)
        inDeg[nb]-=1
        if inDeg[nb]==0: q.append(nb)
    visited=set(); ans1=ans2=0
    for i in range(n):
        if inDeg[i]>0 and i not in visited:
            cycle=[]; cur=i
            while cur not in visited:
                visited.add(cur); cycle.append(cur); cur=favorite[cur]
            if len(cycle)==2: ans2+=depth[cycle[0]]+depth[cycle[1]]
            else: ans1=max(ans1,len(cycle))
    return max(ans1,ans2)`,
    javascript: `function maximumInvitations(favorite) {
  const n=favorite.length, inDeg=new Array(n).fill(0);
  for(const f of favorite) inDeg[f]++;
  const depth=new Array(n).fill(1);
  const q=[];for(let i=0;i<n;i++)if(!inDeg[i])q.push(i);
  while(q.length){
    const node=q.shift(), nb=favorite[node];
    depth[nb]=Math.max(depth[nb],depth[node]+1);
    if(--inDeg[nb]===0)q.push(nb);
  }
  const visited=new Set();let ans1=0,ans2=0;
  for(let i=0;i<n;i++){
    if(inDeg[i]>0&&!visited.has(i)){
      const cycle=[];let cur=i;
      while(!visited.has(cur)){visited.add(cur);cycle.push(cur);cur=favorite[cur];}
      if(cycle.length===2)ans2+=depth[cycle[0]]+depth[cycle[1]];
      else ans1=Math.max(ans1,cycle.length);
    }
  }
  return Math.max(ans1,ans2);
}`,
    java: `public int maximumInvitations(int[] favorite) {
    int n=favorite.length; int[]inDeg=new int[n],depth=new int[n];
    Arrays.fill(depth,1);
    for(int f:favorite)inDeg[f]++;
    Queue<Integer>q=new LinkedList<>();
    for(int i=0;i<n;i++)if(inDeg[i]==0)q.add(i);
    while(!q.isEmpty()){
        int node=q.poll(),nb=favorite[node];
        depth[nb]=Math.max(depth[nb],depth[node]+1);
        if(--inDeg[nb]==0)q.add(nb);
    }
    Set<Integer>vis=new HashSet<>();int a1=0,a2=0;
    for(int i=0;i<n;i++){
        if(inDeg[i]>0&&!vis.contains(i)){
            List<Integer>cycle=new ArrayList<>();int cur=i;
            while(!vis.contains(cur)){vis.add(cur);cycle.add(cur);cur=favorite[cur];}
            if(cycle.size()==2)a2+=depth[cycle.get(0)]+depth[cycle.get(1)];
            else a1=Math.max(a1,cycle.size());
        }
    }
    return Math.max(a1,a2);
}`,
  },
  defaultInput: {
    favorite: [2, 2, 1, 2],
  },
  inputFields: [
    {
      name: 'favorite',
      label: 'Favorite Array',
      type: 'array',
      defaultValue: [2, 2, 1, 2],
      placeholder: '[2,2,1,2]',
      helperText: 'favorite[i] = employee i wants to sit next to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const favorite = input.favorite as number[];
    const n = favorite.length;
    const steps: AlgorithmStep[] = [];

    const inDegree = new Array(n).fill(0);
    for (const f of favorite) inDegree[f]++;

    const depth = new Array(n).fill(1);

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      queue: number[],
      ans: number
    ): ArrayVisualization {
      return {
        type: 'array',
        array: [...depth],
        highlights,
        labels,
        auxData: {
          label: 'Max Meeting Invitations',
          entries: [
            { key: 'Queue', value: queue.length > 0 ? queue.join(', ') : 'empty' },
            { key: 'In-Degrees', value: inDegree.join(', ') },
            { key: 'Best Answer', value: String(ans) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `n=${n} employees. favorite=[${favorite.join(',')}]. In-degrees: [${inDegree.join(', ')}].`,
      variables: { n, favorite, inDegree: [...inDegree] },
      visualization: makeViz(
        Object.fromEntries(inDegree.map((d, i) => [i, d === 0 ? 'active' : 'default'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}:d${inDegree[i]}`])),
        [],
        0
      ),
    });

    const queue: number[] = [];
    for (let i = 0; i < n; i++) if (inDegree[i] === 0) queue.push(i);

    steps.push({
      line: 7,
      explanation: `Leaf nodes (in-degree 0): [${queue.join(', ')}]. These are chain starts - not in any cycle.`,
      variables: { queue: [...queue] },
      visualization: makeViz(
        Object.fromEntries(queue.map(q => [q, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}:dep${depth[i]}`])),
        [...queue],
        0
      ),
    });

    while (queue.length > 0) {
      const node = queue.shift()!;
      const nb = favorite[node];
      if (depth[node] + 1 > depth[nb]) depth[nb] = depth[node] + 1;
      inDegree[nb]--;
      if (inDegree[nb] === 0) queue.push(nb);

      steps.push({
        line: 9,
        explanation: `Process e${node} -> e${nb}: depth[${nb}]=max(${depth[nb]}, ${depth[node]}+1)=${depth[nb]}. In-degree[${nb}]=${inDegree[nb]}.`,
        variables: { node, nb, depthNb: depth[nb] },
        visualization: makeViz(
          { [node]: 'found', [nb]: inDegree[nb] === 0 ? 'active' : 'comparing' },
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}:dep${depth[i]}`])),
          [...queue],
          0
        ),
      });
    }

    // Cycle detection
    const visited = new Set<number>();
    let ans1 = 0, ans2 = 0;

    for (let i = 0; i < n; i++) {
      if (inDegree[i] > 0 && !visited.has(i)) {
        const cycle: number[] = [];
        let cur = i;
        while (!visited.has(cur)) {
          visited.add(cur);
          cycle.push(cur);
          cur = favorite[cur];
        }

        const cycleHighlights: Record<number, string> = {};
        for (const c of cycle) cycleHighlights[c] = 'sorted';

        if (cycle.length === 2) {
          const contribution = depth[cycle[0]] + depth[cycle[1]];
          ans2 += contribution;
          steps.push({
            line: 20,
            explanation: `2-cycle found: [${cycle.join('<->')}]. With chains: depth[${cycle[0]}]+depth[${cycle[1]}]=${depth[cycle[0]]}+${depth[cycle[1]]}=${contribution}. ans2=${ans2}.`,
            variables: { cycle, contribution, ans2 },
            visualization: makeViz(cycleHighlights, Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}:dep${depth[i]}`])), [], Math.max(ans1, ans2)),
          });
        } else {
          ans1 = Math.max(ans1, cycle.length);
          steps.push({
            line: 21,
            explanation: `Cycle of length ${cycle.length}: [${cycle.join('->')}]. Update ans1=max(${ans1}, ${cycle.length})=${ans1}.`,
            variables: { cycle, length: cycle.length, ans1 },
            visualization: makeViz(cycleHighlights, Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}:dep${depth[i]}`])), [], Math.max(ans1, ans2)),
          });
        }
      }
    }

    const result = Math.max(ans1, ans2);
    steps.push({
      line: 22,
      explanation: `Answer: max(largest single cycle=${ans1}, sum of 2-cycles+chains=${ans2}) = ${result}.`,
      variables: { ans1, ans2, result },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'found'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `e${i}`])),
        [],
        result
      ),
    });

    return steps;
  },
};

export default maximumEmployeesToBeInvited;
