import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const mostCommonWord: AlgorithmDefinition = {
  id: 'most-common-word',
  title: 'Most Common Word',
  leetcodeNumber: 819,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given a paragraph of text and a list of banned words, find the most frequently occurring word that is not banned. The answer is guaranteed to exist. Words are case-insensitive and only letters matter.',
  tags: ['hash map', 'string', 'counting'],

  code: {
    pseudocode: `function mostCommonWord(paragraph, banned):
  bannedSet = set(banned)
  words = extract words from paragraph (lowercase)
  count = frequency map of words
  bestWord = ""
  bestCount = 0
  for word, freq in count:
    if word not in bannedSet and freq > bestCount:
      bestWord = word
      bestCount = freq
  return bestWord`,

    python: `def mostCommonWord(paragraph: str, banned: list[str]) -> str:
    banned_set = set(banned)
    words = re.findall(r'[a-z]+', paragraph.lower())
    count = Counter(words)
    return max((w for w in count if w not in banned_set), key=count.get)`,

    javascript: `function mostCommonWord(paragraph, banned) {
  const bannedSet = new Set(banned);
  const words = paragraph.toLowerCase().match(/[a-z]+/g) || [];
  const count = {};
  for (const w of words) count[w] = (count[w] || 0) + 1;
  let best = '', bestCount = 0;
  for (const [w, c] of Object.entries(count)) {
    if (!bannedSet.has(w) && c > bestCount) { best = w; bestCount = c; }
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
    paragraph: 'Bob hit a ball, the hit BALL flew far after it was hit.',
    banned: 'hit',
  },

  inputFields: [
    {
      name: 'paragraph',
      label: 'Paragraph',
      type: 'string',
      defaultValue: 'Bob hit a ball, the hit BALL flew far after it was hit.',
      placeholder: 'Bob hit a ball...',
      helperText: 'Paragraph of text (may contain punctuation)',
    },
    {
      name: 'banned',
      label: 'Banned Words',
      type: 'string',
      defaultValue: 'hit',
      placeholder: 'hit,the',
      helperText: 'Comma-separated banned words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const paragraph = input.paragraph as string;
    const bannedStr = input.banned as string;
    const banned = bannedStr.split(',').map(w => w.trim().toLowerCase());
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Paragraph: "${paragraph}". Banned: [${banned.map(w => `"${w}"`).join(', ')}].`,
      variables: { paragraph, banned: banned.join(', ') },
      visualization: {
        type: 'array',
        array: banned.map((_, i) => i),
        highlights: Object.fromEntries(banned.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(banned.map((w, i) => [i, w])),
      },
    });

    const bannedSet = new Set(banned);
    const words = (paragraph.toLowerCase().match(/[a-z]+/g) || []);

    steps.push({
      line: 3,
      explanation: `Extracted ${words.length} word(s) from paragraph: [${words.map(w => `"${w}"`).join(', ')}]`,
      variables: { wordCount: words.length, words: words.join(', ') },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: Object.fromEntries(words.map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(words.map((w, i) => [i, w])),
      },
    });

    const count: Record<string, number> = {};
    for (const w of words) count[w] = (count[w] || 0) + 1;

    steps.push({
      line: 4,
      explanation: `Word frequencies: ${Object.entries(count).map(([w, c]) => `"${w}":${c}`).join(', ')}`,
      variables: { ...count },
      visualization: {
        type: 'array',
        array: Object.values(count),
        highlights: Object.fromEntries(Object.keys(count).map((_, i) => [i, 'active'])),
        labels: Object.fromEntries(Object.keys(count).map((w, i) => [i, w])),
      },
    });

    let best = '';
    let bestCount = 0;

    for (const [w, c] of Object.entries(count)) {
      const isBanned = bannedSet.has(w);
      steps.push({
        line: 7,
        explanation: `Word "${w}" (count=${c}): ${isBanned ? 'BANNED, skip.' : (c > bestCount ? `Not banned and count ${c} > bestCount ${bestCount}. New best!` : `Not banned but count ${c} <= bestCount ${bestCount}. Keep current best.`)}`,
        variables: { word: w, count: c, isBanned, bestWord: best, bestCount },
        visualization: {
          type: 'array',
          array: Object.values(count),
          highlights: {
            ...Object.fromEntries(Object.keys(count).map((word, i) => [i, word === w ? (isBanned ? 'mismatch' : 'comparing') : (word === best ? 'found' : 'active')])),
          },
          labels: Object.fromEntries(Object.keys(count).map((word, i) => [i, word])),
        },
      });

      if (!isBanned && c > bestCount) {
        best = w;
        bestCount = c;
      }
    }

    steps.push({
      line: 10,
      explanation: `Most common non-banned word: "${best}" with count ${bestCount}.`,
      variables: { result: best, count: bestCount },
      visualization: {
        type: 'array',
        array: Object.values(count),
        highlights: Object.fromEntries(
          Object.keys(count).map((w, i) => [i, w === best ? 'found' : 'mismatch'])
        ),
        labels: Object.fromEntries(Object.keys(count).map((w, i) => [i, w])),
      },
    });

    return steps;
  },
};

export default mostCommonWord;
