import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const continuousSubarraySum: AlgorithmDefinition = {
  id: 'continuous-subarray-sum',
  title: 'Continuous Subarray Sum',
  leetcodeNumber: 523,
  difficulty: 'Medium',
  category: 'Prefix Sum',
  description:
    'Given an integer array nums and an integer k, return true if nums has a continuous subarray of size at least 2 whose elements sum up to a multiple of k. Use a prefix sum modulo k: if two prefix sums have the same remainder mod k and are at least 2 indices apart, the subarray between them is divisible by k.',
  tags: ['prefix sum', 'hash map', 'modulo', 'subarray'],

  code: {
    pseudocode: `function checkSubarraySum(nums, k):
  map = {0: -1}
  prefixMod = 0
  for i in 0..n-1:
    prefixMod = (prefixMod + nums[i]) % k
    if prefixMod in map:
      if i - map[prefixMod] >= 2:
        return true
    else:
      map[prefixMod] = i
  return false`,

    python: `def checkSubarraySum(nums, k):
    seen = {0: -1}
    prefix_mod = 0
    for i, num in enumerate(nums):
        prefix_mod = (prefix_mod + num) % k
        if prefix_mod in seen:
            if i - seen[prefix_mod] >= 2:
                return True
        else:
            seen[prefix_mod] = i
    return False`,

    javascript: `function checkSubarraySum(nums, k) {
  const seen = new Map([[0, -1]]);
  let prefixMod = 0;
  for (let i = 0; i < nums.length; i++) {
    prefixMod = (prefixMod + nums[i]) % k;
    if (seen.has(prefixMod)) {
      if (i - seen.get(prefixMod) >= 2) return true;
    } else {
      seen.set(prefixMod, i);
    }
  }
  return false;
}`,

    java: `public boolean checkSubarraySum(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, -1);
    int prefixMod = 0;
    for (int i = 0; i < nums.length; i++) {
        prefixMod = (prefixMod + nums[i]) % k;
        if (seen.containsKey(prefixMod)) {
            if (i - seen.get(prefixMod) >= 2) return true;
        } else {
            seen.put(prefixMod, i);
        }
    }
    return false;
}`,
  },

  defaultInput: {
    nums: [23, 2, 4, 6, 7],
    k: 6,
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [23, 2, 4, 6, 7],
      placeholder: '23,2,4,6,7',
      helperText: 'Comma-separated non-negative integers',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Divisor to check against',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const seen = new Map<number, number>([[0, -1]]);
    let prefixMod = 0;
    let found = false;

    steps.push({
      line: 1,
      explanation: `Initialize seen={0: -1}, prefixMod=0. We look for subarray (len>=2) with sum divisible by k=${k}.`,
      variables: { k, prefixMod, seen: '{0:-1}' },
      visualization: {
        type: 'array',
        array: [...nums],
        highlights: {},
        labels: Object.fromEntries(nums.map((v, i) => [i, `${v}`])),
      },
    });

    for (let i = 0; i < nums.length; i++) {
      const prevMod = prefixMod;
      prefixMod = (prefixMod + nums[i]) % k;

      steps.push({
        line: 4,
        explanation: `i=${i}, nums[i]=${nums[i]}. prefixMod=(${prevMod}+${nums[i]})%${k}=${prefixMod}. Is ${prefixMod} in seen?`,
        variables: { i, 'nums[i]': nums[i], prevMod, prefixMod, k },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: { [i]: 'active' },
          labels: Object.fromEntries(nums.map((v, j) => [j, j === i ? `mod=${prefixMod}` : `${v}`])),
        },
      });

      if (seen.has(prefixMod)) {
        const prevIdx = seen.get(prefixMod)!;
        const dist = i - prevIdx;
        steps.push({
          line: 6,
          explanation: `prefixMod=${prefixMod} seen before at index ${prevIdx}. Distance = ${i} - ${prevIdx} = ${dist}. Valid subarray needs dist >= 2.`,
          variables: { prefixMod, prevIdx, currentIdx: i, dist, valid: dist >= 2 },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: Object.fromEntries(
              nums.map((_, j) => [j, j > prevIdx && j <= i ? 'comparing' : j === i ? 'active' : 'default'])
            ),
            labels: Object.fromEntries(nums.map((v, j) => [j,
              j === prevIdx + 1 ? 'start' :
              j === i ? 'end' :
              `${v}`
            ])),
          },
        });

        if (dist >= 2) {
          found = true;
          steps.push({
            line: 7,
            explanation: `Found valid subarray nums[${prevIdx + 1}..${i}] with sum divisible by ${k}. Return true.`,
            variables: { result: true },
            visualization: {
              type: 'array',
              array: [...nums],
              highlights: Object.fromEntries(
                nums.map((_, j) => [j, j > prevIdx && j <= i ? 'found' : 'default'])
              ),
              labels: Object.fromEntries(nums.map((_, j) => [j,
                j > prevIdx && j <= i ? 'in range' : ''
              ])),
            },
          });
          break;
        }
      } else {
        seen.set(prefixMod, i);
        steps.push({
          line: 8,
          explanation: `prefixMod=${prefixMod} not in map. Store seen[${prefixMod}]=${i}.`,
          variables: { prefixMod, i },
          visualization: {
            type: 'array',
            array: [...nums],
            highlights: { [i]: 'visited' },
            labels: Object.fromEntries(nums.map((v, j) => [j, j === i ? `mod=${prefixMod}` : `${v}`])),
          },
        });
      }
    }

    if (!found) {
      steps.push({
        line: 9,
        explanation: `No valid subarray found. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: [...nums],
          highlights: {},
          labels: { 0: 'Result: false' },
        },
      });
    }

    return steps;
  },
};

export default continuousSubarraySum;
