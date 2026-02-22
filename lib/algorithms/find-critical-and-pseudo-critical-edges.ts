import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findCriticalAndPseudoCriticalEdges: AlgorithmDefinition = {
  id: 'find-critical-and-pseudo-critical-edges',
  title: 'Find Critical and Pseudo-Critical Edges in MST',
  leetcodeNumber: 1489,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Find all critical edges (removing increases MST weight) and pseudo-critical edges (can appear in some MST but not all) in the MST of an undirected graph. Uses brute-force: for each edge, check MST without it and with it forced.',
  tags: ['Graph', 'MST', 'Kruskal', 'Union-Find'],
  code: {
    pseudocode: `function findCriticalAndPseudoCriticalEdges(n, edges):
  originalMST = kruskal(n, edges)
  for each edge i:
    // Test critical: exclude edge i
    costWithout = kruskal(n, edges excluding i)
    if costWithout > originalMST: critical.add(i)
    else:
      // Test pseudo-critical: force edge i
      costWith = kruskal(n, edges with i forced)
      if costWith == originalMST: pseudoCritical.add(i)
  return [critical, pseudoCritical]`,
    python: `def findCriticalAndPseudoCriticalEdges(n, edges):
    m = len(edges)
    edges = [(w,u,v,i) for i,(u,v,w) in enumerate(edges)]
    edges.sort()
    def kruskal(skip=-1, forced=-1):
        parent = list(range(n))
        def find(x):
            while parent[x]!=x: parent[x]=parent[parent[x]]; x=parent[x]
            return x
        cost = 0
        cnt = 0
        if forced != -1:
            u,v,w = edges[forced][1],edges[forced][2],edges[forced][0]
            parent[find(u)]=find(v); cost+=w; cnt+=1
        for i,(w,u,v,_) in enumerate(edges):
            if i==skip: continue
            pu,pv=find(u),find(v)
            if pu!=pv: parent[pu]=pv; cost+=w; cnt+=1
        return cost if cnt==n-1 else float('inf')
    baseCost = kruskal()
    critical,pseudo=[],[]
    for i in range(m):
        if kruskal(skip=i) > baseCost: critical.append(edges[i][3])
        elif kruskal(forced=i) == baseCost: pseudo.append(edges[i][3])
    return [critical,pseudo]`,
    javascript: `function findCriticalAndPseudoCriticalEdges(n, edges) {
  const indexed = edges.map(([u,v,w],i) => [w,u,v,i]).sort((a,b)=>a[0]-b[0]);
  function kruskal(skip=-1, forced=-1) {
    const parent = Array.from({length:n},(_,i)=>i);
    function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];} return x; }
    let cost=0, cnt=0;
    if (forced!==-1) {
      const [w,u,v]=indexed[forced];
      parent[find(u)]=find(v); cost+=w; cnt++;
    }
    for (let i=0;i<indexed.length;i++) {
      if (i===skip) continue;
      const [w,u,v]=indexed[i];
      const pu=find(u),pv=find(v);
      if (pu!==pv){parent[pu]=pv;cost+=w;cnt++;}
    }
    return cnt===n-1?cost:Infinity;
  }
  const base=kruskal();
  const critical=[],pseudo=[];
  for (let i=0;i<indexed.length;i++) {
    if (kruskal(i)>base) critical.push(indexed[i][3]);
    else if (kruskal(-1,i)===base) pseudo.push(indexed[i][3]);
  }
  return [critical,pseudo];
}`,
    java: `// See Python/JS for full implementation
public int[][] findCriticalAndPseudoCriticalEdges(int n, int[][] edges) {
    int m = edges.length;
    int[][] e = new int[m][4];
    for (int i=0;i<m;i++) e[i]=new int[]{edges[i][2],edges[i][0],edges[i][1],i};
    Arrays.sort(e,(a,b)->a[0]-b[0]);
    int base=kruskal(n,e,-1,-1);
    List<Integer> crit=new ArrayList<>(),pseudo=new ArrayList<>();
    for (int i=0;i<m;i++) {
        if (kruskal(n,e,i,-1)>base) crit.add(e[i][3]);
        else if (kruskal(n,e,-1,i)==base) pseudo.add(e[i][3]);
    }
    return new int[][]{crit.stream().mapToInt(x->x).toArray(),
                       pseudo.stream().mapToInt(x->x).toArray()};
}`,
  },
  defaultInput: {
    n: 5,
    edges: [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Nodes',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
    },
    {
      name: 'edges',
      label: 'Edges [u, v, w]',
      type: 'array',
      defaultValue: [[0,1,1],[1,2,1],[2,3,2],[0,3,2],[0,4,3],[3,4,3],[1,4,6]],
      placeholder: '[[0,1,1],[1,2,1]]',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const edges = input.edges as number[][];
    const steps: AlgorithmStep[] = [];
    const m = edges.length;

    // Sort by weight, keep original index
    const indexed = edges.map(([u, v, w], i) => [w, u, v, i]).sort((a, b) => a[0] - b[0]);

    function kruskal(skip = -1, forced = -1): number {
      const parent = Array.from({ length: n }, (_, i) => i);
      function find(x: number): number {
        while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; }
        return x;
      }
      let cost = 0, cnt = 0;
      if (forced !== -1) {
        const [w, u, v] = indexed[forced];
        parent[find(u)] = find(v); cost += w; cnt++;
      }
      for (let i = 0; i < indexed.length; i++) {
        if (i === skip) continue;
        const [w, u, v] = indexed[i];
        const pu = find(u), pv = find(v);
        if (pu !== pv) { parent[pu] = pv; cost += w; cnt++; }
      }
      return cnt === n - 1 ? cost : Infinity;
    }

    const baseCost = kruskal();
    const critical: number[] = [];
    const pseudoCritical: number[] = [];

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: edges.map(e => e[2]),
        highlights,
        labels: Object.fromEntries(edges.map((e, i) => [i, `e${i}(${e[0]}-${e[1]}):w${e[2]}`])),
        auxData: {
          label: 'Critical/Pseudo-Critical Edges',
          entries: [
            { key: 'Base MST Cost', value: String(baseCost) },
            { key: 'Critical', value: critical.length > 0 ? critical.join(', ') : 'none' },
            { key: 'Pseudo-Critical', value: pseudoCritical.length > 0 ? pseudoCritical.join(', ') : 'none' },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Base MST cost = ${baseCost}. Testing each of ${m} edges for critical/pseudo-critical classification.`,
      variables: { n, m, baseCost },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: m }, (_, i) => [i, 'default'])),
        `Base MST = ${baseCost}`
      ),
    });

    for (let i = 0; i < indexed.length; i++) {
      const origIdx = indexed[i][3];
      const costWithout = kruskal(i, -1);
      const isCritical = costWithout > baseCost;

      if (isCritical) {
        critical.push(origIdx);
        steps.push({
          line: 4,
          explanation: `Edge ${origIdx} (${edges[origIdx][0]}-${edges[origIdx][1]}, w=${edges[origIdx][2]}): MST without it = ${costWithout === Infinity ? 'INF' : costWithout} > ${baseCost}. CRITICAL.`,
          variables: { edge: origIdx, costWithout, baseCost },
          visualization: makeViz({ [origIdx]: 'mismatch' }, `Edge ${origIdx} is CRITICAL`),
        });
      } else {
        const costWith = kruskal(-1, i);
        const isPseudo = costWith === baseCost;
        if (isPseudo) {
          pseudoCritical.push(origIdx);
          steps.push({
            line: 8,
            explanation: `Edge ${origIdx}: not critical. With it forced: cost=${costWith} == ${baseCost}. PSEUDO-CRITICAL.`,
            variables: { edge: origIdx, costWith, baseCost },
            visualization: makeViz({ [origIdx]: 'pointer' }, `Edge ${origIdx} is PSEUDO-CRITICAL`),
          });
        } else {
          steps.push({
            line: 8,
            explanation: `Edge ${origIdx}: not critical, not pseudo-critical (forced cost=${costWith} > ${baseCost}). Not in any MST.`,
            variables: { edge: origIdx, costWith },
            visualization: makeViz({ [origIdx]: 'visited' }, `Edge ${origIdx} is non-essential`),
          });
        }
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < m; i++) {
      if (critical.includes(i)) finalH[i] = 'mismatch';
      else if (pseudoCritical.includes(i)) finalH[i] = 'pointer';
      else finalH[i] = 'visited';
    }
    steps.push({
      line: 10,
      explanation: `Done. Critical edges: [${critical.join(', ')}]. Pseudo-critical: [${pseudoCritical.join(', ')}].`,
      variables: { critical, pseudoCritical },
      visualization: makeViz(finalH, 'Complete'),
    });

    return steps;
  },
};

export default findCriticalAndPseudoCriticalEdges;
