import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pancakeSortingII: AlgorithmDefinition = {
  id: 'pancake-sorting-ii',
  title: 'Pancake Sorting II',
  leetcodeNumber: 969,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 969: Sort array using pancake flips. A k-flip reverses the first k elements. For each pass, find the max in unsorted portion, flip it to front, then flip to correct position.',
  tags: ['Sorting', 'Array', 'Two Pointers', 'Greedy'],
  code: {
    pseudocode: `function pancakeSort(arr):
  result = []
  for size = n down to 2:
    maxIdx = index of max in arr[0..size-1]
    if maxIdx != size-1:
      if maxIdx != 0:
        flip(arr, maxIdx+1); result.push(maxIdx+1)
      flip(arr, size); result.push(size)
  return result

function flip(arr, k):
  reverse arr[0..k-1]`,
    python: `def pancakeSort(arr):
    result = []
    n = len(arr)
    for size in range(n, 1, -1):
        max_idx = arr.index(max(arr[:size]))
        if max_idx == size - 1: continue
        if max_idx != 0:
            arr[:max_idx+1] = arr[:max_idx+1][::-1]
            result.append(max_idx + 1)
        arr[:size] = arr[:size][::-1]
        result.append(size)
    return result`,
    javascript: `function pancakeSort(arr) {
  const result = [];
  for (let size = arr.length; size > 1; size--) {
    let maxIdx = 0;
    for (let i = 1; i < size; i++) if (arr[i] > arr[maxIdx]) maxIdx = i;
    if (maxIdx === size - 1) continue;
    if (maxIdx !== 0) {
      arr.splice(0, maxIdx+1, ...arr.slice(0, maxIdx+1).reverse());
      result.push(maxIdx + 1);
    }
    arr.splice(0, size, ...arr.slice(0, size).reverse());
    result.push(size);
  }
  return result;
}`,
    java: `public List<Integer> pancakeSort(int[] arr) {
    List<Integer> result = new ArrayList<>();
    for (int size = arr.length; size > 1; size--) {
        int maxIdx = 0;
        for (int i = 1; i < size; i++) if (arr[i] > arr[maxIdx]) maxIdx = i;
        if (maxIdx == size - 1) continue;
        if (maxIdx != 0) {
            flip(arr, maxIdx + 1); result.add(maxIdx + 1);
        }
        flip(arr, size); result.add(size);
    }
    return result;
}`,
  },
  defaultInput: { arr: [3, 2, 4, 1] },
  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [3, 2, 4, 1],
      placeholder: '3,2,4,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = (input.arr as number[]).slice();
    const steps: AlgorithmStep[] = [];
    const n = arr.length;
    const flips: number[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries?: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxEntries ? { auxData: { label: 'Pancake Sort', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Pancake sort [${arr.join(', ')}]. Only operation: reverse first k elements (k-flip).`,
      variables: { arr: [...arr] },
      visualization: makeViz({}, {}),
    });

    function flip(k: number) {
      let lo = 0, hi = k - 1;
      while (lo < hi) {
        const tmp = arr[lo]; arr[lo] = arr[hi]; arr[hi] = tmp;
        lo++; hi--;
      }
    }

    for (let size = n; size > 1; size--) {
      let maxIdx = 0;
      for (let i = 1; i < size; i++) {
        if (arr[i] > arr[maxIdx]) maxIdx = i;
      }

      const searchHl: Record<number, string> = {};
      for (let i = 0; i < size; i++) searchHl[i] = 'comparing';
      searchHl[maxIdx] = 'active';
      for (let i = size; i < n; i++) searchHl[i] = 'found';

      steps.push({
        line: 4,
        explanation: `Find max in [0..${size - 1}]: value=${arr[maxIdx]} at index ${maxIdx}.`,
        variables: { size, maxIdx, maxVal: arr[maxIdx] },
        visualization: makeViz(searchHl, { [maxIdx]: 'max' },
          [{ key: 'Max', value: `${arr[maxIdx]} @ idx ${maxIdx}` }, { key: 'Size', value: String(size) }]),
      });

      if (maxIdx === size - 1) {
        steps.push({
          line: 5,
          explanation: `Max already at position ${size - 1}. No flip needed.`,
          variables: { maxIdx, size },
          visualization: makeViz({ ...searchHl, [maxIdx]: 'found' }, {},
            [{ key: 'Skip', value: 'Already in place' }]),
        });
        continue;
      }

      if (maxIdx !== 0) {
        steps.push({
          line: 6,
          explanation: `Flip first ${maxIdx + 1} elements to bring max to front.`,
          variables: { k: maxIdx + 1 },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: maxIdx + 1 }, (_, i) => [i, 'swapping'])),
            {},
            [{ key: 'Flip', value: String(maxIdx + 1) }],
          ),
        });
        flip(maxIdx + 1);
        flips.push(maxIdx + 1);
        steps.push({
          line: 6,
          explanation: `After flip(${maxIdx + 1}): [${arr.join(', ')}]. Max=${arr[0]} is now at front.`,
          variables: { arr: [...arr] },
          visualization: makeViz({ [0]: 'active' }, { [0]: 'max' },
            [{ key: 'After flip', value: arr.join(', ') }]),
        });
      }

      steps.push({
        line: 7,
        explanation: `Flip first ${size} elements to place max at position ${size - 1}.`,
        variables: { k: size },
        visualization: makeViz(
          Object.fromEntries(Array.from({ length: size }, (_, i) => [i, 'swapping'])),
          {},
          [{ key: 'Flip', value: String(size) }],
        ),
      });
      flip(size);
      flips.push(size);

      const afterHl: Record<number, string> = {};
      for (let i = 0; i < size - 1; i++) afterHl[i] = 'comparing';
      for (let i = size - 1; i < n; i++) afterHl[i] = 'found';

      steps.push({
        line: 7,
        explanation: `After flip(${size}): [${arr.join(', ')}]. ${arr[size - 1]} placed at position ${size - 1}.`,
        variables: { arr: [...arr], flips: [...flips] },
        visualization: makeViz(afterHl, { [size - 1]: 'sorted' },
          [{ key: 'Flips so far', value: flips.join(',') }]),
      });
    }

    steps.push({
      line: 1,
      explanation: `Pancake sort complete! Sorted: [${arr.join(', ')}]. Flips used: [${flips.join(', ')}].`,
      variables: { result: [...arr], flips: [...flips] },
      visualization: makeViz(
        Object.fromEntries(arr.map((_, i) => [i, 'found'])),
        {},
        [{ key: 'Sorted', value: arr.join(', ') }, { key: 'Flips', value: flips.join(', ') }],
      ),
    });

    return steps;
  },
};

export default pancakeSortingII;
