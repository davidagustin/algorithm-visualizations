import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const sortAnArray: AlgorithmDefinition = {
  id: 'sort-an-array',
  title: 'Sort an Array',
  leetcodeNumber: 912,
  difficulty: 'Medium',
  category: 'Sorting',
  description:
    'LC 912: Sort an array of integers in ascending order. Uses heap sort for O(n log n) time and O(1) space without the built-in sort function.',
  tags: ['Sorting', 'Array', 'Heap Sort', 'Divide and Conquer'],
  code: {
    pseudocode: `function sortArray(nums):
  n = nums.length
  # Build max-heap
  for i = n/2-1 down to 0:
    heapify(nums, n, i)
  # Extract elements
  for i = n-1 down to 1:
    swap(nums[0], nums[i])
    heapify(nums, i, 0)
  return nums`,
    python: `def sortArray(nums):
    n = len(nums)
    for i in range(n//2-1, -1, -1):
        heapify(nums, n, i)
    for i in range(n-1, 0, -1):
        nums[0], nums[i] = nums[i], nums[0]
        heapify(nums, i, 0)
    return nums

def heapify(nums, n, i):
    largest = i
    l, r = 2*i+1, 2*i+2
    if l < n and nums[l] > nums[largest]: largest = l
    if r < n and nums[r] > nums[largest]: largest = r
    if largest != i:
        nums[i], nums[largest] = nums[largest], nums[i]
        heapify(nums, n, largest)`,
    javascript: `function sortArray(nums) {
  const n = nums.length;
  for (let i = Math.floor(n/2)-1; i >= 0; i--) heapify(nums, n, i);
  for (let i = n-1; i > 0; i--) {
    [nums[0], nums[i]] = [nums[i], nums[0]];
    heapify(nums, i, 0);
  }
  return nums;
}
function heapify(nums, n, i) {
  let largest = i, l = 2*i+1, r = 2*i+2;
  if (l < n && nums[l] > nums[largest]) largest = l;
  if (r < n && nums[r] > nums[largest]) largest = r;
  if (largest !== i) {
    [nums[i], nums[largest]] = [nums[largest], nums[i]];
    heapify(nums, n, largest);
  }
}`,
    java: `public int[] sortArray(int[] nums) {
    int n = nums.length;
    for (int i = n/2-1; i >= 0; i--) heapify(nums, n, i);
    for (int i = n-1; i > 0; i--) {
        int tmp = nums[0]; nums[0] = nums[i]; nums[i] = tmp;
        heapify(nums, i, 0);
    }
    return nums;
}
private void heapify(int[] nums, int n, int i) {
    int largest = i, l = 2*i+1, r = 2*i+2;
    if (l < n && nums[l] > nums[largest]) largest = l;
    if (r < n && nums[r] > nums[largest]) largest = r;
    if (largest != i) {
        int tmp = nums[i]; nums[i] = nums[largest]; nums[largest] = tmp;
        heapify(nums, n, largest);
    }
}`,
  },
  defaultInput: { nums: [5, 2, 3, 1] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 2, 3, 1],
      placeholder: '5,2,3,1',
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
      ...(auxEntries ? { auxData: { label: 'Sort An Array', entries: auxEntries } } : {}),
    });

    steps.push({
      line: 1,
      explanation: `Sort [${nums.join(', ')}] using heap sort (LC 912).`,
      variables: { nums: [...nums] },
      visualization: makeViz({}, {}),
    });

    function heapify(size: number, i: number) {
      let largest = i;
      const l = 2 * i + 1, r = 2 * i + 2;
      if (l < size && nums[l] > nums[largest]) largest = l;
      if (r < size && nums[r] > nums[largest]) largest = r;
      if (largest !== i) {
        const hl: Record<number, string> = { [i]: 'swapping', [largest]: 'swapping' };
        steps.push({
          line: 9,
          explanation: `Heapify: swap nums[${i}]=${nums[i]} and nums[${largest}]=${nums[largest]}.`,
          variables: { i, largest },
          visualization: makeViz(hl, { [i]: 'i', [largest]: 'lrg' },
            [{ key: 'Heapify', value: `swap ${i}↔${largest}` }]),
        });
        const tmp = nums[i]; nums[i] = nums[largest]; nums[largest] = tmp;
        heapify(size, largest);
      }
    }

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) heapify(n, i);

    steps.push({
      line: 4,
      explanation: `Max-heap built: [${nums.join(', ')}].`,
      variables: { heap: [...nums] },
      visualization: makeViz(
        Object.fromEntries(nums.map((_, i) => [i, 'pointer'])),
        {},
        [{ key: 'Max-Heap', value: nums.join(', ') }],
      ),
    });

    for (let i = n - 1; i > 0; i--) {
      steps.push({
        line: 7,
        explanation: `Extract max ${nums[0]}, move to index ${i}. Heap size: ${i}.`,
        variables: { extracted: nums[0], pos: i },
        visualization: makeViz({ [0]: 'swapping', [i]: 'swapping' }, {},
          [{ key: 'Extract', value: String(nums[0]) }]),
      });
      const tmp = nums[0]; nums[0] = nums[i]; nums[i] = tmp;
      heapify(i, 0);

      const hl: Record<number, string> = {};
      for (let x = i; x < n; x++) hl[x] = 'found';
      steps.push({
        line: 8,
        explanation: `Sorted portion: [${nums.slice(i).join(', ')}].`,
        variables: { sortedFrom: i },
        visualization: makeViz(hl, {},
          [{ key: 'Sorted tail', value: nums.slice(i).join(', ') }]),
      });
    }

    steps.push({
      line: 1,
      explanation: `Sort complete! Result: [${nums.join(', ')}].`,
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

export default sortAnArray;
