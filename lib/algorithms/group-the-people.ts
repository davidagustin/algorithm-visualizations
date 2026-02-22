import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const groupThePeople: AlgorithmDefinition = {
  id: 'group-the-people',
  title: 'Group the People Given the Group Size They Belong To',
  leetcodeNumber: 1282,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given an integer array groupSizes where groupSizes[i] is the required group size for person i, assign every person to exactly one group. Use a hash map from group size to list of pending people; whenever a list reaches the required size, flush it as a complete group.',
  tags: ['hash map', 'array', 'greedy'],

  code: {
    pseudocode: `function groupThePeople(groupSizes):
  pending = {}
  result = []
  for i, size in enumerate(groupSizes):
    pending[size].append(i)
    if len(pending[size]) == size:
      result.append(pending[size][:])
      pending[size] = []
  return result`,
    python: `def groupThePeople(groupSizes):
    from collections import defaultdict
    pending = defaultdict(list)
    result = []
    for i, size in enumerate(groupSizes):
        pending[size].append(i)
        if len(pending[size]) == size:
            result.append(list(pending[size]))
            pending[size] = []
    return result`,
    javascript: `function groupThePeople(groupSizes) {
  const pending = new Map();
  const result = [];
  for (let i = 0; i < groupSizes.length; i++) {
    const s = groupSizes[i];
    if (!pending.has(s)) pending.set(s, []);
    pending.get(s).push(i);
    if (pending.get(s).length === s) {
      result.push([...pending.get(s)]);
      pending.set(s, []);
    }
  }
  return result;
}`,
    java: `public List<List<Integer>> groupThePeople(int[] groupSizes) {
    Map<Integer,List<Integer>> pending = new HashMap<>();
    List<List<Integer>> result = new ArrayList<>();
    for (int i = 0; i < groupSizes.length; i++) {
        int s = groupSizes[i];
        pending.computeIfAbsent(s, k -> new ArrayList<>()).add(i);
        if (pending.get(s).size() == s) {
            result.add(new ArrayList<>(pending.get(s)));
            pending.put(s, new ArrayList<>());
        }
    }
    return result;
}`,
  },

  defaultInput: {
    groupSizes: [3, 3, 3, 3, 3, 1, 3],
  },

  inputFields: [
    {
      name: 'groupSizes',
      label: 'Group Sizes',
      type: 'array',
      defaultValue: [3, 3, 3, 3, 3, 1, 3],
      placeholder: '3,3,3,3,3,1,3',
      helperText: 'Required group size for each person index',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const groupSizes = input.groupSizes as number[];
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...groupSizes],
      highlights,
      labels,
    });

    const pending = new Map<number, number[]>();
    const result: number[][] = [];

    steps.push({
      line: 1,
      explanation: 'Initialize pending map. Each person joins a bucket matching their required group size.',
      variables: { pending: '{}', result: '[]' },
      visualization: makeViz({}, {}),
    });

    for (let i = 0; i < groupSizes.length; i++) {
      const size = groupSizes[i];
      if (!pending.has(size)) pending.set(size, []);
      pending.get(size)!.push(i);
      const bucket = pending.get(size)!;

      steps.push({
        line: 4,
        explanation: `Person ${i} needs group of size ${size}. Pending[${size}] = [${bucket.join(', ')}] (${bucket.length}/${size})`,
        variables: { person: i, requiredSize: size, bucketNow: `[${bucket.join(', ')}]` },
        visualization: makeViz({ [i]: 'active' }, { [i]: `s=${size}` }),
      });

      if (bucket.length === size) {
        result.push([...bucket]);
        pending.set(size, []);

        steps.push({
          line: 6,
          explanation: `Group of size ${size} is complete: [${result[result.length - 1].join(', ')}]. Added to result. Reset pending[${size}].`,
          variables: { completedGroup: `[${result[result.length - 1].join(', ')}]`, totalGroups: result.length },
          visualization: makeViz(
            Object.fromEntries(result[result.length - 1].map((p) => [p, 'found'])),
            Object.fromEntries(result[result.length - 1].map((p) => [p, 'grp']))
          ),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `All groups formed. Result: ${result.map((g) => '[' + g.join(',') + ']').join(', ')}`,
      variables: { result: JSON.stringify(result), totalGroups: result.length },
      visualization: makeViz(
        Object.fromEntries(groupSizes.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(groupSizes.map((_, i) => [i, `s${groupSizes[i]}`]))
      ),
    });

    return steps;
  },
};

export default groupThePeople;
