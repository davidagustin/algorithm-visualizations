import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const skylineProblemIi: AlgorithmDefinition = {
  id: 'skyline-problem-ii',
  title: 'Skyline Problem II',
  leetcodeNumber: 218,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given a list of buildings represented as [left, right, height], return the skyline outline. The skyline is a list of key points [x, height] where the maximum height changes. Uses a max-heap to track active building heights as we sweep from left to right.',
  tags: ['Heap', 'Divide and Conquer', 'Sweep Line', 'Sorted Set'],
  code: {
    pseudocode: `function getSkyline(buildings):
  events = []
  for each [l, r, h] in buildings:
    events.add((l, -h))  // start event
    events.add((r, h))   // end event
  sort events
  result = []
  maxHeap = {0}
  for each (x, h) in events:
    if h < 0: maxHeap.add(-h)
    else: maxHeap.remove(h)
    if maxHeap.max() changed:
      result.add([x, maxHeap.max()])
  return result`,
    python: `import heapq
def getSkyline(buildings):
    events = []
    for l, r, h in buildings:
        events.append((l, -h))
        events.append((r, h))
    events.sort()
    result, heap = [], [0]
    prev = 0
    for x, h in events:
        if h < 0:
            heapq.heappush(heap, h)
        else:
            heap.remove(-h)
            heapq.heapify(heap)
        cur = -heap[0]
        if cur != prev:
            result.append([x, cur])
            prev = cur
    return result`,
    javascript: `function getSkyline(buildings) {
  const events = [];
  for (const [l, r, h] of buildings) {
    events.push([l, -h]);
    events.push([r, h]);
  }
  events.sort((a, b) => a[0] !== b[0] ? a[0]-b[0] : a[1]-b[1]);
  const result = [];
  const active = [0];
  let prev = 0;
  for (const [x, h] of events) {
    if (h < 0) active.push(-h);
    else active.splice(active.indexOf(h), 1);
    active.sort((a,b)=>b-a);
    const cur = active[0];
    if (cur !== prev) { result.push([x, cur]); prev = cur; }
  }
  return result;
}`,
    java: `public List<List<Integer>> getSkyline(int[][] buildings) {
    List<int[]> events = new ArrayList<>();
    for (int[] b : buildings) {
        events.add(new int[]{b[0], -b[2]});
        events.add(new int[]{b[1], b[2]});
    }
    events.sort((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    List<List<Integer>> res = new ArrayList<>();
    TreeMap<Integer,Integer> active = new TreeMap<>();
    active.put(0, 1);
    int prev = 0;
    for (int[] e : events) {
        if (e[1] < 0) active.merge(-e[1], 1, Integer::sum);
        else { active.merge(e[1], -1, Integer::sum); if (active.get(e[1])==0) active.remove(e[1]); }
        int cur = active.lastKey();
        if (cur != prev) { res.add(Arrays.asList(e[0], cur)); prev = cur; }
    }
    return res;
}`,
  },
  defaultInput: { buildings: [2, 9, 10, 3, 7, 15, 5, 12, 12, 15, 20, 10, 19, 24, 8] },
  inputFields: [
    {
      name: 'buildings',
      label: 'Buildings (l,r,h triples flattened)',
      type: 'array',
      defaultValue: [2, 9, 10, 3, 7, 15, 5, 12, 12, 15, 20, 10, 19, 24, 8],
      placeholder: '2,9,10,3,7,15,...',
      helperText: 'Flattened [left,right,height] triples',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.buildings as number[];
    const steps: AlgorithmStep[] = [];
    const arr = [...flat];

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>, keyPoints: number): ArrayVisualization {
      return {
        type: 'array',
        array: arr,
        highlights,
        labels,
        auxData: {
          label: 'Skyline Problem',
          entries: [{ key: 'Key Points Found', value: String(keyPoints) }],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: 'Parse buildings as [left,right,height] triples. Create sweep line events for start/end of each building.',
      variables: { buildingCount: Math.floor(arr.length / 3) },
      visualization: makeViz({}, {}, 0),
    });

    const buildings: [number, number, number][] = [];
    for (let i = 0; i < arr.length - 2; i += 3) {
      buildings.push([arr[i], arr[i + 1], arr[i + 2]]);
    }

    const events: [number, number][] = [];
    for (const [l, r, h] of buildings) {
      events.push([l, -h]);
      events.push([r, h]);
    }
    events.sort((a, b) => a[0] !== b[0] ? a[0] - b[0] : a[1] - b[1]);

    const highlights: Record<number, string> = {};
    for (let i = 0; i < arr.length; i += 3) { highlights[i] = 'pointer'; highlights[i + 1] = 'active'; highlights[i + 2] = 'found'; }
    steps.push({
      line: 3,
      explanation: `Created ${events.length} sweep events. Each building generates a start (-height) and end (+height) event.`,
      variables: { eventCount: events.length },
      visualization: makeViz(highlights, {}, 0),
    });

    const active = [0];
    let prev = 0;
    let keyPoints = 0;

    for (let idx = 0; idx < events.length; idx++) {
      const [x, h] = events[idx];
      if (h < 0) {
        active.push(-h);
        active.sort((a, b) => b - a);
      } else {
        const pos = active.indexOf(h);
        if (pos !== -1) active.splice(pos, 1);
      }

      const cur = active[0] || 0;
      if (cur !== prev) {
        keyPoints++;
        prev = cur;
        const h2: Record<number, string> = {};
        const buildingIdx = idx % arr.length;
        h2[buildingIdx] = 'match';
        steps.push({
          line: 10,
          explanation: `Skyline changes at x=${x}: new height = ${cur}. Key point [${x}, ${cur}] added. Total key points: ${keyPoints}.`,
          variables: { x, newHeight: cur, activeMax: active[0] },
          visualization: makeViz(h2, { [buildingIdx]: `h=${cur}` }, keyPoints),
        });
      }
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < arr.length; i++) finalH[i] = 'sorted';
    steps.push({
      line: 14,
      explanation: `Skyline complete. Total key points in outline: ${keyPoints}.`,
      variables: { keyPoints },
      visualization: makeViz(finalH, {}, keyPoints),
    });

    return steps;
  },
};

export default skylineProblemIi;
