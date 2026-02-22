import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const namingACompany: AlgorithmDefinition = {
  id: 'naming-a-company',
  title: 'Naming a Company',
  leetcodeNumber: 2306,
  difficulty: 'Hard',
  category: 'Hash Map',
  description:
    'Count distinct names formed by swapping the first letters of two ideas. Group ideas by suffix. For each pair of starting letters (a, b), count suffixes that appear in group[a] but not group[b] and vice versa. The contribution is 2 * (count_a_only) * (count_b_only).',
  tags: ['hash map', 'hash set', 'string', 'counting'],

  code: {
    pseudocode: `function distinctNames(ideas):
  groups = defaultdict(set)
  for idea in ideas:
    groups[idea[0]].add(idea[1:])
  count = 0
  letters = list(groups.keys())
  for i in range(len(letters)):
    for j in range(i+1, len(letters)):
      a, b = letters[i], letters[j]
      shared = len(groups[a] & groups[b])
      onlyA = len(groups[a]) - shared
      onlyB = len(groups[b]) - shared
      count += 2 * onlyA * onlyB
  return count`,

    python: `from collections import defaultdict
def distinctNames(ideas: list[str]) -> int:
    groups = defaultdict(set)
    for idea in ideas:
        groups[idea[0]].add(idea[1:])
    count = 0
    letters = list(groups.keys())
    for i in range(len(letters)):
        for j in range(i+1, len(letters)):
            shared = len(groups[letters[i]] & groups[letters[j]])
            count += 2 * (len(groups[letters[i]])-shared) * (len(groups[letters[j]])-shared)
    return count`,

    javascript: `function distinctNames(ideas) {
  const groups = new Map();
  for (const idea of ideas) {
    const key = idea[0], suffix = idea.slice(1);
    if (!groups.has(key)) groups.set(key, new Set());
    groups.get(key).add(suffix);
  }
  let count = 0;
  const letters = [...groups.keys()];
  for (let i = 0; i < letters.length; i++) {
    for (let j = i+1; j < letters.length; j++) {
      const a = groups.get(letters[i]), b = groups.get(letters[j]);
      let shared = 0;
      for (const s of a) if (b.has(s)) shared++;
      count += 2 * (a.size - shared) * (b.size - shared);
    }
  }
  return count;
}`,

    java: `public long distinctNames(String[] ideas) {
    Map<Character, Set<String>> groups = new HashMap<>();
    for (String idea : ideas)
        groups.computeIfAbsent(idea.charAt(0), k -> new HashSet<>()).add(idea.substring(1));
    long count = 0;
    Character[] letters = groups.keySet().toArray(new Character[0]);
    for (int i = 0; i < letters.length; i++) {
        for (int j = i+1; j < letters.length; j++) {
            long shared = groups.get(letters[i]).stream().filter(groups.get(letters[j])::contains).count();
            count += 2 * (groups.get(letters[i]).size()-shared) * (groups.get(letters[j]).size()-shared);
        }
    }
    return count;
}`,
  },

  defaultInput: {
    ideas: ['coffee', 'donuts', 'time', 'toffee'],
  },

  inputFields: [
    {
      name: 'ideas',
      label: 'Ideas',
      type: 'array',
      defaultValue: ['coffee', 'donuts', 'time', 'toffee'],
      placeholder: 'coffee,donuts,time,toffee',
      helperText: 'Comma-separated word ideas',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const ideas = input.ideas as string[];
    const steps: AlgorithmStep[] = [];
    const groups: Record<string, Set<string>> = {};

    steps.push({
      line: 1,
      explanation: `Group ${ideas.length} ideas by their first letter. Each group stores the set of suffixes.`,
      variables: { groups: '{}' },
      visualization: {
        type: 'array',
        array: ideas as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < ideas.length; i++) {
      const idea = ideas[i];
      const key = idea[0];
      const suffix = idea.slice(1);
      if (!groups[key]) groups[key] = new Set();
      groups[key].add(suffix);

      steps.push({
        line: 3,
        explanation: `Idea "${idea}": first letter = "${key}", suffix = "${suffix}". groups["${key}"] = {${Array.from(groups[key]).join(', ')}}.`,
        variables: { idea, key, suffix, groups: JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, Array.from(v)]))) },
        visualization: {
          type: 'array',
          array: ideas as unknown as number[],
          highlights: { [i]: 'active' },
          labels: { [i]: `${key}|${suffix}` },
        },
      });
    }

    let count = 0;
    const letters = Object.keys(groups);

    steps.push({
      line: 5,
      explanation: `Groups built: ${JSON.stringify(Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, Array.from(v)])))}. Letters: [${letters.join(', ')}]. Check each letter pair.`,
      variables: { letters: letters.join(','), count: 0 },
      visualization: {
        type: 'array',
        array: ideas as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < letters.length; i++) {
      for (let j = i + 1; j < letters.length; j++) {
        const a = letters[i], b = letters[j];
        const setA = groups[a];
        const setB = groups[b];
        let shared = 0;
        for (const s of setA) if (setB.has(s)) shared++;
        const onlyA = setA.size - shared;
        const onlyB = setB.size - shared;
        const add = 2 * onlyA * onlyB;
        count += add;

        steps.push({
          line: 10,
          explanation: `Pair ("${a}", "${b}"): shared suffixes = ${shared}, onlyA = ${onlyA}, onlyB = ${onlyB}. Contribution = 2 * ${onlyA} * ${onlyB} = ${add}. count = ${count}.`,
          variables: { letterA: a, letterB: b, shared, onlyA, onlyB, contribution: add, count },
          visualization: {
            type: 'array',
            array: ideas as unknown as number[],
            highlights: {},
            labels: Object.fromEntries(ideas.map((idea, idx) => [idx, idea[0] === a || idea[0] === b ? idea : ''])),
          },
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Done. Total distinct company names = ${count}.`,
      variables: { result: count },
      visualization: {
        type: 'array',
        array: ideas as unknown as number[],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default namingACompany;
