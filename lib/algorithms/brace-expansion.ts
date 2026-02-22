import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const braceExpansion: AlgorithmDefinition = {
  id: 'brace-expansion',
  title: 'Brace Expansion',
  leetcodeNumber: 1087,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string expression of the form "{a,b}c{d,e}", expand it into all possible strings in lexicographically sorted order. Parse the expression into groups (single chars or sets from braces), then use backtracking to pick one option from each group and concatenate them.',
  tags: ['backtracking', 'string', 'breadth-first search'],

  code: {
    pseudocode: `function expand(s):
  groups = parse(s)
    // each group is sorted list of choices
  results = []
  function backtrack(idx, current):
    if idx == len(groups):
      results.append(join(current))
      return
    for char in groups[idx]:
      current.append(char)
      backtrack(idx+1, current)
      current.pop()
  backtrack(0, [])
  sort(results)
  return results`,
    python: `def expand(s: str) -> list[str]:
    groups = []
    i = 0
    while i < len(s):
        if s[i] == '{':
            j = s.index('}', i)
            groups.append(sorted(s[i+1:j].split(',')))
            i = j + 1
        else:
            groups.append([s[i]])
            i += 1
    res = []
    def bt(idx, cur):
        if idx == len(groups):
            res.append(''.join(cur)); return
        for c in groups[idx]:
            cur.append(c); bt(idx+1, cur); cur.pop()
    bt(0, [])
    return res`,
    javascript: `function expand(s) {
  const groups = [];
  let i = 0;
  while (i < s.length) {
    if (s[i] === '{') {
      const j = s.indexOf('}', i);
      groups.push(s.slice(i+1, j).split(',').sort());
      i = j + 1;
    } else { groups.push([s[i]]); i++; }
  }
  const res = [];
  function bt(idx, cur) {
    if (idx === groups.length) { res.push(cur.join('')); return; }
    for (const c of groups[idx]) { cur.push(c); bt(idx+1, cur); cur.pop(); }
  }
  bt(0, []);
  return res;
}`,
    java: `public String[] expand(String s) {
    List<List<Character>> groups = new ArrayList<>();
    int i = 0;
    while (i < s.length()) {
        if (s.charAt(i) == '{') {
            int j = s.indexOf('}', i);
            List<Character> g = new ArrayList<>();
            for (String c : s.substring(i+1,j).split(",")) g.add(c.charAt(0));
            Collections.sort(g); groups.add(g); i = j + 1;
        } else { groups.add(List.of(s.charAt(i))); i++; }
    }
    List<String> res = new ArrayList<>();
    backtrack(groups, 0, new StringBuilder(), res);
    return res.toArray(new String[0]);
}`,
  },

  defaultInput: { s: '{a,b}c{d,e}f' },

  inputFields: [
    {
      name: 's',
      label: 'Expression',
      type: 'string',
      defaultValue: '{a,b}c{d,e}f',
      placeholder: '{a,b}c{d,e}f',
      helperText: 'Brace expression to expand',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];

    const groups: string[][] = [];
    let i = 0;
    while (i < s.length) {
      if (s[i] === '{') {
        const j = s.indexOf('}', i);
        groups.push(s.slice(i + 1, j).split(',').sort());
        i = j + 1;
      } else {
        groups.push([s[i]]);
        i++;
      }
    }

    const results: string[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Parse "${s}" into ${groups.length} groups: [${groups.map(g => `[${g.join(',')}]`).join(', ')}]. Backtrack to pick one from each.`,
      variables: { expression: s, groups: groups.map(g => g.join('|')), totalCombinations: groups.reduce((acc, g) => acc * g.length, 1) },
      visualization: makeViz(groups.map((_, i) => i), {}, Object.fromEntries(groups.map((g, i) => [i, g.join('|')]))),
    });

    function backtrack(idx: number, current: string[]) {
      if (idx === groups.length) {
        const word = current.join('');
        results.push(word);
        steps.push({
          line: 8,
          explanation: `Formed word: "${word}". Total results so far: ${results.length}.`,
          variables: { word, totalResults: results.length },
          visualization: makeViz(
            groups.map((_, i) => i),
            Object.fromEntries(groups.map((_, i) => [i, 'found'])),
            Object.fromEntries(groups.map((g, i) => [i, current[i] || g[0]]))
          ),
        });
        return;
      }

      for (const c of groups[idx]) {
        current.push(c);

        if (steps.length < 30) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          groups.forEach((g, gi) => {
            if (gi < idx) { h[gi] = 'visited'; l[gi] = current[gi]; }
            else if (gi === idx) { h[gi] = 'active'; l[gi] = c; }
            else { l[gi] = g.join('|'); }
          });
          steps.push({
            line: 10,
            explanation: `Group ${idx}: choose "${c}". Current prefix: "${current.join('')}".`,
            variables: { group: idx, choice: c, prefix: current.join('') },
            visualization: makeViz(groups.map((_, i) => i), h, l),
          });
        }

        backtrack(idx + 1, current);
        current.pop();
      }
    }

    backtrack(0, []);

    steps.push({
      line: 13,
      explanation: `Expansion complete. ${results.length} words generated: [${results.join(', ')}].`,
      variables: { totalWords: results.length, words: results },
      visualization: makeViz(groups.map((_, i) => i), {}, Object.fromEntries(groups.map((g, i) => [i, g.join('|')]))),
    });

    return steps;
  },
};

export default braceExpansion;
