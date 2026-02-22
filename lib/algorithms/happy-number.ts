import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const happyNumber: AlgorithmDefinition = {
  id: 'happy-number',
  title: 'Happy Number',
  leetcodeNumber: 202,
  difficulty: 'Easy',
  category: 'Fast And Slow Pointers',
  description:
    'A happy number is defined by repeatedly replacing it with the sum of the squares of its digits. If it eventually reaches 1, it is happy. If it loops endlessly, it is not. Uses Floyd\'s cycle detection: slow computes one step, fast computes two steps.',
  tags: ['math', 'fast slow pointers', 'cycle detection'],

  code: {
    pseudocode: `function isHappy(n):
  function sumSquares(num):
    sum = 0
    while num > 0:
      d = num % 10
      sum += d * d
      num = floor(num / 10)
    return sum
  slow = n
  fast = sumSquares(n)
  while fast != 1 and slow != fast:
    slow = sumSquares(slow)
    fast = sumSquares(sumSquares(fast))
  return fast == 1`,

    python: `def isHappy(n: int) -> bool:
    def sum_squares(num):
        total = 0
        while num > 0:
            d = num % 10
            total += d * d
            num //= 10
        return total

    slow = n
    fast = sum_squares(n)
    while fast != 1 and slow != fast:
        slow = sum_squares(slow)
        fast = sum_squares(sum_squares(fast))
    return fast == 1`,

    javascript: `function isHappy(n) {
  function sumSquares(num) {
    let sum = 0;
    while (num > 0) {
      const d = num % 10;
      sum += d * d;
      num = Math.floor(num / 10);
    }
    return sum;
  }
  let slow = n;
  let fast = sumSquares(n);
  while (fast !== 1 && slow !== fast) {
    slow = sumSquares(slow);
    fast = sumSquares(sumSquares(fast));
  }
  return fast === 1;
}`,

    java: `public boolean isHappy(int n) {
    int slow = n;
    int fast = sumSquares(n);
    while (fast != 1 && slow != fast) {
        slow = sumSquares(slow);
        fast = sumSquares(sumSquares(fast));
    }
    return fast == 1;
}

private int sumSquares(int num) {
    int sum = 0;
    while (num > 0) {
        int d = num % 10;
        sum += d * d;
        num /= 10;
    }
    return sum;
}`,
  },

  defaultInput: {
    n: 19,
  },

  inputFields: [
    {
      name: 'n',
      label: 'Number',
      type: 'number',
      defaultValue: 19,
      placeholder: '19',
      helperText: 'Positive integer to check if it is a happy number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];

    const sumSquares = (num: number): number => {
      let sum = 0;
      while (num > 0) {
        const d = num % 10;
        sum += d * d;
        num = Math.floor(num / 10);
      }
      return sum;
    };

    const describeComputation = (num: number): string => {
      const digits = String(num).split('').map(Number);
      return digits.map(d => `${d}^2`).join(' + ') + ` = ${sumSquares(num)}`;
    };

    // We build the sequence as we go to visualize it
    const sequence: number[] = [n];
    let slow = n;
    let fast = sumSquares(n);
    sequence.push(fast);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: [...sequence],
      highlights,
      labels,
    });

    // Step: Initialize
    steps.push({
      line: 9,
      explanation: `Start with n = ${n}. slow = ${n}. Compute fast = sumSquares(${n}) = ${describeComputation(n)}.`,
      variables: { slow, fast, n },
      visualization: makeViz(
        { 0: 'pointer', [sequence.length - 1]: 'active' },
        { 0: 'S', [sequence.length - 1]: 'F' }
      ),
    });

    let iteration = 0;
    const maxIter = 30;

    while (fast !== 1 && slow !== fast && iteration < maxIter) {
      iteration++;

      // Advance slow
      slow = sumSquares(slow);
      // Advance fast twice
      const fast1 = sumSquares(fast);
      fast = sumSquares(fast1);

      // Add to sequence if not already there
      if (!sequence.includes(slow) || sequence[sequence.length - 1] !== slow) {
        if (!sequence.includes(slow)) sequence.push(slow);
      }
      if (!sequence.includes(fast1)) sequence.push(fast1);
      if (!sequence.includes(fast)) sequence.push(fast);

      const slowIdx = sequence.indexOf(slow);
      const fastIdx = sequence.indexOf(fast);

      if (slow === fast) {
        steps.push({
          line: 12,
          explanation: `slow = ${slow}, fast = ${fast}. They met! ${fast === 1 ? 'Both reached 1. Happy number!' : 'Cycle detected. Not a happy number.'}`,
          variables: { slow, fast, result: fast === 1 },
          visualization: makeViz(
            { [slowIdx]: fast === 1 ? 'found' : 'mismatch' },
            { [slowIdx]: 'S=F' }
          ),
        });
        break;
      }

      steps.push({
        line: 11,
        explanation: `slow: ${describeComputation(sequence[slowIdx - 1] || n)} = ${slow}. fast moved twice to ${fast}. slow != fast, continue.`,
        variables: { slow, fast },
        visualization: makeViz(
          { [slowIdx]: 'pointer', [fastIdx]: 'active' },
          { [slowIdx]: 'S', [fastIdx]: 'F' }
        ),
      });
    }

    if (fast === 1 && steps[steps.length - 1]?.variables?.result === undefined) {
      steps.push({
        line: 13,
        explanation: `fast reached 1. ${n} is a happy number! Return true.`,
        variables: { result: true },
        visualization: makeViz(
          Object.fromEntries(sequence.map((_, i) => [i, 'found'])),
          { [sequence.indexOf(1)]: '1!' }
        ),
      });
    } else if (fast !== 1 && slow === fast && steps[steps.length - 1]?.variables?.result === undefined) {
      steps.push({
        line: 13,
        explanation: `Cycle detected at ${slow}. ${n} is NOT a happy number. Return false.`,
        variables: { result: false },
        visualization: makeViz(
          Object.fromEntries(sequence.map((_, i) => [i, 'mismatch'])),
          {}
        ),
      });
    }

    return steps;
  },
};

export default happyNumber;
