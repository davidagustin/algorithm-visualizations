import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const permutationSequenceII: AlgorithmDefinition = {
  id: 'permutation-sequence-ii',
  title: 'Permutation Sequence II',
  leetcodeNumber: 60,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Find the k-th permutation of numbers 1 to n in lexicographic order without generating all permutations. Use factorial number system: at each position, determine which digit goes there by dividing k by (n-1)!. Greedily pick the (k/(n-1)!)-th remaining digit. O(n²) time.',
  tags: ['Math', 'Recursion', 'String'],
  code: {
    pseudocode: `function getPermutation(n, k):
  nums = [1, 2, ..., n]
  factorials = [1, 1, 2, 6, 24, ...]
  k -= 1  // 0-indexed
  result = ""
  for i from n down to 1:
    idx = k / factorial(i-1)
    result += nums[idx]
    nums.remove(idx)
    k %= factorial(i-1)
  return result`,
    python: `def getPermutation(n, k):
    from math import factorial
    nums = list(range(1, n+1))
    k -= 1
    result = []
    for i in range(n, 0, -1):
        idx = k // factorial(i-1)
        result.append(str(nums[idx]))
        nums.pop(idx)
        k %= factorial(i-1)
    return ''.join(result)`,
    javascript: `function getPermutation(n, k) {
  const nums = Array.from({length:n},(_,i)=>i+1);
  const fact = Array(n+1).fill(1);
  for (let i=1; i<=n; i++) fact[i]=fact[i-1]*i;
  k--;
  let result = '';
  for (let i=n; i>=1; i--) {
    const idx = Math.floor(k/fact[i-1]);
    result += nums[idx];
    nums.splice(idx,1);
    k %= fact[i-1];
  }
  return result;
}`,
    java: `public String getPermutation(int n, int k) {
    List<Integer> nums=new ArrayList<>();
    int[] fact=new int[n+1]; fact[0]=1;
    for(int i=1;i<=n;i++){nums.add(i);fact[i]=fact[i-1]*i;}
    k--;
    StringBuilder sb=new StringBuilder();
    for(int i=n;i>=1;i--){
        int idx=k/fact[i-1];
        sb.append(nums.get(idx));
        nums.remove(idx);
        k%=fact[i-1];
    }
    return sb.toString();
}`,
  },
  defaultInput: { n: 4, k: 9 },
  inputFields: [
    {
      name: 'n',
      label: 'N',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Permutations of 1 to N',
    },
    {
      name: 'k',
      label: 'K',
      type: 'number',
      defaultValue: 9,
      placeholder: '9',
      helperText: 'K-th permutation (1-indexed)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    let k = (input.k as number) - 1; // 0-indexed
    const steps: AlgorithmStep[] = [];

    const fact = Array(n + 1).fill(1);
    for (let i = 1; i <= n; i++) fact[i] = fact[i - 1] * i;

    const nums = Array.from({ length: n }, (_, i) => i + 1);
    const result: number[] = [];

    const makeViz = (
      remaining: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization => ({
      type: 'array',
      array: [...remaining],
      highlights,
      labels,
      auxData: { label: 'Permutation Sequence', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `getPermutation(n=${n}, k=${k + 1}). Convert to 0-indexed: k=${k}. Available: [${nums.join(',')}]. Total: ${fact[n]} permutations.`,
      variables: { n, k, factorials: [...fact] },
      visualization: makeViz(
        nums,
        {},
        Object.fromEntries(nums.map((v, i) => [i, String(v)])),
        [{ key: 'n', value: String(n) }, { key: 'k (0-indexed)', value: String(k) }, { key: 'Total Perms', value: String(fact[n]) }],
      ),
    });

    for (let i = n; i >= 1; i--) {
      const idx = Math.floor(k / fact[i - 1]);
      const chosen = nums[idx];
      result.push(chosen);
      nums.splice(idx, 1);
      const rem = k % fact[i - 1];

      steps.push({
        line: 6,
        explanation: `Position ${n - i + 1}: k=${k}, factorial(${i-1})=${fact[i-1]}. idx=floor(${k}/${fact[i-1]})=${idx}. Choose nums[${idx}]=${chosen}. k=${k}%${fact[i-1]}=${rem}.`,
        variables: { position: n - i + 1, k, factorial: fact[i - 1], idx, chosen, newK: rem },
        visualization: makeViz(
          [...nums],
          { [0]: 'active' },
          Object.fromEntries(nums.map((v, j) => [j, String(v)])),
          [{ key: `Position ${n - i + 1}`, value: String(chosen) }, { key: 'Remaining k', value: String(rem) }, { key: 'Result so far', value: result.join('') }],
        ),
      });

      k = rem;
    }

    steps.push({
      line: 9,
      explanation: `Done! The ${(input.k as number)}-th permutation of [1..${n}] is "${result.join('')}".`,
      variables: { result: result.join('') },
      visualization: makeViz(
        result,
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((v, i) => [i, String(v)])),
        [{ key: 'Answer', value: result.join('') }],
      ),
    });

    return steps;
  },
};

export default permutationSequenceII;
