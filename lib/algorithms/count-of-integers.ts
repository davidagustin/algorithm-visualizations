import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfIntegers: AlgorithmDefinition = {
  id: 'count-of-integers',
  title: 'Count of Integers',
  leetcodeNumber: 2719,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count integers in [num1, num2] whose digit sum is between minSum and maxSum. Use digit DP: f(num, minS, maxS) counts numbers <= num with digit sum in [minS, maxS]. Answer is f(num2, minS, maxS) - f(num1-1, minS, maxS). State: position, current sum, tight constraint, started.',
  tags: ['dynamic programming', 'digit dp', 'string', 'counting'],

  code: {
    pseudocode: `function count(num1, num2, minSum, maxSum):
  function f(num):
    // count integers in [0, num] with digit sum in [minSum, maxSum]
    digits = digits of num
    memo = {}
    def dp(pos, curSum, tight, started):
      if curSum > maxSum: return 0
      if pos == len: return curSum >= minSum
      if (pos,curSum,tight,started) in memo: return memo[...]
      limit = digits[pos] if tight else 9
      res = 0
      for d from 0 to limit:
        res += dp(pos+1, curSum+d, tight and d==limit, ...)
      memo[...] = res
      return res
    return dp(0, 0, true, false)
  return f(num2) - f(num1-1)`,
    python: `def count(num1: str, num2: str, minSum: int, maxSum: int) -> int:
    MOD = 10**9 + 7
    def f(num):
        digits = list(map(int, num))
        n = len(digits)
        from functools import lru_cache
        @lru_cache(None)
        def dp(pos, s, tight):
            if s > maxSum: return 0
            if pos == n: return minSum <= s
            lim = digits[pos] if tight else 9
            return sum(dp(pos+1, s+d, tight and d==lim) for d in range(lim+1)) % MOD
        return dp(0, 0, True)
    def subtract_one(s):
        lst = list(s)
        i = len(lst) - 1
        while i >= 0 and lst[i] == '0':
            lst[i] = '9'; i -= 1
        lst[i] = str(int(lst[i]) - 1)
        return ''.join(lst).lstrip('0') or '0'
    return (f(num2) - f(subtract_one(num1)) + MOD) % MOD`,
    javascript: `function count(num1, num2, minSum, maxSum) {
  const MOD = 1e9 + 7;
  function f(num) {
    const digits = num.split('').map(Number);
    const n = digits.length;
    const memo = new Map();
    function dp(pos, s, tight) {
      if (s > maxSum) return 0;
      if (pos === n) return s >= minSum ? 1 : 0;
      const key = pos + ',' + s + ',' + tight;
      if (memo.has(key)) return memo.get(key);
      const lim = tight ? digits[pos] : 9;
      let res = 0;
      for (let d = 0; d <= lim; d++) res = (res + dp(pos+1, s+d, tight && d===lim)) % MOD;
      memo.set(key, res);
      return res;
    }
    return dp(0, 0, true);
  }
  // subtract 1 from num1 string
  let n1 = (BigInt(num1) - 1n).toString();
  return (f(num2) - f(n1) + MOD) % MOD;
}`,
    java: `// See Python/JS implementation - uses digit DP with memoization`,
  },

  defaultInput: {
    num1: '1',
    num2: '12',
    minSum: 1,
    maxSum: 8,
  },

  inputFields: [
    {
      name: 'num1',
      label: 'num1 (start)',
      type: 'string',
      defaultValue: '1',
      placeholder: '1',
      helperText: 'Start of range',
    },
    {
      name: 'num2',
      label: 'num2 (end)',
      type: 'string',
      defaultValue: '12',
      placeholder: '12',
      helperText: 'End of range',
    },
    {
      name: 'minSum',
      label: 'Min Digit Sum',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Minimum allowed digit sum',
    },
    {
      name: 'maxSum',
      label: 'Max Digit Sum',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Maximum allowed digit sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num1 = input.num1 as string;
    const num2 = input.num2 as string;
    const minSum = input.minSum as number;
    const maxSum = input.maxSum as number;
    const steps: AlgorithmStep[] = [];

    const MOD = 1000000007;

    steps.push({
      line: 2,
      explanation: `Count integers in [${num1}, ${num2}] with digit sum in [${minSum}, ${maxSum}]. Use f(num2) - f(num1-1).`,
      variables: { num1, num2, minSum, maxSum },
      visualization: {
        type: 'array',
        array: [Number(num1), Number(num2), minSum, maxSum],
        highlights: { 0: 'pointer', 1: 'pointer', 2: 'comparing', 3: 'comparing' },
        labels: { 0: 'num1', 1: 'num2', 2: 'minS', 3: 'maxS' },
      },
    });

    // Brute force for small inputs to show actual checking
    const start = Number(num1);
    const end = Number(num2);
    const valid: number[] = [];
    const digitSum = (x: number): number =>
      String(x).split('').reduce((s, d) => s + Number(d), 0);

    for (let i = start; i <= Math.min(end, start + 30); i++) {
      const ds = digitSum(i);
      const isValid = ds >= minSum && ds <= maxSum;
      if (isValid) valid.push(i);
      steps.push({
        line: 9,
        explanation: `Check ${i}: digit sum = ${ds}. ${isValid ? 'Valid (in [' + minSum + ',' + maxSum + ']).' : 'Invalid.'}`,
        variables: { num: i, digitSum: ds, valid: isValid },
        visualization: {
          type: 'array',
          array: [...valid],
          highlights: { [valid.length - 1]: isValid ? 'found' : 'mismatch' },
          labels: Object.fromEntries(valid.map((v, idx) => [idx, String(v)])),
        },
      });
    }

    let count = 0;
    for (let i = start; i <= end; i++) {
      const ds = digitSum(i);
      if (ds >= minSum && ds <= maxSum) count = (count + 1) % MOD;
    }

    steps.push({
      line: 14,
      explanation: `Total integers in [${num1}, ${num2}] with digit sum in [${minSum}, ${maxSum}] = ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: [...valid],
        highlights: Object.fromEntries(valid.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(valid.map((v, i) => [i, String(v)])),
      },
    });

    return steps;
  },
};

export default countOfIntegers;
