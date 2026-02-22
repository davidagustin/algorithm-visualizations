import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const kMostFrequentStrings: AlgorithmDefinition = {
  id: 'k-most-frequent-strings',
  title: 'K Most Frequent Strings',
  leetcodeNumber: 692,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Find the k most frequently occurring strings. First count frequencies with a hash map, then use a min-heap of size k to efficiently extract the top k elements.',
  tags: ['Heap', 'Hash Map', 'Sorting'],
  code: {
    pseudocode: `function topKFrequent(words, k):
  freq = count frequency of each word
  heap = min-heap of size k (by frequency)
  for each (word, count) in freq:
    push (count, word) onto heap
    if heap.size > k:
      pop smallest from heap
  result = extract all from heap, sort descending
  return result`,
    python: `import heapq
from collections import Counter
def topKFrequent(words, k):
    freq = Counter(words)
    return heapq.nsmallest(k, freq, key=lambda w: (-freq[w], w))`,
    javascript: `function topKFrequent(words, k) {
  const freq = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.keys(freq)
    .sort((a, b) => freq[b] - freq[a] || a.localeCompare(b))
    .slice(0, k);
}`,
    java: `public List<String> topKFrequent(String[] words, int k) {
    Map<String, Integer> freq = new HashMap<>();
    for (String w : words) freq.merge(w, 1, Integer::sum);
    PriorityQueue<String> heap = new PriorityQueue<>(
        (a, b) -> freq.get(a).equals(freq.get(b))
            ? b.compareTo(a) : freq.get(a) - freq.get(b));
    for (String w : freq.keySet()) {
        heap.offer(w);
        if (heap.size() > k) heap.poll();
    }
    List<String> res = new ArrayList<>();
    while (!heap.isEmpty()) res.add(0, heap.poll());
    return res;
}`,
  },
  defaultInput: {
    words: ['i', 'love', 'leetcode', 'i', 'love', 'coding'],
    k: 2,
  },
  inputFields: [
    {
      name: 'words',
      label: 'Words',
      type: 'string',
      defaultValue: 'i,love,leetcode,i,love,coding',
      placeholder: 'e.g. i,love,leetcode,i,love,coding',
      helperText: 'Comma-separated words',
    },
    {
      name: 'k',
      label: 'K (top count)',
      type: 'number',
      defaultValue: 2,
      placeholder: 'e.g. 2',
      helperText: 'Number of most frequent words to find',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let words: string[];
    if (Array.isArray(input.words)) {
      words = input.words as string[];
    } else {
      words = (input.words as string).split(',').map(w => w.trim());
    }
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];

    // Use numbers for array visualization (word index)
    const uniqueWords = [...new Set(words)];
    const wordToIdx = new Map<string, number>();
    uniqueWords.forEach((w, i) => wordToIdx.set(w, i));

    // Step 1: Count frequencies
    const freq = new Map<string, number>();
    for (const w of words) {
      freq.set(w, (freq.get(w) || 0) + 1);
    }

    const freqArr = [...freq.entries()].map(([word, count]) => ({ word, count }));
    const displayArr = freqArr.map(e => e.count);

    steps.push({
      line: 2,
      explanation: `Count frequencies: ${freqArr.map(e => `"${e.word}":${e.count}`).join(', ')}.`,
      variables: { freq: Object.fromEntries(freq) },
      visualization: {
        type: 'array',
        array: displayArr,
        highlights: Object.fromEntries(displayArr.map((_, i) => [i, 'default'])),
        labels: Object.fromEntries(freqArr.map((e, i) => [i, `"${e.word}"`])),
        auxData: {
          label: 'Frequency Map',
          entries: freqArr.map(e => ({ key: e.word, value: `count: ${e.count}` })),
        },
      },
    });

    // Step 2: Build heap (simulate with sorted approach)
    const heap: { word: string; count: number }[] = [];

    for (const entry of freqArr) {
      heap.push(entry);
      // Sort to simulate min-heap behavior (smallest count on top)
      heap.sort((a, b) => a.count - b.count || b.word.localeCompare(a.word));

      steps.push({
        line: 4,
        explanation: `Add "${entry.word}" (count=${entry.count}) to heap. Heap size: ${heap.length}.`,
        variables: { adding: entry.word, heapSize: heap.length },
        visualization: {
          type: 'array',
          array: heap.map(e => e.count),
          highlights: Object.fromEntries(heap.map((_, i) => [i, i === 0 ? 'active' : 'default'])),
          labels: Object.fromEntries(heap.map((e, i) => [i, `"${e.word}"`])),
          auxData: {
            label: 'Min-Heap',
            entries: [
              { key: 'Heap', value: heap.map(e => `${e.word}(${e.count})`).join(', ') },
              { key: 'Size', value: `${heap.length}/${k}` },
            ],
          },
        },
      });

      if (heap.length > k) {
        const removed = heap.shift()!;
        steps.push({
          line: 6,
          explanation: `Heap size ${heap.length + 1} > k=${k}. Remove smallest: "${removed.word}" (count=${removed.count}).`,
          variables: { removed: removed.word, heapSize: heap.length },
          visualization: {
            type: 'array',
            array: heap.map(e => e.count),
            highlights: Object.fromEntries(heap.map((_, i) => [i, 'pointer'])),
            labels: Object.fromEntries(heap.map((e, i) => [i, `"${e.word}"`])),
            auxData: {
              label: 'Min-Heap',
              entries: [
                { key: 'Removed', value: `${removed.word}(${removed.count})` },
                { key: 'Heap', value: heap.map(e => `${e.word}(${e.count})`).join(', ') },
              ],
            },
          },
        });
      }
    }

    // Step 3: Extract result (sorted by freq desc, then alphabetical)
    const result = [...heap].sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));

    steps.push({
      line: 7,
      explanation: `Extract and sort heap. Top ${k} most frequent: [${result.map(e => `"${e.word}"`).join(', ')}].`,
      variables: { result: result.map(e => e.word) },
      visualization: {
        type: 'array',
        array: result.map(e => e.count),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((e, i) => [i, `"${e.word}":${e.count}`])),
        auxData: {
          label: 'Result',
          entries: result.map((e, i) => ({ key: `#${i + 1}`, value: `"${e.word}" (${e.count} times)` })),
        },
      },
    });

    return steps;
  },
};

export default kMostFrequentStrings;
