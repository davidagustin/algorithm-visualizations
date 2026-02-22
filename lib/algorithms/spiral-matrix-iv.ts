import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const spiralMatrixIV: AlgorithmDefinition = {
  id: 'spiral-matrix-iv',
  title: 'Spiral Matrix IV',
  leetcodeNumber: 2326,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Fill an m x n matrix with values from a linked list in spiral order. Traverse the matrix in spiral order (right, down, left, up) and place linked list values. Any remaining cells are filled with -1. O(m*n) time and space.',
  tags: ['Simulation', 'Matrix', 'Linked List', 'Array'],
  code: {
    pseudocode: `function spiralMatrix(m, n, head):
  matrix = m x n matrix filled with -1
  dirs = [[0,1],[1,0],[0,-1],[-1,0]]
  r = c = di = 0
  while head:
    matrix[r][c] = head.val
    head = head.next
    nr = r + dirs[di][0]
    nc = c + dirs[di][1]
    if out of bounds or already filled:
      di = (di + 1) % 4
      nr = r + dirs[di][0]
      nc = c + dirs[di][1]
    r, c = nr, nc
  return matrix`,
    python: `def spiralMatrix(m, n, head):
    matrix = [[-1]*n for _ in range(m)]
    dirs = [(0,1),(1,0),(0,-1),(-1,0)]
    r = c = di = 0
    while head:
        matrix[r][c] = head.val
        head = head.next
        nr, nc = r+dirs[di][0], c+dirs[di][1]
        if not(0<=nr<m and 0<=nc<n and matrix[nr][nc]==-1):
            di = (di+1)%4
            nr, nc = r+dirs[di][0], c+dirs[di][1]
        r, c = nr, nc
    return matrix`,
    javascript: `function spiralMatrix(m, n, head) {
  const matrix = Array.from({length:m}, ()=>Array(n).fill(-1));
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  let r=0, c=0, di=0;
  while (head) {
    matrix[r][c] = head.val;
    head = head.next;
    let nr=r+dirs[di][0], nc=c+dirs[di][1];
    if (nr<0||nr>=m||nc<0||nc>=n||matrix[nr][nc]!==-1) {
      di=(di+1)%4;
      nr=r+dirs[di][0]; nc=c+dirs[di][1];
    }
    r=nr; c=nc;
  }
  return matrix;
}`,
    java: `public int[][] spiralMatrix(int m, int n, ListNode head) {
    int[][] matrix = new int[m][n];
    for (int[] row : matrix) Arrays.fill(row, -1);
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    int r=0, c=0, di=0;
    while (head != null) {
        matrix[r][c] = head.val;
        head = head.next;
        int nr=r+dirs[di][0], nc=c+dirs[di][1];
        if (nr<0||nr>=m||nc<0||nc>=n||matrix[nr][nc]!=-1) {
            di=(di+1)%4;
            nr=r+dirs[di][0]; nc=c+dirs[di][1];
        }
        r=nr; c=nc;
    }
    return matrix;
}`,
  },
  defaultInput: { m: 3, n: 5, listValues: [3, 0, 2, 6, 8, 1, 7, 9, 4, 2, 5, 5, 0] },
  inputFields: [
    {
      name: 'm',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows',
    },
    {
      name: 'n',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Number of columns',
    },
    {
      name: 'listValues',
      label: 'Linked List Values',
      type: 'array',
      defaultValue: [3, 0, 2, 6, 8, 1, 7, 9, 4, 2, 5, 5, 0],
      placeholder: '3,0,2,6,8,1,7,9,4,2,5,5,0',
      helperText: 'Values of linked list nodes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const m = input.m as number;
    const n = input.n as number;
    const listValues = input.listValues as number[];
    const steps: AlgorithmStep[] = [];

    // Flatten the matrix for visualization
    const matrix: number[] = new Array(m * n).fill(-1);
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const dirNames = ['Right', 'Down', 'Left', 'Up'];
    let r = 0, c = 0, di = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...matrix],
      highlights,
      labels,
      auxData: { label: 'Spiral Fill', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Fill ${m}x${n} matrix in spiral order with values [${listValues.join(',')}]. Flat matrix (row-major), -1 = unfilled.`,
      variables: { m, n, listLength: listValues.length },
      visualization: makeViz(
        {},
        Object.fromEntries(matrix.map((v, i) => [i, v === -1 ? '-1' : String(v)])),
        [{ key: 'Direction', value: dirNames[di] }, { key: 'Position', value: `(0,0)` }],
      ),
    });

    let listIdx = 0;
    while (listIdx < listValues.length) {
      const flatIdx = r * n + c;
      matrix[flatIdx] = listValues[listIdx];

      steps.push({
        line: 5,
        explanation: `Place value ${listValues[listIdx]} at (${r},${c}) [flat idx ${flatIdx}]. Moving ${dirNames[di]}.`,
        variables: { value: listValues[listIdx], row: r, col: c, direction: dirNames[di] },
        visualization: makeViz(
          { [flatIdx]: 'active' },
          Object.fromEntries(matrix.map((v, i) => [i, v === -1 ? '' : String(v)])),
          [{ key: 'Placed', value: String(listValues[listIdx]) }, { key: 'At', value: `(${r},${c})` }, { key: 'Direction', value: dirNames[di] }],
        ),
      });

      listIdx++;
      if (listIdx >= listValues.length) break;

      let nr = r + dirs[di][0];
      let nc = c + dirs[di][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr * n + nc] !== -1) {
        di = (di + 1) % 4;
        nr = r + dirs[di][0];
        nc = c + dirs[di][1];

        steps.push({
          line: 9,
          explanation: `Turning ${dirNames[di]}. Next position will be (${nr},${nc}).`,
          variables: { newDirection: dirNames[di], nextRow: nr, nextCol: nc },
          visualization: makeViz(
            { [flatIdx]: 'found' },
            Object.fromEntries(matrix.map((v, i) => [i, v === -1 ? '' : String(v)])),
            [{ key: 'Turn', value: dirNames[di] }, { key: 'Next', value: `(${nr},${nc})` }],
          ),
        });
      }
      r = nr; c = nc;
    }

    const filledCount = matrix.filter(v => v !== -1).length;
    steps.push({
      line: 14,
      explanation: `Done! Filled ${filledCount} cells in spiral order. Remaining ${m * n - filledCount} cells stay -1.`,
      variables: { filledCount, totalCells: m * n },
      visualization: makeViz(
        Object.fromEntries(matrix.map((v, i) => [i, v !== -1 ? 'found' : 'visited'])),
        Object.fromEntries(matrix.map((v, i) => [i, v === -1 ? '-1' : String(v)])),
        [{ key: 'Filled', value: String(filledCount) }, { key: 'Total', value: String(m * n) }],
      ),
    });

    return steps;
  },
};

export default spiralMatrixIV;
