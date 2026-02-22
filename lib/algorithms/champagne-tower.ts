import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const champagneTower: AlgorithmDefinition = {
  id: 'champagne-tower',
  title: 'Champagne Tower',
  leetcodeNumber: 799,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Glasses are stacked in a pyramid. Pour poured cups of champagne into the top. When a glass is full (>1 cup), excess overflows equally to the two glasses below. Find how full the glass at row r, column c is. Simulate row by row: track overflow and propagate down.',
  tags: ['dynamic programming', 'simulation', 'array'],

  code: {
    pseudocode: `function champagneTower(poured, row, glass):
  tower = 2D array, tower[0][0] = poured
  for i from 0 to row-1:
    for j from 0 to i:
      if tower[i][j] > 1:
        overflow = tower[i][j] - 1
        tower[i][j] = 1
        tower[i+1][j] += overflow / 2
        tower[i+1][j+1] += overflow / 2
  return min(1.0, tower[row][glass])`,

    python: `def champagneTower(poured, row, glass):
    tower = [[0.0]*(i+1) for i in range(row+1)]
    tower[0][0] = poured
    for i in range(row):
        for j in range(i+1):
            if tower[i][j] > 1:
                overflow = tower[i][j] - 1
                tower[i][j] = 1
                tower[i+1][j] += overflow/2
                tower[i+1][j+1] += overflow/2
    return min(1.0, tower[row][glass])`,

    javascript: `function champagneTower(poured, row, glass) {
  const tower = Array.from({length:row+1}, (_,i)=>new Array(i+1).fill(0));
  tower[0][0] = poured;
  for (let i = 0; i < row; i++) {
    for (let j = 0; j <= i; j++) {
      if (tower[i][j] > 1) {
        const overflow = tower[i][j] - 1;
        tower[i][j] = 1;
        tower[i+1][j] += overflow/2;
        tower[i+1][j+1] += overflow/2;
      }
    }
  }
  return Math.min(1, tower[row][glass]);
}`,

    java: `public double champagneTower(int poured, int row, int glass) {
    double[][] t = new double[row+1][row+1];
    t[0][0] = poured;
    for (int i = 0; i < row; i++) {
        for (int j = 0; j <= i; j++) {
            if (t[i][j] > 1) {
                double ov = t[i][j]-1; t[i][j]=1;
                t[i+1][j]+=ov/2; t[i+1][j+1]+=ov/2;
            }
        }
    }
    return Math.min(1.0, t[row][glass]);
}`,
  },

  defaultInput: {
    poured: 25,
    row: 4,
    glass: 2,
  },

  inputFields: [
    {
      name: 'poured',
      label: 'Cups Poured',
      type: 'number',
      defaultValue: 25,
      placeholder: '25',
      helperText: 'Number of cups poured into the top glass',
    },
    {
      name: 'row',
      label: 'Target Row (0-indexed)',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Row of the glass to query (0=top)',
    },
    {
      name: 'glass',
      label: 'Target Glass (0-indexed)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Position in the target row (0=leftmost)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const poured = input.poured as number;
    const row = input.row as number;
    const glass = input.glass as number;
    const steps: AlgorithmStep[] = [];

    const tower: number[][] = Array.from({ length: row + 1 }, (_, i) => new Array(i + 1).fill(0));
    tower[0][0] = poured;

    function makeDPViz(rowData: number[], activeGlass: number, rowIdx: number): DPVisualization {
      const vals: (number | null)[] = rowData.map(v => Math.round(v * 100) / 100);
      const highlights: Record<number, string> = {};
      for (let i = 0; i < rowData.length; i++) {
        if (i === activeGlass) highlights[i] = 'active';
        else if (rowData[i] > 0) highlights[i] = 'found';
        else highlights[i] = 'default';
      }
      const labels: string[] = rowData.map((_, i) => `[${rowIdx}][${i}]`);
      return { type: 'dp-table', values: vals, highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `Pour ${poured} cups into the top glass. Simulate overflow row by row down to row ${row}. Query glass at [${row}][${glass}].`,
      variables: { poured, targetRow: row, targetGlass: glass },
      visualization: makeDPViz([poured], 0, 0),
    });

    for (let i = 0; i < row; i++) {
      for (let j = 0; j <= i; j++) {
        if (tower[i][j] > 1) {
          const overflow = tower[i][j] - 1;
          tower[i][j] = 1;
          tower[i + 1][j] += overflow / 2;
          tower[i + 1][j + 1] += overflow / 2;
        }
      }

      const rowDisplay = tower[i + 1].map(v => Math.round(v * 100) / 100);
      steps.push({
        line: 5,
        explanation: `After row ${i}: overflow propagated down. Row ${i + 1} now: [${rowDisplay.join(', ')}].`,
        variables: { afterRow: i, nextRowValues: rowDisplay },
        visualization: makeDPViz(tower[i + 1], i + 1 === row ? glass : -1, i + 1),
      });
    }

    const ans = Math.min(1, tower[row][glass]);
    const rounded = Math.round(ans * 10000) / 10000;
    steps.push({
      line: 10,
      explanation: `Glass at row ${row}, position ${glass} is ${rounded} full (capped at 1.0).`,
      variables: { answer: rounded, uncapped: Math.round(tower[row][glass] * 1000) / 1000 },
      visualization: makeDPViz(tower[row].map(v => Math.min(1, v)), glass, row),
    });

    return steps;
  },
};

export default champagneTower;
