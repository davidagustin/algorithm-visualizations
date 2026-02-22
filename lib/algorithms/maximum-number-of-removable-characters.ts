import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumNumberOfRemovableCharacters: AlgorithmDefinition = {
  id: 'maximum-number-of-removable-characters',
  title: 'Maximum Number of Removable Characters',
  leetcodeNumber: 1898,
  difficulty: 'Medium',
  category: 'Binary Search',
  description:
    'Given strings s and p, and array removable of indices, find the maximum k such that p is still a subsequence of s after removing the first k indices from removable. Binary search on k: for each candidate remove those indices and check if p is a subsequence.',
  tags: ['binary search', 'string', 'greedy'],

  code: {
    pseudocode: `function maximumRemovals(s, p, removable):
  left = 0, right = len(removable)
  while left < right:
    mid = (left + right + 1) / 2
    removed = set(removable[:mid])
    if isSubsequence(s, p, removed):
      left = mid
    else:
      right = mid - 1
  return left`,

    python: `def maximumRemovals(s: str, p: str, removable: list[int]) -> int:
    def isSubseq(k):
        removed = set(removable[:k])
        i = 0
        for j in range(len(s)):
            if j not in removed and i < len(p) and s[j] == p[i]:
                i += 1
        return i == len(p)
    left, right = 0, len(removable)
    while left < right:
        mid = (left + right + 1) // 2
        if isSubseq(mid): left = mid
        else: right = mid - 1
    return left`,

    javascript: `function maximumRemovals(s, p, removable) {
  const isSubseq = (k) => {
    const removed = new Set(removable.slice(0, k));
    let i = 0;
    for (let j = 0; j < s.length && i < p.length; j++) {
      if (!removed.has(j) && s[j] === p[i]) i++;
    }
    return i === p.length;
  };
  let left = 0, right = removable.length;
  while (left < right) {
    const mid = (left + right + 1) >> 1;
    if (isSubseq(mid)) left = mid;
    else right = mid - 1;
  }
  return left;
}`,

    java: `public int maximumRemovals(String s, String p, int[] removable) {
    int left = 0, right = removable.length;
    while (left < right) {
        int mid = (left + right + 1) / 2;
        Set<Integer> removed = new HashSet<>();
        for (int i = 0; i < mid; i++) removed.add(removable[i]);
        int i = 0;
        for (int j = 0; j < s.length() && i < p.length(); j++)
            if (!removed.contains(j) && s.charAt(j) == p.charAt(i)) i++;
        if (i == p.length()) left = mid;
        else right = mid - 1;
    }
    return left;
}`,
  },

  defaultInput: {
    s: 'abcacb',
    p: 'ab',
    removable: [3, 1, 0],
  },

  inputFields: [
    {
      name: 's',
      label: 'String s',
      type: 'string',
      defaultValue: 'abcacb',
      placeholder: 'abcacb',
      helperText: 'The main string',
    },
    {
      name: 'p',
      label: 'Pattern p',
      type: 'string',
      defaultValue: 'ab',
      placeholder: 'ab',
      helperText: 'The pattern that must remain a subsequence',
    },
    {
      name: 'removable',
      label: 'Removable Indices',
      type: 'array',
      defaultValue: [3, 1, 0],
      placeholder: '3,1,0',
      helperText: 'Ordered indices that can be removed from s',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const p = input.p as string;
    const removable = input.removable as number[];
    const steps: AlgorithmStep[] = [];

    const sArr = s.split('').map((_, i) => i);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: sArr,
      highlights,
      labels,
    });

    const isSubseq = (k: number): boolean => {
      const removed = new Set(removable.slice(0, k));
      let i = 0;
      for (let j = 0; j < s.length && i < p.length; j++) {
        if (!removed.has(j) && s[j] === p[i]) i++;
      }
      return i === p.length;
    };

    let left = 0;
    let right = removable.length;

    steps.push({
      line: 1,
      explanation: `s="${s}", p="${p}", removable=[${removable.join(', ')}]. Binary search k from 0 to ${right}.`,
      variables: { left, right, s, p },
      visualization: makeViz(
        sArr.reduce((acc, _, i) => ({ ...acc, [i]: 'active' }), {}),
        sArr.reduce((acc, _, i) => ({ ...acc, [i]: s[i] }), {})
      ),
    });

    while (left < right) {
      const mid = Math.floor((left + right + 1) / 2);
      const removed = new Set(removable.slice(0, mid));
      const ok = isSubseq(mid);

      steps.push({
        line: 3,
        explanation: `Try k=${mid}: remove indices [${removable.slice(0, mid).join(', ')}]. Is "${p}" still a subsequence? ${ok ? 'Yes' : 'No'}.`,
        variables: { left, right, k: mid, removedIndices: `[${removable.slice(0, mid).join(', ')}]`, isSubsequence: ok },
        visualization: makeViz(
          sArr.reduce((acc, _, i) => ({
            ...acc,
            [i]: removed.has(i) ? 'mismatch' : 'active',
          }), {}),
          sArr.reduce((acc, _, i) => ({
            ...acc,
            [i]: removed.has(i) ? 'X' : s[i],
          }), {})
        ),
      });

      if (ok) {
        steps.push({
          line: 5,
          explanation: `k=${mid} works. Try removing more. left=${mid}.`,
          variables: { left, right, k: mid },
          visualization: makeViz(
            sArr.reduce((acc, _, i) => ({ ...acc, [i]: removed.has(i) ? 'mismatch' : 'found' }), {}),
            { 0: `k=${mid} ok` }
          ),
        });
        left = mid;
      } else {
        steps.push({
          line: 7,
          explanation: `k=${mid} fails. "${p}" is no longer a subsequence. right=${mid - 1}.`,
          variables: { left, right, k: mid },
          visualization: makeViz(
            sArr.reduce((acc, _, i) => ({ ...acc, [i]: removed.has(i) ? 'mismatch' : 'comparing' }), {}),
            { 0: `k=${mid} fail` }
          ),
        });
        right = mid - 1;
      }
    }

    steps.push({
      line: 8,
      explanation: `Maximum removable characters = ${left}.`,
      variables: { result: left },
      visualization: makeViz(
        sArr.reduce((acc, _, i) => ({
          ...acc,
          [i]: removable.slice(0, left).includes(i) ? 'mismatch' : 'found',
        }), {}),
        { 0: `max k=${left}` }
      ),
    });

    return steps;
  },
};

export default maximumNumberOfRemovableCharacters;
