import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const factorCombinations: AlgorithmDefinition = {
  id: 'factor-combinations',
  title: 'Factor Combinations',
  leetcodeNumber: 254,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a positive integer n, return all possible combinations of factors (greater than 1) whose product equals n. Each combination should be listed in non-decreasing order, and no combination should include 1 or n itself (unless n == 1). Use backtracking starting from factor 2 up to sqrt(n).',
  tags: ['backtracking', 'math', 'recursion'],

  code: {
    pseudocode: `function getFactors(n):
  results = []
  function backtrack(n, start, factors):
    for f in start..n:
      if n % f == 0:
        factors.append(f)
        factors.append(n/f)
        results.append(copy of factors)
        factors.pop()
        backtrack(n/f, f, factors)
        factors.pop()
  backtrack(n, 2, [])
  return results`,
    python: `def getFactors(n: int) -> list[list[int]]:
    res = []
    def bt(n, start, factors):
        for f in range(start, n):
            if n % f == 0:
                factors.append(f)
                factors.append(n // f)
                res.append(factors[:])
                factors.pop()
                bt(n // f, f, factors)
                factors.pop()
    bt(n, 2, [])
    return res`,
    javascript: `function getFactors(n) {
  const res = [];
  function bt(n, start, factors) {
    for (let f = start; f < n; f++) {
      if (n % f === 0) {
        factors.push(f);
        factors.push(n / f);
        res.push([...factors]);
        factors.pop();
        bt(n / f, f, factors);
        factors.pop();
      }
    }
  }
  bt(n, 2, []);
  return res;
}`,
    java: `public List<List<Integer>> getFactors(int n) {
    List<List<Integer>> res = new ArrayList<>();
    backtrack(n, 2, new ArrayList<>(), res);
    return res;
}
private void backtrack(int n, int start, List<Integer> factors, List<List<Integer>> res) {
    for (int f = start; f < n; f++) {
        if (n % f == 0) {
            factors.add(f);
            factors.add(n / f);
            res.add(new ArrayList<>(factors));
            factors.remove(factors.size() - 1);
            backtrack(n / f, f, factors);
            factors.remove(factors.size() - 1);
        }
    }
}`,
  },

  defaultInput: { n: 12 },

  inputFields: [
    {
      name: 'n',
      label: 'Number n',
      type: 'number',
      defaultValue: 12,
      placeholder: '12',
      helperText: 'Find all factor combinations of n',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const results: number[][] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find all factor combinations for n=${n}. A valid combination: factors > 1 whose product = ${n}, in non-decreasing order.`,
      variables: { n },
      visualization: makeViz([n], { 0: 'active' }, { 0: `n=${n}` }),
    });

    function backtrack(remaining: number, start: number, factors: number[]) {
      for (let f = start; f < remaining; f++) {
        if (remaining % f === 0) {
          const quotient = remaining / f;
          factors.push(f);
          factors.push(quotient);
          results.push([...factors]);

          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          factors.forEach((v, i) => { h[i] = i === factors.length - 2 ? 'active' : 'visited'; l[i] = String(v); });

          steps.push({
            line: 5,
            explanation: `Factor ${f} divides ${remaining}: ${f} x ${quotient} = ${remaining}. Combination: [${[...factors].join(', ')}]. Product = ${[...factors].reduce((a, b) => a * b, 1)}.`,
            variables: { factor: f, quotient, combination: [...factors] },
            visualization: makeViz([...factors], h, l),
          });

          factors.pop();
          backtrack(quotient, f, factors);
          factors.pop();
        }
      }
    }

    backtrack(n, 2, []);

    const resultArrays = results.map((r, i) => r.join('x'));

    steps.push({
      line: 11,
      explanation: `Found ${results.length} factor combinations for ${n}: ${resultArrays.join(', ')}`,
      variables: { n, totalCombinations: results.length, combinations: results },
      visualization: makeViz(
        results.length > 0 ? results[0] : [n],
        Object.fromEntries((results.length > 0 ? results[0] : [n]).map((_, i) => [i, 'found'])),
        Object.fromEntries((results.length > 0 ? results[0] : [n]).map((v, i) => [i, String(v)]))
      ),
    });

    return steps;
  },
};

export default factorCombinations;
