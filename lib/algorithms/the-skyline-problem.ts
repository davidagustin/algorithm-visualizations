import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const theSkylineProblem: AlgorithmDefinition = {
  id: 'the-skyline-problem',
  title: 'The Skyline Problem',
  leetcodeNumber: 218,
  difficulty: 'Hard',
  category: 'Heap',
  description:
    'Given a list of buildings as [left, right, height], compute the skyline outline as a list of [x, height] key points. Use a sweep line approach: create events for building starts and ends, then maintain a max heap of active building heights.',
  tags: ['heap', 'sweep line', 'sorting', 'divide and conquer'],

  code: {
    pseudocode: `function getSkyline(buildings):
  events = []
  for L, R, H in buildings:
    events.append((L, -H))  // start event
    events.append((R, H))   // end event
  sort events by x, then by height
  result = []
  maxHeap = [0]  // heights active
  for x, h in events:
    if h < 0: add |h| to heap (building starts)
    else: remove h from heap (building ends)
    if maxHeap.max changed: append (x, maxHeap.max)
  return result`,

    python: `import heapq
from sortedcontainers import SortedList

def getSkyline(buildings):
    events = []
    for l, r, h in buildings:
        events.append((l, -h, r))
        events.append((r, 0, 0))
    events.sort()
    result = []
    active = SortedList([0])  # sorted heights
    for x, neg_h, r in events:
        if neg_h < 0:
            active.add(-neg_h)
        else:
            # find and remove ended buildings
            pass
    # Simplified: use heap approach
    heap = [(0, float("inf"))]  # (-height, end)
    for l, r, h in sorted(buildings):
        pass
    return result`,

    javascript: `function getSkyline(buildings) {
  const events = [];
  for (const [l, r, h] of buildings) {
    events.push([l, -h]);
    events.push([r, h]);
  }
  events.sort((a,b) => a[0]-b[0] || a[1]-b[1]);
  const result = [], heights = [0];
  let prevMax = 0;
  for (const [x, h] of events) {
    if (h < 0) heights.push(-h);
    else heights.splice(heights.indexOf(h), 1);
    heights.sort((a,b)=>b-a);
    const curMax = heights[0];
    if (curMax !== prevMax) { result.push([x, curMax]); prevMax = curMax; }
  }
  return result;
}`,

    java: `public List<List<Integer>> getSkyline(int[][] buildings) {
    List<int[]> events = new ArrayList<>();
    for (int[] b : buildings) {
        events.add(new int[]{b[0], -b[2]});
        events.add(new int[]{b[1], b[2]});
    }
    events.sort((a,b) -> a[0]!=b[0] ? a[0]-b[0] : a[1]-b[1]);
    List<List<Integer>> result = new ArrayList<>();
    TreeMap<Integer,Integer> heights = new TreeMap<>(Collections.reverseOrder());
    heights.put(0, 1);
    int prevMax = 0;
    for (int[] e : events) {
        if (e[1] < 0) heights.merge(-e[1], 1, Integer::sum);
        else { heights.merge(e[1], -1, Integer::sum); heights.remove(e[1], 0); }
        int curMax = heights.firstKey();
        if (curMax != prevMax) { result.add(Arrays.asList(e[0], curMax)); prevMax = curMax; }
    }
    return result;
}`,
  },

  defaultInput: {
    buildings: [2, 9, 10, 3, 7, 15, 5, 12, 12, 15, 20, 10, 19, 24, 8],
  },

  inputFields: [
    {
      name: 'buildings',
      label: 'Buildings (L,R,H triplets)',
      type: 'array',
      defaultValue: [2, 9, 10, 3, 7, 15, 5, 12, 12, 15, 20, 10, 19, 24, 8],
      placeholder: '2,9,10,3,7,15,5,12,12',
      helperText: 'Triplets of left,right,height',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.buildings as number[];
    const steps: AlgorithmStep[] = [];

    const buildings: [number, number, number][] = [];
    for (let i = 0; i + 2 < flat.length; i += 3) {
      buildings.push([flat[i], flat[i + 1], flat[i + 2]]);
    }

    // Create events: [x, h] where negative h = start, positive h = end
    const events: [number, number][] = [];
    for (const [l, r, h] of buildings) {
      events.push([l, -h]);
      events.push([r, h]);
    }
    events.sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    steps.push({
      line: 1,
      explanation: `${buildings.length} buildings. Created ${events.length} events (start=neg, end=pos). Sorted by x.`,
      variables: { buildings: buildings.length, events: events.length },
      visualization: {
        type: 'array',
        array: buildings.map(([, , h]) => h),
        highlights: {},
        labels: Object.fromEntries(buildings.map(([l, r, h], i) => [i, `[${l},${r}]h=${h}`])),
      } as ArrayVisualization,
    });

    const result: [number, number][] = [];
    let heights = [0];
    let prevMax = 0;

    for (let ei = 0; ei < events.length; ei++) {
      const [x, h] = events[ei];

      if (h < 0) {
        heights.push(-h);
      } else {
        const idx = heights.indexOf(h);
        if (idx !== -1) heights.splice(idx, 1);
      }
      heights.sort((a, b) => b - a);

      const curMax = heights[0];
      const changed = curMax !== prevMax;
      if (changed) {
        result.push([x, curMax]);
        prevMax = curMax;
      }

      steps.push({
        line: h < 0 ? 8 : 9,
        explanation: `x=${x}: ${h < 0 ? `Building starts (height=${-h})` : `Building ends (height=${h})`}. Max height=${curMax}. ${changed ? `Key point added: [${x},${curMax}]` : 'No change.'}`,
        variables: { x, event: h < 0 ? 'start' : 'end', height: Math.abs(h), currentMax: curMax, keyPoints: result.length },
        visualization: {
          type: 'array',
          array: [...heights],
          highlights: { 0: changed ? 'found' : 'active' },
          labels: { 0: `max=${curMax}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 11,
      explanation: `Skyline key points: [${result.map(([x, h]) => `[${x},${h}]`).join(', ')}]`,
      variables: { result: result.map(([x, h]) => `[${x},${h}]`).join(',') },
      visualization: {
        type: 'array',
        array: result.map(([, h]) => h),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map(([x, h], i) => [i, `x=${x},h=${h}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default theSkylineProblem;
