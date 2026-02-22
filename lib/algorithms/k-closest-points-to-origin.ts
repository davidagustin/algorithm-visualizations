import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const kClosestPointsToOrigin: AlgorithmDefinition = {
  id: 'k-closest-points-to-origin',
  title: 'K Closest Points to Origin',
  leetcodeNumber: 973,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given a list of points on a plane, find the k closest points to the origin (0,0). Use a max-heap of size k. For each point, compute its squared Euclidean distance (x^2 + y^2). Push to heap; if heap exceeds k, pop the farthest. The remaining k points are the answer. No need to sort the result.',
  tags: ['heap', 'geometry', 'sorting', 'divide and conquer'],

  code: {
    pseudocode: `function kClosest(points, k):
  maxHeap = []  // (dist, x, y)

  for (x, y) in points:
    dist = x*x + y*y
    maxHeap.push((dist, x, y))
    if maxHeap.size > k:
      maxHeap.pop()  // remove farthest

  return [(x,y) for (_, x, y) in maxHeap]`,

    python: `import heapq

def kClosest(points: list[list[int]], k: int) -> list[list[int]]:
    heap = []
    for x, y in points:
        d = x*x + y*y
        heapq.heappush(heap, (-d, x, y))  # max-heap via negation
        if len(heap) > k:
            heapq.heappop(heap)
    return [[x, y] for _, x, y in heap]`,

    javascript: `function kClosest(points, k) {
  const heap = [];
  for (const [x, y] of points) {
    const d = x*x + y*y;
    heap.push([d, x, y]);
    heap.sort((a, b) => b[0] - a[0]); // max dist first
    if (heap.length > k) heap.shift();
  }
  return heap.map(([, x, y]) => [x, y]);
}`,

    java: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->b[0]-a[0]);
    for (int[] p : points) {
        pq.offer(new int[]{p[0]*p[0]+p[1]*p[1], p[0], p[1]});
        if (pq.size() > k) pq.poll();
    }
    int[][] res = new int[k][];
    int i = 0;
    while (!pq.isEmpty()) res[i++] = new int[]{pq.poll()[1], pq.poll()[2]};
    return res;
}`,
  },

  defaultInput: {
    nums: [1, 3, -2, 2, 5, 8, -1, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Points as [x1,y1,x2,y2,...] pairs',
      type: 'array',
      defaultValue: [1, 3, -2, 2, 5, 8, -1, 4],
      placeholder: '1,3,-2,2,5,8,-1,4',
      helperText: 'Pairs of x,y coordinates. k=2 closest points shown.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.nums as number[];
    const steps: AlgorithmStep[] = [];

    // Parse pairs
    const points: Array<[number, number]> = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      points.push([flat[i], flat[i + 1]]);
    }
    const k = 2;

    // max-heap: farthest first
    let heap: Array<[number, number, number]> = []; // [dist, x, y]

    steps.push({
      line: 1,
      explanation: `Find ${k} closest points to origin from ${points.length} points: [${points.map(([x, y]) => `(${x},${y})`).join(', ')}]. Use max-heap of size ${k}.`,
      variables: { k, pointCount: points.length },
      visualization: {
        type: 'array',
        array: points.map(([x, y]) => x * x + y * y),
        highlights: {},
        labels: points.reduce((acc: Record<number, string>, [x, y], i) => {
          acc[i] = `(${x},${y})`;
          return acc;
        }, {}),
      },
    });

    for (const [x, y] of points) {
      const dist = x * x + y * y;
      heap.push([dist, x, y]);
      heap.sort((a, b) => b[0] - a[0]); // max dist at front

      if (heap.length > k) {
        const removed = heap.shift()!;
        steps.push({
          line: 6,
          explanation: `Push (${x},${y}) dist=${dist}. Heap size ${heap.length + 1} > k=${k}. Remove farthest: (${removed[1]},${removed[2]}) dist=${removed[0]}. Heap: [${heap.map(h => `(${h[1]},${h[2]})d=${h[0]}`).join(', ')}].`,
          variables: { point: `(${x},${y})`, dist, removedPoint: `(${removed[1]},${removed[2]})`, removedDist: removed[0] },
          visualization: {
            type: 'array',
            array: heap.map(h => h[0]),
            highlights: {
              0: 'mismatch',
              [heap.length - 1]: 'active',
            },
            labels: heap.reduce((acc: Record<number, string>, h, i) => {
              acc[i] = `(${h[1]},${h[2]})`;
              return acc;
            }, {}),
          },
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Push (${x},${y}) with dist=${dist}. Heap size = ${heap.length} <= k=${k}. Heap: [${heap.map(h => `(${h[1]},${h[2]})d=${h[0]}`).join(', ')}].`,
          variables: { point: `(${x},${y})`, dist, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: heap.map(h => h[0]),
            highlights: { [heap.length - 1]: 'active' },
            labels: heap.reduce((acc: Record<number, string>, h, i) => {
              acc[i] = `(${h[1]},${h[2]})`;
              return acc;
            }, {}),
          },
        });
      }
    }

    const result = heap.map(([, x, y]) => [x, y]);
    steps.push({
      line: 9,
      explanation: `Done. The ${k} closest points to origin: ${result.map(([x, y]) => `(${x},${y}) dist=${x * x + y * y}`).join(', ')}.`,
      variables: { result: result.map(([x, y]) => `(${x},${y})`).join(', '), k },
      visualization: {
        type: 'array',
        array: heap.map(h => h[0]),
        highlights: heap.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: heap.reduce((acc: Record<number, string>, h, i) => {
          acc[i] = `(${h[1]},${h[2]})`;
          return acc;
        }, {}),
      },
    });

    return steps;
  },
};

export default kClosestPointsToOrigin;
