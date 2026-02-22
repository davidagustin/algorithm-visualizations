import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const arrangingCoins: AlgorithmDefinition = {
  id: 'arranging-coins',
  title: 'Arranging Coins',
  leetcodeNumber: 441,
  difficulty: 'Easy',
  category: 'Binary Search',
  description:
    'Given n coins, arrange them in a staircase shape where the k-th row has exactly k coins. Return the number of complete rows. Uses binary search on the number of rows: the total coins for k rows is k*(k+1)/2, so binary search finds the largest k where this is at most n.',
  tags: ['binary search', 'math', 'staircase'],

  code: {
    pseudocode: `function arrangeCoins(n):
  left = 1
  right = n
  while left <= right:
    mid = (left + right) / 2
    coins = mid * (mid + 1) / 2
    if coins == n:
      return mid
    else if coins < n:
      left = mid + 1
    else:
      right = mid - 1
  return right`,

    python: `def arrangeCoins(n: int) -> int:
    left, right = 1, n
    while left <= right:
        mid = (left + right) // 2
        coins = mid * (mid + 1) // 2
        if coins == n:
            return mid
        elif coins < n:
            left = mid + 1
        else:
            right = mid - 1
    return right`,

    javascript: `function arrangeCoins(n) {
  let left = 1, right = n;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    const coins = mid * (mid + 1) / 2;
    if (coins === n) return mid;
    else if (coins < n) left = mid + 1;
    else right = mid - 1;
  }
  return right;
}`,

    java: `public int arrangeCoins(int n) {
    long left = 1, right = n;
    while (left <= right) {
        long mid = (left + right) / 2;
        long coins = mid * (mid + 1) / 2;
        if (coins == n) return (int) mid;
        else if (coins < n) left = mid + 1;
        else right = mid - 1;
    }
    return (int) right;
}`,
  },

  defaultInput: {
    n: 8,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Coins',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Total coins to arrange in staircase rows',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const searchSpace = Array.from({ length: Math.min(n, 20) }, (_, i) => i + 1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: searchSpace,
      highlights,
      labels,
    });

    let left = 1;
    let right = Math.min(n, 20);

    steps.push({
      line: 1,
      explanation: `Arrange ${n} coins in staircase. Binary search on number of rows from 1 to ${right}.`,
      variables: { left, right, n },
      visualization: makeViz(
        { 0: 'pointer', [right - 1]: 'pointer' },
        { 0: 'L', [right - 1]: 'R' }
      ),
    });

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      const coins = (mid * (mid + 1)) / 2;

      steps.push({
        line: 4,
        explanation: `Try mid=${mid} rows. Total coins needed = ${mid}*(${mid}+1)/2 = ${coins}. We have n=${n}.`,
        variables: { left, right, mid, coinsNeeded: coins, n },
        visualization: makeViz(
          { [left - 1]: 'active', [right - 1]: 'active', [mid - 1]: 'comparing' },
          { [left - 1]: 'L', [right - 1]: 'R', [mid - 1]: `mid=${mid}` }
        ),
      });

      if (coins === n) {
        steps.push({
          line: 7,
          explanation: `Exact fit! ${mid} rows use exactly ${coins} coins. Answer is ${mid}.`,
          variables: { mid, coinsNeeded: coins, result: mid },
          visualization: makeViz(
            { [mid - 1]: 'found' },
            { [mid - 1]: `ans=${mid}` }
          ),
        });
        return steps;
      } else if (coins < n) {
        steps.push({
          line: 9,
          explanation: `${coins} < ${n}. Row ${mid} uses too few coins. Try more rows: left = ${mid + 1}.`,
          variables: { left, right, mid, coinsNeeded: coins, n },
          visualization: makeViz(
            { [mid - 1]: 'mismatch', [right - 1]: 'pointer' },
            { [mid - 1]: 'too few', [right - 1]: 'R' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 11,
          explanation: `${coins} > ${n}. Row ${mid} needs too many coins. Try fewer: right = ${mid - 1}.`,
          variables: { left, right, mid, coinsNeeded: coins, n },
          visualization: makeViz(
            { [left - 1]: 'pointer', [mid - 1]: 'mismatch' },
            { [left - 1]: 'L', [mid - 1]: 'too many' }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 12,
      explanation: `Binary search complete. Maximum complete rows = ${right}.`,
      variables: { result: right },
      visualization: makeViz(
        { [right - 1]: 'found' },
        { [right - 1]: `ans=${right}` }
      ),
    });

    return steps;
  },
};

export default arrangingCoins;
