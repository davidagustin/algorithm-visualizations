import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumWindowSubstring: AlgorithmDefinition = {
  id: 'minimum-window-substring',
  title: 'Minimum Window Substring',
  leetcodeNumber: 76,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given two strings s and t, return the minimum window substring of s such that every character in t is included in the window. Uses a sliding window with character frequency maps to efficiently track whether the current window is valid.',
  tags: ['sliding window', 'hash map', 'string', 'two pointers'],

  code: {
    pseudocode: `function minWindow(s, t):
  need = frequency map of t
  have, total = 0, len(need)
  left = 0, result = ""
  window = {}
  for right = 0 to len(s)-1:
    c = s[right]
    window[c] += 1
    if c in need and window[c] == need[c]:
      have += 1
    while have == total:
      if window size < result size:
        result = s[left..right]
      window[s[left]] -= 1
      if s[left] in need and window[s[left]] < need[s[left]]:
        have -= 1
      left += 1
  return result`,

    python: `def minWindow(s: str, t: str) -> str:
    if not t or not s:
        return ""
    need = {}
    for c in t:
        need[c] = need.get(c, 0) + 1
    have, total = 0, len(need)
    left = 0
    result = ""
    window = {}
    for right in range(len(s)):
        c = s[right]
        window[c] = window.get(c, 0) + 1
        if c in need and window[c] == need[c]:
            have += 1
        while have == total:
            if not result or right - left + 1 < len(result):
                result = s[left:right+1]
            window[s[left]] -= 1
            if s[left] in need and window[s[left]] < need[s[left]]:
                have -= 1
            left += 1
    return result`,

    javascript: `function minWindow(s, t) {
  if (!t || !s) return "";
  const need = {};
  for (const c of t) need[c] = (need[c] || 0) + 1;
  let have = 0, total = Object.keys(need).length;
  let left = 0, result = "";
  const window = {};
  for (let right = 0; right < s.length; right++) {
    const c = s[right];
    window[c] = (window[c] || 0) + 1;
    if (need[c] && window[c] === need[c]) have++;
    while (have === total) {
      if (!result || right - left + 1 < result.length)
        result = s.slice(left, right + 1);
      window[s[left]]--;
      if (need[s[left]] && window[s[left]] < need[s[left]]) have--;
      left++;
    }
  }
  return result;
}`,

    java: `public String minWindow(String s, String t) {
    Map<Character, Integer> need = new HashMap<>();
    for (char c : t.toCharArray()) need.merge(c, 1, Integer::sum);
    int have = 0, total = need.size(), left = 0;
    String result = "";
    Map<Character, Integer> window = new HashMap<>();
    for (int right = 0; right < s.length(); right++) {
        char c = s.charAt(right);
        window.merge(c, 1, Integer::sum);
        if (need.containsKey(c) && window.get(c).equals(need.get(c))) have++;
        while (have == total) {
            if (result.isEmpty() || right - left + 1 < result.length())
                result = s.substring(left, right + 1);
            char lc = s.charAt(left);
            window.merge(lc, -1, Integer::sum);
            if (need.containsKey(lc) && window.get(lc) < need.get(lc)) have--;
            left++;
        }
    }
    return result;
}`,
  },

  defaultInput: { s: 'ADOBECODEBANC', t: 'ABC' },

  inputFields: [
    {
      name: 's',
      label: 'Source String (s)',
      type: 'string',
      defaultValue: 'ADOBECODEBANC',
      placeholder: 'ADOBECODEBANC',
      helperText: 'The string to search in',
    },
    {
      name: 't',
      label: 'Target String (t)',
      type: 'string',
      defaultValue: 'ABC',
      placeholder: 'ABC',
      helperText: 'The string containing characters to find',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string) || 'ADOBECODEBANC';
    const t = (input.t as string) || 'ABC';
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');

    const need: Record<string, number> = {};
    for (const c of t) need[c] = (need[c] || 0) + 1;
    const total = Object.keys(need).length;

    const makeViz = (
      left: number,
      right: number,
      highlights: Record<number, string>,
      labels: Record<number, string>,
      windowMap: Record<string, number>
    ): ArrayVisualization => ({
      type: 'array',
      array: chars.map((c) => c.charCodeAt(0)),
      highlights,
      labels: { ...Object.fromEntries(chars.map((c, i) => [i, c])), ...labels },
      auxData: {
        label: 'Window Counts',
        entries: Object.entries(windowMap).map(([k, v]) => ({
          key: k,
          value: `${v}/${need[k] ?? '-'}`,
        })),
      },
    });

    steps.push({
      line: 2,
      explanation: `Build frequency map for t="${t}". Need: ${JSON.stringify(need)}. Total unique chars: ${total}.`,
      variables: { need, have: 0, total, left: 0, result: '' },
      visualization: makeViz(0, -1, {}, {}, {}),
    });

    const window: Record<string, number> = {};
    let have = 0;
    let left = 0;
    let result = '';
    let resLeft = -1;
    let resRight = -1;

    for (let right = 0; right < chars.length; right++) {
      const c = chars[right];
      window[c] = (window[c] || 0) + 1;
      const prevHave = have;
      if (need[c] && window[c] === need[c]) have++;

      const expandH: Record<number, string> = {};
      const expandL: Record<number, string> = {};
      if (resLeft >= 0) for (let i = resLeft; i <= resRight; i++) expandH[i] = 'found';
      for (let i = left; i < right; i++) expandH[i] = 'active';
      expandH[right] = 'comparing';
      if (left <= right) expandL[left] = 'L';
      expandL[right] = 'R';

      steps.push({
        line: 7,
        explanation: `Add s[${right}]='${c}' to window. window['${c}']=${window[c]}. ${have > prevHave ? `Now have=${have} (satisfied '${c}').` : `have=${have} unchanged.`}`,
        variables: { left, right, char: c, have, total, window: { ...window } },
        visualization: makeViz(left, right, expandH, expandL, { ...window }),
      });

      while (have === total) {
        const windowLen = right - left + 1;
        if (!result || windowLen < result.length) {
          result = s.slice(left, right + 1);
          resLeft = left;
          resRight = right;
          const bestH: Record<number, string> = {};
          const bestL: Record<number, string> = {};
          for (let i = resLeft; i <= resRight; i++) bestH[i] = 'found';
          bestL[resLeft] = 'L';
          bestL[resRight] = 'R';
          steps.push({
            line: 12,
            explanation: `New minimum window found: "${result}" (length ${result.length}). Update result.`,
            variables: { result, left, right, have, total },
            visualization: makeViz(left, right, bestH, bestL, { ...window }),
          });
        }

        const lc = chars[left];
        window[lc]--;
        if (need[lc] && window[lc] < need[lc]) have--;

        const shrinkH: Record<number, string> = {};
        const shrinkL: Record<number, string> = {};
        if (resLeft >= 0) for (let i = resLeft; i <= resRight; i++) shrinkH[i] = 'found';
        shrinkH[left] = 'visited';
        for (let i = left + 1; i <= right; i++) shrinkH[i] = 'active';
        shrinkH[right] = 'comparing';
        shrinkL[left] = 'L';
        shrinkL[right] = 'R';

        steps.push({
          line: 15,
          explanation: `Shrink window: remove s[${left}]='${lc}'. window['${lc}']=${window[lc]}. have=${have}. Move left to ${left + 1}.`,
          variables: { left: left + 1, right, removed: lc, have, total, window: { ...window } },
          visualization: makeViz(left, right, shrinkH, shrinkL, { ...window }),
        });

        left++;
      }
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    if (resLeft >= 0) {
      for (let i = resLeft; i <= resRight; i++) finalH[i] = 'found';
      finalL[resLeft] = 'start';
      finalL[resRight] = 'end';
    }

    steps.push({
      line: 16,
      explanation: `Done! Minimum window substring is "${result}" (length ${result.length}).`,
      variables: { result, length: result.length },
      visualization: makeViz(resLeft, resRight, finalH, finalL, {}),
    });

    return steps;
  },
};

export default minimumWindowSubstring;
