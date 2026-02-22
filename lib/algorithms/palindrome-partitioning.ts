import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromePartitioning: AlgorithmDefinition = {
  id: 'palindrome-partitioning',
  title: 'Palindrome Partitioning',
  leetcodeNumber: 131,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string s, partition it such that every substring of the partition is a palindrome. Return all possible palindrome partitionings. We use backtracking: at each position try extending the current substring; if it is a palindrome, recurse on the remaining string and then backtrack.',
  tags: ['Backtracking', 'Recursion', 'String'],
  code: {
    pseudocode: `function partition(s):
  result = []
  backtrack(s, 0, [], result)
  return result

function backtrack(s, start, path, result):
  if start == s.length:
    result.append(copy of path)
    return
  for end from start+1 to s.length:
    sub = s[start..end]
    if isPalindrome(sub):
      path.append(sub)
      backtrack(s, end, path, result)
      path.pop()`,
    python: `def partition(s):
    result = []
    def backtrack(start, path):
        if start == len(s):
            result.append(path[:])
            return
        for end in range(start + 1, len(s) + 1):
            sub = s[start:end]
            if sub == sub[::-1]:
                path.append(sub)
                backtrack(end, path)
                path.pop()
    backtrack(0, [])
    return result`,
    javascript: `function partition(s) {
  const result = [];
  function backtrack(start, path) {
    if (start === s.length) {
      result.push([...path]);
      return;
    }
    for (let end = start + 1; end <= s.length; end++) {
      const sub = s.slice(start, end);
      if (sub === sub.split('').reverse().join('')) {
        path.push(sub);
        backtrack(end, path);
        path.pop();
      }
    }
  }
  backtrack(0, []);
  return result;
}`,
    java: `public List<List<String>> partition(String s) {
    List<List<String>> result = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), result);
    return result;
}
void backtrack(String s, int start, List<String> path,
               List<List<String>> result) {
    if (start == s.length()) {
        result.add(new ArrayList<>(path));
        return;
    }
    for (int end = start + 1; end <= s.length(); end++) {
        String sub = s.substring(start, end);
        if (isPalindrome(sub)) {
            path.add(sub);
            backtrack(s, end, path, result);
            path.remove(path.size() - 1);
        }
    }
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
      helperText: 'String to partition into palindromes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const result: string[][] = [];
    const path: string[] = [];

    function isPalindrome(str: string): boolean {
      let l = 0, r = str.length - 1;
      while (l < r) {
        if (str[l] !== str[r]) return false;
        l++; r--;
      }
      return true;
    }

    // Represent string as char array indices for visualization
    const chars = s.split('').map((_, i) => i);

    function makeViz(start: number, end: number | null, isPalin: boolean | null): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < s.length; i++) {
        labels[i] = s[i];
        if (end !== null && i >= start && i < end) {
          highlights[i] = isPalin === null ? 'comparing' : (isPalin ? 'found' : 'mismatch');
        } else if (i < start) {
          highlights[i] = 'visited';
        } else {
          highlights[i] = 'default';
        }
      }
      return {
        type: 'array',
        array: chars.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Backtracking State',
          entries: [
            { key: 'Current path', value: path.length > 0 ? `[${path.map(p => `"${p}"`).join(', ')}]` : '[]' },
            { key: 'Start index', value: String(start) },
            { key: 'Partitions found', value: String(result.length) },
            ...result.slice(-3).map((r, i) => ({ key: `  #${result.length - Math.min(3, result.length) + i + 1}`, value: `[${r.map(p => `"${p}"`).join(', ')}]` })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Partition "${s}" so every part is a palindrome. Each character index is shown; we'll try every split point.`,
      variables: { s, result: [] },
      visualization: makeViz(0, null, null),
    });

    function backtrack(start: number): void {
      if (start === s.length) {
        result.push(path.slice());
        steps.push({
          line: 7,
          explanation: `Reached end of string! Found valid partition: [${path.map(p => `"${p}"`).join(', ')}]. Total: ${result.length}.`,
          variables: { partition: path.slice(), total: result.length },
          visualization: {
            type: 'array',
            array: chars.slice(),
            highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
            labels: Object.fromEntries(chars.map((_, i) => [i, s[i]])),
            auxData: {
              label: 'Partition Found!',
              entries: [
                { key: 'Partition', value: `[${path.map(p => `"${p}"`).join(', ')}]` },
                { key: 'Total found', value: String(result.length) },
              ],
            },
          },
        });
        return;
      }

      for (let end = start + 1; end <= s.length; end++) {
        const sub = s.slice(start, end);
        const palin = isPalindrome(sub);

        steps.push({
          line: 10,
          explanation: `Check substring "${sub}" (indices ${start}..${end - 1}): ${palin ? 'IS' : 'NOT'} a palindrome.`,
          variables: { sub, start, end, isPalindrome: palin },
          visualization: makeViz(start, end, palin),
        });

        if (palin) {
          path.push(sub);
          steps.push({
            line: 12,
            explanation: `"${sub}" is a palindrome. Add to path. path=[${path.map(p => `"${p}"`).join(', ')}]. Recurse from index ${end}.`,
            variables: { sub, path: path.slice(), nextStart: end },
            visualization: makeViz(end, null, null),
          });
          backtrack(end);
          path.pop();
          steps.push({
            line: 14,
            explanation: `Backtrack: remove "${sub}" from path. path=[${path.map(p => `"${p}"`).join(', ')}]. Try next split.`,
            variables: { removed: sub, path: path.slice() },
            visualization: makeViz(start, null, null),
          });
        }
      }
    }

    backtrack(0);

    steps.push({
      line: 3,
      explanation: `All partitions found. ${result.length} valid palindrome partition(s) for "${s}".`,
      variables: { total: result.length, result },
      visualization: {
        type: 'array',
        array: chars.slice(),
        highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(chars.map((_, i) => [i, s[i]])),
        auxData: {
          label: `All ${result.length} Partitions`,
          entries: result.map((r, i) => ({ key: `#${i + 1}`, value: `[${r.map(p => `"${p}"`).join(', ')}]` })),
        },
      },
    });

    return steps;
  },
};

export default palindromePartitioning;
