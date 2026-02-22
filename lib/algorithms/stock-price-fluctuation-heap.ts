import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stockPriceFluctuationHeap: AlgorithmDefinition = {
  id: 'stock-price-fluctuation-heap',
  title: 'Stock Price Fluctuation (Heap)',
  leetcodeNumber: 2034,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Design a stock price tracker that supports updating price at a timestamp, and querying the current price, maximum price, and minimum price. Use a hash map for timestamp -> price, and two heaps (max and min) with lazy deletion for max/min queries.',
  tags: ['heap', 'design', 'hash map', 'lazy deletion'],

  code: {
    pseudocode: `class StockPrice:
  prices = {}   // timestamp -> price
  maxTime = 0
  maxHeap = max heap of (-price, timestamp)
  minHeap = min heap of (price, timestamp)

  update(time, price):
    prices[time] = price
    maxTime = max(maxTime, time)
    push (-price, time) to maxHeap
    push (price, time) to minHeap

  current():
    return prices[maxTime]

  maximum():
    while maxHeap top is stale: pop
    return -maxHeap.top.price

  minimum():
    while minHeap top is stale: pop
    return minHeap.top.price`,

    python: `import heapq

class StockPrice:
    def __init__(self):
        self.prices = {}
        self.max_time = 0
        self.max_heap = []
        self.min_heap = []

    def update(self, timestamp: int, price: int) -> None:
        self.prices[timestamp] = price
        self.max_time = max(self.max_time, timestamp)
        heapq.heappush(self.max_heap, (-price, timestamp))
        heapq.heappush(self.min_heap, (price, timestamp))

    def current(self) -> int:
        return self.prices[self.max_time]

    def maximum(self) -> int:
        while -self.max_heap[0][0] != self.prices.get(self.max_heap[0][1], None):
            heapq.heappop(self.max_heap)
        return -self.max_heap[0][0]

    def minimum(self) -> int:
        while self.min_heap[0][0] != self.prices.get(self.min_heap[0][1], None):
            heapq.heappop(self.min_heap)
        return self.min_heap[0][0]`,

    javascript: `class StockPrice {
  constructor() {
    this.prices = {};
    this.maxTime = 0;
    this.maxHeap = []; // [-price, time]
    this.minHeap = []; // [price, time]
  }
  update(time, price) {
    this.prices[time] = price;
    this.maxTime = Math.max(this.maxTime, time);
    this.maxHeap.push([-price, time]);
    this.minHeap.push([price, time]);
  }
  current() { return this.prices[this.maxTime]; }
  maximum() {
    this.maxHeap.sort((a,b)=>a[0]-b[0]);
    while (-this.maxHeap[0][0] !== this.prices[this.maxHeap[0][1]])
      this.maxHeap.shift();
    return -this.maxHeap[0][0];
  }
  minimum() {
    this.minHeap.sort((a,b)=>a[0]-b[0]);
    while (this.minHeap[0][0] !== this.prices[this.minHeap[0][1]])
      this.minHeap.shift();
    return this.minHeap[0][0];
  }
}`,

    java: `class StockPrice {
    Map<Integer,Integer> prices = new HashMap<>();
    int maxTime = 0;
    PriorityQueue<int[]> maxH = new PriorityQueue<>((a,b)->b[0]-a[0]);
    PriorityQueue<int[]> minH = new PriorityQueue<>((a,b)->a[0]-b[0]);
    public void update(int t, int p) {
        prices.put(t,p); maxTime=Math.max(maxTime,t);
        maxH.offer(new int[]{p,t}); minH.offer(new int[]{p,t});
    }
    public int current() { return prices.get(maxTime); }
    public int maximum() {
        while (maxH.peek()[0]!=prices.get(maxH.peek()[1])) maxH.poll();
        return maxH.peek()[0];
    }
    public int minimum() {
        while (minH.peek()[0]!=prices.get(minH.peek()[1])) minH.poll();
        return minH.peek()[0];
    }
}`,
  },

  defaultInput: {
    operations: [1, 1, 1, 2, 3, 4, 1, 2, 3, 4],
    times: [1, 2, 1, 0, 0, 0, 3, 0, 0, 0],
    prices: [10, 5, 8, 0, 0, 0, 15, 0, 0, 0],
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations (1=update,2=current,3=max,4=min)',
      type: 'array',
      defaultValue: [1, 1, 1, 2, 3, 4, 1, 2, 3, 4],
      placeholder: '1,1,1,2,3,4,1,2,3,4',
      helperText: '1=update, 2=current, 3=maximum, 4=minimum',
    },
    {
      name: 'times',
      label: 'Timestamps (for update)',
      type: 'array',
      defaultValue: [1, 2, 1, 0, 0, 0, 3, 0, 0, 0],
      placeholder: '1,2,1,0,0,0,3,0,0,0',
      helperText: 'Timestamp for update operations',
    },
    {
      name: 'prices',
      label: 'Prices (for update)',
      type: 'array',
      defaultValue: [10, 5, 8, 0, 0, 0, 15, 0, 0, 0],
      placeholder: '10,5,8,0,0,0,15,0,0,0',
      helperText: 'Price for update operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const operations = input.operations as number[];
    const times = input.times as number[];
    const pricesInput = input.prices as number[];
    const steps: AlgorithmStep[] = [];

    const pricesMap: Record<number, number> = {};
    let maxTime = 0;
    let maxHeap: [number, number][] = [];
    let minHeap: [number, number][] = [];

    steps.push({
      line: 1,
      explanation: 'Initialize StockPrice: empty prices map, two lazy-deletion heaps.',
      variables: { pricesCount: 0, maxTime: 0 },
      visualization: {
        type: 'array',
        array: [0],
        highlights: {},
        labels: { 0: 'empty' },
      } as ArrayVisualization,
    });

    for (let oi = 0; oi < operations.length; oi++) {
      const op = operations[oi];
      const t = times[oi];
      const p = pricesInput[oi];

      if (op === 1) {
        // update
        pricesMap[t] = p;
        maxTime = Math.max(maxTime, t);
        maxHeap.push([-p, t]);
        minHeap.push([p, t]);
        maxHeap.sort((a, b) => a[0] - b[0]);
        minHeap.sort((a, b) => a[0] - b[0]);
        const allPrices = Object.values(pricesMap);

        steps.push({
          line: 7,
          explanation: `update(${t}, ${p}): Set price at timestamp ${t} = ${p}. MaxTime=${maxTime}. Prices: ${JSON.stringify(pricesMap)}`,
          variables: { timestamp: t, price: p, maxTime },
          visualization: {
            type: 'array',
            array: allPrices,
            highlights: Object.fromEntries([[allPrices.length - 1, 'active']]),
            labels: Object.fromEntries(Object.entries(pricesMap).map(([k, v], i) => [i, `t${k}=${v}`])),
          } as ArrayVisualization,
        });
      } else if (op === 2) {
        // current
        const cur = pricesMap[maxTime];
        steps.push({
          line: 11,
          explanation: `current(): Return price at maxTime=${maxTime} -> ${cur}`,
          variables: { maxTime, current: cur },
          visualization: {
            type: 'array',
            array: Object.values(pricesMap),
            highlights: {},
            labels: { 0: `current=${cur}` },
          } as ArrayVisualization,
        });
      } else if (op === 3) {
        // maximum
        while (maxHeap.length > 0 && -maxHeap[0][0] !== pricesMap[maxHeap[0][1]]) {
          maxHeap.shift();
        }
        const maxVal = maxHeap.length > 0 ? -maxHeap[0][0] : 0;
        steps.push({
          line: 14,
          explanation: `maximum(): Evict stale entries from max heap. Current max price = ${maxVal}`,
          variables: { maximum: maxVal, heapSize: maxHeap.length },
          visualization: {
            type: 'array',
            array: maxHeap.map(([neg]) => -neg),
            highlights: { 0: 'found' },
            labels: { 0: `max=${maxVal}` },
          } as ArrayVisualization,
        });
      } else if (op === 4) {
        // minimum
        while (minHeap.length > 0 && minHeap[0][0] !== pricesMap[minHeap[0][1]]) {
          minHeap.shift();
        }
        const minVal = minHeap.length > 0 ? minHeap[0][0] : 0;
        steps.push({
          line: 17,
          explanation: `minimum(): Evict stale entries from min heap. Current min price = ${minVal}`,
          variables: { minimum: minVal, heapSize: minHeap.length },
          visualization: {
            type: 'array',
            array: minHeap.map(([v]) => v),
            highlights: { 0: 'found' },
            labels: { 0: `min=${minVal}` },
          } as ArrayVisualization,
        });
      }
    }

    return steps;
  },
};

export default stockPriceFluctuationHeap;
