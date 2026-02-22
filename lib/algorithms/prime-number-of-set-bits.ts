import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const primeNumberOfSetBits: AlgorithmDefinition = {
  id: 'prime-number-of-set-bits',
  title: 'Prime Number of Set Bits in Binary Representation',
  leetcodeNumber: 762,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'Given a range [left, right], count integers whose number of set bits is prime. For each number, count its 1-bits, then check if that count is prime. Numbers in range have at most 20 bits, so only need to check primes up to 20: {2, 3, 5, 7, 11, 13, 17, 19}.',
  tags: ['bit manipulation', 'math'],

  code: {
    pseudocode: `function countPrimeSetBits(left, right):
  primes = {2,3,5,7,11,13,17,19}
  count = 0
  for n in left..right:
    bits = popcount(n)
    if bits in primes:
      count++
  return count`,

    python: `def countPrimeSetBits(left: int, right: int) -> int:
    primes = {2,3,5,7,11,13,17,19}
    return sum(bin(n).count('1') in primes for n in range(left, right + 1))`,

    javascript: `function countPrimeSetBits(left, right) {
  const primes = new Set([2,3,5,7,11,13,17,19]);
  let count = 0;
  for (let n = left; n <= right; n++) {
    const bits = n.toString(2).split('').filter(b => b === '1').length;
    if (primes.has(bits)) count++;
  }
  return count;
}`,

    java: `public int countPrimeSetBits(int left, int right) {
    Set<Integer> primes = new HashSet<>(Arrays.asList(2,3,5,7,11,13,17,19));
    int count = 0;
    for (int n = left; n <= right; n++)
        if (primes.contains(Integer.bitCount(n))) count++;
    return count;
}`,
  },

  defaultInput: { left: 6, right: 10 },
  inputFields: [
    {
      name: 'left',
      label: 'Left',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'right',
      label: 'Right',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const left = input.left as number;
    const right = input.right as number;
    const steps: AlgorithmStep[] = [];
    const primes = new Set([2, 3, 5, 7, 11, 13, 17, 19]);
    const popcount = (n: number) => n.toString(2).split('').filter(b => b === '1').length;

    const rangeNums = [];
    for (let i = left; i <= right; i++) rangeNums.push(i);

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
      auxData: { label: 'Prime Set Bits', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `Range [${left}, ${right}]. Primes to check: {2,3,5,7,11,13,17,19}. Count numbers whose popcount is prime.`,
      variables: { left, right },
      visualization: makeViz(
        rangeNums,
        Object.fromEntries(rangeNums.map((_, i) => [i, 'active'])),
        Object.fromEntries(rangeNums.map((v, i) => [i, v.toString(2)])),
        [{ key: 'range', value: `[${left}, ${right}]` }]
      ),
    });

    let count = 0;
    for (let idx = 0; idx < rangeNums.length; idx++) {
      const n = rangeNums[idx];
      const bits = popcount(n);
      const isPrime = primes.has(bits);
      if (isPrime) count++;

      steps.push({
        line: 5,
        explanation: `n=${n} (${n.toString(2)}): ${bits} set bit(s). ${bits} is ${isPrime ? 'prime' : 'not prime'}. ${isPrime ? 'count++' : ''} count=${count}.`,
        variables: { n, bits, isPrime, count },
        visualization: makeViz(
          rangeNums,
          Object.fromEntries(rangeNums.map((_, j) => [j, j < idx ? 'visited' : j === idx ? (isPrime ? 'found' : 'mismatch') : 'default'])),
          Object.fromEntries(rangeNums.map((v, j) => [j, `${popcount(v)}b`])),
          [
            { key: `n=${n}`, value: `bits=${bits}, prime=${isPrime}` },
            { key: 'count', value: String(count) },
          ]
        ),
      });
    }

    steps.push({
      line: 7,
      explanation: `${count} number(s) in [${left}, ${right}] have a prime number of set bits.`,
      variables: { result: count },
      visualization: makeViz(
        rangeNums,
        Object.fromEntries(rangeNums.map((v, i) => [i, primes.has(popcount(v)) ? 'found' : 'visited'])),
        Object.fromEntries(rangeNums.map((v, i) => [i, `${popcount(v)}b`])),
        [{ key: 'result', value: String(count) }]
      ),
    });

    return steps;
  },
};

export default primeNumberOfSetBits;
