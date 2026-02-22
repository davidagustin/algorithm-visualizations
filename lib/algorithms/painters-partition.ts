import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const paintersPartition: AlgorithmDefinition = {
  id: 'painters-partition',
  title: 'Painters Partition Problem',
  difficulty: 'Hard',
  category: 'Binary Search',
  description:
    'Given boards and k painters (each paints a contiguous segment), minimize the maximum time any painter spends. Binary search on the answer (max time): check if k painters can finish all boards within that time limit.',
  tags: ['binary search', 'greedy', 'array', 'classic'],

  code: {
    pseudocode: `function paintersPartition(boards, k):
  lo = max(boards), hi = sum(boards)
  while lo < hi:
    mid = (lo + hi) / 2
    if canPaint(boards, k, mid):
      hi = mid
    else:
      lo = mid + 1
  return lo

function canPaint(boards, k, maxTime):
  painters = 1, current = 0
  for board in boards:
    if current + board <= maxTime:
      current += board
    else:
      painters++, current = board
      if painters > k: return false
  return true`,
    python: `def paintersPartition(boards: list[int], k: int) -> int:
    def canPaint(maxTime):
        painters, current = 1, 0
        for board in boards:
            if current + board <= maxTime:
                current += board
            else:
                painters += 1
                current = board
                if painters > k:
                    return False
        return True
    lo, hi = max(boards), sum(boards)
    while lo < hi:
        mid = (lo + hi) // 2
        if canPaint(mid): hi = mid
        else: lo = mid + 1
    return lo`,
    javascript: `function paintersPartition(boards, k) {
  const canPaint = (maxTime) => {
    let painters = 1, current = 0;
    for (const board of boards) {
      if (current + board <= maxTime) current += board;
      else { painters++; current = board; if (painters > k) return false; }
    }
    return true;
  };
  let lo = Math.max(...boards), hi = boards.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (canPaint(mid)) hi = mid; else lo = mid + 1;
  }
  return lo;
}`,
    java: `public int paintersPartition(int[] boards, int k) {
    int lo = 0, hi = 0;
    for (int b : boards) { lo = Math.max(lo, b); hi += b; }
    while (lo < hi) {
        int mid = (lo + hi) / 2;
        int painters = 1, cur = 0;
        for (int b : boards) {
            if (cur + b <= mid) cur += b;
            else { painters++; cur = b; if (painters > k) { lo = mid + 1; break; } }
        }
        if (painters <= k) hi = mid; else lo = mid + 1;
    }
    return lo;
}`,
  },

  defaultInput: {
    boards: [10, 20, 30, 40],
    k: 2,
  },

  inputFields: [
    {
      name: 'boards',
      label: 'Board Lengths',
      type: 'array',
      defaultValue: [10, 20, 30, 40],
      placeholder: '10,20,30,40',
      helperText: 'Length of each board to paint',
    },
    {
      name: 'k',
      label: 'k (painters)',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of painters available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const boards = input.boards as number[];
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    const canPaint = (maxTime: number): { result: boolean; assignment: number[] } => {
      const assignment = new Array(boards.length).fill(0);
      let painters = 1;
      let current = 0;
      for (let i = 0; i < boards.length; i++) {
        if (current + boards[i] <= maxTime) {
          current += boards[i];
          assignment[i] = painters;
        } else {
          painters++;
          current = boards[i];
          assignment[i] = painters;
          if (painters > k) return { result: false, assignment };
        }
      }
      return { result: true, assignment };
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...boards],
      highlights,
      labels,
    });

    let lo = Math.max(...boards);
    let hi = boards.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `boards=[${boards.join(', ')}], k=${k} painters. Binary search time from ${lo} to ${hi}.`,
      variables: { lo, hi, k },
      visualization: makeViz({}, boards.reduce((acc, b, i) => ({ ...acc, [i]: `b=${b}` }), {})),
    });

    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      const { result, assignment } = canPaint(mid);

      const highlights: Record<number, string> = {};
      boards.forEach((_, i) => { highlights[i] = assignment[i] <= k ? 'active' : 'mismatch'; });

      steps.push({
        line: 5,
        explanation: `maxTime=mid=${mid}. Can ${k} painters finish? ${result ? 'YES' : 'NO'}. Painter assignments: [${assignment.join(', ')}].`,
        variables: { lo, mid, hi, result, painters: k },
        visualization: makeViz(highlights, boards.reduce((acc, _, i) => ({ ...acc, [i]: `P${assignment[i]}` }), {})),
      });

      if (result) {
        steps.push({
          line: 6,
          explanation: `maxTime ${mid} works. Try smaller. hi=${mid}.`,
          variables: { lo, hi: mid },
          visualization: makeViz(highlights, {}),
        });
        hi = mid;
      } else {
        steps.push({
          line: 8,
          explanation: `maxTime ${mid} needs more than ${k} painters. lo=${mid + 1}.`,
          variables: { lo: mid + 1, hi },
          visualization: makeViz(boards.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}), {}),
        });
        lo = mid + 1;
      }
    }

    const { assignment } = canPaint(lo);
    steps.push({
      line: 9,
      explanation: `Minimum maximum time = ${lo}. Painter assignments: [${assignment.join(', ')}].`,
      variables: { result: lo, assignment: assignment.join(',') },
      visualization: makeViz(
        boards.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        boards.reduce((acc, _, i) => ({ ...acc, [i]: `P${assignment[i]}` }), {})
      ),
    });

    return steps;
  },
};

export default paintersPartition;
