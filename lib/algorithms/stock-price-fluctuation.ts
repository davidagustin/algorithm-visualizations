import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const stockPriceFluctuation: AlgorithmDefinition = {
  id: 'stock-price-fluctuation',
  title: 'Stock Price Fluctuation',
  leetcodeNumber: 2034,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'Design a data structure that tracks stock prices at timestamps. Support update(timestamp, price), current() returning the latest price, maximum() and minimum() returning global max/min. Use a hash map for timestamp-to-price and two sorted multisets (simulated) for max and min queries.',
  tags: ['design', 'hash map', 'sorted set', 'data structure'],

  code: {
    pseudocode: `class StockPrice:
  priceMap = {}    // timestamp -> price
  maxTime = 0
  prices = SortedList()

  function update(timestamp, price):
    if timestamp in priceMap:
      prices.remove(priceMap[timestamp])
    priceMap[timestamp] = price
    prices.add(price)
    maxTime = max(maxTime, timestamp)

  function current():
    return priceMap[maxTime]

  function maximum():
    return prices[-1]

  function minimum():
    return prices[0]`,

    python: `from sortedcontainers import SortedList

class StockPrice:
    def __init__(self):
        self.price_map = {}
        self.prices = SortedList()
        self.max_time = 0

    def update(self, timestamp: int, price: int) -> None:
        if timestamp in self.price_map:
            self.prices.remove(self.price_map[timestamp])
        self.price_map[timestamp] = price
        self.prices.add(price)
        self.max_time = max(self.max_time, timestamp)

    def current(self) -> int:
        return self.price_map[self.max_time]

    def maximum(self) -> int:
        return self.prices[-1]

    def minimum(self) -> int:
        return self.prices[0]`,

    javascript: `class StockPrice {
  constructor() {
    this.priceMap = new Map();
    this.prices = [];
    this.maxTime = 0;
  }
  update(timestamp, price) {
    if (this.priceMap.has(timestamp)) {
      const old = this.priceMap.get(timestamp);
      const idx = this.prices.indexOf(old);
      if (idx !== -1) this.prices.splice(idx, 1);
    }
    this.priceMap.set(timestamp, price);
    this.prices.push(price);
    this.prices.sort((a, b) => a - b);
    this.maxTime = Math.max(this.maxTime, timestamp);
  }
  current() { return this.priceMap.get(this.maxTime); }
  maximum() { return this.prices[this.prices.length - 1]; }
  minimum() { return this.prices[0]; }
}`,

    java: `class StockPrice {
    Map<Integer, Integer> priceMap = new HashMap<>();
    TreeMap<Integer, Integer> prices = new TreeMap<>();
    int maxTime = 0;

    public void update(int timestamp, int price) {
        if (priceMap.containsKey(timestamp)) {
            int old = priceMap.get(timestamp);
            prices.put(old, prices.get(old) - 1);
            if (prices.get(old) == 0) prices.remove(old);
        }
        priceMap.put(timestamp, price);
        prices.merge(price, 1, Integer::sum);
        maxTime = Math.max(maxTime, timestamp);
    }
    public int current() { return priceMap.get(maxTime); }
    public int maximum() { return prices.lastKey(); }
    public int minimum() { return prices.firstKey(); }
}`,
  },

  defaultInput: {
    operations: 'update 1 10, update 2 5, current, update 1 3, maximum, minimum, current',
  },

  inputFields: [
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'update 1 10, update 2 5, current, update 1 3, maximum, minimum, current',
      placeholder: 'update 1 10, current, maximum, minimum',
      helperText: 'Comma-separated: update T P, current, maximum, minimum',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const opsStr = input.operations as string;
    const operations = opsStr.split(',').map(op => op.trim());
    const steps: AlgorithmStep[] = [];
    const priceMap = new Map<number, number>();
    const prices: number[] = [];
    let maxTime = 0;
    const displayStack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...displayStack],
      inputChars: operations,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: 'Initialize StockPrice: empty priceMap and price list.',
      variables: { priceMap: {}, prices: [], maxTime: 0 },
      visualization: makeViz(-1, 'idle'),
    });

    for (let i = 0; i < operations.length; i++) {
      const parts = operations[i].split(/\s+/);
      const cmd = parts[0];

      if (cmd === 'update') {
        const ts = Number(parts[1]);
        const price = Number(parts[2]);

        if (priceMap.has(ts)) {
          const old = priceMap.get(ts)!;
          const idx = prices.indexOf(old);
          if (idx !== -1) prices.splice(idx, 1);
          displayStack.push(`update(${ts},${price}): replaced ${old}`);
        } else {
          displayStack.push(`update(${ts},${price})`);
        }

        priceMap.set(ts, price);
        prices.push(price);
        prices.sort((a, b) => a - b);
        maxTime = Math.max(maxTime, ts);

        steps.push({
          line: 6,
          explanation: `update(${ts}, ${price}): Set price at t=${ts} to ${price}. maxTime=${maxTime}. Prices sorted: [${prices.join(', ')}].`,
          variables: { timestamp: ts, price, maxTime, prices: [...prices] },
          visualization: makeViz(i, 'push'),
        });
      } else if (cmd === 'current') {
        const result = priceMap.get(maxTime)!;
        displayStack.push(`current()=${result}`);
        steps.push({
          line: 12,
          explanation: `current(): Latest timestamp=${maxTime}, price=${result}.`,
          variables: { result, maxTime },
          visualization: makeViz(i, 'match'),
        });
      } else if (cmd === 'maximum') {
        const result = prices[prices.length - 1];
        displayStack.push(`maximum()=${result}`);
        steps.push({
          line: 14,
          explanation: `maximum(): Highest price = ${result}.`,
          variables: { result, prices: [...prices] },
          visualization: makeViz(i, 'match'),
        });
      } else if (cmd === 'minimum') {
        const result = prices[0];
        displayStack.push(`minimum()=${result}`);
        steps.push({
          line: 16,
          explanation: `minimum(): Lowest price = ${result}.`,
          variables: { result, prices: [...prices] },
          visualization: makeViz(i, 'match'),
        });
      }
    }

    steps.push({
      line: 17,
      explanation: 'All operations complete.',
      variables: { maxTime, priceCount: prices.length },
      visualization: makeViz(operations.length, 'idle'),
    });

    return steps;
  },
};

export default stockPriceFluctuation;
