import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reorganizeStringHeap: AlgorithmDefinition = {
  id: 'reorganize-string-heap',
  title: 'Reorganize String (Max Heap)',
  leetcodeNumber: 767,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given a string s, rearrange the characters so that no two adjacent characters are the same. Use a max heap ordered by character frequency to always pick the most frequent character next. If it is impossible to rearrange, return an empty string.',
  tags: ['heap', 'greedy', 'string', 'frequency'],

  code: {
    pseudocode: `function reorganizeString(s):
  count = frequency map of s
  maxHeap = max heap of (freq, char) pairs
  result = []
  while heap not empty:
    freq1, char1 = pop max
    if result is not empty and result[-1] == char1:
      if heap is empty: return ""
      freq2, char2 = pop max
      result.append(char2)
      if freq2 > 1: push (freq2-1, char2)
      push (freq1, char1)
    else:
      result.append(char1)
      if freq1 > 1: push (freq1-1, char1)
  return join(result)`,

    python: `import heapq
from collections import Counter

def reorganizeString(s: str) -> str:
    count = Counter(s)
    maxHeap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(maxHeap)
    result = []
    while maxHeap:
        freq1, char1 = heapq.heappop(maxHeap)
        if result and result[-1] == char1:
            if not maxHeap:
                return ""
            freq2, char2 = heapq.heappop(maxHeap)
            result.append(char2)
            if freq2 + 1 < 0:
                heapq.heappush(maxHeap, (freq2 + 1, char2))
            heapq.heappush(maxHeap, (freq1, char1))
        else:
            result.append(char1)
            if freq1 + 1 < 0:
                heapq.heappush(maxHeap, (freq1 + 1, char1))
    return "".join(result)`,

    javascript: `function reorganizeString(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  // Max heap via sorted array simulation
  const heap = Object.entries(count).map(([c, f]) => [f, c]);
  heap.sort((a, b) => b[0] - a[0]);
  const result = [];
  while (heap.length) {
    heap.sort((a, b) => b[0] - a[0]);
    const [f1, c1] = heap.shift();
    if (result.length && result[result.length - 1] === c1) {
      if (!heap.length) return "";
      heap.sort((a, b) => b[0] - a[0]);
      const [f2, c2] = heap.shift();
      result.push(c2);
      if (f2 > 1) heap.push([f2 - 1, c2]);
      heap.push([f1, c1]);
    } else {
      result.push(c1);
      if (f1 > 1) heap.push([f1 - 1, c1]);
    }
  }
  return result.join("");
}`,

    java: `public String reorganizeString(String s) {
    int[] count = new int[26];
    for (char c : s.toCharArray()) count[c - 'a']++;
    PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
    for (int i = 0; i < 26; i++)
        if (count[i] > 0) maxHeap.offer(new int[]{count[i], i + 'a'});
    StringBuilder result = new StringBuilder();
    while (!maxHeap.isEmpty()) {
        int[] top = maxHeap.poll();
        if (result.length() > 0 && result.charAt(result.length()-1) == top[1]) {
            if (maxHeap.isEmpty()) return "";
            int[] second = maxHeap.poll();
            result.append((char) second[1]);
            if (second[0] > 1) maxHeap.offer(new int[]{second[0]-1, second[1]});
            maxHeap.offer(top);
        } else {
            result.append((char) top[1]);
            if (top[0] > 1) maxHeap.offer(new int[]{top[0]-1, top[1]});
        }
    }
    return result.toString();
}`,
  },

  defaultInput: {
    s: 'aab',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'aab',
      helperText: 'String to reorganize',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    // Build frequency map
    const count: Record<string, number> = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;

    // Build heap as sorted array of [freq, char]
    let heap: [number, string][] = Object.entries(count).map(([c, f]) => [f, c]);
    heap.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));

    const heapToArray = (h: [number, string][]) => h.map(([f, c]) => f);
    const heapToLabels = (h: [number, string][]) => {
      const labels: Record<number, string> = {};
      h.forEach(([f, c], i) => { labels[i] = `${c}:${f}`; });
      return labels;
    };

    steps.push({
      line: 1,
      explanation: `Build frequency map: ${JSON.stringify(count)}. Max heap ordered by frequency.`,
      variables: { count: JSON.stringify(count), heapSize: heap.length },
      visualization: {
        type: 'array',
        array: heapToArray(heap),
        highlights: { 0: 'active' },
        labels: heapToLabels(heap),
      } as ArrayVisualization,
    });

    const result: string[] = [];

    while (heap.length > 0) {
      heap.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
      const [f1, c1] = heap.shift()!;

      if (result.length > 0 && result[result.length - 1] === c1) {
        if (heap.length === 0) {
          steps.push({
            line: 8,
            explanation: `Cannot place "${c1}" (same as last char) and heap is empty. Return empty string.`,
            variables: { result: result.join(''), lastChar: result[result.length - 1], current: c1 },
            visualization: {
              type: 'array',
              array: [0],
              highlights: { 0: 'mismatch' },
              labels: { 0: 'FAIL' },
            } as ArrayVisualization,
          });
          return steps;
        }
        const [f2, c2] = heap.shift()!;
        result.push(c2);
        steps.push({
          line: 10,
          explanation: `"${c1}" conflicts with last char. Place "${c2}" (freq ${f2}) instead. Result so far: "${result.join('')}"`,
          variables: { placed: c2, skipped: c1, result: result.join('') },
          visualization: {
            type: 'array',
            array: heapToArray(heap),
            highlights: heap.length > 0 ? { 0: 'active' } : {},
            labels: heapToLabels(heap),
          } as ArrayVisualization,
        });
        if (f2 > 1) heap.push([f2 - 1, c2]);
        heap.push([f1, c1]);
      } else {
        result.push(c1);
        steps.push({
          line: 13,
          explanation: `Place "${c1}" (freq ${f1}). Result so far: "${result.join('')}"`,
          variables: { placed: c1, freq: f1, result: result.join('') },
          visualization: {
            type: 'array',
            array: heapToArray(heap),
            highlights: heap.length > 0 ? { 0: 'active' } : {},
            labels: heapToLabels(heap),
          } as ArrayVisualization,
        });
        if (f1 > 1) heap.push([f1 - 1, c1]);
      }
    }

    steps.push({
      line: 14,
      explanation: `Heap exhausted. Final reorganized string: "${result.join('')}"`,
      variables: { result: result.join('') },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(result.map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default reorganizeStringHeap;
