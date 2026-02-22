import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rankTransformOfMatrix: AlgorithmDefinition = {
  id: 'rank-transform-of-matrix',
  title: 'Rank Transform of a Matrix',
  leetcodeNumber: 1632,
  difficulty: 'Hard',
  category: 'Graph',
  description:
    'Given an m x n matrix, replace each element with its rank. Rank is determined by: equal elements in same row or column get same rank, rank starts at 1, and must be as small as possible while maintaining relative order. Use union find to group elements with equal values in same row/column, then assign ranks layer by layer from smallest value.',
  tags: ['union find', 'graph', 'sorting', 'matrix'],

  code: {
    pseudocode: `function matrixRankTransform(matrix):
  m, n = dimensions
  ans = zeros(m, n)
  rowRank = [0]*m, colRank = [0]*n
  // Group by value
  valueToPos = sort all (value, r, c) by value
  for each group of same value:
    init union-find for this group
    union cells in same row or column
    for each component:
      newRank = max(rowRank[r], colRank[c]) + 1 for all in component
      assign newRank to all cells in component
      update rowRank[r] and colRank[c]
  return ans`,

    python: `def matrixRankTransform(matrix):
    m, n = len(matrix), len(matrix[0])
    ans = [[0]*n for _ in range(m)]
    rowRank = [0]*m
    colRank = [0]*n
    from collections import defaultdict
    val_map = defaultdict(list)
    for r in range(m):
        for c in range(n):
            val_map[matrix[r][c]].append((r, c))
    parent = list(range(m + n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    for val in sorted(val_map):
        for r, c in val_map[val]:
            pr, pc = find(r), find(c + m)
            if pr != pc: parent[pr] = pc
        groups = defaultdict(list)
        for r, c in val_map[val]:
            groups[find(r)].append((r, c))
        for cells in groups.values():
            rank = max(max(rowRank[r], colRank[c]) for r, c in cells) + 1
            for r, c in cells:
                ans[r][c] = rowRank[r] = colRank[c] = rank
    return ans`,

    javascript: `function matrixRankTransform(matrix) {
  const m = matrix.length, n = matrix[0].length;
  const ans = Array.from({length:m}, ()=>new Array(n).fill(0));
  const rowRank = new Array(m).fill(0), colRank = new Array(n).fill(0);
  const valMap = new Map();
  for (let r = 0; r < m; r++)
    for (let c = 0; c < n; c++) {
      if (!valMap.has(matrix[r][c])) valMap.set(matrix[r][c], []);
      valMap.get(matrix[r][c]).push([r, c]);
    }
  const parent = Array.from({length: m+n}, (_,i)=>i);
  function find(x) { while(parent[x]!==x){parent[x]=parent[parent[x]];x=parent[x];}return x; }
  for (const val of [...valMap.keys()].sort((a,b)=>a-b)) {
    for (const [r,c] of valMap.get(val)) {
      const pr=find(r), pc=find(c+m);
      if(pr!==pc) parent[pr]=pc;
    }
    const groups = new Map();
    for (const [r,c] of valMap.get(val)) {
      const root=find(r);
      if(!groups.has(root)) groups.set(root,[]);
      groups.get(root).push([r,c]);
    }
    for (const cells of groups.values()) {
      const rank = Math.max(...cells.map(([r,c])=>Math.max(rowRank[r],colRank[c])))+1;
      for (const [r,c] of cells) ans[r][c]=rowRank[r]=colRank[c]=rank;
    }
  }
  return ans;
}`,

    java: `public int[][] matrixRankTransform(int[][] matrix) {
    int m = matrix.length, n = matrix[0].length;
    int[][] ans = new int[m][n];
    int[] rowRank = new int[m], colRank = new int[n];
    TreeMap<Integer, List<int[]>> map = new TreeMap<>();
    for (int r=0;r<m;r++) for(int c=0;c<n;c++)
        map.computeIfAbsent(matrix[r][c], k->new ArrayList<>()).add(new int[]{r,c});
    int[] parent = new int[m+n];
    for (int v : map.keySet()) {
        for (int i=0;i<m+n;i++) parent[i]=i;
        for (int[] p : map.get(v)) union(parent, p[0], p[1]+m);
        // ... group and assign ranks
    }
    return ans;
}`,
  },

  defaultInput: {
    matrix: [[1, 2], [3, 4]],
  },

  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'array',
      defaultValue: [[1, 2], [3, 4]],
      placeholder: '[[1,2],[3,4]]',
      helperText: 'A 2D matrix of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[][];
    const steps: AlgorithmStep[] = [];
    const m = matrix.length;
    const n = matrix[0].length;
    const ans: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const rowRank: number[] = new Array(m).fill(0);
    const colRank: number[] = new Array(n).fill(0);

    // Flatten matrix for visualization
    const flatMatrix = matrix.flat();

    steps.push({
      line: 1,
      explanation: `Matrix is ${m}x${n}. Group all cells by their value, then process from smallest to largest.`,
      variables: { m, n },
      visualization: {
        type: 'array',
        array: flatMatrix,
        highlights: {},
        labels: Object.fromEntries(flatMatrix.map((v, i) => [i, String(v)])),
      },
    });

    // Group by value
    const valMap: Map<number, Array<[number, number]>> = new Map();
    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        const v = matrix[r][c];
        if (!valMap.has(v)) valMap.set(v, []);
        valMap.get(v)!.push([r, c]);
      }
    }

    const sortedVals = [...valMap.keys()].sort((a, b) => a - b);

    steps.push({
      line: 5,
      explanation: `Unique values sorted: [${sortedVals.join(', ')}]. Process each value group with union-find.`,
      variables: { valueGroups: sortedVals.length },
      visualization: {
        type: 'array',
        array: flatMatrix,
        highlights: {},
        labels: { 0: `groups:${sortedVals.length}` },
      },
    });

    for (const val of sortedVals) {
      const cells = valMap.get(val)!;
      // Union-find using row index and (col + m) for column nodes
      const parent: number[] = Array.from({ length: m + n }, (_, i) => i);

      function find(x: number): number {
        while (parent[x] !== x) {
          parent[x] = parent[parent[x]];
          x = parent[x];
        }
        return x;
      }

      steps.push({
        line: 7,
        explanation: `Processing value ${val} at cells: ${cells.map(([r, c]) => `(${r},${c})`).join(', ')}.`,
        variables: { val, cellCount: cells.length },
        visualization: {
          type: 'array',
          array: flatMatrix,
          highlights: Object.fromEntries(cells.map(([r, c]) => [r * n + c, 'active'])),
          labels: Object.fromEntries(cells.map(([r, c]) => [r * n + c, `val:${val}`])),
        },
      });

      for (const [r, c] of cells) {
        const pr = find(r);
        const pc = find(c + m);
        if (pr !== pc) parent[pr] = pc;
      }

      // Group by component
      const groups: Map<number, Array<[number, number]>> = new Map();
      for (const [r, c] of cells) {
        const root = find(r);
        if (!groups.has(root)) groups.set(root, []);
        groups.get(root)!.push([r, c]);
      }

      for (const groupCells of groups.values()) {
        let rank = 0;
        for (const [r, c] of groupCells) {
          rank = Math.max(rank, rowRank[r], colRank[c]);
        }
        rank++;

        steps.push({
          line: 10,
          explanation: `Component for value ${val} has ${groupCells.length} cell(s). Max existing rank in row/col = ${rank - 1}. Assign rank ${rank}.`,
          variables: { val, rank, cells: groupCells.map(([r, c]) => `(${r},${c})`).join(',') },
          visualization: {
            type: 'array',
            array: flatMatrix,
            highlights: Object.fromEntries(groupCells.map(([r, c]) => [r * n + c, 'found'])),
            labels: Object.fromEntries(groupCells.map(([r, c]) => [r * n + c, `rank:${rank}`])),
          },
        });

        for (const [r, c] of groupCells) {
          ans[r][c] = rank;
          rowRank[r] = rank;
          colRank[c] = rank;
        }
      }
    }

    const flatAns = ans.flat();
    steps.push({
      line: 12,
      explanation: `Rank transform complete. Result matrix: [${ans.map(row => '[' + row.join(',') + ']').join(', ')}].`,
      variables: { result: JSON.stringify(ans) },
      visualization: {
        type: 'array',
        array: flatAns,
        highlights: Object.fromEntries(flatAns.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(flatAns.map((v, i) => [i, `r:${v}`])),
      },
    });

    return steps;
  },
};

export default rankTransformOfMatrix;
