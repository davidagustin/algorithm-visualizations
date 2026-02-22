import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const successfulPairsOfSpellsAndPotions: AlgorithmDefinition = {
  id: 'successful-pairs-of-spells-and-potions',
  title: 'Successful Pairs of Spells and Potions',
  leetcodeNumber: 2300,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given spells and potions arrays and a success threshold, for each spell find how many potions create a successful pair where spell * potion >= success. Sort potions, then binary search to find the first potion that succeeds for each spell.',
  tags: ['binary search', 'sorting', 'two pointers'],

  code: {
    pseudocode: `function successfulPairs(spells, potions, success):
  sort(potions)
  result = []
  for spell in spells:
    needed = ceil(success / spell)
    lo, hi = 0, len(potions)
    while lo < hi:
      mid = (lo + hi) / 2
      if potions[mid] < needed:
        lo = mid + 1
      else:
        hi = mid
    result.append(len(potions) - lo)
  return result`,

    python: `import math
def successfulPairs(spells: list[int], potions: list[int], success: int) -> list[int]:
    potions.sort()
    result = []
    for spell in spells:
        needed = math.ceil(success / spell)
        lo, hi = 0, len(potions)
        while lo < hi:
            mid = (lo + hi) // 2
            if potions[mid] < needed:
                lo = mid + 1
            else:
                hi = mid
        result.append(len(potions) - lo)
    return result`,

    javascript: `function successfulPairs(spells, potions, success) {
  potions.sort((a, b) => a - b);
  return spells.map(spell => {
    const needed = Math.ceil(success / spell);
    let lo = 0, hi = potions.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (potions[mid] < needed) lo = mid + 1;
      else hi = mid;
    }
    return potions.length - lo;
  });
}`,

    java: `public int[] successfulPairs(int[] spells, int[] potions, long success) {
    Arrays.sort(potions);
    int[] res = new int[spells.length];
    for (int i = 0; i < spells.length; i++) {
        long needed = (success + spells[i] - 1) / spells[i];
        int lo = 0, hi = potions.length;
        while (lo < hi) {
            int mid = (lo + hi) / 2;
            if (potions[mid] < needed) lo = mid + 1;
            else hi = mid;
        }
        res[i] = potions.length - lo;
    }
    return res;
}`,
  },

  defaultInput: {
    spells: [5, 1, 3],
    potions: [1, 2, 3, 4, 5],
    success: 7,
  },

  inputFields: [
    {
      name: 'spells',
      label: 'Spells',
      type: 'array',
      defaultValue: [5, 1, 3],
      placeholder: '5,1,3',
      helperText: 'Spell strengths',
    },
    {
      name: 'potions',
      label: 'Potions',
      type: 'array',
      defaultValue: [1, 2, 3, 4, 5],
      placeholder: '1,2,3,4,5',
      helperText: 'Potion strengths',
    },
    {
      name: 'success',
      label: 'Success Threshold',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Minimum product of spell and potion to succeed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const spells = input.spells as number[];
    const potions = input.potions as number[];
    const success = input.success as number;
    const steps: AlgorithmStep[] = [];

    const sortedPotions = [...potions].sort((a, b) => a - b);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: sortedPotions,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort potions: [${sortedPotions.join(', ')}]. Spells: [${spells.join(', ')}]. Success threshold: ${success}.`,
      variables: { sortedPotions: `[${sortedPotions.join(', ')}]`, spells: `[${spells.join(', ')}]`, success },
      visualization: makeViz(
        sortedPotions.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        sortedPotions.reduce((acc, p, i) => ({ ...acc, [i]: `${p}` }), {})
      ),
    });

    const result: number[] = [];

    for (let s = 0; s < spells.length; s++) {
      const spell = spells[s];
      const needed = Math.ceil(success / spell);

      steps.push({
        line: 3,
        explanation: `Spell[${s}]=${spell}. Need potion >= ceil(${success}/${spell}) = ${needed}.`,
        variables: { spell, needed, success },
        visualization: makeViz(
          sortedPotions.reduce((acc, p, i) => ({ ...acc, [i]: p >= needed ? 'active' : 'mismatch' }), {}),
          sortedPotions.reduce((acc, p, i) => ({ ...acc, [i]: `${p}${p >= needed ? '>=' : '<'}${needed}` }), {})
        ),
      });

      let lo = 0;
      let hi = sortedPotions.length;

      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);

        steps.push({
          line: 6,
          explanation: `mid=${mid}, potions[${mid}]=${sortedPotions[mid]}. ${sortedPotions[mid] < needed ? `< ${needed}, lo=${mid + 1}` : `>= ${needed}, hi=${mid}`}.`,
          variables: { lo, hi, mid, 'potions[mid]': sortedPotions[mid], needed },
          visualization: makeViz(
            { [lo]: 'active', [Math.min(hi, sortedPotions.length) - 1]: 'active', [mid]: 'comparing' },
            { [lo]: 'lo', [Math.min(hi, sortedPotions.length) - 1]: 'hi', [mid]: `${sortedPotions[mid]}` }
          ),
        });

        if (sortedPotions[mid] < needed) lo = mid + 1;
        else hi = mid;
      }

      const count = sortedPotions.length - lo;
      result.push(count);

      steps.push({
        line: 10,
        explanation: `Spell[${s}]=${spell}: first valid potion at index ${lo}. Successful pairs = ${sortedPotions.length} - ${lo} = ${count}.`,
        variables: { spell, firstValidIdx: lo, count },
        visualization: makeViz(
          sortedPotions.reduce((acc, _, i) => ({ ...acc, [i]: i >= lo ? 'found' : 'mismatch' }), {}),
          { [lo]: `cnt=${count}` }
        ),
      });
    }

    steps.push({
      line: 11,
      explanation: `Final result: [${result.join(', ')}].`,
      variables: { result: `[${result.join(', ')}]` },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default successfulPairsOfSpellsAndPotions;
