import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const timSortVisualization: AlgorithmDefinition = {
  id: 'tim-sort-visualization',
  title: 'TimSort Visualization',
  difficulty: 'Hard',
  category: 'Sorting',
  description:
    'TimSort is a hybrid sorting algorithm derived from merge sort and insertion sort. It divides the array into small "runs" (typically 32-64 elements) and sorts each with insertion sort, then merges the runs using merge sort. Designed for real-world data that often has naturally ordered subsequences. Used in Python and Java built-in sort.',
  tags: ['sorting', 'merge sort', 'insertion sort', 'hybrid', 'adaptive'],

  code: {
    pseudocode: `function timSort(arr, RUN=4):
  n = len(arr)
  // Sort each run with insertion sort
  for start in range(0, n, RUN):
    insertionSort(arr, start, min(start+RUN-1, n-1))
  // Merge runs
  size = RUN
  while size < n:
    for left in range(0, n, 2*size):
      mid = min(left+size-1, n-1)
      right = min(left+2*size-1, n-1)
      if mid < right:
        merge(arr, left, mid, right)
    size *= 2`,

    python: `def timSort(arr, RUN=4):
    n = len(arr)
    for i in range(0, n, RUN):
        end = min(i + RUN - 1, n - 1)
        for j in range(i+1, end+1):
            key = arr[j]
            k = j - 1
            while k >= i and arr[k] > key:
                arr[k+1] = arr[k]
                k -= 1
            arr[k+1] = key
    size = RUN
    while size < n:
        for left in range(0, n, 2*size):
            mid = min(left+size-1, n-1)
            right = min(left+2*size-1, n-1)
            if mid < right:
                merge(arr, left, mid, right)
        size *= 2`,

    javascript: `function timSort(arr, RUN = 4) {
  const n = arr.length;
  for (let i = 0; i < n; i += RUN) {
    const end = Math.min(i + RUN - 1, n - 1);
    for (let j = i+1; j <= end; j++) {
      const key = arr[j]; let k = j-1;
      while (k >= i && arr[k] > key) { arr[k+1] = arr[k]; k--; }
      arr[k+1] = key;
    }
  }
  for (let size = RUN; size < n; size *= 2) {
    for (let left = 0; left < n; left += 2*size) {
      const mid = Math.min(left+size-1, n-1);
      const right = Math.min(left+2*size-1, n-1);
      if (mid < right) merge(arr, left, mid, right);
    }
  }
}`,

    java: `public void timSort(int[] arr) {
    int RUN = 4, n = arr.length;
    for (int i = 0; i < n; i += RUN) {
        int end = Math.min(i + RUN - 1, n - 1);
        for (int j = i+1; j <= end; j++) {
            int key = arr[j]; int k = j-1;
            while (k >= i && arr[k] > key) { arr[k+1] = arr[k]; k--; }
            arr[k+1] = key;
        }
    }
    for (int size = RUN; size < n; size *= 2) {
        for (int left = 0; left < n; left += 2*size) {
            int mid = Math.min(left+size-1, n-1);
            int right = Math.min(left+2*size-1, n-1);
            if (mid < right) merge(arr, left, mid, right);
        }
    }
}`,
  },

  defaultInput: {
    nums: [5, 21, 7, 23, 19, 2, 11, 3, 14, 6, 18, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [5, 21, 7, 23, 19, 2, 11, 3, 14, 6, 18, 1],
      placeholder: '5,21,7,23,19,2,11,3',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const RUN = 4;

    steps.push({
      line: 1,
      explanation: `TimSort on [${arr.join(', ')}]. RUN size=${RUN}. Phase 1: insertion sort each run of size ${RUN}.`,
      variables: { n, RUN },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: Object.fromEntries(arr.map((_, i) => [i, `run${Math.floor(i / RUN)}`])),
      },
    });

    // Phase 1: insertion sort each run
    for (let i = 0; i < n; i += RUN) {
      const end = Math.min(i + RUN - 1, n - 1);

      steps.push({
        line: 3,
        explanation: `Insertion sort run [${i}..${end}]: [${arr.slice(i, end + 1).join(', ')}].`,
        variables: { runStart: i, runEnd: end },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, j) => [j, j >= i && j <= end ? 'active' : 'default'])),
          labels: Object.fromEntries(arr.map((_, j) => [j, j >= i && j <= end ? `run${Math.floor(i / RUN)}` : ''])),
        },
      });

      for (let j = i + 1; j <= end; j++) {
        const key = arr[j];
        let k = j - 1;

        while (k >= i && arr[k] > key) {
          arr[k + 1] = arr[k];
          k--;
        }
        arr[k + 1] = key;

        steps.push({
          line: 5,
          explanation: `Inserted ${key} at position ${k + 1} within run. Run now: [${arr.slice(i, end + 1).join(', ')}].`,
          variables: { key, position: k + 1 },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [k + 1]: 'found' },
            labels: { [k + 1]: `ins ${key}` },
          },
        });
      }
    }

    steps.push({
      line: 7,
      explanation: `Phase 1 done. All runs sorted. Array: [${arr.join(', ')}]. Phase 2: merge runs.`,
      variables: { afterPhase1: `[${arr.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(arr.map((_, i) => [i, `run${Math.floor(i / RUN)}`])),
      },
    });

    // Phase 2: merge runs
    function merge(left: number, mid: number, right: number): void {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);
      let i2 = 0, j2 = 0, k2 = left;

      while (i2 < leftArr.length && j2 < rightArr.length) {
        if (leftArr[i2] <= rightArr[j2]) arr[k2++] = leftArr[i2++];
        else arr[k2++] = rightArr[j2++];
      }
      while (i2 < leftArr.length) arr[k2++] = leftArr[i2++];
      while (j2 < rightArr.length) arr[k2++] = rightArr[j2++];
    }

    for (let size = RUN; size < n; size *= 2) {
      for (let left = 0; left < n; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);
        if (mid < right) {
          steps.push({
            line: 10,
            explanation: `Merge [${left}..${mid}] with [${mid + 1}..${right}] (size=${size}).`,
            variables: { left, mid, right, size },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: Object.fromEntries(arr.map((_, i) => [i,
                i >= left && i <= mid ? 'active' :
                i > mid && i <= right ? 'comparing' :
                'default'
              ])),
              labels: { [left]: 'L', [mid]: 'M', [right]: 'R' },
            },
          });
          merge(left, mid, right);
          steps.push({
            line: 11,
            explanation: `After merge: [${arr.slice(left, right + 1).join(', ')}] at positions [${left}..${right}].`,
            variables: { merged: arr.slice(left, right + 1).join(', ') },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: Object.fromEntries(arr.map((_, i) => [i, i >= left && i <= right ? 'found' : 'default'])),
              labels: {},
            },
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `TimSort complete. Sorted: [${arr.join(', ')}].`,
      variables: { sorted: `[${arr.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((_, i) => [i, 'sorted'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default timSortVisualization;
