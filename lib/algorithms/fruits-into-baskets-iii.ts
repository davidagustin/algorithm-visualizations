import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fruitsIntoBasketsIii: AlgorithmDefinition = {
  id: 'fruits-into-baskets-iii',
  title: 'Fruits Into Baskets III',
  leetcodeNumber: 904,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'You have two baskets, and each basket can carry any quantity of fruit but only one type. Given an array of fruit types, find the maximum number of fruits you can pick by starting from any tree and picking from consecutive trees (at most 2 distinct types). Classic sliding window with at most k=2 distinct elements.',
  tags: ['Sliding Window', 'Hash Map', 'Two Pointers', 'Array'],
  code: {
    pseudocode: `function totalFruit(fruits):
  count = {}  // fruit type -> frequency
  left = 0, maxFruits = 0
  for right in 0..n-1:
    count[fruits[right]] += 1
    while len(count) > 2:
      count[fruits[left]] -= 1
      if count[fruits[left]] == 0:
        del count[fruits[left]]
      left++
    maxFruits = max(maxFruits, right - left + 1)
  return maxFruits`,
    python: `from collections import defaultdict
def totalFruit(fruits):
    count = defaultdict(int)
    left = max_fruits = 0
    for right, fruit in enumerate(fruits):
        count[fruit] += 1
        while len(count) > 2:
            count[fruits[left]] -= 1
            if count[fruits[left]] == 0:
                del count[fruits[left]]
            left += 1
        max_fruits = max(max_fruits, right - left + 1)
    return max_fruits`,
    javascript: `function totalFruit(fruits) {
  const count = new Map();
  let left=0, maxFruits=0;
  for (let right=0;right<fruits.length;right++) {
    count.set(fruits[right],(count.get(fruits[right])||0)+1);
    while (count.size>2) {
      count.set(fruits[left],count.get(fruits[left])-1);
      if (count.get(fruits[left])===0) count.delete(fruits[left]);
      left++;
    }
    maxFruits=Math.max(maxFruits,right-left+1);
  }
  return maxFruits;
}`,
    java: `public int totalFruit(int[] fruits) {
    Map<Integer,Integer> count=new HashMap<>();
    int left=0,maxFruits=0;
    for (int right=0;right<fruits.length;right++) {
        count.merge(fruits[right],1,Integer::sum);
        while (count.size()>2) {
            count.merge(fruits[left],-1,Integer::sum);
            if (count.get(fruits[left])==0) count.remove(fruits[left]);
            left++;
        }
        maxFruits=Math.max(maxFruits,right-left+1);
    }
    return maxFruits;
}`,
  },
  defaultInput: { fruits: [1, 2, 1, 2, 3] },
  inputFields: [
    {
      name: 'fruits',
      label: 'Fruits (types as numbers)',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 3],
      placeholder: '1,2,1,2,3',
      helperText: 'Array of fruit types (integers)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const fruits = input.fruits as number[];
    const steps: AlgorithmStep[] = [];
    const n = fruits.length;

    const count = new Map<number, number>();
    let left = 0, maxFruits = 0;

    function makeViz(highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization {
      return {
        type: 'array',
        array: [...fruits],
        highlights,
        labels,
        auxData: {
          label: 'Fruits Into Baskets (2 types max)',
          entries: [
            { key: 'Baskets', value: JSON.stringify(Object.fromEntries(count)) },
            { key: 'Max Fruits', value: String(maxFruits) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Pick max fruits using at most 2 basket types. Sliding window shrinks when more than 2 distinct types appear.`,
      variables: { n },
      visualization: makeViz({}, {}),
    });

    for (let right = 0; right < n; right++) {
      const fruit = fruits[right];
      count.set(fruit, (count.get(fruit) || 0) + 1);

      while (count.size > 2) {
        const lFruit = fruits[left];
        count.set(lFruit, count.get(lFruit)! - 1);
        if (count.get(lFruit) === 0) count.delete(lFruit);
        const h2: Record<number, string> = { [left]: 'mismatch', [right]: 'comparing' };
        steps.push({
          line: 6,
          explanation: `3+ fruit types! Remove fruits[${left}]=${fruits[left]} from basket. left=${left + 1}.`,
          variables: { left, right, removedType: lFruit },
          visualization: makeViz(h2, { [left]: 'rem', [right]: 'new' }),
        });
        left++;
      }

      const windowLen = right - left + 1;
      if (windowLen > maxFruits) maxFruits = windowLen;

      const h: Record<number, string> = {};
      const l: Record<number, string> = { [left]: 'L', [right]: 'R' };
      for (let i = left; i <= right; i++) h[i] = 'pointer';
      h[right] = 'active';

      steps.push({
        line: 9,
        explanation: `Window [${left}..${right}], length=${windowLen}, types=${count.size}. maxFruits=${maxFruits}.`,
        variables: { right, left, windowLen, distinctTypes: count.size, maxFruits },
        visualization: makeViz(h, l),
      });
    }

    const finalH: Record<number, string> = {};
    for (let i = 0; i < n; i++) finalH[i] = 'sorted';
    steps.push({
      line: 11,
      explanation: `Done. Maximum fruits picked with 2 baskets = ${maxFruits}.`,
      variables: { result: maxFruits },
      visualization: makeViz(finalH, {}),
    });

    return steps;
  },
};

export default fruitsIntoBasketsIii;
