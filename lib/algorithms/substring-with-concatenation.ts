import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const substringWithConcatenation: AlgorithmDefinition = {
  id: 'substring-with-concatenation',
  title: 'Substring with Concatenation of All Words',
  leetcodeNumber: 30,
  difficulty: 'Hard',
  category: 'Sliding Window',
  description:
    'Given a string s and an array of strings words (all same length), find all starting indices of substrings in s that is a concatenation of each word in words exactly once. Use a sliding window of size words.length * word.length, shifted by word length. Use hash maps to track required and current word counts.',
  tags: ['sliding window', 'hash map', 'string', 'two pointers'],

  code: {
    pseudocode: `function findSubstring(s, words):
  wordLen = len(words[0])
  numWords = len(words)
  windowLen = wordLen * numWords
  wordCount = frequency map of words
  result = []
  for i in range(wordLen):
    left = i
    currCount = {}
    formed = 0
    for right in range(i, len(s) - wordLen + 1, wordLen):
      word = s[right:right+wordLen]
      if word in wordCount:
        currCount[word] += 1
        if currCount[word] == wordCount[word]: formed += 1
        while currCount[word] > wordCount[word]:
          leftWord = s[left:left+wordLen]
          currCount[leftWord] -= 1
          if currCount[leftWord] < wordCount[leftWord]: formed -= 1
          left += wordLen
        if formed == len(wordCount): result.append(left)
      else:
        currCount = {}; formed = 0; left = right + wordLen
  return result`,

    python: `def findSubstring(s: str, words: list[str]) -> list[int]:
    from collections import Counter
    wordLen, numWords = len(words[0]), len(words)
    wordCount = Counter(words)
    result = []
    for i in range(wordLen):
        left, formed = i, 0
        currCount = Counter()
        for right in range(i, len(s) - wordLen + 1, wordLen):
            word = s[right:right+wordLen]
            if word in wordCount:
                currCount[word] += 1
                if currCount[word] == wordCount[word]: formed += 1
                while currCount[word] > wordCount[word]:
                    lw = s[left:left+wordLen]
                    currCount[lw] -= 1
                    if currCount[lw] < wordCount[lw]: formed -= 1
                    left += wordLen
                if formed == len(wordCount): result.append(left)
            else:
                currCount.clear(); formed = 0; left = right + wordLen
    return result`,

    javascript: `function findSubstring(s, words) {
  const wordLen = words[0].length;
  const numWords = words.length;
  const wordCount = {};
  for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;
  const result = [];
  for (let i = 0; i < wordLen; i++) {
    let left = i, formed = 0;
    const currCount = {};
    for (let right = i; right <= s.length - wordLen; right += wordLen) {
      const word = s.slice(right, right + wordLen);
      if (word in wordCount) {
        currCount[word] = (currCount[word] || 0) + 1;
        if (currCount[word] === wordCount[word]) formed++;
        while (currCount[word] > wordCount[word]) {
          const lw = s.slice(left, left + wordLen);
          currCount[lw]--;
          if (currCount[lw] < wordCount[lw]) formed--;
          left += wordLen;
        }
        if (formed === Object.keys(wordCount).length) result.push(left);
      } else {
        Object.keys(currCount).forEach(k => delete currCount[k]);
        formed = 0; left = right + wordLen;
      }
    }
  }
  return result;
}`,

    java: `public List<Integer> findSubstring(String s, String[] words) {
    Map<String,Integer> wc = new HashMap<>();
    for (String w : words) wc.merge(w, 1, Integer::sum);
    int wl = words[0].length(), n = words.length;
    List<Integer> res = new ArrayList<>();
    for (int i = 0; i < wl; i++) {
        int left = i, formed = 0;
        Map<String,Integer> cc = new HashMap<>();
        for (int r = i; r + wl <= s.length(); r += wl) {
            String w = s.substring(r, r + wl);
            if (wc.containsKey(w)) {
                cc.merge(w, 1, Integer::sum);
                if (cc.get(w).equals(wc.get(w))) formed++;
                while (cc.get(w) > wc.get(w)) {
                    String lw = s.substring(left, left + wl);
                    cc.merge(lw, -1, Integer::sum);
                    if (cc.get(lw) < wc.get(lw)) formed--;
                    left += wl;
                }
                if (formed == wc.size()) res.add(left);
            } else { cc.clear(); formed = 0; left = r + wl; }
        }
    }
    return res;
}`,
  },

  defaultInput: {
    s: 'barfoothefoobarman',
    words: ['foo', 'bar'],
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'barfoothefoobarman',
      placeholder: 'barfoothefoobarman',
      helperText: 'Source string to search',
    },
    {
      name: 'words',
      label: 'Words',
      type: 'array',
      defaultValue: ['foo', 'bar'],
      placeholder: 'foo,bar',
      helperText: 'Array of words (all same length)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const wordsRaw = input.words as unknown;
    const words = Array.isArray(wordsRaw)
      ? wordsRaw.map(String)
      : String(wordsRaw).split(',');
    const steps: AlgorithmStep[] = [];

    if (!words.length || !words[0]) {
      steps.push({
        line: 1,
        explanation: 'No words provided.',
        variables: {},
        visualization: { type: 'array', array: [], highlights: {}, labels: {} },
      });
      return steps;
    }

    const wordLen = words[0].length;
    const numWords = words.length;
    const windowLen = wordLen * numWords;

    const wordCount: Record<string, number> = {};
    for (const w of words) wordCount[w] = (wordCount[w] || 0) + 1;

    steps.push({
      line: 1,
      explanation: `String="${s}", words=[${words.join(', ')}]. wordLen=${wordLen}, numWords=${numWords}, windowLen=${windowLen}.`,
      variables: { wordLen, numWords, windowLen, wordCount: JSON.stringify(wordCount) },
      visualization: {
        type: 'array',
        array: s.split('').map((c) => c.charCodeAt(0)),
        highlights: {},
        labels: {},
      },
    });

    const result: number[] = [];

    for (let i = 0; i < wordLen; i++) {
      let left = i;
      let formed = 0;
      const currCount: Record<string, number> = {};

      steps.push({
        line: 6,
        explanation: `Starting pass with offset i=${i}. Will check word-aligned positions starting at ${i}.`,
        variables: { pass: i, left, formed },
        visualization: {
          type: 'array',
          array: s.split('').map((c) => c.charCodeAt(0)),
          highlights: { [i]: 'pointer' },
          labels: { [i]: `start` },
        },
      });

      for (let right = i; right + wordLen <= s.length; right += wordLen) {
        const word = s.slice(right, right + wordLen);
        const highlights: Record<number, string> = {};
        const labels: Record<number, string> = {};

        for (let j = right; j < right + wordLen && j < s.length; j++) {
          highlights[j] = wordCount[word] ? 'active' : 'mismatch';
        }
        labels[right] = `"${word}"`;

        if (wordCount[word]) {
          currCount[word] = (currCount[word] || 0) + 1;
          if (currCount[word] === wordCount[word]) formed++;

          steps.push({
            line: 10,
            explanation: `Found word "${word}" at position ${right}. currCount["${word}"]=${currCount[word]}, need=${wordCount[word]}. Formed=${formed}/${Object.keys(wordCount).length}.`,
            variables: { right, word, formed, needed: numWords },
            visualization: {
              type: 'array',
              array: s.split('').map((c) => c.charCodeAt(0)),
              highlights,
              labels,
            },
          });

          while (currCount[word] > wordCount[word]) {
            const leftWord = s.slice(left, left + wordLen);
            currCount[leftWord]--;
            if (currCount[leftWord] < wordCount[leftWord]) formed--;
            left += wordLen;
          }

          if (formed === Object.keys(wordCount).length) {
            result.push(left);
            const foundHighlights: Record<number, string> = {};
            for (let j = left; j < left + windowLen && j < s.length; j++) {
              foundHighlights[j] = 'found';
            }
            steps.push({
              line: 16,
              explanation: `Valid concatenation found starting at index ${left}! Substring="${s.slice(left, left + windowLen)}". Total found: ${result.length}.`,
              variables: { startIndex: left, result: result.join(', ') },
              visualization: {
                type: 'array',
                array: s.split('').map((c) => c.charCodeAt(0)),
                highlights: foundHighlights,
                labels: { [left]: 'start' },
              },
            });
          }
        } else {
          Object.keys(currCount).forEach((k) => delete currCount[k]);
          formed = 0;
          left = right + wordLen;

          steps.push({
            line: 18,
            explanation: `Word "${word}" at position ${right} not in words list. Reset window. left=${left}.`,
            variables: { right, word, left, formed: 0 },
            visualization: {
              type: 'array',
              array: s.split('').map((c) => c.charCodeAt(0)),
              highlights,
              labels,
            },
          });
        }
      }
    }

    steps.push({
      line: 19,
      explanation: `Done. Found ${result.length} valid starting indices: [${result.join(', ')}].`,
      variables: { result: result.join(', '), count: result.length },
      visualization: {
        type: 'array',
        array: s.split('').map((c) => c.charCodeAt(0)),
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default substringWithConcatenation;
