import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const splitStringIntoMaxUniqueSubstrings: AlgorithmDefinition = {
  id: 'split-string-into-max-unique-substrings',
  title: 'Split a String Into the Max Number of Unique Substrings',
  leetcodeNumber: 1593,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string s, return the maximum number of unique substrings that the string can be split into. All substrings must be non-empty, together they must reconstruct the original string, and all must be distinct. Uses backtracking with a set to track used substrings.',
  tags: ['backtracking', 'string', 'hash set', 'recursion', 'greedy'],

  code: {
    pseudocode: `function maxUniqueSplit(s):
  seen = empty set
  return backtrack(s, 0, seen)

function backtrack(s, start, seen):
  if start == length(s): return 0
  maxSplit = 0
  for end from start+1 to length(s):
    sub = s[start..end]
    if sub not in seen:
      seen.add(sub)
      result = 1 + backtrack(s, end, seen)
      maxSplit = max(maxSplit, result)
      seen.remove(sub)
  return maxSplit`,

    python: `def maxUniqueSplit(s: str) -> int:
    seen = set()
    def backtrack(start):
        if start == len(s):
            return 0
        max_split = 0
        for end in range(start + 1, len(s) + 1):
            sub = s[start:end]
            if sub not in seen:
                seen.add(sub)
                result = 1 + backtrack(end)
                max_split = max(max_split, result)
                seen.remove(sub)
        return max_split
    return backtrack(0)`,

    javascript: `function maxUniqueSplit(s) {
  const seen = new Set();
  function backtrack(start) {
    if (start === s.length) return 0;
    let maxSplit = 0;
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (!seen.has(sub)) {
        seen.add(sub);
        const result = 1 + backtrack(end);
        maxSplit = Math.max(maxSplit, result);
        seen.delete(sub);
      }
    }
    return maxSplit;
  }
  return backtrack(0);
}`,

    java: `public int maxUniqueSplit(String s) {
    return backtrack(s, 0, new HashSet<>());
}
private int backtrack(String s, int start, Set<String> seen) {
    if (start == s.length()) return 0;
    int maxSplit = 0;
    for (int end = start + 1; end <= s.length(); end++) {
        String sub = s.substring(start, end);
        if (!seen.contains(sub)) {
            seen.add(sub);
            maxSplit = Math.max(maxSplit, 1 + backtrack(s, end, seen));
            seen.remove(sub);
        }
    }
    return maxSplit;
}`,
  },

  defaultInput: {
    s: 'ababccc',
  },

  inputFields: [
    {
      name: 's',
      label: 'Input String',
      type: 'string',
      defaultValue: 'ababccc',
      placeholder: 'ababccc',
      helperText: 'String to split into max unique substrings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    let bestResult = 0;
    const seen = new Set<string>();

    steps.push({
      line: 1,
      explanation: `Starting max unique split for "${s}" (length ${s.length}). Goal: find max number of distinct substrings that reconstruct the string.`,
      variables: { input: s, length: s.length },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: {},
        labels: s.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
      },
    });

    function backtrack(start: number, splits: string[]): number {
      if (start === s.length) {
        if (splits.length > bestResult) {
          bestResult = splits.length;
          steps.push({
            line: 5,
            explanation: `Complete split found: [${splits.map(sub => `"${sub}"`).join(', ')}] = ${splits.length} unique parts. New best!`,
            variables: { splits: [...splits], count: splits.length, bestResult },
            visualization: {
              type: 'array',
              array: s.split('').map((_, i) => i),
              highlights: s.split('').reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
              labels: s.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
        }
        return 0;
      }

      let maxSplit = 0;
      for (let end = start + 1; end <= s.length; end++) {
        const sub = s.slice(start, end);
        if (!seen.has(sub)) {
          seen.add(sub);

          steps.push({
            line: 9,
            explanation: `Try substring "${sub}" (pos ${start}-${end-1}). Not seen yet. Seen set: {${Array.from(seen).map(x => `"${x}"`).join(', ')}}`,
            variables: { substring: sub, start, end, seenCount: seen.size },
            visualization: {
              type: 'array',
              array: s.split('').map((_, i) => i),
              highlights: s.split('').reduce((acc, _, i) => ({
                ...acc,
                [i]: i >= start && i < end ? 'active' : i < start ? 'sorted' : 'default',
              }), {}),
              labels: s.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });

          const result = 1 + backtrack(end, [...splits, sub]);
          maxSplit = Math.max(maxSplit, result);
          seen.delete(sub);
        } else {
          steps.push({
            line: 9,
            explanation: `Skip "${sub}": already used in current path. Must maintain uniqueness.`,
            variables: { substring: sub, reason: 'duplicate', seen: Array.from(seen) },
            visualization: {
              type: 'array',
              array: s.split('').map((_, i) => i),
              highlights: s.split('').reduce((acc, _, i) => ({
                ...acc,
                [i]: i >= start && i < end ? 'mismatch' : 'default',
              }), {}),
              labels: s.split('').reduce((acc, c, i) => ({ ...acc, [i]: c }), {} as Record<number, string>),
            },
          });
        }
      }
      return maxSplit;
    }

    backtrack(0, []);

    steps.push({
      line: 3,
      explanation: `Split complete. Maximum unique substrings: ${bestResult}`,
      variables: { result: bestResult, input: s },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: s.split('').reduce((acc, _, i) => ({ ...acc, [i]: 'found' }), {}),
        labels: { 0: `Max: ${bestResult}` },
      },
    });

    return steps;
  },
};

export default splitStringIntoMaxUniqueSubstrings;
