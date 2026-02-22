import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const majorityElement: AlgorithmDefinition = {
  id: 'majority-element',
  title: 'Majority Element',
  leetcodeNumber: 169,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Find the element that appears more than n/2 times in an array. Boyer-Moore Voting Algorithm: maintain a candidate and a count. When count hits 0, switch the candidate to the current element. A majority element always survives because it outvotes every other element combined. O(n) time, O(1) space.',
  tags: ['Array', 'Boyer-Moore', 'Voting'],
  code: {
    pseudocode: `function majorityElement(nums):
  candidate = nums[0]
  count = 1
  for i from 1 to len(nums)-1:
    if count == 0:
      candidate = nums[i]
      count = 1
    elif nums[i] == candidate:
      count += 1
    else:
      count -= 1
  return candidate`,
    python: `def majorityElement(nums):
    candidate, count = nums[0], 1
    for i in range(1, len(nums)):
        if count == 0:
            candidate, count = nums[i], 1
        elif nums[i] == candidate:
            count += 1
        else:
            count -= 1
    return candidate`,
    javascript: `function majorityElement(nums) {
  let candidate = nums[0], count = 1;
  for (let i = 1; i < nums.length; i++) {
    if (count === 0) {
      candidate = nums[i]; count = 1;
    } else if (nums[i] === candidate) {
      count++;
    } else {
      count--;
    }
  }
  return candidate;
}`,
    java: `public int majorityElement(int[] nums) {
    int candidate = nums[0], count = 1;
    for (int i = 1; i < nums.length; i++) {
        if (count == 0) { candidate = nums[i]; count = 1; }
        else if (nums[i] == candidate) count++;
        else count--;
    }
    return candidate;
}`,
  },
  defaultInput: { nums: [2, 2, 1, 1, 1, 2, 2] },
  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 2, 1, 1, 1, 2, 2],
      placeholder: '2,2,1,1,1,2,2',
      helperText: 'Array where majority element appears more than n/2 times',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      idx: number,
      candidate: number,
      count: number,
      action: string,
    ): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let k = 0; k < n; k++) {
        if (k < idx) {
          highlights[k] = nums[k] === candidate ? 'sorted' : 'visited';
        } else if (k === idx) {
          highlights[k] = 'active';
          labels[k] = 'curr';
        } else {
          highlights[k] = 'default';
        }
      }

      return {
        type: 'array',
        array: [...nums],
        highlights,
        labels,
        auxData: {
          label: 'Boyer-Moore Voting',
          entries: [
            { key: 'Candidate', value: String(candidate) },
            { key: 'Count', value: String(count) },
            { key: 'Action', value: action },
          ],
        },
      };
    };

    let candidate = nums[0];
    let count = 1;

    steps.push({
      line: 2,
      explanation: `Boyer-Moore Voting: initialize candidate=${candidate}, count=1.`,
      variables: { candidate, count },
      visualization: makeViz(0, candidate, count, 'Initialize'),
    });

    for (let i = 1; i < n; i++) {
      if (count === 0) {
        candidate = nums[i];
        count = 1;
        steps.push({
          line: 5,
          explanation: `count=0: switch candidate to nums[${i}]=${nums[i]}, reset count=1.`,
          variables: { i, candidate, count },
          visualization: makeViz(i, candidate, count, `New candidate: ${candidate}`),
        });
      } else if (nums[i] === candidate) {
        count++;
        steps.push({
          line: 8,
          explanation: `nums[${i}]=${nums[i]} == candidate=${candidate}. count = ${count}.`,
          variables: { i, 'nums[i]': nums[i], candidate, count },
          visualization: makeViz(i, candidate, count, `Match → count=${count}`),
        });
      } else {
        count--;
        steps.push({
          line: 10,
          explanation: `nums[${i}]=${nums[i]} != candidate=${candidate}. count = ${count}.`,
          variables: { i, 'nums[i]': nums[i], candidate, count },
          visualization: makeViz(i, candidate, count, `Mismatch → count=${count}`),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Voting complete. Majority element is ${candidate} (appears more than ${Math.floor(n / 2)} times).`,
      variables: { result: candidate },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(
          nums.map((v, k) => [k, v === candidate ? 'found' : 'visited']),
        ),
        labels: {},
        auxData: {
          label: 'Result',
          entries: [{ key: 'Majority Element', value: String(candidate) }],
        },
      },
    });

    return steps;
  },
};

export default majorityElement;
