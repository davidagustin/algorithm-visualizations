import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const camelcaseMatchingTrie: AlgorithmDefinition = {
  id: 'camelcase-matching-trie',
  title: 'CamelCase Matching (Trie)',
  leetcodeNumber: 1023,
  difficulty: 'Medium',
  category: 'Trie',
  description:
    'Given a list of queries and a pattern, determine which queries match the pattern. A query matches if you can insert lowercase letters into the pattern to get the query. Equivalently, the uppercase letters of query must exactly match pattern in order, and lowercase letters in query can be freely inserted. Use a trie of queries, then traverse matching against the pattern.',
  tags: ['trie', 'string', 'two pointers'],

  code: {
    pseudocode: `function camelMatch(queries, pattern):
  result = []
  for query in queries:
    pi = 0
    matched = True
    for ch in query:
      if pi < len(pattern) and ch == pattern[pi]:
        pi += 1
      elif ch.isupper():
        matched = False
        break
    if matched and pi == len(pattern):
      result.append(True)
    else:
      result.append(False)
  return result`,

    python: `def camelMatch(queries, pattern):
    def matches(query):
        pi = 0
        for ch in query:
            if pi < len(pattern) and ch == pattern[pi]:
                pi += 1
            elif ch.isupper():
                return False
        return pi == len(pattern)
    return [matches(q) for q in queries]`,

    javascript: `function camelMatch(queries, pattern) {
  function matches(query) {
    let pi = 0;
    for (const ch of query) {
      if (pi < pattern.length && ch === pattern[pi]) { pi++; }
      else if (ch >= 'A' && ch <= 'Z') { return false; }
    }
    return pi === pattern.length;
  }
  return queries.map(matches);
}`,

    java: `public List<Boolean> camelMatch(String[] queries, String pattern) {
    List<Boolean> res = new ArrayList<>();
    for (String q : queries) {
        int pi = 0; boolean ok = true;
        for (char ch : q.toCharArray()) {
            if (pi < pattern.length() && ch == pattern.charAt(pi)) { pi++; }
            else if (Character.isUpperCase(ch)) { ok = false; break; }
        }
        res.add(ok && pi == pattern.length());
    }
    return res;
}`,
  },

  defaultInput: {
    queries: ['FooBar', 'FooBarTest', 'FootBall', 'FrameBuffer', 'ForceFeedBack'],
    pattern: 'FB',
  },

  inputFields: [
    {
      name: 'queries',
      label: 'Queries',
      type: 'array',
      defaultValue: ['FooBar', 'FooBarTest', 'FootBall', 'FrameBuffer', 'ForceFeedBack'],
      placeholder: 'FooBar,FooBarTest',
      helperText: 'CamelCase query strings',
    },
    {
      name: 'pattern',
      label: 'Pattern',
      type: 'string',
      defaultValue: 'FB',
      placeholder: 'FB',
      helperText: 'Pattern to match (uppercase letters must match exactly)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const queries = input.queries as string[];
    const pattern = input.pattern as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Pattern: "${pattern}". Check each query: pattern chars must appear in order, extra uppercase chars in query are not allowed, extra lowercase chars are fine.`,
      variables: { pattern, queries: queries.length },
      visualization: makeViz(queries.map((q) => q.length), Object.fromEntries(queries.map((_, i) => [i, 'active'])), Object.fromEntries(queries.map((q, i) => [i, q]))),
    });

    const results: boolean[] = [];

    for (let qi = 0; qi < queries.length; qi++) {
      const query = queries[qi];
      let pi = 0;
      let matched = true;

      steps.push({
        line: 3,
        explanation: `Checking query "${query}" against pattern "${pattern}". Scan each character.`,
        variables: { query, pattern, patternIndex: 0 },
        visualization: makeViz(queries.map((q) => q.length), { [qi]: 'active' }, Object.fromEntries(queries.map((q, i) => [i, q]))),
      });

      for (const ch of query) {
        if (pi < pattern.length && ch === pattern[pi]) {
          pi++;
        } else if (ch >= 'A' && ch <= 'Z') {
          matched = false;
          steps.push({
            line: 8,
            explanation: `Uppercase "${ch}" found in query but does not match pattern[${pi}] = "${pattern[pi] ?? 'end'}". Pattern mismatch - return false.`,
            variables: { char: ch, patternIndex: pi, expected: pattern[pi] ?? 'end' },
            visualization: makeViz(queries.map((q) => q.length), { [qi]: 'mismatch' }, Object.fromEntries(queries.map((q, i) => [i, q]))),
          });
          break;
        }
      }

      const finalResult = matched && pi === pattern.length;
      results.push(finalResult);

      steps.push({
        line: 11,
        explanation: `Query "${query}": matched = ${matched}, pattern index reached = ${pi}/${pattern.length}. Result: ${finalResult}.`,
        variables: { query, matched, patternIndexReached: pi, patternLength: pattern.length, result: finalResult },
        visualization: makeViz(
          queries.map((q) => q.length),
          { [qi]: finalResult ? 'found' : 'mismatch' },
          Object.fromEntries(queries.map((q, i) => [i, i < results.length ? (results[i] ? 'true' : 'false') : q]))
        ),
      });
    }

    steps.push({
      line: 14,
      explanation: `Results: [${results.map((r, i) => `"${queries[i]}"=${r}`).join(', ')}].`,
      variables: { results: results.join(', ') },
      visualization: makeViz(queries.map((q) => q.length), Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'mismatch'])), Object.fromEntries(queries.map((q, i) => [i, q]))),
    });

    return steps;
  },
};

export default camelcaseMatchingTrie;
