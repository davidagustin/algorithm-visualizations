import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const snakesAndLaddersMatrix: AlgorithmDefinition = {
  id: 'snakes-and-ladders-matrix',
  title: 'Snakes and Ladders',
  leetcodeNumber: 909,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Find the minimum number of moves to reach the last cell on an n x n snakes and ladders board. The board is numbered in Boustrophedon style (alternating left-to-right, right-to-left from bottom row). Use BFS from cell 1.',
  tags: ['Matrix', 'BFS', 'Graph'],
  code: {
    pseudocode: `function snakesAndLadders(board):
  n = len(board)
  label(r,c) → 1D number using Boustrophedon order
  queue = [(1, 0)]  # (cell, moves)
  visited = {1}
  while queue:
    cell, moves = dequeue
    for dice in 1..6:
      next = cell + dice
      apply board[r][c] if != -1
      if next == n*n: return moves+1
      if next not visited: enqueue`,
    python: `def snakesAndLadders(board):
    n = len(board)
    def pos(s):
        q, r = divmod(s-1, n)
        row = n-1-q
        col = r if q%2==0 else n-1-r
        return row, col
    q = deque([(1,0)])
    seen = {1}
    while q:
        s, d = q.popleft()
        for i in range(1, 7):
            ns = s + i
            if ns > n*n: break
            r, c = pos(ns)
            if board[r][c] != -1: ns = board[r][c]
            if ns == n*n: return d+1
            if ns not in seen: seen.add(ns); q.append((ns,d+1))
    return -1`,
    javascript: `function snakesAndLadders(board) {
  const n=board.length;
  function pos(s) {
    const q=Math.floor((s-1)/n), r=(s-1)%n;
    const row=n-1-q, col=q%2===0?r:n-1-r;
    return [row,col];
  }
  const q=[[1,0]], seen=new Set([1]);
  while(q.length) {
    const [s,d]=q.shift();
    for(let i=1;i<=6;i++) {
      let ns=s+i;
      if(ns>n*n) break;
      const [r,c]=pos(ns);
      if(board[r][c]!==-1) ns=board[r][c];
      if(ns===n*n) return d+1;
      if(!seen.has(ns)){seen.add(ns);q.push([ns,d+1]);}
    }
  }
  return -1;
}`,
    java: `public int snakesAndLadders(int[][] board) {
    int n=board.length;
    int[] pos=new int[2];
    Queue<int[]> q=new LinkedList<>(); q.add(new int[]{1,0});
    boolean[] seen=new boolean[n*n+1]; seen[1]=true;
    while(!q.isEmpty()) {
        int[] curr=q.poll(); int s=curr[0], d=curr[1];
        for(int i=1;i<=6&&s+i<=n*n;i++) {
            int ns=s+i, qi=(ns-1)/n, ri=(ns-1)%n;
            int row=n-1-qi, col=qi%2==0?ri:n-1-ri;
            if(board[row][col]!=-1) ns=board[row][col];
            if(ns==n*n) return d+1;
            if(!seen[ns]){seen[ns]=true;q.add(new int[]{ns,d+1});}
        }
    }
    return -1;
}`,
  },
  defaultInput: {
    matrix: [
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 35, -1, -1, 13, -1],
      [-1, -1, -1, -1, -1, -1],
      [-1, 15, -1, -1, -1, -1],
    ],
  },
  inputFields: [
    {
      name: 'matrix',
      label: 'Board (-1=no snake/ladder)',
      type: 'string',
      defaultValue: '-1 -1 -1 -1 -1 -1, -1 -1 -1 -1 -1 -1, -1 -1 -1 -1 -1 -1, -1 35 -1 -1 13 -1, -1 -1 -1 -1 -1 -1, -1 15 -1 -1 -1 -1',
      placeholder: '6 rows of 6 values',
      helperText: 'Rows by commas. -1=normal, positive=destination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let board: number[][];
    if (Array.isArray(input.matrix) && Array.isArray((input.matrix as unknown[][])[0])) {
      board = input.matrix as number[][];
    } else {
      board = (input.matrix as string).split(',').map(row => row.trim().split(/\s+/).map(Number));
    }

    const n = board.length;
    const total = n * n;
    const steps: AlgorithmStep[] = [];

    function pos(s: number): [number, number] {
      const q = Math.floor((s - 1) / n), r = (s - 1) % n;
      const row = n - 1 - q;
      const col = q % 2 === 0 ? r : n - 1 - r;
      return [row, col];
    }

    // Flat board: index 0 = cell 1
    const flatBoard = Array.from({ length: total }, (_, k) => {
      const [row, col] = pos(k + 1);
      return board[row][col];
    });

    function makeViz(visited: Set<number>, curr: number, moves: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < total; i++) {
        labels[i] = flatBoard[i] !== -1 ? `${i + 1}→${flatBoard[i]}` : `${i + 1}`;
        highlights[i] = visited.has(i + 1) ? 'visited' : flatBoard[i] !== -1 ? 'sorted' : 'default';
      }
      if (curr > 0 && curr <= total) highlights[curr - 1] = 'active';
      return {
        type: 'array',
        array: flatBoard,
        highlights,
        labels,
        auxData: { label: 'Snakes & Ladders', entries: [{ key: 'Moves', value: `${moves}` }, { key: 'At cell', value: `${curr}` }] },
      };
    }

    const queue: [number, number][] = [[1, 0]];
    const seen = new Set<number>([1]);
    let result = -1;

    steps.push({
      line: 1,
      explanation: `BFS on ${n}x${n} snakes and ladders board. Start at cell 1, reach cell ${total}.`,
      variables: { n, total },
      visualization: makeViz(seen, 1, 0),
    });

    while (queue.length) {
      const [s, d] = queue.shift()!;
      for (let dice = 1; dice <= 6; dice++) {
        let ns = s + dice;
        if (ns > total) break;
        const [row, col] = pos(ns);
        if (board[row][col] !== -1) ns = board[row][col];
        steps.push({
          line: 9,
          explanation: `From cell ${s} (moves=${d}), dice=${dice} → cell ${s + dice}${board[pos(s + dice)[0]][pos(s + dice)[1]] !== -1 ? ` → teleport to ${ns}` : ''}. ${ns === total ? 'REACHED LAST CELL!' : ''}`,
          variables: { from: s, dice, to: ns, moves: d + 1 },
          visualization: makeViz(seen, ns, d + 1),
        });
        if (ns === total) { result = d + 1; queue.length = 0; break; }
        if (!seen.has(ns)) { seen.add(ns); queue.push([ns, d + 1]); }
      }
      if (result !== -1) break;
    }

    steps.push({
      line: 12,
      explanation: result !== -1 ? `Minimum moves to reach cell ${total}: ${result}.` : 'Cannot reach the last cell.',
      variables: { result },
      visualization: makeViz(seen, total, result),
    });

    return steps;
  },
};

export default snakesAndLaddersMatrix;
