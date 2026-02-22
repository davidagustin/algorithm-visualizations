import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const expressionAddOperators: AlgorithmDefinition = {
  id: 'expression-add-operators',
  title: 'Expression Add Operators',
  leetcodeNumber: 282,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given a string of digits and a target value, add binary operators +, -, or * between digits so that the expression evaluates to the target value. Return all valid expressions. Track the current evaluation and the last multiplication operand to handle operator precedence correctly.',
  tags: ['backtracking', 'string', 'math', 'recursion'],

  code: {
    pseudocode: `function addOperators(num, target):
  results = []
  function backtrack(idx, path, eval, mult):
    if idx == len(num):
      if eval == target: results.append(path)
      return
    for end in idx..len(num)-1:
      curr = num[idx..end]
      if curr has leading zero and length > 1: break
      n = int(curr)
      if idx == 0:
        backtrack(end+1, curr, n, n)
      else:
        backtrack(end+1, path+"+"+curr, eval+n, n)
        backtrack(end+1, path+"-"+curr, eval-n, -n)
        backtrack(end+1, path+"*"+curr, eval-mult+mult*n, mult*n)
  backtrack(0, "", 0, 0)
  return results`,
    python: `def addOperators(num: str, target: int) -> list[str]:
    res = []
    def bt(idx, path, ev, mult):
        if idx == len(num):
            if ev == target: res.append(path)
            return
        for end in range(idx, len(num)):
            curr = num[idx:end+1]
            if len(curr) > 1 and curr[0] == '0': break
            n = int(curr)
            if idx == 0:
                bt(end+1, curr, n, n)
            else:
                bt(end+1, path+'+'+curr, ev+n, n)
                bt(end+1, path+'-'+curr, ev-n, -n)
                bt(end+1, path+'*'+curr, ev-mult+mult*n, mult*n)
    bt(0, '', 0, 0)
    return res`,
    javascript: `function addOperators(num, target) {
  const res = [];
  function bt(idx, path, ev, mult) {
    if (idx === num.length) {
      if (ev === target) res.push(path);
      return;
    }
    for (let end = idx; end < num.length; end++) {
      const curr = num.slice(idx, end + 1);
      if (curr.length > 1 && curr[0] === '0') break;
      const n = parseInt(curr);
      if (idx === 0) { bt(end+1, curr, n, n); }
      else {
        bt(end+1, path+'+'+curr, ev+n, n);
        bt(end+1, path+'-'+curr, ev-n, -n);
        bt(end+1, path+'*'+curr, ev-mult+mult*n, mult*n);
      }
    }
  }
  bt(0, '', 0, 0);
  return res;
}`,
    java: `public List<String> addOperators(String num, int target) {
    List<String> res = new ArrayList<>();
    backtrack(num, target, 0, "", 0, 0, res);
    return res;
}
private void backtrack(String num, int target, int idx, String path, long ev, long mult, List<String> res) {
    if (idx == num.length()) { if (ev == target) res.add(path); return; }
    for (int end = idx; end < num.length(); end++) {
        String curr = num.substring(idx, end + 1);
        if (curr.length() > 1 && curr.charAt(0) == '0') break;
        long n = Long.parseLong(curr);
        if (idx == 0) backtrack(num, target, end+1, curr, n, n, res);
        else {
            backtrack(num, target, end+1, path+"+"+curr, ev+n, n, res);
            backtrack(num, target, end+1, path+"-"+curr, ev-n, -n, res);
            backtrack(num, target, end+1, path+"*"+curr, ev-mult+mult*n, mult*n, res);
        }
    }
}`,
  },

  defaultInput: { num: '123', target: 6 },

  inputFields: [
    {
      name: 'num',
      label: 'Digit String',
      type: 'string',
      defaultValue: '123',
      placeholder: '123',
      helperText: 'String of digits',
    },
    {
      name: 'target',
      label: 'Target Value',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Target expression result',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as string;
    const target = input.target as number;
    const steps: AlgorithmStep[] = [];
    const results: string[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: num.split('').map((_, i) => i),
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Add operators (+, -, *) between digits of "${num}" to reach target ${target}. Track evaluation and last multiplier for precedence.`,
      variables: { num, target },
      visualization: makeViz({}, Object.fromEntries(num.split('').map((c, i) => [i, c]))),
    });

    function backtrack(idx: number, path: string, ev: number, mult: number) {
      if (idx === num.length) {
        if (ev === target) {
          results.push(path);
          const h: Record<number, string> = {};
          num.split('').forEach((_, i) => { h[i] = 'found'; });
          steps.push({
            line: 5,
            explanation: `Expression "${path}" evaluates to ${ev} = target ${target}. Valid!`,
            variables: { expression: path, value: ev, target },
            visualization: makeViz(h, Object.fromEntries(num.split('').map((c, i) => [i, c]))),
          });
        }
        return;
      }

      for (let end = idx; end < num.length; end++) {
        const curr = num.slice(idx, end + 1);
        if (curr.length > 1 && curr[0] === '0') break;
        const n = parseInt(curr);

        if (steps.length < 30) {
          const h: Record<number, string> = {};
          num.split('').forEach((_, i) => {
            if (i < idx) h[i] = 'visited';
            else if (i >= idx && i <= end) h[i] = 'active';
          });
          const ops = idx === 0 ? ['(first segment)'] : ['+', '-', '*'];
          steps.push({
            line: 9,
            explanation: `At index ${idx}, try segment "${curr}" (value ${n}). Operators to try: ${ops.join(', ')}.`,
            variables: { index: idx, segment: curr, value: n, currentPath: path || '(none)' },
            visualization: makeViz(h, Object.fromEntries(num.split('').map((c, i) => [i, c]))),
          });
        }

        if (idx === 0) {
          backtrack(end + 1, curr, n, n);
        } else {
          backtrack(end + 1, path + '+' + curr, ev + n, n);
          backtrack(end + 1, path + '-' + curr, ev - n, -n);
          backtrack(end + 1, path + '*' + curr, ev - mult + mult * n, mult * n);
        }
      }
    }

    backtrack(0, '', 0, 0);

    steps.push({
      line: 14,
      explanation: `Done. Found ${results.length} expression(s) equal to ${target}: ${results.join(', ')}`,
      variables: { target, results, count: results.length },
      visualization: makeViz({}, Object.fromEntries(num.split('').map((c, i) => [i, c]))),
    });

    return steps;
  },
};

export default expressionAddOperators;
