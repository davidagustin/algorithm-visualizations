import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const setMismatch: AlgorithmDefinition = {
  id: 'set-mismatch',
  title: 'Set Mismatch',
  leetcodeNumber: 645,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'You have a set of integers from 1 to n. One number appears twice (duplicate) and one number is missing. Given the array nums containing all integers but with one duplicate and one missing, find and return [duplicate, missing]. Use a frequency count to detect which number appears twice and which is absent.',
  tags: ['array', 'hash map', 'frequency count'],

  code: {
    pseudocode: `function findErrorNums(nums):
  count = array of zeros size n+1
  for x in nums: count[x]++
  dup = -1; missing = -1
  for i in 1..n:
    if count[i] == 2: dup = i
    if count[i] == 0: missing = i
  return [dup, missing]`,
    python: `def findErrorNums(nums):
    n = len(nums)
    count = [0] * (n + 1)
    for x in nums:
        count[x] += 1
    dup = missing = -1
    for i in range(1, n + 1):
        if count[i] == 2:
            dup = i
        elif count[i] == 0:
            missing = i
    return [dup, missing]`,
    javascript: `function findErrorNums(nums) {
  const n = nums.length;
  const count = new Array(n + 1).fill(0);
  for (const x of nums) count[x]++;
  let dup = -1, missing = -1;
  for (let i = 1; i <= n; i++) {
    if (count[i] === 2) dup = i;
    else if (count[i] === 0) missing = i;
  }
  return [dup, missing];
}`,
    java: `public int[] findErrorNums(int[] nums) {
    int n = nums.length;
    int[] count = new int[n + 1];
    for (int x : nums) count[x]++;
    int dup = -1, missing = -1;
    for (int i = 1; i <= n; i++) {
        if (count[i] == 2) dup = i;
        else if (count[i] == 0) missing = i;
    }
    return new int[]{dup, missing};
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 2, 4],
      placeholder: '1,2,2,4',
      helperText: 'Array of integers 1 to n with one duplicate and one missing',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;
    const count = new Array(n + 1).fill(0);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Initialize frequency count array of size ${n + 1}. Will count occurrences of each number.`,
      variables: { n, count: count.slice(1).join(', ') },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < nums.length; i++) {
      count[nums[i]]++;
      steps.push({
        line: 3,
        explanation: `count[${nums[i]}]++ = ${count[nums[i]]}. Incrementing frequency of ${nums[i]}.`,
        variables: { index: i, value: nums[i], 'count[value]': count[nums[i]] },
        visualization: makeViz({ [i]: 'active' }, { [i]: String(nums[i]) }),
      });
    }

    let dup = -1, missing = -1;
    for (let i = 1; i <= n; i++) {
      if (count[i] === 2) {
        dup = i;
        steps.push({
          line: 6,
          explanation: `count[${i}] = 2, so ${i} is the duplicate number.`,
          variables: { i, count: count[i], duplicate: dup },
          visualization: makeViz(
            Object.fromEntries(nums.map((v, idx) => [idx, v === dup ? 'found' : 'default'])),
            {}
          ),
        });
      } else if (count[i] === 0) {
        missing = i;
        steps.push({
          line: 7,
          explanation: `count[${i}] = 0, so ${i} is the missing number.`,
          variables: { i, count: count[i], missing },
          visualization: makeViz({}, {}),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Result: duplicate = ${dup}, missing = ${missing}. Return [${dup}, ${missing}].`,
      variables: { duplicate: dup, missing },
      visualization: makeViz(
        Object.fromEntries(nums.map((v, idx) => [idx, v === dup ? 'found' : 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default setMismatch;
