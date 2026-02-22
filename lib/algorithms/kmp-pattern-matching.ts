import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kmpPatternMatching: AlgorithmDefinition = {
  id: 'kmp-pattern-matching',
  title: 'KMP Pattern Matching',
  leetcodeNumber: 28,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Knuth-Morris-Pratt (KMP) algorithm finds all occurrences of a pattern in a text in O(n+m) time. It builds a failure function (partial match table) to skip redundant comparisons after a mismatch.',
  tags: ['string', 'kmp', 'pattern matching', 'failure function'],
  code: {
    pseudocode: `function buildLPS(pattern):
  lps = [0] * len(pattern)
  length = 0, i = 1
  while i < len(pattern):
    if pattern[i] == pattern[length]:
      length++; lps[i] = length; i++
    else:
      if length != 0: length = lps[length-1]
      else: lps[i] = 0; i++
  return lps

function kmpSearch(text, pattern):
  lps = buildLPS(pattern)
  i = 0, j = 0, matches = []
  while i < len(text):
    if text[i] == pattern[j]: i++; j++
    if j == len(pattern):
      matches.append(i - j)
      j = lps[j - 1]
    elif i < len(text) and text[i] != pattern[j]:
      if j != 0: j = lps[j - 1]
      else: i++
  return matches`,
    python: `def kmpSearch(text, pattern):
    def buildLPS(p):
        lps = [0] * len(p)
        length, i = 0, 1
        while i < len(p):
            if p[i] == p[length]:
                length += 1
                lps[i] = length
                i += 1
            elif length:
                length = lps[length - 1]
            else:
                lps[i] = 0
                i += 1
        return lps

    lps = buildLPS(pattern)
    i = j = 0
    matches = []
    while i < len(text):
        if text[i] == pattern[j]:
            i += 1; j += 1
        if j == len(pattern):
            matches.append(i - j)
            j = lps[j - 1]
        elif i < len(text) and text[i] != pattern[j]:
            if j: j = lps[j - 1]
            else: i += 1
    return matches`,
    javascript: `function kmpSearch(text, pattern) {
  function buildLPS(p) {
    const lps = new Array(p.length).fill(0);
    let length = 0, i = 1;
    while (i < p.length) {
      if (p[i] === p[length]) {
        lps[i++] = ++length;
      } else if (length) {
        length = lps[length - 1];
      } else {
        lps[i++] = 0;
      }
    }
    return lps;
  }
  const lps = buildLPS(pattern);
  let i = 0, j = 0;
  const matches = [];
  while (i < text.length) {
    if (text[i] === pattern[j]) { i++; j++; }
    if (j === pattern.length) {
      matches.push(i - j);
      j = lps[j - 1];
    } else if (i < text.length && text[i] !== pattern[j]) {
      if (j) j = lps[j - 1];
      else i++;
    }
  }
  return matches;
}`,
    java: `public List<Integer> kmpSearch(String text, String pattern) {
    int[] lps = buildLPS(pattern);
    List<Integer> matches = new ArrayList<>();
    int i = 0, j = 0;
    while (i < text.length()) {
        if (text.charAt(i) == pattern.charAt(j)) { i++; j++; }
        if (j == pattern.length()) {
            matches.add(i - j);
            j = lps[j - 1];
        } else if (i < text.length() && text.charAt(i) != pattern.charAt(j)) {
            if (j != 0) j = lps[j - 1];
            else i++;
        }
    }
    return matches;
}`,
  },
  defaultInput: { text: 'aabacaababacab', pattern: 'ababac' },
  inputFields: [
    { name: 'text', label: 'Text', type: 'string', defaultValue: 'aabacaababacab', placeholder: 'aabacaababacab', helperText: 'Text to search in' },
    { name: 'pattern', label: 'Pattern', type: 'string', defaultValue: 'ababac', placeholder: 'ababac', helperText: 'Pattern to find' },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const text = input.text as string;
    const pattern = input.pattern as string;
    const steps: AlgorithmStep[] = [];
    const n = text.length;

    // Build LPS
    const lps: number[] = new Array(pattern.length).fill(0);
    let len = 0, k = 1;
    while (k < pattern.length) {
      if (pattern[k] === pattern[len]) {
        lps[k] = ++len;
        k++;
      } else if (len) {
        len = lps[len - 1];
      } else {
        lps[k++] = 0;
      }
    }

    const makeViz = (i: number, j: number, matches: number[], extra: Record<number, string> = {}): ArrayVisualization => {
      const highlights: Record<number, string> = {};
      matches.forEach(m => { for (let x = m; x < m + pattern.length; x++) highlights[x] = 'found'; });
      if (i < n) highlights[i] = extra[i] || 'active';
      Object.entries(extra).forEach(([k, v]) => { highlights[Number(k)] = v; });
      const labels: Record<number, string> = {};
      for (let x = 0; x < n; x++) labels[x] = text[x];
      if (i < n) labels[i] = `i=${i}\n${text[i]}`;
      return {
        type: 'array',
        array: Array.from({ length: n }, (_, x) => x),
        highlights,
        labels,
        auxData: {
          label: 'KMP Search',
          entries: [
            { key: 'i (text)', value: String(i) },
            { key: 'j (pattern)', value: String(j) },
            { key: 'pattern[j]', value: j < pattern.length ? pattern[j] : '-' },
            { key: 'LPS', value: JSON.stringify(lps) },
          ],
        },
      };
    };

    steps.push({
      line: 1,
      explanation: `Built LPS (failure function) for pattern "${pattern}": [${lps.join(', ')}]. Now searching text "${text}".`,
      variables: { lps: [...lps], pattern },
      visualization: makeViz(0, 0, []),
    });

    let i = 0, j = 0;
    const matches: number[] = [];

    while (i < n) {
      if (text[i] === pattern[j]) {
        steps.push({
          line: 15,
          explanation: `text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}'. Match! Advance both pointers.`,
          variables: { i, j, match: true },
          visualization: makeViz(i, j, matches, { [i]: 'match' }),
        });
        i++; j++;
      }
      if (j === pattern.length) {
        matches.push(i - j);
        steps.push({
          line: 17,
          explanation: `Pattern found at index ${i - j}! Reset j to lps[${j - 1}]=${lps[j - 1]}.`,
          variables: { matchAt: i - j, j },
          visualization: makeViz(i, j, [...matches]),
        });
        j = lps[j - 1];
      } else if (i < n && text[i] !== pattern[j]) {
        if (j !== 0) {
          steps.push({
            line: 20,
            explanation: `Mismatch: text[${i}]='${text[i]}' != pattern[${j}]='${pattern[j]}'. Use LPS: j = lps[${j - 1}] = ${lps[j - 1]}.`,
            variables: { i, j, newJ: lps[j - 1] },
            visualization: makeViz(i, j, matches, { [i]: 'mismatch' }),
          });
          j = lps[j - 1];
        } else {
          steps.push({
            line: 21,
            explanation: `Mismatch and j=0. Advance i to ${i + 1}.`,
            variables: { i, j },
            visualization: makeViz(i, j, matches, { [i]: 'mismatch' }),
          });
          i++;
        }
      }
    }

    steps.push({
      line: 22,
      explanation: `KMP complete. Found ${matches.length} match(es) at index/indices: [${matches.join(', ')}].`,
      variables: { matches: [...matches] },
      visualization: makeViz(n, j, matches),
    });

    return steps;
  },
};

export default kmpPatternMatching;
