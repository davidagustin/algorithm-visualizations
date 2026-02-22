import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const xorQueriesOfSubarray: AlgorithmDefinition = {
  id: 'xor-queries-of-subarray',
  title: 'XOR Queries of a Subarray',
  leetcodeNumber: 1310,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given an array and a list of queries [left, right], return the XOR of elements from index left to right for each query. Build a prefix XOR array where prefix[i] = arr[0] XOR ... XOR arr[i-1]. Answer each query in O(1) using XOR property: query(l, r) = prefix[r+1] XOR prefix[l].',
  tags: ['bit manipulation', 'prefix sum', 'array'],

  code: {
    pseudocode: `function xorQueries(arr, queries):
  n = len(arr)
  prefix = array of n+1 zeros
  for i from 0 to n-1:
    prefix[i+1] = prefix[i] XOR arr[i]
  result = []
  for [left, right] in queries:
    result.append(prefix[right+1] XOR prefix[left])
  return result`,

    python: `def xorQueries(arr, queries):
    prefix = [0] * (len(arr) + 1)
    for i, v in enumerate(arr):
        prefix[i+1] = prefix[i] ^ v
    return [prefix[r+1] ^ prefix[l] for l, r in queries]`,

    javascript: `function xorQueries(arr, queries) {
  const prefix = new Array(arr.length + 1).fill(0);
  for (let i = 0; i < arr.length; i++) {
    prefix[i + 1] = prefix[i] ^ arr[i];
  }
  return queries.map(([l, r]) => prefix[r + 1] ^ prefix[l]);
}`,

    java: `public int[] xorQueries(int[] arr, int[][] queries) {
    int[] prefix = new int[arr.length + 1];
    for (int i = 0; i < arr.length; i++) prefix[i+1] = prefix[i] ^ arr[i];
    int[] result = new int[queries.length];
    for (int i = 0; i < queries.length; i++)
        result[i] = prefix[queries[i][1]+1] ^ prefix[queries[i][0]];
    return result;
}`,
  },

  defaultInput: {
    arr: [1, 3, 4, 8],
    queries: [[0, 1], [1, 2], [0, 3], [3, 3]],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 4, 8],
      placeholder: '1,3,4,8',
      helperText: 'Non-negative integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const queries = (input.queries as number[][]) ?? [[0, 1], [1, 2], [0, 3], [3, 3]];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr2: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr2,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build prefix XOR for [${arr.join(', ')}]. prefix[i+1] = prefix[i] XOR arr[i].`,
      variables: { arr: [...arr] },
      visualization: makeViz([...arr], {}, {}),
    });

    const prefix = new Array(arr.length + 1).fill(0);
    for (let i = 0; i < arr.length; i++) {
      prefix[i + 1] = prefix[i] ^ arr[i];
      steps.push({
        line: 4,
        explanation: `prefix[${i + 1}] = prefix[${i}] XOR arr[${i}] = ${prefix[i]} XOR ${arr[i]} = ${prefix[i + 1]}.`,
        variables: { i, 'prefix[i]': prefix[i], 'arr[i]': arr[i], 'prefix[i+1]': prefix[i + 1] },
        visualization: makeViz([...prefix.slice(0, i + 2)],
          { [i + 1]: 'active', [i]: 'comparing' },
          Object.fromEntries(prefix.slice(0, i + 2).map((v, idx) => [idx, `p[${idx}]=${v}`]))
        ),
      });
    }

    const results: number[] = [];
    for (const [l, r] of queries) {
      const ans = prefix[r + 1] ^ prefix[l];
      results.push(ans);
      steps.push({
        line: 7,
        explanation: `Query [${l}, ${r}]: prefix[${r + 1}] XOR prefix[${l}] = ${prefix[r + 1]} XOR ${prefix[l]} = ${ans}. XOR of arr[${l}..${r}].`,
        variables: { l, r, 'prefix[r+1]': prefix[r + 1], 'prefix[l]': prefix[l], answer: ans },
        visualization: makeViz([...arr],
          Object.fromEntries(arr.map((_, idx) => [idx, idx >= l && idx <= r ? 'active' : 'default'])),
          Object.fromEntries(arr.map((_, idx) => [idx, idx >= l && idx <= r ? `XOR` : '']))
        ),
      });
    }

    steps.push({
      line: 8,
      explanation: `All queries answered: [${results.join(', ')}].`,
      variables: { result: results },
      visualization: makeViz(results, Object.fromEntries(results.map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default xorQueriesOfSubarray;
