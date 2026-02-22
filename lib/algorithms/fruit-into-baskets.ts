import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fruitIntoBaskets: AlgorithmDefinition = {
  id: 'fruit-into-baskets',
  title: 'Fruit Into Baskets',
  leetcodeNumber: 904,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'You have two baskets and can pick fruits from a row of trees. Each basket can only hold one type of fruit. Find the maximum number of fruits you can pick (longest subarray with at most 2 distinct values).',
  tags: ['sliding window', 'hash map', 'two pointers', 'at most k distinct'],

  code: {
    pseudocode: `function totalFruit(fruits):
  basket = {}
  left = 0, maxFruits = 0
  for right = 0 to len(fruits)-1:
    basket[fruits[right]] += 1
    while len(basket) > 2:
      basket[fruits[left]] -= 1
      if basket[fruits[left]] == 0:
        remove fruits[left] from basket
      left += 1
    maxFruits = max(maxFruits, right - left + 1)
  return maxFruits`,

    python: `def totalFruit(fruits: list[int]) -> int:
    basket = {}
    left = 0
    max_fruits = 0
    for right in range(len(fruits)):
        basket[fruits[right]] = basket.get(fruits[right], 0) + 1
        while len(basket) > 2:
            basket[fruits[left]] -= 1
            if basket[fruits[left]] == 0:
                del basket[fruits[left]]
            left += 1
        max_fruits = max(max_fruits, right - left + 1)
    return max_fruits`,

    javascript: `function totalFruit(fruits) {
  const basket = new Map();
  let left = 0, maxFruits = 0;
  for (let right = 0; right < fruits.length; right++) {
    basket.set(fruits[right], (basket.get(fruits[right]) || 0) + 1);
    while (basket.size > 2) {
      basket.set(fruits[left], basket.get(fruits[left]) - 1);
      if (basket.get(fruits[left]) === 0) basket.delete(fruits[left]);
      left++;
    }
    maxFruits = Math.max(maxFruits, right - left + 1);
  }
  return maxFruits;
}`,

    java: `public int totalFruit(int[] fruits) {
    Map<Integer, Integer> basket = new HashMap<>();
    int left = 0, maxFruits = 0;
    for (int right = 0; right < fruits.length; right++) {
        basket.merge(fruits[right], 1, Integer::sum);
        while (basket.size() > 2) {
            basket.merge(fruits[left], -1, Integer::sum);
            if (basket.get(fruits[left]) == 0) basket.remove(fruits[left]);
            left++;
        }
        maxFruits = Math.max(maxFruits, right - left + 1);
    }
    return maxFruits;
}`,
  },

  defaultInput: { fruits: [1, 2, 1, 2, 3] },

  inputFields: [
    {
      name: 'fruits',
      label: 'Fruit Types Array',
      type: 'array',
      defaultValue: [1, 2, 1, 2, 3],
      placeholder: '1,2,1,2,3',
      helperText: 'Array of fruit types (integers). Find longest subarray with at most 2 distinct types.',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const fruits = (input.fruits as number[]) || [1, 2, 1, 2, 3];
    const steps: AlgorithmStep[] = [];
    const n = fruits.length;

    const basket = new Map<number, number>();
    let left = 0;
    let maxFruits = 0;
    let bestLeft = 0;
    let bestRight = -1;

    const makeViz = (
      l: number,
      r: number,
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: fruits,
      highlights,
      labels,
      auxData: {
        label: 'Basket Contents',
        entries: Array.from(basket.entries()).map(([type, count]) => ({
          key: `Type ${type}`,
          value: `${count} fruits`,
        })),
      },
    });

    steps.push({
      line: 2,
      explanation: `Initialize empty basket and left pointer. We slide a window to find the longest subarray with at most 2 distinct fruit types.`,
      variables: { left: 0, maxFruits: 0, basket: {} },
      visualization: makeViz(0, -1, {}, {}),
    });

    for (let right = 0; right < n; right++) {
      const fruit = fruits[right];
      basket.set(fruit, (basket.get(fruit) || 0) + 1);

      const expandH: Record<number, string> = {};
      const expandL: Record<number, string> = {};
      if (bestRight >= bestLeft) for (let i = bestLeft; i <= bestRight; i++) expandH[i] = 'found';
      for (let i = left; i < right; i++) expandH[i] = 'active';
      expandH[right] = 'comparing';
      if (left <= right) expandL[left] = 'L';
      expandL[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Add fruits[${right}]=${fruit} to basket. Basket size: ${basket.size}. ${basket.size > 2 ? 'More than 2 types! Must shrink.' : 'Window valid.'}`,
        variables: { left, right, fruit, basketSize: basket.size, basket: Object.fromEntries(basket) },
        visualization: makeViz(left, right, expandH, expandL),
      });

      while (basket.size > 2) {
        const leftFruit = fruits[left];
        const newCount = (basket.get(leftFruit) || 0) - 1;
        if (newCount === 0) basket.delete(leftFruit);
        else basket.set(leftFruit, newCount);

        const shrinkH: Record<number, string> = {};
        const shrinkL: Record<number, string> = {};
        if (bestRight >= bestLeft) for (let i = bestLeft; i <= bestRight; i++) shrinkH[i] = 'found';
        shrinkH[left] = 'visited';
        for (let i = left + 1; i <= right; i++) shrinkH[i] = 'active';
        shrinkH[right] = 'comparing';
        shrinkL[left] = 'L';
        shrinkL[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Remove fruits[${left}]=${leftFruit} from window. ${newCount === 0 ? `Type ${leftFruit} fully removed from basket.` : `Type ${leftFruit} count now ${newCount}.`} Move left to ${left + 1}.`,
          variables: { left: left + 1, right, removed: leftFruit, basket: Object.fromEntries(basket) },
          visualization: makeViz(left, right, shrinkH, shrinkL),
        });

        left++;
      }

      const windowLen = right - left + 1;
      if (windowLen > maxFruits) {
        maxFruits = windowLen;
        bestLeft = left;
        bestRight = right;

        const bestH: Record<number, string> = {};
        const bestL: Record<number, string> = {};
        for (let i = bestLeft; i <= bestRight; i++) bestH[i] = 'found';
        bestL[bestLeft] = 'L';
        bestL[bestRight] = 'R';

        steps.push({
          line: 10,
          explanation: `New max! Window [${left}..${right}] has ${windowLen} fruits with types ${Array.from(basket.keys()).join(',')}. maxFruits=${maxFruits}.`,
          variables: { left, right, windowLen, maxFruits, basket: Object.fromEntries(basket) },
          visualization: makeViz(left, right, bestH, bestL),
        });
      }
    }

    const finalH: Record<number, string> = {};
    const finalL: Record<number, string> = {};
    if (bestRight >= bestLeft) {
      for (let i = bestLeft; i <= bestRight; i++) finalH[i] = 'found';
      finalL[bestLeft] = 'start';
      finalL[bestRight] = 'end';
    }

    steps.push({
      line: 11,
      explanation: `Done! Maximum fruits collectible = ${maxFruits} (subarray [${bestLeft}..${bestRight}]).`,
      variables: { maxFruits, bestWindow: fruits.slice(bestLeft, bestRight + 1) },
      visualization: makeViz(bestLeft, bestRight, finalH, finalL),
    });

    return steps;
  },
};

export default fruitIntoBaskets;
