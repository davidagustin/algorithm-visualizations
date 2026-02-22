import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const numberOfAtomsStack: AlgorithmDefinition = {
  id: 'number-of-atoms-stack',
  title: 'Number of Atoms (Stack Parsing)',
  leetcodeNumber: 726,
  difficulty: 'Hard',
  category: 'Stack',
  description:
    'Given a chemical formula string like "H2O" or "Mg(OH)2", return the count of each atom in a sorted format. Use a stack of frequency maps. On opening paren push a new map. On closing paren pop the top map, multiply all its counts by the following number, then merge into the map below. Atom names start with uppercase followed by optional lowercase letters.',
  tags: ['stack', 'hash map', 'string', 'sorting'],

  code: {
    pseudocode: `function countOfAtoms(formula):
  stack = [{}]  // stack of frequency maps
  i = 0
  while i < len(formula):
    c = formula[i]
    if c == '(':
      stack.push({})
      i++
    elif c == ')':
      i++
      start = i
      while i < len and formula[i].isdigit(): i++
      mult = int(formula[start:i]) or 1
      top = stack.pop()
      for atom, cnt in top.items():
        stack.top()[atom] += cnt * mult
    elif c.isupper():
      start = i; i++
      while i < len and formula[i].islower(): i++
      atom = formula[start:i]
      j = i
      while i < len and formula[i].isdigit(): i++
      cnt = int(formula[j:i]) or 1
      stack.top()[atom] += cnt
  result = sorted(stack[0].items())
  return join(atom + (str(cnt) if cnt > 1 else '') for atom, cnt in result)`,

    python: `def countOfAtoms(formula: str) -> str:
    from collections import defaultdict
    stack = [defaultdict(int)]
    i = 0
    n = len(formula)
    while i < n:
        if formula[i] == '(':
            stack.append(defaultdict(int))
            i += 1
        elif formula[i] == ')':
            i += 1
            j = i
            while i < n and formula[i].isdigit(): i += 1
            mult = int(formula[j:i]) if j < i else 1
            top = stack.pop()
            for atom, cnt in top.items():
                stack[-1][atom] += cnt * mult
        elif formula[i].isupper():
            j = i; i += 1
            while i < n and formula[i].islower(): i += 1
            atom = formula[j:i]
            j = i
            while i < n and formula[i].isdigit(): i += 1
            cnt = int(formula[j:i]) if j < i else 1
            stack[-1][atom] += cnt
        else:
            i += 1
    d = stack[0]
    return ''.join(atom + (str(d[atom]) if d[atom] > 1 else '') for atom in sorted(d))`,

    javascript: `function countOfAtoms(formula) {
  const stack = [new Map()];
  let i = 0;
  while (i < formula.length) {
    if (formula[i] === '(') { stack.push(new Map()); i++; }
    else if (formula[i] === ')') {
      i++;
      let j = i;
      while (i < formula.length && formula[i] >= '0') i++;
      const mult = j < i ? +formula.slice(j, i) : 1;
      const top = stack.pop();
      for (const [atom, cnt] of top) {
        stack[stack.length-1].set(atom, (stack[stack.length-1].get(atom) || 0) + cnt * mult);
      }
    } else if (formula[i] >= 'A' && formula[i] <= 'Z') {
      let j = i++; while (i < formula.length && formula[i] >= 'a') i++;
      const atom = formula.slice(j, i); j = i;
      while (i < formula.length && formula[i] >= '0') i++;
      const cnt = j < i ? +formula.slice(j, i) : 1;
      stack[stack.length-1].set(atom, (stack[stack.length-1].get(atom) || 0) + cnt);
    } else i++;
  }
  const d = stack[0];
  return [...d.keys()].sort().map(a => a + (d.get(a) > 1 ? d.get(a) : '')).join('');
}`,

    java: `public String countOfAtoms(String formula) {
    Deque<Map<String,Integer>> stack = new ArrayDeque<>();
    stack.push(new TreeMap<>());
    int i = 0, n = formula.length();
    while (i < n) {
        char c = formula.charAt(i);
        if (c == '(') { stack.push(new TreeMap<>()); i++; }
        else if (c == ')') {
            i++;
            int j = i;
            while (i < n && Character.isDigit(formula.charAt(i))) i++;
            int mult = j < i ? Integer.parseInt(formula.substring(j, i)) : 1;
            Map<String,Integer> top = stack.pop();
            for (Map.Entry<String,Integer> e : top.entrySet())
                stack.peek().merge(e.getKey(), e.getValue() * mult, Integer::sum);
        } else if (Character.isUpperCase(c)) {
            int j = i++;
            while (i < n && Character.isLowerCase(formula.charAt(i))) i++;
            String atom = formula.substring(j, i); j = i;
            while (i < n && Character.isDigit(formula.charAt(i))) i++;
            int cnt = j < i ? Integer.parseInt(formula.substring(j, i)) : 1;
            stack.peek().merge(atom, cnt, Integer::sum);
        } else i++;
    }
    // build result
    StringBuilder sb = new StringBuilder();
    for (Map.Entry<String,Integer> e : stack.peek().entrySet())
        sb.append(e.getKey()).append(e.getValue() > 1 ? e.getValue() : "");
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
      helperText: 'Chemical formula string, e.g. H2O, Mg(OH)2',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const formula = input.formula as string;
    const steps: AlgorithmStep[] = [];
    const chars = formula.split('');

    // Stack of frequency maps
    const mapStack: Map<string, number>[] = [new Map()];
    const stackDisplay: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: mapStack.map(m => '{' + [...m.entries()].map(([k, v]) => k + ':' + v).join(',') + '}'),
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Parse chemical formula "${formula}". Stack of frequency maps handles nested parentheses.`,
      variables: { formula, stackDepth: 1 },
      visualization: makeViz(-1, 'idle'),
    });

    let i = 0;
    const n = formula.length;

    while (i < n) {
      const c = formula[i];

      if (c === '(') {
        mapStack.push(new Map());
        steps.push({
          line: 4,
          explanation: `'(' at index ${i}: push new empty frequency map. Stack depth = ${mapStack.length}.`,
          variables: { i, char: c, stackDepth: mapStack.length },
          visualization: makeViz(i, 'push'),
        });
        i++;
      } else if (c === ')') {
        i++;
        // Parse multiplier
        let j = i;
        while (i < n && formula[i] >= '0' && formula[i] <= '9') i++;
        const mult = j < i ? parseInt(formula.slice(j, i)) : 1;
        const top = mapStack.pop()!;

        steps.push({
          line: 9,
          explanation: `')' found with multiplier ${mult}. Pop top map: {${[...top.entries()].map(([k, v]) => k + ':' + v).join(', ')}}. Multiply by ${mult} and merge.`,
          variables: { mult, topMap: Object.fromEntries(top) },
          visualization: makeViz(i - 1, 'pop'),
        });

        const current = mapStack[mapStack.length - 1];
        for (const [atom, cnt] of top) {
          current.set(atom, (current.get(atom) || 0) + cnt * mult);
        }

        steps.push({
          line: 10,
          explanation: `Merged. Current top map: {${[...current.entries()].map(([k, v]) => k + ':' + v).join(', ')}}.`,
          variables: { currentMap: Object.fromEntries(current) },
          visualization: makeViz(i - 1, 'match'),
        });
      } else if (c >= 'A' && c <= 'Z') {
        // Parse atom name
        let j = i++;
        while (i < n && formula[i] >= 'a' && formula[i] <= 'z') i++;
        const atom = formula.slice(j, i);
        // Parse count
        j = i;
        while (i < n && formula[i] >= '0' && formula[i] <= '9') i++;
        const cnt = j < i ? parseInt(formula.slice(j, i)) : 1;
        const current = mapStack[mapStack.length - 1];
        current.set(atom, (current.get(atom) || 0) + cnt);

        steps.push({
          line: 17,
          explanation: `Atom "${atom}" with count ${cnt}. Added to current map. Map now: {${[...current.entries()].map(([k, v]) => k + ':' + v).join(', ')}}.`,
          variables: { atom, count: cnt, currentMap: Object.fromEntries(current) },
          visualization: makeViz(i - 1, 'idle'),
        });
      } else {
        i++;
      }
    }

    const finalMap = mapStack[0];
    const sortedAtoms = [...finalMap.keys()].sort();
    const result = sortedAtoms.map(a => a + (finalMap.get(a)! > 1 ? finalMap.get(a) : '')).join('');

    steps.push({
      line: 20,
      explanation: `Final atom counts: {${sortedAtoms.map(a => a + ':' + finalMap.get(a)).join(', ')}}. Sorted result: "${result}".`,
      variables: { result, counts: Object.fromEntries(finalMap) },
      visualization: makeViz(-1, 'found'),
    });

    void stackDisplay;
    return steps;
  },
};

export default numberOfAtomsStack;
