import type { AlgorithmDefinition, AlgorithmStep, StackVisualization } from '../types';

const countCollisionsOnRoad: AlgorithmDefinition = {
  id: 'count-collisions-on-road',
  title: 'Count Collisions on a Road',
  leetcodeNumber: 2211,
  difficulty: 'Medium',
  category: 'Stack',
  description:
    'There are n cars on an infinite road. Each car moves Left or Right or Stopped. When a right-moving car collides with a left-moving or stopped car, all involved cars stop. Count the total number of collisions. Key insight: all leading Left cars and trailing Right cars never collide. Trim them and count remaining non-stopped cars as collisions.',
  tags: ['stack', 'string', 'simulation', 'counting'],

  code: {
    pseudocode: `function countCollisions(directions):
  s = trim leading 'L' and trailing 'R' from directions
  collisions = 0
  for c in s:
    if c != 'S': collisions += 1
  return collisions
  // Alternative stack approach:
  // Use stack, for each 'L' pop right-moving cars (each pop = collision)
  // Stopped cars merge collisions`,

    python: `def countCollisions(directions: str) -> int:
    # Trim: leading L cars and trailing R cars never collide
    s = directions.lstrip('L').rstrip('R')
    return sum(1 for c in s if c != 'S')`,

    javascript: `function countCollisions(directions) {
  let left = 0, right = directions.length - 1;
  while (left < directions.length && directions[left] === 'L') left++;
  while (right >= 0 && directions[right] === 'R') right--;
  let count = 0;
  for (let i = left; i <= right; i++) {
    if (directions[i] !== 'S') count++;
  }
  return count;
}`,

    java: `public int countCollisions(String directions) {
    int left = 0, right = directions.length() - 1;
    while (left < directions.length() && directions.charAt(left) == 'L') left++;
    while (right >= 0 && directions.charAt(right) == 'R') right--;
    int count = 0;
    for (int i = left; i <= right; i++) {
        if (directions.charAt(i) != 'S') count++;
    }
    return count;
}`,
  },

  defaultInput: {
    directions: 'RLRSLL',
  },

  inputFields: [
    {
      name: 'directions',
      label: 'Directions',
      type: 'string',
      defaultValue: 'RLRSLL',
      placeholder: 'RLRSLL',
      helperText: 'String of L (left), R (right), S (stopped) for each car',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const directions = input.directions as string;
    const steps: AlgorithmStep[] = [];
    const chars = directions.split('');
    const stack: string[] = [];

    const makeViz = (idx: number, action: StackVisualization['action']): StackVisualization => ({
      type: 'stack',
      items: [...stack],
      inputChars: chars,
      currentIndex: idx,
      action,
    });

    steps.push({
      line: 1,
      explanation: `Count collisions in "${directions}". Leading L cars and trailing R cars never collide. Trim them first.`,
      variables: { directions },
      visualization: makeViz(-1, 'idle'),
    });

    // Find trim boundaries
    let left = 0;
    while (left < chars.length && chars[left] === 'L') left++;
    let right = chars.length - 1;
    while (right >= 0 && chars[right] === 'R') right--;

    steps.push({
      line: 2,
      explanation: `Leading L cars (indices 0..${left-1}) and trailing R cars (indices ${right+1}..${chars.length-1}) never collide. Focus on indices ${left}..${right}.`,
      variables: { left, right, trimmed: directions.slice(left, right + 1) },
      visualization: makeViz(left, 'idle'),
    });

    let collisions = 0;
    for (let i = left; i <= right; i++) {
      const c = chars[i];
      if (c !== 'S') {
        collisions++;
        stack.push(c);
        steps.push({
          line: 4,
          explanation: `Car at index ${i} is '${c}' (not Stopped). It will be involved in a collision. Count = ${collisions}.`,
          variables: { i, char: c, collisions },
          visualization: makeViz(i, 'match'),
        });
      } else {
        steps.push({
          line: 4,
          explanation: `Car at index ${i} is 'S' (Stopped). Stopped cars do not add to collision count.`,
          variables: { i, char: c, collisions },
          visualization: makeViz(i, 'idle'),
        });
      }
    }

    steps.push({
      line: 5,
      explanation: `Total collisions = ${collisions}. Each non-stopped car in the trimmed range will collide exactly once.`,
      variables: { result: collisions },
      visualization: makeViz(-1, 'match'),
    });

    return steps;
  },
};

export default countCollisionsOnRoad;
