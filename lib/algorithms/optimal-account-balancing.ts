import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const optimalAccountBalancing: AlgorithmDefinition = {
  id: 'optimal-account-balancing',
  title: 'Optimal Account Balancing',
  leetcodeNumber: 465,
  difficulty: 'Hard',
  category: 'Dynamic Programming',
  description:
    'Given a list of transactions, find the minimum number of transactions to settle all debts. Compute net balance for each person. Those with positive balances are owed money, negative balances owe money. Use backtracking/bitmask DP to find the minimum number of transfers between creditors and debtors.',
  tags: ['dynamic programming', 'bitmask', 'backtracking', 'greedy'],

  code: {
    pseudocode: `function minTransfers(transactions):
  balance = {}
  for each (from, to, amount) in transactions:
    balance[from] -= amount
    balance[to] += amount
  debts = [b for b in balance.values() if b != 0]
  return dfs(debts, 0)

def dfs(debts, start):
  while start < len(debts) and debts[start] == 0: start++
  if start == len(debts): return 0
  result = infinity
  for i from start+1 to len(debts)-1:
    if debts[i] * debts[start] < 0:
      debts[i] += debts[start]
      result = min(result, 1 + dfs(debts, start+1))
      debts[i] -= debts[start]
  return result`,
    python: `def minTransfers(transactions):
    from collections import defaultdict
    balance = defaultdict(int)
    for u, v, amount in transactions:
        balance[u] -= amount
        balance[v] += amount
    debts = [b for b in balance.values() if b != 0]
    def dfs(start):
        while start < len(debts) and debts[start] == 0:
            start += 1
        if start == len(debts):
            return 0
        res = float('inf')
        for i in range(start + 1, len(debts)):
            if debts[i] * debts[start] < 0:
                debts[i] += debts[start]
                res = min(res, 1 + dfs(start + 1))
                debts[i] -= debts[start]
        return res
    return dfs(0)`,
    javascript: `function minTransfers(transactions) {
  const balance = new Map();
  for (const [u, v, amt] of transactions) {
    balance.set(u, (balance.get(u) || 0) - amt);
    balance.set(v, (balance.get(v) || 0) + amt);
  }
  const debts = [...balance.values()].filter(b => b !== 0);
  function dfs(start) {
    while (start < debts.length && debts[start] === 0) start++;
    if (start === debts.length) return 0;
    let res = Infinity;
    for (let i = start + 1; i < debts.length; i++) {
      if (debts[i] * debts[start] < 0) {
        debts[i] += debts[start];
        res = Math.min(res, 1 + dfs(start + 1));
        debts[i] -= debts[start];
      }
    }
    return res;
  }
  return dfs(0);
}`,
    java: `public int minTransfers(int[][] transactions) {
    Map<Integer,Integer> balance = new HashMap<>();
    for (int[] t: transactions) {
        balance.merge(t[0], -t[2], Integer::sum);
        balance.merge(t[1], t[2], Integer::sum);
    }
    List<Integer> debts = new ArrayList<>();
    for (int b: balance.values()) if (b != 0) debts.add(b);
    return dfs(debts, 0);
}
int dfs(List<Integer> debts, int start) {
    while (start < debts.size() && debts.get(start) == 0) start++;
    if (start == debts.size()) return 0;
    int res = Integer.MAX_VALUE;
    for (int i = start+1; i < debts.size(); i++) {
        if (debts.get(i)*debts.get(start) < 0) {
            debts.set(i, debts.get(i)+debts.get(start));
            res = Math.min(res, 1+dfs(debts, start+1));
            debts.set(i, debts.get(i)-debts.get(start));
        }
    }
    return res;
}`,
  },

  defaultInput: {
    transactions: [[0, 1, 10], [2, 0, 5]],
  },

  inputFields: [
    {
      name: 'transactions',
      label: 'Transactions (as flat array [from,to,amt,...])',
      type: 'array',
      defaultValue: [0, 1, 10, 2, 0, 5],
      placeholder: '0,1,10,2,0,5',
      helperText: 'Triplets: from, to, amount',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const raw = input.transactions;
    let transactions: number[][];
    if (Array.isArray(raw) && Array.isArray(raw[0])) {
      transactions = raw as number[][];
    } else {
      const flat = raw as number[];
      transactions = [];
      for (let i = 0; i < flat.length; i += 3) {
        transactions.push([flat[i], flat[i + 1], flat[i + 2]]);
      }
    }
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Optimal Account Balancing: ${transactions.length} transactions. Find minimum transfers to settle all debts.`,
      variables: { transactions: transactions.length },
      visualization: {
        type: 'array',
        array: transactions.map((t: number[]) => t[2]),
        highlights: {},
        labels: {},
      },
    });

    const balance = new Map<number, number>();
    for (const [u, v, amt] of transactions) {
      balance.set(u, (balance.get(u) || 0) - amt);
      balance.set(v, (balance.get(v) || 0) + amt);
    }

    const balArray = [...balance.entries()];
    steps.push({
      line: 4,
      explanation: `Net balances: ${balArray.map(([k, v]) => `person ${k}: ${v > 0 ? '+' : ''}${v}`).join(', ')}. Positive = owed money, negative = owes money.`,
      variables: Object.fromEntries(balArray.map(([k, v]) => [`person${k}`, v])),
      visualization: {
        type: 'array',
        array: balArray.map(([, v]: [number, number]) => v),
        highlights: Object.fromEntries(
          balArray.map(([, v], i) => [i, v > 0 ? 'found' : v < 0 ? 'mismatch' : 'active'])
        ),
        labels: Object.fromEntries(balArray.map(([k, v], i) => [i, `P${k}:${v}`])),
      },
    });

    const debts = [...balance.values()].filter((b) => b !== 0);
    steps.push({
      line: 6,
      explanation: `Non-zero balances (debts): [${debts.join(', ')}]. Use backtracking to find minimum transactions.`,
      variables: { debts: debts.join(',') },
      visualization: {
        type: 'array',
        array: [...debts],
        highlights: Object.fromEntries(debts.map((_, i) => [i, 'comparing'])),
        labels: Object.fromEntries(debts.map((v, i) => [i, `${v}`])),
      },
    });

    let callCount = 0;
    function dfs(start: number): number {
      while (start < debts.length && debts[start] === 0) start++;
      if (start === debts.length) return 0;
      callCount++;
      let res = Infinity;
      for (let i = start + 1; i < debts.length; i++) {
        if (debts[i] * debts[start] < 0) {
          debts[i] += debts[start];
          res = Math.min(res, 1 + dfs(start + 1));
          debts[i] -= debts[start];
        }
      }
      return res;
    }

    const result = dfs(0);

    steps.push({
      line: 9,
      explanation: `Backtracking explored ~${callCount} states. Minimum transactions to settle all debts = ${result}.`,
      variables: { result, debtors: debts.filter(d => d < 0).length, creditors: debts.filter(d => d > 0).length },
      visualization: {
        type: 'array',
        array: [...debts.map(() => 0)],
        highlights: Object.fromEntries(debts.map((_, i) => [i, 'sorted'])),
        labels: { 0: `min:${result}` },
      },
    });

    return steps;
  },
};

export default optimalAccountBalancing;
