import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const spiralMatrixLinkedList: AlgorithmDefinition = {
  id: 'spiral-matrix-linked-list',
  title: 'Spiral Matrix IV (from Linked List)',
  leetcodeNumber: 2326,
  difficulty: 'Medium',
  category: 'Linked List',
  description:
    'Fill an m x n matrix in spiral order using values from a linked list. Start at the top-left, move right, down, left, up (spiral pattern). When the list is exhausted, fill remaining cells with 0. Track direction changes using boundary variables.',
  tags: ['linked list', 'matrix', 'spiral', 'simulation'],

  code: {
    pseudocode: `function spiralMatrix(m, n, head):
  matrix = fill m x n with 0
  dirs = [(0,1),(1,0),(0,-1),(-1,0)]
  dirIdx = 0
  r = c = 0
  cur = head
  while cur != null:
    matrix[r][c] = cur.val
    cur = cur.next
    dr, dc = dirs[dirIdx]
    nr, nc = r+dr, c+dc
    if out of bounds or already filled:
      dirIdx = (dirIdx+1) % 4
      dr, dc = dirs[dirIdx]
      nr, nc = r+dr, c+dc
    r, c = nr, nc
  return matrix`,

    python: `def spiralMatrix(m, n, head):
    matrix = [[0] * n for _ in range(m)]
    dirs = [(0, 1), (1, 0), (0, -1), (-1, 0)]
    d = r = c = 0
    cur = head
    while cur:
        matrix[r][c] = cur.val
        cur = cur.next
        dr, dc = dirs[d]
        nr, nc = r + dr, c + dc
        if not (0 <= nr < m and 0 <= nc < n and matrix[nr][nc] == 0):
            d = (d + 1) % 4
            dr, dc = dirs[d]
            nr, nc = r + dr, c + dc
        r, c = nr, nc
    return matrix`,

    javascript: `function spiralMatrix(m, n, head) {
  const matrix = Array.from({length: m}, () => new Array(n).fill(0));
  const dirs = [[0,1],[1,0],[0,-1],[-1,0]];
  let d = 0, r = 0, c = 0, cur = head;
  while (cur) {
    matrix[r][c] = cur.val;
    cur = cur.next;
    const [dr, dc] = dirs[d];
    let [nr, nc] = [r + dr, c + dc];
    if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr][nc] !== 0) {
      d = (d + 1) % 4;
      [nr, nc] = [r + dirs[d][0], c + dirs[d][1]];
    }
    [r, c] = [nr, nc];
  }
  return matrix;
}`,

    java: `public int[][] spiralMatrix(int m, int n, ListNode head) {
    int[][] mat = new int[m][n];
    for (int[] row : mat) Arrays.fill(row, 0);
    int[][] dirs = {{0,1},{1,0},{0,-1},{-1,0}};
    int d = 0, r = 0, c = 0;
    while (head != null) {
        mat[r][c] = head.val;
        head = head.next;
        int nr = r + dirs[d][0], nc = c + dirs[d][1];
        if (nr < 0 || nr >= m || nc < 0 || nc >= n || mat[nr][nc] != 0)
            d = (d + 1) % 4;
        r += dirs[d][0]; c += dirs[d][1];
    }
    return mat;
}`,
  },

  defaultInput: {
    nums: [3, 2, 1, 6, 4, 5, 7, 8, 9],
    target: 3,
    k: 3,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Linked list values',
      type: 'array',
      defaultValue: [3, 2, 1, 6, 4, 5, 7, 8, 9],
      placeholder: '3,2,1,6,4,5,7,8,9',
      helperText: 'Values to fill into the spiral matrix',
    },
    {
      name: 'target',
      label: 'Rows (m)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of rows in the matrix',
    },
    {
      name: 'k',
      label: 'Columns (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of columns in the matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const m = input.target as number;
    const n = input.k as number;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Fill ${m}x${n} matrix in spiral order from linked list [${nums.join(' -> ')}]. Directions: right, down, left, up.`,
      variables: { m, n, listLength: nums.length },
      visualization: makeViz([...nums], {}, {}),
    });

    // Simulate spiral fill
    const matrix: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const dirNames = ['right', 'down', 'left', 'up'];
    let d = 0, r = 0, c = 0;
    const fillOrder: { r: number; c: number; val: number }[] = [];

    for (let i = 0; i < nums.length && i < m * n; i++) {
      matrix[r][c] = nums[i];
      fillOrder.push({ r, c, val: nums[i] });

      steps.push({
        line: 7,
        explanation: `Fill matrix[${r}][${c}] = ${nums[i]}. Moving ${dirNames[d]}.`,
        variables: { row: r, col: c, value: nums[i], direction: dirNames[d], step: i + 1 },
        visualization: makeViz(
          nums.slice(0, i + 1),
          Object.fromEntries(Array.from({ length: i + 1 }, (_, x) => [x, x === i ? 'active' : 'sorted'])),
          { [i]: `[${r},${c}]` }
        ),
      });

      const nr = r + dirs[d][0];
      const nc = c + dirs[d][1];
      if (nr < 0 || nr >= m || nc < 0 || nc >= n || matrix[nr][nc] !== 0) {
        d = (d + 1) % 4;
      }
      r += dirs[d][0];
      c += dirs[d][1];
    }

    steps.push({
      line: 14,
      explanation: `Spiral fill complete. Matrix filled with ${Math.min(nums.length, m * n)} values from linked list.`,
      variables: { filled: Math.min(nums.length, m * n), matrixSize: m * n },
      visualization: makeViz(
        nums.slice(0, m * n),
        Object.fromEntries(Array.from({ length: Math.min(nums.length, m * n) }, (_, i) => [i, 'found'])),
        { 0: 'first', [Math.min(nums.length, m * n) - 1]: 'last' }
      ),
    });

    return steps;
  },
};

export default spiralMatrixLinkedList;
