import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validWordAbbreviation: AlgorithmDefinition = {
  id: 'valid-word-abbreviation',
  title: 'Valid Word Abbreviation',
  leetcodeNumber: 408,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a non-empty string word and an abbreviation abbr, determine if abbr is a valid abbreviation of word. A number in abbr represents skipping that many characters in word. Numbers cannot have leading zeros.',
  tags: ['string', 'two pointers'],

  code: {
    pseudocode: `function validWordAbbreviation(word, abbr):
  i = 0, j = 0
  while i < len(word) and j < len(abbr):
    if abbr[j] is digit:
      if abbr[j] == '0': return false  // no leading zeros
      num = 0
      while j < len(abbr) and abbr[j] is digit:
        num = num * 10 + abbr[j]
        j++
      i += num
    else:
      if word[i] != abbr[j]: return false
      i++, j++
  return i == len(word) and j == len(abbr)`,

    python: `def validWordAbbreviation(word: str, abbr: str) -> bool:
    i = j = 0
    while i < len(word) and j < len(abbr):
        if abbr[j].isdigit():
            if abbr[j] == '0':
                return False
            num = 0
            while j < len(abbr) and abbr[j].isdigit():
                num = num * 10 + int(abbr[j])
                j += 1
            i += num
        else:
            if word[i] != abbr[j]:
                return False
            i += 1
            j += 1
    return i == len(word) and j == len(abbr)`,

    javascript: `function validWordAbbreviation(word, abbr) {
  let i = 0, j = 0;
  while (i < word.length && j < abbr.length) {
    if (abbr[j] >= '0' && abbr[j] <= '9') {
      if (abbr[j] === '0') return false;
      let num = 0;
      while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') {
        num = num * 10 + parseInt(abbr[j]);
        j++;
      }
      i += num;
    } else {
      if (word[i] !== abbr[j]) return false;
      i++; j++;
    }
  }
  return i === word.length && j === abbr.length;
}`,

    java: `public boolean validWordAbbreviation(String word, String abbr) {
    int i = 0, j = 0;
    while (i < word.length() && j < abbr.length()) {
        if (Character.isDigit(abbr.charAt(j))) {
            if (abbr.charAt(j) == '0') return false;
            int num = 0;
            while (j < abbr.length() && Character.isDigit(abbr.charAt(j))) {
                num = num * 10 + (abbr.charAt(j) - '0');
                j++;
            }
            i += num;
        } else {
            if (word.charAt(i) != abbr.charAt(j)) return false;
            i++; j++;
        }
    }
    return i == word.length() && j == abbr.length();
}`,
  },

  defaultInput: {
    word: 'internationalization',
    abbr: 'i12iz4n',
  },

  inputFields: [
    {
      name: 'word',
      label: 'Word',
      type: 'string',
      defaultValue: 'internationalization',
      placeholder: 'internationalization',
      helperText: 'The full word',
    },
    {
      name: 'abbr',
      label: 'Abbreviation',
      type: 'string',
      defaultValue: 'i12iz4n',
      placeholder: 'i12iz4n',
      helperText: 'The abbreviation to validate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const abbr = input.abbr as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: word.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Validate if "${abbr}" is a valid abbreviation of "${word}". Initialize i=0 (word pointer), j=0 (abbr pointer).`,
      variables: { i: 0, j: 0, word, abbr },
      visualization: makeViz({}, {}),
    });

    let i = 0;
    let j = 0;

    while (i < word.length && j < abbr.length) {
      if (abbr[j] >= '0' && abbr[j] <= '9') {
        if (abbr[j] === '0') {
          steps.push({
            line: 5,
            explanation: `Found leading zero in abbreviation at position ${j}. Return false.`,
            variables: { i, j, result: false },
            visualization: makeViz({ [i]: 'mismatch' }, { [i]: `i=${i}` }),
          });
          return steps;
        }

        let num = 0;
        const jStart = j;
        while (j < abbr.length && abbr[j] >= '0' && abbr[j] <= '9') {
          num = num * 10 + parseInt(abbr[j]);
          j++;
        }

        steps.push({
          line: 7,
          explanation: `Found number ${num} in abbreviation (abbr[${jStart}..${j - 1}]). Skip ${num} characters in word: i moves from ${i} to ${i + num}.`,
          variables: { i, j, num, skipFrom: i, skipTo: i + num },
          visualization: makeViz(
            Object.fromEntries(
              Array.from({ length: Math.min(num, word.length - i) }, (_, k) => [i + k, 'visited'])
            ),
            { [i]: `skip ${num}` }
          ),
        });

        i += num;
      } else {
        steps.push({
          line: 9,
          explanation: `Compare word[${i}]="${word[i]}" with abbr[${j}]="${abbr[j]}".`,
          variables: { i, j, wordChar: word[i], abbrChar: abbr[j] },
          visualization: makeViz({ [i]: 'comparing' }, { [i]: `i=${i}` }),
        });

        if (word[i] !== abbr[j]) {
          steps.push({
            line: 10,
            explanation: `Mismatch: word[${i}]="${word[i]}" != abbr[${j}]="${abbr[j]}". Return false.`,
            variables: { i, j, result: false },
            visualization: makeViz({ [i]: 'mismatch' }, { [i]: 'mismatch' }),
          });
          return steps;
        }

        steps.push({
          line: 11,
          explanation: `Match: word[${i}]="${word[i]}" == abbr[${j}]="${abbr[j]}". Advance both pointers.`,
          variables: { i: i + 1, j: j + 1 },
          visualization: makeViz({ [i]: 'match' }, { [i]: 'match' }),
        });

        i++;
        j++;
      }
    }

    const result = i === word.length && j === abbr.length;
    steps.push({
      line: 12,
      explanation: `End of traversal. i=${i} (word.length=${word.length}), j=${j} (abbr.length=${abbr.length}). Both exhausted: ${result}.`,
      variables: { i, j, result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default validWordAbbreviation;
