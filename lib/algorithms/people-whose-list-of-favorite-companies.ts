import type { AlgorithmDefinition, AlgorithmStep, DPVisualization } from '../types';

const peopleWhoseListOfFavoriteCompanies: AlgorithmDefinition = {
  id: 'people-whose-list-of-favorite-companies',
  title: "People Whose List of Favorite Companies is Not a Subset",
  leetcodeNumber: 1452,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    "Find all people whose favorite company list is not a subset of any other person's list. Uses bitmask encoding: each company gets a bit, each person gets a bitmask. Then check if any person's mask is a subset of another (mask_i & mask_j == mask_i).",
  tags: ['Dynamic Programming', 'Bitmask', 'Bit Manipulation', 'String', 'Set'],
  code: {
    pseudocode: `function peopleIndexes(favoriteCompanies):
  n = number of people
  allCompanies = sorted union of all companies
  masks[i] = bitmask for person i
  for each company c in person i's list:
    masks[i] |= (1 << index of c)
  result = []
  for i from 0 to n-1:
    isSubset = false
    for j from 0 to n-1:
      if i == j: continue
      if (masks[i] & masks[j]) == masks[i]:
        isSubset = true; break
    if not isSubset: result.append(i)
  return result`,
    python: `def peopleIndexes(favoriteCompanies):
    companies = sorted(set(c for p in favoriteCompanies for c in p))
    idx = {c: i for i, c in enumerate(companies)}
    masks = [0] * len(favoriteCompanies)
    for i, person in enumerate(favoriteCompanies):
        for c in person:
            masks[i] |= 1 << idx[c]
    result = []
    for i in range(len(favoriteCompanies)):
        if not any(i != j and (masks[i] & masks[j]) == masks[i]
                   for j in range(len(favoriteCompanies))):
            result.append(i)
    return result`,
    javascript: `function peopleIndexes(favoriteCompanies) {
  const companies = [...new Set(favoriteCompanies.flat())].sort();
  const idx = Object.fromEntries(companies.map((c, i) => [c, i]));
  const masks = favoriteCompanies.map(person =>
    person.reduce((m, c) => m | (1 << idx[c]), 0)
  );
  return masks.map((_, i) =>
    !masks.some((m, j) => i !== j && (masks[i] & m) === masks[i]) ? i : -1
  ).filter(x => x !== -1);
}`,
    java: `public List<Integer> peopleIndexes(List<List<String>> favoriteCompanies) {
    Set<String> all = new TreeSet<>();
    for (List<String> p : favoriteCompanies) all.addAll(p);
    List<String> companies = new ArrayList<>(all);
    Map<String,Integer> idx = new HashMap<>();
    for (int i=0;i<companies.size();i++) idx.put(companies.get(i),i);
    int n = favoriteCompanies.size();
    long[] masks = new long[n];
    for (int i=0;i<n;i++)
        for (String c : favoriteCompanies.get(i)) masks[i] |= 1L<<idx.get(c);
    List<Integer> result = new ArrayList<>();
    outer: for (int i=0;i<n;i++) {
        for (int j=0;j<n;j++)
            if (i!=j && (masks[i]&masks[j])==masks[i]) continue outer;
        result.add(i);
    }
    return result;
}`,
  },
  defaultInput: {
    favoriteCompanies: [
      ['leetcode', 'google', 'facebook'],
      ['google', 'microsoft'],
      ['google', 'facebook'],
      ['google'],
      ['amazon'],
    ],
  },
  inputFields: [
    {
      name: 'favoriteCompanies',
      label: 'Favorite Companies (JSON)',
      type: 'string',
      defaultValue: '[["leetcode","google","facebook"],["google","microsoft"],["google","facebook"],["google"],["amazon"]]',
      placeholder: '[["a","b"],["a"]]',
      helperText: 'JSON array of company lists per person',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    let favoriteCompanies: string[][];
    try {
      favoriteCompanies = JSON.parse(input.favoriteCompanies as string) as string[][];
    } catch {
      favoriteCompanies = [['leetcode', 'google'], ['google'], ['amazon']];
    }
    const n = Math.min(favoriteCompanies.length, 5);
    const people = favoriteCompanies.slice(0, n);

    const allCompanies = [...new Set(people.flat())].sort();
    const companyIdx: Record<string, number> = Object.fromEntries(allCompanies.map((c, i) => [c, i]));
    const numCompanies = allCompanies.length;
    const masks: number[] = people.map(person =>
      person.reduce((m, c) => m | (1 << (companyIdx[c] || 0)), 0)
    );

    const dp: (number | null)[] = masks.map(m => m);
    const labels: string[] = masks.map((m, i) => `P${i}:${m.toString(2).padStart(Math.max(numCompanies, 1), '0')}`);
    const steps: AlgorithmStep[] = [];

    function makeViz(activeIdx: number | null): DPVisualization {
      const highlights: Record<number, string> = {};
      for (let i = 0; i < n; i++) highlights[i] = 'found';
      if (activeIdx !== null) highlights[activeIdx] = 'active';
      return { type: 'dp-table', values: dp.slice(), highlights, labels };
    }

    steps.push({
      line: 1,
      explanation: `${n} people, ${numCompanies} unique companies. Each person encoded as bitmask. masks=${JSON.stringify(masks.map(m=>m.toString(2).padStart(Math.max(numCompanies,1),'0')))}.`,
      variables: { masks, allCompanies },
      visualization: makeViz(null),
    });

    const result: number[] = [];
    for (let i = 0; i < n; i++) {
      let isSubset = false;
      for (let j = 0; j < n; j++) {
        if (i === j) continue;
        if ((masks[i] & masks[j]) === masks[i]) {
          isSubset = true;
          steps.push({
            line: 9,
            explanation: `Person ${i} mask=${masks[i].toString(2)} is subset of person ${j} mask=${masks[j].toString(2)}. Person ${i} excluded.`,
            variables: { person: i, subsetOf: j },
            visualization: makeViz(i),
          });
          break;
        }
      }
      if (!isSubset) {
        result.push(i);
        steps.push({
          line: 10,
          explanation: `Person ${i} (${JSON.stringify(people[i])}) mask is NOT a subset of anyone else. Include person ${i}.`,
          variables: { person: i, companies: people[i] },
          visualization: makeViz(i),
        });
      }
    }

    steps.push({
      line: 11,
      explanation: `Result: people ${JSON.stringify(result)} have lists not subset of any other.`,
      variables: { result },
      visualization: makeViz(null),
    });

    return steps;
  },
};

export default peopleWhoseListOfFavoriteCompanies;
