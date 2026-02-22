import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const splitArrayIntoFibonacciSequence: AlgorithmDefinition = {
  id: 'split-array-into-fibonacci-sequence',
  title: 'Split Array into Fibonacci Sequence',
  leetcodeNumber: 842,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string of digits, split it into a Fibonacci-like sequence of at least 3 numbers where each number is the sum of the two preceding ones. No number can have leading zeros (unless it is 0 itself) and must fit in a 32-bit signed integer. Use backtracking to try all valid splits.',
  tags: ['backtracking', 'string', 'greedy', 'recursion'],

  code: {
    pseudocode: `function splitIntoFibonacci(s):
  result = []
  function backtrack(idx, seq):
    if idx == len(s) and len(seq) >= 3:
      result = seq; return true
    for end in idx..len(s)-1:
      numStr = s[idx..end]
      if numStr[0]=='0' and len>1: break
      num = int(numStr)
      if num > 2^31-1: break
      n = len(seq)
      if n >= 2 and num > seq[-1]+seq[-2]: break
      if n < 2 or num == seq[-1]+seq[-2]:
        seq.append(num)
        if backtrack(end+1, seq): return true
        seq.pop()
  return result`,
    python: `def splitIntoFibonacci(s: str) -> list[int]:
    res = []
    def bt(idx, seq):
        if idx == len(s) and len(seq) >= 3:
            res.extend(seq); return True
        for end in range(idx, len(s)):
            t = s[idx:end+1]
            if len(t) > 1 and t[0] == '0': break
            n = int(t)
            if n > 2**31 - 1: break
            if len(seq) >= 2 and n > seq[-1] + seq[-2]: break
            if len(seq) < 2 or n == seq[-1] + seq[-2]:
                seq.append(n)
                if bt(end+1, seq): return True
                seq.pop()
        return False
    bt(0, [])
    return res`,
    javascript: `function splitIntoFibonacci(s) {
  const res = [];
  function bt(idx, seq) {
    if (idx === s.length && seq.length >= 3) { res.push(...seq); return true; }
    for (let end = idx; end < s.length; end++) {
      const t = s.slice(idx, end + 1);
      if (t.length > 1 && t[0] === '0') break;
      const n = parseInt(t);
      if (n > 2**31 - 1) break;
      if (seq.length >= 2 && n > seq[seq.length-1] + seq[seq.length-2]) break;
      if (seq.length < 2 || n === seq[seq.length-1] + seq[seq.length-2]) {
        seq.push(n);
        if (bt(end+1, seq)) return true;
        seq.pop();
      }
    }
    return false;
  }
  bt(0, []);
  return res;
}`,
    java: `public List<Integer> splitIntoFibonacci(String s) {
    List<Integer> res = new ArrayList<>();
    backtrack(s, 0, res);
    return res;
}
private boolean backtrack(String s, int idx, List<Integer> seq) {
    if (idx == s.length() && seq.size() >= 3) return true;
    for (int end = idx; end < s.length(); end++) {
        String t = s.substring(idx, end + 1);
        if (t.length() > 1 && t.charAt(0) == '0') break;
        long n = Long.parseLong(t);
        if (n > Integer.MAX_VALUE) break;
        int sz = seq.size();
        if (sz >= 2 && n > (long)seq.get(sz-1) + seq.get(sz-2)) break;
        if (sz < 2 || n == (long)seq.get(sz-1) + seq.get(sz-2)) {
            seq.add((int)n);
            if (backtrack(s, end+1, seq)) return true;
            seq.remove(seq.size()-1);
        }
    }
    return false;
}`,
  },

  defaultInput: { s: '123456579' },

  inputFields: [
    {
      name: 's',
      label: 'Digit String',
      type: 'string',
      defaultValue: '123456579',
      placeholder: '123456579',
      helperText: 'String to split into Fibonacci-like sequence',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    let finalResult: number[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Split "${s}" into a Fibonacci-like sequence (at least 3 numbers, each = sum of previous two, no leading zeros, fits 32-bit int).`,
      variables: { s, length: s.length },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    function backtrack(idx: number, seq: number[]): boolean {
      if (idx === s.length && seq.length >= 3) {
        finalResult = [...seq];
        const h: Record<number, string> = {};
        s.split('').forEach((_, i) => { h[i] = 'found'; });
        steps.push({
          line: 4,
          explanation: `Valid Fibonacci split found: [${seq.join(', ')}]. Each number = sum of previous two.`,
          variables: { sequence: [...seq], valid: true },
          visualization: makeViz(h, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
        });
        return true;
      }

      for (let end = idx; end < s.length; end++) {
        const t = s.slice(idx, end + 1);
        if (t.length > 1 && t[0] === '0') break;
        const n = parseInt(t);
        if (n > 2147483647) break;

        const sz = seq.length;
        if (sz >= 2 && n > seq[sz - 1] + seq[sz - 2]) break;

        if (sz < 2 || n === seq[sz - 1] + seq[sz - 2]) {
          seq.push(n);

          if (steps.length < 25) {
            const h: Record<number, string> = {};
            const l: Record<number, string> = {};
            s.split('').forEach((c, i) => {
              if (i < idx) { h[i] = 'visited'; l[i] = c; }
              else if (i >= idx && i <= end) { h[i] = 'active'; l[i] = c; }
              else { l[i] = c; }
            });
            const check = sz >= 2 ? `${seq[sz - 2]} + ${seq[sz - 1]} = ${seq[sz - 2] + seq[sz - 1]}` : 'first two numbers';
            steps.push({
              line: 10,
              explanation: `Try segment "${t}" (value ${n}). ${sz >= 2 ? `Matches ${check}. ` : ''}Sequence so far: [${seq.join(', ')}].`,
              variables: { segment: t, value: n, sequenceSoFar: [...seq] },
              visualization: makeViz(h, l),
            });
          }

          if (backtrack(end + 1, seq)) return true;
          seq.pop();
        }
      }
      return false;
    }

    backtrack(0, []);

    steps.push({
      line: 15,
      explanation: finalResult.length > 0
        ? `Result: [${finalResult.join(', ')}]. Verify: ${finalResult.slice(2).every((v, i) => v === finalResult[i] + finalResult[i + 1]) ? 'All Fibonacci constraints satisfied.' : 'Check failed.'}`
        : `No valid Fibonacci split found for "${s}".`,
      variables: { result: finalResult },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default splitArrayIntoFibonacciSequence;
