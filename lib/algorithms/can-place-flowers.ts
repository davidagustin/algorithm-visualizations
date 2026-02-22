import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const canPlaceFlowers: AlgorithmDefinition = {
  id: 'can-place-flowers',
  title: 'Can Place Flowers',
  leetcodeNumber: 605,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a flowerbed array where 0 means empty and 1 means planted, determine if n new flowers can be planted such that no two flowers are adjacent. Greedily plant a flower whenever a position and its neighbors are all empty.',
  tags: ['array', 'greedy'],

  code: {
    pseudocode: `function canPlaceFlowers(flowerbed, n):
  count = 0
  for i from 0 to length(flowerbed)-1:
    if flowerbed[i] == 0:
      leftEmpty = (i == 0 or flowerbed[i-1] == 0)
      rightEmpty = (i == last or flowerbed[i+1] == 0)
      if leftEmpty and rightEmpty:
        flowerbed[i] = 1
        count += 1
        if count >= n: return true
  return count >= n`,

    python: `def canPlaceFlowers(flowerbed: list[int], n: int) -> bool:
    count = 0
    for i in range(len(flowerbed)):
        if flowerbed[i] == 0:
            left = (i == 0 or flowerbed[i - 1] == 0)
            right = (i == len(flowerbed) - 1 or flowerbed[i + 1] == 0)
            if left and right:
                flowerbed[i] = 1
                count += 1
                if count >= n:
                    return True
    return count >= n`,

    javascript: `function canPlaceFlowers(flowerbed, n) {
  let count = 0;
  for (let i = 0; i < flowerbed.length; i++) {
    if (flowerbed[i] === 0) {
      const left = i === 0 || flowerbed[i - 1] === 0;
      const right = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;
      if (left && right) {
        flowerbed[i] = 1;
        count++;
        if (count >= n) return true;
      }
    }
  }
  return count >= n;
}`,

    java: `public boolean canPlaceFlowers(int[] flowerbed, int n) {
    int count = 0;
    for (int i = 0; i < flowerbed.length; i++) {
        if (flowerbed[i] == 0) {
            boolean left = i == 0 || flowerbed[i - 1] == 0;
            boolean right = i == flowerbed.length - 1 || flowerbed[i + 1] == 0;
            if (left && right) {
                flowerbed[i] = 1;
                count++;
                if (count >= n) return true;
            }
        }
    }
    return count >= n;
}`,
  },

  defaultInput: {
    flowerbed: [1, 0, 0, 0, 1],
    n: 1,
  },

  inputFields: [
    {
      name: 'flowerbed',
      label: 'Flowerbed',
      type: 'array',
      defaultValue: [1, 0, 0, 0, 1],
      placeholder: '1,0,0,0,1',
      helperText: '0=empty, 1=planted',
    },
    {
      name: 'n',
      label: 'Flowers to Plant',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of flowers to place',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flowerbed = [...(input.flowerbed as number[])];
    const n = input.n as number;
    const steps: AlgorithmStep[] = [];
    let count = 0;

    steps.push({
      line: 1,
      explanation: `Flowerbed: ${JSON.stringify(flowerbed)}. Need to plant ${n} flowers without adjacency.`,
      variables: { n, count: 0 },
      visualization: {
        type: 'array',
        array: [...flowerbed],
        highlights: {},
        labels: {},
      },
    });

    for (let i = 0; i < flowerbed.length; i++) {
      if (flowerbed[i] === 0) {
        const leftEmpty = i === 0 || flowerbed[i - 1] === 0;
        const rightEmpty = i === flowerbed.length - 1 || flowerbed[i + 1] === 0;

        if (leftEmpty && rightEmpty) {
          flowerbed[i] = 1;
          count++;

          steps.push({
            line: 7,
            explanation: `Position ${i} is empty and both neighbors are empty. Plant flower here. count=${count}.`,
            variables: { i, count, n },
            visualization: {
              type: 'array',
              array: [...flowerbed],
              highlights: { [i]: 'found' },
              labels: { [i]: 'planted' },
            },
          });

          if (count >= n) {
            steps.push({
              line: 9,
              explanation: `Planted ${count} >= n=${n} flowers. Return true!`,
              variables: { count, n, result: true },
              visualization: {
                type: 'array',
                array: [...flowerbed],
                highlights: { [i]: 'found' },
                labels: {},
              },
            });
            return steps;
          }
        } else {
          steps.push({
            line: 4,
            explanation: `Position ${i} is empty but neighbors block planting (left=${leftEmpty}, right=${rightEmpty}). Skip.`,
            variables: { i, leftEmpty, rightEmpty, count },
            visualization: {
              type: 'array',
              array: [...flowerbed],
              highlights: { [i]: 'comparing' },
              labels: { [i]: 'skip' },
            },
          });
        }
      } else {
        steps.push({
          line: 3,
          explanation: `Position ${i} already has a flower. Move on.`,
          variables: { i, count },
          visualization: {
            type: 'array',
            array: [...flowerbed],
            highlights: { [i]: 'active' },
            labels: {},
          },
        });
      }
    }

    const result = count >= n;
    steps.push({
      line: 10,
      explanation: `End of flowerbed. Planted ${count} flowers. Need ${n}. Return ${result}.`,
      variables: { count, n, result },
      visualization: {
        type: 'array',
        array: [...flowerbed],
        highlights: {},
        labels: {},
      },
    });

    return steps;
  },
};

export default canPlaceFlowers;
