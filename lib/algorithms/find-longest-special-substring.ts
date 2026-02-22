import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findLongestSpecialSubstring: AlgorithmDefinition = {
  id: 'find-longest-special-substring',
  title: 'Find Longest Special Substring That Occurs Thrice I',
  leetcodeNumber: 2981,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'A special string consists of a single character repeated one or more times. Given a string s, return the length of the longest special substring that occurs at least 3 times. Use sliding window to find all runs of same characters, track frequency of each (char, length) pair.',
  tags: ['sliding window', 'hash map', 'string'],

  code: {
    pseudocode: `function maximumLength(s):
  counts = {}  // (char, len) -> frequency
  left = 0
  for right in range(len(s)):
    if s[right] != s[left]:
      left = right
    length = right - left + 1
    counts[(s[right], length)] = counts.get(..., 0) + 1
  result = -1
  for (char, length), freq in counts.items():
    if freq >= 3:
      result = max(result, length)
  return result`,

    python: `def maximumLength(s: str) -> int:
    from collections import defaultdict
    counts = defaultdict(int)
    left = 0
    for right in range(len(s)):
        if s[right] != s[left]:
            left = right
        counts[(s[right], right - left + 1)] += 1
    result = -1
    for (c, length), freq in counts.items():
        if freq >= 3:
            result = max(result, length)
    return result`,

    javascript: `function maximumLength(s) {
  const counts = new Map();
  let left = 0;
  for (let right = 0; right < s.length; right++) {
    if (s[right] !== s[left]) left = right;
    const key = s[right] + (right - left + 1);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  let result = -1;
  for (const [key, freq] of counts) {
    if (freq >= 3) {
      const len = parseInt(key.slice(1));
      result = Math.max(result, len);
    }
  }
  return result;
}`,

    java: `public int maximumLength(String s) {
    Map<String, Integer> counts = new HashMap<>();
    int left = 0;
    for (int right = 0; right < s.length(); right++) {
        if (s.charAt(right) != s.charAt(left)) left = right;
        String key = s.charAt(right) + "" + (right - left + 1);
        counts.merge(key, 1, Integer::sum);
    }
    int result = -1;
    for (Map.Entry<String, Integer> e : counts.entrySet()) {
        if (e.getValue() >= 3) {
            int len = Integer.parseInt(e.getKey().substring(1));
            result = Math.max(result, len);
        }
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'aaaa',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: 'aaaa',
      placeholder: 'aaaa',
      helperText: 'Lowercase English string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const n = s.length;
    const arr = s.split('').map(c => c.charCodeAt(0) - 96);

    steps.push({
      line: 1,
      explanation: `Find longest special substring (single char repeated) occurring at least 3 times in "${s}". Track each (char, length) pair frequency.`,
      variables: { length: n },
      visualization: {
        type: 'array',
        array: arr,
        highlights: {},
        labels: Object.fromEntries(s.split('').slice(0, 10).map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    const counts = new Map<string, number>();
    let left = 0;

    for (let right = 0; right < n; right++) {
      if (s[right] !== s[left]) left = right;
      const length = right - left + 1;
      const key = `${s[right]}:${length}`;
      counts.set(key, (counts.get(key) || 0) + 1);

      steps.push({
        line: 5,
        explanation: `Index ${right}: char="${s[right]}", run starts at ${left}, run length=${length}. Count of ("${s[right]}",${length}) = ${counts.get(key)}.`,
        variables: { right, left, char: s[right], runLength: length, countForKey: counts.get(key) },
        visualization: {
          type: 'array',
          array: arr,
          highlights: Object.fromEntries(Array.from({ length }, (_, i) => [left + i, 'active'])),
          labels: { [left]: 'run start', [right]: 'R' },
        } as ArrayVisualization,
      });
    }

    let result = -1;
    for (const [key, freq] of counts) {
      if (freq >= 3) {
        const parts = key.split(':');
        const len = parseInt(parts[1]);
        if (len > result) result = len;
      }
    }

    const validEntries = [...counts.entries()].filter(([, f]) => f >= 3).map(([k, f]) => `${k}(x${f})`);

    steps.push({
      line: 10,
      explanation: `Special substrings with freq >= 3: [${validEntries.join(', ') || 'none'}]. Longest = ${result}.`,
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

export default findLongestSpecialSubstring;
