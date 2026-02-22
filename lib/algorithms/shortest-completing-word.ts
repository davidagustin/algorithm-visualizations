import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const shortestCompletingWord: AlgorithmDefinition = {
  id: 'shortest-completing-word',
  title: 'Shortest Completing Word',
  leetcodeNumber: 748,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a license plate and an array of words, find the shortest completing word. A completing word contains all letters from the license plate (ignoring numbers and spaces, case-insensitive). If multiple words have the same length, return the first one.',
  tags: ['string', 'hash map', 'frequency count'],

  code: {
    pseudocode: `function shortestCompletingWord(licensePlate, words):
  plateCount = frequency of letters in licensePlate (lowercase)
  result = ""
  for word in words:
    wordCount = frequency of letters in word
    if wordCount contains all letters in plateCount:
      if result is empty or len(word) < len(result):
        result = word
  return result`,

    python: `from collections import Counter
def shortestCompletingWord(licensePlate: str, words: list[str]) -> str:
    plate = Counter(c.lower() for c in licensePlate if c.isalpha())
    result = ""
    for word in words:
        wc = Counter(word.lower())
        if all(wc[c] >= plate[c] for c in plate):
            if not result or len(word) < len(result):
                result = word
    return result`,

    javascript: `function shortestCompletingWord(licensePlate, words) {
  const plate = {};
  for (const c of licensePlate.toLowerCase()) {
    if (c >= 'a' && c <= 'z') plate[c] = (plate[c] || 0) + 1;
  }
  let result = '';
  for (const word of words) {
    const wc = {};
    for (const c of word.toLowerCase()) wc[c] = (wc[c] || 0) + 1;
    if (Object.keys(plate).every(c => (wc[c] || 0) >= plate[c])) {
      if (!result || word.length < result.length) result = word;
    }
  }
  return result;
}`,

    java: `public String shortestCompletingWord(String licensePlate, String[] words) {
    int[] plate = new int[26];
    for (char c : licensePlate.toLowerCase().toCharArray())
        if (Character.isLetter(c)) plate[c - 'a']++;
    String result = "";
    for (String word : words) {
        int[] wc = new int[26];
        for (char c : word.toLowerCase().toCharArray()) wc[c - 'a']++;
        boolean ok = true;
        for (int i = 0; i < 26; i++) if (wc[i] < plate[i]) { ok = false; break; }
        if (ok && (result.isEmpty() || word.length() < result.length())) result = word;
    }
    return result;
}`,
  },

  defaultInput: {
    licensePlate: '1s3 PSt',
    words: 'step,steps,stripe,stepple',
  },

  inputFields: [
    {
      name: 'licensePlate',
      label: 'License Plate',
      type: 'string',
      defaultValue: '1s3 PSt',
      placeholder: '1s3 PSt',
      helperText: 'The license plate string',
    },
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'step,steps,stripe,stepple',
      placeholder: 'step,steps,stripe,stepple',
      helperText: 'Comma-separated list of words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const licensePlate = input.licensePlate as string;
    const wordsRaw = input.words as string;
    const words = wordsRaw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words as unknown as number[],
      highlights,
      labels,
    });

    // Build plate frequency
    const plate: Record<string, number> = {};
    for (const c of licensePlate.toLowerCase()) {
      if (c >= 'a' && c <= 'z') plate[c] = (plate[c] || 0) + 1;
    }

    steps.push({
      line: 1,
      explanation: `Extract letters from license plate "${licensePlate}". Plate frequency: ${JSON.stringify(plate)}.`,
      variables: { licensePlate, plateFreq: JSON.stringify(plate) },
      visualization: makeViz({}, {}),
    });

    let result = '';

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const wc: Record<string, number> = {};
      for (const c of word.toLowerCase()) wc[c] = (wc[c] || 0) + 1;

      steps.push({
        line: 5,
        explanation: `Check word "${word}". Its letter frequency: ${JSON.stringify(wc)}.`,
        variables: { word, wordFreq: JSON.stringify(wc) },
        visualization: makeViz({ [wi]: 'active' }, { [wi]: 'checking' }),
      });

      const allPresent = Object.keys(plate).every(c => (wc[c] || 0) >= plate[c]);

      if (allPresent) {
        if (!result || word.length < result.length) {
          result = word;
          steps.push({
            line: 7,
            explanation: `Word "${word}" contains all plate letters and is shorter (len=${word.length}). Update result to "${word}".`,
            variables: { word, result, len: word.length },
            visualization: makeViz({ [wi]: 'found' }, { [wi]: 'new best' }),
          });
        } else {
          steps.push({
            line: 5,
            explanation: `Word "${word}" contains all plate letters but is not shorter than current result "${result}". Skip.`,
            variables: { word, result },
            visualization: makeViz({ [wi]: 'visited' }, { [wi]: 'longer' }),
          });
        }
      } else {
        steps.push({
          line: 5,
          explanation: `Word "${word}" does NOT contain all letters from the plate. Skip.`,
          variables: { word },
          visualization: makeViz({ [wi]: 'mismatch' }, { [wi]: 'no' }),
        });
      }
    }

    steps.push({
      line: 8,
      explanation: `Done. Shortest completing word is "${result}".`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default shortestCompletingWord;
