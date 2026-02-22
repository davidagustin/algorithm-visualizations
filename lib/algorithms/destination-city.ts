import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const destinationCity: AlgorithmDefinition = {
  id: 'destination-city',
  title: 'Destination City',
  leetcodeNumber: 1436,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a list of paths where paths[i] = [cityAi, cityBi], find the destination city: the city with no outgoing path. Store all source cities in a hash set, then iterate over destination cities and return the one not in the source set.',
  tags: ['hash map', 'hash set', 'string', 'graph'],

  code: {
    pseudocode: `function destCity(paths):
  sources = set()
  for path in paths:
    sources.add(path[0])
  for path in paths:
    if path[1] not in sources:
      return path[1]
  return ""`,

    python: `def destCity(paths: list[list[str]]) -> str:
    sources = {p[0] for p in paths}
    for _, dest in paths:
        if dest not in sources:
            return dest
    return ""`,

    javascript: `function destCity(paths) {
  const sources = new Set(paths.map(p => p[0]));
  for (const [, dest] of paths) {
    if (!sources.has(dest)) return dest;
  }
  return "";
}`,

    java: `public String destCity(List<List<String>> paths) {
    Set<String> sources = new HashSet<>();
    for (List<String> p : paths) sources.add(p.get(0));
    for (List<String> p : paths)
        if (!sources.contains(p.get(1))) return p.get(1);
    return "";
}`,
  },

  defaultInput: {
    paths: [['London', 'New York'], ['New York', 'Lima'], ['Lima', 'Sao Paulo']],
  },

  inputFields: [
    {
      name: 'paths',
      label: 'Paths',
      type: 'array',
      defaultValue: [['London', 'New York'], ['New York', 'Lima'], ['Lima', 'Sao Paulo']],
      placeholder: 'London,New York|New York,Lima',
      helperText: 'List of [source, destination] city pairs',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const paths = input.paths as string[][];
    const steps: AlgorithmStep[] = [];
    const sources = new Set<string>();

    steps.push({
      line: 1,
      explanation: `We have ${paths.length} paths. First, collect all source cities into a set.`,
      variables: { sources: '{}', paths: paths.map(p => `${p[0]}->${p[1]}`).join(', ') },
      visualization: {
        type: 'array',
        array: paths.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(paths.map((p, i) => [i, `${p[0]}->${p[1]}`])),
      },
    });

    for (let i = 0; i < paths.length; i++) {
      sources.add(paths[i][0]);
      steps.push({
        line: 3,
        explanation: `Add source city "${paths[i][0]}" to sources set. Sources = {${Array.from(sources).join(', ')}}.`,
        variables: { i, source: paths[i][0], sources: Array.from(sources).join(',') },
        visualization: {
          type: 'array',
          array: paths.map((_, idx) => idx),
          highlights: { [i]: 'active' },
          labels: { [i]: `src: ${paths[i][0]}` },
        },
      });
    }

    steps.push({
      line: 4,
      explanation: `Source cities: {${Array.from(sources).join(', ')}}. Now find a destination city not in this set.`,
      variables: { sources: Array.from(sources).join(',') },
      visualization: {
        type: 'array',
        array: paths.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(paths.map((p, i) => [i, `dest: ${p[1]}`])),
      },
    });

    for (let i = 0; i < paths.length; i++) {
      const dest = paths[i][1];
      const isDestination = !sources.has(dest);

      steps.push({
        line: 6,
        explanation: `Check destination "${dest}": ${isDestination ? 'NOT in sources set -> this is the destination city!' : 'in sources set, skip.'}`,
        variables: { i, dest, inSources: sources.has(dest), result: isDestination ? dest : undefined },
        visualization: {
          type: 'array',
          array: paths.map((_, idx) => idx),
          highlights: { [i]: isDestination ? 'found' : 'comparing' },
          labels: { [i]: isDestination ? `DEST: ${dest}` : `skip: ${dest}` },
        },
      });

      if (isDestination) {
        return steps;
      }
    }

    steps.push({
      line: 7,
      explanation: 'No destination city found (unexpected for valid input).',
      variables: { result: '' },
      visualization: { type: 'array', array: paths.map((_, i) => i), highlights: {}, labels: {} },
    });

    return steps;
  },
};

export default destinationCity;
