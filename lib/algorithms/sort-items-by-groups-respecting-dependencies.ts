import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortItemsByGroupsRespectingDependencies: AlgorithmDefinition = {
  id: 'sort-items-by-groups-respecting-dependencies',
  title: 'Sort Items by Groups Respecting Dependencies',
  leetcodeNumber: 1203,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'There are n items, each belonging to a group. Items have dependencies (DAG). Sort items such that: (1) items within a group are contiguous, (2) dependencies are respected. Solve with two-level topological sort: first sort items within groups, then sort groups, then combine.',
  tags: ['Graph', 'Topological Sort', 'BFS'],
  code: {
    pseudocode: `function sortItems(n, m, group, beforeItems):
  assign unique group IDs to -1 groups
  build item graph and group graph
  topoSort items within each group
  topoSort groups
  result = []
  for each group in sorted group order:
    append items of that group in sorted item order
  return result (or [] if cycle)`,
    python: `def sortItems(n, m, group, beforeItems):
    # assign unique group to ungrouped items
    for i in range(n):
        if group[i] == -1: group[i] = m; m += 1
    # build graphs
    item_graph = [[] for _ in range(n)]
    item_in = [0]*n
    grp_graph = [set() for _ in range(m)]
    grp_in = [0]*m
    for i, preds in enumerate(beforeItems):
        for j in preds:
            item_graph[j].append(i); item_in[i]+=1
            if group[i]!=group[j] and i not in grp_graph[group[j]]:
                grp_graph[group[j]].add(group[i]); grp_in[group[i]]+=1
    def topo(nodes, graph, indeg):
        q=deque(x for x in nodes if indeg[x]==0)
        res=[]
        while q:
            v=q.popleft(); res.append(v)
            for u in graph[v]:
                indeg[u]-=1
                if indeg[u]==0: q.append(u)
        return res if len(res)==len(nodes) else []
    sorted_items = topo(range(n), item_graph, item_in)
    sorted_groups = topo(range(m), [list(s) for s in grp_graph], grp_in)
    if not sorted_items or not sorted_groups: return []
    grp_to_items = defaultdict(list)
    for item in sorted_items: grp_to_items[group[item]].append(item)
    return [item for g in sorted_groups for item in grp_to_items[g]]`,
    javascript: `function sortItems(n, m, group, beforeItems) {
  for (let i = 0; i < n; i++) if (group[i] === -1) { group[i] = m++; }
  const itemGraph = Array.from({length:n},()=>[]), itemIn = new Array(n).fill(0);
  const grpGraph = Array.from({length:m},()=>new Set()), grpIn = new Array(m).fill(0);
  for (let i = 0; i < n; i++)
    for (const j of beforeItems[i]) {
      itemGraph[j].push(i); itemIn[i]++;
      if (group[i]!==group[j] && !grpGraph[group[j]].has(group[i])) {
        grpGraph[group[j]].add(group[i]); grpIn[group[i]]++;
      }
    }
  const topo = (nodes, graph, indeg) => {
    const q=[...nodes].filter(x=>!indeg[x]), res=[];
    while(q.length){const v=q.shift();res.push(v);for(const u of graph[v])if(!--indeg[u])q.push(u);}
    return res.length===nodes.length?res:[];
  };
  const si=topo([...Array(n).keys()],itemGraph,itemIn);
  const sg=topo([...Array(m).keys()],grpGraph.map(s=>[...s]),grpIn);
  if(!si.length||!sg.length) return [];
  const gmap=new Map();for(const it of si){if(!gmap.has(group[it]))gmap.set(group[it],[]);gmap.get(group[it]).push(it);}
  return sg.flatMap(g=>gmap.get(g)||[]);
}`,
    java: `public int[] sortItems(int n, int m, int[] group, List<List<Integer>> beforeItems) {
    for (int i = 0; i < n; i++) if (group[i] == -1) group[i] = m++;
    List<List<Integer>> ig=new ArrayList<>(),gg=new ArrayList<>();
    int[] ii=new int[n],gi=new int[m];
    for(int i=0;i<n;i++){ig.add(new ArrayList<>());}
    for(int i=0;i<m;i++){gg.add(new ArrayList<>());}
    Set<Integer>[] seen=new HashSet[m];for(int i=0;i<m;i++)seen[i]=new HashSet<>();
    for(int i=0;i<n;i++)for(int j:beforeItems.get(i)){ig.get(j).add(i);ii[i]++;if(group[i]!=group[j]&&seen[group[j]].add(group[i])){gg.get(group[j]).add(group[i]);gi[group[i]]++;}}
    int[] si=topo(n,ig,ii),sg=topo(m,gg,gi);
    if(si==null||sg==null)return new int[0];
    Map<Integer,List<Integer>> gmap=new HashMap<>();
    for(int it:si)gmap.computeIfAbsent(group[it],k->new ArrayList<>()).add(it);
    List<Integer> res=new ArrayList<>();
    for(int g:sg)if(gmap.containsKey(g))res.addAll(gmap.get(g));
    return res.stream().mapToInt(x->x).toArray();
}`,
  },
  defaultInput: {
    n: 8,
    m: 2,
    group: [-1, -1, 1, 0, 0, 1, 0, -1],
    beforeItems: [[], [6], [5], [6], [3, 6], [], [], []],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Items',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Items labeled 0 to n-1',
    },
    {
      name: 'm',
      label: 'Number of Groups',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Groups labeled 0 to m-1 (-1 means no group)',
    },
    {
      name: 'group',
      label: 'Group Assignments',
      type: 'array',
      defaultValue: [-1, -1, 1, 0, 0, 1, 0, -1],
      placeholder: '[-1,-1,1,0,0,1,0,-1]',
      helperText: 'group[i] = group of item i (-1 = no group)',
    },
    {
      name: 'beforeItems',
      label: 'Before Items (dependencies)',
      type: 'array',
      defaultValue: [[], [6], [5], [6], [3, 6], [], [], []],
      placeholder: '[[],[6],[5],[6],[3,6],[],[],[]]',
      helperText: 'beforeItems[i] = list of items that must come before item i',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    let m = input.m as number;
    const group = [...(input.group as number[])];
    const beforeItems = input.beforeItems as number[][];
    const steps: AlgorithmStep[] = [];

    // Assign unique groups to ungrouped items
    for (let i = 0; i < n; i++) if (group[i] === -1) { group[i] = m++; }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      sortedItems: number[],
      phase: string
    ): ArrayVisualization {
      return {
        type: 'array',
        array: group.slice(0, n),
        highlights,
        labels,
        auxData: {
          label: 'Two-Level Topological Sort',
          entries: [
            { key: 'Phase', value: phase },
            { key: 'Sorted Items', value: sortedItems.length > 0 ? sortedItems.join(', ') : 'pending' },
            { key: 'Groups', value: [...new Set(group.slice(0, n))].sort((a,b)=>a-b).join(', ') },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Assign unique group IDs to ungrouped items (-1). Now m=${m} groups. Build item and group dependency graphs.`,
      variables: { n, m, group: [...group] },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `i${i}:g${group[i]}`])),
        [],
        'Build Graph'
      ),
    });

    // Build item graph
    const itemGraph: number[][] = Array.from({ length: n }, () => []);
    const itemIn = new Array(n).fill(0);
    const grpGraph: Set<number>[] = Array.from({ length: m }, () => new Set());
    const grpIn = new Array(m).fill(0);

    for (let i = 0; i < n; i++) {
      for (const j of beforeItems[i]) {
        itemGraph[j].push(i);
        itemIn[i]++;
        if (group[i] !== group[j] && !grpGraph[group[j]].has(group[i])) {
          grpGraph[group[j]].add(group[i]);
          grpIn[group[i]]++;
        }
      }
    }

    steps.push({
      line: 3,
      explanation: `Item in-degrees: [${itemIn.join(', ')}]. Group in-degrees: [${grpIn.slice(0, Math.min(m, 6)).join(', ')}...].`,
      variables: { itemInDegrees: [...itemIn] },
      visualization: makeViz(
        Object.fromEntries(itemIn.map((d, i) => [i, d === 0 ? 'active' : 'default'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `i${i}:d${itemIn[i]}`])),
        [],
        'Item Topo Sort'
      ),
    });

    // Topological sort of items
    const topoSort = (count: number, graph: number[][], indeg: number[]): number[] => {
      const q: number[] = [];
      for (let i = 0; i < count; i++) if (indeg[i] === 0) q.push(i);
      const res: number[] = [];
      while (q.length > 0) {
        const v = q.shift()!;
        res.push(v);
        for (const u of graph[v]) { if (--indeg[u] === 0) q.push(u); }
      }
      return res.length === count ? res : [];
    };

    const sortedItems = topoSort(n, itemGraph, [...itemIn]);

    steps.push({
      line: 5,
      explanation: `Topological order of items: [${sortedItems.join(', ')}]. ${sortedItems.length === n ? 'No cycle in item graph.' : 'Cycle detected!'}`,
      variables: { sortedItems },
      visualization: makeViz(
        Object.fromEntries(sortedItems.map((it, pos) => [it, pos < n / 2 ? 'active' : 'found'])),
        Object.fromEntries(sortedItems.map((it, pos) => [it, `${pos}`])),
        [...sortedItems],
        'Item Sort Done'
      ),
    });

    const grpAdjList = grpGraph.map(s => [...s]);
    const sortedGroups = topoSort(m, grpAdjList, [...grpIn]);

    steps.push({
      line: 6,
      explanation: `Topological order of groups: [${sortedGroups.join(', ')}]. ${sortedGroups.length === m ? 'No cycle in group graph.' : 'Cycle detected!'}`,
      variables: { sortedGroups },
      visualization: makeViz(
        {},
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, `g${group[i]}`])),
        [...sortedItems],
        'Group Sort Done'
      ),
    });

    if (sortedItems.length === 0 || sortedGroups.length === 0) {
      steps.push({
        line: 8,
        explanation: 'Cycle detected in item or group graph. Return empty array.',
        variables: { result: [] },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'mismatch'])),
          Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'cycle'])),
          [],
          'Cycle!'
        ),
      });
      return steps;
    }

    // Combine
    const grpToItems = new Map<number, number[]>();
    for (const it of sortedItems) {
      if (!grpToItems.has(group[it])) grpToItems.set(group[it], []);
      grpToItems.get(group[it])!.push(it);
    }
    const result = sortedGroups.flatMap(g => grpToItems.get(g) || []);

    const finalHighlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHighlights[i] = 'found';

    steps.push({
      line: 9,
      explanation: `Final sorted order: [${result.join(', ')}]. Items grouped contiguously, dependencies respected.`,
      variables: { result },
      visualization: makeViz(
        finalHighlights,
        Object.fromEntries(result.map((it, pos) => [it, `pos${pos}`])),
        [...result],
        'Complete'
      ),
    });

    return steps;
  },
};

export default sortItemsByGroupsRespectingDependencies;
