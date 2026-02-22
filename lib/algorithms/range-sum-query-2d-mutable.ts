import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rangeSumQuery2dMutable: AlgorithmDefinition = {
  id: 'range-sum-query-2d-mutable',
  title: 'Range Sum Query 2D Mutable',
  leetcodeNumber: 308,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Design a data structure for a 2D matrix that supports update operations and range sum queries. Use a 2D Binary Indexed Tree (Fenwick Tree) for O(log m * log n) updates and queries. Each query asks for the sum of a rectangular submatrix.',
  tags: ['Binary Indexed Tree', 'Segment Tree', 'Design', 'Matrix'],
  code: {
    pseudocode: `class NumMatrix:
  bit = 2D array of zeros
  matrix = copy of input

  update(row, col, val):
    diff = val - matrix[row][col]
    matrix[row][col] = val
    update BIT at (row+1, col+1) by diff

  sumRegion(r1,c1,r2,c2):
    return query(r2+1,c2+1) - query(r1,c2+1)
           - query(r2+1,c1) + query(r1,c1)`,
    python: `class NumMatrix:
    def __init__(self, matrix):
        m, n = len(matrix), len(matrix[0])
        self.m, self.n = m, n
        self.bit = [[0]*(n+1) for _ in range(m+1)]
        self.mat = [[0]*n for _ in range(m)]
        for i in range(m):
            for j in range(n):
                self.update(i, j, matrix[i][j])
    def update(self, row, col, val):
        diff = val - self.mat[row][col]
        self.mat[row][col] = val
        i = row + 1
        while i <= self.m:
            j = col + 1
            while j <= self.n:
                self.bit[i][j] += diff
                j += j & (-j)
            i += i & (-i)
    def query(self, row, col):
        s = 0
        i = row
        while i > 0:
            j = col
            while j > 0:
                s += self.bit[i][j]
                j -= j & (-j)
            i -= i & (-i)
        return s
    def sumRegion(self, r1, c1, r2, c2):
        return self.query(r2+1,c2+1)-self.query(r1,c2+1)-self.query(r2+1,c1)+self.query(r1,c1)`,
    javascript: `class NumMatrix {
  constructor(matrix) {
    this.m = matrix.length; this.n = matrix[0].length;
    this.bit = Array.from({length:this.m+1},()=>new Array(this.n+1).fill(0));
    this.mat = matrix.map(r=>[...r]);
    for (let i=0;i<this.m;i++) for (let j=0;j<this.n;j++) this._add(i+1,j+1,this.mat[i][j]);
  }
  _add(r,c,v) { for(let i=r;i<=this.m;i+=i&-i) for(let j=c;j<=this.n;j+=j&-j) this.bit[i][j]+=v; }
  _sum(r,c) { let s=0; for(let i=r;i>0;i-=i&-i) for(let j=c;j>0;j-=j&-j) s+=this.bit[i][j]; return s; }
  update(r,c,v) { this._add(r+1,c+1,v-this.mat[r][c]); this.mat[r][c]=v; }
  sumRegion(r1,c1,r2,c2) { return this._sum(r2+1,c2+1)-this._sum(r1,c2+1)-this._sum(r2+1,c1)+this._sum(r1,c1); }
}`,
    java: `class NumMatrix {
    int[][] bit, mat;
    int m, n;
    NumMatrix(int[][] matrix) {
        m=matrix.length; n=matrix[0].length;
        bit=new int[m+1][n+1]; mat=new int[m][n];
        for(int i=0;i<m;i++) for(int j=0;j<n;j++) update(i,j,matrix[i][j]);
    }
    void add(int r,int c,int v){for(int i=r;i<=m;i+=i&-i)for(int j=c;j<=n;j+=j&-j)bit[i][j]+=v;}
    int sum(int r,int c){int s=0;for(int i=r;i>0;i-=i&-i)for(int j=c;j>0;j-=j&-j)s+=bit[i][j];return s;}
    void update(int r,int c,int v){add(r+1,c+1,v-mat[r][c]);mat[r][c]=v;}
    int sumRegion(int r1,int c1,int r2,int c2){return sum(r2+1,c2+1)-sum(r1,c2+1)-sum(r2+1,c1)+sum(r1,c1);}
}`,
  },
  defaultInput: { matrix: [3, 0, 1, 4, 2, 5, 6, 3, 2, 1, 1, 5, 8, 7, 3, 2, 6, 4, 9, 8], queries: [0, 0, 1, 1, 1, 1, 2, 3] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix (flattened, 4x5)',
      type: 'array',
      defaultValue: [3, 0, 1, 4, 2, 5, 6, 3, 2, 1, 1, 5, 8, 7, 3, 2, 6, 4, 9, 8],
      placeholder: '3,0,1,4,2,...',
      helperText: 'Flattened 2D matrix (4 rows x 5 cols)',
    },
    {
      name: 'queries',
      label: 'Queries (r1,c1,r2,c2)',
      type: 'array',
      defaultValue: [0, 0, 1, 1, 1, 1, 2, 3],
      placeholder: '0,0,1,1,...',
      helperText: 'Range sum queries as flattened (r1,c1,r2,c2) groups',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matrix = input.matrix as number[];
    const queries = (input.queries as number[]) || [];
    const steps: AlgorithmStep[] = [];
    const cols = 5;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, lastSum: number): ArrayVisualization {
      return {
        type: 'array',
        array: [...matrix],
        highlights,
        labels,
        auxData: {
          label: 'Range Sum Query 2D (BIT)',
          entries: [
            { key: 'Matrix Cols', value: String(cols) },
            { key: 'Last Query Sum', value: String(lastSum) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Build a 2D Binary Indexed Tree from the matrix for O(log m * log n) range sum queries and point updates.',
      variables: { rows: Math.floor(matrix.length / cols), cols },
      visualization: makeViz({}, {}, 0),
    });

    const rows = Math.floor(matrix.length / cols);
    const h0: Record<number, string> = {};
    for (let i = 0; i < matrix.length; i++) h0[i] = 'visited';
    steps.push({
      line: 3,
      explanation: `Built BIT from ${rows}x${cols} matrix. Each cell contributes to O(log m * log n) BIT positions.`,
      variables: { rows, cols, totalCells: matrix.length },
      visualization: makeViz(h0, {}, 0),
    });

    let lastSum = 0;
    for (let q = 0; q < queries.length - 3; q += 4) {
      const r1 = queries[q], c1 = queries[q + 1], r2 = queries[q + 2], c2 = queries[q + 3];
      let sum = 0;
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          sum += matrix[r * cols + c];
        }
      }
      lastSum = sum;
      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      for (let r = r1; r <= r2; r++) {
        for (let c = c1; c <= c2; c++) {
          const idx = r * cols + c;
          h[idx] = 'found';
          l[idx] = String(matrix[idx]);
        }
      }
      steps.push({
        line: 9,
        explanation: `sumRegion(${r1},${c1},${r2},${c2}): Sum of submatrix rows ${r1}-${r2}, cols ${c1}-${c2} = ${sum}.`,
        variables: { r1, c1, r2, c2, sum },
        visualization: makeViz(h, l, sum),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < matrix.length; i++) finalH[i] = 'sorted';
    steps.push({
      line: 12,
      explanation: `All queries processed. 2D BIT supports O(log m * log n) updates and queries. Last sum = ${lastSum}.`,
      variables: { lastSum },
      visualization: makeViz(finalH, {}, lastSum),
    });

    return steps;
  },
};

export default rangeSumQuery2dMutable;
