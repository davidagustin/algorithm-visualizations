import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const backspaceStringCompare: AlgorithmDefinition = {
  id: 'backspace-string-compare',
  title: 'Backspace String Compare',
  leetcodeNumber: 844,
  difficulty: 'Easy',
  category: 'Two Pointers',
  description:
    'Given two strings s and t, return true if they are equal when both are typed into empty text editors where # means a backspace. Process each string using a stack-simulation approach or traverse backwards with two pointers.',
  tags: ['two pointers', 'string', 'stack', 'simulation'],

  code: {
    pseudocode: `function backspaceCompare(s, t):
  i = len(s)-1, j = len(t)-1
  skipS = 0, skipT = 0
  while i >= 0 or j >= 0:
    while i >= 0:
      if s[i] == '#': skipS++; i--
      elif skipS > 0: skipS--; i--
      else: break
    while j >= 0:
      if t[j] == '#': skipT++; j--
      elif skipT > 0: skipT--; j--
      else: break
    if i >= 0 and j >= 0 and s[i] != t[j]: return false
    if (i>=0) != (j>=0): return false
    i--; j--
  return true`,

    python: `def backspaceCompare(s: str, t: str) -> bool:
    i, j = len(s) - 1, len(t) - 1
    skip_s = skip_t = 0
    while i >= 0 or j >= 0:
        while i >= 0:
            if s[i] == '#': skip_s += 1; i -= 1
            elif skip_s > 0: skip_s -= 1; i -= 1
            else: break
        while j >= 0:
            if t[j] == '#': skip_t += 1; j -= 1
            elif skip_t > 0: skip_t -= 1; j -= 1
            else: break
        if i >= 0 and j >= 0 and s[i] != t[j]: return False
        if (i >= 0) != (j >= 0): return False
        i -= 1; j -= 1
    return True`,

    javascript: `function backspaceCompare(s, t) {
  let i = s.length - 1, j = t.length - 1;
  let skipS = 0, skipT = 0;
  while (i >= 0 || j >= 0) {
    while (i >= 0) {
      if (s[i] === '#') { skipS++; i--; }
      else if (skipS > 0) { skipS--; i--; }
      else break;
    }
    while (j >= 0) {
      if (t[j] === '#') { skipT++; j--; }
      else if (skipT > 0) { skipT--; j--; }
      else break;
    }
    if (i >= 0 && j >= 0 && s[i] !== t[j]) return false;
    if ((i >= 0) !== (j >= 0)) return false;
    i--; j--;
  }
  return true;
}`,

    java: `public boolean backspaceCompare(String s, String t) {
    int i = s.length() - 1, j = t.length() - 1;
    int skipS = 0, skipT = 0;
    while (i >= 0 || j >= 0) {
        while (i >= 0) {
            if (s.charAt(i) == '#') { skipS++; i--; }
            else if (skipS > 0) { skipS--; i--; }
            else break;
        }
        while (j >= 0) {
            if (t.charAt(j) == '#') { skipT++; j--; }
            else if (skipT > 0) { skipT--; j--; }
            else break;
        }
        if (i >= 0 && j >= 0 && s.charAt(i) != t.charAt(j)) return false;
        if ((i >= 0) != (j >= 0)) return false;
        i--; j--;
    }
    return true;
}`,
  },

  defaultInput: {
    s: 'ab#c',
    t: 'ad#c',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'ab#c',
      placeholder: 'ab#c',
      helperText: 'String with optional # backspace characters',
    },
    {
      name: 't',
      label: 'String T',
      type: 'string',
      defaultValue: 'ad#c',
      placeholder: 'ad#c',
      helperText: 'String with optional # backspace characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const steps: AlgorithmStep[] = [];

    // Helper to process string with backspaces
    const processString = (str: string): string => {
      const stack: string[] = [];
      for (const ch of str) {
        if (ch === '#') stack.pop();
        else stack.push(ch);
      }
      return stack.join('');
    };

    const sProcessed = processString(s);
    const tProcessed = processString(t);

    // Represent strings as char code arrays for visualization
    const sArr = s.split('').map((c) => c.charCodeAt(0));
    const tArr = t.split('').map((c) => c.charCodeAt(0));

    const makeViz = (
      arr: number[],
      highlights: Record<number, string>,
      labels: Record<number, string>,
      auxLabel?: string,
      auxEntries?: { key: string; value: string }[]
    ): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
      ...(auxLabel !== undefined
        ? { auxData: { label: auxLabel, entries: auxEntries ?? [] } }
        : {}),
    });

    steps.push({
      line: 1,
      explanation: `Compare strings s="${s}" and t="${t}" after processing backspace characters (#).`,
      variables: { s, t },
      visualization: makeViz(sArr, {}, {}, 'Strings', [
        { key: 's', value: s },
        { key: 't', value: t },
      ]),
    });

    // Simulate processing s
    const sStack: string[] = [];
    for (let k = 0; k < s.length; k++) {
      const ch = s[k];
      if (ch === '#') {
        const popped = sStack.pop() ?? '';
        steps.push({
          line: 6,
          explanation: `Processing s[${k}] = '#'. Backspace: remove '${popped}' from s. s stack: [${sStack.join(', ')}]`,
          variables: { k, char: ch, sStack: [...sStack] },
          visualization: makeViz(
            sArr,
            { [k]: 'mismatch' },
            { [k]: '#' },
            'S Stack',
            sStack.map((c, i) => ({ key: `${i}`, value: c }))
          ),
        });
      } else {
        sStack.push(ch);
        steps.push({
          line: 5,
          explanation: `Processing s[${k}] = '${ch}'. Push to s stack. s stack: [${sStack.join(', ')}]`,
          variables: { k, char: ch, sStack: [...sStack] },
          visualization: makeViz(
            sArr,
            { [k]: 'active' },
            { [k]: ch },
            'S Stack',
            sStack.map((c, i) => ({ key: `${i}`, value: c }))
          ),
        });
      }
    }

    // Simulate processing t
    const tStack: string[] = [];
    for (let k = 0; k < t.length; k++) {
      const ch = t[k];
      if (ch === '#') {
        const popped = tStack.pop() ?? '';
        steps.push({
          line: 9,
          explanation: `Processing t[${k}] = '#'. Backspace: remove '${popped}' from t. t stack: [${tStack.join(', ')}]`,
          variables: { k, char: ch, tStack: [...tStack] },
          visualization: makeViz(
            tArr,
            { [k]: 'mismatch' },
            { [k]: '#' },
            'T Stack',
            tStack.map((c, i) => ({ key: `${i}`, value: c }))
          ),
        });
      } else {
        tStack.push(ch);
        steps.push({
          line: 8,
          explanation: `Processing t[${k}] = '${ch}'. Push to t stack. t stack: [${tStack.join(', ')}]`,
          variables: { k, char: ch, tStack: [...tStack] },
          visualization: makeViz(
            tArr,
            { [k]: 'active' },
            { [k]: ch },
            'T Stack',
            tStack.map((c, i) => ({ key: `${i}`, value: c }))
          ),
        });
      }
    }

    const equal = sProcessed === tProcessed;
    steps.push({
      line: 14,
      explanation: `Processed s = "${sProcessed}", processed t = "${tProcessed}". Result: ${equal ? 'EQUAL (true)' : 'NOT EQUAL (false)'}.`,
      variables: { sProcessed, tProcessed, equal },
      visualization: makeViz(
        sArr,
        Object.fromEntries(sArr.map((_, i) => [i, equal ? 'found' : 'mismatch'])),
        {},
        'Comparison',
        [
          { key: 's final', value: sProcessed },
          { key: 't final', value: tProcessed },
          { key: 'equal', value: String(equal) },
        ]
      ),
    });

    return steps;
  },
};

export default backspaceStringCompare;
