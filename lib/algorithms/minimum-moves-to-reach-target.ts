import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const minimumMovesToReachTarget: AlgorithmDefinition = {
  id: 'minimum-moves-to-reach-target',
  title: 'Minimum Moves to Reach Target Score',
  leetcodeNumber: 780,
  difficulty: 'Medium',
  category: 'Graph',
  description:
    'Given target, find minimum operations to reach it from 1 using: double (x*2) or increment (x+1). Work backwards from target: if target is even, divide by 2 (was a double); if odd or maxDoubles exhausted, decrement. This greedy reverse approach avoids BFS state explosion.',
  tags: ['graph', 'BFS', 'greedy', 'math', 'reverse thinking'],

  code: {
    pseudocode: `function minMoves(target, maxDoubles):
  if target == 1: return 0
  moves = 0
  while target > 1 and maxDoubles > 0:
    if target is odd:
      target -= 1; moves++
    target //= 2; moves++; maxDoubles--
  moves += target - 1  // remaining increments
  return moves`,

    python: `def minMoves(target, maxDoubles):
    if target == 1: return 0
    moves = 0
    while target > 1 and maxDoubles > 0:
        if target % 2 == 1:
            target -= 1
            moves += 1
        target //= 2
        moves += 1
        maxDoubles -= 1
    moves += target - 1
    return moves`,

    javascript: `function minMoves(target, maxDoubles) {
  if (target === 1) return 0;
  let moves = 0;
  while (target > 1 && maxDoubles > 0) {
    if (target % 2 === 1) {
      target--;
      moves++;
    }
    target = Math.floor(target / 2);
    moves++;
    maxDoubles--;
  }
  moves += target - 1;
  return moves;
}`,

    java: `public int minMoves(int target, int maxDoubles) {
    if (target == 1) return 0;
    int moves = 0;
    while (target > 1 && maxDoubles > 0) {
        if (target % 2 == 1) { target--; moves++; }
        target /= 2;
        moves++;
        maxDoubles--;
    }
    moves += target - 1;
    return moves;
}`,
  },

  defaultInput: {
    target: 10,
    maxDoubles: 4,
  },

  inputFields: [
    {
      name: 'target',
      label: 'Target Value',
      type: 'number',
      defaultValue: 10,
      placeholder: '10',
      helperText: 'Target score to reach from 1',
    },
    {
      name: 'maxDoubles',
      label: 'Max Doubles',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Maximum number of doubling operations allowed',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let target = input.target as number;
    let maxDoubles = input.maxDoubles as number;
    const steps: AlgorithmStep[] = [];
    const originalTarget = target;

    steps.push({
      line: 1,
      explanation: `Work backwards from ${originalTarget}. Reverse operations: divide by 2 (undo double) or decrement (undo increment). maxDoubles = ${maxDoubles}.`,
      variables: { target, maxDoubles },
      visualization: {
        type: 'array',
        array: [target],
        highlights: { 0: 'active' },
        labels: { 0: `start=${target}` },
      },
    });

    if (target === 1) {
      steps.push({
        line: 2,
        explanation: 'Target is already 1. Zero moves needed.',
        variables: { result: 0 },
        visualization: {
          type: 'array',
          array: [1],
          highlights: { 0: 'found' },
          labels: { 0: 'done' },
        },
      });
      return steps;
    }

    let moves = 0;
    const history: number[] = [target];

    while (target > 1 && maxDoubles > 0) {
      if (target % 2 === 1) {
        target--;
        moves++;
        history.push(target);
        steps.push({
          line: 5,
          explanation: `Target is odd. Decrement: ${target + 1} -> ${target}. Moves = ${moves}. (Reverse of +1 operation).`,
          variables: { target, moves, maxDoublesLeft: maxDoubles, operation: 'decrement' },
          visualization: {
            type: 'array',
            array: [...history].reverse().slice(0, 8),
            highlights: { 0: 'active' },
            labels: { 0: `${target}` },
          },
        });
      }

      target = Math.floor(target / 2);
      moves++;
      maxDoubles--;
      history.push(target);

      steps.push({
        line: 7,
        explanation: `Halve: ${target * 2} -> ${target}. Moves = ${moves}, doublesLeft = ${maxDoubles}. (Reverse of *2 operation).`,
        variables: { target, moves, maxDoublesLeft: maxDoubles, operation: 'halve' },
        visualization: {
          type: 'array',
          array: [...history].reverse().slice(0, 8),
          highlights: { 0: 'comparing' },
          labels: { 0: `${target}` },
        },
      });
    }

    if (target > 1) {
      const remaining = target - 1;
      moves += remaining;
      steps.push({
        line: 9,
        explanation: `No doubles left. Need ${remaining} more increment operations to go from ${target} to 1. Total moves = ${moves}.`,
        variables: { target, remainingIncrements: remaining, totalMoves: moves },
        visualization: {
          type: 'array',
          array: Array.from({ length: Math.min(target, 8) }, (_, i) => target - i),
          highlights: { 0: 'active', [Math.min(target - 1, 7)]: 'found' },
          labels: { 0: `cur=${target}`, [Math.min(target - 1, 7)]: 'dest=1' },
        },
      });
    }

    steps.push({
      line: 10,
      explanation: `Minimum moves to reach ${originalTarget} from 1 with at most ${input.maxDoubles} doublings = ${moves}.`,
      variables: { result: moves },
      visualization: {
        type: 'array',
        array: [1, originalTarget],
        highlights: { 0: 'found', 1: 'found' },
        labels: { 0: 'start=1', 1: `target=${originalTarget}`, },
      },
    });

    return steps;
  },
};

export default minimumMovesToReachTarget;
