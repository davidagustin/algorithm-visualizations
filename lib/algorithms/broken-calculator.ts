import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const brokenCalculator: AlgorithmDefinition = {
  id: 'broken-calculator',
  title: 'Broken Calculator',
  leetcodeNumber: 991,
  difficulty: 'Medium',
  category: 'Greedy',
  description:
    'Given startValue and target, use a broken calculator that can only double the displayed number or subtract 1. Find the minimum number of operations to reach target from startValue. Work backwards from target: if target > startValue, halve it (if even) or add 1 (if odd); else subtract.',
  tags: ['greedy', 'math'],

  code: {
    pseudocode: `function brokenCalc(startValue, target):
  ops = 0
  while target > startValue:
    if target is odd:
      target = target + 1
    else:
      target = target / 2
    ops = ops + 1
  return ops + (startValue - target)`,

    python: `def brokenCalc(startValue: int, target: int) -> int:
    ops = 0
    while target > startValue:
        if target % 2 == 1:
            target += 1
        else:
            target //= 2
        ops += 1
    return ops + (startValue - target)`,

    javascript: `function brokenCalc(startValue, target) {
  let ops = 0;
  while (target > startValue) {
    if (target % 2 === 1) target++;
    else target = Math.floor(target / 2);
    ops++;
  }
  return ops + (startValue - target);
}`,

    java: `public int brokenCalc(int startValue, int target) {
    int ops = 0;
    while (target > startValue) {
        if (target % 2 == 1) target++;
        else target /= 2;
        ops++;
    }
    return ops + (startValue - target);
}`,
  },

  defaultInput: {
    startValue: 3,
    target: 10,
  },

  inputFields: [
    {
      name: 'startValue',
      label: 'Start Value',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Initial display value',
    },
    {
      name: 'target',
      label: 'Target',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Value to reach',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const startValue = input.startValue as number;
    const steps: AlgorithmStep[] = [];

    let target = input.target as number;
    let ops = 0;

    const history: number[] = [target];

    steps.push({
      line: 1,
      explanation: `Start working backwards from target=${target}. We will reduce target until it reaches or goes below startValue=${startValue}.`,
      variables: { startValue, target, ops },
      visualization: {
        type: 'array',
        array: [startValue, target],
        highlights: { 0: 'pointer', 1: 'active' },
        labels: { 0: 'start', 1: 'target' },
      },
    });

    while (target > startValue) {
      if (target % 2 === 1) {
        steps.push({
          line: 4,
          explanation: `target=${target} is odd. Add 1 to make it even (reverse of subtract 1 on original). target becomes ${target + 1}.`,
          variables: { target, ops, action: 'add 1 (odd)' },
          visualization: {
            type: 'array',
            array: [...history],
            highlights: { [history.length - 1]: 'active' },
            labels: { [history.length - 1]: 'odd+1' },
          },
        });
        target += 1;
      } else {
        steps.push({
          line: 6,
          explanation: `target=${target} is even. Halve it (reverse of doubling). target becomes ${target / 2}.`,
          variables: { target, ops, action: 'halve (even)' },
          visualization: {
            type: 'array',
            array: [...history],
            highlights: { [history.length - 1]: 'active' },
            labels: { [history.length - 1]: 'halve' },
          },
        });
        target = Math.floor(target / 2);
      }
      ops++;
      history.push(target);

      steps.push({
        line: 7,
        explanation: `After operation ${ops}: target=${target}. Still ${target > startValue ? 'greater than' : 'at or below'} startValue=${startValue}.`,
        variables: { target, ops, startValue },
        visualization: {
          type: 'array',
          array: [...history],
          highlights: { [history.length - 1]: target > startValue ? 'comparing' : 'found' },
          labels: { 0: 'init', [history.length - 1]: 'now' },
        },
      });
    }

    const extra = startValue - target;
    const totalOps = ops + extra;

    steps.push({
      line: 8,
      explanation: `target=${target} <= startValue=${startValue}. Need ${extra} more subtract-1 ops to go from startValue down to target. Total = ${ops} + ${extra} = ${totalOps}.`,
      variables: { ops, extra, totalOps, startValue, target },
      visualization: {
        type: 'array',
        array: [...history],
        highlights: Object.fromEntries(history.map((_, i) => [i, 'found'])),
        labels: { 0: 'init', [history.length - 1]: 'final' },
      },
    });

    return steps;
  },
};

export default brokenCalculator;
