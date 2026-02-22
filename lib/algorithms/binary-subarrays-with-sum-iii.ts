import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binarySubarraysWithSumIii: AlgorithmDefinition = {
  id: 'binary-subarrays-with-sum-iii',
  title: 'Binary Subarrays with Sum III',
  leetcodeNumber: 930,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a binary array nums and an integer goal, return the number of non-empty subarrays with a sum equal to goal. Uses the prefix sum + hash map approach: for each position, count how many previous prefix sums equal (currentSum - goal), giving O(n) time and O(n) space.',
  tags: ['Sliding Window', 'Hash Map', 'Prefix Sum', 'Two Pointers'],
  code: {
    pseudocode: `function numSubarraysWithSum(nums, goal):
  count = {0: 1}  // prefix_sum -> frequency
  prefix = 0, result = 0
  for num in nums:
    prefix += num
    if prefix - goal in count:
      result += count[prefix - goal]
    count[prefix] = count.get(prefix, 0) + 1
  return result`,
    python: `from collections import defaultdict
def numSubarraysWithSum(nums, goal):
    count = defaultdict(int)
    count[0] = 1
    prefix = result = 0
    for num in nums:
        prefix += num
        result += count[prefix - goal]
        count[prefix] += 1
    return result`,
    javascript: `function numSubarraysWithSum(nums, goal) {
  const count = new Map([[0, 1]]);
  let prefix=0, result=0;
  for (const num of nums) {
    prefix+=num;
    result+=(count.get(prefix-goal)||0);
    count.set(prefix,(count.get(prefix)||0)+1);
  }
  return result;
}`,
    java: `public int numSubarraysWithSum(int[] nums, int goal) {
    Map<Integer,Integer> count=new HashMap<>();
    count.put(0,1);
    int prefix=0,result=0;
    for(int num:nums){
        prefix+=num;
        result+=count.getOrDefault(prefix-goal,0);
        count.merge(prefix,1,Integer::sum);
    }
    return result;
}`,
  },
  defaultInput: { nums: [1, 0, 1, 0, 1], goal: 2 },
  inputFields: [
    {
      name: 'nums',
      label: 'Binary Array',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1],
      placeholder: '1,0,1,0,1',
      helperText: 'Binary array (0s and 1s)',
    },
    {
      name: 'goal',
      label: 'Goal Sum',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Target subarray sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const goal = input.goal as number;
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const countMap = new Map<number, number>([[0, 1]]);
    let prefix = 0, result = 0;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: `Binary Subarrays Sum = ${goal}`,
          entries: [
            { key: 'Prefix Sum', value: String(prefix) },
            { key: 'Count', value: String(result) },
            { key: 'Map Size', value: String(countMap.size) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count subarrays in binary array with sum = ${goal}. Use prefix sum + count map. Init: {0:1}.`,
      variables: { n, goal },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n; i++) {
      prefix += nums[i];
      const need = prefix - goal;
      const found = countMap.get(need) || 0;
      result += found;
      countMap.set(prefix, (countMap.get(prefix) || 0) + 1);

      const h: Record<number, string> = { [i]: found > 0 ? 'found' : 'active' };
      const l: Record<number, string> = { [i]: `ps=${prefix}` };
      for (let j = 0; j < i; j++) h[j] = 'visited';

      steps.push({
        line: 5,
        explanation: `i=${i}: num=${nums[i]}. prefix=${prefix}. Need prefix-${goal}=${need} in map: found ${found} times. Count=${result}.`,
        variables: { i, num: nums[i], prefix, need, found, result },
        visualization: makeViz(h, l),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 8,
      explanation: `Done. Total binary subarrays with sum = ${goal}: count = ${result}.`,
      variables: { result },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default binarySubarraysWithSumIii;
