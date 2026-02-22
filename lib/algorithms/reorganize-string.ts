import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reorganizeString: AlgorithmDefinition = {
  id: 'reorganize-string',
  title: 'Reorganize String',
  leetcodeNumber: 767,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Rearrange characters of a string so no two adjacent characters are the same. Use a max-heap (priority queue) ordered by frequency. Repeatedly pick the most frequent character, append to result, then restore the previously picked character back to the heap.',
  tags: ['Heap', 'Greedy', 'String'],
  code: {
    pseudocode: `function reorganizeString(s):
  count frequency of each char
  maxHeap = max-heap of (freq, char) pairs
  result = ""
  prev = null
  while heap not empty:
    (freq, char) = pop max
    result += char
    if prev != null: push prev back
    prev = (freq-1, char) if freq-1 > 0 else null
  return result if len == s.length else ""`,
    python: `import heapq
def reorganizeString(s):
    from collections import Counter
    counts = Counter(s)
    heap = [(-v, k) for k, v in counts.items()]
    heapq.heapify(heap)
    result = []
    prev = None
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char)
        if prev:
            heapq.heappush(heap, prev)
        prev = (freq + 1, char) if freq + 1 < 0 else None
    return ''.join(result) if len(result) == len(s) else ""`,
    javascript: `function reorganizeString(s) {
  const count = {};
  for (const c of s) count[c] = (count[c] || 0) + 1;
  // Simulate max-heap with sorted array
  let heap = Object.entries(count).map(([c, f]) => [f, c]);
  heap.sort((a, b) => b[0] - a[0]);
  let result = '', prev = null;
  while (heap.length > 0) {
    const [freq, char] = heap.shift();
    result += char;
    if (prev) { heap.push(prev); heap.sort((a, b) => b[0] - a[0]); }
    prev = freq - 1 > 0 ? [freq - 1, char] : null;
  }
  return result.length === s.length ? result : '';
}`,
    java: `public String reorganizeString(String s) {
    int[] cnt = new int[26];
    for (char c : s.toCharArray()) cnt[c-'a']++;
    PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->b[0]-a[0]);
    for (int i = 0; i < 26; i++) if (cnt[i] > 0) pq.offer(new int[]{cnt[i], i});
    StringBuilder sb = new StringBuilder();
    int[] prev = null;
    while (!pq.isEmpty()) {
        int[] cur = pq.poll();
        sb.append((char)('a'+cur[1]));
        if (prev != null) pq.offer(prev);
        prev = cur[0]-1 > 0 ? new int[]{cur[0]-1, cur[1]} : null;
    }
    return sb.length() == s.length() ? sb.toString() : "";
}`,
  },
  defaultInput: { s: 'aab' },
  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aab',
      placeholder: 'e.g. aab',
      helperText: 'String to reorganize so no two adjacent characters are the same',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    // Frequency count
    const count: Record<string, number> = {};
    for (const c of s) count[c] = (count[c] || 0) + 1;

    // Max-heap simulated as sorted array of [freq, char]
    let heap: [number, string][] = Object.entries(count).map(([c, f]) => [f, c]);
    heap.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));

    let result = '';
    let prev: [number, string] | null = null;

    // Visualization: show character frequencies as array
    const chars = Object.keys(count).sort();
    const charIdx = (c: string) => chars.indexOf(c);

    function makeViz(): ArrayVisualization {
      const freqArr = chars.map(c => {
        const inHeap = heap.find(h => h[1] === c);
        if (inHeap) return inHeap[0];
        if (prev && prev[1] === c) return prev[0];
        return 0;
      });
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < chars.length; i++) {
        labels[i] = chars[i];
        const inHeap = heap.find(h => h[1] === chars[i]);
        if (inHeap) highlights[i] = freqArr[i] > 0 ? 'active' : 'default';
        if (prev && prev[1] === chars[i]) highlights[i] = 'comparing';
      }
      // Highlight last used character in result
      if (result.length > 0) {
        const lastChar = result[result.length - 1];
        const li = charIdx(lastChar);
        highlights[li] = 'found';
      }
      return {
        type: 'array',
        array: freqArr,
        highlights,
        labels,
        auxData: {
          label: 'Heap & Result',
          entries: [
            { key: 'Result so far', value: result || '(empty)' },
            { key: 'Heap (max-first)', value: heap.map(h => `${h[1]}:${h[0]}`).join(', ') || 'empty' },
            { key: 'Held back (prev)', value: prev ? `${prev[1]}:${prev[0]}` : 'none' },
            { key: 'Remaining', value: String(s.length - result.length) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Count frequencies: ${Object.entries(count).map(([c, f]) => `${c}→${f}`).join(', ')}. Build max-heap: ${heap.map(h => `${h[1]}:${h[0]}`).join(', ')}.`,
      variables: { count, s },
      visualization: makeViz(),
    });

    while (heap.length > 0) {
      const [freq, char] = heap.shift()!;

      steps.push({
        line: 6,
        explanation: `Pop most frequent: "${char}" (freq=${freq}). Append to result: "${result + char}".`,
        variables: { char, freq, result: result + char },
        visualization: (() => {
          const snapshot = makeViz();
          return snapshot;
        })(),
      });

      result += char;

      if (prev) {
        heap.push(prev);
        heap.sort((a, b) => b[0] - a[0] || a[1].localeCompare(b[1]));
        steps.push({
          line: 8,
          explanation: `Restore held character "${prev[1]}" (freq=${prev[0]}) back to heap: ${heap.map(h => `${h[1]}:${h[0]}`).join(', ')}.`,
          variables: { restored: prev[1], heap: heap.map(h => ({ char: h[1], freq: h[0] })) },
          visualization: makeViz(),
        });
      }

      prev = freq - 1 > 0 ? [freq - 1, char] : null;
    }

    const success = result.length === s.length;
    steps.push({
      line: 9,
      explanation: success
        ? `Done. Reorganized string: "${result}". No two adjacent chars are the same.`
        : `Cannot reorganize "${s}": one character appears too frequently. Return "".`,
      variables: { result: success ? result : '', success },
      visualization: (() => {
        const freqArr = chars.map(() => 0);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < chars.length; i++) { l[i] = chars[i]; h[i] = success ? 'found' : 'mismatch'; }
        return {
          type: 'array' as const,
          array: freqArr,
          highlights: h,
          labels: l,
          auxData: {
            label: success ? 'Done!' : 'Impossible',
            entries: [
              { key: 'Input', value: s },
              { key: 'Result', value: success ? result : '""' },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default reorganizeString;
