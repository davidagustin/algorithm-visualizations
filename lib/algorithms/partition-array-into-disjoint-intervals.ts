import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const partitionArrayIntoDisjointIntervals: AlgorithmDefinition = {
  id: 'partition-array-into-disjoint-intervals',
  title: 'Partition Array into Disjoint Intervals',
  leetcodeNumber: 915,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given an array, partition it into two contiguous subarrays left and right such that every element in left is less than or equal to every element in right. Find the minimum length of left. Track the current max of left and the overall max seen so far.',
  tags: ['two pointers', 'array', 'greedy'],

  code: {
    pseudocode: `function partitionDisjoint(nums):
  maxLeft = nums[0]
  curMax = nums[0]
  partitionIdx = 0
  for i = 1 to length(nums)-1:
    if nums[i] < maxLeft:
      partitionIdx = i
      maxLeft = curMax
    else:
      curMax = max(curMax, nums[i])
  return partitionIdx + 1`,

    python: `def partitionDisjoint(nums: list[int]) -> int:
    max_left = cur_max = nums[0]
    partition_idx = 0
    for i in range(1, len(nums)):
        if nums[i] < max_left:
            partition_idx = i
            max_left = cur_max
        else:
            cur_max = max(cur_max, nums[i])
    return partition_idx + 1`,

    javascript: `function partitionDisjoint(nums) {
  let maxLeft = nums[0], curMax = nums[0], partitionIdx = 0;
  for (let i = 1; i < nums.length; i++) {
    if (nums[i] < maxLeft) {
      partitionIdx = i;
      maxLeft = curMax;
    } else {
      curMax = Math.max(curMax, nums[i]);
    }
  }
  return partitionIdx + 1;
}`,

    java: `public int partitionDisjoint(int[] nums) {
    int maxLeft = nums[0], curMax = nums[0], partitionIdx = 0;
    for (int i = 1; i < nums.length; i++) {
        if (nums[i] < maxLeft) {
            partitionIdx = i;
            maxLeft = curMax;
        } else {
            curMax = Math.max(curMax, nums[i]);
        }
    }
    return partitionIdx + 1;
}`,
  },

  defaultInput: {
    nums: [5, 0, 3, 8, 6],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [5, 0, 3, 8, 6],
      placeholder: '5,0,3,8,6',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    let maxLeft = nums[0];
    let curMax = nums[0];
    let partitionIdx = 0;

    steps.push({
      line: 1,
      explanation: `Initialize: maxLeft=${maxLeft}, curMax=${curMax}, partitionIdx=0.`,
      variables: { maxLeft, curMax, partitionIdx },
      visualization: makeViz({ [0]: 'active' }, { [0]: 'start' }),
    });

    for (let i = 1; i < nums.length; i++) {
      if (nums[i] < maxLeft) {
        partitionIdx = i;
        maxLeft = curMax;
        steps.push({
          line: 5,
          explanation: `nums[${i}]=${nums[i]} < maxLeft=${maxLeft - (curMax - maxLeft)}. Extend left partition to include index ${i}. maxLeft updated to curMax=${maxLeft}.`,
          variables: { i, 'nums[i]': nums[i], partitionIdx, maxLeft, curMax },
          visualization: makeViz(
            {
              ...Object.fromEntries(Array.from({ length: partitionIdx + 1 }, (_, k) => [k, 'active'])),
              [i]: 'swapping',
            },
            { [partitionIdx]: 'partition' }
          ),
        });
      } else {
        curMax = Math.max(curMax, nums[i]);
        steps.push({
          line: 7,
          explanation: `nums[${i}]=${nums[i]} >= maxLeft=${maxLeft}. Belongs to right side. curMax=${curMax}.`,
          variables: { i, 'nums[i]': nums[i], maxLeft, curMax, partitionIdx },
          visualization: makeViz(
            {
              ...Object.fromEntries(Array.from({ length: partitionIdx + 1 }, (_, k) => [k, 'active'])),
              [i]: 'comparing',
            },
            { [partitionIdx]: 'partition', [i]: 'R' }
          ),
        });
      }
    }

    const result = partitionIdx + 1;
    steps.push({
      line: 9,
      explanation: `Partition found. Left subarray has length ${result} (indices 0..${partitionIdx}). Right starts at index ${result}.`,
      variables: { partitionIdx, result },
      visualization: makeViz(
        {
          ...Object.fromEntries(Array.from({ length: result }, (_, k) => [k, 'found'])),
          ...Object.fromEntries(Array.from({ length: nums.length - result }, (_, k) => [k + result, 'sorted'])),
        },
        { [partitionIdx]: 'end-L', [result]: 'start-R' }
      ),
    });

    return steps;
  },
};

export default partitionArrayIntoDisjointIntervals;
