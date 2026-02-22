import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const jewelsAndStones: AlgorithmDefinition = {
  id: 'jewels-and-stones',
  title: 'Jewels and Stones',
  leetcodeNumber: 771,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a string jewels representing types of jewels and a string stones representing the stones you have, count how many of your stones are also jewels. Each character in jewels is unique. Use a hash set for O(1) lookup.',
  tags: ['hash map', 'hash set', 'string', 'counting'],

  code: {
    pseudocode: `function numJewelsInStones(jewels, stones):
  jewelSet = set(jewels)
  count = 0
  for stone in stones:
    if stone in jewelSet:
      count++
  return count`,

    python: `def numJewelsInStones(jewels: str, stones: str) -> int:
    jewel_set = set(jewels)
    return sum(s in jewel_set for s in stones)`,

    javascript: `function numJewelsInStones(jewels, stones) {
  const jewelSet = new Set(jewels);
  let count = 0;
  for (const stone of stones) {
    if (jewelSet.has(stone)) count++;
  }
  return count;
}`,

    java: `public int numJewelsInStones(String jewels, String stones) {
    Set<Character> jewelSet = new HashSet<>();
    for (char c : jewels.toCharArray()) jewelSet.add(c);
    int count = 0;
    for (char c : stones.toCharArray()) {
        if (jewelSet.contains(c)) count++;
    }
    return count;
}`,
  },

  defaultInput: {
    jewels: 'aA',
    stones: 'aAAbbbb',
  },

  inputFields: [
    {
      name: 'jewels',
      label: 'Jewels',
      type: 'string',
      defaultValue: 'aA',
      placeholder: 'aA',
      helperText: 'Characters representing jewel types',
    },
    {
      name: 'stones',
      label: 'Stones',
      type: 'string',
      defaultValue: 'aAAbbbb',
      placeholder: 'aAAbbbb',
      helperText: 'Characters representing your stones',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const jewels = input.jewels as string;
    const stones = input.stones as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Jewels: "${jewels}", Stones: "${stones}". Build a set of jewel types for O(1) lookup.`,
      variables: { jewels, stones },
      visualization: {
        type: 'array',
        array: jewels.split('').map((_, i) => i),
        highlights: Object.fromEntries(jewels.split('').map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(jewels.split('').map((c, i) => [i, c])),
      },
    });

    const jewelSet = new Set(jewels);
    steps.push({
      line: 2,
      explanation: `Jewel set created: {${[...jewelSet].map(c => `"${c}"`).join(', ')}}. Now iterate through stones.`,
      variables: { jewelSet: [...jewelSet].join(', '), count: 0 },
      visualization: {
        type: 'array',
        array: stones.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(stones.split('').map((c, i) => [i, c])),
      },
    });

    let count = 0;

    for (let i = 0; i < stones.length; i++) {
      const stone = stones[i];
      const isJewel = jewelSet.has(stone);

      if (isJewel) count++;

      steps.push({
        line: 4,
        explanation: `Stone[${i}]="${stone}": ${isJewel ? `IS a jewel! Count = ${count}` : 'NOT a jewel. Skip.'}`,
        variables: { stoneIndex: i, stone, isJewel, count },
        visualization: {
          type: 'array',
          array: stones.split('').map((_, idx) => idx),
          highlights: {
            [i]: isJewel ? 'found' : 'mismatch',
            ...Object.fromEntries(
              Array.from({ length: i }, (_, j) => [j, stones[j] && jewelSet.has(stones[j]) ? 'sorted' : 'visited'])
            ),
          },
          labels: Object.fromEntries(stones.split('').map((c, idx) => [idx, c])),
        },
      });
    }

    steps.push({
      line: 6,
      explanation: `Finished checking all stones. Total jewels found: ${count}`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: stones.split('').map((_, i) => i),
        highlights: Object.fromEntries(
          stones.split('').map((c, i) => [i, jewelSet.has(c) ? 'found' : 'mismatch'])
        ),
        labels: Object.fromEntries(stones.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default jewelsAndStones;
