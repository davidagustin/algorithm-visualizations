import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const furthestBuildingYouCanReach: AlgorithmDefinition = {
  id: 'furthest-building-you-can-reach',
  title: 'Furthest Building You Can Reach',
  leetcodeNumber: 1642,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given building heights, bricks, and ladders, find the furthest building reachable. Moving from building i to i+1: if height doesn\'t increase, move freely. If height increases by diff, you can use bricks or a ladder. Greedy: use a ladder on the largest climbs encountered so far (use a min-heap to track ladder climbs; if needed, swap smallest ladder-climb with bricks).',
  tags: ['Heap', 'Greedy', 'Array'],
  code: {
    pseudocode: `function furthestBuilding(heights, bricks, ladders):
  minHeap = []  // stores climbs where ladders are used
  for i from 0 to n-2:
    diff = heights[i+1] - heights[i]
    if diff <= 0: continue
    push diff onto heap  // tentatively use ladder
    if heap.size > ladders:
      bricks -= pop min from heap  // swap smallest ladder-climb for bricks
      if bricks < 0: return i
  return n - 1`,
    python: `import heapq
def furthestBuilding(heights, bricks, ladders):
    heap = []  # min-heap of climbs using ladder
    for i in range(len(heights) - 1):
        diff = heights[i+1] - heights[i]
        if diff <= 0:
            continue
        heapq.heappush(heap, diff)
        if len(heap) > ladders:
            bricks -= heapq.heappop(heap)
            if bricks < 0:
                return i
    return len(heights) - 1`,
    javascript: `function furthestBuilding(heights, bricks, ladders) {
  const heap = []; // min-heap simulation
  for (let i = 0; i < heights.length - 1; i++) {
    const diff = heights[i+1] - heights[i];
    if (diff <= 0) continue;
    heap.push(diff);
    heap.sort((a, b) => a - b);
    if (heap.length > ladders) {
      bricks -= heap.shift();
      if (bricks < 0) return i;
    }
  }
  return heights.length - 1;
}`,
    java: `public int furthestBuilding(int[] heights, int bricks, int ladders) {
    PriorityQueue<Integer> pq = new PriorityQueue<>();
    for (int i = 0; i < heights.length - 1; i++) {
        int diff = heights[i+1] - heights[i];
        if (diff <= 0) continue;
        pq.offer(diff);
        if (pq.size() > ladders) {
            bricks -= pq.poll();
            if (bricks < 0) return i;
        }
    }
    return heights.length - 1;
}`,
  },
  defaultInput: { heights: [4, 2, 7, 6, 9, 14, 12], bricks: 5, ladders: 1 },
  inputFields: [
    {
      name: 'heights',
      label: 'Building Heights',
      type: 'array',
      defaultValue: [4, 2, 7, 6, 9, 14, 12],
      placeholder: 'e.g. 4,2,7,6,9,14,12',
      helperText: 'Height of each building',
    },
    {
      name: 'bricks',
      label: 'Bricks',
      type: 'number',
      defaultValue: 5,
      placeholder: 'e.g. 5',
      helperText: 'Number of bricks available',
    },
    {
      name: 'ladders',
      label: 'Ladders',
      type: 'number',
      defaultValue: 1,
      placeholder: 'e.g. 1',
      helperText: 'Number of ladders available',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const heights = input.heights as number[];
    let bricks = input.bricks as number;
    const ladders = input.ladders as number;
    const n = heights.length;
    const steps: AlgorithmStep[] = [];
    let heap: number[] = [];
    let furthest = n - 1;

    function makeViz(i: number, diff: number | null, action: string | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let j = 0; j < n; j++) {
        labels[j] = String(heights[j]);
        if (j < i) highlights[j] = 'visited';
        else if (j === i) highlights[j] = 'active';
        else if (j === i + 1 && diff !== null && diff > 0) highlights[j] = 'comparing';
        else highlights[j] = 'default';
      }
      return {
        type: 'array',
        array: heights.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Building Progress',
          entries: [
            { key: 'Current building', value: String(i) },
            { key: 'Height diff', value: diff !== null ? String(diff) : '-' },
            { key: 'Bricks left', value: String(bricks) },
            { key: 'Ladders', value: String(ladders) },
            { key: 'Ladder-heap', value: heap.length > 0 ? `[${heap.join(', ')}]` : 'empty' },
            ...(action ? [{ key: 'Action', value: action }] : []),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find furthest building reachable. Heights=[${heights.join(', ')}], bricks=${bricks}, ladders=${ladders}. Use min-heap to optimally allocate ladders.`,
      variables: { heights, bricks, ladders },
      visualization: makeViz(0, null, null),
    });

    for (let i = 0; i < n - 1; i++) {
      const diff = heights[i + 1] - heights[i];

      steps.push({
        line: 3,
        explanation: `Building ${i}→${i + 1}: heights ${heights[i]}→${heights[i + 1]}, diff=${diff}. ${diff <= 0 ? 'No climb needed.' : `Must climb ${diff}.`}`,
        variables: { i, diff, heights_i: heights[i], heights_i1: heights[i + 1] },
        visualization: makeViz(i, diff, null),
      });

      if (diff <= 0) continue;

      heap.push(diff);
      heap.sort((a, b) => a - b);

      steps.push({
        line: 5,
        explanation: `Climb of ${diff}: tentatively assign a ladder. Heap (ladder climbs): [${heap.join(', ')}].`,
        variables: { diff, heap: heap.slice() },
        visualization: makeViz(i, diff, `Ladder for diff=${diff}`),
      });

      if (heap.length > ladders) {
        const smallest = heap.shift()!;
        bricks -= smallest;
        steps.push({
          line: 7,
          explanation: `Too many ladder climbs (${heap.length + 1} > ${ladders}). Swap smallest (${smallest}) for bricks. Bricks: ${bricks + smallest}→${bricks}.`,
          variables: { swapped: smallest, bricks, heap: heap.slice() },
          visualization: makeViz(i, diff, `Bricks used: ${smallest}, left: ${bricks}`),
        });

        if (bricks < 0) {
          furthest = i;
          steps.push({
            line: 9,
            explanation: `Bricks exhausted (${bricks} < 0). Cannot reach building ${i + 1}. Furthest building: ${i}.`,
            variables: { furthest: i },
            visualization: (() => {
              const h: Record<number, string> = {};
              const l: Record<number, string> = {};
              for (let j = 0; j < n; j++) {
                l[j] = String(heights[j]);
                h[j] = j <= i ? 'found' : 'mismatch';
              }
              return {
                type: 'array' as const,
                array: heights.slice(),
                highlights: h,
                labels: l,
                auxData: {
                  label: 'Result',
                  entries: [{ key: 'Furthest building index', value: String(i) }],
                },
              };
            })(),
          });
          return steps;
        }
      }
    }

    steps.push({
      line: 10,
      explanation: `Reached the last building (index ${n - 1})! Bricks remaining: ${bricks}.`,
      variables: { furthest: n - 1, bricksLeft: bricks },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let j = 0; j < n; j++) { l[j] = String(heights[j]); h[j] = 'found'; }
        return {
          type: 'array' as const,
          array: heights.slice(),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Furthest building', value: String(n - 1) },
              { key: 'Bricks left', value: String(bricks) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default furthestBuildingYouCanReach;
