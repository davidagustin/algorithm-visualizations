import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const threeWayPartition: AlgorithmDefinition = {
  id: 'three-way-partition',
  title: 'Three-Way Partition (Dutch National Flag)',
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'The three-way partition (Dutch National Flag problem by Dijkstra) partitions an array into three groups: elements less than pivot, elements equal to pivot, and elements greater than pivot. Uses three pointers: low, mid, and high. Efficiently handles arrays with many duplicates, improving quicksort to O(n log n) even with repeated elements.',
  tags: ['sorting', 'quicksort', 'partition', 'dutch national flag', 'three pointers'],

  code: {
    pseudocode: `function threeWayPartition(arr, pivot):
  low = 0, mid = 0, high = n-1
  while mid <= high:
    if arr[mid] < pivot:
      swap(arr[low], arr[mid])
      low++, mid++
    elif arr[mid] == pivot:
      mid++
    else:
      swap(arr[mid], arr[high])
      high--`,

    python: `def threeWayPartition(arr, pivot):
    low, mid, high = 0, 0, len(arr) - 1
    while mid <= high:
        if arr[mid] < pivot:
            arr[low], arr[mid] = arr[mid], arr[low]
            low += 1
            mid += 1
        elif arr[mid] == pivot:
            mid += 1
        else:
            arr[mid], arr[high] = arr[high], arr[mid]
            high -= 1
    return arr`,

    javascript: `function threeWayPartition(arr, pivot) {
  let low = 0, mid = 0, high = arr.length - 1;
  while (mid <= high) {
    if (arr[mid] < pivot) {
      [arr[low], arr[mid]] = [arr[mid], arr[low]];
      low++; mid++;
    } else if (arr[mid] === pivot) {
      mid++;
    } else {
      [arr[mid], arr[high]] = [arr[high], arr[mid]];
      high--;
    }
  }
  return arr;
}`,

    java: `public void threeWayPartition(int[] arr, int pivot) {
    int low = 0, mid = 0, high = arr.length - 1;
    while (mid <= high) {
        if (arr[mid] < pivot) {
            int tmp = arr[low]; arr[low] = arr[mid]; arr[mid] = tmp;
            low++; mid++;
        } else if (arr[mid] == pivot) {
            mid++;
        } else {
            int tmp = arr[mid]; arr[mid] = arr[high]; arr[high] = tmp;
            high--;
        }
    }
}`,
  },

  defaultInput: {
    nums: [2, 0, 2, 1, 1, 0, 2, 1],
    pivot: 1,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 0, 2, 1, 1, 0, 2, 1],
      placeholder: '2,0,2,1,1,0,2,1',
      helperText: 'Comma-separated integers to partition',
    },
    {
      name: 'pivot',
      label: 'Pivot Value',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'The pivot value to partition around',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.nums as number[])];
    const pivot = input.pivot as number;
    const steps: AlgorithmStep[] = [];
    const n = arr.length;

    steps.push({
      line: 1,
      explanation: `Three-Way Partition on [${arr.join(', ')}] with pivot=${pivot}. Initialize low=0, mid=0, high=${n - 1}.`,
      variables: { low: 0, mid: 0, high: n - 1, pivot },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: { 0: 'active' },
        labels: { 0: 'low=mid', [n - 1]: 'high' },
      },
    });

    let low = 0;
    let mid = 0;
    let high = n - 1;

    while (mid <= high) {
      const makeHighlights = () => {
        const h: Record<number, string> = {};
        if (low < arr.length) h[low] = 'pointer';
        if (mid < arr.length && mid !== low) h[mid] = 'active';
        if (mid === low) h[low] = 'comparing';
        if (high >= 0 && high !== mid && high !== low) h[high] = 'pointer';
        return h;
      };
      const makeLabels = () => {
        const l: Record<number, string> = {};
        if (low < arr.length) l[low] = `low=${low}`;
        if (mid < arr.length && mid !== low) l[mid] = `mid=${mid}`;
        if (high >= 0 && high !== mid && high !== low) l[high] = `high=${high}`;
        return l;
      };

      steps.push({
        line: 3,
        explanation: `mid=${mid} <= high=${high}. arr[mid]=${arr[mid]} vs pivot=${pivot}. low=${low}.`,
        variables: { low, mid, high, 'arr[mid]': arr[mid], pivot },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: makeHighlights(),
          labels: makeLabels(),
        },
      });

      if (arr[mid] < pivot) {
        const tmp = arr[low];
        arr[low] = arr[mid];
        arr[mid] = tmp;

        steps.push({
          line: 5,
          explanation: `arr[mid]=${arr[mid]} < pivot=${pivot}. Swap arr[${low}] and arr[${mid}]. Move low and mid forward.`,
          variables: { swapped: `arr[${low}]<->arr[${mid}]`, low: low + 1, mid: mid + 1 },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [low]: 'swapping', [mid]: 'swapping' },
            labels: { [low]: 'swapped', [mid]: 'swapped' },
          },
        });
        low++;
        mid++;
      } else if (arr[mid] === pivot) {
        steps.push({
          line: 7,
          explanation: `arr[mid]=${arr[mid]} == pivot=${pivot}. Element in correct zone. Advance mid.`,
          variables: { mid: mid + 1 },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [mid]: 'found' },
            labels: { [mid]: `=pivot` },
          },
        });
        mid++;
      } else {
        const tmp = arr[mid];
        arr[mid] = arr[high];
        arr[high] = tmp;

        steps.push({
          line: 9,
          explanation: `arr[mid]=${arr[high]} > pivot=${pivot}. Swap arr[${mid}] and arr[${high}]. Decrease high.`,
          variables: { swapped: `arr[${mid}]<->arr[${high}]`, high: high - 1 },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [mid]: 'swapping', [high]: 'swapping' },
            labels: { [mid]: 'swapped', [high]: 'swapped' },
          },
        });
        high--;
      }
    }

    steps.push({
      line: 10,
      explanation: `Done. Array partitioned: [${arr.slice(0, low).join(',')}] < ${pivot} | [${arr.slice(low, mid).join(',')}] = ${pivot} | [${arr.slice(mid).join(',')}] > ${pivot}.`,
      variables: { low, mid, result: arr.join(', ') },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: Object.fromEntries(arr.map((v, i) => [i,
          v < pivot ? 'active' : v === pivot ? 'found' : 'comparing'
        ])),
        labels: { 0: '<pivot', [low]: '=pivot', [mid]: '>pivot' },
      },
    });

    return steps;
  },
};

export default threeWayPartition;
