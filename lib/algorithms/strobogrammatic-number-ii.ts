import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const strobogrammaticNumberIi: AlgorithmDefinition = {
  id: 'strobogrammatic-number-ii',
  title: 'Strobogrammatic Number II',
  leetcodeNumber: 247,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'A strobogrammatic number looks the same when rotated 180 degrees. Given an integer n, return all strobogrammatic numbers of length n. Build them from the outside in: pairs (0,0), (1,1), (6,9), (8,8), (9,6) wrap each inner result, with (0,0) disallowed at outermost level.',
  tags: ['backtracking', 'recursion', 'math', 'string'],

  code: {
    pseudocode: `function findStrobogrammatic(n):
  function helper(n, total):
    if n == 0: return [""]
    if n == 1: return ["0", "1", "8"]
    middles = helper(n-2, total)
    result = []
    for middle in middles:
      for (a, b) in [(0,0),(1,1),(6,9),(8,8),(9,6)]:
        if n != total or a != 0:
          result.append(a + middle + b)
    return result
  return helper(n, n)`,
    python: `def findStrobogrammatic(n: int) -> list[str]:
    def helper(n, total):
        if n == 0: return ['']
        if n == 1: return ['0', '1', '8']
        middles = helper(n - 2, total)
        res = []
        for m in middles:
            for a, b in [('0','0'),('1','1'),('6','9'),('8','8'),('9','6')]:
                if n != total or a != '0':
                    res.append(a + m + b)
        return res
    return helper(n, n)`,
    javascript: `function findStrobogrammatic(n) {
  function helper(n, total) {
    if (n === 0) return [''];
    if (n === 1) return ['0', '1', '8'];
    const middles = helper(n - 2, total);
    const res = [];
    for (const m of middles) {
      for (const [a, b] of [['0','0'],['1','1'],['6','9'],['8','8'],['9','6']]) {
        if (n !== total || a !== '0') res.push(a + m + b);
      }
    }
    return res;
  }
  return helper(n, n);
}`,
    java: `public List<String> findStrobogrammatic(int n) {
    return helper(n, n);
}
private List<String> helper(int n, int total) {
    if (n == 0) return List.of("");
    if (n == 1) return List.of("0", "1", "8");
    List<String> middles = helper(n - 2, total);
    List<String> res = new ArrayList<>();
    for (String m : middles) {
        for (String[] pair : new String[][]{{"0","0"},{"1","1"},{"6","9"},{"8","8"},{"9","6"}}) {
            if (n != total || !pair[0].equals("0")) res.add(pair[0] + m + pair[1]);
        }
    }
    return res;
}`,
  },

  defaultInput: { n: 3 },

  inputFields: [
    {
      name: 'n',
      label: 'Length n',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Length of strobogrammatic numbers to generate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const pairs: [string, string][] = [['0', '0'], ['1', '1'], ['6', '9'], ['8', '8'], ['9', '6']];
    const results: string[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Generate all strobogrammatic numbers of length ${n}. Valid pairs: (0,0),(1,1),(6,9),(8,8),(9,6). Build from outside in.`,
      variables: { n, validPairs: pairs.map(([a, b]) => `(${a},${b})`).join(', ') },
      visualization: makeViz([], {}, {}),
    });

    function helper(curr: number, total: number): string[] {
      if (curr === 0) return [''];
      if (curr === 1) {
        steps.push({
          line: 3,
          explanation: 'Base case: length 1 middle options are "0", "1", "8" (strobogrammatic single digits).',
          variables: { innerLength: 1, options: ['0', '1', '8'] },
          visualization: makeViz([0, 1, 8], { 0: 'active', 1: 'active', 2: 'active' }, { 0: '0', 1: '1', 2: '8' }),
        });
        return ['0', '1', '8'];
      }

      const middles = helper(curr - 2, total);
      const res: string[] = [];

      for (const m of middles) {
        for (const [a, b] of pairs) {
          if (curr !== total || a !== '0') {
            const num = a + m + b;
            res.push(num);
            results.push(num);

            if (steps.length < 35) {
              steps.push({
                line: 8,
                explanation: `Wrap middle "${m}" with pair (${a}, ${b}): "${num}". ${curr === total && a === '0' ? 'Skipped (no leading zero)' : 'Valid!'}`,
                variables: { middle: m, left: a, right: b, result: num },
                visualization: makeViz(
                  num.split('').map((_, ni) => ni),
                  Object.fromEntries([[0, 'active'], [num.length - 1, 'active']]),
                  Object.fromEntries(num.split('').map((c, ni) => [ni, c]))
                ),
              });
            }
          }
        }
      }

      return res;
    }

    const finalResults = helper(n, n);

    steps.push({
      line: 10,
      explanation: `Generated all ${finalResults.length} strobogrammatic numbers of length ${n}: [${finalResults.join(', ')}]`,
      variables: { n, count: finalResults.length, numbers: finalResults },
      visualization: makeViz(
        finalResults.map((_, i) => i),
        Object.fromEntries(finalResults.map((_, i) => [i, 'found'])),
        Object.fromEntries(finalResults.map((v, i) => [i, v]))
      ),
    });

    return steps;
  },
};

export default strobogrammaticNumberIi;
