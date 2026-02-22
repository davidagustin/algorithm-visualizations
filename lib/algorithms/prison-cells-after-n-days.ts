import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const prisonCellsAfterNDays: AlgorithmDefinition = {
  id: 'prison-cells-after-n-days',
  title: 'Prison Cells After N Days',
  leetcodeNumber: 957,
  difficulty: 'Medium',
  category: 'Arrays',
  description:
    'Given 8 prison cells (0=empty, 1=occupied), each day a cell becomes occupied if both neighbors were the same state, otherwise empty. First and last cells always empty after day 1. Detect the cycle (max 256 states) and compute state at day N using N % cycleLength. O(1) time after cycle detection.',
  tags: ['Simulation', 'Array', 'Bit Manipulation', 'Hash Map'],
  code: {
    pseudocode: `function prisonAfterNDays(cells, n):
  seen = {}
  day = 0
  while day < n:
    key = tuple(cells)
    if key in seen:
      cycle = day - seen[key]
      n = (n - day) % cycle
      if n == 0: return cells
      seen = {}
    seen[key] = day
    nextCells = [0] * 8
    for i in 1..6:
      nextCells[i] = 1 if cells[i-1]==cells[i+1] else 0
    cells = nextCells
    day++
  return cells`,
    python: `def prisonAfterNDays(cells, n):
    seen = {}
    for day in range(n):
        key = tuple(cells)
        if key in seen:
            cycle = day - seen[key]
            remaining = (n - day) % cycle
            for _ in range(remaining):
                cells = next_state(cells)
            return cells
        seen[key] = day
        cells = next_state(cells)
    return cells

def next_state(cells):
    return [0]+[1 if cells[i-1]==cells[i+1] else 0 for i in range(1,7)]+[0]`,
    javascript: `function prisonAfterNDays(cells, n) {
  const seen = new Map();
  for (let day = 0; day < n; day++) {
    const key = cells.join('');
    if (seen.has(key)) {
      const cycle = day - seen.get(key);
      const rem = (n - day) % cycle;
      for (let i = 0; i < rem; i++) cells = nextState(cells);
      return cells;
    }
    seen.set(key, day);
    cells = nextState(cells);
  }
  return cells;
}
function nextState(c) {
  return [0,...Array.from({length:6},(_,i)=>c[i]===c[i+2]?1:0),0];
}`,
    java: `public int[] prisonAfterNDays(int[] cells, int n) {
    Map<String,Integer> seen = new HashMap<>();
    for (int day=0; day<n; day++) {
        String key = Arrays.toString(cells);
        if (seen.containsKey(key)) {
            int cycle = day - seen.get(key);
            int rem = (n - day) % cycle;
            for (int i=0; i<rem; i++) cells = nextState(cells);
            return cells;
        }
        seen.put(key, day);
        cells = nextState(cells);
    }
    return cells;
}`,
  },
  defaultInput: { cells: [0, 1, 0, 1, 1, 0, 0, 1], n: 7 },
  inputFields: [
    {
      name: 'cells',
      label: 'Initial Cells',
      type: 'array',
      defaultValue: [0, 1, 0, 1, 1, 0, 0, 1],
      placeholder: '0,1,0,1,1,0,0,1',
      helperText: '8 cells: 0=empty, 1=occupied',
    },
    {
      name: 'n',
      label: 'Days (N)',
      type: 'number',
      defaultValue: 7,
      placeholder: '7',
      helperText: 'Number of days to simulate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let cells = [...(input.cells as number[])];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const nextState = (c: number[]): number[] => {
      const next = [0];
      for (let i = 1; i <= 6; i++) next.push(c[i - 1] === c[i + 1] ? 1 : 0);
      next.push(0);
      return next;
    };

    const makeViz = (
      state: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxEntries: { key: string; value: string }[],
    ): ArrayVisualization & { type: 'array' } => ({
      type: 'array',
      array: [...state],
      highlights,
      labels,
      auxData: { label: 'Prison Cells', entries: auxEntries },
    });

    steps.push({
      line: 1,
      explanation: `Prison cells: [${cells.join(',')}]. Simulate ${n} days. Cycle detection: max 256 distinct states.`,
      variables: { cells: [...cells], n },
      visualization: makeViz(
        cells,
        {},
        Object.fromEntries(cells.map((v, i) => [i, v === 1 ? 'occ' : 'emp'])),
        [{ key: 'Day', value: '0' }, { key: 'N', value: String(n) }],
      ),
    });

    const seen = new Map<string, number>();
    const maxSteps = Math.min(n, 15);

    for (let day = 0; day < maxSteps; day++) {
      const key = cells.join('');
      if (seen.has(key)) {
        const cycleStart = seen.get(key)!;
        const cycle = day - cycleStart;

        steps.push({
          line: 6,
          explanation: `Cycle detected! State at day ${day} matches day ${cycleStart}. Cycle length = ${cycle}. Use modulo to skip ahead.`,
          variables: { day, cycleStart, cycle },
          visualization: makeViz(
            cells,
            Object.fromEntries(cells.map((_, i) => [i, 'found'])),
            Object.fromEntries(cells.map((v, i) => [i, v === 1 ? 'occ' : 'emp'])),
            [{ key: 'Cycle Found', value: String(cycle) }, { key: 'At Day', value: String(day) }, { key: 'Skip To', value: `day ${n}` }],
          ),
        });
        break;
      }
      seen.set(key, day);
      const next = nextState(cells);

      steps.push({
        line: 11,
        explanation: `Day ${day + 1}: Cell i is occupied if cells[i-1]==cells[i+1]. [${next.join(',')}].`,
        variables: { day: day + 1, cells: [...next] },
        visualization: makeViz(
          next,
          Object.fromEntries(next.map((v, i) => [i, v !== cells[i] ? 'active' : 'default'])),
          Object.fromEntries(next.map((v, i) => [i, v === 1 ? 'occ' : 'emp'])),
          [{ key: 'Day', value: String(day + 1) }, { key: 'State', value: next.join(',') }],
        ),
      });
      cells = next;
    }

    steps.push({
      line: 15,
      explanation: `Final state after ${n} days: [${cells.join(',')}].`,
      variables: { result: cells },
      visualization: makeViz(
        cells,
        Object.fromEntries(cells.map((v, i) => [i, v === 1 ? 'found' : 'visited'])),
        Object.fromEntries(cells.map((v, i) => [i, v === 1 ? 'occ' : 'emp'])),
        [{ key: 'Final State', value: cells.join(',') }, { key: 'After N Days', value: String(n) }],
      ),
    });

    return steps;
  },
};

export default prisonCellsAfterNDays;
