import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const smallestNumberInInfiniteSet: AlgorithmDefinition = {
  id: 'smallest-number-in-infinite-set',
  title: 'Smallest Number in Infinite Set',
  leetcodeNumber: 2336,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Design a data structure that initially contains all positive integers. Support popSmallest (remove and return the smallest) and addBack (add a number back if not present). Use a min heap for added-back numbers and a pointer for the infinite sequence.',
  tags: ['heap', 'design', 'hash set'],

  code: {
    pseudocode: `class SmallestInfiniteSet:
  curr = 1        // next from infinite stream
  heap = min heap // added-back numbers
  inHeap = set    // to avoid duplicates

  popSmallest():
    if heap not empty and heap.min < curr:
      val = pop heap; inHeap.remove(val)
      return val
    curr += 1
    return curr - 1

  addBack(num):
    if num < curr and num not in inHeap:
      push num to heap; inHeap.add(num)`,

    python: `import heapq

class SmallestInfiniteSet:
    def __init__(self):
        self.curr = 1
        self.heap = []
        self.in_heap = set()

    def popSmallest(self) -> int:
        if self.heap and self.heap[0] < self.curr:
            val = heapq.heappop(self.heap)
            self.in_heap.discard(val)
            return val
        self.curr += 1
        return self.curr - 1

    def addBack(self, num: int) -> None:
        if num < self.curr and num not in self.in_heap:
            heapq.heappush(self.heap, num)
            self.in_heap.add(num)`,

    javascript: `class SmallestInfiniteSet {
  constructor() {
    this.curr = 1;
    this.heap = [];
    this.inHeap = new Set();
  }
  popSmallest() {
    if (this.heap.length && this.heap[0] < this.curr) {
      const val = this.heap.shift();
      this.inHeap.delete(val);
      return val;
    }
    return this.curr++;
  }
  addBack(num) {
    if (num < this.curr && !this.inHeap.has(num)) {
      this.heap.push(num);
      this.heap.sort((a,b)=>a-b);
      this.inHeap.add(num);
    }
  }
}`,

    java: `class SmallestInfiniteSet {
    private int curr = 1;
    private PriorityQueue<Integer> heap = new PriorityQueue<>();
    private Set<Integer> inHeap = new HashSet<>();

    public int popSmallest() {
        if (!heap.isEmpty() && heap.peek() < curr) {
            int val = heap.poll();
            inHeap.remove(val);
            return val;
        }
        return curr++;
    }

    public void addBack(int num) {
        if (num < curr && !inHeap.contains(num)) {
            heap.offer(num);
            inHeap.add(num);
        }
    }
}`,
  },

  defaultInput: {
    operations: [1, 0, 1, 0, 1, 2, 1, 0, 1, 0],
    values: [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations (0=pop, 1=pop, 2=addBack)',
      type: 'array',
      defaultValue: [1, 0, 1, 0, 1, 2, 1, 0, 1, 0],
      placeholder: '1,0,1,0,1,2,1,0,1,0',
      helperText: '0 or 1 = popSmallest, 2 = addBack',
    },
    {
      name: 'values',
      label: 'Values (for addBack operations)',
      type: 'array',
      defaultValue: [0, 0, 0, 0, 0, 2, 0, 0, 0, 0],
      placeholder: '0,0,0,0,0,2,0,0,0,0',
      helperText: 'Value used for addBack (ignored for pop)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as number[];
    const values = input.values as number[];
    const steps: AlgorithmStep[] = [];

    let curr = 1;
    let heap: number[] = [];
    const inHeap = new Set<number>();
    const results: number[] = [];

    steps.push({
      line: 1,
      explanation: 'Initialize: curr=1, heap empty. The set contains all positive integers 1,2,3,...',
      variables: { curr, heapSize: 0 },
      visualization: {
        type: 'array',
        array: [1, 2, 3, 4, 5],
        highlights: { 0: 'active' },
        labels: { 0: 'curr=1', 4: '...' },
      } as ArrayVisualization,
    });

    for (let oi = 0; oi < operations.length; oi++) {
      const op = operations[oi];
      const val = values[oi];

      if (op === 2) {
        // addBack
        if (val < curr && !inHeap.has(val)) {
          heap.push(val);
          heap.sort((a, b) => a - b);
          inHeap.add(val);
          steps.push({
            line: 12,
            explanation: `addBack(${val}): ${val} < curr(${curr}) and not in heap. Added to heap: [${heap.join(',')}]`,
            variables: { addBack: val, curr, heapSize: heap.length },
            visualization: {
              type: 'array',
              array: [...heap],
              highlights: Object.fromEntries([[heap.indexOf(val), 'found']]),
              labels: Object.fromEntries(heap.map((v, i) => [i, `${v}`])),
            } as ArrayVisualization,
          });
        } else {
          steps.push({
            line: 12,
            explanation: `addBack(${val}): Skipped (${val >= curr ? `>= curr(${curr})` : 'already in heap'}).`,
            variables: { addBack: val, curr, skipped: true },
            visualization: {
              type: 'array',
              array: heap.length > 0 ? [...heap] : [curr],
              highlights: {},
              labels: { 0: heap.length > 0 ? `heap[0]=${heap[0]}` : `curr=${curr}` },
            } as ArrayVisualization,
          });
        }
      } else {
        // popSmallest
        let popped: number;
        if (heap.length > 0 && heap[0] < curr) {
          popped = heap.shift()!;
          inHeap.delete(popped);
          steps.push({
            line: 5,
            explanation: `popSmallest: heap[0]=${popped} < curr=${curr}. Return ${popped} from heap. Heap: [${heap.join(',')}]`,
            variables: { popped, curr, heapSize: heap.length },
            visualization: {
              type: 'array',
              array: heap.length > 0 ? [...heap] : [curr],
              highlights: { 0: 'found' },
              labels: { 0: heap.length > 0 ? `${heap[0]}` : `curr=${curr}` },
            } as ArrayVisualization,
          });
        } else {
          popped = curr;
          curr++;
          steps.push({
            line: 8,
            explanation: `popSmallest: Heap empty or min >= curr. Return curr=${popped}. New curr=${curr}.`,
            variables: { popped, newCurr: curr },
            visualization: {
              type: 'array',
              array: [curr, curr + 1, curr + 2],
              highlights: { 0: 'active' },
              labels: { 0: `curr=${curr}` },
            } as ArrayVisualization,
          });
        }
        results.push(popped);
      }
    }

    steps.push({
      line: 14,
      explanation: `Operations complete. Pop results: [${results.join(', ')}]`,
      variables: { results: results.join(','), curr },
      visualization: {
        type: 'array',
        array: results,
        highlights: Object.fromEntries(results.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(results.map((v, i) => [i, `${v}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default smallestNumberInInfiniteSet;
