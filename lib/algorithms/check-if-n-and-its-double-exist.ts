import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfNAndItsDoubleExist: AlgorithmDefinition = {
  id: 'check-if-n-and-its-double-exist',
  title: 'Check If N and Its Double Exist',
  leetcodeNumber: 1346,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given an array arr, check if there exist two indices i != j such that arr[i] == 2 * arr[j]. Use a hash set of seen values; for each element check if element*2 or element/2 (when even) is already in the set.',
  tags: ['hash map', 'hash set', 'array', 'two sum variant'],

  code: {
    pseudocode: `function checkIfExist(arr):
  seen = set()
  for n in arr:
    if n*2 in seen or (n%2==0 and n//2 in seen):
      return true
    seen.add(n)
  return false`,
    python: `def checkIfExist(arr):
    seen = set()
    for n in arr:
        if n * 2 in seen or (n % 2 == 0 and n // 2 in seen):
            return True
        seen.add(n)
    return False`,
    javascript: `function checkIfExist(arr) {
  const seen = new Set();
  for (const n of arr) {
    if (seen.has(n * 2) || (n % 2 === 0 && seen.has(n / 2))) return true;
    seen.add(n);
  }
  return false;
}`,
    java: `public boolean checkIfExist(int[] arr) {
    Set<Integer> seen = new HashSet<>();
    for (int n : arr) {
        if (seen.contains(n*2) || (n%2==0 && seen.contains(n/2))) return true;
        seen.add(n);
    }
    return false;
}`,
  },

  defaultInput: {
    arr: [10, 2, 5, 3],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [10, 2, 5, 3],
      placeholder: '10,2,5,3',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    const seen = new Set<number>();

    steps.push({
      line: 1,
      explanation: 'Initialize empty seen set. For each element, check if its double or half already exists.',
      variables: { seen: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < arr.length; i++) {
      const n = arr[i];
      const doubleExists = seen.has(n * 2);
      const halfExists = n % 2 === 0 && seen.has(n / 2);

      if (doubleExists || halfExists) {
        const matchVal = doubleExists ? n * 2 : n / 2;
        steps.push({
          line: 3,
          explanation: `arr[${i}]=${n}: Found match! ${doubleExists ? `double ${n * 2}` : `half ${n / 2}`} exists in seen. Return true.`,
          variables: { i, value: n, matchValue: matchVal, result: true },
          visualization: makeViz({ [i]: 'found' }, { [i]: `match!` }),
        });
        return steps;
      }

      steps.push({
        line: 4,
        explanation: `arr[${i}]=${n}: double=${n * 2} not in seen, half check ${n % 2 === 0 ? `${n / 2} not in seen` : 'skipped (odd)'}. Add ${n} to seen.`,
        variables: { i, value: n, double: n * 2, seen: Array.from(seen).join(', ') },
        visualization: makeViz({ [i]: 'active' }, { [i]: `+${n}` }),
      });
      seen.add(n);
    }

    steps.push({
      line: 5,
      explanation: 'No valid pair found. Return false.',
      variables: { result: false },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'mismatch'])),
        Object.fromEntries(arr.map((_, i) => [i, `${arr[i]}`]))
      ),
    });

    return steps;
  },
};

export default checkIfNAndItsDoubleExist;
