import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumCostHomecoming: AlgorithmDefinition = {
  id: 'minimum-cost-homecoming',
  title: 'Minimum Cost Homecoming of a Robot in a Grid',
  leetcodeNumber: 2087,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'A robot is at position (startRow, startCol) on a grid. Moving through row r costs rowCosts[r] and moving through column c costs colCosts[c]. Find the minimum total cost to return home at (homeRow, homeCol). The optimal strategy is to move greedily: always move in the direction of home, paying each row/col cost exactly once.',
  tags: ['dynamic programming', 'greedy', 'grid', 'path cost'],

  code: {
    pseudocode: `function minCost(startPos, homePos, rowCosts, colCosts):
  cost = 0
  row, col = startPos
  homeRow, homeCol = homePos
  move vertically toward homeRow:
    while row != homeRow:
      row += sign(homeRow - row)
      cost += rowCosts[row]
  move horizontally toward homeCol:
    while col != homeCol:
      col += sign(homeCol - col)
      cost += colCosts[col]
  return cost`,
    python: `def minCost(startPos, homePos, rowCosts, colCosts):
    cost = 0
    r, c = startPos
    hr, hc = homePos
    while r != hr:
        r += 1 if hr > r else -1
        cost += rowCosts[r]
    while c != hc:
        c += 1 if hc > c else -1
        cost += colCosts[c]
    return cost`,
    javascript: `function minCost(startPos, homePos, rowCosts, colCosts) {
  let cost = 0;
  let [r, c] = startPos;
  const [hr, hc] = homePos;
  while (r !== hr) { r += hr > r ? 1 : -1; cost += rowCosts[r]; }
  while (c !== hc) { c += hc > c ? 1 : -1; cost += colCosts[c]; }
  return cost;
}`,
    java: `public int minCost(int[] startPos, int[] homePos, int[] rowCosts, int[] colCosts) {
    int cost=0, r=startPos[0], c=startPos[1];
    int hr=homePos[0], hc=homePos[1];
    while(r!=hr) { r+=hr>r?1:-1; cost+=rowCosts[r]; }
    while(c!=hc) { c+=hc>c?1:-1; cost+=colCosts[c]; }
    return cost;
}`,
  },

  defaultInput: {
    startPos: [1, 0],
    homePos: [2, 3],
    rowCosts: [5, 4, 3],
    colCosts: [8, 2, 6, 7],
  },

  inputFields: [
    {
      name: 'startPos',
      label: 'Start Position [row, col]',
      type: 'array',
      defaultValue: [1, 0],
      placeholder: '1,0',
      helperText: 'Starting position as [row, col]',
    },
    {
      name: 'homePos',
      label: 'Home Position [row, col]',
      type: 'array',
      defaultValue: [2, 3],
      placeholder: '2,3',
      helperText: 'Home position as [row, col]',
    },
    {
      name: 'rowCosts',
      label: 'Row Costs',
      type: 'array',
      defaultValue: [5, 4, 3],
      placeholder: '5,4,3',
      helperText: 'Cost of traversing each row',
    },
    {
      name: 'colCosts',
      label: 'Column Costs',
      type: 'array',
      defaultValue: [8, 2, 6, 7],
      placeholder: '8,2,6,7',
      helperText: 'Cost of traversing each column',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startPos = input.startPos as number[];
    const homePos = input.homePos as number[];
    const rowCosts = input.rowCosts as number[];
    const colCosts = input.colCosts as number[];
    const steps: AlgorithmStep[] = [];

    let cost = 0;
    let r = startPos[0], c = startPos[1];
    const hr = homePos[0], hc = homePos[1];

    const makeViz = (arr: number[], hi: Record<number, string>, lb: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights: hi,
      labels: lb,
    });

    steps.push({
      line: 1,
      explanation: `Start at (${r},${c}), going home to (${hr},${hc}). Move through rows first, then columns.`,
      variables: { startRow: r, startCol: c, homeRow: hr, homeCol: hc, cost: 0 },
      visualization: makeViz([...rowCosts], { [r]: 'active' }, { [r]: 'start' }),
    });

    const rowHistory: number[] = [];
    while (r !== hr) {
      r += hr > r ? 1 : -1;
      cost += rowCosts[r];
      rowHistory.push(r);

      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const rr of rowHistory) { hi[rr] = 'visiting'; lb[rr] = `+${rowCosts[rr]}`; }
      hi[r] = 'active';
      hi[hr] = 'found';

      steps.push({
        line: 5,
        explanation: `Move to row ${r}, pay rowCosts[${r}] = ${rowCosts[r]}. Total cost = ${cost}`,
        variables: { currentRow: r, rowCost: rowCosts[r], totalCost: cost },
        visualization: makeViz([...rowCosts], hi, lb),
      });
    }

    steps.push({
      line: 7,
      explanation: `Reached home row ${hr}. Now move horizontally. Column costs: [${colCosts.join(', ')}]`,
      variables: { currentRow: r, startCol: c, homeCol: hc, costSoFar: cost },
      visualization: makeViz([...colCosts], { [c]: 'active', [hc]: 'found' }, { [c]: 'cur', [hc]: 'home' }),
    });

    const colHistory: number[] = [];
    while (c !== hc) {
      c += hc > c ? 1 : -1;
      cost += colCosts[c];
      colHistory.push(c);

      const hi: Record<number, string> = {};
      const lb: Record<number, string> = {};
      for (const cc of colHistory) { hi[cc] = 'visiting'; lb[cc] = `+${colCosts[cc]}`; }
      hi[c] = 'active';
      hi[hc] = 'found';

      steps.push({
        line: 9,
        explanation: `Move to col ${c}, pay colCosts[${c}] = ${colCosts[c]}. Total cost = ${cost}`,
        variables: { currentCol: c, colCost: colCosts[c], totalCost: cost },
        visualization: makeViz([...colCosts], hi, lb),
      });
    }

    steps.push({
      line: 11,
      explanation: `Reached home (${hr},${hc}). Minimum total cost = ${cost}`,
      variables: { answer: cost },
      visualization: makeViz([...colCosts], { [hc]: 'found' }, { [hc]: `home` }),
    });

    return steps;
  },
};

export default minimumCostHomecoming;
