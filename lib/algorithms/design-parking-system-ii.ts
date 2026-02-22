import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const designParkingSystemIi: AlgorithmDefinition = {
  id: 'design-parking-system-ii',
  title: 'Design Parking System',
  leetcodeNumber: 1603,
  difficulty: 'Easy',
  category: 'Hash Map',
  description:
    'Design a parking system for a parking lot with three kinds of parking spaces: big, medium, and small. Each has a fixed number of slots. Implement addCar(carType) which returns true if there is a space and false otherwise.',
  tags: ['Hash Map', 'Design', 'Simulation'],
  code: {
    pseudocode: `class ParkingSystem:
  function init(big, medium, small):
    this.spaces = {1: big, 2: medium, 3: small}
  function addCar(carType):
    if spaces[carType] > 0:
      spaces[carType] -= 1
      return true
    return false`,
    python: `class ParkingSystem:
    def __init__(self, big: int, medium: int, small: int):
        self.spaces = {1: big, 2: medium, 3: small}

    def addCar(self, carType: int) -> bool:
        if self.spaces[carType] > 0:
            self.spaces[carType] -= 1
            return True
        return False`,
    javascript: `class ParkingSystem {
  constructor(big, medium, small) {
    this.spaces = {1: big, 2: medium, 3: small};
  }
  addCar(carType) {
    if (this.spaces[carType] > 0) {
      this.spaces[carType]--;
      return true;
    }
    return false;
  }
}`,
    java: `class ParkingSystem {
    private int[] spaces;
    public ParkingSystem(int big, int medium, int small) {
        spaces = new int[]{0, big, medium, small};
    }
    public boolean addCar(int carType) {
        if (spaces[carType] > 0) { spaces[carType]--; return true; }
        return false;
    }
}`,
  },
  defaultInput: {
    big: 1,
    medium: 1,
    small: 0,
    operations: [['addCar', 1], ['addCar', 2], ['addCar', 3], ['addCar', 1]],
  },
  inputFields: [
    { name: 'big', label: 'Big Spaces', type: 'number', defaultValue: 1 },
    { name: 'medium', label: 'Medium Spaces', type: 'number', defaultValue: 1 },
    { name: 'small', label: 'Small Spaces', type: 'number', defaultValue: 0 },
    {
      name: 'operations',
      label: 'Operations',
      type: 'string',
      defaultValue: 'addCar 1, addCar 2, addCar 3, addCar 1',
      placeholder: 'addCar 1, addCar 2, addCar 3',
      helperText: 'Comma-separated: "addCar carType" (1=big, 2=medium, 3=small)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bigInit = (input.big as number) ?? 1;
    const mediumInit = (input.medium as number) ?? 1;
    const smallInit = (input.small as number) ?? 0;
    let operations: (string | number)[][];

    if (Array.isArray(input.operations) && Array.isArray(input.operations[0])) {
      operations = input.operations as (string | number)[][];
    } else {
      const opsStr = input.operations as string;
      operations = opsStr.split(',').map(op => {
        const parts = op.trim().split(/\s+/);
        return [parts[0], Number(parts[1])];
      });
    }

    const steps: AlgorithmStep[] = [];
    const spaces: Record<number, number> = { 1: bigInit, 2: mediumInit, 3: smallInit };
    const typeNames: Record<number, string> = { 1: 'Big', 2: 'Medium', 3: 'Small' };

    function makeViz(activeType: number, color: string, label: string): ArrayVisualization {
      const arr = [spaces[1], spaces[2], spaces[3]];
      const highlights: Record<number, string> = { 0: activeType === 1 ? color : 'default', 1: activeType === 2 ? color : 'default', 2: activeType === 3 ? color : 'default' };
      const lbls: Record<number, string> = { 0: 'Big', 1: 'Medium', 2: 'Small' };
      return {
        type: 'array',
        array: arr,
        highlights,
        labels: lbls,
        auxData: {
          label: 'Parking System',
          entries: [
            { key: 'Action', value: label },
            { key: 'Big slots', value: `${spaces[1]}` },
            { key: 'Medium slots', value: `${spaces[2]}` },
            { key: 'Small slots', value: `${spaces[3]}` },
          ],
        },
      };
    }

    steps.push({ line: 1, explanation: `Initialize Parking System: big=${bigInit}, medium=${mediumInit}, small=${smallInit}.`, variables: { big: bigInit, medium: mediumInit, small: smallInit }, visualization: makeViz(0, 'default', 'Init') });

    for (const op of operations) {
      const carType = Number(op[1]);
      const typeName = typeNames[carType] || `Type${carType}`;

      if (spaces[carType] > 0) {
        spaces[carType]--;
        steps.push({ line: 4, explanation: `addCar(${carType}): ${typeName} car parked. Remaining ${typeName} slots: ${spaces[carType]}. Return true.`, variables: { carType, remaining: spaces[carType] }, visualization: makeViz(carType, 'active', `addCar(${carType}) -> true`) });
      } else {
        steps.push({ line: 6, explanation: `addCar(${carType}): No ${typeName} slots available. Return false.`, variables: { carType, available: 0 }, visualization: makeViz(carType, 'mismatch', `addCar(${carType}) -> false`) });
      }
    }

    steps.push({ line: 7, explanation: 'All operations complete.', variables: { big: spaces[1], medium: spaces[2], small: spaces[3] }, visualization: makeViz(0, 'default', 'Complete') });

    return steps;
  },
};

export default designParkingSystemIi;
