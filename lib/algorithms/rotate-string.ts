import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const rotateString: AlgorithmDefinition = {
  id: 'rotate-string',
  title: 'Rotate String',
  leetcodeNumber: 796,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given two strings s and goal, determine if goal is a rotation of s. A rotation shifts some prefix of s to the end. The key insight is that goal is a rotation of s if and only if goal is a substring of s+s (and they have the same length).',
  tags: ['string', 'string matching'],

  code: {
    pseudocode: `function rotateString(s, goal):
  if len(s) != len(goal):
    return false
  doubled = s + s
  return goal is a substring of doubled`,

    python: `def rotateString(s: str, goal: str) -> bool:
    return len(s) == len(goal) and goal in (s + s)`,

    javascript: `function rotateString(s, goal) {
  return s.length === goal.length && (s + s).includes(goal);
}`,

    java: `public boolean rotateString(String s, String goal) {
    return s.length() == goal.length() && (s + s).contains(goal);
}`,
  },

  defaultInput: {
    s: 'abcde',
    goal: 'cdeab',
  },

  inputFields: [
    {
      name: 's',
      label: 'String S',
      type: 'string',
      defaultValue: 'abcde',
      placeholder: 'abcde',
      helperText: 'Original string',
    },
    {
      name: 'goal',
      label: 'Goal',
      type: 'string',
      defaultValue: 'cdeab',
      placeholder: 'cdeab',
      helperText: 'Target rotation string',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const goal = input.goal as string;
    const steps: AlgorithmStep[] = [];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
      arr: string[]
    ): ArrayVisualization => ({
      type: 'array',
      array: arr as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Check if "${goal}" is a rotation of "${s}". First verify lengths are equal: ${s.length} vs ${goal.length}.`,
      variables: { s, goal, lenS: s.length, lenGoal: goal.length },
      visualization: makeViz({}, {}, s.split('')),
    });

    if (s.length !== goal.length) {
      steps.push({
        line: 2,
        explanation: `Lengths differ (${s.length} != ${goal.length}). Cannot be a rotation. Return false.`,
        variables: { result: false },
        visualization: makeViz({}, {}, s.split('')),
      });
      return steps;
    }

    const doubled = s + s;
    steps.push({
      line: 4,
      explanation: `Create doubled string: s + s = "${doubled}". Any rotation of s will appear as a substring here.`,
      variables: { doubled },
      visualization: makeViz({}, {}, doubled.split('')),
    });

    // Show all rotations as context steps
    for (let rot = 0; rot < s.length; rot++) {
      const rotation = s.slice(rot) + s.slice(0, rot);
      if (rotation === goal) {
        const highlights: Record<number, string> = {};
        for (let k = 0; k < goal.length; k++) {
          highlights[rot + k] = 'found';
        }
        steps.push({
          line: 5,
          explanation: `Rotation by ${rot} positions gives "${rotation}" which matches goal "${goal}". Found at index ${rot} in doubled string.`,
          variables: { rotation, rot, found: true },
          visualization: makeViz(highlights, { [rot]: `rot=${rot}` }, doubled.split('')),
        });
        break;
      } else {
        const highlights: Record<number, string> = {};
        for (let k = 0; k < goal.length; k++) {
          highlights[rot + k] = 'comparing';
        }
        steps.push({
          line: 5,
          explanation: `Rotation by ${rot} positions gives "${rotation}" which does not match goal "${goal}".`,
          variables: { rotation, rot },
          visualization: makeViz(highlights, { [rot]: `rot=${rot}` }, doubled.split('')),
        });
      }
    }

    const result = doubled.includes(goal);
    steps.push({
      line: 5,
      explanation: `Result: goal "${goal}" ${result ? 'is' : 'is not'} a substring of doubled string "${doubled}". Return ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}, doubled.split('')),
    });

    return steps;
  },
};

export default rotateString;
