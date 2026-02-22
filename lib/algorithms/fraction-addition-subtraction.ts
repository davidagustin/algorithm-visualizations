import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fractionAdditionSubtraction: AlgorithmDefinition = {
  id: 'fraction-addition-subtraction',
  title: 'Fraction Addition and Subtraction',
  leetcodeNumber: 592,
  difficulty: 'Medium',
  category: 'Hash Map',
  description:
    'Given a string representing an expression of fractions, compute the result as a reduced fraction. Parse each fraction token, accumulate using a common denominator (LCM), and reduce the final numerator/denominator using GCD. Tracks each fraction in a list for step-by-step visualization.',
  tags: ['hash map', 'math', 'string', 'gcd', 'fraction'],

  code: {
    pseudocode: `function fractionAddition(expression):
  fractions = parse(expression)
  num, den = 0, 1
  for n, d in fractions:
    num = num * d + n * den
    den = den * d
    g = gcd(abs(num), abs(den))
    num /= g
    den /= g
  return str(num) + "/" + str(den)`,

    python: `from math import gcd
import re
def fractionAddition(expression: str) -> str:
    fracs = list(map(int, re.findall(r'[+-]?\\d+', expression)))
    num, den = 0, 1
    for i in range(0, len(fracs), 2):
        n, d = fracs[i], fracs[i+1]
        num = num * d + n * den
        den *= d
        g = gcd(abs(num), den)
        num //= g
        den //= g
    return f"{num}/{den}"`,

    javascript: `function fractionAddition(expression) {
  const tokens = expression.match(/[+-]?\\d+\\/\\d+/g);
  let [num, den] = [0, 1];
  const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
  for (const t of tokens) {
    const [n, d] = t.split('/').map(Number);
    num = num * d + n * den;
    den *= d;
    const g = gcd(Math.abs(num), den);
    num /= g; den /= g;
  }
  return \`\${num}/\${den}\`;
}`,

    java: `public String fractionAddition(String expression) {
    String[] parts = expression.split("(?=[+-])");
    long num = 0, den = 1;
    for (String p : parts) {
        String[] nd = p.split("/");
        long n = Long.parseLong(nd[0]), d = Long.parseLong(nd[1]);
        num = num * d + n * den;
        den *= d;
        long g = gcd(Math.abs(num), den);
        num /= g; den /= g;
    }
    return num + "/" + den;
}`,
  },

  defaultInput: {
    expression: '-1/2+1/2+1/3',
  },

  inputFields: [
    {
      name: 'expression',
      label: 'Expression',
      type: 'string',
      defaultValue: '-1/2+1/2+1/3',
      placeholder: '-1/2+1/2+1/3',
      helperText: 'Fraction expression string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const expression = input.expression as string;
    const steps: AlgorithmStep[] = [];

    function gcd(a: number, b: number): number {
      return b === 0 ? a : gcd(b, a % b);
    }

    const tokens = expression.match(/[+-]?\d+\/\d+/g) || [];

    steps.push({
      line: 1,
      explanation: `Parse expression "${expression}" into fractions: [${tokens.join(', ')}]. Start with running result = 0/1.`,
      variables: { fractions: tokens.join(', '), num: 0, den: 1 },
      visualization: {
        type: 'array',
        array: tokens as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    let num = 0, den = 1;

    for (let i = 0; i < tokens.length; i++) {
      const parts = tokens[i].split('/');
      const n = parseInt(parts[0]);
      const d = parseInt(parts[1]);

      steps.push({
        line: 4,
        explanation: `Token "${tokens[i]}": n=${n}, d=${d}. Current result = ${num}/${den}. Compute new numerator and denominator.`,
        variables: { token: tokens[i], n, d, currentNum: num, currentDen: den },
        visualization: {
          type: 'array',
          array: tokens as unknown as number[],
          highlights: { [i]: 'active' },
          labels: { [i]: tokens[i] },
        },
      });

      num = num * d + n * den;
      den = den * d;

      steps.push({
        line: 5,
        explanation: `Before reduction: num = ${num}, den = ${den}. Compute GCD to reduce.`,
        variables: { num, den, beforeReduction: `${num}/${den}` },
        visualization: {
          type: 'array',
          array: tokens as unknown as number[],
          highlights: { [i]: 'comparing' },
          labels: { [i]: `${num}/${den}` },
        },
      });

      const g = gcd(Math.abs(num), Math.abs(den));
      num = num / g;
      den = den / g;

      steps.push({
        line: 7,
        explanation: `GCD = ${g}. Reduced: ${num}/${den}.`,
        variables: { gcd: g, num, den, reduced: `${num}/${den}` },
        visualization: {
          type: 'array',
          array: tokens as unknown as number[],
          highlights: { [i]: 'found' },
          labels: { [i]: `=${num}/${den}` },
        },
      });
    }

    steps.push({
      line: 9,
      explanation: `Done. Final result = ${num}/${den}.`,
      variables: { result: `${num}/${den}` },
      visualization: {
        type: 'array',
        array: tokens as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default fractionAdditionSubtraction;
