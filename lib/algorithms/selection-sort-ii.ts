import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const selectionSortII: AlgorithmDefinition = {
  id: 'selection-sort-ii',
  title: 'Selection Sort II',
  difficulty: 'Easy',
  category: 'Sorting',
  description:
    'Selection sort variant: repeatedly find the minimum element from the unsorted portion and place it at the beginning. Time: O(n²), Space: O(1). Minimizes swaps.',
  tags: ['Sorting', 'Selection Sort', 'In-place', 'Comparison'],
  code: {
    pseudocode: `function selectionSort(arr):
  for i = 0 to n-2:
    minIdx = i
    for j = i+1 to n-1:
      if arr[j] < arr[minIdx]:
        minIdx = j
    swap(arr[i], arr[minIdx])`,
    python: `def selection_sort(arr):
    n = len(arr)
    for i in range(n - 1):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr`,
    javascript: `function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}`,
    java: `public int[] selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) minIdx = j;
        }
        int tmp = arr[i]; arr[i] = arr[minIdx]; arr[minIdx] = tmp;
    }
    return arr;
}`,
  },
  defaultInput: { nums: [64, 25, 12, 22, 11] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [64, 25, 12, 22, 11],
      placeholder: '64,25,12,22,11',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Selection Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Begin selection sort on [${nums.join(', ')}]. Find minimum in unsorted portion each pass.`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;
      const hl: Record<number, string> = {};
      for (let x = 0; x < i; x++) hl[x] = 'found';
      hl[i] = 'active';

      steps.push({
        line: 2,
        explanation: `Pass ${i + 1}: Find minimum in [${i}..${n - 1}]. Current min=${nums[minIdx]} at index ${minIdx}.`,
        variables: { i, minIdx, minVal: nums[minIdx] },
        visualization: makeViz(hl, { [i]: 'i' },
          [{ key: 'Pass', value: String(i + 1) }, { key: 'MinIdx', value: String(minIdx) }]),
      });

      for (let j = i + 1; j < n; j++) {
        const scanHl: Record<number, string> = {};
        for (let x = 0; x < i; x++) scanHl[x] = 'found';
        scanHl[minIdx] = 'pointer';
        scanHl[j] = 'comparing';

        if (nums[j] < nums[minIdx]) {
          minIdx = j;
          steps.push({
            line: 5,
            explanation: `arr[${j}]=${nums[j]} < current min. New minIdx=${j}.`,
            variables: { j, minIdx, minVal: nums[minIdx] },
            visualization: makeViz({ ...scanHl, [j]: 'active' }, { [j]: 'min', [i]: 'i' },
              [{ key: 'New min', value: `${nums[minIdx]} at ${minIdx}` }]),
          });
        } else {
          steps.push({
            line: 4,
            explanation: `Compare arr[${j}]=${nums[j]} with min=${nums[minIdx]}.`,
            variables: { j, minIdx },
            visualization: makeViz(scanHl, { [minIdx]: 'min', [j]: 'j' },
              [{ key: 'Comparing', value: `${nums[j]} vs ${nums[minIdx]}` }]),
          });
        }
      }

      const tmp = nums[i]; nums[i] = nums[minIdx]; nums[minIdx] = tmp;
      const swapHl: Record<number, string> = {};
      for (let x = 0; x <= i; x++) swapHl[x] = 'found';
      swapHl[i] = 'swapping';
      swapHl[minIdx] = 'swapping';

      steps.push({
        line: 6,
        explanation: `Swap arr[${i}]=${nums[i]} to its sorted position. Sorted: [${nums.slice(0, i + 1).join(', ')}].`,
        variables: { swapped: [i, minIdx] },
        visualization: makeViz(swapHl, { [i]: 'sorted' },
          [{ key: 'Swapped', value: `arr[${i}]↔arr[${minIdx}]` }]),
      });
    }

    steps.push({
      line: 1,
      explanation: `Selection sort complete! Sorted: [${nums.join(', ')}].`,
      variables: { result: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: nums.join(', ') }],
      ),
    });

    return steps;
  },
};

export default selectionSortII;
