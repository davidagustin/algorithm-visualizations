import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const queueReconstructionByHeight: AlgorithmDefinition = {
  id: 'queue-reconstruction-by-height',
  title: 'Queue Reconstruction by Height',
  leetcodeNumber: 406,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Each person is described by [height, k] where k is the number of people in front with height >= theirs. Sort by height descending (ties broken by k ascending), then insert each person at position k. Taller people are placed first so insertions remain valid.',
  tags: ['greedy', 'array', 'sorting'],

  code: {
    pseudocode: `function reconstructQueue(people):
  sort people by height desc, k asc
  result = []
  for each person in people:
    insert person at index person[1] in result
  return result`,

    python: `def reconstructQueue(people: list[list[int]]) -> list[list[int]]:
    people.sort(key=lambda x: (-x[0], x[1]))
    result = []
    for person in people:
        result.insert(person[1], person)
    return result`,

    javascript: `function reconstructQueue(people) {
  people.sort((a, b) => b[0] - a[0] || a[1] - b[1]);
  const result = [];
  for (const person of people) {
    result.splice(person[1], 0, person);
  }
  return result;
}`,

    java: `public int[][] reconstructQueue(int[][] people) {
    Arrays.sort(people, (a, b) -> a[0] != b[0] ? b[0] - a[0] : a[1] - b[1]);
    List<int[]> result = new ArrayList<>();
    for (int[] p : people) result.add(p[1], p);
    return result.toArray(new int[people.length][]);
}`,
  },

  defaultInput: {
    people: [7, 0, 4, 4, 7, 1, 5, 0, 6, 1, 5, 2],
  },

  inputFields: [
    {
      name: 'people',
      label: 'People (interleaved height,k pairs)',
      type: 'array',
      defaultValue: [7, 0, 4, 4, 7, 1, 5, 0, 6, 1, 5, 2],
      placeholder: '7,0,4,4,7,1',
      helperText: 'Pairs: height,k,height,k,... e.g. [7,0] means height=7 k=0',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.people as number[];
    const steps: AlgorithmStep[] = [];

    const people: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      people.push([flat[i], flat[i + 1]]);
    }

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Parsed ${people.length} people from input: ${people.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}`,
      variables: { people: people.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ') },
      visualization: makeViz(flat, Object.fromEntries(flat.map((_, i) => [i, 'active'])), {}),
    });

    const sorted = [...people].sort((a, b) => a[0] !== b[0] ? b[0] - a[0] : a[1] - b[1]);

    steps.push({
      line: 2,
      explanation: `Sort by height descending then k ascending: ${sorted.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}`,
      variables: { sorted: sorted.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ') },
      visualization: makeViz(
        sorted.map(p => p[0]),
        Object.fromEntries(sorted.map((_, i) => [i, 'sorted'])),
        Object.fromEntries(sorted.map((p, i) => [i, 'k=' + p[1]]))
      ),
    });

    const result: [number, number][] = [];

    for (let idx = 0; idx < sorted.length; idx++) {
      const person = sorted[idx];
      result.splice(person[1], 0, person);

      steps.push({
        line: 4,
        explanation: `Insert [${person[0]},${person[1]}] at position ${person[1]}. Result: ${result.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}`,
        variables: { person: '[' + person[0] + ',' + person[1] + ']', insertAt: person[1], resultLength: result.length },
        visualization: makeViz(
          result.map(p => p[0]),
          { [person[1]]: 'found', ...Object.fromEntries(result.map((_, i) => [i, i === person[1] ? 'found' : 'sorted'])) },
          Object.fromEntries(result.map((p, i) => [i, 'k=' + p[1]]))
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Reconstruction complete: ${result.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ')}`,
      variables: { result: result.map(p => '[' + p[0] + ',' + p[1] + ']').join(', ') },
      visualization: makeViz(
        result.map(p => p[0]),
        Object.fromEntries(result.map((_, i) => [i, 'found'])),
        Object.fromEntries(result.map((p, i) => [i, 'k=' + p[1]]))
      ),
    });

    return steps;
  },
};

export default queueReconstructionByHeight;
