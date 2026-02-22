import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const uniqueMorseCodeWords: AlgorithmDefinition = {
  id: 'unique-morse-code-words',
  title: 'Unique Morse Code Words',
  leetcodeNumber: 804,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a list of words, return the number of different Morse code representations. Each letter maps to its Morse code; a word maps to the concatenation of its letters codes. Count distinct concatenations.',
  tags: ['string', 'hash set'],

  code: {
    pseudocode: `function uniqueMorseRepresentations(words):
  morseTable = [".-","-...","-.-.",..] // 26 letters
  seen = empty set
  for word in words:
    code = ""
    for char in word:
      code += morseTable[char - 'a']
    seen.add(code)
  return len(seen)`,

    python: `def uniqueMorseRepresentations(words: list[str]) -> int:
    morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--","-.",
             "---",".--.","--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."]
    seen = set()
    for word in words:
        seen.add(''.join(morse[ord(c) - ord('a')] for c in word))
    return len(seen)`,

    javascript: `function uniqueMorseRepresentations(words) {
  const morse = [".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--",
                 "-.","-.-.",".--.",".--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."];
  const seen = new Set();
  for (const word of words) {
    seen.add(word.split('').map(c => morse[c.charCodeAt(0) - 97]).join(''));
  }
  return seen.size;
}`,

    java: `public int uniqueMorseRepresentations(String[] words) {
    String[] morse = {".-","-...","-.-.","-..",".","..-.","--.","....","..",".---","-.-",".-..","--",
                      "-.","-.-.",".--.",".--.-",".-.","...","-","..-","...-",".--","-..-","-.--","--.."};
    Set<String> seen = new HashSet<>();
    for (String word : words) {
        StringBuilder sb = new StringBuilder();
        for (char c : word.toCharArray()) sb.append(morse[c - 'a']);
        seen.add(sb.toString());
    }
    return seen.size();
}`,
  },

  defaultInput: {
    words: 'gin,zen,gig,msg',
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'string',
      defaultValue: 'gin,zen,gig,msg',
      placeholder: 'gin,zen,gig,msg',
      helperText: 'Comma-separated list of words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const wordsRaw = input.words as string;
    const words = wordsRaw.split(',').map(w => w.trim());
    const steps: AlgorithmStep[] = [];

    const morse = [
      '.-', '-...', '-.-.', '-..', '.', '..-.', '--.', '....', '..', '.---',
      '-.-', '.-..', '--', '-.', '---', '.--.', '--.-', '.-.', '...', '-',
      '..-', '...-', '.--', '-..-', '-.--', '--..',
    ];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: words as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Words: [${words.map(w => `"${w}"`).join(', ')}]. We encode each word to Morse and count unique encodings.`,
      variables: { words: words.join(',') },
      visualization: makeViz({}, {}),
    });

    const seen = new Set<string>();

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      const code = word.split('').map(c => morse[c.charCodeAt(0) - 97]).join('');

      steps.push({
        line: 5,
        explanation: `Word "${word}" encodes to "${code}". ${seen.has(code) ? 'Already seen this code.' : 'New unique code.'}`,
        variables: { word, morseCode: code, isNew: !seen.has(code) },
        visualization: makeViz(
          { [wi]: seen.has(code) ? 'visited' : 'found' },
          { [wi]: code }
        ),
      });

      seen.add(code);
    }

    steps.push({
      line: 8,
      explanation: `Total unique Morse representations: ${seen.size}. Unique codes: [${Array.from(seen).join(', ')}].`,
      variables: { result: seen.size, uniqueCodes: Array.from(seen).join(', ') },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default uniqueMorseCodeWords;
