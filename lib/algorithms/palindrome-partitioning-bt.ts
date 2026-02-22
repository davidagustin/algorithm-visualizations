import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const palindromePartitioningBt: AlgorithmDefinition = {
  id: 'palindrome-partitioning-bt',
  title: 'Palindrome Partitioning (Backtracking)',
  leetcodeNumber: 131,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string s, partition it such that every substring of the partition is a palindrome. Return all possible palindrome partitionings. Use backtracking to explore all cut positions, checking each substring for palindrome validity before recursing.',
  tags: ['backtracking', 'dynamic programming', 'string', 'palindrome'],

  code: {
    pseudocode: `function partition(s):
  results = []
  function backtrack(start, current):
    if start == len(s):
      results.append(copy of current)
      return
    for end in start..len(s)-1:
      substr = s[start..end]
      if isPalindrome(substr):
        current.append(substr)
        backtrack(end+1, current)
        current.pop()
  backtrack(0, [])
  return results`,
    python: `def partition(s: str) -> list[list[str]]:
    res = []
    def isPalin(sub): return sub == sub[::-1]
    def bt(start, cur):
        if start == len(s):
            res.append(cur[:])
            return
        for end in range(start, len(s)):
            sub = s[start:end+1]
            if isPalin(sub):
                cur.append(sub)
                bt(end + 1, cur)
                cur.pop()
    bt(0, [])
    return res`,
    javascript: `function partition(s) {
  const res = [];
  function isPalin(sub) { return sub === sub.split('').reverse().join(''); }
  function bt(start, cur) {
    if (start === s.length) { res.push([...cur]); return; }
    for (let end = start; end < s.length; end++) {
      const sub = s.slice(start, end + 1);
      if (isPalin(sub)) {
        cur.push(sub);
        bt(end + 1, cur);
        cur.pop();
      }
    }
  }
  bt(0, []);
  return res;
}`,
    java: `public List<List<String>> partition(String s) {
    List<List<String>> res = new ArrayList<>();
    backtrack(s, 0, new ArrayList<>(), res);
    return res;
}
private void backtrack(String s, int start, List<String> cur, List<List<String>> res) {
    if (start == s.length()) { res.add(new ArrayList<>(cur)); return; }
    for (int end = start; end < s.length(); end++) {
        String sub = s.substring(start, end + 1);
        if (isPalin(sub)) {
            cur.add(sub); backtrack(s, end + 1, cur, res); cur.remove(cur.size() - 1);
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
      placeholder: 'aab',
      helperText: 'String to partition into palindromes',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const results: string[][] = [];

    const charArray = s.split('').map((_, i) => i);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((c, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start palindrome partitioning for string "${s}". Find all ways to split so every part is a palindrome.`,
      variables: { s, length: s.length, results: 0 },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    function isPalin(sub: string): boolean {
      return sub === sub.split('').reverse().join('');
    }

    function backtrack(start: number, current: string[]) {
      if (start === s.length) {
        results.push([...current]);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        s.split('').forEach((c, i) => { h[i] = 'found'; l[i] = c; });
        steps.push({
          line: 4,
          explanation: `Found valid partition: [${current.map(p => '"' + p + '"').join(', ')}]`,
          variables: { partition: [...current], totalFound: results.length },
          visualization: makeViz(h, l),
        });
        return;
      }

      for (let end = start; end < s.length; end++) {
        const sub = s.slice(start, end + 1);
        const palin = isPalin(sub);

        if (steps.length < 35) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          s.split('').forEach((c, i) => {
            if (i < start) { h[i] = 'visited'; l[i] = c; }
            else if (i >= start && i <= end) { h[i] = palin ? 'active' : 'mismatch'; l[i] = c; }
            else { l[i] = c; }
          });
          steps.push({
            line: 6,
            explanation: `Check substring "${sub}" (indices ${start}-${end}): ${palin ? 'IS a palindrome' : 'NOT a palindrome'}.`,
            variables: { substring: sub, isPalindrome: palin, start, end },
            visualization: makeViz(h, l),
          });
        }

        if (palin) {
          current.push(sub);
          backtrack(end + 1, current);
          current.pop();
        }
      }
    }

    backtrack(0, []);

    steps.push({
      line: 11,
      explanation: `Backtracking complete. Found ${results.length} palindrome partitions for "${s}".`,
      variables: { totalPartitions: results.length, allPartitions: results },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default palindromePartitioningBt;
