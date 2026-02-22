import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const checkIfArrayPairsDivisibleByK: AlgorithmDefinition = {
  id: 'check-if-array-pairs-divisible-by-k',
  title: 'Check If Array Pairs Are Divisible by K',
  leetcodeNumber: 1497,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an array of even length and integer k, determine if you can divide the array into pairs such that each pair sum is divisible by k. Count remainders modulo k using a hash map: remainder r must be paired with remainder (k-r). Handle remainder 0 and k/2 separately.',
  tags: ['hash map', 'array', 'math', 'divisibility'],

  code: {
    pseudocode: `function canArrange(arr, k):
  remCount = {}
  for num in arr:
    r = ((num % k) + k) % k
    remCount[r] = remCount.get(r, 0) + 1
  for r, cnt in remCount.items():
    if r == 0:
      if cnt % 2 != 0: return False
    else:
      if remCount.get(k - r, 0) != cnt: return False
  return True`,

    python: `def canArrange(arr: list[int], k: int) -> bool:
    from collections import Counter
    rem = Counter(((n % k) + k) % k for n in arr)
    for r, cnt in rem.items():
        if r == 0:
            if cnt % 2: return False
        elif rem.get(k - r, 0) != cnt:
            return False
    return True`,

    javascript: `function canArrange(arr, k) {
  const rem = new Map();
  for (const n of arr) {
    const r = ((n % k) + k) % k;
    rem.set(r, (rem.get(r) || 0) + 1);
  }
  for (const [r, cnt] of rem) {
    if (r === 0) { if (cnt % 2 !== 0) return false; }
    else if ((rem.get(k - r) || 0) !== cnt) return false;
  }
  return true;
}`,

    java: `public boolean canArrange(int[] arr, int k) {
    Map<Integer, Integer> rem = new HashMap<>();
    for (int n : arr) rem.merge(((n % k) + k) % k, 1, Integer::sum);
    for (Map.Entry<Integer, Integer> e : rem.entrySet()) {
        int r = e.getKey(), cnt = e.getValue();
        if (r == 0) { if (cnt % 2 != 0) return false; }
        else if (!rem.getOrDefault(k - r, 0).equals(cnt)) return false;
    }
    return true;
}`,
  },

  defaultInput: {
    arr: [1, 2, 3, 4, 5, 10, 6, 7, 8, 9],
    k: 5,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5, 10, 6, 7, 8, 9],
      placeholder: '1,2,3,4,5,10,6,7,8,9',
      helperText: 'Even-length array of integers',
    },
    {
      name: 'k',
      label: 'k',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Divisor',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const remCount: Record<number, number> = {};

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Count remainders mod k (=${k}) for each element. Use ((n%k)+k)%k to handle negatives.`,
      variables: { k, remCount: '{}' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < arr.length; i++) {
      const r = ((arr[i] % k) + k) % k;
      remCount[r] = (remCount[r] || 0) + 1;

      steps.push({
        line: 3,
        explanation: `arr[${i}]=${arr[i]}: remainder = ((${arr[i]} % ${k}) + ${k}) % ${k} = ${r}. remCount[${r}] = ${remCount[r]}.`,
        variables: { i, num: arr[i], remainder: r, remCount: JSON.stringify(remCount) },
        visualization: makeViz({ [i]: 'active' }, { [i]: `r=${r}` }),
      });
    }

    steps.push({
      line: 5,
      explanation: `Remainder map: ${JSON.stringify(remCount)}. Now verify each remainder can be paired.`,
      variables: { remCount: JSON.stringify(remCount) },
      visualization: makeViz({}, {}),
    });

    let canArrange = true;

    for (const rStr of Object.keys(remCount)) {
      const r = Number(rStr);
      const cnt = remCount[r];

      if (r === 0) {
        if (cnt % 2 !== 0) {
          canArrange = false;
          steps.push({
            line: 8,
            explanation: `Remainder 0: count = ${cnt} (odd). Cannot pair all. Result = false.`,
            variables: { remainder: 0, count: cnt, canArrange: false },
            visualization: makeViz({}, {}),
          });
          break;
        } else {
          steps.push({
            line: 8,
            explanation: `Remainder 0: count = ${cnt} (even). All zeros can pair with each other.`,
            variables: { remainder: 0, count: cnt },
            visualization: makeViz({}, {}),
          });
        }
      } else {
        const partner = k - r;
        const partnerCnt = remCount[partner] || 0;
        if (partnerCnt !== cnt) {
          canArrange = false;
          steps.push({
            line: 10,
            explanation: `Remainder ${r}: count=${cnt}. Partner remainder ${partner}: count=${partnerCnt}. Counts differ! Result = false.`,
            variables: { remainder: r, count: cnt, partner, partnerCount: partnerCnt, canArrange: false },
            visualization: makeViz({}, {}),
          });
          break;
        } else {
          steps.push({
            line: 10,
            explanation: `Remainder ${r}: count=${cnt}. Partner remainder ${partner}: count=${partnerCnt}. Counts match.`,
            variables: { remainder: r, count: cnt, partner, partnerCount: partnerCnt },
            visualization: makeViz({}, {}),
          });
        }
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Can all pairs be divisible by ${k}? ${canArrange}.`,
      variables: { result: canArrange },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default checkIfArrayPairsDivisibleByK;
