import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const designParkingSystem: AlgorithmDefinition = {
  id: 'design-parking-system',
  title: 'Design Parking System',
  leetcodeNumber: 1603,
  difficulty: 'Easy',
  category: 'Design',
  description:
    'Design a parking system for a parking lot with three sizes of parking spaces: big, medium, and small. Initialize with counts for each size. For each addCar call, check if a space of the given type is available. If yes, decrement the count and return true; otherwise return false.',
  tags: ['design', 'simulation', 'array', 'counting'],

  code: {
    pseudocode: `class ParkingSystem:
  spaces = [big, medium, small]

  addCar(carType):
    // carType: 1=big, 2=medium, 3=small
    if spaces[carType - 1] > 0:
      spaces[carType - 1] -= 1
      return true
    return false`,

    python: `class ParkingSystem:
    def __init__(self, big: int, medium: int, small: int):
        self.spaces = [big, medium, small]

    def addCar(self, carType: int) -> bool:
        if self.spaces[carType - 1] > 0:
            self.spaces[carType - 1] -= 1
            return True
        return False`,

    javascript: `class ParkingSystem {
  constructor(big, medium, small) {
    this.spaces = [big, medium, small];
  }

  addCar(carType) {
    if (this.spaces[carType - 1] > 0) {
      this.spaces[carType - 1]--;
      return true;
    }
    return false;
  }
}`,

    java: `class ParkingSystem {
    int[] spaces;

    public ParkingSystem(int big, int medium, int small) {
        spaces = new int[]{big, medium, small};
    }

    public boolean addCar(int carType) {
        if (spaces[carType - 1] > 0) {
            spaces[carType - 1]--;
            return true;
        }
        return false;
    }
}`,
  },

  defaultInput: {
    nums: [2, 3, 1],
  },

  inputFields: [
    {
      name: 'nums',
      label: 'Capacity [big, medium, small]',
      type: 'array',
      defaultValue: [2, 3, 1],
      placeholder: '2,3,1',
      helperText: 'Initial number of big, medium, and small parking spaces',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const nums = input.nums as number[];
    const steps: AlgorithmStep[] = [];
    const spaces = [nums[0] ?? 2, nums[1] ?? 3, nums[2] ?? 1];
    const labels = ['Big', 'Medium', 'Small'];

    steps.push({
      line: 1,
      explanation: `Initialize ParkingSystem: big=${spaces[0]}, medium=${spaces[1]}, small=${spaces[2]} spaces available.`,
      variables: { big: spaces[0], medium: spaces[1], small: spaces[2] },
      visualization: {
        type: 'array',
        array: [...spaces],
        highlights: { 0: 'active', 1: 'active', 2: 'active' },
        labels: { 0: 'Big', 1: 'Medium', 2: 'Small' },
      },
    });

    // Simulate a series of car arrivals
    const carArrivals = [1, 2, 1, 3, 2, 1, 2];
    for (const carType of carArrivals) {
      const idx = carType - 1;
      const available = spaces[idx] > 0;
      if (available) {
        spaces[idx]--;
      }
      steps.push({
        line: 4,
        explanation: `addCar(carType=${carType}=${labels[idx]}): ${available ? `Space available. Remaining ${labels[idx]} spaces: ${spaces[idx]}. Return true.` : `No ${labels[idx]} spaces left. Return false.`}`,
        variables: { carType: labels[idx], spacesRemaining: spaces[idx], result: available },
        visualization: {
          type: 'array',
          array: [...spaces],
          highlights: { [idx]: available ? 'found' : 'mismatch' },
          labels: { 0: `Big:${spaces[0]}`, 1: `Med:${spaces[1]}`, 2: `Sm:${spaces[2]}`, [idx]: available ? 'parked' : 'FULL' },
        },
      });
    }

    steps.push({
      line: 8,
      explanation: `Parking lot final state: big=${spaces[0]}, medium=${spaces[1]}, small=${spaces[2]} spaces remaining.`,
      variables: { bigRemaining: spaces[0], mediumRemaining: spaces[1], smallRemaining: spaces[2] },
      visualization: {
        type: 'array',
        array: [...spaces],
        highlights: {
          0: spaces[0] === 0 ? 'comparing' : 'found',
          1: spaces[1] === 0 ? 'comparing' : 'found',
          2: spaces[2] === 0 ? 'comparing' : 'found',
        },
        labels: { 0: `Big:${spaces[0]}`, 1: `Med:${spaces[1]}`, 2: `Sm:${spaces[2]}` },
      },
    });

    return steps;
  },
};

export default designParkingSystem;
