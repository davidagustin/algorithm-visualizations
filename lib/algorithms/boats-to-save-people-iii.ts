import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const boatsToPeopleIii: AlgorithmDefinition = {
  id: 'boats-to-save-people-iii',
  title: 'Boats to Save People (Weight Limit Variant)',
  leetcodeNumber: 881,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Each boat carries at most 2 people with a combined weight limit. Find the minimum number of boats needed to carry all people. Sort weights, then use two pointers: pair the lightest and heaviest if their combined weight fits the limit, otherwise send the heaviest alone.',
  tags: ['two pointers', 'array', 'sorting', 'greedy'],

  code: {
    pseudocode: `function numRescueBoats(people, limit):
  sort(people)
  left = 0, right = n-1
  boats = 0
  while left <= right:
    if people[left] + people[right] <= limit:
      left++
    right--
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
      helperText: 'Comma-separated weights of people',
    },
    {
      name: 'limit',
      label: 'Weight Limit',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum combined weight per boat',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawPeople = input.people as number[];
    const limit = input.limit as number;
    const steps: AlgorithmStep[] = [];

    const people = [...rawPeople].sort((a, b) => a - b);
    const n = people.length;

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...people],
      highlights,
      labels,
    });

    let left = 0;
    let right = n - 1;
    let boats = 0;

    steps.push({
      line: 1,
      explanation: `Sort: [${people.join(', ')}]. Pair lightest with heaviest. If combined <= ${limit}, both board; otherwise heaviest boards alone.`,
      variables: { people: [...people], limit },
      visualization: makeViz({}, {}),
    });

    steps.push({
      line: 2,
      explanation: `Initialize left=${left}, right=${right}, boats=0.`,
      variables: { left, right, boats },
      visualization: makeViz({ [left]: 'pointer', [right]: 'pointer' }, { [left]: 'L', [right]: 'R' }),
    });

    while (left <= right) {
      const combined = people[left] + people[right];
      const pair = combined <= limit;

      if (pair) {
        steps.push({
          line: 5,
          explanation: `people[${left}]=${people[left]} + people[${right}]=${people[right]}=${combined} <= ${limit}. They share boat #${boats + 1}. Move left.`,
          variables: { left, right, combined, limit, boats: boats + 1 },
          visualization: makeViz({ [left]: 'found', [right]: 'found' }, { [left]: 'L+R', [right]: 'R' }),
        });
        left++;
      } else {
        steps.push({
          line: 7,
          explanation: `people[${left}]=${people[left]} + people[${right}]=${people[right]}=${combined} > ${limit}. Heaviest goes alone on boat #${boats + 1}.`,
          variables: { left, right, combined, limit, boats: boats + 1 },
          visualization: makeViz({ [right]: 'active', [left]: 'pointer' }, { [left]: 'wait', [right]: 'alone' }),
        });
      }

      right--;
      boats++;

      steps.push({
        line: 8,
        explanation: `Boat #${boats} dispatched. left=${left}, right=${right}.`,
        variables: { left, right, boats },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: Math.max(0, left - (pair ? 1 : 0)), }, (_, t) => [t, 'sorted'])),
            ...(left <= right ? { [left]: 'pointer', [right]: 'pointer' } : {}),
          },
          { [left]: 'L', [right]: 'R' }
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `All people evacuated. Minimum boats needed: ${boats}.`,
      variables: { boats },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default boatsToPeopleIii;
