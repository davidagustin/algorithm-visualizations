import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const pushDominoes: AlgorithmDefinition = {
  id: 'push-dominoes',
  title: 'Push Dominoes',
  leetcodeNumber: 838,
  difficulty: 'Medium',
  category: 'String',
  description:
    'Given a string of dominoes where R means pushed right, L means pushed left, and . means standing upright, simulate the final state after all dominoes have fallen. Use two-pointer or force-based approach to determine each domino outcome.',
  tags: ['string', 'two pointers', 'simulation'],

  code: {
    pseudocode: `function pushDominoes(dominoes):
  n = len(dominoes)
  forces = array of 0s, size n
  // Right force pass
  force = 0
  for i from 0 to n-1:
    if dominoes[i] == 'R': force = n
    elif dominoes[i] == 'L': force = 0
    else: force = max(0, force - 1)
    forces[i] += force
  // Left force pass
  force = 0
  for i from n-1 to 0:
    if dominoes[i] == 'L': force = n
    elif dominoes[i] == 'R': force = 0
    else: force = max(0, force - 1)
    forces[i] -= force
  // Build result
  return string where forces[i]>0 => 'R', <0 => 'L', ==0 => '.'`,

    python: `def pushDominoes(dominoes: str) -> str:
    n = len(dominoes)
    forces = [0] * n
    force = 0
    for i in range(n):
        if dominoes[i] == 'R': force = n
        elif dominoes[i] == 'L': force = 0
        else: force = max(0, force - 1)
        forces[i] += force
    force = 0
    for i in range(n - 1, -1, -1):
        if dominoes[i] == 'L': force = n
        elif dominoes[i] == 'R': force = 0
        else: force = max(0, force - 1)
        forces[i] -= force
    return ''.join('R' if f > 0 else 'L' if f < 0 else '.' for f in forces)`,

    javascript: `function pushDominoes(dominoes) {
  const n = dominoes.length;
  const forces = new Array(n).fill(0);
  let force = 0;
  for (let i = 0; i < n; i++) {
    if (dominoes[i] === 'R') force = n;
    else if (dominoes[i] === 'L') force = 0;
    else force = Math.max(0, force - 1);
    forces[i] += force;
  }
  force = 0;
  for (let i = n - 1; i >= 0; i--) {
    if (dominoes[i] === 'L') force = n;
    else if (dominoes[i] === 'R') force = 0;
    else force = Math.max(0, force - 1);
    forces[i] -= force;
  }
  return forces.map(f => f > 0 ? 'R' : f < 0 ? 'L' : '.').join('');
}`,

    java: `public String pushDominoes(String dominoes) {
    int n = dominoes.length();
    int[] forces = new int[n];
    int force = 0;
    for (int i = 0; i < n; i++) {
        if (dominoes.charAt(i) == 'R') force = n;
        else if (dominoes.charAt(i) == 'L') force = 0;
        else force = Math.max(0, force - 1);
        forces[i] += force;
    }
    force = 0;
    for (int i = n - 1; i >= 0; i--) {
        if (dominoes.charAt(i) == 'L') force = n;
        else if (dominoes.charAt(i) == 'R') force = 0;
        else force = Math.max(0, force - 1);
        forces[i] -= force;
    }
    StringBuilder sb = new StringBuilder();
    for (int f : forces) sb.append(f > 0 ? 'R' : f < 0 ? 'L' : '.');
    return sb.toString();
}`,
  },

  defaultInput: {
    dominoes: 'RR.L',
  },

  inputFields: [
    {
      name: 'dominoes',
      label: 'Dominoes',
      type: 'string',
      defaultValue: 'RR.L',
      placeholder: 'RR.L',
      helperText: 'String of R, L, and . characters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const dominoes = input.dominoes as string;
    const steps: AlgorithmStep[] = [];
    const n = dominoes.length;
    const forces = new Array(n).fill(0);

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: dominoes.split('') as unknown as number[],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Start with dominoes="${dominoes}". We use a force array to track net force at each position.`,
      variables: { dominoes, n },
      visualization: makeViz({}, {}),
    });

    // Right force pass
    let force = 0;
    for (let i = 0; i < n; i++) {
      if (dominoes[i] === 'R') {
        force = n;
      } else if (dominoes[i] === 'L') {
        force = 0;
      } else {
        force = Math.max(0, force - 1);
      }
      forces[i] += force;

      steps.push({
        line: 6,
        explanation: `Right pass at index ${i}: domino="${dominoes[i]}", rightForce=${force}, forces[${i}]=${forces[i]}.`,
        variables: { i, domino: dominoes[i], rightForce: force, 'forces[i]': forces[i] },
        visualization: makeViz({ [i]: force > 0 ? 'active' : 'default' }, { [i]: `+${force}` }),
      });
    }

    // Left force pass
    force = 0;
    for (let i = n - 1; i >= 0; i--) {
      if (dominoes[i] === 'L') {
        force = n;
      } else if (dominoes[i] === 'R') {
        force = 0;
      } else {
        force = Math.max(0, force - 1);
      }
      forces[i] -= force;

      steps.push({
        line: 12,
        explanation: `Left pass at index ${i}: domino="${dominoes[i]}", leftForce=${force}, net forces[${i}]=${forces[i]}.`,
        variables: { i, domino: dominoes[i], leftForce: force, 'forces[i]': forces[i] },
        visualization: makeViz(
          { [i]: force > 0 ? 'comparing' : 'default' },
          { [i]: String(forces[i]) }
        ),
      });
    }

    // Build result
    const result = forces.map(f => (f > 0 ? 'R' : f < 0 ? 'L' : '.')).join('');
    const highlights: Record<number, string> = {};
    for (let i = 0; i < n; i++) {
      highlights[i] = forces[i] > 0 ? 'found' : forces[i] < 0 ? 'mismatch' : 'default';
    }

    steps.push({
      line: 17,
      explanation: `Final result: "${result}". Positive force => R, negative => L, zero => .`,
      variables: { result, forces: forces.join(',') },
      visualization: {
        type: 'array',
        array: result.split('') as unknown as number[],
        highlights,
        labels: {},
      },
    });

    return steps;
  },
};

export default pushDominoes;
