import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countOfSubstringsContainingEveryVowel: AlgorithmDefinition = {
  id: 'count-of-substrings-containing-every-vowel',
  title: 'Count of Substrings Containing Every Vowel and K Consonants II',
  leetcodeNumber: 3305,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'Given a string word and a non-negative integer k, return the total number of substrings of word that contain every vowel at least once and exactly k consonants. Use the formula: count(at_least_k) - count(at_least_k+1) to get exactly k consonants with all vowels present.',
  tags: ['sliding window', 'hash map', 'string'],

  code: {
    pseudocode: `function countOfSubstrings(word, k):
  return atLeast(word, k) - atLeast(word, k+1)

function atLeast(word, k):
  vowels = {a,e,i,o,u}
  vowelCount = {}
  consonants = 0
  left = 0
  result = 0
  for right in range(len(word)):
    if word[right] in vowels:
      vowelCount[word[right]] += 1
    else:
      consonants++
    while len(vowelCount)==5 and consonants>=k:
      result += len(word) - right
      remove left char from window
      left++
  return result`,

    python: `def countOfSubstrings(word: str, k: int) -> int:
    def atLeast(k):
        vowels = set('aeiou')
        vc = {}
        cons = 0
        left = 0
        res = 0
        for right, c in enumerate(word):
            if c in vowels:
                vc[c] = vc.get(c, 0) + 1
            else:
                cons += 1
            while len(vc) == 5 and cons >= k:
                res += len(word) - right
                lc = word[left]
                if lc in vowels:
                    vc[lc] -= 1
                    if vc[lc] == 0: del vc[lc]
                else:
                    cons -= 1
                left += 1
        return res
    return atLeast(k) - atLeast(k + 1)`,

    javascript: `function countOfSubstrings(word, k) {
  const vowels = new Set('aeiou');
  const atLeast = k => {
    const vc = new Map();
    let cons = 0, left = 0, res = 0;
    for (let right = 0; right < word.length; right++) {
      if (vowels.has(word[right])) vc.set(word[right], (vc.get(word[right])||0)+1);
      else cons++;
      while (vc.size === 5 && cons >= k) {
        res += word.length - right;
        const lc = word[left];
        if (vowels.has(lc)) { vc.set(lc, vc.get(lc)-1); if (!vc.get(lc)) vc.delete(lc); }
        else cons--;
        left++;
      }
    }
    return res;
  };
  return atLeast(k) - atLeast(k + 1);
}`,

    java: `public long countOfSubstrings(String word, int k) {
    return atLeast(word, k) - atLeast(word, k + 1);
}
private long atLeast(String word, int k) {
    Set<Character> vowels = Set.of('a','e','i','o','u');
    Map<Character,Integer> vc = new HashMap<>();
    int cons = 0, left = 0; long res = 0;
    for (int right = 0; right < word.length(); right++) {
        char c = word.charAt(right);
        if (vowels.contains(c)) vc.merge(c, 1, Integer::sum);
        else cons++;
        while (vc.size() == 5 && cons >= k) {
            res += word.length() - right;
            char lc = word.charAt(left);
            if (vowels.contains(lc)) { vc.merge(lc,-1,Integer::sum); if(vc.get(lc)==0)vc.remove(lc); }
            else cons--;
            left++;
        }
    }
    return res;
}`,
  },

  defaultInput: {
    word: 'aeioqq',
    k: 1,
  },

  inputFields: [
    {
      name: 'word',
      label: 'Word',
      type: 'string',
      defaultValue: 'aeioqq',
      placeholder: 'aeioqq',
      helperText: 'Lowercase English string',
    },
    {
      name: 'k',
      label: 'Exact Consonants k',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Substrings must have exactly k consonants',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const word = input.word as string;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    const arr = word.split('').map(c => vowels.has(c) ? 1 : 0);

    steps.push({
      line: 1,
      explanation: `Count substrings with all 5 vowels and exactly ${k} consonants. Use atLeast(${k}) - atLeast(${k + 1}).`,
      variables: { k, formula: `atLeast(${k}) - atLeast(${k + 1})` },
      visualization: {
        type: 'array',
        array: arr,
        highlights: Object.fromEntries(word.split('').map((c, i) => [i, vowels.has(c) ? 'found' : 'active'])),
        labels: Object.fromEntries(word.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    const atLeast = (minK: number): number => {
      const vc = new Map<string, number>();
      let cons = 0, left = 0, res = 0;
      for (let right = 0; right < word.length; right++) {
        const c = word[right];
        if (vowels.has(c)) vc.set(c, (vc.get(c) || 0) + 1);
        else cons++;
        while (vc.size === 5 && cons >= minK) {
          res += word.length - right;
          const lc = word[left];
          if (vowels.has(lc)) { vc.set(lc, vc.get(lc)! - 1); if (!vc.get(lc)) vc.delete(lc); }
          else cons--;
          left++;
        }
      }
      return res;
    };

    const al1 = atLeast(k);
    const al2 = atLeast(k + 1);

    steps.push({
      line: 4,
      explanation: `Compute atLeast(${k}): subarrays with all vowels and >= ${k} consonants = ${al1}.`,
      variables: { atLeastK: al1 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(word.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    steps.push({
      line: 5,
      explanation: `Compute atLeast(${k + 1}): subarrays with all vowels and >= ${k + 1} consonants = ${al2}.`,
      variables: { atLeastKplus1: al2 },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(word.split('').map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    const result = al1 - al2;

    steps.push({
      line: 2,
      explanation: `Exactly k=${k} consonants with all vowels = atLeast(${k}) - atLeast(${k + 1}) = ${al1} - ${al2} = ${result}.`,
      variables: { result },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default countOfSubstringsContainingEveryVowel;
