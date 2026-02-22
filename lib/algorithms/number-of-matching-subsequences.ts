import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfMatchingSubsequences: AlgorithmDefinition = {
  id: 'number-of-matching-subsequences',
  title: 'Number of Matching Subsequences',
  leetcodeNumber: 792,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a string s and an array of words, return the number of words that are subsequences of s. A subsequence preserves relative order but does not require contiguous characters. Use bucket/pointer approach: for each character in s, advance pointers of words waiting for that character.',
  tags: ['string', 'hash map', 'subsequence', 'two pointers'],

  code: {
    pseudocode: `function numMatchingSubseq(s, words):
  // Bucket approach: map each letter to waiting word pointers
  waiting = {char: [(word, pointer)]}
  for word in words:
    waiting[word[0]].append((word, 0))
  count = 0
  for char in s:
    advance = waiting[char]
    waiting[char] = []
    for (word, i) in advance:
      i++
      if i == len(word):
        count++
      else:
        waiting[word[i]].append((word, i))
  return count`,

    python: `from collections import defaultdict
def numMatchingSubseq(s: str, words: list[str]) -> int:
    waiting = defaultdict(list)
    for word in words:
        waiting[word[0]].append((word, 0))
    count = 0
    for char in s:
        advance = waiting[char]
        waiting[char] = []
        for word, i in advance:
            i += 1
            if i == len(word):
                count += 1
            else:
                waiting[word[i]].append((word, i))
    return count`,

    javascript: `function numMatchingSubseq(s, words) {
  const waiting = {};
  for (const word of words) {
    if (!waiting[word[0]]) waiting[word[0]] = [];
    waiting[word[0]].push([word, 0]);
  }
  let count = 0;
  for (const char of s) {
    const advance = waiting[char] || [];
    waiting[char] = [];
    for (const [word, i] of advance) {
      const ni = i + 1;
      if (ni === word.length) count++;
      else {
        if (!waiting[word[ni]]) waiting[word[ni]] = [];
        waiting[word[ni]].push([word, ni]);
      }
    }
  }
  return count;
}`,

    java: `public int numMatchingSubseq(String s, String[] words) {
    Map<Character, List<int[]>> waiting = new HashMap<>();
    for (int wi = 0; wi < words.length; wi++) {
        char c = words[wi].charAt(0);
        waiting.computeIfAbsent(c, k -> new ArrayList<>()).add(new int[]{wi, 0});
    }
    int count = 0;
    for (char c : s.toCharArray()) {
        List<int[]> advance = waiting.getOrDefault(c, new ArrayList<>());
        waiting.put(c, new ArrayList<>());
        for (int[] p : advance) {
            int ni = p[1] + 1;
            if (ni == words[p[0]].length()) count++;
            else waiting.computeIfAbsent(words[p[0]].charAt(ni), k -> new ArrayList<>()).add(new int[]{p[0], ni});
        }
    }
    return count;
}`,
  },

  defaultInput: {
    s: 'abtaxyz',
    words: 'at,ab,a,xyz,bta',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'abtaxyz',
      placeholder: 'abtaxyz',
      helperText: 'The main string',
    },
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'at,ab,a,xyz,bta',
      placeholder: 'at,ab,a,xyz,bta',
      helperText: 'Words to check as subsequences',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordsRaw = input.words as string;
    const words = wordsRaw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: s.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Check which of [${words.map(w => `"${w}"`).join(', ')}] are subsequences of "${s}". Use bucket approach.`,
      variables: { s, words: words.join(',') },
      visualization: makeViz({}, {}),
    });

    // Simple O(n*m) approach for visualization clarity
    let count = 0;
    const results: boolean[] = [];

    for (const word of words) {
      let wi = 0;
      let si = 0;
      const matchPositions: number[] = [];

      while (si < s.length && wi < word.length) {
        if (s[si] === word[wi]) {
          matchPositions.push(si);
          wi++;
        }
        si++;
      }

      const matched = wi === word.length;
      results.push(matched);
      if (matched) count++;
    }

    for (let idx = 0; idx < words.length; idx++) {
      const word = words[idx];
      let wi = 0;
      const highlights: Record<number, string> = {};

      for (let si = 0; si < s.length && wi < word.length; si++) {
        if (s[si] === word[wi]) {
          highlights[si] = 'found';
          wi++;
        } else {
          highlights[si] = 'comparing';
        }
      }

      steps.push({
        line: 9,
        explanation: `Word "${word}": ${results[idx] ? 'IS' : 'is NOT'} a subsequence of "${s}". Matched ${wi}/${word.length} characters.`,
        variables: { word, matched: results[idx], matchedChars: wi },
        visualization: makeViz(
          results[idx] ? highlights : Object.fromEntries(Object.keys(highlights).map(k => [k, 'mismatch'])),
          {}
        ),
      });
    }

    steps.push({
      line: 14,
      explanation: `Done. ${count} out of ${words.length} words are subsequences of "${s}".`,
      variables: { result: count, total: words.length },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default numberOfMatchingSubsequences;
