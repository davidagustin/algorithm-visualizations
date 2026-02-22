import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const ambiguousCoordinates: AlgorithmDefinition = {
  id: 'ambiguous-coordinates',
  title: 'Ambiguous Coordinates',
  leetcodeNumber: 816,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string s representing a sequence of digits with parentheses, we removed a comma. Return all valid representations by inserting one comma, then adding optional decimal points. A valid number has no extra leading zeros and no trailing zeros in the decimal part. Return all combinations as "(a, b)".',
  tags: ['backtracking', 'string', 'enumeration'],

  code: {
    pseudocode: `function ambiguousCoordinates(s):
  s = s[1..len-2]  // strip parentheses
  results = []
  function getValidNums(t):
    nums = []
    if t has no leading zero or is "0": add t as integer
    for d in 1..len(t)-1:
      left = t[0..d-1], right = t[d..]
      if left has no leading zero and right has no trailing zero:
        nums.append(left + "." + right)
    return nums
  for split in 1..len(s)-1:
    left = getValidNums(s[0..split-1])
    right = getValidNums(s[split..])
    for a in left, b in right: results.append("("+a+", "+b+")")
  return results`,
    python: `def ambiguousCoordinates(s: str) -> list[str]:
    s = s[1:-1]
    def getValid(t):
        res = []
        if t == '0' or t[0] != '0': res.append(t)
        for d in range(1, len(t)):
            l, r = t[:d], t[d:]
            if (l == '0' or l[0] != '0') and r[-1] != '0':
                res.append(l + '.' + r)
        return res
    out = []
    for i in range(1, len(s)):
        for a in getValid(s[:i]):
            for b in getValid(s[i:]):
                out.append('(' + a + ', ' + b + ')')
    return out`,
    javascript: `function ambiguousCoordinates(s) {
  s = s.slice(1, -1);
  function getValid(t) {
    const res = [];
    if (t === '0' || t[0] !== '0') res.push(t);
    for (let d = 1; d < t.length; d++) {
      const [l, r] = [t.slice(0, d), t.slice(d)];
      if ((l === '0' || l[0] !== '0') && r[r.length-1] !== '0') res.push(l + '.' + r);
    }
    return res;
  }
  const out = [];
  for (let i = 1; i < s.length; i++) {
    for (const a of getValid(s.slice(0, i))) for (const b of getValid(s.slice(i))) out.push('('+a+', '+b+')');
  }
  return out;
}`,
    java: `public List<String> ambiguousCoordinates(String s) {
    s = s.substring(1, s.length() - 1);
    List<String> out = new ArrayList<>();
    for (int i = 1; i < s.length(); i++) {
        for (String a : getValid(s.substring(0, i)))
            for (String b : getValid(s.substring(i)))
                out.add("(" + a + ", " + b + ")");
    }
    return out;
}`,
  },

  defaultInput: { s: '(123)' },

  inputFields: [
    {
      name: 's',
      label: 'String (with parentheses)',
      type: 'string',
      defaultValue: '(123)',
      placeholder: '(123)',
      helperText: 'String with digits in parentheses',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = (input.s as string).slice(1, -1);
    const steps: AlgorithmStep[] = [];
    const results: string[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: s.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Ambiguous coordinates for "${s}" (stripped parentheses). Try every split position for comma, generate valid numbers with optional decimals.`,
      variables: { digits: s, length: s.length },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    function getValid(t: string): string[] {
      const res: string[] = [];
      if (t === '0' || t[0] !== '0') res.push(t);
      for (let d = 1; d < t.length; d++) {
        const l = t.slice(0, d);
        const r = t.slice(d);
        if ((l === '0' || l[0] !== '0') && r[r.length - 1] !== '0') {
          res.push(l + '.' + r);
        }
      }
      return res;
    }

    for (let split = 1; split < s.length; split++) {
      const leftStr = s.slice(0, split);
      const rightStr = s.slice(split);
      const leftNums = getValid(leftStr);
      const rightNums = getValid(rightStr);

      const h: Record<number, string> = {};
      const l: Record<number, string> = {};
      s.split('').forEach((c, i) => {
        if (i < split) { h[i] = 'active'; l[i] = c; }
        else { h[i] = 'visited'; l[i] = c; }
      });

      steps.push({
        line: 11,
        explanation: `Split at position ${split}: left="${leftStr}" (${leftNums.length} valid), right="${rightStr}" (${rightNums.length} valid).`,
        variables: { split, left: leftStr, right: rightStr, leftOptions: leftNums, rightOptions: rightNums },
        visualization: makeViz(h, l),
      });

      for (const a of leftNums) {
        for (const b of rightNums) {
          const coord = `(${a}, ${b})`;
          results.push(coord);

          if (steps.length < 35) {
            steps.push({
              line: 12,
              explanation: `Valid coordinate: "${coord}". Both parts are valid representations.`,
              variables: { coordinate: coord, totalFound: results.length },
              visualization: makeViz(
                Object.fromEntries(s.split('').map((_, i) => [i, 'found'])),
                Object.fromEntries(s.split('').map((c, i) => [i, c]))
              ),
            });
          }
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `Found ${results.length} valid coordinate pairs: [${results.slice(0, 4).join(', ')}${results.length > 4 ? '...' : ''}]`,
      variables: { totalCoordinates: results.length, results },
      visualization: makeViz({}, Object.fromEntries(s.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default ambiguousCoordinates;
