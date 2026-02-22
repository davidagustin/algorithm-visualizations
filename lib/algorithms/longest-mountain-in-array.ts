import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestMountainInArray: AlgorithmDefinition = {
  id: 'longest-mountain-in-array',
  title: 'Longest Mountain in Array',
  leetcodeNumber: 845,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Find the length of the longest mountain subarray. A mountain has at least 3 elements: it strictly increases to a peak then strictly decreases. Use two pointers: from each potential peak, expand left and right to measure the mountain.',
  tags: ['two pointers', 'array', 'enumeration'],

  code: {
    pseudocode: `function longestMountain(arr):
  n = length(arr)
  ans = 0
  i = 1
  while i < n - 1:
    if arr[i-1] < arr[i] and arr[i] > arr[i+1]:
      left = i - 1
      right = i + 1
      while left > 0 and arr[left-1] < arr[left]: left--
      while right < n-1 and arr[right] > arr[right+1]: right++
      ans = max(ans, right - left + 1)
      i = right
    else:
      i++
  return ans`,

    python: `def longestMountain(arr: list[int]) -> int:
    n, ans, i = len(arr), 0, 1
    while i < n - 1:
        if arr[i-1] < arr[i] > arr[i+1]:
            left, right = i - 1, i + 1
            while left > 0 and arr[left-1] < arr[left]: left -= 1
            while right < n-1 and arr[right] > arr[right+1]: right += 1
            ans = max(ans, right - left + 1)
            i = right
        else:
            i += 1
    return ans`,

    javascript: `function longestMountain(arr) {
  const n = arr.length;
  let ans = 0, i = 1;
  while (i < n - 1) {
    if (arr[i-1] < arr[i] && arr[i] > arr[i+1]) {
      let left = i - 1, right = i + 1;
      while (left > 0 && arr[left-1] < arr[left]) left--;
      while (right < n-1 && arr[right] > arr[right+1]) right++;
      ans = Math.max(ans, right - left + 1);
      i = right;
    } else {
      i++;
    }
  }
  return ans;
}`,

    java: `public int longestMountain(int[] arr) {
    int n = arr.length, ans = 0, i = 1;
    while (i < n - 1) {
        if (arr[i-1] < arr[i] && arr[i] > arr[i+1]) {
            int left = i - 1, right = i + 1;
            while (left > 0 && arr[left-1] < arr[left]) left--;
            while (right < n-1 && arr[right] > arr[right+1]) right++;
            ans = Math.max(ans, right - left + 1);
            i = right;
        } else i++;
    }
    return ans;
}`,
  },

  defaultInput: {
    arr: [2, 1, 4, 7, 3, 2, 5],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 4, 7, 3, 2, 5],
      placeholder: '2,1,4,7,3,2,5',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const n = arr.length;
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

    let ans = 0;
    let i = 1;

    steps.push({
      line: 1,
      explanation: `Start scanning for mountain peaks. A peak has arr[i-1] < arr[i] > arr[i+1].`,
      variables: { ans, i },
      visualization: makeViz({}, {}),
    });

    while (i < n - 1) {
      const isPeak = arr[i - 1] < arr[i] && arr[i] > arr[i + 1];

      steps.push({
        line: 5,
        explanation: `Check index ${i}: arr[${i - 1}]=${arr[i - 1]}, arr[${i}]=${arr[i]}, arr[${i + 1}]=${arr[i + 1]}. ${isPeak ? 'Peak found!' : 'Not a peak, move on.'}`,
        variables: { i, isPeak },
        visualization: makeViz({ [i - 1]: 'comparing', [i]: isPeak ? 'active' : 'default', [i + 1]: 'comparing' }, { [i]: 'i' }),
      });

      if (isPeak) {
        let left = i - 1;
        let right = i + 1;

        while (left > 0 && arr[left - 1] < arr[left]) left--;
        while (right < n - 1 && arr[right] > arr[right + 1]) right++;

        const len = right - left + 1;
        if (len > ans) ans = len;

        steps.push({
          line: 10,
          explanation: `Mountain extends from index ${left} to ${right}. Length=${len}. ans=${ans}.`,
          variables: { left, right, len, ans },
          visualization: makeViz(
            {
              ...Object.fromEntries(Array.from({ length: len }, (_, k) => [k + left, 'found'])),
              [i]: 'active',
            },
            { [left]: 'L', [i]: 'peak', [right]: 'R' }
          ),
        });

        i = right;
      } else {
        i++;
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Longest mountain has length ${ans}.`,
      variables: { ans },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestMountainInArray;
