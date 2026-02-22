import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const buildAMatrixWithConditions: AlgorithmDefinition = {
  id: 'build-a-matrix-with-conditions',
  title: 'Build a Matrix with Conditions',
  leetcodeNumber: 2392,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given k and row/column conditions specifying relative ordering of integers 1..k, build a k×k matrix where each integer appears exactly once, satisfying all ordering constraints. Use topological sort to determine the row order and column order of each integer, then place them in the matrix.',
  tags: ['Graph', 'Topological Sort', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function buildMatrix(k, rowConditions, colConditions):
  rowOrder = topoSort(k, rowConditions)
  colOrder = topoSort(k, colConditions)
  if either is empty (cycle): return []
  matrix = k x k zeros
  rowPos[v] = position of v in rowOrder
  colPos[v] = position of v in colOrder
  for v in 1..k:
    matrix[rowPos[v]][colPos[v]] = v
  return matrix`,
    python: `def buildMatrix(k, rowConditions, colConditions):
    def topoSort(k, conds):
        inDeg = [0]*(k+1)
        adj = [[] for _ in range(k+1)]
        for u,v in conds:
            adj[u].append(v); inDeg[v]+=1
        q = deque(i for i in range(1,k+1) if inDeg[i]==0)
        res = []
        while q:
            node=q.popleft(); res.append(node)
            for nb in adj[node]:
                inDeg[nb]-=1
                if inDeg[nb]==0: q.append(nb)
        return res if len(res)==k else []
    rowOrder = topoSort(k, rowConditions)
    colOrder = topoSort(k, colConditions)
    if not rowOrder or not colOrder: return []
    matrix = [[0]*k for _ in range(k)]
    rowPos = {v:i for i,v in enumerate(rowOrder)}
    colPos = {v:i for i,v in enumerate(colOrder)}
    for v in range(1,k+1):
        matrix[rowPos[v]][colPos[v]] = v
    return matrix`,
    javascript: `function buildMatrix(k, rowConditions, colConditions) {
  function topoSort(k, conds) {
    const inDeg=new Array(k+1).fill(0), adj=Array.from({length:k+1},()=>[]);
    for(const[u,v]of conds){adj[u].push(v);inDeg[v]++;}
    const q=[],res=[];
    for(let i=1;i<=k;i++)if(!inDeg[i])q.push(i);
    while(q.length){const n=q.shift();res.push(n);for(const nb of adj[n])if(!--inDeg[nb])q.push(nb);}
    return res.length===k?res:[];
  }
  const ro=topoSort(k,rowConditions),co=topoSort(k,colConditions);
  if(!ro.length||!co.length)return[];
  const mat=Array.from({length:k},()=>new Array(k).fill(0));
  const rp=new Map(ro.map((v,i)=>[v,i])),cp=new Map(co.map((v,i)=>[v,i]));
  for(let v=1;v<=k;v++)mat[rp.get(v)][cp.get(v)]=v;
  return mat;
}`,
    java: `public int[][] buildMatrix(int k, int[][] rowConditions, int[][] colConditions) {
    int[] ro=topo(k,rowConditions), co=topo(k,colConditions);
    if(ro==null||co==null) return new int[0][0];
    int[][] mat=new int[k][k];
    int[] rp=new int[k+1],cp=new int[k+1];
    for(int i=0;i<k;i++){rp[ro[i]]=i;cp[co[i]]=i;}
    for(int v=1;v<=k;v++) mat[rp[v]][cp[v]]=v;
    return mat;
}`,
  },
  defaultInput: {
    k: 3,
    rowConditions: [[1, 2], [3, 2]],
    colConditions: [[2, 1], [3, 2]],
  },
  inputFields: [
    {
      name: 'k',
      label: 'Matrix Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Build a k×k matrix with integers 1..k',
    },
    {
      name: 'rowConditions',
      label: 'Row Conditions [u, v]',
      type: 'array',
      defaultValue: [[1, 2], [3, 2]],
      placeholder: '[[1,2],[3,2]]',
      helperText: '[u,v] means u must appear in an earlier row than v',
    },
    {
      name: 'colConditions',
      label: 'Column Conditions [u, v]',
      type: 'array',
      defaultValue: [[2, 1], [3, 2]],
      placeholder: '[[2,1],[3,2]]',
      helperText: '[u,v] means u must appear in an earlier column than v',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const rowConditions = input.rowConditions as number[][];
    const colConditions = input.colConditions as number[][];
    const steps: AlgorithmStep[] = [];

    function topoSort(size: number, conds: number[][]): number[] {
      const inDeg = new Array(size + 1).fill(0);
      const adj: number[][] = Array.from({ length: size + 1 }, () => []);
      for (const [u, v] of conds) { adj[u].push(v); inDeg[v]++; }
      const q: number[] = [];
      for (let i = 1; i <= size; i++) if (inDeg[i] === 0) q.push(i);
      const res: number[] = [];
      while (q.length > 0) {
        const node = q.shift()!;
        res.push(node);
        for (const nb of adj[node]) { if (--inDeg[nb] === 0) q.push(nb); }
      }
      return res.length === size ? res : [];
    }

    function makeViz(
      highlights: Record<number, string>,
      labels: Record<number, string>,
      rowOrder: number[],
      colOrder: number[]
    ): ArrayVisualization {
      return {
        type: 'array',
        array: Array.from({ length: k }, (_, i) => i + 1),
        highlights,
        labels,
        auxData: {
          label: 'Matrix with Conditions',
          entries: [
            { key: 'Row Order', value: rowOrder.length > 0 ? rowOrder.join(' -> ') : 'pending' },
            { key: 'Col Order', value: colOrder.length > 0 ? colOrder.join(' -> ') : 'pending' },
            { key: 'Matrix Size', value: `${k}x${k}` },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Build ${k}x${k} matrix. Perform topological sort for row ordering using ${rowConditions.length} row conditions.`,
      variables: { k, rowConds: rowConditions.length, colConds: colConditions.length },
      visualization: makeViz({}, Object.fromEntries(Array.from({ length: k }, (_, i) => [i, `v${i + 1}`])), [], []),
    });

    const rowOrder = topoSort(k, rowConditions);

    steps.push({
      line: 2,
      explanation: `Row topological order: [${rowOrder.join(', ')}]. ${rowOrder.length === k ? 'Valid - no cycle.' : 'Cycle detected - return empty!'}`,
      variables: { rowOrder },
      visualization: makeViz(
        rowOrder.length === k
          ? Object.fromEntries(rowOrder.map((v, i) => [v - 1, 'active']))
          : Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'mismatch'])),
        Object.fromEntries(rowOrder.map((v, i) => [v - 1, `row${i}`])),
        [...rowOrder],
        []
      ),
    });

    if (rowOrder.length === 0) {
      steps.push({
        line: 3,
        explanation: 'Cycle in row conditions. Return empty matrix.',
        variables: { result: [] },
        visualization: makeViz(Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'mismatch'])), {}, [], []),
      });
      return steps;
    }

    const colOrder = topoSort(k, colConditions);

    steps.push({
      line: 3,
      explanation: `Column topological order: [${colOrder.join(', ')}]. ${colOrder.length === k ? 'Valid - no cycle.' : 'Cycle detected - return empty!'}`,
      variables: { colOrder },
      visualization: makeViz(
        colOrder.length === k
          ? Object.fromEntries(colOrder.map((v, i) => [v - 1, 'found']))
          : Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'mismatch'])),
        Object.fromEntries(colOrder.map((v, i) => [v - 1, `col${i}`])),
        [...rowOrder],
        [...colOrder]
      ),
    });

    if (colOrder.length === 0) return steps;

    const rowPos = new Map(rowOrder.map((v, i) => [v, i]));
    const colPos = new Map(colOrder.map((v, i) => [v, i]));

    for (let v = 1; v <= k; v++) {
      const r = rowPos.get(v)!;
      const c = colPos.get(v)!;
      steps.push({
        line: 8,
        explanation: `Place value ${v} at matrix[${r}][${c}] (row-pos=${r} from row order, col-pos=${c} from col order).`,
        variables: { v, row: r, col: c },
        visualization: makeViz(
          { [v - 1]: 'active' },
          Object.fromEntries(Array.from({ length: k }, (_, i) => [i, `v${i + 1}:[${rowPos.get(i + 1)},${colPos.get(i + 1)}]`])),
          [...rowOrder],
          [...colOrder]
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Matrix built successfully. Each value 1..${k} placed at its row/column intersection per topological orders.`,
      variables: { rowOrder, colOrder },
      visualization: makeViz(
        Object.fromEntries(Array.from({ length: k }, (_, i) => [i, 'found'])),
        Object.fromEntries(Array.from({ length: k }, (_, i) => [i, `v${i + 1}`])),
        [...rowOrder],
        [...colOrder]
      ),
    });

    return steps;
  },
};

export default buildAMatrixWithConditions;
