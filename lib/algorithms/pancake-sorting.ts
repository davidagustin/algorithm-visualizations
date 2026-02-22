import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const pancakeSorting: AlgorithmDefinition = {
  id: 'pancake-sorting',
  title: 'Pancake Sorting',
  leetcodeNumber: 969,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'Sort an array using only pancake flips. A pancake flip of k reverses the first k elements of the array. To sort: find the largest unsorted element, flip it to the front (if not already there), then flip it to its correct position at the end of the unsorted region. Repeat for decreasing subarray sizes. Produces at most 2*(n-1) flips.',
  tags: ['sorting', 'greedy', 'simulation', 'array'],

  code: {
    pseudocode: `function pancakeSort(arr):
  result = []
  for size from n down to 2:
    maxIdx = index of max in arr[0..size-1]
    if maxIdx == size-1: continue
    if maxIdx != 0:
      flip arr[0..maxIdx]
      result.append(maxIdx+1)
    flip arr[0..size-1]
    result.append(size)
  return result`,

    python: `def pancakeSort(arr):
    result = []
    n = len(arr)
    for size in range(n, 1, -1):
        max_idx = arr[:size].index(max(arr[:size]))
        if max_idx == size - 1:
            continue
        if max_idx != 0:
            arr[:max_idx+1] = arr[:max_idx+1][::-1]
            result.append(max_idx + 1)
        arr[:size] = arr[:size][::-1]
        result.append(size)
    return result`,

    javascript: `function pancakeSort(arr) {
  const result = [];
  const flip = k => arr.splice(0, k, ...arr.slice(0, k).reverse());
  for (let size = arr.length; size > 1; size--) {
    const maxIdx = arr.slice(0, size).indexOf(Math.max(...arr.slice(0, size)));
    if (maxIdx === size - 1) continue;
    if (maxIdx !== 0) { flip(maxIdx + 1); result.push(maxIdx + 1); }
    flip(size); result.push(size);
  }
  return result;
}`,

    java: `public List<Integer> pancakeSort(int[] arr) {
    List<Integer> result = new ArrayList<>();
    int n = arr.length;
    for (int size = n; size > 1; size--) {
        int maxIdx = 0;
        for (int i = 1; i < size; i++) if (arr[i] > arr[maxIdx]) maxIdx = i;
        if (maxIdx == size - 1) continue;
        if (maxIdx != 0) {
            reverse(arr, 0, maxIdx);
            result.add(maxIdx + 1);
        }
        reverse(arr, 0, size - 1);
        result.add(size);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [3, 2, 4, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array to Sort',
      type: 'array',
      defaultValue: [3, 2, 4, 1],
      placeholder: '3,2,4,1',
      helperText: 'Comma-separated integers (a permutation)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const flips: number[] = [];

    function flip(k: number): void {
      let lo = 0;
      let hi = k - 1;
      while (lo < hi) {
        const tmp = arr[lo];
        arr[lo] = arr[hi];
        arr[hi] = tmp;
        lo++;
        hi--;
      }
    }

    steps.push({
      line: 1,
      explanation: `Pancake Sort on [${arr.join(', ')}]. Only pancake flips (reverse first k elements) allowed.`,
      variables: { arr: `[${arr.join(', ')}]` },
      visualization: {
        type: 'array',
        array: [...arr],
        highlights: {},
        labels: Object.fromEntries(arr.map((_, i) => [i, `${i}`])),
      },
    });

    for (let size = n; size > 1; size--) {
      const sub = arr.slice(0, size);
      const maxVal = Math.max(...sub);
      const maxIdx = sub.indexOf(maxVal);

      steps.push({
        line: 3,
        explanation: `Unsorted region: arr[0..${size - 1}]=[${arr.slice(0, size).join(', ')}]. Max value=${maxVal} at index ${maxIdx}.`,
        variables: { size, maxVal, maxIdx },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: {
            ...Object.fromEntries(arr.map((_, i) => [i, i < size ? 'default' : 'sorted'])),
            [maxIdx]: 'found',
          },
          labels: { [maxIdx]: `max=${maxVal}`, [size - 1]: 'end' },
        },
      });

      if (maxIdx === size - 1) {
        steps.push({
          line: 4,
          explanation: `Max ${maxVal} already at position ${size - 1}. No flip needed.`,
          variables: { size },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { [size - 1]: 'sorted' },
            labels: { [size - 1]: 'in place' },
          },
        });
        continue;
      }

      if (maxIdx !== 0) {
        steps.push({
          line: 5,
          explanation: `Flip first ${maxIdx + 1} elements to bring ${maxVal} to front. Before: [${arr.slice(0, maxIdx + 1).join(', ')},...].`,
          variables: { flipK: maxIdx + 1 },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: Object.fromEntries(arr.map((_, i) => [i, i <= maxIdx ? 'swapping' : 'default'])),
            labels: { 0: 'flip start', [maxIdx]: 'flip end' },
          },
        });
        flip(maxIdx + 1);
        flips.push(maxIdx + 1);
        steps.push({
          line: 6,
          explanation: `After flip(${maxIdx + 1}): [${arr.join(', ')}]. Max ${maxVal} now at front.`,
          variables: { arr: `[${arr.join(', ')}]`, flips: flips.join(',') },
          visualization: {
            type: 'array',
            array: [...arr],
            highlights: { 0: 'found' },
            labels: { 0: `${maxVal} at front` },
          },
        });
      }

      steps.push({
        line: 7,
        explanation: `Flip first ${size} elements to place ${maxVal} at position ${size - 1}. Before: [${arr.slice(0, size).join(', ')}].`,
        variables: { flipK: size },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, i) => [i, i < size ? 'swapping' : 'sorted'])),
          labels: { 0: 'flip start', [size - 1]: 'flip end' },
        },
      });
      flip(size);
      flips.push(size);
      steps.push({
        line: 8,
        explanation: `After flip(${size}): [${arr.join(', ')}]. ${maxVal} now locked at position ${size - 1}.`,
        variables: { arr: `[${arr.join(', ')}]`, flips: flips.join(',') },
        visualization: {
          type: 'array',
          array: [...arr],
          highlights: Object.fromEntries(arr.map((_, i) => [i, i >= size - 1 ? 'sorted' : 'default'])),
          labels: { [size - 1]: `${maxVal} fixed` },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Pancake Sort complete. Sorted: [${arr.join(', ')}]. Flips used: [${flips.join(', ')}].`,
      variables: { sorted: arr.join(', '), flips: flips.join(',') },
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

export default pancakeSorting;
