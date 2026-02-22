import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countTripletsThatCanFormTwoArrays: AlgorithmDefinition = {
  id: 'count-triplets-that-can-form-two-arrays',
  title: 'Count Triplets That Can Form Two Arrays of Equal XOR',
  leetcodeNumber: 1442,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given array arr, count triplets (i, j, k) where 0<=i<j<=k<n and a XOR b == 0, where a = arr[i]^...^arr[j-1] and b = arr[j]^...^arr[k]. Since a^b=0 means a==b, and the XOR of the entire range [i,k] must be 0. For each pair (i,k) where XOR([i..k])==0, there are (k-i) valid j values.',
  tags: ['bit manipulation', 'xor', 'array'],

  code: {
    pseudocode: `function countTriplets(arr):
  count = 0
  n = len(arr)
  for i in 0..n-1:
    xor = arr[i]
    for k in i+1..n-1:
      xor ^= arr[k]
      if xor == 0:
        count += k - i  // any j in (i, k] works
  return count`,

    python: `def countTriplets(arr: list[int]) -> int:
    count, n = 0, len(arr)
    for i in range(n - 1):
        xor = arr[i]
        for k in range(i + 1, n):
            xor ^= arr[k]
            if xor == 0:
                count += k - i
    return count`,

    javascript: `function countTriplets(arr) {
  let count = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    let xor = arr[i];
    for (let k = i + 1; k < arr.length; k++) {
      xor ^= arr[k];
      if (xor === 0) count += k - i;
    }
  }
  return count;
}`,

    java: `public int countTriplets(int[] arr) {
    int count = 0;
    for (int i = 0; i < arr.length - 1; i++) {
        int xor = arr[i];
        for (int k = i + 1; k < arr.length; k++) {
            xor ^= arr[k];
            if (xor == 0) count += k - i;
        }
    }
    return count;
}`,
  },

  defaultInput: { arr: [2, 3, 1, 6, 7] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 3, 1, 6, 7],
      placeholder: '2,3,1,6,7',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: { label: 'Count Triplets', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Count triplets (i,j,k) where XOR(arr[i..j-1]) = XOR(arr[j..k]). Equivalently, XOR(arr[i..k]) = 0 and any j in (i,k] works — contributing (k-i) triplets.`,
      variables: { arr },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'active'])),
        {},
        [{ key: 'insight', value: 'if XOR(i..k)=0, count += k-i' }]
      ),
    });

    let count = 0;
    for (let i = 0; i < arr.length - 1; i++) {
      let xor = arr[i];
      steps.push({
        line: 4,
        explanation: `Start at i=${i}, arr[i]=${arr[i]}. XOR = ${xor}.`,
        variables: { i, xor, count },
        visualization: makeViz(
          Object.fromEntries(arr.map((_, j) => [j, j === i ? 'active' : 'default'])),
          { [i]: 'i' },
          [{ key: 'i', value: String(i) }, { key: 'xor', value: String(xor) }, { key: 'count', value: String(count) }]
        ),
      });

      for (let k = i + 1; k < arr.length; k++) {
        xor ^= arr[k];
        const h: Record<number, string> = {};
        for (let j = i; j <= k; j++) h[j] = 'comparing';
        h[i] = 'active';
        h[k] = 'pointer';

        if (xor === 0) {
          count += k - i;
          steps.push({
            line: 7,
            explanation: `XOR(arr[${i}..${k}]) = 0! Any j in (${i},${k}] works: ${k - i} valid triplets. count += ${k - i} → count=${count}.`,
            variables: { i, k, xor: 0, 'new triplets': k - i, count },
            visualization: makeViz(
              Object.fromEntries(arr.map((_, j) => [j, j >= i && j <= k ? 'found' : 'visited'])),
              { [i]: 'i', [k]: 'k' },
              [{ key: `XOR[${i}..${k}]`, value: '0 ✓' }, { key: 'new triplets', value: String(k - i) }, { key: 'count', value: String(count) }]
            ),
          });
        } else {
          steps.push({
            line: 6,
            explanation: `XOR(arr[${i}..${k}]) = ${xor} ≠ 0. No triplets here.`,
            variables: { i, k, xor, count },
            visualization: makeViz(h, { [i]: 'i', [k]: 'k' }, [
              { key: `XOR[${i}..${k}]`, value: `${xor} ≠ 0` },
              { key: 'count', value: String(count) },
            ]),
          });
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Total triplets: ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'result', value: String(count) }]
      ),
    });

    return steps;
  },
};

export default countTripletsThatCanFormTwoArrays;
