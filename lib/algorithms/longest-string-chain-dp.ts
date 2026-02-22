import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const longestStringChainDp: AlgorithmDefinition = {
  id: 'longest-string-chain-dp',
  title: 'Longest String Chain (DP)',
  leetcodeNumber: 1048,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Given a list of words, find the longest chain where each word is a predecessor of the next (differs by exactly one inserted character). Sort by length, then for each word try removing each character and check if the result is in the chain.',
  tags: ['dynamic programming', 'string', 'hash map', 'sorting'],

  code: {
    pseudocode: `function longestStrChain(words):
  sort words by length
  dp = {} // word -> longest chain ending here
  result = 1
  for word in words:
    dp[word] = 1
    for i in 0..len(word)-1:
      prev = word[:i] + word[i+1:]
      if prev in dp:
        dp[word] = max(dp[word], dp[prev]+1)
    result = max(result, dp[word])
  return result`,
    python: `def longestStrChain(words: list[str]) -> int:
    words.sort(key=len)
    dp = {}
    result = 1
    for word in words:
        dp[word] = 1
        for i in range(len(word)):
            prev = word[:i]+word[i+1:]
            if prev in dp:
                dp[word] = max(dp[word], dp[prev]+1)
        result = max(result, dp[word])
    return result`,
    javascript: `function longestStrChain(words) {
  words.sort((a,b)=>a.length-b.length);
  const dp = new Map();
  let result = 1;
  for (const word of words) {
    dp.set(word, 1);
    for (let i = 0; i < word.length; i++) {
      const prev = word.slice(0,i)+word.slice(i+1);
      if (dp.has(prev)) dp.set(word, Math.max(dp.get(word), dp.get(prev)+1));
    }
    result = Math.max(result, dp.get(word));
  }
  return result;
}`,
    java: `public int longestStrChain(String[] words) {
    Arrays.sort(words, (a,b)->a.length()-b.length());
    Map<String,Integer> dp = new HashMap<>();
    int result = 1;
    for (String word : words) {
        dp.put(word, 1);
        for (int i = 0; i < word.length(); i++) {
            String prev = word.substring(0,i)+word.substring(i+1);
            if (dp.containsKey(prev))
                dp.put(word, Math.max(dp.get(word), dp.get(prev)+1));
        }
        result = Math.max(result, dp.get(word));
    }
    return result;
}`,
  },

  defaultInput: {
    words: ['a', 'b', 'ba', 'bca', 'bda', 'bdca'],
  },

  inputFields: [
    {
      name: 'words',
      label: 'Words (comma-separated)',
      type: 'array',
      defaultValue: ['a', 'b', 'ba', 'bca', 'bda', 'bdca'],
      placeholder: 'a,b,ba,bca,bda,bdca',
      helperText: 'List of words to chain',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const words = (input.words as unknown[]).map(String);
    const steps: AlgorithmStep[] = [];

    words.sort((a, b) => a.length - b.length);

    steps.push({
      line: 1,
      explanation: `Sort words by length: [${words.map(w => '"' + w + '"').join(', ')}].`,
      variables: { words: JSON.stringify(words) },
      visualization: {
        type: 'array',
        array: words.map(w => w.length),
        highlights: {},
        labels: words.reduce((a, w, i) => ({ ...a, [i]: w }), {}),
      } as ArrayVisualization,
    });

    const dp = new Map<string, number>();
    let result = 1;

    for (let wi = 0; wi < words.length; wi++) {
      const word = words[wi];
      dp.set(word, 1);

      steps.push({
        line: 5,
        explanation: `Processing word="${word}". Try removing each character to find predecessor.`,
        variables: { word, 'dp[word]': 1 },
        visualization: {
          type: 'array',
          array: words.map(w => dp.get(w) ?? 0),
          highlights: { [wi]: 'active' },
          labels: { [wi]: word },
        } as ArrayVisualization,
      });

      for (let i = 0; i < word.length; i++) {
        const prev = word.slice(0, i) + word.slice(i + 1);
        if (dp.has(prev)) {
          const newVal = dp.get(prev)! + 1;
          if (newVal > dp.get(word)!) {
            dp.set(word, newVal);
            steps.push({
              line: 8,
              explanation: `Remove word[${i}]='${word[i]}': prev="${prev}" found in dp with value ${dp.get(prev)}. dp["${word}"] = ${newVal}.`,
              variables: { word, prev, 'dp[word]': newVal },
              visualization: {
                type: 'array',
                array: words.map(w => dp.get(w) ?? 0),
                highlights: { [wi]: 'found', [words.indexOf(prev)]: 'comparing' },
                labels: { [wi]: `dp=${newVal}` },
              } as ArrayVisualization,
            });
          }
        }
      }

      result = Math.max(result, dp.get(word)!);
    }

    steps.push({
      line: 11,
      explanation: `Longest string chain = ${result}.`,
      variables: { result, dp: Object.fromEntries(dp) },
      visualization: {
        type: 'array',
        array: words.map(w => dp.get(w) ?? 0),
        highlights: {},
        labels: { 0: `max=${result}` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default longestStringChainDp;
