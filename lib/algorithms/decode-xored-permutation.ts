import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const decodeXoredPermutation: AlgorithmDefinition = {
  id: 'decode-xored-permutation',
  title: 'Decode XORed Permutation',
  leetcodeNumber: 1734,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given encoded array where encoded[i] = perm[i] XOR perm[i+1] and perm is a permutation of [1..n], recover perm. Key: XOR all of 1..n to get totalXor. Use encoded[i] for even i to find perm[0] = totalXor XOR (encoded[1] XOR encoded[3] XOR ...). Then decode the rest.',
  tags: ['bit manipulation', 'xor', 'array'],

  code: {
    pseudocode: `function decode(encoded):
  n = len(encoded) + 1
  totalXor = XOR(1..n)
  // encoded[odd indices] = perm[even] XOR perm[odd]
  // XOR of encoded[1], encoded[3],... = perm[1] XOR perm[2] XOR ... XOR perm[n-1]
  oddXor = XOR of encoded[i] for odd i
  perm[0] = totalXor XOR oddXor
  for i in 1..n-1:
    perm[i] = perm[i-1] XOR encoded[i-1]
  return perm`,

    python: `def decode(encoded):
    n = len(encoded) + 1
    total = 0
    for i in range(1, n + 1): total ^= i
    odd = 0
    for i in range(1, len(encoded), 2): odd ^= encoded[i]
    perm = [total ^ odd]
    for i in range(1, n):
        perm.append(perm[-1] ^ encoded[i - 1])
    return perm`,

    javascript: `function decode(encoded) {
  const n = encoded.length + 1;
  let total = 0;
  for (let i = 1; i <= n; i++) total ^= i;
  let odd = 0;
  for (let i = 1; i < encoded.length; i += 2) odd ^= encoded[i];
  const perm = [total ^ odd];
  for (let i = 1; i < n; i++) perm.push(perm[i - 1] ^ encoded[i - 1]);
  return perm;
}`,

    java: `public int[] decode(int[] encoded) {
    int n = encoded.length + 1;
    int total = 0;
    for (int i = 1; i <= n; i++) total ^= i;
    int odd = 0;
    for (int i = 1; i < encoded.length; i += 2) odd ^= encoded[i];
    int[] perm = new int[n];
    perm[0] = total ^ odd;
    for (int i = 1; i < n; i++) perm[i] = perm[i - 1] ^ encoded[i - 1];
    return perm;
}`,
  },

  defaultInput: { encoded: [3, 1] },
  inputFields: [
    {
      name: 'encoded',
      label: 'Encoded Array',
      type: 'array',
      defaultValue: [3, 1],
      placeholder: '3,1',
      helperText: 'encoded[i] = perm[i] XOR perm[i+1]; length must be odd',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const encoded = input.encoded as number[];
    const steps: AlgorithmStep[] = [];
    const n = encoded.length + 1;

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      extra: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
      auxData: { label: 'Decode XOR Permutation', entries: extra },
    });

    let total = 0;
    for (let i = 1; i <= n; i++) total ^= i;

    steps.push({
      line: 2,
      explanation: `n = ${n}. XOR of 1 to ${n} = ${total} (${total.toString(2)}). This is the XOR of the entire permutation.`,
      variables: { n, totalXor: total },
      visualization: makeViz(
        Array.from({ length: n }, (_, i) => i + 1),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'active'])),
        Object.fromEntries(Array.from({ length: n }, (_, i) => [i, String(i + 1)])),
        [{ key: 'totalXor (1..n)', value: `${total} (${total.toString(2)})` }]
      ),
    });

    let odd = 0;
    for (let i = 1; i < encoded.length; i += 2) odd ^= encoded[i];

    steps.push({
      line: 5,
      explanation: `XOR encoded at odd indices: ${encoded.filter((_, i) => i % 2 === 1).join(', ')} = ${odd}. This equals perm[1] XOR ... XOR perm[n-1].`,
      variables: { oddXor: odd, oddIndices: encoded.filter((_, i) => i % 2 === 1) },
      visualization: makeViz(
        encoded,
        Object.fromEntries(encoded.map((_, i) => [i, i % 2 === 1 ? 'active' : 'visited'])),
        Object.fromEntries(encoded.map((_, i) => [i, i % 2 === 1 ? 'odd' : 'even'])),
        [{ key: 'oddXor', value: `${odd} (${odd.toString(2)})` }]
      ),
    });

    const perm: number[] = [total ^ odd];
    steps.push({
      line: 6,
      explanation: `perm[0] = totalXor XOR oddXor = ${total} XOR ${odd} = ${perm[0]}. We've recovered the first element!`,
      variables: { 'perm[0]': perm[0] },
      visualization: makeViz(
        [perm[0]],
        { 0: 'found' },
        { 0: 'perm[0]' },
        [{ key: 'perm[0]', value: String(perm[0]) }]
      ),
    });

    for (let i = 1; i < n; i++) {
      perm.push(perm[i - 1] ^ encoded[i - 1]);
      steps.push({
        line: 7,
        explanation: `perm[${i}] = perm[${i - 1}] XOR encoded[${i - 1}] = ${perm[i - 1]} XOR ${encoded[i - 1]} = ${perm[i]}.`,
        variables: { i, 'perm[i]': perm[i], 'perm[i-1]': perm[i - 1], 'encoded[i-1]': encoded[i - 1] },
        visualization: makeViz(
          [...perm],
          Object.fromEntries(perm.map((_, j) => [j, j === i ? 'active' : 'found'])),
          Object.fromEntries(perm.map((_, j) => [j, `p[${j}]`])),
          [{ key: 'perm so far', value: `[${perm.join(', ')}]` }]
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Decoded permutation: [${perm.join(', ')}]. Verify: it is a permutation of 1..${n}.`,
      variables: { result: perm },
      visualization: makeViz(
        perm,
        Object.fromEntries(perm.map((_, i) => [i, 'found'])),
        Object.fromEntries(perm.map((_, i) => [i, `p[${i}]`])),
        [{ key: 'result', value: `[${perm.join(', ')}]` }]
      ),
    });

    return steps;
  },
};

export default decodeXoredPermutation;
