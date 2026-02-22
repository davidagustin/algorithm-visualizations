import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const sumOfTotalStrengthOfWizards: AlgorithmDefinition = {
  id: 'sum-of-total-strength-of-wizards',
  title: 'Sum of Total Strength of Wizards',
  leetcodeNumber: 2281,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'For each subarray, total strength = min(subarray) * sum(subarray). Return the sum over all subarrays. Use a monotonic stack to find, for each wizard, all subarrays where it is the minimum, combined with prefix sums of prefix sums for O(n) computation.',
  tags: ['Stack', 'Monotonic Stack', 'Prefix Sum', 'Math', 'Hard'],
  code: {
    pseudocode: `function totalStrength(strength):
  MOD = 1e9+7
  n = len(strength)
  prefix = prefix sums of strength
  prefixOfPrefix = prefix sums of prefix
  stack = []  // monotonic increasing
  result = 0
  for i from 0 to n (with sentinel):
    while stack not empty and strength[stack.top] >= strength[i]:
      mid = stack.pop()
      left = stack.top + 1 if stack else 0
      right = i - 1
      // count subarrays where mid is minimum
      // use double prefix sums for sum computation
      result += strength[mid] * (contribution)
  return result % MOD`,
    python: `def totalStrength(strength):
    MOD = 10**9 + 7
    n = len(strength)
    strength = [0] + strength + [0]
    stack = []
    prefix = [0] * (n + 2)
    for i in range(1, n + 2):
        prefix[i] = prefix[i-1] + strength[i]
    pp = [0] * (n + 3)
    for i in range(1, n + 3):
        pp[i] = pp[i-1] + prefix[i-1]
    result = 0
    for i in range(n + 2):
        while stack and strength[stack[-1]] >= strength[i]:
            mid = stack.pop()
            l = stack[-1] if stack else 0
            r = i
            ln = mid - l
            rn = r - mid
            result += strength[mid] * (rn * (pp[mid] - pp[l]) - ln * (pp[r] - pp[mid])) % MOD
        stack.append(i)
    return result % MOD`,
    javascript: `function totalStrength(strength) {
  const MOD = 1000000007n;
  const n = strength.length;
  const a = [0, ...strength, 0];
  const prefix = new Array(a.length + 1).fill(0n);
  for (let i = 1; i < a.length + 1; i++)
    prefix[i] = prefix[i-1] + BigInt(a[i-1]);
  const pp = new Array(a.length + 2).fill(0n);
  for (let i = 1; i < a.length + 2; i++)
    pp[i] = pp[i-1] + prefix[i-1];
  const stack = [];
  let result = 0n;
  for (let i = 0; i < a.length; i++) {
    while (stack.length && a[stack[stack.length-1]] >= a[i]) {
      const mid = stack.pop();
      const l = stack.length ? stack[stack.length-1] : 0;
      const r = i;
      const ln = BigInt(mid - l), rn = BigInt(r - mid);
      result = (result + BigInt(a[mid]) * (rn*(pp[mid]-pp[l]) - ln*(pp[r]-pp[mid]))) % MOD;
    }
    stack.push(i);
  }
  return Number(result);
}`,
    java: `public int totalStrength(int[] strength) {
    long MOD = 1_000_000_007L;
    int n = strength.length;
    long[] a = new long[n+2];
    for (int i = 0; i < n; i++) a[i+1] = strength[i];
    long[] prefix = new long[n+3];
    for (int i = 1; i <= n+1; i++) prefix[i] = prefix[i-1] + a[i];
    long[] pp = new long[n+4];
    for (int i = 1; i <= n+3; i++) pp[i] = pp[i-1] + prefix[i-1];
    Deque<Integer> stack = new ArrayDeque<>();
    long result = 0;
    for (int i = 0; i <= n+1; i++) {
        while (!stack.isEmpty() && a[stack.peek()] >= a[i]) {
            int mid = stack.pop();
            int l = stack.isEmpty() ? 0 : stack.peek();
            long ln = mid - l, rn = i - mid;
            result = (result + a[mid] % MOD * (rn*(pp[mid]-pp[l]) - ln*(pp[i]-pp[mid])) % MOD + MOD) % MOD;
        }
        stack.push(i);
    }
    return (int)result;
}`,
  },
  defaultInput: { strength: [1, 3, 1, 2] },
  inputFields: [
    {
      name: 'strength',
      label: 'Strength Array',
      type: 'array',
      defaultValue: [1, 3, 1, 2],
      placeholder: 'e.g. 1,3,1,2',
      helperText: 'Comma-separated wizard strengths',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const strength = (input.strength as number[]).slice();
    const n = strength.length;
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;
    const a = [0, ...strength, 0];
    const stack: number[] = [];

    // Build prefix and prefix-of-prefix
    const prefix: number[] = new Array(a.length + 1).fill(0);
    for (let i = 1; i < a.length + 1; i++) prefix[i] = prefix[i - 1] + a[i - 1];
    const pp: number[] = new Array(a.length + 2).fill(0);
    for (let i = 1; i < a.length + 2; i++) pp[i] = pp[i - 1] + prefix[i - 1];

    let result = 0;

    const makeViz = (i: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: stack.map(idx => `i${idx}(s=${a[idx]})`),
      inputChars: a.map(v => String(v)),
      currentIndex: i,
      action,
    });

    steps.push({
      line: 1,
      explanation: `strength=[${strength.join(', ')}]. Add sentinels: [${a.join(', ')}]. Build prefix sums and prefix-of-prefix for O(n) subarray sum queries.`,
      variables: { a: [...a], prefix: [...prefix] },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < a.length; i++) {
      steps.push({
        line: 8,
        explanation: `i=${i}, a[i]=${a[i]}. Process monotonic stack.`,
        variables: { i, val: a[i], result },
        visualization: makeViz(i, 'idle'),
      });

      while (stack.length > 0 && a[stack[stack.length - 1]] >= a[i]) {
        const mid = stack.pop()!;
        const l = stack.length > 0 ? stack[stack.length - 1] : 0;
        const r = i;
        const ln = mid - l;
        const rn = r - mid;
        const contribution = a[mid] * ((rn * (pp[mid] - pp[l]) - ln * (pp[r] - pp[mid])) % MOD);
        result = ((result + contribution) % MOD + MOD) % MOD;

        steps.push({
          line: 10,
          explanation: `Pop mid=${mid} (s=${a[mid]}). Left span=${ln}, Right span=${rn}. Contribution=${contribution}. result=${result}.`,
          variables: { mid, val: a[mid], ln, rn, contribution, result },
          visualization: makeViz(i, 'pop'),
        });
      }

      stack.push(i);
      steps.push({
        line: 14,
        explanation: `Push index ${i} onto stack.`,
        variables: { i, stack: [...stack] },
        visualization: makeViz(i, 'push'),
      });
    }

    steps.push({
      line: 15,
      explanation: `Done. Sum of total strength = ${result} (mod 1e9+7).`,
      variables: { result },
      visualization: makeViz(a.length - 1, 'match'),
    });

    return steps;
  },
};

export default sumOfTotalStrengthOfWizards;
