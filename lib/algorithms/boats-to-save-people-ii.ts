import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const boatsToSavePeopleIi: AlgorithmDefinition = {
  id: 'boats-to-save-people-ii',
  title: 'Boats to Save People (Detailed)',
  leetcodeNumber: 881,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Each boat carries at most 2 people with weight limit. Greedy: sort people by weight. Use two pointers. Try to pair the heaviest person with the lightest; if they exceed the limit, the heaviest goes alone. Count total boats used, tracking each pairing decision.',
  tags: ['greedy', 'two pointers', 'sorting', 'array'],

  code: {
    pseudocode: `function numRescueBoats(people, limit):
  sort people
  left = 0, right = n - 1, boats = 0
  while left <= right:
    if people[left] + people[right] <= limit:
      left++  // both fit, pair them
    right--   // heaviest always takes a boat
    boats++
  return boats`,

    python: `def numRescueBoats(people: list[int], limit: int) -> int:
    people.sort()
    left, right = 0, len(people) - 1
    boats = 0
    while left <= right:
        if people[left] + people[right] <= limit:
            left += 1
        right -= 1
        boats += 1
    return boats`,

    javascript: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0, right = people.length - 1, boats = 0;
  while (left <= right) {
    if (people[left] + people[right] <= limit) left++;
    right--;
    boats++;
  }
  return boats;
}`,

    java: `public int numRescueBoats(int[] people, int limit) {
    Arrays.sort(people);
    int left = 0, right = people.length - 1, boats = 0;
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
      helperText: 'Weight of each person',
    },
    {
      name: 'limit',
      label: 'Boat Weight Limit',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum weight per boat',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const peopleRaw = input.people as number[];
    const limit = input.limit as number;
    const steps: AlgorithmStep[] = [];

    const people = [...peopleRaw].sort((a, b) => a - b);
    let left = 0;
    let right = people.length - 1;
    let boats = 0;

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...people],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Sort people: [${people.join(', ')}]. Limit=${limit}. Use two pointers to pair lightest with heaviest.`,
      variables: { people: people.join(','), limit, left, right },
      visualization: makeViz(
        { [left]: 'pointer', [right]: 'active' },
        { [left]: 'L', [right]: 'R' }
      ),
    });

    while (left <= right) {
      const combined = people[left] + people[right];

      if (left === right) {
        boats++;
        steps.push({
          line: 4,
          explanation: `left=right=${left}: last person (weight=${people[left]}) takes a boat alone. boats=${boats}.`,
          variables: { left, right, weight: people[left], boats },
          visualization: makeViz({ [left]: 'found' }, { [left]: 'alone' }),
        });
        break;
      }

      if (combined <= limit) {
        steps.push({
          line: 4,
          explanation: `people[${left}]=${people[left]} + people[${right}]=${people[right]} = ${combined} <= ${limit}. They share a boat. boats=${boats + 1}.`,
          variables: { left, right, combined, limit, boats: boats + 1 },
          visualization: makeViz(
            { [left]: 'found', [right]: 'found' },
            { [left]: 'paired L', [right]: 'paired R' }
          ),
        });
        left++;
      } else {
        steps.push({
          line: 6,
          explanation: `people[${left}]=${people[left]} + people[${right}]=${people[right]} = ${combined} > ${limit}. Too heavy to pair. Heaviest goes alone. boats=${boats + 1}.`,
          variables: { left, right, combined, limit, boats: boats + 1 },
          visualization: makeViz(
            { [left]: 'pointer', [right]: 'active' },
            { [left]: 'wait', [right]: 'alone' }
          ),
        });
      }
      right--;
      boats++;
    }

    steps.push({
      line: 7,
      explanation: `All people rescued. Total boats needed = ${boats}.`,
      variables: { result: boats },
      visualization: makeViz(
        Object.fromEntries(people.map((_, i) => [i, 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default boatsToSavePeopleIi;
