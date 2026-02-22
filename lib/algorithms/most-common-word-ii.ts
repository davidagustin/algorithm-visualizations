import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const mostCommonWordIi: AlgorithmDefinition = {
  id: 'most-common-word-ii',
  title: 'Most Common Word',
  leetcodeNumber: 819,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a paragraph and a list of banned words, return the most frequent non-banned word. The answer is guaranteed to exist and is unique. Parse the paragraph (case-insensitive, ignoring punctuation), count word frequencies, and skip banned words.',
  tags: ['string', 'hash map', 'frequency count'],

  code: {
    pseudocode: `function mostCommonWord(paragraph, banned):
  bannedSet = set(banned)
  words = extract words from paragraph (lowercase, no punctuation)
  count = frequency map of words
  maxFreq = 0
  result = ""
  for word, freq in count:
    if word not in bannedSet and freq > maxFreq:
      maxFreq = freq
      result = word
  return result`,

    python: `import re
from collections import Counter
def mostCommonWord(paragraph: str, banned: list[str]) -> str:
    banned_set = set(banned)
    words = re.findall(r'[a-z]+', paragraph.lower())
    count = Counter(words)
    return max((w for w in count if w not in banned_set), key=lambda w: count[w])`,

    javascript: `function mostCommonWord(paragraph, banned) {
  const bannedSet = new Set(banned);
  const words = paragraph.toLowerCase().match(/[a-z]+/g) || [];
  const count = {};
  for (const w of words) count[w] = (count[w] || 0) + 1;
  let best = '', maxFreq = 0;
  for (const [w, f] of Object.entries(count)) {
    if (!bannedSet.has(w) && f > maxFreq) { maxFreq = f; best = w; }
  }
  return best;
}`,

    java: `public String mostCommonWord(String paragraph, String[] banned) {
    Set<String> bannedSet = new HashSet<>(Arrays.asList(banned));
    String[] words = paragraph.toLowerCase().split("[^a-z]+");
    Map<String, Integer> count = new HashMap<>();
    for (String w : words) if (!w.isEmpty()) count.merge(w, 1, Integer::sum);
    return count.entrySet().stream()
        .filter(e -> !bannedSet.contains(e.getKey()))
        .max(Map.Entry.comparingByValue())
        .get().getKey();
}`,
  },

  defaultInput: {
    paragraph: 'Bob hit a ball the hit BALL flew far after it was hit',
    banned: 'hit',
  },

  inputFields: [
    {
      name: 'paragraph',
      label: 'Paragraph',
      type: 'string',
      defaultValue: 'Bob hit a ball the hit BALL flew far after it was hit',
      placeholder: 'Bob hit a ball the hit BALL flew far after it was hit',
      helperText: 'Input paragraph',
    },
    {
      name: 'banned',
      label: 'Banned Words (comma-separated)',
      type: 'string',
      defaultValue: 'hit',
      placeholder: 'hit,word2',
      helperText: 'Banned words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const paragraph = input.paragraph as string;
    const bannedRaw = input.banned as string;
    const banned = bannedRaw.split(',').map(w => w.trim().toLowerCase());
    const bannedSet = new Set(banned);
    const steps: AlgorithmStep[] = [];

    const wordMatches = paragraph.toLowerCase().match(/[a-z]+/g) || [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: wordMatches as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Parse paragraph. Extracted words: [${wordMatches.map(w => `"${w}"`).join(', ')}]. Banned: [${banned.join(', ')}].`,
      variables: { wordCount: wordMatches.length, bannedCount: banned.length },
      visualization: makeViz({}, {}),
    });

    const count: Record<string, number> = {};
    for (let i = 0; i < wordMatches.length; i++) {
      const w = wordMatches[i];
      count[w] = (count[w] || 0) + 1;

      steps.push({
        line: 3,
        explanation: `Word "${w}": count[${w}]=${count[w]}. ${bannedSet.has(w) ? 'BANNED - will skip.' : 'Not banned.'}`,
        variables: { word: w, count: count[w], banned: bannedSet.has(w) },
        visualization: makeViz(
          { [i]: bannedSet.has(w) ? 'mismatch' : 'active' },
          { [i]: w }
        ),
      });
    }

    let best = '';
    let maxFreq = 0;

    for (const [w, f] of Object.entries(count)) {
      if (!bannedSet.has(w) && f > maxFreq) {
        maxFreq = f;
        best = w;
      }
    }

    steps.push({
      line: 9,
      explanation: `Most frequent non-banned word: "${best}" with frequency ${maxFreq}.`,
      variables: { result: best, frequency: maxFreq },
      visualization: makeViz(
        Object.fromEntries(wordMatches.map((w, i) => [i, w === best ? 'found' : 'visited'])),
        {}
      ),
    });

    return steps;
  },
};

export default mostCommonWordIi;
