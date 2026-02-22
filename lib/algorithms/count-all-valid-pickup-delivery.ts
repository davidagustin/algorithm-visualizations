import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countAllValidPickupDelivery: AlgorithmDefinition = {
  id: 'count-all-valid-pickup-delivery',
  title: 'Count All Valid Pickup/Delivery Options',
  leetcodeNumber: 1359,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Count valid orderings of n pickup/delivery pairs where each delivery Di comes after pickup Pi. For i orders already placed (2i slots filled), there are (2i+1) gaps for the next pickup and, once placed, there are (2i+2)/2 positions for its delivery. Multiply these choices for each order.',
  tags: ['dynamic programming', 'combinatorics', 'math', 'modular arithmetic'],

  code: {
    pseudocode: `function countOrders(n):
  MOD = 1e9 + 7
  result = 1
  for i from 1 to n:
    spaces = 2 * i - 1  // slots for pickup Pi
    result = result * spaces * (spaces + 1) / 2 % MOD
    // spaces+1 positions for Pi, then (spaces+1)/2 ...
    // simplified: gaps*(gaps+1)/2
  return result`,
    python: `def countOrders(n: int) -> int:
    MOD = 10**9 + 7
    result = 1
    for i in range(2, n + 1):
        spaces = 2 * i - 1
        result = result * spaces % MOD * (spaces + 1) // 2 % MOD
    return result`,
    javascript: `function countOrders(n) {
  const MOD = BigInt(1e9 + 7);
  let result = 1n;
  for (let i = 2; i <= n; i++) {
    const spaces = BigInt(2 * i - 1);
    result = result * spaces % MOD * (spaces + 1n) / 2n % MOD;
  }
  return Number(result);
}`,
    java: `public int countOrders(int n) {
    final long MOD = 1_000_000_007L;
    long result = 1;
    for (int i = 2; i <= n; i++) {
        long spaces = 2L * i - 1;
        result = result * spaces % MOD * (spaces + 1) / 2 % MOD;
    }
    return (int) result;
}`,
  },

  defaultInput: {
    n: 3,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number of Orders (n)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of pickup/delivery pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const MOD = 1000000007;

    const dpValues: number[] = [1];
    let result = 1;

    const makeViz = (vals: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...vals],
      highlights,
      labels: Object.fromEntries(vals.map((_, i) => [i, `n=${i + 1}`])),
    });

    steps.push({
      line: 3,
      explanation: `Start with result = 1 (base case: 1 order has 1 way). For each new order i, multiply by available arrangements.`,
      variables: { n, result: 1 },
      visualization: makeViz([...dpValues], { 0: 'found' }),
    });

    for (let i = 2; i <= n; i++) {
      const spaces = 2 * i - 1;
      result = Math.floor(result * spaces % MOD * (spaces + 1) / 2) % MOD;
      dpValues.push(result);
      steps.push({
        line: 5,
        explanation: `Order ${i}: ${2 * i - 1} gaps for pickup P${i}, then (${2 * i - 1}+1)/2 = ${i} positions for D${i}. Multiply result by ${2 * i - 1} * ${i} = ${(2 * i - 1) * i}. Result = ${result}.`,
        variables: { i, spaces: 2 * i - 1, pickupPositions: 2 * i - 1, deliveryPositions: i, result },
        visualization: makeViz([...dpValues], { [i - 1]: 'found', [i - 2]: 'comparing' }),
      });
    }

    steps.push({
      line: 7,
      explanation: `Total valid orderings for ${n} pickup/delivery pairs = ${result}.`,
      variables: { result },
      visualization: makeViz([...dpValues], { [n - 1]: 'found' }),
    });

    return steps;
  },
};

export default countAllValidPickupDelivery;
