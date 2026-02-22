import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const snakesAndLadders: AlgorithmDefinition = {
  id: 'snakes-and-ladders',
  title: 'Snakes and Ladders',
  leetcodeNumber: 909,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given an n x n board with snakes and ladders (-1=no special), find the minimum number of dice rolls to reach square n². Number squares 1..n² in Boustrophedon order (left-right, right-left alternating from bottom). BFS on the square numbers.',
  tags: ['Graph', 'BFS', 'Matrix'],
  code: {
    pseudocode: `function snakesAndLadders(board):
  n = board.length
  flatten board into 1D (Boustrophedon)
  queue = deque([(1, 0)])  // (square, moves)
  visited = {1}
  while queue:
    square, moves = queue.popleft()
    for dice in 1..6:
      next = square + dice
      if next > n*n: break
      dest = board[next] if board[next] != -1 else next
      if dest == n*n: return moves + 1
      if dest not in visited:
        visited.add(dest)
        queue.append((dest, moves+1))
  return -1`,
    python: `def snakesAndLadders(board):
    n = len(board)
    flat = []
    for i, row in enumerate(reversed(board)):
        if i%2==0: flat.extend(row)
        else: flat.extend(reversed(row))
    queue = deque([(1, 0)])
    visited = {1}
    while queue:
        square, moves = queue.popleft()
        for dice in range(1, 7):
            nxt = square + dice
            if nxt > n*n: break
            dest = flat[nxt-1] if flat[nxt-1]!=-1 else nxt
            if dest == n*n: return moves+1
            if dest not in visited:
                visited.add(dest)
                queue.append((dest, moves+1))
    return -1`,
    javascript: `function snakesAndLadders(board) {
  const n=board.length;
  const flat=[];
  for(let i=0;i<n;i++){const row=board[n-1-i];flat.push(...(i%2===0?row:[...row].reverse()));}
  const queue=[[1,0]],visited=new Set([1]);
  while(queue.length){
    const[sq,moves]=queue.shift();
    for(let d=1;d<=6;d++){let nx=sq+d;if(nx>n*n)break;const dest=flat[nx-1]!==-1?flat[nx-1]:nx;if(dest===n*n)return moves+1;if(!visited.has(dest)){visited.add(dest);queue.push([dest,moves+1]);}}
  }
  return -1;
}`,
    java: `public int snakesAndLadders(int[][] board) {
    int n=board.length;int[]flat=new int[n*n];int idx=0;
    for(int i=0;i<n;i++){int r=n-1-i;if(i%2==0)for(int c=0;c<n;c++)flat[idx++]=board[r][c];else for(int c=n-1;c>=0;c--)flat[idx++]=board[r][c];}
    Queue<int[]>q=new LinkedList<>();q.add(new int[]{1,0});boolean[]vis=new boolean[n*n+1];vis[1]=true;
    while(!q.isEmpty()){int[]cur=q.poll();int sq=cur[0],moves=cur[1];for(int d=1;d<=6;d++){int nx=sq+d;if(nx>n*n)break;int dest=flat[nx-1]!=-1?flat[nx-1]:nx;if(dest==n*n)return moves+1;if(!vis[dest]){vis[dest]=true;q.add(new int[]{dest,moves+1});}}}
    return -1;
}`,
  },
  defaultInput: {
    board: [
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
      name: 'board',
      label: 'Board (-1=no snake/ladder, else=destination)',
      type: 'array',
      defaultValue: [
        [-1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1],
        [-1, -1, -1, -1, -1, -1],
        [-1, 35, -1, -1, 13, -1],
        [-1, -1, -1, -1, -1, -1],
        [-1, 15, -1, -1, -1, -1],
      ],
      placeholder: '[[-1,-1,-1],[-1,35,-1],[-1,15,-1]]',
      helperText: '-1=normal square, positive=snake/ladder destination',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = input.board as number[][];
    const n = board.length;
    const total = n * n;
    const steps: AlgorithmStep[] = [];

    // Flatten in Boustrophedon order
    const flat: number[] = [];
    for (let i = 0; i < n; i++) {
      const row = board[n - 1 - i];
      if (i % 2 === 0) flat.push(...row);
      else flat.push(...[...row].reverse());
    }

    const visited = new Set<number>([1]);
    const queue: [number, number][] = [[1, 0]];
    const distMap = new Array(total + 1).fill(-1);
    distMap[1] = 0;

    function makeViz(
      highlights: Record<number, string>,
      square: number,
      moves: number,
      result: number | null
    ): ArrayVisualization {
      const displayFlat = flat.map((v, i) => (v !== -1 ? v : i + 1));
      return {
        type: 'array',
        array: displayFlat,
        highlights,
        labels: Object.fromEntries(
          flat.map((v, i) => [i, v !== -1 ? `→${v}` : String(i + 1)])
        ),
        auxData: {
          label: 'Snakes & Ladders BFS',
          entries: [
            { key: 'Current square', value: String(square) },
            { key: 'Dice rolls', value: String(moves) },
            { key: 'Target', value: String(total) },
            { key: 'Visited', value: String(visited.size) },
            { key: 'Result', value: result !== null ? (result === -1 ? 'impossible' : String(result)) : '...' },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n}x${n} board = ${total} squares. Squares numbered 1..${total} in Boustrophedon order (zigzag from bottom). BFS to find min dice rolls from sq 1 to sq ${total}.`,
      variables: { n, total },
      visualization: makeViz({ 0: 'active', [total - 1]: 'pointer' }, 1, 0, null),
    });

    let maxIter = 0;
    while (queue.length > 0 && maxIter < 100) {
      maxIter++;
      const [sq, moves] = queue.shift()!;

      const hl: Record<number, string> = { [sq - 1]: 'current' };
      for (let i = 0; i < total; i++) {
        if (distMap[i + 1] >= 0 && i + 1 !== sq) hl[i] = 'visited';
      }

      steps.push({
        line: 7,
        explanation: `Process square ${sq} at ${moves} roll(s). Try dice 1-6.`,
        variables: { square: sq, moves },
        visualization: makeViz(hl, sq, moves, null),
      });

      for (let d = 1; d <= 6; d++) {
        let nx = sq + d;
        if (nx > total) break;
        const dest = flat[nx - 1] !== -1 ? flat[nx - 1] : nx;

        if (dest === total) {
          steps.push({
            line: 11,
            explanation: `Dice ${d}: square ${nx}${flat[nx - 1] !== -1 ? ` → snake/ladder to ${dest}` : ''} = TARGET! Reached in ${moves + 1} rolls.`,
            variables: { result: moves + 1 },
            visualization: makeViz({ [sq - 1]: 'active', [dest - 1]: 'found' }, dest, moves + 1, moves + 1),
          });
          return steps;
        }

        if (!visited.has(dest)) {
          visited.add(dest);
          distMap[dest] = moves + 1;
          queue.push([dest, moves + 1]);
          const hl2 = { ...hl, [dest - 1]: 'comparing' };
          steps.push({
            line: 13,
            explanation: `Dice ${d}: ${sq}+${d}=${nx}${flat[nx - 1] !== -1 ? `→${dest}(snake/ladder!)` : ''}. Enqueue sq ${dest} at ${moves + 1} rolls.`,
            variables: { nx, dest, moves: moves + 1 },
            visualization: makeViz(hl2, sq, moves, null),
          });
        }
      }
    }

    steps.push({
      line: 15,
      explanation: `Cannot reach square ${total}. Return -1.`,
      variables: { result: -1 },
      visualization: makeViz({}, 1, 0, -1),
    });

    return steps;
  },
};

export default snakesAndLadders;
