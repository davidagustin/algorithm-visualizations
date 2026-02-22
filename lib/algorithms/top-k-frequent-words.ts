import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const topKFrequentWords: AlgorithmDefinition = {
  id: 'top-k-frequent-words',
  title: 'Top K Frequent Words',
  leetcodeNumber: 692,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given an array of words and an integer k, return the k most frequent words sorted by frequency (descending). For words with the same frequency, sort alphabetically. Bucket sort approach: create buckets by frequency, then scan from highest to lowest, collecting words alphabetically until k words found.',
  tags: ['heap', 'hash map', 'bucket sort', 'sorting', 'string'],

  code: {
    pseudocode: `function topKFrequent(words, k):
  count = frequency map of words
  maxFreq = max frequency

  // bucket sort: bucket[freq] = sorted list of words
  buckets = array of size maxFreq+1
  for word, freq in count:
    buckets[freq].append(word)
    buckets[freq].sort()

  result = []
  for freq from maxFreq down to 1:
    for word in buckets[freq]:
      result.append(word)
      if len(result) == k: return result

  return result`,

    python: `from collections import Counter

def topKFrequent(words: list[str], k: int) -> list[str]:
    count = Counter(words)
    max_freq = max(count.values())
    buckets = [[] for _ in range(max_freq + 1)]
    for word, freq in count.items():
        buckets[freq].append(word)
    result = []
    for freq in range(max_freq, 0, -1):
        for word in sorted(buckets[freq]):
            result.append(word)
            if len(result) == k:
                return result
    return result`,

    javascript: `function topKFrequent(words, k) {
  const count = {};
  for (const w of words) count[w] = (count[w] || 0) + 1;
  const maxFreq = Math.max(...Object.values(count));
  const buckets = Array.from({ length: maxFreq + 1 }, () => []);
  for (const [word, freq] of Object.entries(count))
    buckets[freq].push(word);
  const result = [];
  for (let freq = maxFreq; freq >= 1; freq--) {
    for (const word of buckets[freq].sort()) {
      result.push(word);
      if (result.length === k) return result;
    }
  }
  return result;
}`,

    java: `public List<String> topKFrequent(String[] words, int k) {
    Map<String,Integer> count = new HashMap<>();
    for (String w : words) count.merge(w, 1, Integer::sum);
    int maxFreq = Collections.max(count.values());
    List<List<String>> buckets = new ArrayList<>();
    for (int i = 0; i <= maxFreq; i++) buckets.add(new ArrayList<>());
    for (var e : count.entrySet()) buckets.get(e.getValue()).add(e.getKey());
    List<String> res = new ArrayList<>();
    for (int f = maxFreq; f >= 1 && res.size() < k; f--) {
        Collections.sort(buckets.get(f));
        for (String w : buckets.get(f)) {
            res.add(w);
            if (res.size() == k) break;
        }
    }
    return res;
}`,
  },

  defaultInput: {
    nums: [1, 2, 2, 3, 3, 3, 4],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Word Frequencies (as counts)',
      type: 'array',
      defaultValue: [1, 2, 2, 3, 3, 3, 4],
      placeholder: '1,2,2,3,3,3,4',
      helperText: 'Simulated word occurrences (each number = one word occurrence)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const steps: AlgorithmStep[] = [];

    // Use a fixed word list for the visualization
    const words = ['love', 'hate', 'love', 'love', 'hate', 'code', 'code', 'code', 'love'];
    const k = 2;

    // Build frequency map
    const count: Record<string, number> = {};
    for (const w of words) count[w] = (count[w] || 0) + 1;

    steps.push({
      line: 1,
      explanation: `Count word frequencies in ["${words.join('", "')}"].`,
      variables: { words: words.join(', '), k },
      visualization: {
        type: 'array',
        array: words.map((_, i) => i + 1),
        highlights: {},
        labels: words.reduce((acc: Record<number, string>, w, i) => { acc[i] = w; return acc; }, {}),
      },
    });

    steps.push({
      line: 2,
      explanation: `Frequency map: ${Object.entries(count).map(([w, f]) => `"${w}"=${f}`).join(', ')}.`,
      variables: count,
      visualization: {
        type: 'array',
        array: Object.values(count),
        highlights: {},
        labels: Object.fromEntries(Object.keys(count).map((w, i) => [i, w])),
      },
    });

    const maxFreq = Math.max(...Object.values(count));
    const buckets: string[][] = Array.from({ length: maxFreq + 1 }, () => []);
    for (const [word, freq] of Object.entries(count)) {
      buckets[freq].push(word);
    }

    // Show buckets
    for (let f = maxFreq; f >= 1; f--) {
      if (buckets[f].length > 0) {
        steps.push({
          line: 7,
          explanation: `Bucket[${f}]: words with frequency ${f} = [${buckets[f].sort().join(', ')}].`,
          variables: { frequency: f, words: buckets[f].join(', ') },
          visualization: {
            type: 'array',
            array: Object.values(count),
            highlights: Object.keys(count).reduce((acc: Record<number, string>, w, i) => {
              if (count[w] === f) acc[i] = 'active';
              return acc;
            }, {}),
            labels: Object.fromEntries(Object.keys(count).map((w, i) => [i, `${w}:${count[w]}`])),
          },
        });
      }
    }

    // Collect results
    const result: string[] = [];
    for (let freq = maxFreq; freq >= 1; freq--) {
      for (const word of buckets[freq].sort()) {
        result.push(word);
        if (result.length === k) break;
      }
      if (result.length === k) break;
    }

    steps.push({
      line: 13,
      explanation: `Scan from highest frequency down. Collect words until we have k=${k}. Result: [${result.map(w => '"' + w + '"').join(', ')}].`,
      variables: { k, result: result.join(', ') },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i + 1),
        highlights: result.reduce((acc: Record<number, string>, _, i) => { acc[i] = 'found'; return acc; }, {}),
        labels: result.reduce((acc: Record<number, string>, w, i) => { acc[i] = w; return acc; }, {}),
      },
    });

    return steps;
  },
};

export default topKFrequentWords;
