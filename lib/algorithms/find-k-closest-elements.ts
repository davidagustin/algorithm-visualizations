import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findKClosestElements: AlgorithmDefinition = {
  id: 'find-k-closest-elements',
  title: 'Find K Closest Elements',
  leetcodeNumber: 658,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Find k closest elements to target x in a sorted array. Binary search for the left boundary of the window: compare the distance of arr[mid] and arr[mid+k] from x to decide whether to shift the window left or right. Returns a sorted window of size k.',
  tags: ['binary search', 'array', 'sorted', 'sliding window'],

  code: {
    pseudocode: `function findClosestElements(arr, k, x):
  left = 0, right = len(arr) - k
  while left < right:
    mid = left + (right - left) / 2
    if x - arr[mid] > arr[mid + k] - x:
      left = mid + 1
    else:
      right = mid
  return arr[left : left + k]`,

    python: `def findClosestElements(arr: list[int], k: int, x: int) -> list[int]:
    left, right = 0, len(arr) - k
    while left < right:
        mid = left + (right - left) // 2
        if x - arr[mid] > arr[mid + k] - x:
            left = mid + 1
        else:
            right = mid
    return arr[left:left + k]`,

    javascript: `function findClosestElements(arr, k, x) {
  let left = 0, right = arr.length - k;
  while (left < right) {
    const mid = left + Math.floor((right - left) / 2);
    if (x - arr[mid] > arr[mid + k] - x) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }
  return arr.slice(left, left + k);
}`,

    java: `public List<Integer> findClosestElements(int[] arr, int k, int x) {
    int left = 0, right = arr.length - k;
    while (left < right) {
        int mid = left + (right - left) / 2;
        if (x - arr[mid] > arr[mid + k] - x) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }
    List<Integer> result = new ArrayList<>();
    for (int i = left; i < left + k; i++) result.add(arr[i]);
    return result;
}`,
  },

  defaultInput: {
    arr: [1, 2, 3, 4, 5, 6, 7],
    k: 3,
    x: 4,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 6, 7],
      placeholder: '1,2,3,4,5,6,7',
      helperText: 'Comma-separated sorted integers',
    },
    {
      name: 'k',
      label: 'k (window size)',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Number of closest elements to return',
    },
    {
      name: 'x',
      label: 'Target x',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Target value to find closest elements to',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const k = input.k as number;
    const x = input.x as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      auxData: {
        label: 'Window Search',
        entries: [{ key: 'target x', value: String(x) }, { key: 'k', value: String(k) }],
      },
    });

    let left = 0;
    let right = n - k;

    steps.push({
      line: 1,
      explanation: `Binary search for window start. left=0, right=${right} (= n - k = ${n} - ${k}).`,
      variables: { left, right, k, x },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left < right) {
      const mid = left + Math.floor((right - left) / 2);
      const distLeft = x - arr[mid];
      const distRight = arr[mid + k] - x;

      steps.push({
        line: 3,
        explanation: `mid=${mid}: Compare distance of arr[mid]=${arr[mid]} (dist=${distLeft}) vs arr[mid+k]=${arr[mid + k]} (dist=${distRight}) from x=${x}.`,
        variables: { left, right, mid, 'arr[mid]': arr[mid], 'arr[mid+k]': arr[mid + k], distLeft, distRight },
        visualization: makeViz(
          { [mid]: 'comparing', [mid + k]: 'comparing', [left]: 'pointer', [right]: 'pointer' },
          { [mid]: 'mid', [mid + k]: `m+k`, [left]: 'L', [right]: 'R' }
        ),
      });

      if (distLeft > distRight) {
        steps.push({
          line: 5,
          explanation: `arr[mid]=${arr[mid]} is farther from x (dist=${distLeft} > ${distRight}). Shift window right: left = ${mid + 1}.`,
          variables: { left: mid + 1, right },
          visualization: makeViz(
            { [mid]: 'visited', [mid + k]: 'active', [mid + 1]: 'pointer', [right]: 'pointer' },
            { [mid + 1]: 'L', [right]: 'R' }
          ),
        });
        left = mid + 1;
      } else {
        steps.push({
          line: 7,
          explanation: `arr[mid+k]=${arr[mid + k]} is farther or equal (dist=${distRight} >= ${distLeft}). Keep or shrink right: right = ${mid}.`,
          variables: { left, right: mid },
          visualization: makeViz(
            { [mid]: 'active', [mid + k]: 'visited', [left]: 'pointer', [mid]: 'pointer' },
            { [left]: 'L', [mid]: 'R' }
          ),
        });
        right = mid;
      }
    }

    // Highlight the result window
    const windowHighlights: Record<number, string> = {};
    const windowLabels: Record<number, string> = {};
    for (let i = left; i < left + k; i++) {
      windowHighlights[i] = 'found';
      windowLabels[i] = 'in';
    }

    steps.push({
      line: 8,
      explanation: `Window starts at index ${left}. Result: [${arr.slice(left, left + k).join(', ')}].`,
      variables: { windowStart: left, result: arr.slice(left, left + k) },
      visualization: makeViz(windowHighlights, windowLabels),
    });

    return steps;
  },
};

export default findKClosestElements;
