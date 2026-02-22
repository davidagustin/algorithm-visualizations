import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findAllDuplicates: AlgorithmDefinition = {
  id: 'find-all-duplicates',
  title: 'Find All Duplicates in an Array',
  leetcodeNumber: 442,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given an array of n integers where each value is in [1,n] and each integer appears once or twice, find all elements that appear twice. Use the index-as-hash trick: negate the element at index abs(num)-1. If it is already negative when you visit it, the number is a duplicate.',
  tags: ['array', 'hash table', 'in-place marking'],

  code: {
    pseudocode: `function findDuplicates(nums):
  result = []
  for i from 0 to n-1:
    idx = abs(nums[i]) - 1
    if nums[idx] < 0:
      result.append(idx + 1)
    else:
      nums[idx] = -nums[idx]
  return result`,

    python: `def findDuplicates(nums: list[int]) -> list[int]:
    result = []
    for num in nums:
        idx = abs(num) - 1
        if nums[idx] < 0:
            result.append(idx + 1)
        else:
            nums[idx] = -nums[idx]
    return result`,

    javascript: `function findDuplicates(nums) {
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    const idx = Math.abs(nums[i]) - 1;
    if (nums[idx] < 0) {
      result.push(idx + 1);
    } else {
      nums[idx] = -nums[idx];
    }
  }
  return result;
}`,

    java: `public List<Integer> findDuplicates(int[] nums) {
    List<Integer> result = new ArrayList<>();
    for (int num : nums) {
        int idx = Math.abs(num) - 1;
        if (nums[idx] < 0) {
            result.add(idx + 1);
        } else {
            nums[idx] = -nums[idx];
        }
    }
    return result;
}`,
  },

  defaultInput: {
    nums: [4, 3, 2, 7, 8, 2, 3, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [4, 3, 2, 7, 8, 2, 3, 1],
      placeholder: '4,3,2,7,8,2,3,1',
      helperText: 'Values in [1,n], each appearing once or twice',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = [...(input.nums as number[])];
    const steps: AlgorithmStep[] = [];
    const result: number[] = [];

    steps.push({
      line: 1,
      explanation: `Array: ${JSON.stringify(nums)}. Use negation trick: negate nums[abs(num)-1]. If already negative, num appeared twice.`,
      variables: { n: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < nums.length; i++) {
      const idx = Math.abs(nums[i]) - 1;

      steps.push({
        line: 3,
        explanation: `Processing nums[${i}]=${nums[i]}. Map to index idx=abs(${nums[i]})-1=${idx}.`,
        variables: { i, value: nums[i], idx },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active', [idx]: 'comparing' },
          labels: { [i]: 'curr', [idx]: 'check' },
        },
      });

      if (nums[idx] < 0) {
        result.push(idx + 1);
        steps.push({
          line: 5,
          explanation: `nums[${idx}]=${nums[idx]} is already negative! Value ${idx + 1} appears twice. Add to result.`,
          variables: { idx, duplicate: idx + 1, result: JSON.stringify(result) },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'found', [idx]: 'found' },
            labels: { [idx]: `dup=${idx + 1}` },
          },
        });
      } else {
        nums[idx] = -nums[idx];
        steps.push({
          line: 7,
          explanation: `nums[${idx}] was positive. Negate it to ${nums[idx]} to mark that ${idx + 1} has been seen.`,
          variables: { idx, newValue: nums[idx] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'active', [idx]: 'sorted' },
            labels: { [idx]: 'marked' },
          },
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Duplicates found: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default findAllDuplicates;
