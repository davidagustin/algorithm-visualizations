import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const movePiecesToObtainAString: AlgorithmDefinition = {
  id: 'move-pieces-to-obtain-a-string',
  title: 'Move Pieces to Obtain a String',
  leetcodeNumber: 2337,
  difficulty: 'Medium',
  category: 'Two Pointers',
  description:
    'Given strings start and target with L, R, and underscore characters, check if start can be transformed into target by moving L leftward (only over underscores) and R rightward (only over underscores). Use two pointers skipping underscores and verifying relative order and positions.',
  tags: ['two pointers', 'string'],

  code: {
    pseudocode: `function canChange(start, target):
  i = 0, j = 0, n = length(start)
  while i < n or j < n:
    while i < n and start[i] == '_': i++
    while j < n and target[j] == '_': j++
    if i == n and j == n: return true
    if i == n or j == n: return false
    if start[i] != target[j]: return false
    if start[i] == 'L' and i < j: return false
    if start[i] == 'R' and i > j: return false
    i++, j++
  return true`,

    python: `def canChange(start: str, target: str) -> bool:
    i = j = 0
    n = len(start)
    while i < n or j < n:
        while i < n and start[i] == '_': i += 1
        while j < n and target[j] == '_': j += 1
        if i == n and j == n: return True
        if i == n or j == n: return False
        if start[i] != target[j]: return False
        if start[i] == 'L' and i < j: return False
        if start[i] == 'R' and i > j: return False
        i += 1; j += 1
    return True`,

    javascript: `function canChange(start, target) {
  let i = 0, j = 0;
  const n = start.length;
  while (i < n || j < n) {
    while (i < n && start[i] === '_') i++;
    while (j < n && target[j] === '_') j++;
    if (i === n && j === n) return true;
    if (i === n || j === n) return false;
    if (start[i] !== target[j]) return false;
    if (start[i] === 'L' && i < j) return false;
    if (start[i] === 'R' && i > j) return false;
    i++; j++;
  }
  return true;
}`,

    java: `public boolean canChange(String start, String target) {
    int i = 0, j = 0, n = start.length();
    while (i < n || j < n) {
        while (i < n && start.charAt(i) == '_') i++;
        while (j < n && target.charAt(j) == '_') j++;
        if (i == n && j == n) return true;
        if (i == n || j == n) return false;
        if (start.charAt(i) != target.charAt(j)) return false;
        if (start.charAt(i) == 'L' && i < j) return false;
        if (start.charAt(i) == 'R' && i > j) return false;
        i++; j++;
    }
    return true;
}`,
  },

  defaultInput: {
    start: '_L__R__R_',
    target: 'L______RR',
  },

  inputFields: [
    {
      name: 'start',
      label: 'Start String',
      type: 'string',
      defaultValue: '_L__R__R_',
      placeholder: '_L__R__R_',
      helperText: 'Starting configuration with L, R, and underscores',
    },
    {
      name: 'target',
      label: 'Target String',
      type: 'string',
      defaultValue: 'L______RR',
      placeholder: 'L______RR',
      helperText: 'Target configuration',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const start = input.start as string;
    const target = input.target as string;
    const n = start.length;
    const steps: AlgorithmStep[] = [];

    const toArr = (s: string) => s.split('').map((_, i) => i);

    const makeViz = (
      src: string,
      iIdx: number,
      jIdx: number,
      iHighlight: string,
      jHighlight: string
    ): ArrayVisualization => ({
      type: 'array',
      array: toArr(src),
      highlights: {
        ...(iIdx >= 0 && iIdx < n ? { [iIdx]: iHighlight } : {}),
        ...(jIdx >= 0 && jIdx < n ? { [jIdx]: jHighlight } : {}),
      },
      labels: Object.fromEntries(src.split('').map((c, idx) => [idx, c])),
    });

    let i = 0;
    let j = 0;

    steps.push({
      line: 1,
      explanation: `Compare start="${start}" and target="${target}" using two pointers. Skip underscores, verify L can only move left and R can only move right.`,
      variables: { i, j },
      visualization: makeViz(start, i, j, 'active', 'comparing'),
    });

    while (i < n || j < n) {
      const prevI = i;
      while (i < n && start[i] === '_') i++;
      if (i !== prevI) {
        steps.push({
          line: 3,
          explanation: `Skipped underscores in start. i moved from ${prevI} to ${i}.`,
          variables: { i, j },
          visualization: makeViz(start, i, j, 'pointer', 'pointer'),
        });
      }

      const prevJ = j;
      while (j < n && target[j] === '_') j++;
      if (j !== prevJ) {
        steps.push({
          line: 4,
          explanation: `Skipped underscores in target. j moved from ${prevJ} to ${j}.`,
          variables: { i, j },
          visualization: makeViz(target, i, j, 'pointer', 'pointer'),
        });
      }

      if (i === n && j === n) {
        steps.push({
          line: 5,
          explanation: `Both pointers exhausted. All pieces matched. Return true.`,
          variables: { i, j, result: true },
          visualization: makeViz(start, -1, -1, 'found', 'found'),
        });
        return steps;
      }

      if (i === n || j === n) {
        steps.push({
          line: 6,
          explanation: `One pointer exhausted but not the other. Mismatch. Return false.`,
          variables: { i, j, result: false },
          visualization: makeViz(start, i < n ? i : 0, j < n ? j : 0, 'mismatch', 'mismatch'),
        });
        return steps;
      }

      const sc = start[i];
      const tc = target[j];

      if (sc !== tc) {
        steps.push({
          line: 7,
          explanation: `start[${i}]="${sc}" != target[${j}]="${tc}". Different pieces. Return false.`,
          variables: { i, j, startChar: sc, targetChar: tc, result: false },
          visualization: makeViz(start, i, j, 'mismatch', 'mismatch'),
        });
        return steps;
      }

      if (sc === 'L' && i < j) {
        steps.push({
          line: 8,
          explanation: `L at start[${i}] but needs to go to target[${j}] (i < j). L can only move left. Return false.`,
          variables: { i, j, result: false },
          visualization: makeViz(start, i, j, 'mismatch', 'mismatch'),
        });
        return steps;
      }

      if (sc === 'R' && i > j) {
        steps.push({
          line: 9,
          explanation: `R at start[${i}] but needs to go to target[${j}] (i > j). R can only move right. Return false.`,
          variables: { i, j, result: false },
          visualization: makeViz(start, i, j, 'mismatch', 'mismatch'),
        });
        return steps;
      }

      steps.push({
        line: 10,
        explanation: `start[${i}]="${sc}" matches target[${j}]="${tc}" and position valid. Move both pointers.`,
        variables: { i, j, char: sc },
        visualization: makeViz(start, i, j, 'found', 'found'),
      });

      i++;
      j++;
    }

    steps.push({
      line: 10,
      explanation: `All pieces successfully matched. Return true.`,
      variables: { result: true },
      visualization: makeViz(start, -1, -1, 'found', 'found'),
    });

    return steps;
  },
};

export default movePiecesToObtainAString;
