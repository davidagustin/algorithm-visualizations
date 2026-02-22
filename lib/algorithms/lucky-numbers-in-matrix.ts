import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const luckyNumbersInMatrix: AlgorithmDefinition = {
  id: 'lucky-numbers-in-matrix',
  title: 'Lucky Numbers in a Matrix',
  leetcodeNumber: 1380,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'A lucky number in a matrix is the minimum of its row AND the maximum of its column. Find all lucky numbers. First compute row minimums and column maximums, then check which cells satisfy both conditions.',
  tags: ['Matrix', 'Array'],
  code: {
    pseudocode: `function luckyNumbers(matrix):
  rowMin = [min of each row]
  colMax = [max of each col]
  result = []
  for i,j: if matrix[i][j]==rowMin[i] and matrix[i][j]==colMax[j]:
    result.append(matrix[i][j])
  return result`,
    python: `def luckyNumbers(matrix):
    row_min = [min(row) for row in matrix]
    col_max = [max(col) for col in zip(*matrix)]
    return [matrix[i][j] for i in range(len(matrix))
            for j in range(len(matrix[0]))
            if matrix[i][j]==row_min[i] and matrix[i][j]==col_max[j]]`,
    javascript: `function luckyNumbers(matrix) {
  const m=matrix.length, n=matrix[0].length;
  const rowMin=matrix.map(row=>Math.min(...row));
  const colMax=Array.from({length:n},(_,j)=>Math.max(...matrix.map(r=>r[j])));
  const res=[];
  for(let i=0;i<m;i++) for(let j=0;j<n;j++)
    if(matrix[i][j]===rowMin[i]&&matrix[i][j]===colMax[j]) res.push(matrix[i][j]);
  return res;
}`,
    java: `public List<Integer> luckyNumbers(int[][] matrix) {
    int m=matrix.length, n=matrix[0].length;
    List<Integer> res=new ArrayList<>();
    for(int i=0;i<m;i++) {
        int minVal=matrix[i][0], mj=0;
        for(int j=1;j<n;j++) if(matrix[i][j]<minVal){minVal=matrix[i][j];mj=j;}
        boolean isColMax=true;
        for(int k=0;k<m;k++) if(matrix[k][mj]>minVal){isColMax=false;break;}
        if(isColMax) res.add(minVal);
    }
    return res;
}`,
  },
  defaultInput: { matrix: [[3, 7, 8], [9, 11, 13], [15, 16, 17]] },
  inputFields: [
    {
      name: 'matrix',
      label: 'Matrix',
      type: 'string',
      defaultValue: '3 7 8, 9 11 13, 15 16 17',
      placeholder: 'e.g. 3 7 8, 9 11 13, 15 16 17',
      helperText: 'Rows by commas, values by spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let matrix: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      matrix = input.matrix as number[][];
    } else {
      matrix = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const m = matrix.length, n = matrix[0].length;
    const steps: AlgorithmStep[] = [];
    const rowMin = matrix.map(row => Math.min(...row));
    const colMax = Array.from({ length: n }, (_, j) => Math.max(...matrix.map(r => r[j])));
    const lucky: number[] = [];

    function makeViz(highlights: Record<number, string>, note: string): ArrayVisualization {
      const flat = matrix.flat();
      const labels: Record<number, string> = {};
      for (let i = 0; i < m * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        const isMin = matrix[ri][ci] === rowMin[ri];
        const isMax = matrix[ri][ci] === colMax[ci];
        labels[i] = `${flat[i]}${isMin && isMax ? '*' : isMin ? 'm' : isMax ? 'M' : ''}`;
      }
      return {
        type: 'array',
        array: flat,
        highlights,
        labels,
        auxData: { label: 'Lucky Numbers', entries: [{ key: 'Phase', value: note }, { key: 'Lucky', value: lucky.join(', ') || 'none' }] },
      };
    }

    const initHl = Object.fromEntries(matrix.flat().map((_, i) => [i, 'default']));
    steps.push({
      line: 1,
      explanation: `Find lucky numbers in ${m}x${n} matrix. A lucky number is the minimum of its row AND maximum of its column.`,
      variables: { m, n, rowMin, colMax },
      visualization: makeViz(initHl, 'rowMin computed: ' + rowMin.join(', ')),
    });

    steps.push({
      line: 2,
      explanation: `Row minimums: [${rowMin.join(', ')}]. Column maximums: [${colMax.join(', ')}].`,
      variables: { rowMin, colMax },
      visualization: makeViz(
        Object.fromEntries(matrix.flat().map((v, i) => {
          const ri = Math.floor(i / n), ci = i % n;
          return [i, v === rowMin[ri] ? 'active' : v === colMax[ci] ? 'sorted' : 'default'];
        })),
        'Marked mins & maxes'
      ),
    });

    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        const idx = i * n + j;
        const val = matrix[i][j];
        const isMin = val === rowMin[i];
        const isMax = val === colMax[j];
        if (isMin && isMax) {
          lucky.push(val);
          steps.push({
            line: 5,
            explanation: `matrix[${i}][${j}]=${val} is min of row ${i} (${rowMin[i]}) and max of col ${j} (${colMax[j]}). Lucky number!`,
            variables: { i, j, val },
            visualization: makeViz(
              Object.fromEntries(matrix.flat().map((_, k) => [k, k === idx ? 'found' : 'default'])),
              `Lucky: ${val}`
            ),
          });
        }
      }
    }

    steps.push({
      line: 7,
      explanation: `Lucky numbers: [${lucky.join(', ') || 'none'}].`,
      variables: { lucky },
      visualization: makeViz(
        Object.fromEntries(matrix.flat().map((v, i) => [i, lucky.includes(v) && matrix[Math.floor(i / n)][i % n] === v ? 'found' : 'default'])),
        'Done'
      ),
    });

    return steps;
  },
};

export default luckyNumbersInMatrix;
