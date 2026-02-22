import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestConsecutiveSequenceIi: AlgorithmDefinition = {
  id: 'longest-consecutive-sequence-ii',
  title: 'Longest Consecutive Sequence (Detailed)',
  leetcodeNumber: 128,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Find the length of the longest consecutive integer sequence in an unsorted array. Uses a hash set for O(1) lookups. For each number that starts a sequence (num-1 not in set), count consecutive numbers forward. Achieves O(n) overall time.',
  tags: ['hash map', 'hash set', 'array', 'sequence'],

  code: {
    pseudocode: `function longestConsecutive(nums):
  numSet = set(nums)
  best = 0
  for num in numSet:
    if num - 1 not in numSet:
      cur = num
      streak = 1
      while cur + 1 in numSet:
        cur += 1
        streak += 1
      best = max(best, streak)
  return best`,

    python: `def longestConsecutive(nums: list[int]) -> int:
    num_set = set(nums)
    best = 0
    for num in num_set:
        if num - 1 not in num_set:
            cur, streak = num, 1
            while cur + 1 in num_set:
                cur += 1
                streak += 1
            best = max(best, streak)
    return best`,

    javascript: `function longestConsecutive(nums) {
  const s = new Set(nums);
  let best = 0;
  for (const num of s) {
    if (!s.has(num - 1)) {
      let cur = num, streak = 1;
      while (s.has(cur + 1)) { cur++; streak++; }
      best = Math.max(best, streak);
    }
  }
  return best;
}`,

    java: `public int longestConsecutive(int[] nums) {
    Set<Integer> s = new HashSet<>();
    for (int n : nums) s.add(n);
    int best = 0;
    for (int num : s) {
        if (!s.contains(num - 1)) {
            int cur = num, streak = 1;
            while (s.contains(cur + 1)) { cur++; streak++; }
            best = Math.max(best, streak);
        }
    }
    return best;
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
    let best = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Build a hash set from the array: {${Array.from(numSet).join(', ')}}. This enables O(1) membership checks.`,
      variables: { numSet: Array.from(numSet).join(','), best: 0 },
      visualization: makeViz({}, {}),
    });

    const setArr = Array.from(numSet);
    for (const num of setArr) {
      const idx = nums.indexOf(num);

      if (!numSet.has(num - 1)) {
        steps.push({
          line: 4,
          explanation: `num=${num}: ${num - 1} is NOT in the set, so ${num} is the start of a sequence. Begin counting.`,
          variables: { num, startsSequence: true, best },
          visualization: makeViz({ [idx >= 0 ? idx : 0]: 'active' }, { [idx >= 0 ? idx : 0]: 'start' }),
        });

        let cur = num;
        let streak = 1;

        while (numSet.has(cur + 1)) {
          cur++;
          streak++;
          const curIdx = nums.indexOf(cur);
          steps.push({
            line: 8,
            explanation: `Found ${cur} in set. Streak extended to ${streak}.`,
            variables: { cur, streak, best },
            visualization: makeViz(
              { [curIdx >= 0 ? curIdx : 0]: 'found' },
              { [curIdx >= 0 ? curIdx : 0]: `${streak}` }
            ),
          });
        }

        best = Math.max(best, streak);
        steps.push({
          line: 9,
          explanation: `Sequence ${num}..${cur} has length ${streak}. Update best = max(${best}, ${streak}) = ${best}.`,
          variables: { sequenceStart: num, sequenceEnd: cur, streak, best },
          visualization: makeViz({ [idx >= 0 ? idx : 0]: 'sorted' }, { [idx >= 0 ? idx : 0]: `len=${streak}` }),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `num=${num}: ${num - 1} IS in the set, so ${num} is NOT a sequence start. Skip.`,
          variables: { num, startsSequence: false, best },
          visualization: makeViz({ [idx >= 0 ? idx : 0]: 'visited' }, { [idx >= 0 ? idx : 0]: 'skip' }),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `All numbers processed. Longest consecutive sequence = ${best}.`,
      variables: { result: best },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default longestConsecutiveSequenceIi;
