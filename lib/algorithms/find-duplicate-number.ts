import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findDuplicateNumber: AlgorithmDefinition = {
  id: 'find-duplicate-number',
  title: 'Find the Duplicate Number',
  leetcodeNumber: 287,
  difficulty: 'Medium',
  category: 'Fast And Slow Pointers',
  description:
    'Given an array of n+1 integers where each integer is between 1 and n, find the duplicate number using Floyd\'s cycle detection algorithm. Treat array values as pointers to next indices to create a linked list with a cycle.',
  tags: ['fast and slow pointers', "floyd's cycle detection", 'array', 'linked list'],

  code: {
    pseudocode: `function findDuplicate(nums):
  // Phase 1: find intersection point
  slow = nums[0], fast = nums[0]
  do:
    slow = nums[slow]
    fast = nums[nums[fast]]
  while slow != fast

  // Phase 2: find cycle entry (duplicate)
  slow = nums[0]
  while slow != fast:
    slow = nums[slow]
    fast = nums[fast]
  return slow`,

    python: `def findDuplicate(nums: list[int]) -> int:
    slow = fast = nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow`,

    javascript: `function findDuplicate(nums) {
  let slow = nums[0], fast = nums[0];
  do {
    slow = nums[slow];
    fast = nums[nums[fast]];
  } while (slow !== fast);
  slow = nums[0];
  while (slow !== fast) {
    slow = nums[slow];
    fast = nums[fast];
  }
  return slow;
}`,

    java: `public int findDuplicate(int[] nums) {
    int slow = nums[0], fast = nums[0];
    do {
        slow = nums[slow];
        fast = nums[nums[fast]];
    } while (slow != fast);
    slow = nums[0];
    while (slow != fast) {
        slow = nums[slow];
        fast = nums[fast];
    }
    return slow;
}`,
  },

  defaultInput: { nums: [1, 3, 4, 2, 2] },

  inputFields: [
    {
      name: 'nums',
      label: 'Array (n+1 integers, values 1..n)',
      type: 'array',
      defaultValue: [1, 3, 4, 2, 2],
      placeholder: '1,3,4,2,2',
      helperText: 'Array of n+1 integers where values are in range [1,n] and exactly one value repeats',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = (input.nums as number[]) || [1, 3, 4, 2, 2];
    const steps: AlgorithmStep[] = [];
    const n = nums.length;

    const makeViz = (
      slowIdx: number | null,
      fastIdx: number | null,
      highlights: Record<number, string>,
      phase: string
    ): ArrayVisualization => {
      const h: Record<number, string> = { ...highlights };
      const l: Record<number, string> = {};

      if (slowIdx !== null) {
        h[slowIdx] = 'pointer';
        l[slowIdx] = (l[slowIdx] ? l[slowIdx] + '/' : '') + 'slow';
      }
      if (fastIdx !== null && fastIdx !== slowIdx) {
        h[fastIdx] = 'active';
        l[fastIdx] = 'fast';
      } else if (fastIdx !== null && fastIdx === slowIdx) {
        h[fastIdx] = 'found';
        l[fastIdx] = 'slow=fast';
      }

      return {
        type: 'array',
        array: nums,
        highlights: h,
        labels: l,
        auxData: {
          label: 'Floyd\'s Algorithm',
          entries: [
            { key: 'phase', value: phase },
            { key: 'slow index', value: slowIdx !== null ? `${slowIdx} (val=${nums[slowIdx]})` : '-' },
            { key: 'fast index', value: fastIdx !== null ? `${fastIdx} (val=${nums[fastIdx]})` : '-' },
          ],
        },
      };
    };

    steps.push({
      line: 2,
      explanation: `Initialize slow and fast both at index 0 (value ${nums[0]}). Think of nums[i] as "go to index nums[i]", creating a linked list.`,
      variables: { slow: nums[0], fast: nums[0], phase: 'Phase 1' },
      visualization: makeViz(0, 0, {}, 'Phase 1: Find intersection'),
    });

    let slow = nums[0];
    let fast = nums[0];
    let iterations = 0;

    // Phase 1
    do {
      slow = nums[slow];
      fast = nums[nums[fast]];
      iterations++;

      steps.push({
        line: 5,
        explanation: `Phase 1, iteration ${iterations}: slow moves to index ${slow} (value ${nums[slow]}), fast moves to index ${fast} (value ${nums[fast]}). ${slow === fast ? 'INTERSECTION FOUND!' : 'Not equal yet.'}`,
        variables: { slow, fast, slowVal: nums[slow], fastVal: nums[fast] },
        visualization: makeViz(slow, fast, {}, 'Phase 1: Find intersection'),
      });

      if (iterations > n + 2) break; // safety
    } while (slow !== fast);

    steps.push({
      line: 8,
      explanation: `Phase 1 complete. Intersection at index ${slow}. Now reset slow to nums[0]=${nums[0]} to find cycle entry (the duplicate).`,
      variables: { intersectionIndex: slow, slow: nums[0], fast: slow },
      visualization: makeViz(0, slow, { [slow]: 'found' }, 'Phase 2: Find cycle entry'),
    });

    // Phase 2
    slow = nums[0];
    while (slow !== fast) {
      slow = nums[slow];
      fast = nums[fast];

      steps.push({
        line: 10,
        explanation: `Phase 2: slow moves to index ${slow}, fast moves to index ${fast}. ${slow === fast ? 'Both meet at cycle entry = DUPLICATE!' : 'Moving at same speed toward cycle entry.'}`,
        variables: { slow, fast, slowVal: nums[slow], fastVal: nums[fast] },
        visualization: makeViz(slow, fast, slow === fast ? { [slow]: 'found' } : {}, 'Phase 2: Find cycle entry'),
      });
    }

    steps.push({
      line: 11,
      explanation: `Duplicate number found! slow === fast === ${slow}. This is the number that appears twice, creating the cycle.`,
      variables: { duplicate: slow, result: slow },
      visualization: makeViz(slow, slow, { [slow]: 'found' }, 'DONE'),
    });

    return steps;
  },
};

export default findDuplicateNumber;
