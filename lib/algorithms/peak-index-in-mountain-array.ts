import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const peakIndexInMountainArray: AlgorithmDefinition = {
  id: 'peak-index-in-mountain-array',
  title: 'Peak Index in Mountain Array',
  leetcodeNumber: 852,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given a mountain array where elements increase to a peak then decrease, find the index of the peak element. Binary search compares the mid element with its neighbor: if arr[mid] < arr[mid+1], the peak is to the right; otherwise it is at or to the left of mid.',
  tags: ['binary search', 'array', 'mountain array'],

  code: {
    pseudocode: `function peakIndexInMountainArray(arr):
  left = 0
  right = length(arr) - 1
  while left < right:
    mid = (left + right) / 2
    if arr[mid] < arr[mid + 1]:
      left = mid + 1
    else:
      right = mid
  return left`,

    python: `def peakIndexInMountainArray(arr: list[int]) -> int:
    left, right = 0, len(arr) - 1
    while left < right:
        mid = (left + right) // 2
        if arr[mid] < arr[mid + 1]:
            left = mid + 1
        else:
            right = mid
    return left`,

    javascript: `function peakIndexInMountainArray(arr) {
  let left = 0, right = arr.length - 1;
  while (left < right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < arr[mid + 1]) left = mid + 1;
    else right = mid;
  }
  return left;
}`,

    java: `public int peakIndexInMountainArray(int[] arr) {
    int left = 0, right = arr.length - 1;
    while (left < right) {
        int mid = (left + right) / 2;
        if (arr[mid] < arr[mid + 1]) left = mid + 1;
        else right = mid;
    }
    return left;
}`,
  },

  defaultInput: {
    arr: [0, 2, 5, 9, 7, 4, 1],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Mountain Array',
      type: 'array',
      defaultValue: [0, 2, 5, 9, 7, 4, 1],
      placeholder: '0,2,5,9,7,4,1',
      helperText: 'A mountain array: values increase then decrease',
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

    let left = 0;
    let right = arr.length - 1;

    steps.push({
      line: 1,
      explanation: `Find peak index in mountain array [${arr.join(', ')}]. Initialize left=0, right=${right}.`,
      variables: { left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        line: 4,
        explanation: `mid=${mid}. arr[${mid}]=${arr[mid]}, arr[${mid + 1}]=${arr[mid + 1]}. Compare neighbors.`,
        variables: { left, right, mid, 'arr[mid]': arr[mid], 'arr[mid+1]': arr[mid + 1] },
        visualization: makeViz(
          { [left]: 'active', [right]: 'active', [mid]: 'comparing', [mid + 1]: 'comparing' },
          { [left]: 'L', [right]: 'R', [mid]: `mid=${mid}`, [mid + 1]: 'mid+1' }
        ),
      });

      if (arr[mid] < arr[mid + 1]) {
        steps.push({
          line: 6,
          explanation: `arr[${mid}]=${arr[mid]} < arr[${mid + 1}]=${arr[mid + 1]}. Still ascending. Peak is to the right. left = ${mid + 1}.`,
          variables: { left, right, mid },
          visualization: makeViz(
            { [mid]: 'mismatch', [mid + 1]: 'active' },
            { [mid]: 'ascending', [mid + 1]: 'go right' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 8,
          explanation: `arr[${mid}]=${arr[mid]} >= arr[${mid + 1}]=${arr[mid + 1]}. Descending or at peak. right = ${mid}.`,
          variables: { left, right, mid },
          visualization: makeViz(
            { [mid]: 'active', [mid + 1]: 'mismatch' },
            { [mid]: 'peak?', [mid + 1]: 'descending' }
          ),
        });
        right = mid;
      }
    }

    steps.push({
      line: 9,
      explanation: `left == right == ${left}. Peak index is ${left} with value ${arr[left]}.`,
      variables: { result: left, peakValue: arr[left] },
      visualization: makeViz(
        { [left]: 'found' },
        { [left]: `peak=${arr[left]}` }
      ),
    });

    return steps;
  },
};

export default peakIndexInMountainArray;
