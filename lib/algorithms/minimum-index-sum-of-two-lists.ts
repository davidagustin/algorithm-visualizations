import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const minimumIndexSumOfTwoLists: AlgorithmDefinition = {
  id: 'minimum-index-sum-of-two-lists',
  title: 'Minimum Index Sum of Two Lists',
  leetcodeNumber: 599,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Given two lists of restaurant preferences, find the common interests with the minimum index sum. Store the first list in a hash map (restaurant -> index), then for each item in the second list that is also in the map, compute the index sum and track the minimum.',
  tags: ['hash map', 'array', 'string'],

  code: {
    pseudocode: `function findRestaurant(list1, list2):
  indexMap = {}
  for i, r in enumerate(list1):
    indexMap[r] = i
  result = []
  minSum = infinity
  for j, r in enumerate(list2):
    if r in indexMap:
      s = indexMap[r] + j
      if s < minSum:
        minSum = s
        result = [r]
      elif s == minSum:
        result.append(r)
  return result`,

    python: `def findRestaurant(list1, list2):
    idx = {r: i for i, r in enumerate(list1)}
    res, minS = [], float('inf')
    for j, r in enumerate(list2):
        if r in idx:
            s = idx[r] + j
            if s < minS:
                minS, res = s, [r]
            elif s == minS:
                res.append(r)
    return res`,

    javascript: `function findRestaurant(list1, list2) {
  const idx = new Map(list1.map((r, i) => [r, i]));
  let res = [], minS = Infinity;
  for (let j = 0; j < list2.length; j++) {
    if (idx.has(list2[j])) {
      const s = idx.get(list2[j]) + j;
      if (s < minS) { minS = s; res = [list2[j]]; }
      else if (s === minS) res.push(list2[j]);
    }
  }
  return res;
}`,

    java: `public String[] findRestaurant(String[] list1, String[] list2) {
    Map<String, Integer> idx = new HashMap<>();
    for (int i = 0; i < list1.length; i++) idx.put(list1[i], i);
    List<String> res = new ArrayList<>();
    int minS = Integer.MAX_VALUE;
    for (int j = 0; j < list2.length; j++) {
        if (idx.containsKey(list2[j])) {
            int s = idx.get(list2[j]) + j;
            if (s < minS) { minS = s; res.clear(); res.add(list2[j]); }
            else if (s == minS) res.add(list2[j]);
        }
    }
    return res.toArray(new String[0]);
}`,
  },

  defaultInput: {
    list1: ['Shogun', 'Tapioca Express', 'Burger King', 'KFC'],
    list2: ['Piatti', 'The Grill at Torrey Pines', 'Hungry Hunters Steakhouse', 'Shogun'],
  },

  inputFields: [
    {
      name: 'list1',
      label: 'List 1',
      type: 'array',
      defaultValue: ['Shogun', 'Tapioca Express', 'Burger King', 'KFC'],
      placeholder: 'Shogun,Tapioca Express',
      helperText: 'Comma-separated restaurant names',
    },
    {
      name: 'list2',
      label: 'List 2',
      type: 'array',
      defaultValue: ['Piatti', 'The Grill at Torrey Pines', 'Hungry Hunters Steakhouse', 'Shogun'],
      placeholder: 'Piatti,Shogun',
      helperText: 'Comma-separated restaurant names',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const list1 = input.list1 as string[];
    const list2 = input.list2 as string[];
    const steps: AlgorithmStep[] = [];
    const indexMap: Record<string, number> = {};

    const makeViz = (arr: (string | number)[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: arr as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Store list1 in a hash map for O(1) lookups. list1 has ${list1.length} items.`,
      variables: { indexMap: '{}' },
      visualization: makeViz(list1, {}, {}),
    });

    for (let i = 0; i < list1.length; i++) {
      indexMap[list1[i]] = i;
      steps.push({
        line: 3,
        explanation: `indexMap["${list1[i]}"] = ${i}.`,
        variables: { i, item: list1[i], indexMap: JSON.stringify(indexMap) },
        visualization: makeViz(list1, { [i]: 'visited' }, { [i]: `idx=${i}` }),
      });
    }

    const result: string[] = [];
    let minSum = Infinity;

    steps.push({
      line: 5,
      explanation: `Map built: ${JSON.stringify(indexMap)}. Now scan list2 for common items.`,
      variables: { indexMap: JSON.stringify(indexMap), minSum: 'Inf', result: '[]' },
      visualization: makeViz(list2, {}, {}),
    });

    for (let j = 0; j < list2.length; j++) {
      const r = list2[j];
      if (r in indexMap) {
        const s = indexMap[r] + j;
        steps.push({
          line: 8,
          explanation: `list2[${j}]="${r}" is in map at index ${indexMap[r]}. Index sum = ${indexMap[r]} + ${j} = ${s}. Current minSum = ${minSum === Infinity ? 'Inf' : minSum}.`,
          variables: { j, item: r, indexInList1: indexMap[r], indexSum: s, minSum: minSum === Infinity ? 'Inf' : minSum },
          visualization: makeViz(list2, { [j]: 'active' }, { [j]: `sum=${s}` }),
        });

        if (s < minSum) {
          minSum = s;
          result.length = 0;
          result.push(r);
          steps.push({
            line: 9,
            explanation: `New minimum index sum ${s}. Reset result to ["${r}"].`,
            variables: { minSum, result: JSON.stringify(result) },
            visualization: makeViz(list2, { [j]: 'found' }, { [j]: 'best!' }),
          });
        } else if (s === minSum) {
          result.push(r);
          steps.push({
            line: 11,
            explanation: `Same minimum sum ${s}. Add "${r}" to result: ${JSON.stringify(result)}.`,
            variables: { minSum, result: JSON.stringify(result) },
            visualization: makeViz(list2, { [j]: 'found' }, { [j]: 'tie' }),
          });
        }
      } else {
        steps.push({
          line: 7,
          explanation: `list2[${j}]="${r}" not in list1. Skip.`,
          variables: { j, item: r },
          visualization: makeViz(list2, { [j]: 'comparing' }, { [j]: 'miss' }),
        });
      }
    }

    steps.push({
      line: 12,
      explanation: `Done. Common restaurants with minimum index sum (${minSum}): ${JSON.stringify(result)}.`,
      variables: { result: JSON.stringify(result), minSum },
      visualization: makeViz(list2, {}, {}),
    });

    return steps;
  },
};

export default minimumIndexSumOfTwoLists;
