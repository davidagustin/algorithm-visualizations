import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const cheapestFlightsKStops: AlgorithmDefinition = {
  id: 'cheapest-flights-k-stops',
  title: 'Cheapest Flights Within K Stops',
  leetcodeNumber: 787,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given n cities connected by flights [from, to, price] and k stops limit, find the cheapest price from src to dst with at most k stops. Uses Bellman-Ford modified to relax edges over k+1 iterations, limiting stops per relaxation round.',
  tags: ['Graph', 'Bellman-Ford', 'BFS', 'Dynamic Programming'],
  code: {
    pseudocode: `function findCheapestPrice(n, flights, src, dst, k):
  prices = [INF] * n
  prices[src] = 0
  for i from 0 to k:
    tempPrices = prices[:]
    for (u, v, price) in flights:
      if prices[u] != INF:
        tempPrices[v] = min(tempPrices[v], prices[u] + price)
    prices = tempPrices
  return prices[dst] if prices[dst] != INF else -1`,
    python: `def findCheapestPrice(n, flights, src, dst, k):
    prices = [float('inf')] * n
    prices[src] = 0
    for _ in range(k + 1):
        temp = prices[:]
        for u, v, price in flights:
            if prices[u] != float('inf'):
                temp[v] = min(temp[v], prices[u] + price)
        prices = temp
    return prices[dst] if prices[dst] != float('inf') else -1`,
    javascript: `function findCheapestPrice(n, flights, src, dst, k) {
  let prices = new Array(n).fill(Infinity);
  prices[src] = 0;
  for (let i = 0; i <= k; i++) {
    const temp = [...prices];
    for (const [u, v, price] of flights) {
      if (prices[u] !== Infinity)
        temp[v] = Math.min(temp[v], prices[u] + price);
    }
    prices = temp;
  }
  return prices[dst] === Infinity ? -1 : prices[dst];
}`,
    java: `public int findCheapestPrice(int n, int[][] flights, int src, int dst, int k) {
    int[] prices = new int[n];
    Arrays.fill(prices, Integer.MAX_VALUE);
    prices[src] = 0;
    for (int i = 0; i <= k; i++) {
        int[] temp = Arrays.copyOf(prices, n);
        for (int[] f : flights)
            if (prices[f[0]] != Integer.MAX_VALUE && prices[f[0]] + f[2] < temp[f[1]])
                temp[f[1]] = prices[f[0]] + f[2];
        prices = temp;
    }
    return prices[dst] == Integer.MAX_VALUE ? -1 : prices[dst];
}`,
  },
  defaultInput: {
    n: 4,
    flights: [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]],
    src: 0,
    dst: 3,
    k: 1,
  },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Cities',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Cities labeled 0 to n-1',
    },
    {
      name: 'flights',
      label: 'Flights [from, to, price]',
      type: 'array',
      defaultValue: [[0, 1, 100], [1, 2, 100], [2, 0, 100], [1, 3, 600], [2, 3, 200]],
      placeholder: '[[0,1,100],[1,2,100],[1,3,600]]',
      helperText: 'Each flight: [from, to, price]',
    },
    {
      name: 'src',
      label: 'Source City',
      type: 'number',
      defaultValue: 0,
      placeholder: '0',
    },
    {
      name: 'dst',
      label: 'Destination City',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
    },
    {
      name: 'k',
      label: 'Max Stops (k)',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'At most k intermediate stops',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const flights = input.flights as number[][];
    const src = input.src as number;
    const dst = input.dst as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const INF = Infinity;

    let prices = new Array(n).fill(INF);
    prices[src] = 0;

    function makeViz(
      highlights: Record<number, string>,
      round: number,
      lastEdge: [number, number, number] | null
    ): ArrayVisualization {
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `c${i}:${prices[i] === INF ? 'INF' : prices[i]}`;
      }
      return {
        type: 'array',
        array: prices.map(p => p === INF ? -1 : p),
        highlights,
        labels,
        auxData: {
          label: 'Bellman-Ford State',
          entries: [
            { key: 'Round (stops used)', value: `${round} / ${k + 1}` },
            { key: 'Relaxing edge', value: lastEdge ? `${lastEdge[0]}→${lastEdge[1]} ($${lastEdge[2]})` : 'N/A' },
            { key: 'Best price to dst', value: prices[dst] === INF ? 'INF' : String(prices[dst]) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Find cheapest flight from ${src} to ${dst} with at most ${k} stops. Init: prices[${src}]=0, all others=INF. Run ${k + 1} Bellman-Ford rounds.`,
      variables: { src, dst, k, prices: [...prices] },
      visualization: makeViz({ [src]: 'active', [dst]: 'pointer' }, 0, null),
    });

    for (let round = 0; round <= k; round++) {
      const temp = [...prices];

      steps.push({
        line: 3,
        explanation: `Round ${round + 1} of ${k + 1} (allows ${round} stop${round !== 1 ? 's' : ''}). Using snapshot of prices to avoid using same-round updates.`,
        variables: { round },
        visualization: makeViz({ [src]: 'found', [dst]: 'pointer' }, round, null),
      });

      for (const [u, v, price] of flights) {
        if (prices[u] !== INF) {
          const newCost = prices[u] + price;
          if (newCost < temp[v]) {
            temp[v] = newCost;
            const hl: Record<number, string> = { [u]: 'active', [v]: 'comparing' };
            if (prices[src] !== INF) hl[src] = 'found';
            if (prices[dst] !== INF) hl[dst] = 'found';
            steps.push({
              line: 6,
              explanation: `Relax edge ${u}→${v} ($${price}): prices[${u}](${prices[u]}) + ${price} = ${newCost} < current temp[${v}](${temp[v] === newCost ? 'INF' : temp[v]}). Update!`,
              variables: { u, v, price, newCost, oldCost: temp[v] === newCost ? INF : temp[v] },
              visualization: makeViz(hl, round, [u, v, price]),
            });
          }
        }
      }

      prices = temp;
    }

    const result = prices[dst] === INF ? -1 : prices[dst];
    const finalHL: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      finalHL[i] = prices[i] === INF ? 'mismatch' : 'found';
    }
    finalHL[src] = 'active';
    finalHL[dst] = 'found';

    steps.push({
      line: 8,
      explanation: result === -1
        ? `No path from ${src} to ${dst} within ${k} stops. Return -1.`
        : `Cheapest price from ${src} to ${dst} with ≤${k} stop(s): $${result}.`,
      variables: { result, prices: [...prices] },
      visualization: makeViz(finalHL, k + 1, null),
    });

    return steps;
  },
};

export default cheapestFlightsKStops;
