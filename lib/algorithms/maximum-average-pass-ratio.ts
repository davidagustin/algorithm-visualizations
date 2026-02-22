import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumAveragePassRatio: AlgorithmDefinition = {
  id: 'maximum-average-pass-ratio',
  title: 'Maximum Average Pass Ratio',
  leetcodeNumber: 1792,
  difficulty: 'Medium',
  category: 'Heap',
  description:
    'Given classes where each class has a pass count and total count, and extra students who always pass, assign each extra student to the class that gains the maximum marginal increase in pass ratio. Use a max heap ordered by the gain of adding one student.',
  tags: ['heap', 'greedy', 'math'],

  code: {
    pseudocode: `function maxAverageRatio(classes, extraStudents):
  gain(p, t) = (p+1)/(t+1) - p/t
  maxHeap = max heap of (gain(p,t), p, t) for each class
  for _ in extraStudents:
    g, p, t = pop max heap
    p = p + 1, t = t + 1
    push (gain(p,t), p, t)
  return average of p/t for all classes`,

    python: `import heapq

def maxAverageRatio(classes: list[list[int]], extraStudents: int) -> float:
    def gain(p, t):
        return (p + 1) / (t + 1) - p / t
    heap = [(-gain(p, t), p, t) for p, t in classes]
    heapq.heapify(heap)
    for _ in range(extraStudents):
        g, p, t = heapq.heappop(heap)
        p += 1; t += 1
        heapq.heappush(heap, (-gain(p, t), p, t))
    return sum(p / t for _, p, t in heap) / len(heap)`,

    javascript: `function maxAverageRatio(classes, extraStudents) {
  const gain = (p, t) => (p+1)/(t+1) - p/t;
  let heap = classes.map(([p,t]) => [gain(p,t), p, t]);
  for (let i = 0; i < extraStudents; i++) {
    heap.sort((a,b) => b[0]-a[0]);
    const [, p, t] = heap.shift();
    const np = p+1, nt = t+1;
    heap.push([gain(np, nt), np, nt]);
  }
  return heap.reduce((s,[,p,t]) => s + p/t, 0) / heap.length;
}`,

    java: `public double maxAverageRatio(int[][] classes, int extraStudents) {
    PriorityQueue<double[]> heap = new PriorityQueue<>((a,b) -> Double.compare(b[0],a[0]));
    for (int[] c : classes) {
        double g = (c[0]+1.0)/(c[1]+1) - (double)c[0]/c[1];
        heap.offer(new double[]{g, c[0], c[1]});
    }
    for (int i = 0; i < extraStudents; i++) {
        double[] top = heap.poll();
        double p = top[1]+1, t = top[2]+1;
        heap.offer(new double[]{(p+1)/(t+1)-p/t, p, t});
    }
    double sum = 0;
    for (double[] d : heap) sum += d[1]/d[2];
    return sum / classes.length;
}`,
  },

  defaultInput: {
    classes: [1, 2, 3, 5, 2, 2],
    extraStudents: 2,
  },

  inputFields: [
    {
      name: 'classes',
      label: 'Classes (pass,total pairs)',
      type: 'array',
      defaultValue: [1, 2, 3, 5, 2, 2],
      placeholder: '1,2,3,5,2,2',
      helperText: 'Pairs of pass,total for each class',
    },
    {
      name: 'extraStudents',
      label: 'Extra Students',
      type: 'number',
      defaultValue: 2,
      placeholder: '2',
      helperText: 'Number of extra students to assign',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const flat = input.classes as number[];
    const extraStudents = input.extraStudents as number;
    const steps: AlgorithmStep[] = [];

    const classes: [number, number][] = [];
    for (let i = 0; i + 1 < flat.length; i += 2) {
      classes.push([flat[i], flat[i + 1]]);
    }

    const gain = (p: number, t: number) => (p + 1) / (t + 1) - p / t;

    let heap: [number, number, number][] = classes.map(([p, t]) => [gain(p, t), p, t]);
    heap.sort((a, b) => b[0] - a[0]);

    steps.push({
      line: 1,
      explanation: `Initialize max heap. ${classes.length} classes. Gain = (p+1)/(t+1) - p/t per class.`,
      variables: { classes: classes.map(([p, t]) => `${p}/${t}`).join(', '), extraStudents },
      visualization: {
        type: 'array',
        array: heap.map(([g]) => Math.round(g * 1000) / 1000),
        highlights: { 0: 'active' },
        labels: Object.fromEntries(heap.map(([g, p, t], i) => [i, `${p}/${t}`])),
      } as ArrayVisualization,
    });

    for (let s = 0; s < extraStudents; s++) {
      heap.sort((a, b) => b[0] - a[0]);
      const [g, p, t] = heap.shift()!;
      const np = p + 1;
      const nt = t + 1;
      const newGain = gain(np, nt);
      heap.push([newGain, np, nt]);
      heap.sort((a, b) => b[0] - a[0]);

      steps.push({
        line: 5,
        explanation: `Extra student ${s + 1}: Added to class ${p}/${t} (gain ${g.toFixed(4)}). Now ${np}/${nt}. New gain: ${newGain.toFixed(4)}.`,
        variables: { student: s + 1, oldClass: `${p}/${t}`, newClass: `${np}/${nt}`, gain: g.toFixed(4) },
        visualization: {
          type: 'array',
          array: heap.map(([g]) => Math.round(g * 1000) / 1000),
          highlights: { 0: 'active' },
          labels: Object.fromEntries(heap.map(([g, p, t], i) => [i, `${p}/${t}`])),
        } as ArrayVisualization,
      });
    }

    const avg = heap.reduce((s, [, p, t]) => s + p / t, 0) / heap.length;

    steps.push({
      line: 6,
      explanation: `All extra students assigned. Average pass ratio: ${avg.toFixed(5)}. Classes: ${heap.map(([, p, t]) => `${p}/${t}`).join(', ')}`,
      variables: { result: avg.toFixed(5), classes: heap.map(([, p, t]) => `${p}/${t}`).join(',') },
      visualization: {
        type: 'array',
        array: heap.map(([, p, t]) => Math.round((p / t) * 1000) / 1000),
        highlights: Object.fromEntries(heap.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(heap.map(([, p, t], i) => [i, `${p}/${t}`])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default maximumAveragePassRatio;
