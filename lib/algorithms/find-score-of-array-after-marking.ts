import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findScoreOfArrayAfterMarking: AlgorithmDefinition = {
  id: 'find-score-of-array-after-marking',
  title: 'Find Score of an Array After Marking Elements',
  leetcodeNumber: 2593,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given an array, repeatedly pick the smallest unmarked element, add it to the score, and mark it along with its neighbors (adjacent elements). Use a min heap storing (value, index) to always get the smallest unmarked element efficiently.',
  tags: ['heap', 'greedy', 'array', 'simulation'],

  code: {
    pseudocode: `function findScore(nums):
  n = len(nums)
  minHeap = sorted (val, idx) pairs
  marked = boolean array of n
  score = 0
  while heap not empty:
    val, idx = pop min heap
    if marked[idx]: continue
    score += val
    marked[idx] = true
    if idx > 0: marked[idx-1] = true
    if idx < n-1: marked[idx+1] = true
  return score`,

    python: `import heapq

def findScore(nums: list[int]) -> int:
    n = len(nums)
    heap = [(num, i) for i, num in enumerate(nums)]
    heapq.heapify(heap)
    marked = [False] * n
    score = 0
    while heap:
        val, idx = heapq.heappop(heap)
        if marked[idx]:
            continue
        score += val
        marked[idx] = True
        if idx > 0: marked[idx-1] = True
        if idx < n-1: marked[idx+1] = True
    return score`,

    javascript: `function findScore(nums) {
  const n = nums.length;
  let heap = nums.map((v,i)=>[v,i]).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const marked = new Array(n).fill(false);
  let score = 0;
  while (heap.length) {
    const [val, idx] = heap.shift();
    if (marked[idx]) continue;
    score += val;
    marked[idx] = true;
    if (idx > 0) marked[idx-1] = true;
    if (idx < n-1) marked[idx+1] = true;
  }
  return score;
}`,

    java: `public long findScore(int[] nums) {
    int n = nums.length;
    PriorityQueue<int[]> heap = new PriorityQueue<>((a,b)->a[0]!=b[0]?a[0]-b[0]:a[1]-b[1]);
    for (int i = 0; i < n; i++) heap.offer(new int[]{nums[i], i});
    boolean[] marked = new boolean[n];
    long score = 0;
    while (!heap.isEmpty()) {
        int[] top = heap.poll();
        if (marked[top[1]]) continue;
        score += top[0];
        marked[top[1]] = true;
        if (top[1] > 0) marked[top[1]-1] = true;
        if (top[1] < n-1) marked[top[1]+1] = true;
    }
    return score;
}`,
  },

  defaultInput: {
    nums: [2, 1, 3, 4, 5, 2],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Array',
      type: 'array',
      defaultValue: [2, 1, 3, 4, 5, 2],
      placeholder: '2,1,3,4,5,2',
      helperText: 'Input array of positive integers',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const n = nums.length;
    const steps: AlgorithmStep[] = [];

    let heap = nums.map((v, i) => [v, i] as [number, number]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const marked = new Array(n).fill(false);
    let score = 0;

    steps.push({
      line: 1,
      explanation: `Initialize min heap with (value, index). Array: [${nums.join(', ')}]. Heap top: ${heap[0][0]} at index ${heap[0][1]}.`,
      variables: { n, heapTop: heap[0][0], heapTopIdx: heap[0][1] },
      visualization: {
        type: 'array',
        array: nums,
        highlights: { [heap[0][1]]: 'active' },
        labels: { [heap[0][1]]: `min=${heap[0][0]}` },
      } as ArrayVisualization,
    });

    while (heap.length > 0) {
      const [val, idx] = heap.shift()!;

      if (marked[idx]) {
        steps.push({
          line: 7,
          explanation: `Pop (${val}, idx=${idx}) but it is already marked. Skip.`,
          variables: { val, idx, score },
          visualization: {
            type: 'array',
            array: nums,
            highlights: {
              [idx]: 'mismatch',
              ...Object.fromEntries(marked.map((m, i) => m ? [i, 'sorted'] : [i, 'default'])),
            },
            labels: { [idx]: 'skip' },
          } as ArrayVisualization,
        });
        continue;
      }

      score += val;
      marked[idx] = true;
      const toMark = [idx];
      if (idx > 0) { marked[idx - 1] = true; toMark.push(idx - 1); }
      if (idx < n - 1) { marked[idx + 1] = true; toMark.push(idx + 1); }

      steps.push({
        line: 9,
        explanation: `Pick nums[${idx}]=${val}. score+=${val} => score=${score}. Mark indices: [${toMark.join(',')}].`,
        variables: { picked: val, idx, score, marked: toMark.join(',') },
        visualization: {
          type: 'array',
          array: nums,
          highlights: {
            [idx]: 'found',
            ...Object.fromEntries(toMark.filter(i => i !== idx).map(i => [i, 'mismatch'])),
            ...Object.fromEntries(marked.map((m, i) => !toMark.includes(i) && m ? [i, 'sorted'] : []).filter(Boolean) as [string, string][]),
          },
          labels: { [idx]: `+${val}` },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 12,
      explanation: `All elements processed. Final score: ${score}`,
      variables: { result: score },
      visualization: {
        type: 'array',
        array: nums,
        highlights: Object.fromEntries(marked.map((m, i) => [i, m ? 'sorted' : 'default'])),
        labels: { 0: `score=${score}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default findScoreOfArrayAfterMarking;
