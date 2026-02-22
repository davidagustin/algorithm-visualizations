import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const ipo: AlgorithmDefinition = {
  id: 'ipo',
  title: 'IPO',
  leetcodeNumber: 502,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Maximize capital after at most k projects. Each project has a profit and a minimum capital requirement. Use two heaps: a min-heap sorted by capital requirement to track available projects, and a max-heap sorted by profit to pick the best available project. For each of the k rounds, unlock all affordable projects and greedily pick the highest-profit one.',
  tags: ['heap', 'greedy', 'sorting', 'two heaps'],

  code: {
    pseudocode: `function findMaximizedCapital(k, w, profits, capital):
  // Sort projects by capital requirement
  projects = sorted zip of (capital[i], profits[i])
  minCapHeap = projects (min-heap by capital)
  maxProfHeap = max-heap (for profits of unlocked projects)

  for round in range(k):
    // Unlock all projects we can afford
    while minCapHeap not empty and minCapHeap.top.capital <= w:
      (cap, profit) = minCapHeap.pop()
      maxProfHeap.push(profit)

    if maxProfHeap empty: break
    w += maxProfHeap.pop()  // take best profit

  return w`,

    python: `import heapq

def findMaximizedCapital(k: int, w: int, profits: list[int], capital: list[int]) -> int:
    projects = sorted(zip(capital, profits))
    min_cap = list(projects)
    heapq.heapify(min_cap)
    max_profit = []  # max-heap (use negation)
    for _ in range(k):
        while min_cap and min_cap[0][0] <= w:
            c, p = heapq.heappop(min_cap)
            heapq.heappush(max_profit, -p)
        if not max_profit:
            break
        w += -heapq.heappop(max_profit)
    return w`,

    javascript: `function findMaximizedCapital(k, w, profits, capital) {
  const projects = profits.map((p, i) => [capital[i], p])
                          .sort((a, b) => a[0] - b[0]);
  let pi = 0; // pointer into sorted projects
  // max-heap simulated
  const available = [];
  for (let round = 0; round < k; round++) {
    while (pi < projects.length && projects[pi][0] <= w) {
      available.push(projects[pi][1]);
      pi++;
    }
    if (!available.length) break;
    available.sort((a, b) => b - a);
    w += available.shift();
  }
  return w;
}`,

    java: `public int findMaximizedCapital(int k, int w, int[] profits, int[] capital) {
    int n = profits.length;
    int[][] projects = new int[n][2];
    for (int i = 0; i < n; i++) projects[i] = new int[]{capital[i], profits[i]};
    Arrays.sort(projects, (a,b)->a[0]-b[0]);
    PriorityQueue<Integer> maxP = new PriorityQueue<>(Collections.reverseOrder());
    int pi = 0;
    for (int round = 0; round < k; round++) {
        while (pi < n && projects[pi][0] <= w) maxP.offer(projects[pi++][1]);
        if (maxP.isEmpty()) break;
        w += maxP.poll();
    }
    return w;
}`,
  },

  defaultInput: {
    nums: [0, 1, 1, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Capital Requirements',
      type: 'array',
      defaultValue: [0, 1, 1, 2],
      placeholder: '0,1,1,2',
      helperText: 'Capital requirements for 4 projects (profits=[1,2,3,5], k=2, initial w=0)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const capitalReqs = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    // Fixed scenario for visualization
    const profits = [1, 2, 3, 5];
    const capital = capitalReqs.slice(0, 4).concat([0, 1, 1, 2].slice(capitalReqs.length));
    let w = 0;
    const k = 2;
    const n = Math.min(profits.length, capital.length);

    // Sort by capital requirement
    const projects = profits.slice(0, n).map((p, i) => ({ cap: capital[i], profit: p }));
    projects.sort((a, b) => a.cap - b.cap);

    steps.push({
      line: 1,
      explanation: `IPO: k=${k} rounds, initial capital w=${w}. Projects sorted by capital: [${projects.map(p => `(cap=${p.cap},profit=${p.profit})`).join(', ')}].`,
      variables: { k, initialCapital: w, projectCount: n },
      visualization: {
        type: 'array',
        array: projects.map(p => p.profit),
        highlights: {},
        labels: projects.reduce((acc: Record<number, string>, p, i) => { acc[i] = `c${p.cap}:p${p.profit}`; return acc; }, {}),
      },
    });

    let pi = 0;
    const available: number[] = [];

    for (let round = 0; round < k; round++) {
      // Unlock affordable projects
      const unlocked: number[] = [];
      while (pi < projects.length && projects[pi].cap <= w) {
        available.push(projects[pi].profit);
        unlocked.push(projects[pi].profit);
        pi++;
      }

      if (unlocked.length > 0) {
        available.sort((a, b) => b - a);
        steps.push({
          line: 7,
          explanation: `Round ${round + 1}: Capital w=${w}. Unlock projects with cap <= ${w}. New profits available: [${unlocked.join(', ')}]. All available: [${available.join(', ')}].`,
          variables: { round: round + 1, capital: w, unlocked: unlocked.join(', '), allAvailable: available.join(', ') },
          visualization: {
            type: 'array',
            array: [...available],
            highlights: available.reduce((acc: Record<number, string>, _, i) => {
              acc[i] = i < unlocked.length ? 'active' : 'found';
              return acc;
            }, {}),
            labels: { 0: `best:${available[0]}` },
          },
        });
      } else {
        steps.push({
          line: 7,
          explanation: `Round ${round + 1}: Capital w=${w}. No new projects unlocked. Available: [${available.join(', ')}].`,
          variables: { round: round + 1, capital: w, available: available.join(', ') },
          visualization: {
            type: 'array',
            array: available.length > 0 ? [...available] : [0],
            highlights: { 0: 'pointer' },
            labels: { 0: available.length > 0 ? `best:${available[0]}` : 'none' },
          },
        });
      }

      if (available.length === 0) {
        steps.push({
          line: 10,
          explanation: `No available projects (all require more capital than ${w}). Stop early.`,
          variables: { finalCapital: w },
          visualization: {
            type: 'array',
            array: [w],
            highlights: { 0: 'found' },
            labels: { 0: `final w=${w}` },
          },
        });
        break;
      }

      const bestProfit = available.shift()!;
      w += bestProfit;

      steps.push({
        line: 11,
        explanation: `Round ${round + 1}: Pick highest-profit project (profit=${bestProfit}). New capital w = ${w - bestProfit} + ${bestProfit} = ${w}.`,
        variables: { round: round + 1, profit: bestProfit, newCapital: w },
        visualization: {
          type: 'array',
          array: [w],
          highlights: { 0: 'found' },
          labels: { 0: `w=${w}` },
        },
      });
    }

    steps.push({
      line: 13,
      explanation: `All ${k} rounds complete. Maximum capital achieved: ${w}.`,
      variables: { rounds: k, finalCapital: w },
      visualization: {
        type: 'array',
        array: [w],
        highlights: { 0: 'found' },
        labels: { 0: `max capital: ${w}` },
      },
    });

    return steps;
  },
};

export default ipo;
