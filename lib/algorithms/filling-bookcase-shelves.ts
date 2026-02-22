import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fillingBookcaseShelves: AlgorithmDefinition = {
  id: 'filling-bookcase-shelves',
  title: 'Filling Bookcase Shelves',
  leetcodeNumber: 1105,
  difficulty: 'Medium',
  category: 'Dynamic Programming',
  description:
    'Place books on shelves where each shelf has a fixed width. Books must be placed in order. dp[i] = minimum height for placing the first i books. For each book i, try starting a new shelf at each position j <= i and see if books j..i fit on one shelf.',
  tags: ['dynamic programming', 'array', 'greedy'],

  code: {
    pseudocode: `function minHeightShelves(books, shelfWidth):
  n = len(books)
  dp = array of size n+1, dp[0] = 0
  for i from 1 to n:
    dp[i] = Infinity
    width = 0
    height = 0
    for j from i down to 1:
      width += books[j-1][0]
      if width > shelfWidth: break
      height = max(height, books[j-1][1])
      dp[i] = min(dp[i], dp[j-1] + height)
  return dp[n]`,
    python: `def minHeightShelves(books: list[list[int]], shelfWidth: int) -> int:
    n = len(books)
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    for i in range(1, n + 1):
        width = height = 0
        for j in range(i, 0, -1):
            width += books[j-1][0]
            if width > shelfWidth:
                break
            height = max(height, books[j-1][1])
            dp[i] = min(dp[i], dp[j-1] + height)
    return dp[n]`,
    javascript: `function minHeightShelves(books, shelfWidth) {
  const n = books.length;
  const dp = new Array(n + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= n; i++) {
    let width = 0, height = 0;
    for (let j = i; j >= 1; j--) {
      width += books[j-1][0];
      if (width > shelfWidth) break;
      height = Math.max(height, books[j-1][1]);
      dp[i] = Math.min(dp[i], dp[j-1] + height);
    }
  }
  return dp[n];
}`,
    java: `public int minHeightShelves(int[][] books, int shelfWidth) {
    int n = books.length;
    int[] dp = new int[n + 1];
    Arrays.fill(dp, Integer.MAX_VALUE);
    dp[0] = 0;
    for (int i = 1; i <= n; i++) {
        int width = 0, height = 0;
        for (int j = i; j >= 1; j--) {
            width += books[j-1][0];
            if (width > shelfWidth) break;
            height = Math.max(height, books[j-1][1]);
            dp[i] = Math.min(dp[i], dp[j-1] + height);
        }
    }
    return dp[n];
}`,
  },

  defaultInput: {
    books: [1, 1, 2, 3, 2, 4, 1, 2],
    shelfWidth: 4,
  },

  inputFields: [
    {
      name: 'books',
      label: 'Book Widths (alternating width,height)',
      type: 'array',
      defaultValue: [1, 1, 2, 3, 2, 4, 1, 2],
      placeholder: '1,1,2,3,2,4,1,2',
      helperText: 'Pairs of width,height for each book',
    },
    {
      name: 'shelfWidth',
      label: 'Shelf Width',
      type: 'number',
      defaultValue: 4,
      placeholder: '4',
      helperText: 'Maximum width of each shelf',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBooks = input.books as number[];
    const shelfWidth = input.shelfWidth as number;
    const steps: AlgorithmStep[] = [];

    // Parse books as pairs
    const books: [number, number][] = [];
    for (let i = 0; i < rawBooks.length - 1; i += 2) {
      books.push([rawBooks[i], rawBooks[i + 1]]);
    }
    const n = books.length;
    const dp = new Array(n + 1).fill(Infinity);
    dp[0] = 0;

    const makeViz = (dpArr: number[], highlights: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: dpArr.map(v => (v === Infinity ? -1 : v)),
      highlights,
      labels: Object.fromEntries(dpArr.map((_, i) => [i, `dp[${i}]`])),
    });

    steps.push({
      line: 3,
      explanation: `Initialize dp array for ${n} books with shelfWidth=${shelfWidth}. dp[0]=0.`,
      variables: { n, shelfWidth },
      visualization: makeViz([...dp], { 0: 'found' }),
    });

    for (let i = 1; i <= n; i++) {
      let width = 0;
      let height = 0;
      for (let j = i; j >= 1; j--) {
        width += books[j - 1][0];
        if (width > shelfWidth) break;
        height = Math.max(height, books[j - 1][1]);
        const candidate = dp[j - 1] + height;
        if (candidate < dp[i]) {
          dp[i] = candidate;
          steps.push({
            line: 11,
            explanation: `Book ${i}: shelf from book ${j} to ${i}, width=${width}, height=${height}. dp[${i}] = dp[${j - 1}] + ${height} = ${dp[i]}.`,
            variables: { i, j, width, height, 'dp[i]': dp[i] },
            visualization: makeViz([...dp], { [i]: 'active', [j - 1]: 'comparing' }),
          });
        }
      }
    }

    steps.push({
      line: 12,
      explanation: `Minimum height to fit all ${n} books is dp[${n}] = ${dp[n]}.`,
      variables: { result: dp[n] },
      visualization: makeViz([...dp], { [n]: 'found' }),
    });

    return steps;
  },
};

export default fillingBookcaseShelves;
