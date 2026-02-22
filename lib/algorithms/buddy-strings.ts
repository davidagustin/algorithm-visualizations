import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const buddyStrings: AlgorithmDefinition = {
  id: 'buddy-strings',
  title: 'Buddy Strings',
  leetcodeNumber: 859,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given two strings s and goal, return true if you can swap exactly one pair of characters in s so that s equals goal. The strings must have the same length. Handle the edge case where s equals goal but has duplicate characters.',
  tags: ['string', 'simulation', 'counting'],

  code: {
    pseudocode: `function buddyStrings(s, goal):
  if len(s) != len(goal): return false
  if s == goal:
    return hasDuplicate(s)
  diffs = positions where s[i] != goal[i]
  if len(diffs) != 2: return false
  i, j = diffs
  return s[i]==goal[j] AND s[j]==goal[i]`,

    python: `def buddyStrings(s: str, goal: str) -> bool:
    if len(s) != len(goal):
        return False
    if s == goal:
        return len(set(s)) < len(s)
    diffs = [(s[i], goal[i]) for i in range(len(s)) if s[i] != goal[i]]
    return len(diffs) == 2 and diffs[0] == diffs[1][::-1]`,

    javascript: `function buddyStrings(s, goal) {
  if (s.length !== goal.length) return false;
  if (s === goal) return new Set(s).size < s.length;
  const diffs = [];
  for (let i = 0; i < s.length; i++) {
    if (s[i] !== goal[i]) diffs.push([s[i], goal[i]]);
  }
  return diffs.length === 2 &&
    diffs[0][0] === diffs[1][1] && diffs[0][1] === diffs[1][0];
}`,

    java: `public boolean buddyStrings(String s, String goal) {
    if (s.length() != goal.length()) return false;
    if (s.equals(goal)) {
        Set<Character> set = new HashSet<>();
        for (char c : s.toCharArray()) set.add(c);
        return set.size() < s.length();
    }
    List<int[]> diffs = new ArrayList<>();
    for (int i = 0; i < s.length(); i++) {
        if (s.charAt(i) != goal.charAt(i))
            diffs.add(new int[]{s.charAt(i), goal.charAt(i)});
    }
    return diffs.size() == 2 &&
        diffs.get(0)[0] == diffs.get(1)[1] &&
        diffs.get(0)[1] == diffs.get(1)[0];
}`,
  },

  defaultInput: {
    s: 'ab',
    goal: 'ba',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'ab',
      placeholder: 'ab',
      helperText: 'Source string',
    },
    {
      name: 'goal',
      label: 'Goal String',
      type: 'string',
      defaultValue: 'ba',
      placeholder: 'ba',
      helperText: 'Target string after one swap',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const goal = input.goal as string;
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Input: s="${s}", goal="${goal}". Check lengths first.`,
      variables: { s, goal, sLen: s.length, goalLen: goal.length },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    if (s.length !== goal.length) {
      steps.push({
        line: 2,
        explanation: `Lengths differ (${s.length} vs ${goal.length}). Cannot swap to make equal. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: s.split('').map((_, i) => i),
          highlights: Object.fromEntries(s.split('').map((_, i) => [i, 'mismatch'])),
          labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    if (s === goal) {
      const hasDup = new Set(s).size < s.length;
      steps.push({
        line: 3,
        explanation: `s equals goal. Can we swap two identical characters? Unique chars=${new Set(s).size}, total=${s.length}. Has duplicates: ${hasDup}. Return ${hasDup}.`,
        variables: { sEqualsGoal: true, hasDuplicates: hasDup, result: hasDup },
        visualization: {
          type: 'array',
          array: s.split('').map((_, i) => i),
          highlights: Object.fromEntries(s.split('').map((_, i) => [i, hasDup ? 'found' : 'mismatch'])),
          labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    steps.push({
      line: 5,
      explanation: 'Strings differ. Find positions where characters are different.',
      variables: { s, goal },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(
          s.split('').map((c, i) => [i, c !== goal[i] ? 'mismatch' : 'active'])
        ),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, `s:${c}/g:${goal[i]}`])),
      },
    });

    const diffs: [string, string][] = [];
    for (let i = 0; i < s.length; i++) {
      if (s[i] !== goal[i]) diffs.push([s[i], goal[i]]);
    }

    steps.push({
      line: 6,
      explanation: `Found ${diffs.length} differing position(s). For a valid single swap, we need exactly 2 differences.`,
      variables: { diffCount: diffs.length, diffs: diffs.map(([a, b]) => `(s=${a},g=${b})`).join(', ') },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(
          s.split('').map((c, i) => [i, c !== goal[i] ? 'comparing' : 'sorted'])
        ),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, `${c}-${goal[i]}`])),
      },
    });

    if (diffs.length !== 2) {
      steps.push({
        line: 7,
        explanation: `${diffs.length} differences found (not 2). A single swap cannot fix this. Return false.`,
        variables: { result: false },
        visualization: {
          type: 'array',
          array: s.split('').map((_, i) => i),
          highlights: Object.fromEntries(s.split('').map((_, i) => [i, 'mismatch'])),
          labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
        },
      });
      return steps;
    }

    const canSwap = diffs[0][0] === diffs[1][1] && diffs[0][1] === diffs[1][0];
    steps.push({
      line: 8,
      explanation: `Two differences: (s="${diffs[0][0]}", goal="${diffs[0][1]}") and (s="${diffs[1][0]}", goal="${diffs[1][1]}"). Swapping would give s[i]="${diffs[0][0]}" to position j (needs "${diffs[1][1]}") and s[j]="${diffs[1][0]}" to position i (needs "${diffs[0][1]}"). Valid swap: ${canSwap}. Return ${canSwap}.`,
      variables: { diff0: `(${diffs[0][0]},${diffs[0][1]})`, diff1: `(${diffs[1][0]},${diffs[1][1]})`, result: canSwap },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: Object.fromEntries(s.split('').map((_, i) => [i, canSwap ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default buddyStrings;
