import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const matchsticksToSquare: AlgorithmDefinition = {
  id: 'matchsticks-to-square',
  title: 'Matchsticks to Square',
  leetcodeNumber: 473,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given matchsticks of various lengths, determine if they can form a perfect square where all 4 sides have equal length. Each matchstick must be used exactly once. Uses backtracking with pruning: sort descending to fail fast, skip duplicate bucket sums to avoid redundant branches.',
  tags: ['backtracking', 'array', 'bit manipulation', 'sorting', 'pruning'],

  code: {
    pseudocode: `function makesquare(matchsticks):
  total = sum(matchsticks)
  if total % 4 != 0: return false
  side = total / 4
  sort matchsticks descending
  if matchsticks[0] > side: return false
  sides = [0, 0, 0, 0]
  return backtrack(matchsticks, 0, sides, side)

function backtrack(sticks, index, sides, target):
  if index == length(sticks): return all sides == target
  seen = set()
  for s from 0 to 3:
    if sides[s] + sticks[index] <= target and sides[s] not in seen:
      seen.add(sides[s])
      sides[s] += sticks[index]
      if backtrack(sticks, index+1, sides, target): return true
      sides[s] -= sticks[index]
  return false`,

    python: `def makesquare(matchsticks: list[int]) -> bool:
    total = sum(matchsticks)
    if total % 4 != 0:
        return False
    side = total // 4
    matchsticks.sort(reverse=True)
    if matchsticks[0] > side:
        return False
    sides = [0] * 4
    def backtrack(index):
        if index == len(matchsticks):
            return sides[0] == sides[1] == sides[2] == side
        seen = set()
        for s in range(4):
            if sides[s] + matchsticks[index] <= side and sides[s] not in seen:
                seen.add(sides[s])
                sides[s] += matchsticks[index]
                if backtrack(index + 1):
                    return True
                sides[s] -= matchsticks[index]
        return False
    return backtrack(0)`,

    javascript: `function makesquare(matchsticks) {
  const total = matchsticks.reduce((a, b) => a + b, 0);
  if (total % 4 !== 0) return false;
  const side = total / 4;
  matchsticks.sort((a, b) => b - a);
  if (matchsticks[0] > side) return false;
  const sides = [0, 0, 0, 0];
  function backtrack(index) {
    if (index === matchsticks.length) return sides.every(s => s === side);
    const seen = new Set();
    for (let s = 0; s < 4; s++) {
      if (sides[s] + matchsticks[index] <= side && !seen.has(sides[s])) {
        seen.add(sides[s]);
        sides[s] += matchsticks[index];
        if (backtrack(index + 1)) return true;
        sides[s] -= matchsticks[index];
      }
    }
    return false;
  }
  return backtrack(0);
}`,

    java: `public boolean makesquare(int[] matchsticks) {
    int total = Arrays.stream(matchsticks).sum();
    if (total % 4 != 0) return false;
    int side = total / 4;
    Arrays.sort(matchsticks);
    if (matchsticks[matchsticks.length - 1] > side) return false;
    int[] sides = new int[4];
    return backtrack(matchsticks, matchsticks.length - 1, sides, side);
}
private boolean backtrack(int[] m, int idx, int[] sides, int target) {
    if (idx < 0) return sides[0] == sides[1] && sides[1] == sides[2] && sides[2] == target;
    Set<Integer> seen = new HashSet<>();
    for (int s = 0; s < 4; s++) {
        if (sides[s] + m[idx] <= target && seen.add(sides[s])) {
            sides[s] += m[idx];
            if (backtrack(m, idx - 1, sides, target)) return true;
            sides[s] -= m[idx];
        }
    }
    return false;
}`,
  },

  defaultInput: {
    matchsticks: [1, 1, 2, 2, 2],
  },

  inputFields: [
    {
      name: 'matchsticks',
      label: 'Matchstick Lengths',
      type: 'array',
      defaultValue: [1, 1, 2, 2, 2],
      placeholder: '1,1,2,2,2',
      helperText: 'Comma-separated matchstick lengths',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const matchsticks = [...(input.matchsticks as number[])].sort((a, b) => b - a);
    const steps: AlgorithmStep[] = [];

    const total = matchsticks.reduce((a, b) => a + b, 0);

    steps.push({
      line: 1,
      explanation: `Total length = ${total}. For a square, need 4 equal sides. Target side = ${total}/4 = ${total % 4 === 0 ? total / 4 : 'NOT INTEGER'}.`,
      variables: { total, divisibleBy4: total % 4 === 0 },
      visualization: {
        type: 'array',
        array: matchsticks,
        highlights: {},
        labels: matchsticks.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
      },
    });

    if (total % 4 !== 0) {
      steps.push({
        line: 3,
        explanation: `Total ${total} is not divisible by 4. Cannot form a square. Return false.`,
        variables: { total, result: false },
        visualization: {
          type: 'array',
          array: matchsticks,
          highlights: matchsticks.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
      return steps;
    }

    const side = total / 4;
    const sides = [0, 0, 0, 0];
    let found = false;

    steps.push({
      line: 6,
      explanation: `Target side length = ${side}. Matchsticks sorted descending: [${matchsticks.join(', ')}]. Starting backtracking with 4 empty sides.`,
      variables: { side, matchsticks, sides: [...sides] },
      visualization: {
        type: 'array',
        array: matchsticks,
        highlights: {},
        labels: matchsticks.reduce((acc, v, i) => ({ ...acc, [i]: `${v}` }), {} as Record<number, string>),
      },
    });

    function backtrack(index: number): boolean {
      if (index === matchsticks.length) {
        if (sides.every(s => s === side)) {
          found = true;
          steps.push({
            line: 10,
            explanation: `All matchsticks placed! Sides = [${sides.join(', ')}]. All equal ${side}. Square is POSSIBLE!`,
            variables: { sides: [...sides], side, result: true },
            visualization: {
              type: 'array',
              array: [...sides],
              highlights: { 0: 'found', 1: 'found', 2: 'found', 3: 'found' },
              labels: { 0: `S1:${sides[0]}`, 1: `S2:${sides[1]}`, 2: `S3:${sides[2]}`, 3: `S4:${sides[3]}` },
            },
          });
          return true;
        }
        return false;
      }

      const seen = new Set<number>();
      for (let s = 0; s < 4; s++) {
        if (sides[s] + matchsticks[index] <= side && !seen.has(sides[s])) {
          seen.add(sides[s]);
          sides[s] += matchsticks[index];

          steps.push({
            line: 14,
            explanation: `Place matchstick ${matchsticks[index]} into side ${s + 1}. Side ${s + 1} now = ${sides[s]}/${side}.`,
            variables: { matchstick: matchsticks[index], side: s + 1, sideSum: sides[s], target: side },
            visualization: {
              type: 'array',
              array: [...sides],
              highlights: { [s]: 'active' },
              labels: { 0: `S1:${sides[0]}`, 1: `S2:${sides[1]}`, 2: `S3:${sides[2]}`, 3: `S4:${sides[3]}` },
            },
          });

          if (backtrack(index + 1)) return true;

          sides[s] -= matchsticks[index];

          steps.push({
            line: 16,
            explanation: `Backtrack: remove ${matchsticks[index]} from side ${s + 1}. Side ${s + 1} back to ${sides[s]}.`,
            variables: { removed: matchsticks[index], side: s + 1, sideSum: sides[s] },
            visualization: {
              type: 'array',
              array: [...sides],
              highlights: { [s]: 'comparing' },
              labels: { 0: `S1:${sides[0]}`, 1: `S2:${sides[1]}`, 2: `S3:${sides[2]}`, 3: `S4:${sides[3]}` },
            },
          });
        }
      }
      return false;
    }

    backtrack(0);

    if (!found) {
      steps.push({
        line: 17,
        explanation: `No valid arrangement found. Cannot form a square with these matchsticks.`,
        variables: { result: false, matchsticks },
        visualization: {
          type: 'array',
          array: matchsticks,
          highlights: matchsticks.reduce((acc, _, i) => ({ ...acc, [i]: 'mismatch' }), {}),
          labels: {},
        },
      });
    }

    return steps;
  },
};

export default matchsticksToSquare;
