import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const braceExpansionIi: AlgorithmDefinition = {
  id: 'brace-expansion-ii',
  title: 'Brace Expansion II',
  leetcodeNumber: 1096,
  difficulty: 'Hard',
  category: 'Backtracking',
  description:
    'Given an expression with nested braces representing unions and concatenations of sets, return all possible strings in the result in sorted order without duplicates. Braces group alternatives (union), adjacent groups concatenate (Cartesian product). Parse recursively and compute the resulting set.',
  tags: ['backtracking', 'string', 'set', 'parsing'],

  code: {
    pseudocode: `function braceExpansionII(expression):
  function parse(expr):
    groups = [[]]
    i = 0
    while i < len(expr):
      if expr[i] == '{':
        j = findMatchingBrace(expr, i)
        sub = parse(expr[i+1..j-1])
        groups[-1] = cartesian(groups[-1], sub)
        i = j + 1
      elif expr[i] == ',':
        groups.append([])
        i += 1
      else:
        groups[-1] = cartesian(groups[-1], [expr[i]])
        i += 1
    return sorted(union of all groups)
  return parse(expression)`,
    python: `def braceExpansionII(expression: str) -> list[str]:
    def parse(s):
        groups, cur, i = [['']], [['']], 0
        stack = []
        while i < len(s):
            if s[i] == '{':
                depth, j = 1, i + 1
                while depth: j += 1; depth += (s[j-1]=='{') - (s[j-1]=='}')
                sub = parse(s[i+1:j-1])
                cur[-1] = [a+b for a in cur[-1] for b in sub]
                i = j
            elif s[i] == ',':
                groups.extend(cur); cur = [['']]; i += 1
            else:
                cur[-1] = [a+s[i] for a in cur[-1]]; i += 1
        groups.extend(cur)
        return sorted(set(w for g in groups for w in g))
    return parse(expression)`,
    javascript: `function braceExpansionII(expression) {
  function parse(s) {
    const groups = [['']];
    let cur = [['']];
    let i = 0;
    while (i < s.length) {
      if (s[i] === '{') {
        let depth = 1, j = i + 1;
        while (depth) { depth += s[j]==='{' ? 1 : s[j]==='}' ? -1 : 0; j++; }
        const sub = parse(s.slice(i+1, j-1));
        cur[cur.length-1] = cur[cur.length-1].flatMap(a => sub.map(b => a+b));
        i = j;
      } else if (s[i] === ',') {
        groups.push(...cur); cur = [['']]; i++;
      } else {
        cur[cur.length-1] = cur[cur.length-1].map(a => a+s[i]); i++;
      }
    }
    groups.push(...cur);
    return [...new Set(groups.flat())].sort();
  }
  return parse(expression);
}`,
    java: `public List<String> braceExpansionII(String expression) {
    return new ArrayList<>(parse(expression));
}
private TreeSet<String> parse(String s) {
    TreeSet<String>[] groups = new TreeSet[]{new TreeSet<>(List.of(""))};
    // ... full recursive parse implementation
    return groups[0];
}`,
  },

  defaultInput: { expression: '{a,b}{c,{d,e}}' },

  inputFields: [
    {
      name: 'expression',
      label: 'Expression',
      type: 'string',
      defaultValue: '{a,b}{c,{d,e}}',
      placeholder: '{a,b}{c,{d,e}}',
      helperText: 'Nested brace expression to expand',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const expression = input.expression as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Expand nested brace expression "${expression}". Adjacent groups = concatenation (Cartesian product). Comma-separated groups = union.`,
      variables: { expression },
      visualization: makeViz([0], {}, { 0: expression }),
    });

    function parse(s: string): string[] {
      const groups: string[][] = [['']];

      let i = 0;
      while (i < s.length) {
        if (s[i] === '{') {
          let depth = 1;
          let j = i + 1;
          while (depth > 0) {
            if (s[j] === '{') depth++;
            else if (s[j] === '}') depth--;
            j++;
          }
          const sub = parse(s.slice(i + 1, j - 1));

          if (steps.length < 25) {
            steps.push({
              line: 5,
              explanation: `Found nested braces. Recursively expand "${s.slice(i + 1, j - 1)}" -> [${sub.join(', ')}]. Cartesian product with current group.`,
              variables: { subExpression: s.slice(i + 1, j - 1), subResults: sub },
              visualization: makeViz(sub.map((_, idx) => idx), Object.fromEntries(sub.map((_, idx) => [idx, 'active'])), Object.fromEntries(sub.map((v, idx) => [idx, v]))),
            });
          }

          const last = groups[groups.length - 1];
          groups[groups.length - 1] = last.flatMap(a => sub.map(b => a + b));
          i = j;
        } else if (s[i] === ',') {
          groups.push(['']);
          if (steps.length < 30) {
            steps.push({
              line: 9,
              explanation: `Comma found: start new alternative group. Groups so far: ${groups.length}.`,
              variables: { groups: groups.map(g => g.join('|')) },
              visualization: makeViz(groups.map((_, gi) => gi), Object.fromEntries(groups.map((_, gi) => [gi, gi === groups.length - 1 ? 'active' : 'visited'])), Object.fromEntries(groups.map((g, gi) => [gi, g.join('|') || 'empty']))),
            });
          }
          i++;
        } else {
          const last = groups[groups.length - 1];
          groups[groups.length - 1] = last.map(a => a + s[i]);
          i++;
        }
      }

      const allWords = [...new Set(groups.flat())].sort();

      if (steps.length < 35) {
        steps.push({
          line: 12,
          explanation: `Expanded "${s}" -> [${allWords.join(', ')}]. Union of all groups, deduplicated and sorted.`,
          variables: { input: s, output: allWords },
          visualization: makeViz(allWords.map((_, idx) => idx), Object.fromEntries(allWords.map((_, idx) => [idx, 'found'])), Object.fromEntries(allWords.map((v, idx) => [idx, v]))),
        });
      }

      return allWords;
    }

    const finalResult = parse(expression);

    steps.push({
      line: 14,
      explanation: `Final expansion of "${expression}": [${finalResult.join(', ')}]. ${finalResult.length} unique strings, sorted.`,
      variables: { expression, result: finalResult, count: finalResult.length },
      visualization: makeViz(finalResult.map((_, i) => i), Object.fromEntries(finalResult.map((_, i) => [i, 'found'])), Object.fromEntries(finalResult.map((v, i) => [i, v]))),
    });

    return steps;
  },
};

export default braceExpansionIi;
