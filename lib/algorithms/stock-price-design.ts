import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const stockPriceDesign: AlgorithmDefinition = {
  id: 'stock-price-design',
  title: 'Stock Price Fluctuation',
  leetcodeNumber: 2034,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Design a class to track stock prices at different timestamps. Support update(timestamp, price), current(), maximum(), and minimum(). Use a hash map for timestamps and a sorted structure for min/max queries.',
  tags: ['Hash Map', 'Design', 'Heap', 'Sorted Set'],
  code: {
    pseudocode: `class StockPrice:
  function init():
    prices = {}  // timestamp -> price
    maxTs = 0
  function update(timestamp, price):
    prices[timestamp] = price
    if timestamp >= maxTs: maxTs = timestamp
  function current():
    return prices[maxTs]
  function maximum():
    return max(prices.values())
  function minimum():
    return min(prices.values())`,
    python: `from sortedcontainers import SortedList

class StockPrice:
    def __init__(self):
        self.prices = {}
        self.sorted_prices = SortedList()
        self.max_ts = 0

    def update(self, timestamp: int, price: int) -> None:
        if timestamp in self.prices:
            self.sorted_prices.remove(self.prices[timestamp])
        self.prices[timestamp] = price
        self.sorted_prices.add(price)
        if timestamp >= self.max_ts:
            self.max_ts = timestamp

    def current(self) -> int: return self.prices[self.max_ts]
    def maximum(self) -> int: return self.sorted_prices[-1]
    def minimum(self) -> int: return self.sorted_prices[0]`,
    javascript: `class StockPrice {
  constructor() {
    this.prices = new Map();
    this.maxTs = 0;
  }
  update(timestamp, price) {
    this.prices.set(timestamp, price);
    if (timestamp >= this.maxTs) this.maxTs = timestamp;
  }
  current() { return this.prices.get(this.maxTs); }
  maximum() { return Math.max(...this.prices.values()); }
  minimum() { return Math.min(...this.prices.values()); }
}`,
    java: `class StockPrice {
    Map<Integer, Integer> prices = new HashMap<>();
    TreeMap<Integer, Integer> sorted = new TreeMap<>();
    int maxTs = 0;
    public void update(int ts, int price) {
        if (prices.containsKey(ts)) { int old = prices.get(ts); sorted.put(old, sorted.get(old)-1); if (sorted.get(old)==0) sorted.remove(old); }
        prices.put(ts, price); sorted.merge(price, 1, Integer::sum);
        if (ts >= maxTs) maxTs = ts;
    }
    public int current() { return prices.get(maxTs); }
    public int maximum() { return sorted.lastKey(); }
    public int minimum() { return sorted.firstKey(); }
}`,
  },
  defaultInput: {
    operations: [['update', 1, 10], ['update', 2, 5], ['current'], ['maximum'], ['update', 1, 3], ['maximum'], ['minimum'], ['current']],
  },
  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'update 1 10, update 2 5, current, maximum, update 1 3, maximum, minimum, current',
      placeholder: 'update ts price, current, maximum, minimum',
      helperText: 'Comma-separated operations',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        if (parts.length === 3) return [parts[0], Number(parts[1]), Number(parts[2])];
        return [parts[0]];
      });
    }

    const steps: AlgorithmStep[] = [];
    const prices = new Map<number, number>();
    let maxTs = 0;

    function makeViz(activeTs: number, label: string): ArrayVisualization {
      const entries = Array.from(prices.entries()).sort((a, b) => a[0] - b[0]);
      const arr = entries.map(([, p]) => p);
      const highlights: Record<number, string> = {};
      const lbls: Record<number, string> = {};
      entries.forEach(([ts, ], i) => {
        highlights[i] = ts === activeTs ? 'active' : ts === maxTs ? 'found' : 'default';
        lbls[i] = `ts=${ts}`;
      });
      return {
        type: 'array',
        array: arr.length > 0 ? arr : [0],
        highlights,
        labels: lbls,
        auxData: {
          label: 'Stock Price',
          entries: [
            { key: 'Action', value: label },
            { key: 'Max timestamp', value: `${maxTs}` },
            { key: 'Current price', value: prices.size > 0 ? `${prices.get(maxTs)}` : 'N/A' },
            ...entries.map(([ts, p]) => ({ key: `ts=${ts}`, value: `price=${p}` })),
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: 'Initialize StockPrice.', variables: {}, visualization: makeViz(-1, 'Init') });

    for (const op of operations) {
      const opType = String(op[0]);

      if (opType === 'update') {
        const ts = Number(op[1]);
        const price = Number(op[2]);
        prices.set(ts, price);
        if (ts >= maxTs) maxTs = ts;
        steps.push({ line: 5, explanation: `update(${ts}, ${price}): Set price at timestamp ${ts} to ${price}. Current latest price: ${prices.get(maxTs)}.`, variables: { ts, price, maxTs }, visualization: makeViz(ts, `update(${ts},${price})`) });
      } else if (opType === 'current') {
        const result = prices.get(maxTs) ?? -1;
        steps.push({ line: 8, explanation: `current(): Return price at latest timestamp ${maxTs} = ${result}.`, variables: { maxTs, result }, visualization: makeViz(maxTs, `current() -> ${result}`) });
      } else if (opType === 'maximum') {
        const result = prices.size > 0 ? Math.max(...prices.values()) : -1;
        steps.push({ line: 10, explanation: `maximum(): Return maximum price across all timestamps = ${result}.`, variables: { result }, visualization: makeViz(-1, `maximum() -> ${result}`) });
      } else if (opType === 'minimum') {
        const result = prices.size > 0 ? Math.min(...prices.values()) : -1;
        steps.push({ line: 12, explanation: `minimum(): Return minimum price across all timestamps = ${result}.`, variables: { result }, visualization: makeViz(-1, `minimum() -> ${result}`) });
      }
    }

    steps.push({ line: 13, explanation: 'All operations complete.', variables: { priceCount: prices.size }, visualization: makeViz(-1, 'Complete') });

    return steps;
  },
};

export default stockPriceDesign;
