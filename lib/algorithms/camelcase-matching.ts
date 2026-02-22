import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const camelcaseMatching: AlgorithmDefinition = {
  id: 'camelcase-matching',
  title: 'CamelCase Matching',
  leetcodeNumber: 1023,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a list of queries and a pattern, return a boolean array. A query matches the pattern if you can insert lowercase letters into the pattern to get the query. Equivalently, the uppercase letters in the query must match the pattern exactly in order.',
  tags: ['string', 'two pointers', 'pattern matching'],

  code: {
    pseudocode: `function camelMatch(queries, pattern):
  result = []
  for query in queries:
    result.append(matches(query, pattern))
  return result

function matches(query, pattern):
  j = 0  // pointer into pattern
  for char in query:
    if j < len(pattern) and char == pattern[j]:
      j++
    elif char is uppercase:
      return false  // uppercase not in pattern
  return j == len(pattern)`,

    python: `def camelMatch(queries: list[str], pattern: str) -> list[bool]:
    def matches(query, pattern):
        j = 0
        for c in query:
            if j < len(pattern) and c == pattern[j]:
                j += 1
            elif c.isupper():
                return False
        return j == len(pattern)
    return [matches(q, pattern) for q in queries]`,

    javascript: `function camelMatch(queries, pattern) {
  function matches(query, pattern) {
    let j = 0;
    for (const c of query) {
      if (j < pattern.length && c === pattern[j]) j++;
      else if (c >= 'A' && c <= 'Z') return false;
    }
    return j === pattern.length;
  }
  return queries.map(q => matches(q, pattern));
}`,

    java: `public List<Boolean> camelMatch(String[] queries, String pattern) {
    List<Boolean> result = new ArrayList<>();
    for (String query : queries) {
        int j = 0;
        boolean ok = true;
        for (char c : query.toCharArray()) {
            if (j < pattern.length() && c == pattern.charAt(j)) j++;
            else if (Character.isUpperCase(c)) { ok = false; break; }
        }
        result.add(ok && j == pattern.length());
    }
    return result;
}`,
  },

  defaultInput: {
    queries: 'FooBar,FooBarTest,FootBar,BarFoo,FooBarT',
    pattern: 'FoBa',
  },

  inputFields: [
    {
      name: 'queries',
      label: 'Queries (comma-separated)',
      type: 'string',
      defaultValue: 'FooBar,FooBarTest,FootBar,BarFoo,FooBarT',
      placeholder: 'FooBar,FooBarTest,FootBar',
      helperText: 'CamelCase query strings',
    },
    {
      name: 'pattern',
      label: 'Pattern',
      type: 'string',
      defaultValue: 'FoBa',
      placeholder: 'FoBa',
      helperText: 'The CamelCase pattern to match',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const queriesRaw = input.queries as string;
    const pattern = input.pattern as string;
    const queries = queriesRaw.split(',').map(q => q.trim());
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: queries as unknown as number[],
      highlights,
      labels,
    });

    const matches = (query: string): boolean => {
      let j = 0;
      for (const c of query) {
        if (j < pattern.length && c === pattern[j]) j++;
        else if (c >= 'A' && c <= 'Z') return false;
      }
      return j === pattern.length;
    };

    steps.push({
      line: 1,
      explanation: `Match queries [${queries.join(', ')}] against pattern "${pattern}". A query matches if we can insert lowercase letters into pattern to get query.`,
      variables: { pattern, queryCount: queries.length },
      visualization: makeViz({}, {}),
    });

    const results: boolean[] = [];

    for (let qi = 0; qi < queries.length; qi++) {
      const query = queries[qi];
      let j = 0;
      let ok = true;

      const charHighlights: Record<number, string> = {};

      for (let ci = 0; ci < query.length; ci++) {
        const c = query[ci];
        if (j < pattern.length && c === pattern[j]) {
          j++;
          charHighlights[qi] = 'found';
        } else if (c >= 'A' && c <= 'Z') {
          ok = false;
          break;
        }
      }

      const matched = ok && j === pattern.length;
      results.push(matched);

      steps.push({
        line: 7,
        explanation: `Query "${query}": pattern chars matched=${j}/${pattern.length}, extra uppercase=${!ok}. Result: ${matched}.`,
        variables: { query, patternMatched: j, patternLen: pattern.length, result: matched },
        visualization: makeViz({ [qi]: matched ? 'found' : 'mismatch' }, { [qi]: matched ? 'true' : 'false' }),
      });
    }

    steps.push({
      line: 4,
      explanation: `Final results: [${results.join(', ')}] for queries [${queries.join(', ')}].`,
      variables: { results: results.join(',') },
      visualization: makeViz(
        Object.fromEntries(results.map((r, i) => [i, r ? 'found' : 'mismatch'])),
        Object.fromEntries(results.map((r, i) => [i, r ? 'true' : 'false']))
      ),
    });

    return steps;
  },
};

export default camelcaseMatching;
