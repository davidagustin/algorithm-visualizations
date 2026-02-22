import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const probabilityOfFairCoin: AlgorithmDefinition = {
  id: 'probability-of-fair-coin',
  title: 'Probability of Fair Coin',
  difficulty: 'Easy',
  category: 'Math',
  description:
    'Simulate flipping a fair coin n times. Track the running count of heads/tails and show how the empirical probability converges to 0.5 as n grows.',
  tags: ['Math', 'Probability', 'Simulation'],
  code: {
    pseudocode: `function coinFlips(n):
  heads = 0
  for i from 1 to n:
    flip = random(0 or 1)
    if flip == 1: heads++
    prob = heads / i
  return prob`,
    python: `import random
def coin_flips(n, seed=42):
    random.seed(seed)
    heads = 0
    for i in range(1, n + 1):
        if random.random() < 0.5:
            heads += 1
    return heads / n`,
    javascript: `function coinFlips(n) {
  let heads = 0;
  for (let i = 1; i <= n; i++) {
    if (Math.random() < 0.5) heads++;
  }
  return heads / n;
}`,
    java: `public double coinFlips(int n) {
    int heads = 0;
    Random rand = new Random(42);
    for (int i = 0; i < n; i++) {
        if (rand.nextBoolean()) heads++;
    }
    return (double) heads / n;
}`,
  },
  defaultInput: { n: 20 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of Flips',
      type: 'number',
      defaultValue: 20,
      placeholder: 'e.g. 20',
      helperText: 'Simulate n coin flips (1-30)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = Math.min(Math.max(1, input.n as number), 30);
    const steps: AlgorithmStep[] = [];
    // Deterministic sequence using LCG for reproducibility
    let seed = 42;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    const flips: number[] = [];
    let heads = 0;

    steps.push({
      line: 1,
      explanation: `Simulate ${n} fair coin flips. Track empirical probability of heads.`,
      variables: { n, heads: 0, tails: 0 },
      visualization: {
        type: 'array',
        array: [0, 0, 0],
        highlights: { 0: 'visited', 1: 'visited', 2: 'visited' },
        labels: { 0: 'heads', 1: 'tails', 2: 'p(H)' },
      },
    });

    for (let i = 1; i <= n; i++) {
      const flip = rand() < 0.5 ? 1 : 0;
      flips.push(flip);
      if (flip === 1) heads++;
      const tails = i - heads;
      const prob = Math.round((heads / i) * 100);

      steps.push({
        line: 4,
        explanation: `Flip ${i}: ${flip === 1 ? 'HEADS' : 'TAILS'}. Heads=${heads}, Tails=${tails}. P(H)=${heads}/${i} ≈ ${(heads/i).toFixed(3)}.`,
        variables: { flip: flip === 1 ? 'H' : 'T', heads, tails, prob: heads / i },
        visualization: {
          type: 'array',
          array: [heads, tails, prob],
          highlights: {
            0: 'found',
            1: flip === 0 ? 'active' : 'visited',
            2: Math.abs(prob - 50) < 10 ? 'sorted' : 'comparing',
          },
          labels: { 0: 'heads', 1: 'tails', 2: `p≈${(heads/i).toFixed(2)}` },
        },
      });
    }

    const finalProb = heads / n;
    steps.push({
      line: 7,
      explanation: `Done. After ${n} flips: ${heads} heads, ${n - heads} tails. P(H) = ${finalProb.toFixed(3)} (expected 0.5).`,
      variables: { heads, tails: n - heads, probability: finalProb },
      visualization: {
        type: 'array',
        array: [heads, n - heads, Math.round(finalProb * 100)],
        highlights: { 0: 'found', 1: 'comparing', 2: 'sorted' },
        labels: { 0: 'heads', 1: 'tails', 2: 'P(H)%' },
      },
    });

    return steps;
  },
};

export default probabilityOfFairCoin;
