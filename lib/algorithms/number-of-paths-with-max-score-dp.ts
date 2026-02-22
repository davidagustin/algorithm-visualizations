import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfPathsWithMaxScoreDp: AlgorithmDefinition = {
  id: 'number-of-paths-with-max-score-dp',
  title: 'Number of Paths with Max Score (DP)',
  leetcodeNumber: 1301,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a board with digits, S (start), E (end), and X (obstacles), find the maximum score of a path from S (bottom-right) to E (top-left) moving up, left, or diagonally. Also count the number of paths achieving that maximum. Use DP tracking both max score and path count simultaneously.',
  tags: ['dynamic programming', 'grid', 'counting', 'path', 'hard'],

  code: {
    pseudocode: `function pathsWithMaxScore(board):
  n = size of board
  dp[r][c] = [maxScore, pathCount]
  dp[n-1][n-1] = [0, 1]  (start = S)
  process cells from bottom-right to top-left
  for each cell moving up, left, diag-up-left:
    if not blocked: update dp[r][c] with max score + path count
  if dp[0][0].count == 0: return [0, 0]
  return [dp[0][0].score + board[0][0], dp[0][0].count % MOD]`,
    python: `def pathsWithMaxScore(board):
    n,MOD=len(board),10**9+7
    score=[[0]*n for _ in range(n)]
    cnt=[[0]*n for _ in range(n)]
    cnt[n-1][n-1]=1
    def update(r,c,ns,nc):
        if cnt[r][c]==0 or ns>score[r][c]: score[r][c]=ns; cnt[r][c]=nc%MOD
        elif ns==score[r][c]: cnt[r][c]=(cnt[r][c]+nc)%MOD
    for r in range(n-1,-1,-1):
        for c in range(n-1,-1,-1):
            if board[r][c] in ('X','S') and (r,c)!=(n-1,n-1): continue
            v=0 if board[r][c] in ('S','E') else int(board[r][c])
            if r+1<n and cnt[r+1][c]: update(r,c,score[r+1][c]+v,cnt[r+1][c])
            if c+1<n and cnt[r][c+1]: update(r,c,score[r][c+1]+v,cnt[r][c+1])
            if r+1<n and c+1<n and cnt[r+1][c+1]: update(r,c,score[r+1][c+1]+v,cnt[r+1][c+1])
    return [score[0][0],cnt[0][0]] if cnt[0][0] else [0,0]`,
    javascript: `function pathsWithMaxScore(board) {
  const n=board.length,MOD=1e9+7;
  const score=Array.from({length:n},()=>Array(n).fill(0));
  const cnt=Array.from({length:n},()=>Array(n).fill(0));
  cnt[n-1][n-1]=1;
  const update=(r,c,ns,nc)=>{
    if(!cnt[r][c]||ns>score[r][c]){score[r][c]=ns;cnt[r][c]=nc%MOD;}
    else if(ns===score[r][c]) cnt[r][c]=(cnt[r][c]+nc)%MOD;
  };
  for(let r=n-1;r>=0;r--) for(let c=n-1;c>=0;c--) {
    if(board[r][c]==='X'&&(r!==n-1||c!==n-1)) continue;
    const v=board[r][c]==='S'||board[r][c]==='E'?0:+board[r][c];
    if(r+1<n&&cnt[r+1][c]) update(r,c,score[r+1][c]+v,cnt[r+1][c]);
    if(c+1<n&&cnt[r][c+1]) update(r,c,score[r][c+1]+v,cnt[r][c+1]);
    if(r+1<n&&c+1<n&&cnt[r+1][c+1]) update(r,c,score[r+1][c+1]+v,cnt[r+1][c+1]);
  }
  return cnt[0][0]?[score[0][0],cnt[0][0]]:[0,0];
}`,
    java: `public int[] pathsWithMaxScore(List<String> board) {
    int n=board.size(),MOD=1_000_000_007;
    int[][] score=new int[n][n],cnt=new int[n][n];
    cnt[n-1][n-1]=1;
    for(int r=n-1;r>=0;r--) for(int c=n-1;c>=0;c--) {
        char ch=board.get(r).charAt(c);
        if(ch=='X'&&(r!=n-1||c!=n-1)) continue;
        int v=ch=='S'||ch=='E'?0:ch-'0';
        int[][] nbs={{r+1,c},{r,c+1},{r+1,c+1}};
        for(int[] nb:nbs) { int nr=nb[0],nc=nb[1]; if(nr<n&&nc<n&&cnt[nr][nc]>0) { int ns=score[nr][nc]+v; if(cnt[r][c]==0||ns>score[r][c]){score[r][c]=ns;cnt[r][c]=cnt[nr][nc]%MOD;} else if(ns==score[r][c]) cnt[r][c]=(cnt[r][c]+cnt[nr][nc])%MOD; } }
    }
    return cnt[0][0]>0?new int[]{score[0][0],cnt[0][0]}:new int[]{0,0};
}`,
  },

  defaultInput: {
    board: ['E23', '2X2', '12S'],
  },

  inputFields: [
    {
      name: 'board',
      label: 'Board (E=end/top-left, S=start/bottom-right, X=obstacle)',
      type: 'array',
      defaultValue: ['E23', '2X2', '12S'],
      placeholder: '["E23","2X2","12S"]',
      helperText: 'Array of strings forming the board grid',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const board = input.board as string[];
    const n = board.length;
    const MOD = 1e9 + 7;
    const steps: AlgorithmStep[] = [];

    const score: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    const cnt: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
    cnt[n - 1][n - 1] = 1;

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    const flatBoard = board.join('').split('').map(ch => ch === 'E' ? -2 : ch === 'S' ? -1 : ch === 'X' ? -3 : Number(ch));

    steps.push({
      line: 1,
      explanation: `Board ${n}x${n}. Find max score path from S (bottom-right) to E (top-left) moving up/left/diagonal. Count paths.`,
      variables: { n },
      visualization: makeViz(flatBoard, { [(n - 1) * n + (n - 1)]: 'active' }, { [(n - 1) * n + (n - 1)]: 'S' }),
    });

    const update = (r: number, c: number, ns: number, nc: number) => {
      if (!cnt[r][c] || ns > score[r][c]) { score[r][c] = ns; cnt[r][c] = nc % MOD; }
      else if (ns === score[r][c]) cnt[r][c] = (cnt[r][c] + nc) % MOD;
    };

    for (let r = n - 1; r >= 0; r--) {
      for (let c = n - 1; c >= 0; c--) {
        const ch = board[r][c];
        if (ch === 'X' && (r !== n - 1 || c !== n - 1)) continue;
        const v = ch === 'S' || ch === 'E' ? 0 : Number(ch);

        if (r + 1 < n && cnt[r + 1][c]) update(r, c, score[r + 1][c] + v, cnt[r + 1][c]);
        if (c + 1 < n && cnt[r][c + 1]) update(r, c, score[r][c + 1] + v, cnt[r][c + 1]);
        if (r + 1 < n && c + 1 < n && cnt[r + 1][c + 1]) update(r, c, score[r + 1][c + 1] + v, cnt[r + 1][c + 1]);

        if (cnt[r][c] > 0) {
          const hi: Record<number, string> = { [r * n + c]: 'active' };
          const lb: Record<number, string> = { [r * n + c]: `s:${score[r][c]},n:${cnt[r][c]}` };

          steps.push({
            line: 6,
            explanation: `Cell (${r},${c}) ch='${ch}': maxScore=${score[r][c]}, pathCount=${cnt[r][c]}`,
            variables: { r, c, char: ch, maxScore: score[r][c], pathCount: cnt[r][c] },
            visualization: makeViz(score.flat(), hi, lb),
          });
        }
      }
    }

    const finalScore = cnt[0][0] ? score[0][0] : 0;
    const finalCount = cnt[0][0] ? cnt[0][0] : 0;

    steps.push({
      line: 8,
      explanation: `Result: max score = ${finalScore}, number of paths = ${finalCount}`,
      variables: { maxScore: finalScore, pathCount: finalCount },
      visualization: makeViz(score.flat(), { 0: 'found' }, { 0: `s:${finalScore},c:${finalCount}` }),
    });

    return steps;
  },
};

export default numberOfPathsWithMaxScoreDp;
