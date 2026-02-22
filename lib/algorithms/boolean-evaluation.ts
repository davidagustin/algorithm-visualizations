import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const booleanEvaluation: AlgorithmDefinition = {
  id: 'boolean-evaluation',
  title: 'Boolean Evaluation',
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a boolean expression string with symbols (0,1) and operators (&,|,^), count the number of ways to parenthesize the expression so it evaluates to true. Uses interval DP: dp[i][j][true/false] = number of ways the sub-expression from symbol i to symbol j evaluates to true/false.',
  tags: ['dynamic programming', 'interval dp', 'string', 'combinatorics'],

  code: {
    pseudocode: `function countEval(s, result):
  symbols = s[0::2], operators = s[1::2]
  n = len(symbols)
  T[i][j] = ways sub-expression i..j is true
  F[i][j] = ways sub-expression i..j is false
  for i from 0 to n-1:
    T[i][i] = 1 if symbol=='1' else 0
    F[i][i] = 1 if symbol=='0' else 0
  for len from 2 to n:
    for i from 0 to n-len:
      j = i+len-1
      for k from i to j-1:
        op = operators[k]
        lt,lf,rt,rf = T[i][k],F[i][k],T[k+1][j],F[k+1][j]
        if op=='&': T[i][j]+= lt*rt; F[i][j]+=lt*rf+lf*rt+lf*rf
        if op=='|': T[i][j]+=lt*rt+lt*rf+lf*rt; F[i][j]+=lf*rf
        if op=='^': T[i][j]+=lt*rf+lf*rt; F[i][j]+=lt*rt+lf*rf
  return T[0][n-1] if result else F[0][n-1]`,
    python: `def countEval(s: str, result: int) -> int:
    symbols = s[::2]
    operators = s[1::2]
    n = len(symbols)
    T = [[0]*n for _ in range(n)]
    F = [[0]*n for _ in range(n)]
    for i in range(n):
        T[i][i] = 1 if symbols[i] == '1' else 0
        F[i][i] = 1 if symbols[i] == '0' else 0
    for length in range(2, n+1):
        for i in range(n-length+1):
            j = i+length-1
            for k in range(i, j):
                op = operators[k]
                lt,lf,rt,rf = T[i][k],F[i][k],T[k+1][j],F[k+1][j]
                if op=='&': T[i][j]+=lt*rt; F[i][j]+=lt*rf+lf*rt+lf*rf
                elif op=='|': T[i][j]+=lt*rt+lt*rf+lf*rt; F[i][j]+=lf*rf
                elif op=='^': T[i][j]+=lt*rf+lf*rt; F[i][j]+=lt*rt+lf*rf
    return T[0][n-1] if result else F[0][n-1]`,
    javascript: `function countEval(s, result) {
  const symbols = s.split('').filter((_,i)=>i%2===0);
  const operators = s.split('').filter((_,i)=>i%2===1);
  const n = symbols.length;
  const T = Array.from({length:n},()=>new Array(n).fill(0));
  const F = Array.from({length:n},()=>new Array(n).fill(0));
  for (let i=0;i<n;i++) { T[i][i]=symbols[i]==='1'?1:0; F[i][i]=symbols[i]==='0'?1:0; }
  for (let len=2;len<=n;len++)
    for (let i=0;i<=n-len;i++) {
      const j=i+len-1;
      for (let k=i;k<j;k++) {
        const [lt,lf,rt,rf]=[T[i][k],F[i][k],T[k+1][j],F[k+1][j]];
        if (operators[k]==='&') { T[i][j]+=lt*rt; F[i][j]+=lt*rf+lf*rt+lf*rf; }
        else if (operators[k]==='|') { T[i][j]+=lt*rt+lt*rf+lf*rt; F[i][j]+=lf*rf; }
        else { T[i][j]+=lt*rf+lf*rt; F[i][j]+=lt*rt+lf*rf; }
      }
    }
  return result ? T[0][n-1] : F[0][n-1];
}`,
    java: `public int countEval(String s, int result) {
    int n = (s.length()+1)/2;
    int[][] T = new int[n][n], F = new int[n][n];
    for (int i=0;i<n;i++) {
        T[i][i] = s.charAt(2*i)=='1'?1:0;
        F[i][i] = s.charAt(2*i)=='0'?1:0;
    }
    for (int len=2;len<=n;len++)
        for (int i=0;i<=n-len;i++) {
            int j=i+len-1;
            for (int k=i;k<j;k++) {
                char op=s.charAt(2*k+1);
                int lt=T[i][k],lf=F[i][k],rt=T[k+1][j],rf=F[k+1][j];
                if (op=='&'){T[i][j]+=lt*rt;F[i][j]+=lt*rf+lf*rt+lf*rf;}
                else if(op=='|'){T[i][j]+=lt*rt+lt*rf+lf*rt;F[i][j]+=lf*rf;}
                else{T[i][j]+=lt*rf+lf*rt;F[i][j]+=lt*rt+lf*rf;}
            }
        }
    return result==1?T[0][n-1]:F[0][n-1];
}`,
  },

  defaultInput: {
    expression: '1^0|0|1',
    result: 0,
  },

  inputFields: [
    {
      name: 'expression',
      label: 'Boolean Expression',
      type: 'string',
      defaultValue: '1^0|0|1',
      placeholder: '1^0|0|1',
      helperText: 'Boolean expression with 0,1 and &,|,^ operators',
    },
    {
      name: 'result',
      label: 'Target Result (0 or 1)',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
      helperText: '0 = count false evaluations, 1 = count true evaluations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.expression as string;
    const result = input.result as number;
    const steps: AlgorithmStep[] = [];

    const syms = s.split('').filter((_, i) => i % 2 === 0);
    const ops = s.split('').filter((_, i) => i % 2 === 1);
    const n = syms.length;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: syms.map((c: string) => parseInt(c, 10)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Boolean Evaluation: expression="${s}". Count ways to parenthesize so it evaluates to ${result}.`,
      variables: { symbols: syms.join(','), operators: ops.join(','), target: result },
      visualization: makeViz({}, {}),
    });

    const T: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const F: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      T[i][i] = syms[i] === '1' ? 1 : 0;
      F[i][i] = syms[i] === '0' ? 1 : 0;
    }

    steps.push({
      line: 6,
      explanation: `Base cases: each symbol alone. T[i][i]=1 if "1", F[i][i]=1 if "0". Symbols: [${syms.join(', ')}].`,
      variables: Object.fromEntries(syms.map((c, i) => [`sym${i}`, c])),
      visualization: makeViz(
        Object.fromEntries(syms.map((_, i) => [i, 'active'])),
        Object.fromEntries(syms.map((c, i) => [i, `T:${T[i][i]},F:${F[i][i]}`]))
      ),
    });

    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        for (let k = i; k < j; k++) {
          const op = ops[k];
          const lt = T[i][k], lf = F[i][k], rt = T[k + 1][j], rf = F[k + 1][j];
          if (op === '&') { T[i][j] += lt * rt; F[i][j] += lt * rf + lf * rt + lf * rf; }
          else if (op === '|') { T[i][j] += lt * rt + lt * rf + lf * rt; F[i][j] += lf * rf; }
          else { T[i][j] += lt * rf + lf * rt; F[i][j] += lt * rt + lf * rf; }
        }

        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};
        for (let idx = i; idx <= Math.min(j, n - 1); idx++) highlights[idx] = 'comparing';
        if (i < n) { highlights[i] = 'active'; labels[i] = `T:${T[i][j]}`; }

        steps.push({
          line: 13,
          explanation: `Subexpr [${i}..${j}]: T=${T[i][j]} ways true, F=${F[i][j]} ways false. Split at each operator.`,
          variables: { i, j, 'T[i][j]': T[i][j], 'F[i][j]': F[i][j] },
          visualization: makeViz(highlights, labels),
        });
      }
    }

    const answer = result ? T[0][n - 1] : F[0][n - 1];
    steps.push({
      line: 14,
      explanation: `Answer: ${answer} ways to parenthesize "${s}" to get ${result}. T[0][${n - 1}]=${T[0][n - 1]}, F[0][${n - 1}]=${F[0][n - 1]}.`,
      variables: { result, answer },
      visualization: makeViz(
        Object.fromEntries(syms.map((_, i) => [i, 'found'])),
        { 0: `ways:${answer}` }
      ),
    });

    return steps;
  },
};

export default booleanEvaluation;
