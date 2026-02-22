import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const threeSumWithMultiplicity: AlgorithmDefinition = {
  id: 'three-sum-with-multiplicity',
  title: '3Sum With Multiplicity',
  leetcodeNumber: 923,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Count the number of ordered triplets (i, j, k) where i < j < k and arr[i] + arr[j] + arr[k] == target. Sort the array, then for each element fix it as the first, and use two pointers for the remaining pair. Handle duplicates carefully to count multiplicities.',
  tags: ['two pointers', 'array', 'sorting', 'combinatorics'],

  code: {
    pseudocode: `function threeSumMulti(arr, target):
  sort(arr)
  MOD = 1e9+7, ans = 0
  n = length(arr)
  for i = 0 to n-3:
    j = i+1, k = n-1
    while j < k:
      s = arr[i]+arr[j]+arr[k]
      if s == target:
        if arr[j]==arr[k]: ans += (k-j)*(k-j+1)/2; break
        else:
          cntJ = count of arr[j] duplicates
          cntK = count of arr[k] duplicates
          ans += cntJ * cntK; j += cntJ; k -= cntK
      elif s < target: j++
      else: k--
  return ans % MOD`,

    python: `def threeSumMulti(arr: list[int], target: int) -> int:
    arr.sort()
    MOD = 10**9 + 7
    ans, n = 0, len(arr)
    for i in range(n - 2):
        j, k = i + 1, n - 1
        while j < k:
            s = arr[i] + arr[j] + arr[k]
            if s == target:
                if arr[j] == arr[k]:
                    m = k - j + 1
                    ans += m * (m - 1) // 2
                    break
                else:
                    cj, ck = 1, 1
                    while j + cj < k and arr[j+cj] == arr[j]: cj += 1
                    while k - ck > j and arr[k-ck] == arr[k]: ck += 1
                    ans += cj * ck
                    j += cj; k -= ck
            elif s < target:
                j += 1
            else:
                k -= 1
    return ans % MOD`,

    javascript: `function threeSumMulti(arr, target) {
  arr.sort((a, b) => a - b);
  const MOD = 1e9 + 7;
  let ans = 0, n = arr.length;
  for (let i = 0; i < n - 2; i++) {
    let j = i + 1, k = n - 1;
    while (j < k) {
      const s = arr[i] + arr[j] + arr[k];
      if (s === target) {
        if (arr[j] === arr[k]) {
          const m = k - j + 1;
          ans = (ans + m * (m - 1) / 2) % MOD;
          break;
        } else {
          let cj = 1, ck = 1;
          while (j + cj < k && arr[j+cj] === arr[j]) cj++;
          while (k - ck > j && arr[k-ck] === arr[k]) ck++;
          ans = (ans + cj * ck) % MOD;
          j += cj; k -= ck;
        }
      } else if (s < target) j++;
      else k--;
    }
  }
  return ans;
}`,

    java: `public int threeSumMulti(int[] arr, int target) {
    Arrays.sort(arr);
    long ans = 0, MOD = 1_000_000_007;
    int n = arr.length;
    for (int i = 0; i < n - 2; i++) {
        int j = i + 1, k = n - 1;
        while (j < k) {
            int s = arr[i] + arr[j] + arr[k];
            if (s == target) {
                if (arr[j] == arr[k]) {
                    long m = k - j + 1;
                    ans = (ans + m * (m-1) / 2) % MOD; break;
                } else {
                    long cj = 1, ck = 1;
                    while (j+cj < k && arr[(int)(j+cj)] == arr[j]) cj++;
                    while (k-ck > j && arr[(int)(k-ck)] == arr[k]) ck++;
                    ans = (ans + cj * ck) % MOD;
                    j += cj; k -= ck;
                }
            } else if (s < target) j++;
            else k--;
        }
    }
    return (int) ans;
}`,
  },

  defaultInput: {
    arr: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
    target: 8,
  },

  inputFields: [
    {
      name: 'arr',
      label: 'Array',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5],
      placeholder: '1,1,2,2,3,3,4,4,5,5',
      helperText: 'Comma-separated integers',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 8,
      placeholder: '8',
      helperText: 'Target triplet sum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawArr = input.arr as number[];
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];

    const arr = [...rawArr].sort((a, b) => a - b);
    const n = arr.length;
    const MOD = 1000000007;
    let ans = 0;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort: [${arr.join(', ')}]. Fix i as first element, use two pointers j and k for the pair summing to target - arr[i].`,
      variables: { sorted: [...arr], target },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < n - 2; i++) {
      let j = i + 1;
      let k = n - 1;

      steps.push({
        line: 4,
        explanation: `Fix i=${i}, arr[i]=${arr[i]}. Need pair from indices ${j}..${k} summing to ${target - arr[i]}.`,
        variables: { i, 'arr[i]': arr[i], j, k, needed: target - arr[i] },
        visualization: makeViz({ [i]: 'active', [j]: 'pointer', [k]: 'pointer' }, { [i]: 'i', [j]: 'j', [k]: 'k' }),
      });

      while (j < k) {
        const s = arr[i] + arr[j] + arr[k];

        if (s === target) {
          if (arr[j] === arr[k]) {
            const m = k - j + 1;
            const c = (m * (m - 1)) / 2;
            ans = (ans + c) % MOD;
            steps.push({
              line: 9,
              explanation: `arr[j]=arr[k]=${arr[j]}. All ${m} elements between j and k form ${c} pairs. ans=${ans}.`,
              variables: { j, k, 'arr[j]': arr[j], m, c, ans },
              visualization: makeViz({ [i]: 'active', ...Object.fromEntries(Array.from({ length: k - j + 1 }, (_, t) => [t + j, 'found'])) }, { [i]: 'i', [j]: 'j', [k]: 'k' }),
            });
            break;
          } else {
            let cj = 1;
            let ck = 1;
            while (j + cj < k && arr[j + cj] === arr[j]) cj++;
            while (k - ck > j && arr[k - ck] === arr[k]) ck++;
            const c = cj * ck;
            ans = (ans + c) % MOD;
            steps.push({
              line: 14,
              explanation: `sum=${s}==target. ${cj} copies of ${arr[j]} at j-side, ${ck} copies of ${arr[k]} at k-side. Add ${c} triplets. ans=${ans}.`,
              variables: { i, j, k, cj, ck, c, ans },
              visualization: makeViz({ [i]: 'active', [j]: 'found', [k]: 'found' }, { [i]: 'i', [j]: `x${cj}`, [k]: `x${ck}` }),
            });
            j += cj;
            k -= ck;
          }
        } else if (s < target) {
          steps.push({
            line: 16,
            explanation: `sum=${s} < target=${target}. Move j right.`,
            variables: { i, j, k, sum: s, ans },
            visualization: makeViz({ [i]: 'active', [j]: 'comparing', [k]: 'pointer' }, { [i]: 'i', [j]: 'j++', [k]: 'k' }),
          });
          j++;
        } else {
          steps.push({
            line: 17,
            explanation: `sum=${s} > target=${target}. Move k left.`,
            variables: { i, j, k, sum: s, ans },
            visualization: makeViz({ [i]: 'active', [j]: 'pointer', [k]: 'comparing' }, { [i]: 'i', [j]: 'j', [k]: 'k--' }),
          });
          k--;
        }
      }
    }

    steps.push({
      line: 18,
      explanation: `Total triplets with sum ${target}: ${ans}.`,
      variables: { ans },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default threeSumWithMultiplicity;
