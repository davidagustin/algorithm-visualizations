import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const flippingAnImage: AlgorithmDefinition = {
  id: 'flipping-an-image',
  title: 'Flipping an Image',
  leetcodeNumber: 832,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given an n x n binary matrix, flip it horizontally (reverse each row), then invert it (0 becomes 1 and 1 becomes 0). Process each row: use two pointers swapping elements while XOR-ing with 1 to simultaneously reverse and invert. If both elements are the same, XOR flips both; if different, they stay the same after swap-and-flip.',
  tags: ['array', 'two pointers', 'bit manipulation'],

  code: {
    pseudocode: `function flipAndInvertImage(image):
  for each row in image:
    left = 0; right = len(row)-1
    while left <= right:
      tmp = row[left] XOR 1
      row[left] = row[right] XOR 1
      row[right] = tmp
      left++; right--
  return image`,
    python: `def flipAndInvertImage(image):
    for row in image:
        left, right = 0, len(row) - 1
        while left <= right:
            row[left], row[right] = row[right] ^ 1, row[left] ^ 1
            left += 1
            right -= 1
    return image`,
    javascript: `function flipAndInvertImage(image) {
  for (const row of image) {
    let left = 0, right = row.length - 1;
    while (left <= right) {
      [row[left], row[right]] = [row[right] ^ 1, row[left] ^ 1];
      left++;
      right--;
    }
  }
  return image;
}`,
    java: `public int[][] flipAndInvertImage(int[][] image) {
    for (int[] row : image) {
        int left = 0, right = row.length - 1;
        while (left <= right) {
            int tmp = row[left] ^ 1;
            row[left] = row[right] ^ 1;
            row[right] = tmp;
            left++; right--;
        }
    }
    return image;
}`,
  },

  defaultInput: {
    image: [[1, 1, 0], [1, 0, 1], [0, 0, 0]],
  },

  inputFields: [
    {
      name: 'image',
      label: 'Image (flattened rows)',
      type: 'array',
      defaultValue: [1, 1, 0, 1, 0, 1, 0, 0, 0],
      placeholder: '1,1,0,1,0,1,0,0,0',
      helperText: 'Row-major flattened 3x3 binary matrix',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const image = [[1, 1, 0], [1, 0, 1], [0, 0, 0]];
    const steps: AlgorithmStep[] = [];
    const n = image.length;

    const makeViz = (arr: number[], highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...arr],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Flip and invert ${n}x${n} binary image. Each row: reverse it, then XOR each bit with 1.`,
      variables: { n },
      visualization: makeViz(image.flat(), {}, {}),
    });

    for (let r = 0; r < n; r++) {
      const row = [...image[r]];
      steps.push({
        line: 2,
        explanation: `Processing row ${r}: [${row.join(', ')}]. Two pointers will swap and invert simultaneously.`,
        variables: { row: r, values: row.join(', ') },
        visualization: makeViz(
          image.flat(),
          Object.fromEntries(row.map((_, c) => [r * n + c, 'comparing'])),
          {}
        ),
      });

      let left = 0, right = row.length - 1;
      while (left <= right) {
        const lVal = row[left], rVal = row[right];
        const newL = rVal ^ 1, newR = lVal ^ 1;
        row[left] = newL;
        row[right] = newR;
        image[r][left] = newL;
        image[r][right] = newR;

        steps.push({
          line: 5,
          explanation: `Row ${r}: swap indices ${left} and ${right}. left: ${lVal}^1=${newR} -> placed at right, right: ${rVal}^1=${newL} -> placed at left.`,
          variables: { row: r, left, right, oldLeft: lVal, oldRight: rVal, newLeft: newL, newRight: newR },
          visualization: makeViz(
            image.flat(),
            { [r * n + left]: 'active', [r * n + right]: 'active' },
            { [r * n + left]: String(newL), [r * n + right]: String(newR) }
          ),
        });

        left++; right--;
      }

      steps.push({
        line: 8,
        explanation: `Row ${r} done: [${image[r].join(', ')}].`,
        variables: { row: r, result: image[r].join(', ') },
        visualization: makeViz(
          image.flat(),
          Object.fromEntries(image[r].map((_, c) => [r * n + c, 'sorted'])),
          {}
        ),
      });
    }

    steps.push({
      line: 9,
      explanation: `Image flipped and inverted: [${image.map(r => '[' + r.join(',') + ']').join(', ')}].`,
      variables: { result: image.map(r => r.join(',')).join(' | ') },
      visualization: makeViz(image.flat(), Object.fromEntries(image.flat().map((_, i) => [i, 'found'])), {}),
    });

    return steps;
  },
};

export default flippingAnImage;
