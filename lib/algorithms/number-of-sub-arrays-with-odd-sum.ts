import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfSubArraysWithOddSum: AlgorithmDefinition = {
  id: 'number-of-sub-arrays-with-odd-sum',
  title: 'Number of Sub-arrays With Odd Sum',
  leetcodeNumber: 1524,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Count subarrays with an odd sum. Track counts of even and odd prefix sums. A subarray [i..j] has odd sum iff prefixSum[j] and prefixSum[i-1] have different parities. For each new prefix sum, add the count of prefix sums with opposite parity. O(n) time.',
  tags: ['Prefix Sum', 'Array', 'Math'],
  code: {
    pseudocode: `function numOfSubarrays(arr):
  MOD = 1e9+7
  count = 0, prefixSum = 0
  even = 1, odd = 0  # counts of even/odd prefix sums
  for num in arr:
    prefixSum += num
    if prefixSum % 2 == 1:
      count += even; odd++
    else:
      count += odd; even++
  return count % MOD`,
    python: `def numOfSubarrays(arr: list[int]) -> int:
    MOD = 10**9 + 7
    count = prefix_sum = 0
    even, odd = 1, 0
    for num in arr:
        prefix_sum += num
        if prefix_sum % 2 == 1:
            count += even
            odd += 1
        else:
            count += odd
            even += 1
    return count % MOD`,
    javascript: `function numOfSubarrays(arr) {
  const MOD = 1_000_000_007;
  let count = 0, prefixSum = 0, even = 1, odd = 0;
  for (const num of arr) {
    prefixSum += num;
    if (prefixSum % 2 === 1) { count += even; odd++; }
    else { count += odd; even++; }
  }
  return count % MOD;
}`,
    java: `public int numOfSubarrays(int[] arr) {
    final int MOD = 1_000_000_007;
    long count = 0; int prefixSum = 0, even = 1, odd = 0;
    for (int num : arr) {
        prefixSum += num;
        if (prefixSum % 2 == 1) { count += even; odd++; }
        else { count += odd; even++; }
    }
    return (int)(count % MOD);
}`,
  },
  defaultInput: { arr: [1, 3, 5] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 3, 5],
      placeholder: '1,3,5',
      helperText: 'Positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    let count = 0;
    let prefixSum = 0;
    let even = 1;
    let odd = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Parity Counts',
        entries: [
          { key: 'even prefix sums', value: String(even) },
          { key: 'odd prefix sums', value: String(odd) },
          { key: 'count', value: String(count) },
        ],
      },
    });

    steps.push({
      line: 1,
      explanation: `Count subarrays with odd sum. arr = [${arr.join(', ')}]. Track even/odd prefix sum counts.`,
      variables: { count, even, odd },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefixSum += arr[i];
      const isOdd = prefixSum % 2 === 1;

      steps.push({
        line: 5,
        explanation: `Index ${i}: num=${arr[i]}, prefixSum=${prefixSum} (${isOdd ? 'odd' : 'even'}). Add ${isOdd ? even + ' (even count)' : odd + ' (odd count)'} to count.`,
        variables: { i, num: arr[i], prefixSum, isOdd, even, odd },
        visualization: makeViz(
          { [i]: isOdd ? 'found' : 'active' },
          { [i]: `ps=${prefixSum}${isOdd ? '(odd)' : '(even)'}` },
        ),
      });

      if (isOdd) {
        count += even;
        odd++;
      } else {
        count += odd;
        even++;
      }

      steps.push({
        line: 9,
        explanation: `Updated: count=${count}, even=${even}, odd=${odd}.`,
        variables: { count, even, odd },
        visualization: makeViz({ [i]: isOdd ? 'found' : 'visited' }, { [i]: `cnt=${count}` }),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Total subarrays with odd sum: ${count % 1_000_000_007}.`,
      variables: { result: count % 1_000_000_007 },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        { 0: `ans=${count % 1_000_000_007}` },
      ),
    });

    return steps;
  },
};

export default numberOfSubArraysWithOddSum;
