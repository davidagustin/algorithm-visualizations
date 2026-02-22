import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const goatLatin: AlgorithmDefinition = {
  id: 'goat-latin',
  title: 'Goat Latin',
  leetcodeNumber: 824,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Transform a sentence into Goat Latin. Rules: (1) If a word begins with a vowel, append "ma" to the end. (2) If a word begins with a consonant, remove the first letter, put it at the end, then add "ma". (3) Add one "a" per word index (1-indexed) at the end.',
  tags: ['string', 'simulation'],

  code: {
    pseudocode: `function toGoatLatin(sentence):
  vowels = set of a,e,i,o,u (upper and lower)
  words = sentence.split()
  result = []
  for i, word in enumerate(words):
    if word[0] in vowels:
      transformed = word + "ma"
    else:
      transformed = word[1:] + word[0] + "ma"
    transformed += "a" * (i + 1)
    result.append(transformed)
  return result.join(" ")`,

    python: `def toGoatLatin(sentence: str) -> str:
    vowels = set('aeiouAEIOU')
    words = sentence.split()
    result = []
    for i, word in enumerate(words):
        if word[0] in vowels:
            transformed = word + 'ma'
        else:
            transformed = word[1:] + word[0] + 'ma'
        transformed += 'a' * (i + 1)
        result.append(transformed)
    return ' '.join(result)`,

    javascript: `function toGoatLatin(sentence) {
  const vowels = new Set('aeiouAEIOU');
  return sentence.split(' ').map((word, i) => {
    let t = vowels.has(word[0]) ? word + 'ma' : word.slice(1) + word[0] + 'ma';
    return t + 'a'.repeat(i + 1);
  }).join(' ');
}`,

    java: `public String toGoatLatin(String sentence) {
    Set<Character> vowels = new HashSet<>(Arrays.asList('a','e','i','o','u','A','E','I','O','U'));
    String[] words = sentence.split(" ");
    StringBuilder sb = new StringBuilder();
    for (int i = 0; i < words.length; i++) {
        String w = words[i];
        String t = vowels.contains(w.charAt(0)) ? w + "ma" : w.substring(1) + w.charAt(0) + "ma";
        t += "a".repeat(i + 1);
        if (i > 0) sb.append(" ");
        sb.append(t);
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    sentence: 'I speak Goat Latin',
  },

  inputFields: [
    {
      name: 'sentence',
      label: 'Sentence',
      type: 'string',
      defaultValue: 'I speak Goat Latin',
      placeholder: 'I speak Goat Latin',
      helperText: 'Input sentence to convert',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sentence = input.sentence as string;
    const steps: AlgorithmStep[] = [];
    const vowels = new Set('aeiouAEIOU');
    const words = sentence.split(' ');

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
      explanation: `Split sentence into words: [${words.map(w => `"${w}"`).join(', ')}]. Process each word with Goat Latin rules.`,
      variables: { sentence, wordCount: words.length },
      visualization: makeViz({}, {}),
    });

    const result: string[] = [];

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const isVowel = vowels.has(word[0]);

      steps.push({
        line: 5,
        explanation: `Word ${i + 1}: "${word}". First letter "${word[0]}" is a ${isVowel ? 'vowel' : 'consonant'}.`,
        variables: { wordIndex: i + 1, word, firstLetter: word[0], isVowel },
        visualization: makeViz({ [i]: 'active' }, { [i]: `#${i + 1}` }),
      });

      let transformed: string;
      if (isVowel) {
        transformed = word + 'ma';
        steps.push({
          line: 7,
          explanation: `Vowel start: append "ma" to "${word}" => "${transformed}".`,
          variables: { transformed },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `+ma` }),
        });
      } else {
        transformed = word.slice(1) + word[0] + 'ma';
        steps.push({
          line: 9,
          explanation: `Consonant start: move first letter "${word[0]}" to end and add "ma": "${word.slice(1) + word[0]}" + "ma" = "${transformed}".`,
          variables: { transformed },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `move+ma` }),
        });
      }

      const suffix = 'a'.repeat(i + 1);
      transformed += suffix;
      steps.push({
        line: 10,
        explanation: `Add ${i + 1} "a"(s): "${transformed}". This is word #${i + 1} so suffix is "${suffix}".`,
        variables: { transformed, suffix, suffixCount: i + 1 },
        visualization: makeViz({ [i]: 'found' }, { [i]: `"${transformed}"` }),
      });

      result.push(transformed);
    }

    steps.push({
      line: 11,
      explanation: `Join results: "${result.join(' ')}".`,
      variables: { result: result.join(' ') },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default goatLatin;
