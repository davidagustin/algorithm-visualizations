import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const findDisappearedNumbers: AlgorithmDefinition = {
  id: 'find-disappeared-numbers',
  title: 'Find All Numbers Disappeared in an Array',
  leetcodeNumber: 448,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an array nums of n integers where nums[i] is in range [1, n], return all integers in [1, n] that do not appear in nums. Use the array itself as a hash by negating values at index nums[i]-1 to mark visited numbers, requiring O(1) extra space.',
  tags: ['array', 'hash table', 'in-place marking', 'missing numbers'],

  code: {
    pseudocode: `function findDisappearedNumbers(nums):
  for each num in nums:
    idx = abs(num) - 1
    nums[idx] = -abs(nums[idx])
  result = []
  for i from 0 to n-1:
    if nums[i] > 0:
      result.append(i + 1)
  return result`,

    python: `def findDisappearedNumbers(nums: list[int]) -> list[int]:
    for num in nums:
        idx = abs(num) - 1
        nums[idx] = -abs(nums[idx])
    return [i + 1 for i in range(len(nums)) if nums[i] > 0]`,

    javascript: `function findDisappearedNumbers(nums) {
  for (const num of nums) {
    const idx = Math.abs(num) - 1;
    nums[idx] = -Math.abs(nums[idx]);
  }
  const result = [];
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] > 0) result.push(i + 1);
  }
  return result;
}`,

    java: `public List<Integer> findDisappearedNumbers(int[] nums) {
    for (int num : nums) {
        int idx = Math.abs(num) - 1;
        nums[idx] = -Math.abs(nums[idx]);
    }
    List<Integer> result = new ArrayList<>();
    for (int i = 0; i < nums.length; i++) {
        if (nums[i] > 0) result.add(i + 1);
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
      helperText: 'Integers in range [1, n] where n is array length',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const nums = [...original];

    steps.push({
      line: 1,
      explanation: `Array of length n=${nums.length}. Values in [1,${nums.length}]. We negate nums[abs(num)-1] to mark seen numbers.`,
      variables: { n: nums.length },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: {},
      },
    });

    for (let k = 0; k < nums.length; k++) {
      const num = nums[k];
      const idx = Math.abs(num) - 1;

      steps.push({
        line: 2,
        explanation: `Processing nums[${k}]=${num}. Map to index idx=abs(${num})-1=${idx}.`,
        variables: { k, num, idx },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [k]: 'active', [idx]: 'comparing' },
          labels: { [k]: 'curr', [idx]: 'mark' },
        },
      });

      nums[idx] = -Math.abs(nums[idx]);

      steps.push({
        line: 3,
        explanation: `Negate nums[${idx}] to ${nums[idx]} to mark that value ${idx + 1} exists in the array.`,
        variables: { idx, newValue: nums[idx] },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [idx]: 'found' },
          labels: { [idx]: 'marked' },
        },
      });
    }

    const result: number[] = [];
    const finalHighlights: Record<number, string> = {};

    for (let i = 0; i < nums.length; i++) {
      if (nums[i] > 0) {
        result.push(i + 1);
        finalHighlights[i] = 'active';
      }
    }

    steps.push({
      line: 6,
      explanation: `Scan: positive values at indices indicate missing numbers. Missing: ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: finalHighlights,
        labels: Object.fromEntries(
          Object.keys(finalHighlights).map(k => [k, `miss=${Number(k) + 1}`])
        ),
      },
    });

    return steps;
  },
};

export default findDisappearedNumbers;
