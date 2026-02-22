import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const shellSortVisualization: AlgorithmDefinition = {
  id: 'shell-sort-visualization',
  title: 'Shell Sort Visualization',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Shell sort is a generalization of insertion sort. It starts by sorting elements far apart from each other and progressively reducing the gap. Common gap sequence: n/2, n/4, ..., 1. For each gap, perform an insertion sort on elements spaced "gap" apart. When gap=1, this is a standard insertion sort on a nearly-sorted array.',
  tags: ['sorting', 'insertion sort', 'gap sequence', 'in-place'],

  code: {
    pseudocode: `function shellSort(arr):
  gap = len(arr) / 2
  while gap > 0:
    for i in gap..n-1:
      temp = arr[i]
      j = i
      while j >= gap and arr[j-gap] > temp:
        arr[j] = arr[j-gap]
        j -= gap
      arr[j] = temp
    gap = gap / 2`,

    python: `def shellSort(arr):
    n = len(arr)
    gap = n // 2
    while gap > 0:
        for i in range(gap, n):
            temp = arr[i]
            j = i
            while j >= gap and arr[j - gap] > temp:
                arr[j] = arr[j - gap]
                j -= gap
            arr[j] = temp
        gap //= 2
    return arr`,

    javascript: `function shellSort(arr) {
  const n = arr.length;
  let gap = Math.floor(n / 2);
  while (gap > 0) {
    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}`,

    java: `public void shellSort(int[] arr) {
    int n = arr.length;
    for (int gap = n/2; gap > 0; gap /= 2) {
        for (int i = gap; i < n; i++) {
            int temp = arr[i];
            int j = i;
            while (j >= gap && arr[j-gap] > temp) {
                arr[j] = arr[j-gap];
                j -= gap;
            }
            arr[j] = temp;
        }
    }
}`,
  },

  defaultInput: {
    nums: [64, 34, 25, 12, 22, 11, 90],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [64, 34, 25, 12, 22, 11, 90],
      placeholder: '64,34,25,12,22,11,90',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Shell Sort starting on [${arr.join(', ')}]. Initial gap = ${Math.floor(n / 2)}.`,
      variables: { n, gap: Math.floor(n / 2) },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: Object.fromEntries(arr.map((_, i) => [i, `${i}`])),
      },
    });

    let gap = Math.floor(n / 2);

    while (gap > 0) {
      steps.push({
        line: 2,
        explanation: `New gap = ${gap}. Performing insertion sort on elements ${gap} positions apart.`,
        variables: { gap },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, i) => [i, i % gap === 0 ? 'active' : 'default'])),
          labels: Object.fromEntries(arr.map((_, i) => [i, i % gap === 0 ? `gap${gap}` : ''])),
        },
      });

      for (let i = gap; i < n; i++) {
        const temp = arr[i];
        let j = i;

        steps.push({
          line: 4,
          explanation: `Consider arr[${i}]=${temp} (gap=${gap}). Compare with arr[${i - gap}]=${arr[i - gap]}.`,
          variables: { i, temp, gap, 'arr[i-gap]': arr[i - gap] },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [i]: 'active', [i - gap]: 'comparing' },
            labels: { [i]: 'temp', [i - gap]: 'compare' },
          },
        });

        while (j >= gap && arr[j - gap] > temp) {
          arr[j] = arr[j - gap];

          steps.push({
            line: 6,
            explanation: `arr[${j - gap}]=${arr[j]} > temp=${temp}. Shift arr[${j - gap}] right to arr[${j}].`,
            variables: { j, 'arr[j]': arr[j], temp },
            visualization: {
              type: 'array',
              array: [...arr],
              highlights: { [j]: 'swapping', [j - gap]: 'active' },
              labels: { [j]: 'shifted', [j - gap]: 'from' },
            },
          });

          j -= gap;
        }

        arr[j] = temp;

        steps.push({
          line: 8,
          explanation: `Place temp=${temp} at position j=${j}. Array after this insertion: [${arr.join(', ')}].`,
          variables: { j, temp, gap },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [j]: 'found' },
            labels: { [j]: `placed ${temp}` },
          },
        });
      }

      gap = Math.floor(gap / 2);
    }

    steps.push({
      line: 9,
      explanation: `Shell Sort complete. Sorted array: [${arr.join(', ')}].`,
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

export default shellSortVisualization;
