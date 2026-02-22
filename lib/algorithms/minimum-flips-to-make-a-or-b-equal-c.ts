import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumFlipsToMakeAOrBEqualC: AlgorithmDefinition = {
  id: 'minimum-flips-to-make-a-or-b-equal-c',
  title: 'Minimum Flips to Make a OR b Equal to c',
  leetcodeNumber: 1318,
  difficulty: 'Medium',
  category: 'Bit Manipulation',
  description:
    'Given a, b, c, find minimum bit flips in a or b so that a OR b == c. For each bit: if c-bit is 0, both a-bit and b-bit must be 0 (cost = count of 1s in a and b at that position). If c-bit is 1, at least one of a-bit or b-bit must be 1 (cost = 1 if both are 0).',
  tags: ['bit manipulation', 'greedy'],

  code: {
    pseudocode: `function minFlips(a, b, c):
  flips = 0
  while a or b or c:
    ca, cb, cc = a&1, b&1, c&1
    if cc == 0:
      flips += ca + cb   // both must be 0
    elif ca == 0 and cb == 0:
      flips += 1         // need at least one 1
    a >>= 1; b >>= 1; c >>= 1
  return flips`,

    python: `def minFlips(a: int, b: int, c: int) -> int:
    flips = 0
    while a or b or c:
        ca, cb, cc = a & 1, b & 1, c & 1
        if cc == 0:
            flips += ca + cb
        elif ca == 0 and cb == 0:
            flips += 1
        a >>= 1; b >>= 1; c >>= 1
    return flips`,

    javascript: `function minFlips(a, b, c) {
  let flips = 0;
  while (a || b || c) {
    const [ca, cb, cc] = [a & 1, b & 1, c & 1];
    if (cc === 0) flips += ca + cb;
    else if (ca === 0 && cb === 0) flips += 1;
    a >>= 1; b >>= 1; c >>= 1;
  }
  return flips;
}`,

    java: `public int minFlips(int a, int b, int c) {
    int flips = 0;
    while (a != 0 || b != 0 || c != 0) {
        int ca = a & 1, cb = b & 1, cc = c & 1;
        if (cc == 0) flips += ca + cb;
        else if (ca == 0 && cb == 0) flips += 1;
        a >>= 1; b >>= 1; c >>= 1;
    }
    return flips;
}`,
  },

  defaultInput: { a: 2, b: 6, c: 5 },
  inputFields: [
    {
      name: 'a',
      label: 'a',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
    },
    {
      name: 'b',
      label: 'b',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
    },
    {
      name: 'c',
      label: 'c',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Find minimum flips in a,b so that a OR b = c',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const origA = input.a as number;
    const origB = input.b as number;
    const origC = input.c as number;
    const steps: AlgorithmStep[] = [];
    const bitLen = Math.max(origA.toString(2).length, origB.toString(2).length, origC.toString(2).length);

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
      auxData: { label: 'Min Flips', entries: extra },
    });

    steps.push({
      line: 1,
      explanation: `a=${origA} (${origA.toString(2).padStart(bitLen, '0')}), b=${origB} (${origB.toString(2).padStart(bitLen, '0')}), c=${origC} (${origC.toString(2).padStart(bitLen, '0')}). Process bit by bit from LSB.`,
      variables: { a: origA, b: origB, c: origC },
      visualization: makeViz(
        [origA, origB, origC],
        { 0: 'active', 1: 'comparing', 2: 'pointer' },
        { 0: 'a', 1: 'b', 2: 'c' },
        [
          { key: 'a', value: `${origA} (${origA.toString(2).padStart(bitLen, '0')})` },
          { key: 'b', value: `${origB} (${origB.toString(2).padStart(bitLen, '0')})` },
          { key: 'c', value: `${origC} (${origC.toString(2).padStart(bitLen, '0')})` },
        ]
      ),
    });

    let a = origA, b = origB, c = origC;
    let flips = 0;
    let bitPos = 0;

    while (a || b || c) {
      const ca = a & 1, cb = b & 1, cc = c & 1;
      let cost = 0;
      let reason = '';
      if (cc === 0) {
        cost = ca + cb;
        reason = `c-bit=0: a-bit and b-bit must both be 0. Cost = ${ca}+${cb}=${cost}`;
      } else if (ca === 0 && cb === 0) {
        cost = 1;
        reason = `c-bit=1 but a-bit=0 and b-bit=0: need one flip. Cost = 1`;
      } else {
        reason = `c-bit=1 and at least one of a/b is 1: no flip needed. Cost = 0`;
      }
      flips += cost;

      steps.push({
        line: 4,
        explanation: `Bit ${bitPos}: a-bit=${ca}, b-bit=${cb}, c-bit=${cc}. ${reason}. Total flips so far: ${flips}.`,
        variables: { bitPos, ca, cb, cc, cost, flips },
        visualization: makeViz(
          [ca, cb, cc],
          { 0: ca !== cc ? 'mismatch' : 'found', 1: cb !== cc ? 'mismatch' : 'found', 2: 'pointer' },
          { 0: `a[${bitPos}]`, 1: `b[${bitPos}]`, 2: `c[${bitPos}]` },
          [
            { key: `bit ${bitPos}`, value: `a=${ca}, b=${cb}, c=${cc}` },
            { key: 'cost', value: String(cost) },
            { key: 'total flips', value: String(flips) },
          ]
        ),
      });

      a >>= 1; b >>= 1; c >>= 1;
      bitPos++;
    }

    steps.push({
      line: 9,
      explanation: `Minimum flips to make a OR b = c is ${flips}.`,
      variables: { result: flips },
      visualization: makeViz(
        [origA, origB, origC],
        { 0: 'found', 1: 'found', 2: 'found' },
        { 0: 'a', 1: 'b', 2: 'c' },
        [{ key: 'minimum flips', value: String(flips) }]
      ),
    });

    return steps;
  },
};

export default minimumFlipsToMakeAOrBEqualC;
