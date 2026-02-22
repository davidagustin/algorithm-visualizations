import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const longestPalindromeByConcatenatingTwoLetterWords: AlgorithmDefinition = {
  id: 'longest-palindrome-by-concatenating-two-letter-words',
  title: 'Longest Palindrome by Concatenating Two-Letter Words',
  leetcodeNumber: 2131,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given an array of two-letter words, form the longest palindrome by concatenating some of them. A pair like "ab" and "ba" can be placed symmetrically. Words like "aa" (palindromes themselves) can be placed in pairs, with at most one placed in the center. Count pairs greedily using a frequency map.',
  tags: ['dynamic programming', 'greedy', 'hash map', 'string'],

  code: {
    pseudocode: `function longestPalindrome(words):
  count = frequency map of words
  length = 0
  centerUsed = false
  for word in count:
    rev = reverse(word)
    if word == rev:
      pairs = count[word] // 2
      length += pairs * 4
      if count[word] is odd and not centerUsed:
        length += 2
        centerUsed = true
    elif word < rev and rev in count:
      pairs = min(count[word], count[rev])
      length += pairs * 4
  return length`,

    python: `def longestPalindrome(words):
    from collections import Counter
    count = Counter(words)
    length = 0
    centerUsed = False
    for word, cnt in count.items():
        rev = word[::-1]
        if word == rev:
            length += (cnt // 2) * 4
            if cnt % 2 == 1 and not centerUsed:
                length += 2; centerUsed = True
        elif word < rev and rev in count:
            length += min(cnt, count[rev]) * 4
    return length`,

    javascript: `function longestPalindrome(words) {
  const count = {};
  for (const w of words) count[w] = (count[w]||0)+1;
  let length=0, centerUsed=false;
  for (const [word,cnt] of Object.entries(count)) {
    const rev = word[1]+word[0];
    if (word===rev) {
      length += Math.floor(cnt/2)*4;
      if (cnt%2===1 && !centerUsed) { length+=2; centerUsed=true; }
    } else if (word<rev && count[rev]) {
      length += Math.min(cnt,count[rev])*4;
    }
  }
  return length;
}`,

    java: `public int longestPalindrome(String[] words) {
    Map<String,Integer> cnt = new HashMap<>();
    for (String w : words) cnt.merge(w,1,Integer::sum);
    int length=0; boolean center=false;
    for (Map.Entry<String,Integer> e : cnt.entrySet()) {
        String w=e.getKey(); int c=e.getValue();
        String rev=""+w.charAt(1)+w.charAt(0);
        if (w.equals(rev)) {
            length+=c/2*4;
            if(c%2==1&&!center){length+=2;center=true;}
        } else if(w.compareTo(rev)<0&&cnt.containsKey(rev)) {
            length+=Math.min(c,cnt.get(rev))*4;
        }
    }
    return length;
}`,
  },

  defaultInput: {
    words: ['lc', 'cl', 'gg'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Two-Letter Words',
      type: 'array',
      defaultValue: ['lc', 'cl', 'gg'],
      placeholder: 'lc,cl,gg',
      helperText: 'Array of two-letter lowercase words',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = input.words as string[];
    const steps: AlgorithmStep[] = [];

    const count: Record<string, number> = {};
    for (const w of words) count[w] = (count[w] || 0) + 1;

    steps.push({
      line: 1,
      explanation: `Words: [${words.map(w => `"${w}"`).join(', ')}]. Frequency map: {${Object.entries(count).map(([k, v]) => `"${k}":${v}`).join(', ')}}.`,
      variables: { wordCount: words.length, uniqueWords: Object.keys(count).length },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, w])),
      },
    });

    let length = 0;
    let centerUsed = false;
    const wordList = Object.keys(count);

    for (let wi = 0; wi < wordList.length; wi++) {
      const word = wordList[wi];
      const cnt = count[word];
      const rev = word[1] + word[0];

      if (word === rev) {
        const pairs = Math.floor(cnt / 2);
        length += pairs * 4;
        let centerAdded = 0;
        if (cnt % 2 === 1 && !centerUsed) {
          length += 2;
          centerUsed = true;
          centerAdded = 2;
        }
        steps.push({
          line: 5,
          explanation: `"${word}" is a self-palindrome (same reversed). ${pairs} pair(s) -> +${pairs * 4} chars. ${centerAdded > 0 ? `One extra in center -> +${centerAdded}.` : ''} Total length: ${length}.`,
          variables: { word, count: cnt, pairs, lengthAdded: pairs * 4 + centerAdded, totalLength: length },
          visualization: {
            type: 'array',
            array: words.map((_, i) => i),
            highlights: Object.fromEntries(words.map((w, i) => [i, w === word ? 'found' : 'default'])),
            labels: Object.fromEntries(words.map((w, i) => [i, w])),
          },
        });
      } else if (word < rev && count[rev]) {
        const pairs = Math.min(cnt, count[rev]);
        length += pairs * 4;
        steps.push({
          line: 9,
          explanation: `"${word}" + "${rev}" form a pair. ${pairs} pair(s) -> +${pairs * 4} chars. Total length: ${length}.`,
          variables: { word, reverse: rev, pairs, lengthAdded: pairs * 4, totalLength: length },
          visualization: {
            type: 'array',
            array: words.map((_, i) => i),
            highlights: Object.fromEntries(words.map((w, i) => [i, (w === word || w === rev) ? 'active' : 'default'])),
            labels: Object.fromEntries(words.map((w, i) => [i, w])),
          },
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Longest palindrome by concatenating two-letter words: ${length} characters.`,
      variables: { answer: length },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(words.map((w, i) => [i, w])),
      },
    });

    return steps;
  },
};

export default longestPalindromeByConcatenatingTwoLetterWords;
