import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const boatsToSavePeople: AlgorithmDefinition = {
  id: 'boats-to-save-people',
  title: 'Boats to Save People',
  leetcodeNumber: 881,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given people weights and a boat weight limit (each boat carries at most 2 people), find the minimum number of boats needed. Sort people by weight, then use two pointers: pair lightest with heaviest when possible.',
  tags: ['two pointers', 'array', 'greedy', 'sorting'],

  code: {
    pseudocode: `function numRescueBoats(people, limit):
  sort(people)
  boats = 0
  left = 0, right = length(people) - 1
  while left <= right:
    if people[left] + people[right] <= limit:
      left++
    right--
    boats++
  return boats`,

    python: `def numRescueBoats(people: list[int], limit: int) -> int:
    people.sort()
    boats = 0
    left, right = 0, len(people) - 1
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    return boats`,

    javascript: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let boats = 0;
  let left = 0, right = people.length - 1;
  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++;
    }
    right--;
    boats++;
  }
  return boats;
}`,

    java: `public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int boats = 0, left = 0, right = people.length - 1;
    while (left <= right) {
        if (people[left] + people[right] <= limit) left++;
        right--;
        boats++;
    }
    return boats;
}`,
  },

  defaultInput: {
    people: [3, 2, 2, 1],
    limit: 3,
  },

  inputFields: [
    {
      name: 'people',
      label: 'People Weights',
      type: 'array',
      defaultValue: [3, 2, 2, 1],
      placeholder: '3,2,2,1',
      helperText: 'Comma-separated weights of people',
    },
    {
      name: 'limit',
      label: 'Boat Weight Limit',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum weight each boat can carry',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const original = input.people as number[];
    const limit = input.limit as number;
    const people = [...original].sort((a, b) => a - b);
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...people],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Minimum boats to carry [${original.join(', ')}] with limit = ${limit}. Each boat carries at most 2 people.`,
      variables: { people: [...original], limit },
      visualization: { type: 'array', array: [...original], highlights: {}, labels: {} },
    });

    steps.push({
      line: 2,
      explanation: `Sort by weight: [${people.join(', ')}]. Greedy: try to pair lightest with heaviest.`,
      variables: { people: [...people] },
      visualization: makeViz(Object.fromEntries(people.map((_, i) => [i, 'sorted'])), {}),
    });

    let boats = 0;
    let left = 0;
    let right = people.length - 1;

    steps.push({
      line: 4,
      explanation: `Initialize: left = 0 (lightest = ${people[0]}), right = ${right} (heaviest = ${people[right]}), boats = 0.`,
      variables: { left, right, boats, limit },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'pointer' },
        { [left]: 'light', [right]: 'heavy' }
      ),
    });

    while (left <= right) {
      const combined = people[left] + people[right];

      steps.push({
        line: 5,
        explanation: `Check: people[${left}] = ${people[left]} + people[${right}] = ${people[right]} = ${combined}. Limit = ${limit}.`,
        variables: { left, right, combined, limit, boats },
        visualization: makeViz(
          { [left]: 'comparing', [right]: 'comparing' },
          { [left]: 'L', [right]: 'R' }
        ),
      });

      if (combined <= limit) {
        steps.push({
          line: 6,
          explanation: `${combined} <= ${limit}. Both fit in one boat! Advance left to ${left + 1}.`,
          variables: { left, right, combined, limit, boats },
          visualization: makeViz(
            { [left]: 'found', [right]: 'found' },
            { [left]: 'pair', [right]: 'pair' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 7,
          explanation: `${combined} > ${limit}. Heaviest person (${people[right]}) goes alone. Decrement right.`,
          variables: { left, right, combined, limit, boats },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'active' },
            { [left]: 'L', [right]: 'alone' }
          ),
        });
      }

      right--;
      boats++;

      steps.push({
        line: 8,
        explanation: `Boat #${boats} dispatched. right = ${right}, left = ${left}, boats so far = ${boats}.`,
        variables: { left, right, boats },
        visualization: makeViz(
          { ...(left <= right ? { [left]: 'pointer', [right]: 'pointer' } : {}) },
          { ...(left <= right ? { [left]: 'L', [right]: 'R' } : {}) }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Done! Minimum boats needed = ${boats}.`,
      variables: { boats },
      visualization: makeViz(Object.fromEntries(people.map((_, i) => [i, 'visited'])), {}),
    });

    return steps;
  },
};

export default boatsToSavePeople;
