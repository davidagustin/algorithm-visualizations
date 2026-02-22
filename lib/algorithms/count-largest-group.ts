import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countLargestGroup: AlgorithmDefinition = {
  id: 'count-largest-group',
  title: 'Count Largest Group',
  leetcodeNumber: 1399,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an integer n, group numbers from 1 to n by the sum of their digits. Return how many groups have the largest size. Use a hash map from digit-sum to count, then find how many groups match the maximum count.',
  tags: ['hash map', 'math', 'string', 'counting'],

  code: {
    pseudocode: `function countLargestGroup(n):
  freq = {}
  for i in 1..n:
    key = sum of digits of i
    freq[key] += 1
  maxSize = max(freq.values())
  return count of groups with freq == maxSize`,
    python: `def countLargestGroup(n: int) -> int:
    from collections import Counter
    freq = Counter(sum(int(d) for d in str(i)) for i in range(1, n+1))
    mx = max(freq.values())
    return sum(1 for v in freq.values() if v == mx)`,
    javascript: `function countLargestGroup(n) {
  const freq = new Map();
  for (let i = 1; i <= n; i++) {
    const key = String(i).split('').reduce((s,d) => s+Number(d), 0);
    freq.set(key, (freq.get(key)||0)+1);
  }
  const max = Math.max(...freq.values());
  return [...freq.values()].filter(v => v === max).length;
}`,
    java: `public int countLargestGroup(int n) {
    Map<Integer,Integer> freq = new HashMap<>();
    for (int i = 1; i <= n; i++) {
        int key = 0;
        for (char c : String.valueOf(i).toCharArray()) key += c-'0';
        freq.merge(key, 1, Integer::sum);
    }
    int max = Collections.max(freq.values());
    return (int)freq.values().stream().filter(v -> v==max).count();
}`,
  },

  defaultInput: {
    n: 13,
  },

  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 13,
      placeholder: '13',
      helperText: 'Group numbers from 1 to N by digit sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const digitSum = (num: number): number =>
      String(num).split('').reduce((s, d) => s + Number(d), 0);

    const sampleSize = Math.min(n, 15);
    const sampleNums = Array.from({ length: sampleSize }, (_, i) => i + 1);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: sampleNums,
      highlights,
      labels,
    });

    const freq = new Map<number, number>();

    steps.push({
      line: 1,
      explanation: `Group integers from 1 to ${n} by digit sum. Showing first ${sampleSize} numbers.`,
      variables: { n, sampleShown: sampleSize },
      visualization: makeViz({}, {}),
    });

    for (let i = 1; i <= n; i++) {
      const key = digitSum(i);
      freq.set(key, (freq.get(key) || 0) + 1);

      if (i <= sampleSize) {
        steps.push({
          line: 3,
          explanation: `i=${i}: digit sum = ${key}. Group "${key}" now has ${freq.get(key)} members.`,
          variables: { i, digitSum: key, groupCount: freq.get(key) },
          visualization: makeViz(
            { [i - 1]: 'active' },
            { [i - 1]: `sum=${key}` }
          ),
        });
      }
    }

    const maxSize = Math.max(...freq.values());
    const largestGroupCount = [...freq.values()].filter((v) => v === maxSize).length;

    steps.push({
      line: 5,
      explanation: `Frequency by digit sum: ${Array.from(freq.entries()).map(([k, v]) => `sum${k}:${v}`).join(', ')}`,
      variables: { groups: freq.size, maxGroupSize: maxSize },
      visualization: makeViz(
        Object.fromEntries(sampleNums.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(sampleNums.map((_, i) => [i, `s${digitSum(i + 1)}`]))
      ),
    });

    steps.push({
      line: 6,
      explanation: `Max group size = ${maxSize}. Number of groups with this size = ${largestGroupCount}. Return ${largestGroupCount}.`,
      variables: { maxSize, result: largestGroupCount },
      visualization: makeViz(
        Object.fromEntries(sampleNums.map((_, i) => [i, 'found'])),
        Object.fromEntries(sampleNums.map((_, i) => [i, `${i + 1}`]))
      ),
    });

    return steps;
  },
};

export default countLargestGroup;
