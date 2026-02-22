import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const maximumLengthOfConcatenatedString: AlgorithmDefinition = {
  id: 'maximum-length-of-concatenated-string',
  title: 'Maximum Length of a Concatenated String with Unique Characters',
  leetcodeNumber: 1239,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given an array of strings, find the maximum length of a concatenation of a subsequence of strings such that the concatenated string has unique characters. Uses backtracking with bitmask to efficiently track which characters are used and detect duplicates within individual strings.',
  tags: ['backtracking', 'bit manipulation', 'string', 'bitmask', 'recursion'],

  code: {
    pseudocode: `function maxLength(arr):
  maxLen = 0
  backtrack(arr, 0, 0, 0)
  return maxLen

function backtrack(arr, index, currentMask, currentLen):
  maxLen = max(maxLen, currentLen)
  for i from index to len(arr)-1:
    wordMask = getMask(arr[i])
    if wordMask != -1 and (wordMask & currentMask) == 0:
      backtrack(arr, i+1, currentMask | wordMask, currentLen + len(arr[i]))

function getMask(word):
  mask = 0
  for each char in word:
    bit = 1 << (char - 'a')
    if bit & mask != 0: return -1 (duplicate within word)
    mask |= bit
  return mask`,

    python: `def maxLength(arr: list[str]) -> int:
    max_len = [0]
    def get_mask(word):
        mask = 0
        for ch in word:
            bit = 1 << (ord(ch) - ord('a'))
            if mask & bit:
                return -1
            mask |= bit
        return mask
    def backtrack(index, current_mask, current_len):
        max_len[0] = max(max_len[0], current_len)
        for i in range(index, len(arr)):
            word_mask = get_mask(arr[i])
            if word_mask != -1 and (word_mask & current_mask) == 0:
                backtrack(i + 1, current_mask | word_mask, current_len + len(arr[i]))
    backtrack(0, 0, 0)
    return max_len[0]`,

    javascript: `function maxLength(arr) {
  let maxLen = 0;
  function getMask(word) {
    let mask = 0;
    for (const ch of word) {
      const bit = 1 << (ch.charCodeAt(0) - 97);
      if (mask & bit) return -1;
      mask |= bit;
    }
    return mask;
  }
  function backtrack(index, currentMask, currentLen) {
    maxLen = Math.max(maxLen, currentLen);
    for (let i = index; i < arr.length; i++) {
      const wordMask = getMask(arr[i]);
      if (wordMask !== -1 && (wordMask & currentMask) === 0) {
        backtrack(i + 1, currentMask | wordMask, currentLen + arr[i].length);
      }
    }
  }
  backtrack(0, 0, 0);
  return maxLen;
}`,

    java: `public int maxLength(List<String> arr) {
    int[] maxLen = {0};
    backtrack(arr, 0, 0, 0, maxLen);
    return maxLen[0];
}
private int getMask(String word) {
    int mask = 0;
    for (char ch : word.toCharArray()) {
        int bit = 1 << (ch - 'a');
        if ((mask & bit) != 0) return -1;
        mask |= bit;
    }
    return mask;
}
private void backtrack(List<String> arr, int index, int mask, int len, int[] maxLen) {
    maxLen[0] = Math.max(maxLen[0], len);
    for (int i = index; i < arr.size(); i++) {
        int wordMask = getMask(arr.get(i));
        if (wordMask != -1 && (wordMask & mask) == 0)
            backtrack(arr, i + 1, mask | wordMask, len + arr.get(i).length(), maxLen);
    }
}`,
  },

  defaultInput: {
    arr: ['un', 'iq', 'ue'],
  },

  inputFields: [
    {
      name: 'arr',
      label: 'String Array',
      type: 'array',
      defaultValue: ['un', 'iq', 'ue'],
      placeholder: 'un,iq,ue',
      helperText: 'Comma-separated strings',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const arr = input.arr as string[];
    const steps: AlgorithmStep[] = [];
    let maxLen = 0;

    function getMask(word: string): number {
      let mask = 0;
      for (const ch of word) {
        const bit = 1 << (ch.charCodeAt(0) - 97);
        if (mask & bit) return -1;
        mask |= bit;
      }
      return mask;
    }

    steps.push({
      line: 1,
      explanation: `Starting max unique concatenation. Words: [${arr.map(w => `"${w}"`).join(', ')}]. Will use bitmask to track unique chars.`,
      variables: { words: arr, maxLen: 0 },
      visualization: {
        type: 'array',
        array: arr.map(w => w.length),
        highlights: {},
        labels: arr.reduce((acc, w, i) => ({ ...acc, [i]: w }), {} as Record<number, string>),
      },
    });

    const precomputed = arr.map(w => ({ word: w, mask: getMask(w) }));
    for (const { word, mask } of precomputed) {
      steps.push({
        line: 12,
        explanation: `Precompute mask for "${word}": ${mask === -1 ? 'INVALID (duplicate chars within word)' : `mask=${mask.toString(2)} (binary)`}`,
        variables: { word, mask: mask === -1 ? 'invalid' : mask.toString(2), valid: mask !== -1 },
        visualization: {
          type: 'array',
          array: arr.map(w => w.length),
          highlights: { [arr.indexOf(word)]: mask === -1 ? 'mismatch' : 'active' },
          labels: arr.reduce((acc, w, i) => ({ ...acc, [i]: w }), {} as Record<number, string>),
        },
      });
    }

    function backtrack(index: number, currentMask: number, currentLen: number, chosen: string[]) {
      if (currentLen > maxLen) {
        maxLen = currentLen;
        steps.push({
          line: 6,
          explanation: `New max length: ${maxLen} from combination [${chosen.map(w => `"${w}"`).join('+')}]`,
          variables: { maxLen, chosen, currentLen },
          visualization: {
            type: 'array',
            array: arr.map(w => w.length),
            highlights: chosen.reduce((acc, w) => {
              const i = arr.indexOf(w);
              return i >= 0 ? { ...acc, [i]: 'found' } : acc;
            }, {}),
            labels: arr.reduce((acc, w, i) => ({ ...acc, [i]: chosen.includes(w) ? `"${w}"` : w }), {} as Record<number, string>),
          },
        });
      }

      for (let i = index; i < arr.length; i++) {
        const wordMask = precomputed[i].mask;
        if (wordMask !== -1 && (wordMask & currentMask) === 0) {
          steps.push({
            line: 9,
            explanation: `Add "${arr[i]}" to combination. No overlap with current chars. New length: ${currentLen + arr[i].length}.`,
            variables: { adding: arr[i], currentLen: currentLen + arr[i].length, maxLen },
            visualization: {
              type: 'array',
              array: arr.map(w => w.length),
              highlights: { [i]: 'active' },
              labels: arr.reduce((acc, w, j) => ({ ...acc, [j]: [...chosen, arr[i]].includes(w) ? `+${w}` : w }), {} as Record<number, string>),
            },
          });
          backtrack(i + 1, currentMask | wordMask, currentLen + arr[i].length, [...chosen, arr[i]]);
        } else if (wordMask !== -1) {
          steps.push({
            line: 9,
            explanation: `Skip "${arr[i]}": character overlap with current selection. Bitmask conflict detected.`,
            variables: { skipping: arr[i], reason: 'overlap', currentMask: currentMask.toString(2), wordMask: wordMask.toString(2) },
            visualization: {
              type: 'array',
              array: arr.map(w => w.length),
              highlights: { [i]: 'mismatch' },
              labels: arr.reduce((acc, w, j) => ({ ...acc, [j]: w }), {} as Record<number, string>),
            },
          });
        }
      }
    }

    backtrack(0, 0, 0, []);

    steps.push({
      line: 4,
      explanation: `Backtracking complete. Maximum length of unique character concatenation: ${maxLen}.`,
      variables: { maxLen, totalWords: arr.length },
      visualization: {
        type: 'array',
        array: arr.map(w => w.length),
        highlights: arr.reduce((acc, _, i) => ({ ...acc, [i]: 'sorted' }), {}),
        labels: { 0: `Max: ${maxLen}` },
      },
    });

    return steps;
  },
};

export default maximumLengthOfConcatenatedString;
