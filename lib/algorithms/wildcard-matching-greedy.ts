import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const wildcardMatchingGreedy: AlgorithmDefinition = {
  id: 'wildcard-matching-greedy',
  title: 'Wildcard Matching (Greedy)',
  leetcodeNumber: 44,
  difficulty: 'Hard',
  category: 'Greedy',
  description:
    'Given a string s and a pattern p with wildcards "?" (matches any single character) and "*" (matches any sequence including empty), determine if the pattern matches the entire string. Greedy approach: track last star position and the s position when star was seen. When mismatch, backtrack to the star and try matching one more character.',
  tags: ['greedy', 'string', 'dynamic programming', 'two pointers'],

  code: {
    pseudocode: `function isMatch(s, p):
  si = pi = 0
  starPos = -1, sStarPos = -1
  while si < len(s):
    if pi < len(p) and (p[pi] == s[si] or p[pi] == '?'):
      si++; pi++
    elif pi < len(p) and p[pi] == '*':
      starPos = pi; sStarPos = si
      pi++
    elif starPos != -1:
      pi = starPos + 1
      sStarPos++; si = sStarPos
    else:
      return false
  while pi < len(p) and p[pi] == '*': pi++
  return pi == len(p)`,

    python: `def isMatch(s: str, p: str) -> bool:
    si = pi = 0
    star_pos = s_star = -1
    while si < len(s):
        if pi < len(p) and (p[pi] == s[si] or p[pi] == '?'):
            si += 1; pi += 1
        elif pi < len(p) and p[pi] == '*':
            star_pos = pi; s_star = si; pi += 1
        elif star_pos != -1:
            pi = star_pos + 1
            s_star += 1; si = s_star
        else:
            return False
    while pi < len(p) and p[pi] == '*':
        pi += 1
    return pi == len(p)`,

    javascript: `function isMatch(s, p) {
  let si = 0, pi = 0, starPos = -1, sStar = -1;
  while (si < s.length) {
    if (pi < p.length && (p[pi] === s[si] || p[pi] === '?')) {
      si++; pi++;
    } else if (pi < p.length && p[pi] === '*') {
      starPos = pi; sStar = si; pi++;
    } else if (starPos !== -1) {
      pi = starPos + 1;
      sStar++; si = sStar;
    } else return false;
  }
  while (pi < p.length && p[pi] === '*') pi++;
  return pi === p.length;
}`,

    java: `public boolean isMatch(String s, String p) {
    int si = 0, pi = 0, starPos = -1, sStar = -1;
    while (si < s.length()) {
        if (pi < p.length() && (p.charAt(pi) == s.charAt(si) || p.charAt(pi) == '?')) {
            si++; pi++;
        } else if (pi < p.length() && p.charAt(pi) == '*') {
            starPos = pi; sStar = si; pi++;
        } else if (starPos != -1) {
            pi = starPos + 1;
            sStar++; si = sStar;
        } else return false;
    }
    while (pi < p.length() && p.charAt(pi) == '*') pi++;
    return pi == p.length();
}`,
  },

  defaultInput: {
    s: 'adceb',
    p: '*a*b',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'adceb',
      placeholder: 'adceb',
      helperText: 'Input string to match',
    },
    {
      name: 'p',
      label: 'Pattern',
      type: 'string',
      defaultValue: '*a*b',
      placeholder: '*a*b',
      helperText: 'Pattern with ? and * wildcards',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const steps: AlgorithmStep[] = [];

    const sArr = s.split('').map((_, i) => i);

    steps.push({
      line: 1,
      explanation: `Match string "${s}" against pattern "${p}". Initialize si=0, pi=0, starPos=-1.`,
      variables: { si: 0, pi: 0, starPos: -1, sStar: -1 },
      visualization: {
        type: 'array',
        array: s.split('').map((_, i) => i),
        highlights: { 0: 'active' } as Record<number, string>,
        labels: Object.fromEntries(s.split('').map((c, i) => [i, c])) as Record<number, string>,
      },
    });

    let si = 0;
    let pi = 0;
    let starPos = -1;
    let sStar = -1;

    while (si < s.length) {
      if (pi < p.length && (p[pi] === s[si] || p[pi] === '?')) {
        steps.push({
          line: 5,
          explanation: `s[${si}]="${s[si]}" matches p[${pi}]="${p[pi]}" (${p[pi] === '?' ? 'wildcard ?' : 'exact match'}). Advance both pointers.`,
          variables: { si, pi, 's[si]': s[si], 'p[pi]': p[pi] },
          visualization: {
            type: 'array',
            array: sArr,
            highlights: { [si]: 'found' } as Record<number, string>,
            labels: { [si]: s[si] } as Record<number, string>,
          },
        });
        si++;
        pi++;
      } else if (pi < p.length && p[pi] === '*') {
        steps.push({
          line: 7,
          explanation: `Pattern has "*" at position ${pi}. Record star position. starPos=${pi}, sStar=${si}. Advance pattern pointer.`,
          variables: { si, pi, starPos: pi, sStar: si },
          visualization: {
            type: 'array',
            array: sArr,
            highlights: { [si]: 'active' } as Record<number, string>,
            labels: { [si]: 'star anchor' } as Record<number, string>,
          },
        });
        starPos = pi;
        sStar = si;
        pi++;
      } else if (starPos !== -1) {
        sStar++;
        si = sStar;
        pi = starPos + 1;
        steps.push({
          line: 9,
          explanation: `Mismatch. Backtrack to last star. Let star consume one more character. si=${si}, pi=${pi}.`,
          variables: { si, pi, starPos, sStar },
          visualization: {
            type: 'array',
            array: sArr,
            highlights: { [si]: 'comparing', [starPos]: 'active' } as Record<number, string>,
            labels: { [si]: 'retry' } as Record<number, string>,
          },
        });
      } else {
        steps.push({
          line: 11,
          explanation: `Mismatch at s[${si}]="${s[si]}" vs p[${pi}]="${p[pi]}" with no star to backtrack to. Return false.`,
          variables: { si, pi, result: false },
          visualization: {
            type: 'array',
            array: sArr,
            highlights: { [si]: 'mismatch' } as Record<number, string>,
            labels: { [si]: 'fail' } as Record<number, string>,
          },
        });
        return steps;
      }
    }

    while (pi < p.length && p[pi] === '*') pi++;

    const matched = pi === p.length;
    steps.push({
      line: 13,
      explanation: `String fully consumed. Remaining pattern: "${p.slice(pi)}". Result: ${matched}.`,
      variables: { si, pi, result: matched },
      visualization: {
        type: 'array',
        array: sArr,
        highlights: Object.fromEntries(sArr.map((_, i) => [i, matched ? 'found' : 'mismatch'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default wildcardMatchingGreedy;
