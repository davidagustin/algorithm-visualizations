import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const brickWall: AlgorithmDefinition = {
  id: 'brick-wall',
  title: 'Brick Wall',
  leetcodeNumber: 554,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a brick wall represented as rows of brick widths, find the vertical line that crosses the fewest bricks. Track cumulative widths (edges) per row using a hash map. The line should go through the most edges, minimizing brick crossings.',
  tags: ['hash map', 'array', 'greedy'],

  code: {
    pseudocode: `function leastBricks(wall):
  edgeCounts = {}
  for row in wall:
    pos = 0
    for i in range(len(row) - 1):
      pos += row[i]
      edgeCounts[pos] = edgeCounts.get(pos, 0) + 1
  maxEdges = max(edgeCounts.values(), default=0)
  return len(wall) - maxEdges`,

    python: `def leastBricks(wall: list[list[int]]) -> int:
    edges = {}
    for row in wall:
        pos = 0
        for brick in row[:-1]:
            pos += brick
            edges[pos] = edges.get(pos, 0) + 1
    return len(wall) - max(edges.values(), default=0)`,

    javascript: `function leastBricks(wall) {
  const edges = new Map();
  for (const row of wall) {
    let pos = 0;
    for (let i = 0; i < row.length - 1; i++) {
      pos += row[i];
      edges.set(pos, (edges.get(pos) || 0) + 1);
    }
  }
  const maxEdges = edges.size ? Math.max(...edges.values()) : 0;
  return wall.length - maxEdges;
}`,

    java: `public int leastBricks(List<List<Integer>> wall) {
    Map<Integer, Integer> edges = new HashMap<>();
    for (List<Integer> row : wall)
        for (int i = 0, pos = 0; i < row.size() - 1; i++)
            edges.merge(pos += row.get(i), 1, Integer::sum);
    return wall.size() - edges.values().stream().mapToInt(v->v).max().orElse(0);
}`,
  },

  defaultInput: {
    wall: [[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]],
  },

  inputFields: [
    {
      name: 'wall',
      label: 'Wall (rows of brick widths)',
      type: 'array',
      defaultValue: [[1, 2, 2, 1], [3, 1, 2], [1, 3, 2], [2, 4], [3, 1, 2], [1, 3, 1, 1]],
      placeholder: '1,2,2,1|3,1,2|1,3,2',
      helperText: 'Each row is a list of brick widths',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wall = input.wall as number[][];
    const steps: AlgorithmStep[] = [];
    const edgeCounts: Record<number, number> = {};

    steps.push({
      line: 1,
      explanation: `Initialize edge count map. We have ${wall.length} rows. We will record cumulative widths (edge positions) for each row, excluding the rightmost edge.`,
      variables: { rows: wall.length, edgeCounts: '{}' },
      visualization: { type: 'array', array: wall[0], highlights: {}, labels: {} },
    });

    for (let r = 0; r < wall.length; r++) {
      const row = wall[r];
      let pos = 0;

      steps.push({
        line: 3,
        explanation: `Processing row ${r}: [${row.join(', ')}]. Walk through bricks and record edge positions.`,
        variables: { row: r, bricks: row.join(','), pos: 0 },
        visualization: { type: 'array', array: row, highlights: {}, labels: {} },
      });

      for (let i = 0; i < row.length - 1; i++) {
        pos += row[i];
        edgeCounts[pos] = (edgeCounts[pos] || 0) + 1;

        steps.push({
          line: 5,
          explanation: `Row ${r}, brick ${i}: width=${row[i]}. Edge at position ${pos}. edgeCounts[${pos}] = ${edgeCounts[pos]}.`,
          variables: { row: r, brick: i, width: row[i], edgePos: pos, edgeCounts: JSON.stringify(edgeCounts) },
          visualization: {
            type: 'array',
            array: row,
            highlights: { [i]: 'active' },
            labels: { [i]: `edge@${pos}` },
          },
        });
      }
    }

    const maxEdges = Object.values(edgeCounts).length > 0 ? Math.max(...Object.values(edgeCounts)) : 0;
    const result = wall.length - maxEdges;

    steps.push({
      line: 7,
      explanation: `Edge map complete: ${JSON.stringify(edgeCounts)}. Max edges at any position = ${maxEdges}. Minimum bricks crossed = ${wall.length} - ${maxEdges} = ${result}.`,
      variables: { edgeCounts: JSON.stringify(edgeCounts), maxEdges, result },
      visualization: { type: 'array', array: wall[0], highlights: {}, labels: {} },
    });

    return steps;
  },
};

export default brickWall;
