import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfSmallerNumbersAfterSelf: AlgorithmDefinition = {
  id: 'count-of-smaller-numbers-after-self',
  title: 'Count of Smaller Numbers After Self',
  leetcodeNumber: 315,
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'For each element in nums, count how many numbers to its right are smaller. Process from right to left maintaining a sorted list; use binary search to find the insertion position, which equals the count of smaller elements seen so far.',
  tags: ['binary search', 'array', 'divide and conquer', 'sorted list'],

  code: {
    pseudocode: `function countSmaller(nums):
  result = []
  sorted_list = []
  for i from n-1 to 0:
    pos = bisect_left(sorted_list, nums[i])
    result.prepend(pos)
    sorted_list.insert(pos, nums[i])
  return result`,
    python: `import bisect
def countSmaller(nums: list[int]) -> list[int]:
    result = []
    sorted_list = []
    for num in reversed(nums):
        pos = bisect.bisect_left(sorted_list, num)
        result.append(pos)
        bisect.insort(sorted_list, num)
    return result[::-1]`,
    javascript: `function countSmaller(nums) {
  const result = [];
  const sorted = [];
  for (let i = nums.length - 1; i >= 0; i--) {
    let lo = 0, hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < nums[i]) lo = mid + 1;
      else hi = mid;
    }
    result.unshift(lo);
    sorted.splice(lo, 0, nums[i]);
  }
  return result;
}`,
    java: `public List<Integer> countSmaller(int[] nums) {
    List<Integer> result = new ArrayList<>(), sorted = new ArrayList<>();
    for (int i = nums.length - 1; i >= 0; i--) {
        int lo = 0, hi = sorted.size();
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (sorted.get(mid) < nums[i]) lo = mid + 1;
            else hi = mid;
        }
        result.add(0, lo);
        sorted.add(lo, nums[i]);
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [5, 2, 6, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 2, 6, 1],
      placeholder: '5,2,6,1',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const result: number[] = new Array(n).fill(0);
    const sorted: number[] = [];

    steps.push({
      line: 1,
      explanation: `Process nums=[${nums.join(', ')}] from right to left. Maintain sorted list for binary search.`,
      variables: { n },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = n - 1; i >= 0; i--) {
      const num = nums[i];

      steps.push({
        line: 4,
        explanation: `Processing nums[${i}]=${num}. Sorted list so far: [${sorted.join(', ')}].`,
        variables: { i, num, sorted: sorted.join(',') },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active' },
          labels: { [i]: `curr=${num}` },
        },
      });

      let lo = 0;
      let hi = sorted.length;

      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (sorted[mid] < num) {
          lo = mid + 1;
        } else {
          hi = mid;
        }
      }

      result[i] = lo;
      sorted.splice(lo, 0, num);

      steps.push({
        line: 5,
        explanation: `Binary search found position ${lo}. ${lo} elements in sorted list are smaller than ${num}. result[${i}]=${lo}. Insert ${num} at pos ${lo}. Sorted: [${sorted.join(', ')}].`,
        variables: { i, num, pos: lo, 'result[i]': lo, sorted: sorted.join(',') },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'found' },
          labels: { [i]: `cnt=${lo}` },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Complete. Result (count of smaller numbers to the right): [${result.join(', ')}].`,
      variables: { result: result.join(',') },
      visualization: {
        type: 'array',
        array: [...result],
        highlights: result.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: nums.reduce((acc, v, i) => ({ ...acc, [i]: `n=${v}` }), {}),
      },
    });

    return steps;
  },
};

export default countOfSmallerNumbersAfterSelf;
