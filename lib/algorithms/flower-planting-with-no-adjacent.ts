import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flowerPlantingWithNoAdjacent: AlgorithmDefinition = {
  id: 'flower-planting-with-no-adjacent',
  title: 'Flower Planting With No Adjacent',
  leetcodeNumber: 1042,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'You have n gardens and paths between them. Plant one of 4 flower types in each garden so that no two adjacent gardens have the same flower type. Since each garden has at most 3 neighbors and we have 4 types, a greedy approach always works.',
  tags: ['Graph', 'Greedy', 'Graph Coloring'],
  code: {
    pseudocode: `function gardenNoAdj(n, paths):
  build adjacency list
  result = [0] * (n+1)
  for garden in 1..n:
    usedColors = set of colors of neighbors
    for color in [1,2,3,4]:
      if color not in usedColors:
        result[garden] = color; break
  return result[1..n]`,
    python: `def gardenNoAdj(n, paths):
    adj = defaultdict(list)
    for x, y in paths:
        adj[x].append(y); adj[y].append(x)
    result = [0] * (n + 1)
    for garden in range(1, n+1):
        used = {result[nb] for nb in adj[garden]}
        for color in range(1, 5):
            if color not in used:
                result[garden] = color; break
    return result[1:]`,
    javascript: `function gardenNoAdj(n, paths) {
  const adj = Array.from({length: n+1}, () => []);
  for (const [x, y] of paths) {
    adj[x].push(y); adj[y].push(x);
  }
  const result = new Array(n+1).fill(0);
  for (let g = 1; g <= n; g++) {
    const used = new Set(adj[g].map(nb => result[nb]));
    for (let c = 1; c <= 4; c++) {
      if (!used.has(c)) { result[g] = c; break; }
    }
  }
  return result.slice(1);
}`,
    java: `public int[] gardenNoAdj(int n, int[][] paths) {
    List<Integer>[] adj = new List[n+1];
    for (int i=0;i<=n;i++) adj[i]=new ArrayList<>();
    for (int[] p:paths){adj[p[0]].add(p[1]);adj[p[1]].add(p[0]);}
    int[] result = new int[n+1];
    for (int g=1;g<=n;g++) {
        Set<Integer> used = new HashSet<>();
        for (int nb:adj[g]) used.add(result[nb]);
        for (int c=1;c<=4;c++) if(!used.contains(c)){result[g]=c;break;}
    }
    return Arrays.copyOfRange(result,1,n+1);
}`,
  },
  defaultInput: {
    n: 4,
    paths: [[1,2],[3,4],[1,3],[2,4]],
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Gardens',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
    },
    {
      name: 'paths',
      label: 'Paths [x, y]',
      type: 'array',
      defaultValue: [[1,2],[3,4],[1,3],[2,4]],
      placeholder: '[[1,2],[3,4]]',
      helperText: 'Each garden has at most 3 neighbors',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const paths = input.paths as number[][];
    const steps: AlgorithmStep[] = [];

    const adj: number[][] = Array.from({ length: n + 1 }, () => []);
    for (const [x, y] of paths) {
      adj[x].push(y);
      adj[y].push(x);
    }

    const result = new Array(n + 1).fill(0);
    const flowerNames = ['', 'Rose', 'Tulip', 'Orchid', 'Lily'];
    const colorMap = ['', 'found', 'active', 'pointer', 'comparing'];

    function makeViz(highlights: Record<number, string>, extra: string): ArrayVisualization {
      return {
        type: 'array',
        array: result.slice(1),
        highlights,
        labels: Object.fromEntries(result.slice(1).map((c, i) => [i, `G${i+1}:${c === 0 ? 'none' : flowerNames[c]}`])),
        auxData: {
          label: 'Flower Planting (Greedy)',
          entries: [
            { key: 'Flowers (4 types)', value: 'Rose, Tulip, Orchid, Lily' },
            { key: 'Assigned', value: result.slice(1).filter(c => c > 0).length + `/${n}` },
            { key: 'Status', value: extra },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Greedy 4-coloring: ${n} gardens, each with at most 3 neighbors. With 4 colors, there's always a valid choice.`,
      variables: { n, paths: paths.length },
      visualization: makeViz(Object.fromEntries(Array.from({ length: n }, (_, i) => [i, 'default'])), 'Not planted'),
    });

    for (let g = 1; g <= n; g++) {
      const used = new Set(adj[g].map(nb => result[nb]));
      let chosen = 0;
      for (let c = 1; c <= 4; c++) {
        if (!used.has(c)) { chosen = c; break; }
      }
      result[g] = chosen;

      const h: Record<number, string> = {};
      for (let i = 0; i < n; i++) h[i] = result[i+1] === 0 ? 'default' : colorMap[result[i+1]];

      steps.push({
        line: 5,
        explanation: `Garden ${g}: neighbors use flowers {${[...used].filter(c => c > 0).map(c => flowerNames[c]).join(', ') || 'none'}}. Assign ${flowerNames[chosen]}.`,
        variables: { garden: g, usedColors: [...used], chosen: flowerNames[chosen] },
        visualization: makeViz({ ...h, [g-1]: 'sorted' }, `Garden ${g} = ${flowerNames[chosen]}`),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = colorMap[result[i+1]];
    steps.push({
      line: 8,
      explanation: `All gardens planted: [${result.slice(1).map(c => flowerNames[c]).join(', ')}]. No two adjacent gardens share the same flower type.`,
      variables: { result: result.slice(1) },
      visualization: makeViz(finalH, 'All gardens assigned'),
    });

    return steps;
  },
};

export default flowerPlantingWithNoAdjacent;
