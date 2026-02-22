import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const maximumUnitsOnTruck: AlgorithmDefinition = {
  id: 'maximum-units-on-truck',
  title: 'Maximum Units on a Truck',
  leetcodeNumber: 1710,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'Given box types where each has a quantity and units-per-box, and a truck with a capacity (max number of boxes), maximize total units loaded. Greedy: sort box types by units-per-box descending. Load as many boxes of the highest-unit type as possible before moving to the next type.',
  tags: ['Greedy', 'Sorting', 'Array'],
  code: {
    pseudocode: `function maximumUnits(boxTypes, truckSize):
  sort boxTypes by unitsPerBox descending
  totalUnits = 0, remaining = truckSize
  for (numberOfBoxes, unitsPerBox) in boxTypes:
    take = min(numberOfBoxes, remaining)
    totalUnits += take * unitsPerBox
    remaining -= take
    if remaining == 0: break
  return totalUnits`,
    python: `def maximumUnits(boxTypes, truckSize):
    boxTypes.sort(key=lambda x: -x[1])
    total = remaining = truckSize
    result = 0
    for count, units in boxTypes:
        take = min(count, remaining)
        result += take * units
        remaining -= take
        if remaining == 0:
            break
    return result`,
    javascript: `function maximumUnits(boxTypes, truckSize) {
  boxTypes.sort((a, b) => b[1] - a[1]);
  let totalUnits = 0, remaining = truckSize;
  for (const [count, units] of boxTypes) {
    const take = Math.min(count, remaining);
    totalUnits += take * units;
    remaining -= take;
    if (remaining === 0) break;
  }
  return totalUnits;
}`,
    java: `public int maximumUnits(int[][] boxTypes, int truckSize) {
    Arrays.sort(boxTypes, (a, b) -> b[1] - a[1]);
    int total = 0, remaining = truckSize;
    for (int[] box : boxTypes) {
        int take = Math.min(box[0], remaining);
        total += take * box[1];
        remaining -= take;
        if (remaining == 0) break;
    }
    return total;
}`,
  },
  defaultInput: { boxTypes: [[1, 3], [2, 2], [3, 1]], truckSize: 4 },
  inputFields: [
    {
      name: 'boxTypes',
      label: 'Box Types [count, units]',
      type: 'array',
      defaultValue: [[1, 3], [2, 2], [3, 1]],
      placeholder: 'e.g. [[1,3],[2,2],[3,1]]',
      helperText: 'Each entry: [numberOfBoxes, unitsPerBox]',
    },
    {
      name: 'truckSize',
      label: 'Truck Size (max boxes)',
      type: 'number',
      defaultValue: 4,
      placeholder: 'e.g. 4',
      helperText: 'Maximum number of boxes the truck can hold',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const rawBoxTypes = input.boxTypes as number[][];
    const truckSize = input.truckSize as number;
    const steps: AlgorithmStep[] = [];

    const boxTypes = rawBoxTypes.slice().sort((a, b) => b[1] - a[1]);
    const n = boxTypes.length;
    let totalUnits = 0, remaining = truckSize;
    const taken: number[] = new Array(n).fill(0);

    function makeViz(activeIdx: number | null): ArrayVisualization {
      const unitsPerBox = boxTypes.map(b => b[1]);
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `cnt=${boxTypes[i][0]},u=${boxTypes[i][1]}`;
        if (taken[i] > 0) highlights[i] = 'found';
        else if (i === activeIdx) highlights[i] = 'active';
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: unitsPerBox,
        highlights,
        labels,
        auxData: {
          label: 'Truck Loading',
          entries: [
            { key: 'Box types (sorted by units/box)', value: boxTypes.map(b => `[${b[0]}×${b[1]}u]`).join(', ') },
            { key: 'Remaining capacity', value: String(remaining) },
            { key: 'Total units loaded', value: String(totalUnits) },
            ...boxTypes.map((b, i) => ({ key: `  Type ${i + 1} (${b[1]}u/box)`, value: taken[i] > 0 ? `${taken[i]} boxes loaded` : 'none' })),
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Sort box types by units/box descending: ${boxTypes.map(b => `[${b[0]} boxes, ${b[1]} units/box]`).join(', ')}. Truck capacity: ${truckSize} boxes.`,
      variables: { boxTypes, truckSize },
      visualization: makeViz(null),
    });

    for (let i = 0; i < n && remaining > 0; i++) {
      const [count, units] = boxTypes[i];
      const take = Math.min(count, remaining);

      steps.push({
        line: 4,
        explanation: `Box type ${i + 1}: ${count} boxes, ${units} units/box. Can take min(${count}, ${remaining})=${take} boxes. Add ${take * units} units.`,
        variables: { count, units, take, addedUnits: take * units, remaining, totalUnits: totalUnits + take * units },
        visualization: makeViz(i),
      });

      taken[i] = take;
      totalUnits += take * units;
      remaining -= take;

      steps.push({
        line: 6,
        explanation: `Loaded ${take} boxes of type ${i + 1}. Total units: ${totalUnits}. Remaining capacity: ${remaining}.`,
        variables: { totalUnits, remaining },
        visualization: makeViz(i),
      });
    }

    steps.push({
      line: 8,
      explanation: `Truck fully loaded. Maximum units: ${totalUnits}.`,
      variables: { totalUnits },
      visualization: (() => {
        const unitsPerBox = boxTypes.map(b => b[1]);
        const h: Record<number, string> = {};
        const l: Record<number, string> = {};
        for (let i = 0; i < n; i++) {
          l[i] = `${boxTypes[i][1]}u`;
          h[i] = taken[i] > 0 ? 'found' : 'visited';
        }
        return {
          type: 'array' as const,
          array: unitsPerBox,
          highlights: h,
          labels: l,
          auxData: {
            label: 'Result',
            entries: [
              { key: 'Max units', value: String(totalUnits) },
              { key: 'Boxes used', value: String(truckSize - remaining) },
            ],
          },
        };
      })(),
    });

    return steps;
  },
};

export default maximumUnitsOnTruck;
