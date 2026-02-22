import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfOrdersInBacklog: AlgorithmDefinition = {
  id: 'number-of-orders-in-backlog',
  title: 'Number of Orders in the Backlog',
  leetcodeNumber: 1801,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Simulate a stock exchange backlog. Buy orders use a max heap (highest price first), sell orders use a min heap (lowest price first). Match overlapping buy and sell orders and return the total remaining backlog count modulo 10^9+7.',
  tags: ['heap', 'simulation', 'design'],

  code: {
    pseudocode: `function getNumberOfBacklogOrders(orders):
  buyHeap = max heap (price, amount)
  sellHeap = min heap (price, amount)
  for price, amount, type in orders:
    if type == 0 (buy):
      while sellHeap and sellHeap.min.price <= price and amount > 0:
        s_price, s_amount = peek sellHeap
        match = min(amount, s_amount)
        amount -= match; s_amount -= match
        update/pop sellHeap
      if amount > 0: push to buyHeap
    else (sell):
      while buyHeap and buyHeap.max.price >= price and amount > 0:
        b_price, b_amount = peek buyHeap
        match = min(amount, b_amount)
        amount -= match; b_amount -= match
        update/pop buyHeap
      if amount > 0: push to sellHeap
  return sum of all remaining amounts % (10^9 + 7)`,

    python: `import heapq

def getNumberOfBacklogOrders(orders):
    buy, sell = [], []  # max-heap (neg), min-heap
    for price, amount, type_ in orders:
        if type_ == 0:
            while sell and sell[0][0] <= price and amount:
                sp, sa = heapq.heappop(sell)
                match = min(amount, sa)
                amount -= match; sa -= match
                if sa: heapq.heappush(sell, (sp, sa))
            if amount: heapq.heappush(buy, (-price, amount))
        else:
            while buy and -buy[0][0] >= price and amount:
                bp, ba = heapq.heappop(buy)
                match = min(amount, ba)
                amount -= match; ba -= match
                if ba: heapq.heappush(buy, (bp, ba))
            if amount: heapq.heappush(sell, (price, amount))
    MOD = 10**9 + 7
    return sum(a for _, a in buy + sell) % MOD`,

    javascript: `function getNumberOfBacklogOrders(orders) {
  let buy = [], sell = []; // simulated heaps
  const MOD = 1e9 + 7;
  for (const [price, amount, type] of orders) {
    let amt = amount;
    if (type === 0) {
      sell.sort((a,b)=>a[0]-b[0]);
      while (sell.length && sell[0][0] <= price && amt > 0) {
        const match = Math.min(amt, sell[0][1]);
        amt -= match; sell[0][1] -= match;
        if (!sell[0][1]) sell.shift();
      }
      if (amt > 0) buy.push([price, amt]);
    } else {
      buy.sort((a,b)=>b[0]-a[0]);
      while (buy.length && buy[0][0] >= price && amt > 0) {
        const match = Math.min(amt, buy[0][1]);
        amt -= match; buy[0][1] -= match;
        if (!buy[0][1]) buy.shift();
      }
      if (amt > 0) sell.push([price, amt]);
    }
  }
  return ([...buy, ...sell].reduce((s,[,a])=>s+a,0)) % MOD;
}`,

    java: `public int getNumberOfBacklogOrders(int[][] orders) {
    PriorityQueue<int[]> buy = new PriorityQueue<>((a,b)->b[0]-a[0]);
    PriorityQueue<int[]> sell = new PriorityQueue<>((a,b)->a[0]-b[0]);
    for (int[] o : orders) {
        int price = o[0], amount = o[1], type = o[2];
        if (type == 0) {
            while (!sell.isEmpty() && sell.peek()[0] <= price && amount > 0) {
                int match = Math.min(amount, sell.peek()[1]);
                amount -= match; sell.peek()[1] -= match;
                if (sell.peek()[1] == 0) sell.poll();
            }
            if (amount > 0) buy.offer(new int[]{price, amount});
        } else {
            while (!buy.isEmpty() && buy.peek()[0] >= price && amount > 0) {
                int match = Math.min(amount, buy.peek()[1]);
                amount -= match; buy.peek()[1] -= match;
                if (buy.peek()[1] == 0) buy.poll();
            }
            if (amount > 0) sell.offer(new int[]{price, amount});
        }
    }
    int res = 0, MOD = 1_000_000_007;
    for (int[] e : buy) res = (res + e[1]) % MOD;
    for (int[] e : sell) res = (res + e[1]) % MOD;
    return res;
}`,
  },

  defaultInput: {
    orders: [10, 5, 0, 15, 2, 1, 25, 1, 1, 30, 4, 0],
  },

  inputFields: [
    {
      name: 'orders',
      label: 'Orders (price,amount,type triplets)',
      type: 'array',
      defaultValue: [10, 5, 0, 15, 2, 1, 25, 1, 1, 30, 4, 0],
      placeholder: '10,5,0,15,2,1,25,1,1,30,4,0',
      helperText: 'Triplets of price,amount,type (0=buy,1=sell)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.orders as number[];
    const steps: AlgorithmStep[] = [];
    const MOD = 1_000_000_007;

    const orders: [number, number, number][] = [];
    for (let i = 0; i + 2 < flat.length; i += 3) {
      orders.push([flat[i], flat[i + 1], flat[i + 2]]);
    }

    let buy: [number, number][] = [];
    let sell: [number, number][] = [];

    steps.push({
      line: 1,
      explanation: `Process ${orders.length} orders. Buy=max heap, Sell=min heap.`,
      variables: { orderCount: orders.length },
      visualization: {
        type: 'array',
        array: orders.map(([p]) => p),
        highlights: {},
        labels: Object.fromEntries(orders.map(([p, a, t], i) => [i, `p${p}a${a}${t === 0 ? 'B' : 'S'}`])),
      } as ArrayVisualization,
    });

    for (let oi = 0; oi < orders.length; oi++) {
      let [price, amount, type] = orders[oi];

      if (type === 0) {
        // Buy order
        sell.sort((a, b) => a[0] - b[0]);
        let matched = 0;
        while (sell.length && sell[0][0] <= price && amount > 0) {
          const match = Math.min(amount, sell[0][1]);
          amount -= match;
          sell[0][1] -= match;
          matched += match;
          if (sell[0][1] === 0) sell.shift();
        }
        if (amount > 0) buy.push([price, amount]);
        buy.sort((a, b) => b[0] - a[0]);

        steps.push({
          line: 5,
          explanation: `Buy order: price=${price}, amount=${orders[oi][1]}. Matched ${matched} with sell orders. Remaining buy=${amount}. Buy backlog: ${buy.length} entries, Sell backlog: ${sell.length} entries.`,
          variables: { price, matched, remaining: amount, buySize: buy.length, sellSize: sell.length },
          visualization: {
            type: 'array',
            array: [...buy.map(([p, a]) => a), ...sell.map(([p, a]) => -a)],
            highlights: Object.fromEntries(buy.map((_, i) => [i, 'active'])),
            labels: { 0: buy.length ? `buyTop=${buy[0][0]}` : 'empty' },
          } as ArrayVisualization,
        });
      } else {
        // Sell order
        buy.sort((a, b) => b[0] - a[0]);
        let matched = 0;
        while (buy.length && buy[0][0] >= price && amount > 0) {
          const match = Math.min(amount, buy[0][1]);
          amount -= match;
          buy[0][1] -= match;
          matched += match;
          if (buy[0][1] === 0) buy.shift();
        }
        if (amount > 0) sell.push([price, amount]);
        sell.sort((a, b) => a[0] - b[0]);

        steps.push({
          line: 11,
          explanation: `Sell order: price=${price}, amount=${orders[oi][1]}. Matched ${matched} with buy orders. Remaining sell=${amount}. Buy backlog: ${buy.length} entries, Sell backlog: ${sell.length} entries.`,
          variables: { price, matched, remaining: amount, buySize: buy.length, sellSize: sell.length },
          visualization: {
            type: 'array',
            array: [...buy.map(([p, a]) => a), ...sell.map(([p, a]) => -a)],
            highlights: Object.fromEntries(sell.map((_, i) => [buy.length + i, 'comparing'])),
            labels: { 0: sell.length ? `sellTop=${sell[0][0]}` : 'empty' },
          } as ArrayVisualization,
        });
      }
    }

    const total = ([...buy, ...sell].reduce((s, [, a]) => s + a, 0)) % MOD;

    steps.push({
      line: 15,
      explanation: `Done. Remaining backlog orders: ${total} (mod 10^9+7). Buy entries: ${buy.length}, Sell entries: ${sell.length}.`,
      variables: { result: total, buyEntries: buy.length, sellEntries: sell.length },
      visualization: {
        type: 'array',
        array: [total],
        highlights: { 0: 'found' },
        labels: { 0: `backlog=${total}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default numberOfOrdersInBacklog;
