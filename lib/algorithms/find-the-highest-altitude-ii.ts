import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const findTheHighestAltitudeII: AlgorithmDefinition = {
  id: 'find-the-highest-altitude-ii',
  title: 'Find the Highest Altitude II',
  leetcodeNumber: 1732,
  difficulty: 'Easy',
  category: 'Prefix Sum',
  description:
    'A biker goes on a road trip starting at altitude 0. Given the net gain array, find the highest altitude reached. Build a running altitude prefix sum starting at 0 and track the maximum. O(n) time.',
  tags: ['Prefix Sum', 'Array'],
  code: {
    pseudocode: `function largestAltitude(gain):
  altitude = 0, maxAlt = 0
  for g in gain:
    altitude += g
    maxAlt = max(maxAlt, altitude)
  return maxAlt`,
    python: `def largestAltitude(gain: list[int]) -> int:
    altitude = max_alt = 0
    for g in gain:
        altitude += g
        max_alt = max(max_alt, altitude)
    return max_alt`,
    javascript: `function largestAltitude(gain) {
  let altitude = 0, maxAlt = 0;
  for (const g of gain) {
    altitude += g;
    maxAlt = Math.max(maxAlt, altitude);
  }
  return maxAlt;
}`,
    java: `public int largestAltitude(int[] gain) {
    int altitude = 0, maxAlt = 0;
    for (int g : gain) {
        altitude += g;
        maxAlt = Math.max(maxAlt, altitude);
    }
    return maxAlt;
}`,
  },
  defaultInput: { gain: [-5, 1, 5, 0, -7] },
  inputFields: [
    {
      name: 'gain',
      label: 'Gain Array',
      type: 'array',
      defaultValue: [-5, 1, 5, 0, -7],
      placeholder: '-5,1,5,0,-7',
      helperText: 'Net altitude gains between points',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const gain = input.gain as number[];
    const steps: AlgorithmStep[] = [];
    const n = gain.length;
    let altitude = 0;
    let maxAlt = 0;

    const altitudes: number[] = [0];

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>,
    ): ArrayVisualization => ({
      type: 'array',
      array: [...gain],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Find highest altitude. Start at altitude 0. gain = [${gain.join(', ')}].`,
      variables: { altitude: 0, maxAlt: 0 },
      visualization: makeViz({}, { 0: 'alt=0' }),
    });

    for (let i = 0; i < n; i++) {
      altitude += gain[i];
      altitudes.push(altitude);
      const prevMax = maxAlt;
      if (altitude > maxAlt) maxAlt = altitude;

      steps.push({
        line: 3,
        explanation: `Point ${i + 1}: gain=${gain[i]}, altitude = ${altitude - gain[i]} + ${gain[i]} = ${altitude}. maxAlt = ${maxAlt}${altitude > prevMax ? ' (new max!)' : ''}.`,
        variables: { i, gain: gain[i], altitude, maxAlt },
        visualization: makeViz(
          {
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'visited'])),
            [i]: altitude === maxAlt && altitude > prevMax ? 'found' : 'active',
          },
          { [i]: `alt=${altitude}` },
        ),
      });
    }

    steps.push({
      line: 5,
      explanation: `Highest altitude reached: ${maxAlt}. Altitudes visited: [0, ${altitudes.slice(1).join(', ')}].`,
      variables: { result: maxAlt, altitudes },
      visualization: makeViz(
        Object.fromEntries(gain.map((_, i) => [i, 'found'])),
        { 0: `max=${maxAlt}` },
      ),
    });

    return steps;
  },
};

export default findTheHighestAltitudeII;
