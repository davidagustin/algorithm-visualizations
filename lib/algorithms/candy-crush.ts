import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const candyCrush: AlgorithmDefinition = {
  id: 'candy-crush',
  title: 'Candy Crush Simulation',
  leetcodeNumber: 723,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Simulate a simplified 1D candy crush: given an array of candy types, repeatedly remove groups of 3 or more consecutive identical candies, then compact remaining candies leftward. Repeat until no more removals are possible.',
  tags: ['greedy', 'array', 'simulation', 'two pointers'],

  code: {
    pseudocode: `function candyCrush(candies):
  repeat:
    changed = false
    i = 0
    while i < length(candies):
      j = i
      while j < length and candies[j] == candies[i]: j++
      if j - i >= 3:
        remove candies[i..j-1]
        changed = true
      else:
        i = j
  until not changed
  return candies`,

    python: `def candyCrush(candies: list[int]) -> list[int]:
    changed = True
    while changed:
        changed = False
        i = 0
        to_remove = []
        while i < len(candies):
            j = i
            while j < len(candies) and candies[j] == candies[i]:
                j += 1
            if j - i >= 3:
                to_remove.extend(range(i, j))
                changed = True
            i = j
        candies = [c for idx, c in enumerate(candies) if idx not in set(to_remove)]
    return candies`,

    javascript: `function candyCrush(candies) {
  let changed = true;
  while (changed) {
    changed = false;
    let i = 0;
    const toRemove = new Set();
    while (i < candies.length) {
      let j = i;
      while (j < candies.length && candies[j] === candies[i]) j++;
      if (j - i >= 3) { for (let k = i; k < j; k++) toRemove.add(k); changed = true; }
      i = j;
    }
    candies = candies.filter((_, idx) => !toRemove.has(idx));
  }
  return candies;
}`,

    java: `public int[] candyCrush(int[] candies) {
    boolean changed = true;
    while (changed) {
        changed = false;
        List<Integer> result = new ArrayList<>();
        int i = 0;
        while (i < candies.length) {
            int j = i;
            while (j < candies.length && candies[j] == candies[i]) j++;
            if (j - i < 3) for (int k = i; k < j; k++) result.add(candies[k]);
            else changed = true;
            i = j;
        }
        candies = result.stream().mapToInt(x -> x).toArray();
    }
    return candies;
}`,
  },

  defaultInput: {
    candies: [1, 3, 3, 3, 2, 2, 1, 1, 1, 2],
  },

  inputFields: [
    {
      name: 'candies',
      label: 'Candy Types',
      type: 'array',
      defaultValue: [1, 3, 3, 3, 2, 2, 1, 1, 1, 2],
      placeholder: '1,3,3,3,2,2,1,1,1,2',
      helperText: 'Array of candy types (integers)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let candies = [...(input.candies as number[])];
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start with candies: [${candies.join(', ')}]. Repeatedly find and remove groups of 3+ identical consecutive candies.`,
      variables: { candies: candies.join(','), length: candies.length },
      visualization: makeViz([...candies], Object.fromEntries(candies.map((_, i) => [i, 'active'])), {}),
    });

    let pass = 0;
    let changed = true;

    while (changed) {
      changed = false;
      pass++;
      let i = 0;
      const toRemove = new Set<number>();

      while (i < candies.length) {
        let j = i;
        while (j < candies.length && candies[j] === candies[i]) j++;

        if (j - i >= 3) {
          for (let k = i; k < j; k++) toRemove.add(k);
          changed = true;

          steps.push({
            line: 7,
            explanation: `Pass ${pass}: Found ${j - i} consecutive candies of type ${candies[i]} at indices ${i}-${j - 1}. Mark for removal.`,
            variables: { pass, type: candies[i], count: j - i, from: i, to: j - 1 },
            visualization: makeViz(
              [...candies],
              {
                ...Object.fromEntries(Array.from({ length: j - i }, (_, k) => [i + k, 'mismatch'])),
              },
              { [i]: 'remove' }
            ),
          });
        }
        i = j;
      }

      if (changed) {
        const before = [...candies];
        candies = candies.filter((_, idx) => !toRemove.has(idx));

        steps.push({
          line: 8,
          explanation: `Pass ${pass}: Removed ${toRemove.size} candies. Remaining: [${candies.join(', ')}]`,
          variables: { pass, removed: toRemove.size, remaining: candies.length },
          visualization: makeViz(
            [...candies],
            Object.fromEntries(candies.map((_, i) => [i, 'sorted'])),
            {}
          ),
        });
      }
    }

    steps.push({
      line: 10,
      explanation: `No more groups of 3+ found after ${pass} passes. Final array: [${candies.join(', ')}]`,
      variables: { passes: pass, result: candies.join(','), length: candies.length },
      visualization: makeViz(
        candies.length > 0 ? [...candies] : [0],
        Object.fromEntries((candies.length > 0 ? candies : [0]).map((_, i) => [i, 'found'])),
        {}
      ),
    });

    return steps;
  },
};

export default candyCrush;
