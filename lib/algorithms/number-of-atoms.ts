import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const numberOfAtoms: AlgorithmDefinition = {
  id: 'number-of-atoms',
  title: 'Number of Atoms',
  leetcodeNumber: 726,
  difficulty: 'Hard',
  category: 'Hash Map',
  description:
    'Parse a chemical formula string and count total atoms. Uses a stack of hash maps: when encountering "(", push a new map; when ")", pop and multiply by the following number, then merge into the top map. Element names and counts are accumulated recursively.',
  tags: ['hash map', 'stack', 'string', 'parsing'],

  code: {
    pseudocode: `function countOfAtoms(formula):
  stack = [{}]
  i = 0
  while i < len(formula):
    if formula[i] == "(":
      stack.push({})
      i += 1
    elif formula[i] == ")":
      i += 1
      j = i
      while i < len(formula) and formula[i].isdigit():
        i += 1
      mult = int(formula[j:i] or 1)
      top = stack.pop()
      for elem, cnt in top.items():
        stack[-1][elem] = stack[-1].get(elem, 0) + cnt * mult
    elif formula[i].isupper():
      j = i + 1
      while j < len(formula) and formula[j].islower():
        j += 1
      elem = formula[i:j]
      i = j
      k = i
      while i < len(formula) and formula[i].isdigit():
        i += 1
      cnt = int(formula[k:i] or 1)
      stack[-1][elem] = stack[-1].get(elem, 0) + cnt
  result = stack[0]
  return "".join(e + (str(c) if c > 1 else "") for e, c in sorted(result.items()))`,

    python: `from collections import defaultdict
def countOfAtoms(formula: str) -> str:
    stack = [defaultdict(int)]
    i = 0
    while i < len(formula):
        if formula[i] == '(':
            stack.append(defaultdict(int))
            i += 1
        elif formula[i] == ')':
            i += 1
            j = i
            while i < len(formula) and formula[i].isdigit(): i += 1
            mult = int(formula[j:i] or 1)
            top = stack.pop()
            for e, c in top.items(): stack[-1][e] += c * mult
        elif formula[i].isupper():
            j = i + 1
            while j < len(formula) and formula[j].islower(): j += 1
            elem = formula[i:j]; i = j
            k = i
            while i < len(formula) and formula[i].isdigit(): i += 1
            stack[-1][elem] += int(formula[k:i] or 1)
    res = stack[0]
    return "".join(e+(str(c)if c>1 else "") for e,c in sorted(res.items()))`,

    javascript: `function countOfAtoms(formula) {
  const stack = [new Map()];
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === '(') { stack.push(new Map()); i++; }
    else if (formula[i] === ')') {
      i++;
      let j = i;
      while (i < formula.length && /\\d/.test(formula[i])) i++;
      const mult = +formula.slice(j, i) || 1;
      const top = stack.pop();
      for (const [e, c] of top) stack[stack.length-1].set(e, (stack[stack.length-1].get(e)||0)+c*mult);
    } else {
      let j = i+1;
      while (j < formula.length && /[a-z]/.test(formula[j])) j++;
      const elem = formula.slice(i, j); i = j;
      let k = i;
      while (i < formula.length && /\\d/.test(formula[i])) i++;
      const cnt = +formula.slice(k, i) || 1;
      stack[stack.length-1].set(elem, (stack[stack.length-1].get(elem)||0)+cnt);
    }
  }
  return [...stack[0].entries()].sort().map(([e,c])=>e+(c>1?c:'')).join('');
}`,

    java: `public String countOfAtoms(String formula) {
    Deque<Map<String,Integer>> stack = new ArrayDeque<>();
    stack.push(new TreeMap<>());
    int i = 0, n = formula.length();
    while (i < n) {
        if (formula.charAt(i) == '(') { stack.push(new TreeMap<>()); i++; }
        else if (formula.charAt(i) == ')') {
            i++; int j = i;
            while (i < n && Character.isDigit(formula.charAt(i))) i++;
            int mult = i > j ? Integer.parseInt(formula.substring(j, i)) : 1;
            Map<String,Integer> top = stack.pop();
            for (var e : top.entrySet()) stack.peek().merge(e.getKey(), e.getValue()*mult, Integer::sum);
        } else {
            int j = i+1;
            while (j < n && Character.isLowerCase(formula.charAt(j))) j++;
            String elem = formula.substring(i, j); i = j;
            int k = i;
            while (i < n && Character.isDigit(formula.charAt(i))) i++;
            int cnt = i > k ? Integer.parseInt(formula.substring(k, i)) : 1;
            stack.peek().merge(elem, cnt, Integer::sum);
        }
    }
    StringBuilder sb = new StringBuilder();
    for (var e : stack.peek().entrySet()) { sb.append(e.getKey()); if(e.getValue()>1) sb.append(e.getValue()); }
    return sb.toString();
}`,
  },

  defaultInput: {
    formula: 'Mg(OH)2',
  },

  inputFields: [
    {
      name: 'formula',
      label: 'Chemical Formula',
      type: 'string',
      defaultValue: 'Mg(OH)2',
      placeholder: 'Mg(OH)2',
      helperText: 'Chemical formula string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const formula = input.formula as string;
    const steps: AlgorithmStep[] = [];
    const stack: Record<string, number>[] = [{}];

    steps.push({
      line: 1,
      explanation: `Parse formula "${formula}". Initialize a stack with one empty map. Process character by character.`,
      variables: { formula, stack: '[{}]' },
      visualization: {
        type: 'array',
        array: Array.from(formula) as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    let i = 0;
    while (i < formula.length) {
      if (formula[i] === '(') {
        steps.push({
          line: 4,
          explanation: `'(' at index ${i}: push a new empty map onto the stack.`,
          variables: { i, char: '(', stackDepth: stack.length + 1 },
          visualization: {
            type: 'array',
            array: Array.from(formula) as unknown as number[],
            highlights: { [i]: 'active' },
            labels: { [i]: 'push' },
          },
        });
        stack.push({});
        i++;
      } else if (formula[i] === ')') {
        i++;
        let j = i;
        while (i < formula.length && /\d/.test(formula[i])) i++;
        const mult = parseInt(formula.slice(j, i) || '1');
        const top = stack.pop()!;

        steps.push({
          line: 9,
          explanation: `')' followed by multiplier ${mult}: pop top map ${JSON.stringify(top)}, multiply all by ${mult}, merge into top.`,
          variables: { mult, top: JSON.stringify(top), stackDepth: stack.length },
          visualization: {
            type: 'array',
            array: Array.from(formula) as unknown as number[],
            highlights: { [j - 1]: 'active' },
            labels: { [j - 1]: `x${mult}` },
          },
        });

        for (const [elem, cnt] of Object.entries(top)) {
          stack[stack.length - 1][elem] = (stack[stack.length - 1][elem] || 0) + cnt * mult;
        }
      } else {
        let j = i + 1;
        while (j < formula.length && /[a-z]/.test(formula[j])) j++;
        const elem = formula.slice(i, j);
        i = j;
        let k = i;
        while (i < formula.length && /\d/.test(formula[i])) i++;
        const cnt = parseInt(formula.slice(k, i) || '1');
        stack[stack.length - 1][elem] = (stack[stack.length - 1][elem] || 0) + cnt;

        steps.push({
          line: 17,
          explanation: `Element "${elem}" with count ${cnt}. stack top["${elem}"] = ${stack[stack.length - 1][elem]}.`,
          variables: { elem, count: cnt, stackTop: JSON.stringify(stack[stack.length - 1]) },
          visualization: {
            type: 'array',
            array: Array.from(formula) as unknown as number[],
            highlights: { [k - elem.length - (cnt > 1 ? String(cnt).length : 0)]: 'found' },
            labels: {},
          },
        });
      }
    }

    const result = Object.entries(stack[0])
      .sort()
      .map(([e, c]) => e + (c > 1 ? c : ''))
      .join('');

    steps.push({
      line: 19,
      explanation: `Parsing complete. Atom counts: ${JSON.stringify(stack[0])}. Sorted formula = "${result}".`,
      variables: { atomCounts: JSON.stringify(stack[0]), result },
      visualization: {
        type: 'array',
        array: Array.from(formula) as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default numberOfAtoms;
