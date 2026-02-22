import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const combinationSumIII: AlgorithmDefinition = {
  id: 'combination-sum-iii',
  title: 'Combination Sum III',
  leetcodeNumber: 216,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Find all combinations of k numbers that sum to n, using only digits 1-9, with each digit used at most once. We use backtracking: try each digit from the last chosen digit + 1 up to 9, add it to the current path, and recurse. When the path has k elements and sums to n, record it.',
  tags: ['Backtracking', 'Recursion', 'Array'],
  code: {
    pseudocode: `function combinationSum3(k, n):
  result = []
  backtrack(k, n, 1, [], result)
  return result

function backtrack(k, remaining, start, current, result):
  if current.length == k and remaining == 0:
    result.append(copy of current)
    return
  if current.length == k or remaining <= 0: return
  for i from start to 9:
    current.append(i)
    backtrack(k, remaining - i, i+1, current, result)
    current.pop()`,
    python: `def combinationSum3(k, n):
    result = []
    def backtrack(remaining, start, current):
        if len(current) == k and remaining == 0:
            result.append(current[:])
            return
        if len(current) == k or remaining <= 0:
            return
        for i in range(start, 10):
            current.append(i)
            backtrack(remaining - i, i + 1, current)
            current.pop()
    backtrack(n, 1, [])
    return result`,
    javascript: `function combinationSum3(k, n) {
  const result = [];
  function backtrack(remaining, start, current) {
    if (current.length === k && remaining === 0) {
      result.push([...current]);
      return;
    }
    if (current.length === k || remaining <= 0) return;
    for (let i = start; i <= 9; i++) {
      current.push(i);
      backtrack(remaining - i, i + 1, current);
      current.pop();
    }
  }
  backtrack(n, 1, []);
  return result;
}`,
    java: `public List<List<Integer>> combinationSum3(int k, int n) {
    List<List<Integer>> result = new ArrayList<>();
    backtrack(k, n, 1, new ArrayList<>(), result);
    return result;
}
void backtrack(int k, int remaining, int start,
               List<Integer> current, List<List<Integer>> result) {
    if (current.size() == k && remaining == 0) {
        result.add(new ArrayList<>(current));
        return;
    }
    if (current.size() == k || remaining <= 0) return;
    for (int i = start; i <= 9; i++) {
        current.add(i);
        backtrack(k, remaining - i, i + 1, current, result);
        current.remove(current.size() - 1);
    }
}`,
  },
  defaultInput: { k: 3, n: 7 },
  inputFields: [
    {
      name: 'k',
      label: 'K (count of numbers)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'How many numbers to pick',
    },
    {
      name: 'n',
      label: 'N (target sum)',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Target sum using k numbers from 1-9',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const k = input.k as number;
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    const result: number[][] = [];
    const current: number[] = [];
    // Digits 1-9 represented as array indices 0-8 → values 1-9
    const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    function makeViz(activeDigit: number | null, remaining: number): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < 9; i++) {
        labels[i] = String(digits[i]);
        if (current.includes(digits[i])) highlights[i] = 'visited';
        else if (digits[i] === activeDigit) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: digits.slice(),
        highlights,
        labels,
        auxData: {
          label: 'State',
          entries: [
            { key: 'Current', value: `[${current.join(', ')}]` },
            { key: `Count (need ${k})`, value: String(current.length) },
            { key: 'Remaining', value: String(remaining) },
            { key: 'Combos found', value: String(result.length) },
            ...result.map((c, i) => ({ key: `  #${i + 1}`, value: `[${c.join(', ')}]` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find all ${k}-number combinations from 1-9 summing to ${n}. Each digit used at most once.`,
      variables: { k, n },
      visualization: makeViz(null, n),
    });

    function backtrack(remaining: number, start: number): void {
      if (current.length === k && remaining === 0) {
        result.push(current.slice());
        steps.push({
          line: 7,
          explanation: `Found combination: [${current.join(', ')}] (${k} numbers summing to ${n}). Total: ${result.length}.`,
          variables: { combination: current.slice(), total: result.length },
          visualization: {
            type: 'array',
            array: digits.slice(),
            highlights: Object.fromEntries(digits.map((d, i) => [i, current.includes(d) ? 'found' : 'default'])),
            labels: Object.fromEntries(digits.map((d, i) => [i, String(d)])),
            auxData: {
              label: 'Combination Found!',
              entries: [
                { key: 'Combination', value: `[${current.join(', ')}]` },
                { key: 'Total found', value: String(result.length) },
              ],
            },
          },
        });
        return;
      }
      if (current.length === k || remaining <= 0) return;

      for (let i = start; i <= 9; i++) {
        if (i > remaining) {
          steps.push({
            line: 12,
            explanation: `Digit ${i} > remaining ${remaining}. No point continuing (digits only increase).`,
            variables: { digit: i, remaining },
            visualization: makeViz(i, remaining),
          });
          break;
        }

        current.push(i);
        steps.push({
          line: 11,
          explanation: `Try digit ${i}. Current: [${current.join(', ')}], remaining: ${remaining - i}, need ${k - current.length} more numbers.`,
          variables: { digit: i, current: current.slice(), remaining: remaining - i },
          visualization: makeViz(i, remaining - i),
        });

        backtrack(remaining - i, i + 1);

        current.pop();
        steps.push({
          line: 13,
          explanation: `Backtrack: remove ${i}. Current: [${current.join(', ')}]. Try next digit.`,
          variables: { removed: i, current: current.slice(), remaining },
          visualization: makeViz(null, remaining),
        });
      }
    }

    backtrack(n, 1);

    steps.push({
      line: 3,
      explanation: `Done. Found ${result.length} combination(s) of ${k} numbers from 1-9 summing to ${n}.`,
      variables: { total: result.length },
      visualization: {
        type: 'array',
        array: digits.slice(),
        highlights: Object.fromEntries(digits.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(digits.map((d, i) => [i, String(d)])),
        auxData: {
          label: `All ${result.length} Combinations`,
          entries: result.length > 0
            ? result.map((c, i) => ({ key: `#${i + 1}`, value: `[${c.join(', ')}]` }))
            : [{ key: 'Result', value: 'No valid combinations' }],
        },
      },
    });

    return steps;
  },
};

export default combinationSumIII;
