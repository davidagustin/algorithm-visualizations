import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const permutationInString: AlgorithmDefinition = {
  id: 'permutation-in-string',
  title: 'Permutation in String',
  leetcodeNumber: 567,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given two strings s1 and s2, return true if s2 contains a permutation of s1. The window size is fixed at len(s1), and we slide it across s2 comparing character frequency maps.',
  tags: ['sliding window', 'hash map', 'string', 'fixed window'],

  code: {
    pseudocode: `function checkInclusion(s1, s2):
  if len(s1) > len(s2): return false
  need = frequency map of s1
  window = frequency map of s2[0..len(s1)-1]
  matches = count of chars where window[c] == need[c]
  for right = len(s1) to len(s2)-1:
    if matches == len(need): return true
    add s2[right] to window, update matches
    remove s2[right-len(s1)] from window, update matches
  return matches == len(need)`,

    python: `def checkInclusion(s1: str, s2: str) -> bool:
    if len(s1) > len(s2):
        return False
    need = {}
    for c in s1:
        need[c] = need.get(c, 0) + 1
    window = {}
    for c in s2[:len(s1)]:
        window[c] = window.get(c, 0) + 1
    matches = sum(1 for c in need if window.get(c, 0) == need[c])
    for right in range(len(s1), len(s2)):
        if matches == len(need):
            return True
        rc = s2[right]
        window[rc] = window.get(rc, 0) + 1
        if rc in need:
            if window[rc] == need[rc]:
                matches += 1
            elif window[rc] == need[rc] + 1:
                matches -= 1
        lc = s2[right - len(s1)]
        if lc in need:
            if window[lc] == need[lc]:
                matches -= 1
            elif window[lc] == need[lc] - 1:
                matches += 1
        window[lc] -= 1
    return matches == len(need)`,

    javascript: `function checkInclusion(s1, s2) {
  if (s1.length > s2.length) return false;
  const need = {}, window = {};
  for (const c of s1) need[c] = (need[c] || 0) + 1;
  for (const c of s2.slice(0, s1.length)) window[c] = (window[c] || 0) + 1;
  let matches = Object.keys(need).filter(c => window[c] === need[c]).length;
  for (let right = s1.length; right < s2.length; right++) {
    if (matches === Object.keys(need).length) return true;
    const rc = s2[right];
    window[rc] = (window[rc] || 0) + 1;
    if (need[rc]) {
      if (window[rc] === need[rc]) matches++;
      else if (window[rc] === need[rc] + 1) matches--;
    }
    const lc = s2[right - s1.length];
    if (need[lc]) {
      if (window[lc] === need[lc]) matches--;
      else if (window[lc] === need[lc] - 1) matches++;
    }
    window[lc]--;
  }
  return matches === Object.keys(need).length;
}`,

    java: `public boolean checkInclusion(String s1, String s2) {
    if (s1.length() > s2.length()) return false;
    int[] need = new int[26], window = new int[26];
    for (char c : s1.toCharArray()) need[c - 'a']++;
    for (int i = 0; i < s1.length(); i++) window[s2.charAt(i) - 'a']++;
    int matches = 0;
    for (int i = 0; i < 26; i++) if (need[i] == window[i]) matches++;
    for (int right = s1.length(); right < s2.length(); right++) {
        if (matches == 26) return true;
        int ri = s2.charAt(right) - 'a';
        window[ri]++;
        if (window[ri] == need[ri]) matches++;
        else if (window[ri] == need[ri] + 1) matches--;
        int li = s2.charAt(right - s1.length()) - 'a';
        if (window[li] == need[li]) matches--;
        else if (window[li] == need[li] - 1) matches++;
        window[li]--;
    }
    return matches == 26;
}`,
  },

  defaultInput: { s1: 'ab', s2: 'eidbaooo' },

  inputFields: [
    {
      name: 's1',
      label: 'Pattern String (s1)',
      type: 'string',
      defaultValue: 'ab',
      placeholder: 'ab',
      helperText: 'The pattern whose permutation to find',
    },
    {
      name: 's2',
      label: 'Source String (s2)',
      type: 'string',
      defaultValue: 'eidbaooo',
      placeholder: 'eidbaooo',
      helperText: 'The string to search in',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = (input.s1 as string) || 'ab';
    const s2 = (input.s2 as string) || 'eidbaooo';
    const steps: AlgorithmStep[] = [];
    const k = s1.length;
    const chars = s2.split('');

    if (k > s2.length) {
      steps.push({
        line: 1,
        explanation: `s1 (length ${k}) is longer than s2 (length ${s2.length}). Return false immediately.`,
        variables: { result: false },
        visualization: { type: 'array', array: chars.map((c) => c.charCodeAt(0)), highlights: {}, labels: Object.fromEntries(chars.map((c, i) => [i, c])) },
      });
      return steps;
    }

    const need: Record<string, number> = {};
    for (const c of s1) need[c] = (need[c] || 0) + 1;
    const window: Record<string, number> = {};
    for (const c of s2.slice(0, k)) window[c] = (window[c] || 0) + 1;

    const countMatches = () =>
      Object.keys(need).filter((c) => (window[c] || 0) === need[c]).length;

    const makeViz = (
      left: number,
      right: number,
      highlights: Record<number, string>,
      found: boolean
    ): ArrayVisualization => ({
      type: 'array',
      array: chars.map((c) => c.charCodeAt(0)),
      highlights,
      labels: {
        ...Object.fromEntries(chars.map((c, i) => [i, c])),
        [left]: 'L',
        [right]: 'R',
      },
      auxData: {
        label: 'Window Frequencies',
        entries: Object.keys(need).map((c) => ({
          key: c,
          value: `${window[c] || 0}/${need[c]}`,
        })),
      },
    });

    steps.push({
      line: 3,
      explanation: `Build frequency map for s1="${s1}": ${JSON.stringify(need)}. Initialize window with first ${k} chars of s2.`,
      variables: { need, window: { ...window }, matches: countMatches(), total: Object.keys(need).length },
      visualization: makeViz(0, k - 1, Object.fromEntries([...Array(k)].map((_, i) => [i, 'active'])), false),
    });

    let matches = countMatches();

    steps.push({
      line: 5,
      explanation: `Initial window s2[0..${k - 1}]="${s2.slice(0, k)}". Matches: ${matches}/${Object.keys(need).length} unique chars satisfied.`,
      variables: { window: { ...window }, matches, needed: Object.keys(need).length },
      visualization: makeViz(0, k - 1, Object.fromEntries([...Array(k)].map((_, i) => [i, matches === Object.keys(need).length ? 'found' : 'active'])), matches === Object.keys(need).length),
    });

    if (matches === Object.keys(need).length) {
      steps.push({
        line: 6,
        explanation: `Initial window is already a permutation of s1! Return true.`,
        variables: { result: true, window: { ...window } },
        visualization: makeViz(0, k - 1, Object.fromEntries([...Array(k)].map((_, i) => [i, 'found'])), true),
      });
      return steps;
    }

    for (let right = k; right < chars.length; right++) {
      const left = right - k + 1;
      const rc = chars[right];
      const lc = chars[right - k];

      const prevWindowRc = window[rc] || 0;
      window[rc] = prevWindowRc + 1;
      if (need[rc]) {
        if (window[rc] === need[rc]) matches++;
        else if (window[rc] === need[rc] + 1) matches--;
      }

      const prevWindowLc = window[lc] || 0;
      if (need[lc]) {
        if (prevWindowLc === need[lc]) matches--;
        else if (prevWindowLc === need[lc] - 1) matches++;
      }
      window[lc] = prevWindowLc - 1;
      if (window[lc] === 0) delete window[lc];

      const isMatch = matches === Object.keys(need).length;
      const h: Record<number, string> = {};
      for (let i = left; i <= right; i++) h[i] = isMatch ? 'found' : 'active';
      h[right] = isMatch ? 'found' : 'comparing';
      h[left - 1] = 'visited';

      steps.push({
        line: 7,
        explanation: `Slide window to [${left}..${right}] = "${s2.slice(left, right + 1)}". Add '${rc}', remove '${lc}'. Matches: ${matches}/${Object.keys(need).length}. ${isMatch ? 'FOUND permutation!' : 'Not a permutation.'}`,
        variables: { left, right, added: rc, removed: lc, matches, window: { ...window } },
        visualization: makeViz(left, right, h, isMatch),
      });

      if (isMatch) {
        steps.push({
          line: 9,
          explanation: `Window "${s2.slice(left, right + 1)}" is a permutation of s1="${s1}". Return true!`,
          variables: { result: true, window: s2.slice(left, right + 1) },
          visualization: makeViz(left, right, Object.fromEntries([...Array(k)].map((_, i) => [left + i, 'found'])), true),
        });
        return steps;
      }
    }

    steps.push({
      line: 10,
      explanation: `Exhausted all windows. No permutation of s1="${s1}" found in s2="${s2}". Return false.`,
      variables: { result: false },
      visualization: makeViz(chars.length - k, chars.length - 1, Object.fromEntries([...Array(k)].map((_, i) => [chars.length - k + i, 'visited'])), false),
    });

    return steps;
  },
};

export default permutationInString;
