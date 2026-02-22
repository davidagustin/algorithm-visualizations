import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const strangePrinterDp: AlgorithmDefinition = {
  id: 'strange-printer-dp',
  title: 'Strange Printer (DP)',
  leetcodeNumber: 664,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'A strange printer can print a sequence of same characters in one turn, and can overwrite previous prints. Find minimum turns to print the string s. Uses interval DP: dp[i][j] = min turns to print s[i..j]. Key insight: if s[j] == s[k] for some k in [i,j), we can extend the print to cover both positions.',
  tags: ['dynamic programming', 'interval dp', 'string'],

  code: {
    pseudocode: `function strangePrinter(s):
  remove consecutive duplicates from s
  n = len(s)
  dp[i][j] = min turns to print s[i..j]
  for i from n-1 downto 0: dp[i][i] = 1
  for len from 2 to n:
    for i from 0 to n-len:
      j = i+len-1
      dp[i][j] = dp[i][j-1] + 1
      for k from i to j-1:
        if s[k] == s[j]:
          dp[i][j] = min(dp[i][j], dp[i][k] + dp[k+1][j-1])
  return dp[0][n-1]`,
    python: `def strangePrinter(s: str) -> int:
    # Remove consecutive duplicates
    t = []
    for c in s:
        if not t or t[-1] != c:
            t.append(c)
    s = ''.join(t)
    n = len(s)
    dp = [[0]*n for _ in range(n)]
    for i in range(n): dp[i][i] = 1
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i+length-1
            dp[i][j] = dp[i][j-1]+1
            for k in range(i, j):
                if s[k] == s[j]:
                    dp[i][j] = min(dp[i][j], dp[i][k] + (dp[k+1][j-1] if k+1<=j-1 else 0))
    return dp[0][n-1]`,
    javascript: `function strangePrinter(s) {
  s = [...s].filter((c,i)=>i===0||c!==s[i-1]).join('');
  const n = s.length;
  const dp = Array.from({length:n},()=>new Array(n).fill(0));
  for (let i=0;i<n;i++) dp[i][i]=1;
  for (let len=2;len<=n;len++)
    for (let i=0;i<=n-len;i++) {
      const j=i+len-1;
      dp[i][j]=dp[i][j-1]+1;
      for (let k=i;k<j;k++)
        if (s[k]===s[j])
          dp[i][j]=Math.min(dp[i][j],dp[i][k]+(k+1<=j-1?dp[k+1][j-1]:0));
    }
  return dp[0][n-1];
}`,
    java: `public int strangePrinter(String s) {
    StringBuilder sb = new StringBuilder();
    for (char c : s.toCharArray())
        if (sb.length()==0||sb.charAt(sb.length()-1)!=c) sb.append(c);
    s = sb.toString(); int n = s.length();
    int[][] dp = new int[n][n];
    for (int i=0;i<n;i++) dp[i][i]=1;
    for (int len=2;len<=n;len++)
        for (int i=0;i<=n-len;i++) {
            int j=i+len-1;
            dp[i][j]=dp[i][j-1]+1;
            for (int k=i;k<j;k++)
                if (s.charAt(k)==s.charAt(j))
                    dp[i][j]=Math.min(dp[i][j],dp[i][k]+(k+1<=j-1?dp[k+1][j-1]:0));
        }
    return dp[0][n-1];
}`,
  },

  defaultInput: {
    s: 'aaabbb',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aaabbb',
      placeholder: 'aaabbb',
      helperText: 'String to print',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sOrig = input.s as string;
    const steps: AlgorithmStep[] = [];

    // Remove consecutive duplicates
    const sArr: string[] = [];
    for (const c of sOrig) {
      if (!sArr.length || sArr[sArr.length - 1] !== c) sArr.push(c);
    }
    const s = sArr.join('');
    const n = s.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c: string) => c.charCodeAt(0) - 96),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Strange Printer: s="${sOrig}" -> deduplicated "${s}". dp[i][j] = min turns to print s[i..j].`,
      variables: { original: sOrig, deduped: s, n },
      visualization: makeViz({}, {}),
    });

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    for (let i = 0; i < n; i++) dp[i][i] = 1;

    steps.push({
      line: 4,
      explanation: `Base cases: dp[i][i]=1 for all i. Each single character requires exactly 1 print turn.`,
      variables: {},
      visualization: makeViz(
        Object.fromEntries(s.split('').map((_, i) => [i, 'active'])),
        Object.fromEntries(s.split('').map((c, i) => [i, `'${c}'=1`]))
      ),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = dp[i][j - 1] + 1;
        for (let k = i; k < j; k++) {
          if (s[k] === s[j]) {
            const val = dp[i][k] + (k + 1 <= j - 1 ? dp[k + 1][j - 1] : 0);
            if (val < dp[i][j]) dp[i][j] = val;
          }
        }

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        for (let idx = i; idx <= j; idx++) highlights[idx] = 'comparing';
        highlights[i] = 'active';
        highlights[j] = 'active';
        labels[i] = 'i';
        labels[j] = 'j';

        if (len <= 3 || (i === 0 && j === n - 1)) {
          steps.push({
            line: 9,
            explanation: `dp[${i}][${j}]=${dp[i][j]}. Min turns to print "${s.slice(i, j + 1)}". ${s[i] === s[j] ? `s[${i}]==s[${j}]="${s[i]}" saves a turn!` : `s[${i}]!=s[${j}], no shortcut.`}`,
            variables: { i, j, 'dp[i][j]': dp[i][j], substr: s.slice(i, j + 1) },
            visualization: makeViz(highlights, labels),
          });
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `dp[0][${n - 1}]=${dp[0][n - 1]}. Minimum turns to print the entire string "${s}".`,
      variables: { result: dp[0][n - 1] },
      visualization: makeViz(
        Object.fromEntries(s.split('').map((_, i) => [i, 'found'])),
        { 0: `turns:${dp[0][n - 1]}` }
      ),
    });

    return steps;
  },
};

export default strangePrinterDp;
