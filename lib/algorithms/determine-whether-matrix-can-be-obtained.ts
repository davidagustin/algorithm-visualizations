import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const determineWhetherMatrixCanBeObtained: AlgorithmDefinition = {
  id: 'determine-whether-matrix-can-be-obtained',
  title: 'Determine Whether Matrix Can Be Obtained By Rotation',
  leetcodeNumber: 1886,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given two n x n binary matrices mat and target, return true if target can be obtained from mat by rotating it 0, 90, 180, or 270 degrees clockwise. Try each rotation and compare.',
  tags: ['Matrix', 'Simulation', 'Rotation'],
  code: {
    pseudocode: `function findRotation(mat, target):
  for _ in range(4):
    if mat == target: return true
    mat = rotate90(mat)
  return false

function rotate90(mat):
  n = len(mat)
  transpose; reverse each row`,
    python: `def findRotation(mat, target):
    def rotate(m):
        n = len(m)
        for i in range(n):
            for j in range(i+1, n):
                m[i][j], m[j][i] = m[j][i], m[i][j]
        for row in m: row.reverse()
        return m
    for _ in range(4):
        if mat == target: return True
        mat = rotate(mat)
    return False`,
    javascript: `function findRotation(mat, target) {
  function rotate(m) {
    const n=m.length;
    for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) [m[i][j],m[j][i]]=[m[j][i],m[i][j]];
    m.forEach(r=>r.reverse());
    return m;
  }
  for(let i=0;i<4;i++) {
    if(JSON.stringify(mat)===JSON.stringify(target)) return true;
    mat=rotate(mat);
  }
  return false;
}`,
    java: `public boolean findRotation(int[][] mat, int[][] target) {
    for(int k=0;k<4;k++) {
        if(Arrays.deepEquals(mat,target)) return true;
        mat=rotate(mat);
    }
    return false;
}
int[][] rotate(int[][] m) {
    int n=m.length;
    for(int i=0;i<n;i++) for(int j=i+1;j<n;j++) { int t=m[i][j];m[i][j]=m[j][i];m[j][i]=t; }
    for(int[] r:m){int l=0,ri=r.length-1;while(l<ri){int t=r[l];r[l]=r[ri];r[ri]=t;l++;ri--;}}
    return m;
}`,
  },
  defaultInput: {
    matrixA: [[0, 1], [1, 0]],
    matrixB: [[1, 0], [0, 1]],
  },
  inputFields: [
    {
      name: 'matrixA',
      label: 'Source Matrix (mat)',
      type: 'string',
      defaultValue: '0 1, 1 0',
      placeholder: 'e.g. 0 1, 1 0',
      helperText: 'Square binary matrix, rows by commas',
    },
    {
      name: 'matrixB',
      label: 'Target Matrix',
      type: 'string',
      defaultValue: '1 0, 0 1',
      placeholder: 'e.g. 1 0, 0 1',
      helperText: 'Target binary matrix to match',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    function parseMatrix(val: unknown): number[][] {
      if (Array.isArray(val) && Array.isArray((val as unknown[][])[0])) return (val as number[][]).map(r => [...r]);
      return (val as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }
    let mat = parseMatrix(input.matrixA);
    const target = parseMatrix(input.matrixB);
    const n = mat.length;
    const steps: AlgorithmStep[] = [];

    function rotate(m: number[][]): number[][] {
      const copy = m.map(r => [...r]);
      for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) {
          [copy[i][j], copy[j][i]] = [copy[j][i], copy[i][j]];
        }
      copy.forEach(r => r.reverse());
      return copy;
    }

    function equal(a: number[][], b: number[][]): boolean {
      return a.every((row, i) => row.every((v, j) => v === b[i][j]));
    }

    function makeViz(current: number[][], deg: number, match: boolean): ArrayVisualization {
      const flatCurr = current.flat();
      const flatTarget = target.flat();
      const combined = [...flatCurr, ...flatTarget];
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n * n; i++) {
        const ri = Math.floor(i / n), ci = i % n;
        labels[i] = `${flatCurr[i]}`;
        labels[n * n + i] = `${flatTarget[i]}`;
        const same = flatCurr[i] === flatTarget[i];
        highlights[i] = same ? 'found' : 'mismatch';
        highlights[n * n + i] = same ? 'active' : 'comparing';
      }
      return {
        type: 'array',
        array: combined,
        highlights,
        labels,
        auxData: { label: 'Matrix Rotation', entries: [{ key: 'Rotation', value: `${deg}°` }, { key: 'Match', value: match ? 'YES' : 'No' }] },
      };
    }

    steps.push({
      line: 1,
      explanation: `Check if target can be obtained by rotating mat 0/90/180/270°. Try all four rotations.`,
      variables: { n },
      visualization: makeViz(mat, 0, equal(mat, target)),
    });

    let found = false;
    for (let deg = 0; deg < 4; deg++) {
      const match = equal(mat, target);
      steps.push({
        line: 2,
        explanation: `Rotation ${deg * 90}°: mat ${match ? 'EQUALS' : 'does not equal'} target.`,
        variables: { rotation: `${deg * 90}°`, match },
        visualization: makeViz(mat, deg * 90, match),
      });
      if (match) { found = true; break; }
      mat = rotate(mat);
    }

    steps.push({
      line: 5,
      explanation: found ? 'Target CAN be obtained by rotating mat.' : 'Target CANNOT be obtained by any rotation.',
      variables: { found },
      visualization: makeViz(mat, 0, found),
    });

    return steps;
  },
};

export default determineWhetherMatrixCanBeObtained;
