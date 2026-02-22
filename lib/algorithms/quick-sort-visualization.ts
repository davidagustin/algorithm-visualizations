import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const quickSortVisualization: AlgorithmDefinition = {
  id: 'quick-sort-visualization',
  title: 'Quick Sort',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Partition-based sorting algorithm. Select a pivot element, partition the array so all elements smaller than the pivot are on its left and all larger are on its right, then recursively sort each partition. Average O(n log n) time, O(log n) space.',
  tags: ['sorting', 'divide and conquer', 'partition', 'pivot', 'recursion'],

  code: {
    pseudocode: `function quickSort(arr, low, high):
  if low < high:
    pivot = partition(arr, low, high)
    quickSort(arr, low, pivot - 1)
    quickSort(arr, pivot + 1, high)

function partition(arr, low, high):
  pivot = arr[high]
  i = low - 1
  for j = low to high - 1:
    if arr[j] <= pivot:
      i++
      swap(arr[i], arr[j])
  swap(arr[i+1], arr[high])
  return i + 1`,

    python: `def quick_sort(arr, low=0, high=None):
    if high is None: high = len(arr) - 1
    if low < high:
        pi = partition(arr, low, high)
        quick_sort(arr, low, pi - 1)
        quick_sort(arr, pi + 1, high)

def partition(arr, low, high):
    pivot = arr[high]
    i = low - 1
    for j in range(low, high):
        if arr[j] <= pivot:
            i += 1
            arr[i], arr[j] = arr[j], arr[i]
    arr[i+1], arr[high] = arr[high], arr[i+1]
    return i + 1`,

    javascript: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
}
function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}`,

    java: `public void quickSort(int[] arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
private int partition(int[] arr, int low, int high) {
    int pivot = arr[high], i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] <= pivot) {
            i++;
            int tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
        }
    }
    int tmp = arr[i+1]; arr[i+1] = arr[high]; arr[high] = tmp;
    return i + 1;
}`,
  },

  defaultInput: {
    arr: [10, 7, 8, 9, 1, 5],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [10, 7, 8, 9, 1, 5],
      placeholder: '10,7,8,9,1,5',
      helperText: 'Comma-separated integers to sort',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const initial = input.arr as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...initial];
    const n = arr.length;
    const sortedIndices = new Set<number>();

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => {
      const merged: Record<number, string> = {};
      sortedIndices.forEach((i) => { merged[i] = 'sorted'; });
      for (const [k, v] of Object.entries(highlights)) merged[Number(k)] = v;
      return { type: 'array', array: [...arr], highlights: merged, labels };
    };

    steps.push({
      line: 1,
      explanation: `Quick sort on [${arr.join(', ')}]. Last element is pivot for each partition.`,
      variables: { array: [...arr] },
      visualization: makeViz({}, {}),
    });

    const quickSort = (low: number, high: number) => {
      if (low >= high) {
        if (low === high) sortedIndices.add(low);
        return;
      }

      const pivotVal = arr[high];

      steps.push({
        line: 7,
        explanation: `Partition range [${low}, ${high}]. Pivot = arr[${high}] = ${pivotVal}.`,
        variables: { low, high, pivot: pivotVal },
        visualization: makeViz(
          { [high]: 'active' },
          { [low]: 'lo', [high]: 'pivot' }
        ),
      });

      let i = low - 1;
      for (let j = low; j < high; j++) {
        steps.push({
          line: 9,
          explanation: `Compare arr[${j}]=${arr[j]} with pivot ${pivotVal}.`,
          variables: { i, j, 'arr[j]': arr[j], pivot: pivotVal },
          visualization: makeViz(
            { [j]: 'comparing', [high]: 'active' },
            { [j]: 'j', [high]: 'pivot', ...(i >= low ? { [i]: 'i' } : {}) }
          ),
        });

        if (arr[j] <= pivotVal) {
          i++;
          if (i !== j) {
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({
              line: 11,
              explanation: `arr[${j}]=${arr[j + i === j ? 0 : 0]} <= pivot. Swap arr[${i}] and arr[${j}]: now arr[${i}]=${arr[i]}, arr[${j}]=${arr[j]}.`,
              variables: { i, j, 'arr[i]': arr[i], 'arr[j]': arr[j] },
              visualization: makeViz(
                { [i]: 'swapping', [j]: 'swapping', [high]: 'active' },
                { [i]: 'i', [j]: 'j', [high]: 'pivot' }
              ),
            });
          }
        }
      }

      // Place pivot in final position
      const pivotPos = i + 1;
      [arr[pivotPos], arr[high]] = [arr[high], arr[pivotPos]];
      sortedIndices.add(pivotPos);

      steps.push({
        line: 12,
        explanation: `Place pivot ${pivotVal} at its final position ${pivotPos}. Elements left of it are <= ${pivotVal}, right are > ${pivotVal}.`,
        variables: { pivotPos, pivotVal },
        visualization: makeViz(
          { [pivotPos]: 'found' },
          { [pivotPos]: 'final' }
        ),
      });

      quickSort(low, pivotPos - 1);
      quickSort(pivotPos + 1, high);
    };

    quickSort(0, n - 1);

    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalHL[i] = 'sorted';

    steps.push({
      line: 1,
      explanation: `Quick sort complete! Sorted array: [${arr.join(', ')}].`,
      variables: { result: [...arr] },
      visualization: { type: 'array', array: [...arr], highlights: finalHL, labels: {} },
    });

    return steps;
  },
};

export default quickSortVisualization;
