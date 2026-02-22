import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const binaryWatch: AlgorithmDefinition = {
  id: 'binary-watch',
  title: 'Binary Watch',
  leetcodeNumber: 401,
  difficulty: 'Easy',
  category: 'Bit Manipulation',
  description:
    'A binary watch has 4 LEDs for hours (0-11) and 6 LEDs for minutes (0-59). Given the number of LEDs that are currently on, return all possible times. Iterate over all hour and minute combinations, counting set bits with popcount, and collect matches.',
  tags: ['bit manipulation', 'backtracking', 'enumeration'],

  code: {
    pseudocode: `function readBinaryWatch(turnedOn):
  result = []
  for h from 0 to 11:
    for m from 0 to 59:
      bits = popcount(h) + popcount(m)
      if bits == turnedOn:
        result.append(format(h, m))
  return result`,

    python: `def readBinaryWatch(turnedOn):
    result = []
    for h in range(12):
        for m in range(60):
            if bin(h).count('1') + bin(m).count('1') == turnedOn:
                result.append(f"{h}:{m:02d}")
    return result`,

    javascript: `function readBinaryWatch(turnedOn) {
  const result = [];
  for (let h = 0; h < 12; h++) {
    for (let m = 0; m < 60; m++) {
      const bits = (h).toString(2).split('').filter(c => c==='1').length
                 + (m).toString(2).split('').filter(c => c==='1').length;
      if (bits === turnedOn) result.push(h + ':' + (m < 10 ? '0' + m : m));
    }
  }
  return result;
}`,

    java: `public List<String> readBinaryWatch(int turnedOn) {
    List<String> result = new ArrayList<>();
    for (int h = 0; h < 12; h++) {
        for (int m = 0; m < 60; m++) {
            if (Integer.bitCount(h) + Integer.bitCount(m) == turnedOn)
                result.add(h + ":" + String.format("%02d", m));
        }
    }
    return result;
}`,
  },

  defaultInput: {
    turnedOn: 1,
  },

  inputFields: [
    {
      name: 'turnedOn',
      label: 'LEDs Turned On',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Number of LEDs that are on (0-9)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const turnedOn = input.turnedOn as number;
    const steps: AlgorithmStep[] = [];
    const result: string[] = [];

    const popcount = (x: number) => x.toString(2).split('').filter(c => c === '1').length;

    steps.push({
      line: 1,
      explanation: `Find all times where the total number of lit LEDs equals ${turnedOn}. Hours use 4 bits (0-11), minutes use 6 bits (0-59).`,
      variables: { turnedOn, result: [] },
      visualization: {
        type: 'array',
        array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
        highlights: {},
        labels: {},
      } as ArrayVisualization,
    });

    let checked = 0;
    for (let h = 0; h < 12; h++) {
      for (let m = 0; m < 60; m++) {
        const bits = popcount(h) + popcount(m);
        checked++;
        if (bits === turnedOn) {
          const time = `${h}:${m < 10 ? '0' + m : m}`;
          result.push(time);
          steps.push({
            line: 4,
            explanation: `h=${h} (${h.toString(2).padStart(4,'0')}), m=${m} (${m.toString(2).padStart(6,'0')}). Bits: ${popcount(h)}+${popcount(m)}=${bits} = ${turnedOn}. Match! Time = ${time}.`,
            variables: { h, m, hBits: popcount(h), mBits: popcount(m), totalBits: bits, time },
            visualization: {
              type: 'array',
              array: result.map((_, i) => i),
              highlights: { [result.length - 1]: 'found' },
              labels: Object.fromEntries(result.map((t, i) => [i, t])),
            } as ArrayVisualization,
          });
        }
      }
    }

    steps.push({
      line: 6,
      explanation: `Checked all ${checked} combinations. Found ${result.length} valid time(s): [${result.join(', ')}].`,
      variables: { totalChecked: checked, resultCount: result.length, result },
      visualization: {
        type: 'array',
        array: result.map((_, i) => i),
        highlights: Object.fromEntries(result.map((_, i) => [i, 'sorted'])),
        labels: Object.fromEntries(result.map((t, i) => [i, t])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default binaryWatch;
