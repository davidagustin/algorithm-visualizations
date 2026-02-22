import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const theJosephusProblem: AlgorithmDefinition = {
  id: 'the-josephus-problem',
  title: 'The Josephus Problem',
  difficulty: 'Medium',
  category: 'Math',
  description:
    'N people stand in a circle. Starting from person 0, every kth person is eliminated until one remains. We simulate the elimination process to find the survivor.',
  tags: ['Math', 'Simulation'],
  code: {
    pseudocode: `function josephus(n, k):
  circle = [0, 1, ..., n-1]
  index = 0
  while circle.size > 1:
    index = (index + k - 1) mod circle.size
    eliminate circle[index]
  return circle[0]`,
    python: `def josephus(n, k):
    circle = list(range(n))
    index = 0
    while len(circle) > 1:
        index = (index + k - 1) % len(circle)
        circle.pop(index)
    return circle[0]`,
    javascript: `function josephus(n, k) {
  const circle = Array.from({length: n}, (_, i) => i);
  let index = 0;
  while (circle.length > 1) {
    index = (index + k - 1) % circle.length;
    circle.splice(index, 1);
  }
  return circle[0];
}`,
    java: `public int josephus(int n, int k) {
    List<Integer> circle = new ArrayList<>();
    for (int i = 0; i < n; i++) circle.add(i);
    int index = 0;
    while (circle.size() > 1) {
        index = (index + k - 1) % circle.size();
        circle.remove(index);
    }
    return circle.get(0);
}`,
  },
  defaultInput: { n: 7, k: 3 },
  inputFields: [
    {
      name: 'n',
      label: 'Number of People (n)',
      type: 'number',
      defaultValue: 7,
      placeholder: 'e.g. 7',
      helperText: 'Number of people in the circle',
    },
    {
      name: 'k',
      label: 'Step Size (k)',
      type: 'number',
      defaultValue: 3,
      placeholder: 'e.g. 3',
      helperText: 'Every kth person is eliminated',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const n = input.n as number;
    const k = input.k as number;
    const steps: AlgorithmStep[] = [];
    const circle = Array.from({ length: n }, (_, i) => i);
    const eliminated: number[] = [];
    let index = 0;

    // For visualization, always show the original n positions.
    // Eliminated positions are marked differently.
    const alive = new Set<number>(circle);

    function makeViz(currentIdx: number | null, elimIdx: number | null): ArrayVisualization {
      const displayArr = Array.from({ length: n }, (_, i) => i);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};

      for (let i = 0; i < n; i++) {
        if (!alive.has(i)) {
          highlights[i] = 'visited';
          labels[i] = 'out';
        } else if (i === elimIdx) {
          highlights[i] = 'mismatch';
          labels[i] = 'eliminate';
        } else if (i === currentIdx) {
          highlights[i] = 'active';
          labels[i] = 'current';
        } else {
          highlights[i] = alive.has(i) ? 'default' : 'visited';
        }
      }

      return {
        type: 'array',
        array: displayArr,
        highlights,
        labels,
        auxData: {
          label: 'Josephus State',
          entries: [
            { key: 'Alive', value: [...alive].sort((a, b) => a - b).join(', ') },
            { key: 'Eliminated order', value: eliminated.length > 0 ? eliminated.join(', ') : 'none' },
            { key: 'Remaining', value: String(alive.size) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `${n} people (0 to ${n - 1}) in a circle. Every ${k}th person is eliminated.`,
      variables: { n, k, circle: [...circle] },
      visualization: makeViz(0, null),
    });

    let round = 1;
    const circleList = [...circle];

    while (circleList.length > 1) {
      index = (index + k - 1) % circleList.length;
      const elimPerson = circleList[index];

      steps.push({
        line: 4,
        explanation: `Round ${round}: Count ${k} from current position. Eliminate person ${elimPerson}.`,
        variables: { round, eliminated: elimPerson, remaining: circleList.length - 1 },
        visualization: makeViz(null, elimPerson),
      });

      eliminated.push(elimPerson);
      alive.delete(elimPerson);
      circleList.splice(index, 1);

      if (index >= circleList.length) {
        index = 0;
      }

      if (circleList.length > 1) {
        steps.push({
          line: 5,
          explanation: `Person ${elimPerson} removed. ${circleList.length} people remain: [${circleList.join(', ')}]. Next counting starts from person ${circleList[index]}.`,
          variables: { remaining: [...circleList], nextStart: circleList[index] },
          visualization: makeViz(circleList[index], null),
        });
      }

      round++;
    }

    const survivor = circleList[0];
    steps.push({
      line: 6,
      explanation: `Only person ${survivor} remains. The survivor is person ${survivor}!`,
      variables: { survivor, eliminationOrder: [...eliminated] },
      visualization: (() => {
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          if (i === survivor) {
            h[i] = 'found';
            l[i] = 'survivor!';
          } else {
            h[i] = 'visited';
            l[i] = 'out';
          }
        }
        return {
          type: 'array' as const,
          array: Array.from({ length: n }, (_, i) => i),
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Survivor', value: `Person ${survivor}` },
              { key: 'Elimination order', value: eliminated.join(' -> ') },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default theJosephusProblem;
