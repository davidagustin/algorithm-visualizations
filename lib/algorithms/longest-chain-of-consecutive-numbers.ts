import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestChainOfConsecutiveNumbers: AlgorithmDefinition = {
  id: 'longest-chain-of-consecutive-numbers',
  title: 'Longest Consecutive Sequence',
  leetcodeNumber: 128,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an unsorted array of integers, find the length of the longest consecutive elements sequence in O(n) time. Build a hash set, then for each number that is the start of a sequence (no predecessor in set), extend the chain as far as possible.',
  tags: ['hash set', 'array', 'sequence'],

  code: {
    pseudocode: `function longestConsecutive(nums):
  numSet = set(nums)
  longest = 0
  for num in numSet:
    if (num - 1) not in numSet:
      current = num
      streak = 1
      while (current + 1) in numSet:
        current++
        streak++
      longest = max(longest, streak)
  return longest`,

    python: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    longest = 0
    for num in num_set:
        if num - 1 not in num_set:
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            longest = max(longest, streak)
    return longest`,

    javascript: `function longestConsecutive(nums) {
  const numSet = new Set(nums);
  let longest = 0;
  for (const num of numSet) {
    if (!numSet.has(num - 1)) {
      let current = num;
      let streak = 1;
      while (numSet.has(current + 1)) {
        current++;
        streak++;
      }
      longest = Math.max(longest, streak);
    }
  }
  return longest;
}`,

    java: `public int longestConsecutive(int[] nums) {
    Set<Integer> numSet = new HashSet<>();
    for (int n : nums) numSet.add(n);
    int longest = 0;
    for (int num : numSet) {
        if (!numSet.contains(num - 1)) {
            int current = num;
            int streak = 1;
            while (numSet.contains(current + 1)) {
                current++;
                streak++;
            }
            longest = Math.max(longest, streak);
        }
    }
    return longest;
}`,
  },

  defaultInput: {
    nums: [100, 4, 200, 1, 3, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [100, 4, 200, 1, 3, 2],
      placeholder: '100,4,200,1,3,2',
      helperText: 'Comma-separated integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const numSet = new Set(nums);
    let longest = 0;
    let bestStart = 0;
    let bestLen = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      setEntries: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
      auxData: {
        label: 'Hash Set',
        entries: setEntries,
      },
    });

    const getSetEntries = (): { key: string; value: string }[] =>
      Array.from(numSet).sort((a, b) => a - b).map(n => ({ key: String(n), value: 'in set' }));

    // Step: Build hash set
    steps.push({
      line: 2,
      explanation: `Build a hash set from the array: {${Array.from(numSet).sort((a, b) => a - b).join(', ')}}. This allows O(1) lookups.`,
      variables: { numSet: Array.from(numSet).sort((a, b) => a - b) },
      visualization: makeViz({}, {}, getSetEntries()),
    });

    // Iterate through set
    for (let i = 0; i < nums.length; i++) {
      const num = nums[i];

      // Check if it is a sequence start
      if (numSet.has(num - 1)) {
        steps.push({
          line: 5,
          explanation: `num = ${num}. Since ${num - 1} is in the set, ${num} is NOT a sequence start. Skip.`,
          variables: { num, longest },
          visualization: makeViz(
            { [i]: 'visited' },
            { [i]: 'skip' },
            getSetEntries()
          ),
        });
        continue;
      }

      // This is a sequence start
      steps.push({
        line: 5,
        explanation: `num = ${num}. ${num - 1} is NOT in the set, so ${num} is a sequence start!`,
        variables: { num, longest },
        visualization: makeViz(
          { [i]: 'active' },
          { [i]: 'start' },
          getSetEntries()
        ),
      });

      let current = num;
      let streak = 1;

      while (numSet.has(current + 1)) {
        current++;
        streak++;
      }

      // Show the full chain found
      const chainHighlights: Record<number, string> = {};
      const chainLabels: Record<number, string> = {};
      for (let k = 0; k < nums.length; k++) {
        if (nums[k] >= num && nums[k] <= current) {
          chainHighlights[k] = 'found';
          chainLabels[k] = `c${nums[k] - num + 1}`;
        }
      }

      steps.push({
        line: 9,
        explanation: `Extended chain from ${num} to ${current}. Streak length = ${streak}.`,
        variables: { start: num, end: current, streak, longest },
        visualization: makeViz(chainHighlights, chainLabels, getSetEntries()),
      });

      if (streak > longest) {
        longest = streak;
        bestStart = num;
        bestLen = streak;

        steps.push({
          line: 10,
          explanation: `New longest! longest = ${longest} (sequence: ${num} to ${current}).`,
          variables: { longest, sequence: Array.from({ length: streak }, (_, k) => num + k) },
          visualization: makeViz(chainHighlights, chainLabels, getSetEntries()),
        });
      }
    }

    // Final
    const finalHighlights: Record<number, string> = {};
    for (let k = 0; k < nums.length; k++) {
      if (nums[k] >= bestStart && nums[k] < bestStart + bestLen) {
        finalHighlights[k] = 'found';
      } else {
        finalHighlights[k] = 'visited';
      }
    }

    steps.push({
      line: 11,
      explanation: `Done! Longest consecutive sequence has length ${longest}: [${Array.from({ length: bestLen }, (_, k) => bestStart + k).join(', ')}].`,
      variables: { result: longest },
      visualization: makeViz(finalHighlights, {}, getSetEntries()),
    });

    return steps;
  },
};

export default longestChainOfConsecutiveNumbers;
