import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const diagonalTraverseII: AlgorithmDefinition = {
  id: 'diagonal-traverse-ii',
  title: 'Diagonal Traverse II',
  leetcodeNumber: 1424,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given a 2D list of different row lengths, return all elements in diagonal order. Group elements by their (row + col) sum - elements on the same anti-diagonal have the same r+c sum. Within each diagonal, add elements in reverse row order (bottom to top). O(n) time where n = total elements.',
  tags: ['Simulation', 'Array', 'Hash Map', 'Sorting'],
  code: {
    pseudocode: `function findDiagonalOrder(nums):
  diagonals = defaultdict(list)
  for r, row in enumerate(nums):
    for c, val in enumerate(row):
      diagonals[r+c].append(val)
  result = []
  for key in sorted(diagonals):
    result.extend(reversed(diagonals[key]))
  return result`,
    python: `def findDiagonalOrder(nums):
    from collections import defaultdict
    diagonals = defaultdict(list)
    for r, row in enumerate(nums):
        for c, val in enumerate(row):
            diagonals[r+c].append(val)
    result = []
    for key in sorted(diagonals):
        result.extend(reversed(diagonals[key]))
    return result`,
    javascript: `function findDiagonalOrder(nums) {
  const diagonals = new Map();
  for (let r = 0; r < nums.length; r++) {
    for (let c = 0; c < nums[r].length; c++) {
      const key = r + c;
      if (!diagonals.has(key)) diagonals.set(key, []);
      diagonals.get(key).push(nums[r][c]);
    }
  }
  const result = [];
  for (const key of [...diagonals.keys()].sort((a,b)=>a-b)) {
    result.push(...diagonals.get(key).reverse());
  }
  return result;
}`,
    java: `public int[] findDiagonalOrder(List<List<Integer>> nums) {
    Map<Integer,List<Integer>> map = new HashMap<>();
    int total = 0;
    for (int r = 0; r < nums.size(); r++) {
        for (int c = 0; c < nums.get(r).size(); c++) {
            map.computeIfAbsent(r+c, k->new ArrayList<>()).add(nums.get(r).get(c));
            total++;
        }
    }
    int[] res = new int[total]; int idx = 0;
    List<Integer> keys = new ArrayList<>(map.keySet());
    Collections.sort(keys);
    for (int key : keys) {
        List<Integer> d = map.get(key);
        for (int i = d.size()-1; i >= 0; i--) res[idx++] = d.get(i);
    }
    return res;
}`,
  },
  defaultInput: { nums: [[1, 2, 3], [4, 5, 6], [7, 8, 9]] },
  inputFields: [
    {
      name: 'nums',
      label: 'Input Matrix (flat)',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7, 8, 9],
      placeholder: '1,2,3,4,5,6,7,8,9',
      helperText: 'Flat row-major representation of matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flatNums = input.nums as number[] | number[][];
    const steps: AlgorithmStep[] = [];

    // Handle flat input by creating a 3x3 matrix
    let nums: number[][];
    if (Array.isArray(flatNums[0])) {
      nums = flatNums as number[][];
    } else {
      const flat = flatNums as number[];
      const size = Math.ceil(Math.sqrt(flat.length));
      nums = [];
      for (let i = 0; i < flat.length; i += size) {
        nums.push(flat.slice(i, i + size));
      }
    }

    const diagonals = new Map<number, number[]>();
    const allValues: number[] = [];

    for (let r = 0; r < nums.length; r++) {
      for (let c = 0; c < nums[r].length; c++) {
        allValues.push(nums[r][c]);
        const key = r + c;
        if (!diagonals.has(key)) diagonals.set(key, []);
        diagonals.get(key)!.push(nums[r][c]);
      }
    }

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...allValues],
      highlights,
      labels,
      auxData: { label: 'Diagonal Traverse', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Traverse 2D array diagonally. Group elements by (row+col). Elements: [${allValues.join(',')}].`,
      variables: { matrix: nums },
      visualization: makeViz(
        {},
        Object.fromEntries(allValues.map((v, i) => [i, String(v)])),
        [{ key: 'Strategy', value: 'Group by r+c sum' }],
      ),
    });

    const result: number[] = [];
    const sortedKeys = [...diagonals.keys()].sort((a, b) => a - b);

    for (const key of sortedKeys) {
      const diag = diagonals.get(key)!;
      const reversed = [...diag].reverse();

      steps.push({
        line: 6,
        explanation: `Diagonal r+c=${key}: values [${diag.join(',')}], reversed: [${reversed.join(',')}].`,
        variables: { diagonal: key, values: diag, reversed },
        visualization: makeViz(
          Object.fromEntries(diag.map((v) => [allValues.indexOf(v), 'active'])),
          Object.fromEntries(allValues.map((v, i) => [i, `r+c?`])),
          [{ key: 'Diagonal', value: String(key) }, { key: 'Values', value: reversed.join(',') }],
        ),
      });

      result.push(...reversed);
    }

    steps.push({
      line: 8,
      explanation: `Done! Diagonal traverse result: [${result.join(',')}].`,
      variables: { result },
      visualization: makeViz(
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)])),
        [{ key: 'Result', value: result.join(',') }],
      ),
    });

    return steps;
  },
};

export default diagonalTraverseII;
