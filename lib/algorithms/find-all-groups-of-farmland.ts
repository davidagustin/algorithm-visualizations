import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findAllGroupsOfFarmland: AlgorithmDefinition = {
  id: 'find-all-groups-of-farmland',
  title: 'Find All Groups of Farmland',
  leetcodeNumber: 1992,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given a binary matrix where 1 is farmland and 0 is forest, find all rectangular groups of farmland. Each group is guaranteed to be a rectangle. For each top-left corner (1 cell not preceded by farmland), expand right and down to find the bottom-right corner.',
  tags: ['graph', 'dfs', 'grid', 'matrix', 'rectangle'],

  code: {
    pseudocode: `function findFarmland(land):
  m, n = dimensions
  result = []
  for r in range(m):
    for c in range(n):
      if land[r][c] == 1 and (r==0 or land[r-1][c]==0) and (c==0 or land[r][c-1]==0):
        // top-left corner found
        r2, c2 = r, c
        while r2+1 < m and land[r2+1][c] == 1: r2 += 1
        while c2+1 < n and land[r][c2+1] == 1: c2 += 1
        result.append([r, c, r2, c2])
  return result`,

    python: `def findFarmland(land):
    m, n = len(land), len(land[0])
    result = []
    for r in range(m):
        for c in range(n):
            if land[r][c] == 1:
                if (r == 0 or land[r-1][c] == 0) and (c == 0 or land[r][c-1] == 0):
                    r2, c2 = r, c
                    while r2 + 1 < m and land[r2+1][c] == 1:
                        r2 += 1
                    while c2 + 1 < n and land[r][c2+1] == 1:
                        c2 += 1
                    result.append([r, c, r2, c2])
    return result`,

    javascript: `function findFarmland(land) {
  const m = land.length, n = land[0].length;
  const result = [];
  for (let r = 0; r < m; r++) {
    for (let c = 0; c < n; c++) {
      if (land[r][c] === 1) {
        const topOk = r === 0 || land[r-1][c] === 0;
        const leftOk = c === 0 || land[r][c-1] === 0;
        if (topOk && leftOk) {
          let r2 = r, c2 = c;
          while (r2 + 1 < m && land[r2+1][c] === 1) r2++;
          while (c2 + 1 < n && land[r][c2+1] === 1) c2++;
          result.push([r, c, r2, c2]);
        }
      }
    }
  }
  return result;
}`,

    java: `public int[][] findFarmland(int[][] land) {
    int m = land.length, n = land[0].length;
    List<int[]> result = new ArrayList<>();
    for (int r = 0; r < m; r++) {
        for (int c = 0; c < n; c++) {
            if (land[r][c] == 1) {
                boolean topOk = r==0 || land[r-1][c]==0;
                boolean leftOk = c==0 || land[r][c-1]==0;
                if (topOk && leftOk) {
                    int r2=r, c2=c;
                    while (r2+1<m && land[r2+1][c]==1) r2++;
                    while (c2+1<n && land[r][c2+1]==1) c2++;
                    result.add(new int[]{r,c,r2,c2});
                }
            }
        }
    }
    return result.toArray(new int[0][]);
}`,
  },

  defaultInput: {
    land: [[1,0,0],[0,1,1],[0,1,1]],
  },

  inputFields: [
    {
      name: 'land',
      label: 'Land Grid',
      type: 'array',
      defaultValue: [1, 0, 0, 0, 1, 1, 0, 1, 1],
      placeholder: '1,0,0,0,1,1,0,1,1',
      helperText: '1=farmland, 0=forest in row-major order',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const land = input.land as number[][];
    const steps: AlgorithmStep[] = [];
    const m = land.length;
    const n = land[0].length;

    steps.push({
      line: 1,
      explanation: `Grid is ${m}x${n}. Scan for top-left corners of farmland rectangles (1 cells with no farmland above or to the left).`,
      variables: { rows: m, cols: n },
      visualization: {
        type: 'array',
        array: land.flat(),
        highlights: Object.fromEntries(
          land.flat().map((v, i) => [i, v === 1 ? 'active' : 'default'])
        ),
        labels: {},
      } as ArrayVisualization,
    });

    const result: number[][] = [];

    for (let r = 0; r < m; r++) {
      for (let c = 0; c < n; c++) {
        if (land[r][c] === 1) {
          const topOk = r === 0 || land[r - 1][c] === 0;
          const leftOk = c === 0 || land[r][c - 1] === 0;

          if (topOk && leftOk) {
            let r2 = r;
            let c2 = c;
            while (r2 + 1 < m && land[r2 + 1][c] === 1) r2++;
            while (c2 + 1 < n && land[r][c2 + 1] === 1) c2++;

            result.push([r, c, r2, c2]);

            const highlights: Record<number, string> = {};
            for (let fr = r; fr <= r2; fr++) {
              for (let fc = c; fc <= c2; fc++) {
                highlights[fr * n + fc] = 'found';
              }
            }
            highlights[r * n + c] = 'active';
            highlights[r2 * n + c2] = 'pointer';

            steps.push({
              line: 6,
              explanation: `Top-left corner at (${r}, ${c}). Expanded to bottom-right (${r2}, ${c2}). Rectangle #${result.length} found.`,
              variables: { topLeft: `(${r},${c})`, bottomRight: `(${r2},${c2})`, rectangleNum: result.length },
              visualization: {
                type: 'array',
                array: land.flat(),
                highlights,
                labels: { [r * n + c]: 'TL', [r2 * n + c2]: 'BR' },
              } as ArrayVisualization,
            });
          } else {
            steps.push({
              line: 4,
              explanation: `Cell (${r}, ${c}) is farmland but NOT a top-left corner (has farmland ${!topOk ? 'above' : 'to the left'}).`,
              variables: { row: r, col: c, topOk, leftOk },
              visualization: {
                type: 'array',
                array: land.flat(),
                highlights: { [r * n + c]: 'comparing' },
                labels: { [r * n + c]: 'interior' },
              } as ArrayVisualization,
            });
          }
        }
      }
    }

    steps.push({
      line: 9,
      explanation: `Found ${result.length} farmland rectangle(s). Coordinates: ${result.map(r => `[${r.join(',')}]`).join(', ')}.`,
      variables: { result: result.map(r => `[${r.join(',')}]`).join(' '), count: result.length },
      visualization: {
        type: 'array',
        array: result.flat(),
        highlights: Object.fromEntries(result.map((_, i) => [i * 4, 'found'])),
        labels: Object.fromEntries(result.map((r, i) => [i * 4, `rect${i + 1}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default findAllGroupsOfFarmland;
