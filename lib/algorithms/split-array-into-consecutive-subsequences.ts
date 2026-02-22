import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitArrayIntoConsecutiveSubsequences: AlgorithmDefinition = {
  id: 'split-array-into-consecutive-subsequences',
  title: 'Split Array into Consecutive Subsequences',
  leetcodeNumber: 659,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Determine if a sorted array can be split into subsequences of length 3 or more, each consisting of consecutive integers. Greedily: for each number, prefer appending it to an existing subsequence ending at num-1; if none exists, try starting a new one (num, num+1, num+2).',
  tags: ['greedy', 'hash map', 'array', 'sorting'],

  code: {
    pseudocode: `function isPossible(nums):
  freq = count frequency of each number
  tail = map: num -> count of subsequences ending at num
  for each num in nums:
    if freq[num] == 0: continue
    if tail[num-1] > 0:
      tail[num-1]--; tail[num]++; freq[num]--
    elif freq[num] > 0 and freq[num+1] > 0 and freq[num+2] > 0:
      freq[num]--; freq[num+1]--; freq[num+2]--
      tail[num+2]++
    else: return false
  return true`,

    python: `def isPossible(nums: list[int]) -> bool:
    from collections import Counter
    freq = Counter(nums)
    tail = Counter()
    for num in nums:
        if freq[num] == 0:
            continue
        if tail[num - 1] > 0:
            tail[num - 1] -= 1
            tail[num] += 1
            freq[num] -= 1
        elif freq[num] >= 1 and freq[num+1] >= 1 and freq[num+2] >= 1:
            freq[num] -= 1; freq[num+1] -= 1; freq[num+2] -= 1
            tail[num+2] += 1
        else:
            return False
    return True`,

    javascript: `function isPossible(nums) {
  const freq = {}, tail = {};
  for (const n of nums) freq[n] = (freq[n] || 0) + 1;
  for (const num of nums) {
    if (!freq[num]) continue;
    if (tail[num - 1] > 0) {
      tail[num - 1]--; tail[num] = (tail[num] || 0) + 1; freq[num]--;
    } else if (freq[num] >= 1 && freq[num+1] >= 1 && freq[num+2] >= 1) {
      freq[num]--; freq[num+1]--; freq[num+2]--;
      tail[num+2] = (tail[num+2] || 0) + 1;
    } else return false;
  }
  return true;
}`,

    java: `public boolean isPossible(int[] nums) {
    Map<Integer, Integer> freq = new HashMap<>(), tail = new HashMap<>();
    for (int n : nums) freq.merge(n, 1, Integer::sum);
    for (int num : nums) {
        if (freq.getOrDefault(num, 0) == 0) continue;
        if (tail.getOrDefault(num - 1, 0) > 0) {
            tail.merge(num - 1, -1, Integer::sum);
            tail.merge(num, 1, Integer::sum);
            freq.merge(num, -1, Integer::sum);
        } else if (freq.getOrDefault(num+1,0)>0 && freq.getOrDefault(num+2,0)>0) {
            freq.merge(num,-1,Integer::sum); freq.merge(num+1,-1,Integer::sum); freq.merge(num+2,-1,Integer::sum);
            tail.merge(num+2,1,Integer::sum);
        } else return false;
    }
    return true;
}`,
  },

  defaultInput: {
    nums: [1, 2, 3, 3, 4, 5],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Sorted Array',
      type: 'array',
      defaultValue: [1, 2, 3, 3, 4, 5],
      placeholder: '1,2,3,3,4,5',
      helperText: 'Sorted array of integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    const freq: Record<number, number> = {};
    const tail: Record<number, number> = {};
    for (const n of nums) freq[n] = (freq[n] || 0) + 1;

    steps.push({
      line: 1,
      explanation: `Frequencies: {${Object.entries(freq).map(([k, v]) => k + ':' + v).join(', ')}}. tail (subsequences ending at each value) starts empty.`,
      variables: { freq: JSON.stringify(freq) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'active'])),
        labels: {},
      },
    });

    for (let ni = 0; ni < nums.length; ni++) {
      const num = nums[ni];

      if (!freq[num] || freq[num] === 0) {
        steps.push({
          line: 4,
          explanation: `num=${num}: frequency already 0 (used up). Skip.`,
          variables: { num, 'freq[num]': 0 },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [ni]: 'comparing' },
            labels: { [ni]: 'skip' },
          },
        });
        continue;
      }

      if ((tail[num - 1] || 0) > 0) {
        tail[num - 1]--;
        tail[num] = (tail[num] || 0) + 1;
        freq[num]--;

        steps.push({
          line: 5,
          explanation: `num=${num}: append to existing subsequence ending at ${num - 1}. tail[${num - 1}]=${tail[num - 1]}, tail[${num}]=${tail[num]}.`,
          variables: { num, action: 'append', 'tail[num-1]': tail[num - 1], 'tail[num]': tail[num] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [ni]: 'found' },
            labels: { [ni]: 'append' },
          },
        });
      } else if ((freq[num] || 0) >= 1 && (freq[num + 1] || 0) >= 1 && (freq[num + 2] || 0) >= 1) {
        freq[num]--;
        freq[num + 1]--;
        freq[num + 2]--;
        tail[num + 2] = (tail[num + 2] || 0) + 1;

        steps.push({
          line: 7,
          explanation: `num=${num}: start new subsequence [${num},${num + 1},${num + 2}]. tail[${num + 2}]=${tail[num + 2]}.`,
          variables: { num, action: 'new subseq', 'tail[num+2]': tail[num + 2] },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [ni]: 'active' },
            labels: { [ni]: 'new [' + num + ',' + (num + 1) + ',' + (num + 2) + ']' },
          },
        });
      } else {
        steps.push({
          line: 9,
          explanation: `num=${num}: cannot append (no subseq ending at ${num - 1}) and cannot start new (missing ${num + 1} or ${num + 2}). Return false.`,
          variables: { num, 'freq[num+1]': freq[num + 1] || 0, 'freq[num+2]': freq[num + 2] || 0 },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [ni]: 'mismatch' },
            labels: { [ni]: 'FAIL' },
          },
        });
        return steps;
      }
    }

    steps.push({
      line: 10,
      explanation: 'All numbers assigned to valid consecutive subsequences of length >= 3. Return true.',
      variables: { result: true, tail: JSON.stringify(tail) },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: Object.fromEntries(nums.map((_, i) => [i, 'found'])),
        labels: {},
      },
    });

    return steps;
  },
};

export default splitArrayIntoConsecutiveSubsequences;
