import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumWindowSubsequence: AlgorithmDefinition = {
  id: 'minimum-window-subsequence',
  title: 'Minimum Window Subsequence',
  leetcodeNumber: 727,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given strings s1 and s2, find the minimum length substring of s1 such that s2 is a subsequence of that substring. Use two passes: forward pass to find s2 as a subsequence ending at some position in s1, then backward pass from that position to find the tightest starting point. Repeat moving forward from the start position.',
  tags: ['sliding window', 'string', 'two pointers', 'subsequence'],

  code: {
    pseudocode: `function minWindow(s1, s2):
  result = ""
  i = 0
  while i < len(s1):
    j = 0
    while i < len(s1) and j < len(s2):
      if s1[i] == s2[j]: j += 1
      i += 1
    if j == len(s2):
      end = i
      j = len(s2) - 1
      i -= 1
      while j >= 0:
        if s1[i] == s2[j]: j -= 1
        i -= 1
      i += 1
      if not result or end - i < len(result):
        result = s1[i:end]
      i += 1
  return result`,

    python: `def minWindow(s1: str, s2: str) -> str:
    result = ""
    i = 0
    while i < len(s1):
        j = 0
        while i < len(s1) and j < len(s2):
            if s1[i] == s2[j]:
                j += 1
            i += 1
        if j == len(s2):
            end = i
            j = len(s2) - 1
            i -= 1
            while j >= 0:
                if s1[i] == s2[j]:
                    j -= 1
                i -= 1
            i += 1
            if not result or end - i < len(result):
                result = s1[i:end]
            i += 1
    return result`,

    javascript: `function minWindow(s1, s2) {
  let result = "";
  let i = 0;
  while (i < s1.length) {
    let j = 0;
    while (i < s1.length && j < s2.length) {
      if (s1[i] === s2[j]) j++;
      i++;
    }
    if (j === s2.length) {
      const end = i;
      j = s2.length - 1;
      i--;
      while (j >= 0) {
        if (s1[i] === s2[j]) j--;
        i--;
      }
      i++;
      if (!result || end - i < result.length) {
        result = s1.slice(i, end);
      }
      i++;
    }
  }
  return result;
}`,

    java: `public String minWindow(String s1, String s2) {
    String result = "";
    int i = 0;
    while (i < s1.length()) {
        int j = 0;
        while (i < s1.length() && j < s2.length()) {
            if (s1.charAt(i) == s2.charAt(j)) j++;
            i++;
        }
        if (j == s2.length()) {
            int end = i;
            j = s2.length() - 1;
            i--;
            while (j >= 0) {
                if (s1.charAt(i) == s2.charAt(j)) j--;
                i--;
            }
            i++;
            if (result.isEmpty() || end - i < result.length())
                result = s1.substring(i, end);
            i++;
        }
    }
    return result;
}`,
  },

  defaultInput: {
    s1: 'abcdebdde',
    s2: 'bde',
  },

  inputFields: [
    {
      name: 's1',
      label: 'Source String (s1)',
      type: 'string',
      defaultValue: 'abcdebdde',
      placeholder: 'abcdebdde',
      helperText: 'The string to search within',
    },
    {
      name: 's2',
      label: 'Pattern String (s2)',
      type: 'string',
      defaultValue: 'bde',
      placeholder: 'bde',
      helperText: 'The subsequence to find as a substring',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s1 = input.s1 as string;
    const s2 = input.s2 as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s1.split('').map((c) => c.charCodeAt(0)),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find minimum window in s1="${s1}" that contains s2="${s2}" as a subsequence. Forward scan to find end, backward scan to tighten start.`,
      variables: { s1, s2 },
      visualization: makeViz({}, {}),
    });

    let result = '';
    let i = 0;
    let iteration = 0;

    while (i < s1.length) {
      iteration++;
      const startI = i;
      let j = 0;

      steps.push({
        line: 4,
        explanation: `Iteration ${iteration}: Start forward scan from i=${i}. Looking for s2="${s2}" as subsequence in s1 starting at position ${i}.`,
        variables: { i, j, searchFrom: i },
        visualization: makeViz({ [i]: 'pointer' }, { [i]: 'start' }),
      });

      while (i < s1.length && j < s2.length) {
        const matchHighlights: Record<number, string> = {};
        const matchLabels: Record<number, string> = {};
        matchHighlights[i] = s1[i] === s2[j] ? 'found' : 'active';
        matchLabels[i] = s1[i] === s2[j] ? `match s2[${j}]` : `i`;

        steps.push({
          line: 6,
          explanation: `Forward: s1[${i}]='${s1[i]}' vs s2[${j}]='${s2[j]}'. ${s1[i] === s2[j] ? 'Match! j advances.' : 'No match.'}`,
          variables: { i, j, s1Char: s1[i], s2Char: s2[j] },
          visualization: makeViz(matchHighlights, matchLabels),
        });

        if (s1[i] === s2[j]) j++;
        i++;
      }

      if (j === s2.length) {
        const end = i;

        steps.push({
          line: 9,
          explanation: `Found all of s2 as subsequence! End position=${end}. Now backward scan from ${end - 1} to tighten start.`,
          variables: { end, j },
          visualization: makeViz(
            Object.fromEntries(Array.from({ length: end - startI }, (_, idx) => [startI + idx, 'active'])),
            { [end - 1]: 'end' }
          ),
        });

        j = s2.length - 1;
        i--;

        while (j >= 0) {
          const bkHighlights: Record<number, string> = {};
          bkHighlights[i] = s1[i] === s2[j] ? 'found' : 'comparing';

          steps.push({
            line: 13,
            explanation: `Backward: s1[${i}]='${s1[i]}' vs s2[${j}]='${s2[j]}'. ${s1[i] === s2[j] ? 'Match!' : 'Skip.'}`,
            variables: { i, j, s1Char: s1[i], s2Char: s2[j] },
            visualization: makeViz(bkHighlights, { [i]: `bk` }),
          });

          if (s1[i] === s2[j]) j--;
          i--;
        }
        i++;

        const candidate = s1.slice(i, end);
        const improved = !result || end - i < result.length;
        if (improved) result = candidate;

        const resHighlights: Record<number, string> = {};
        for (let x = i; x < end; x++) resHighlights[x] = improved ? 'found' : 'active';

        steps.push({
          line: 16,
          explanation: `Window found: s1[${i}..${end - 1}]="${candidate}" (length=${candidate.length}). ${improved ? 'New best!' : 'Not better.'} Best="${result}".`,
          variables: { start: i, end, candidate, resultLength: result.length, improved },
          visualization: makeViz(resHighlights, { [i]: 'L', [end - 1]: 'R' }),
        });

        i++;
      }

      if (iteration > 20) break;
    }

    steps.push({
      line: 17,
      explanation: `Done. Minimum window subsequence = "${result}" (length=${result.length || 0}).`,
      variables: { result, length: result.length },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default minimumWindowSubsequence;
