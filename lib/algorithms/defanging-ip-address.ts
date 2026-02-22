import type { AlgorithmDefinition, AlgorithmStep } from '../types';

const defangingIpAddress: AlgorithmDefinition = {
  id: 'defanging-ip-address',
  title: 'Defanging an IP Address',
  leetcodeNumber: 1108,
  difficulty: 'Easy',
  category: 'String',
  description:
    'Given a valid IP address, return a defanged version where every dot "." is replaced with "[.]". This is used in security contexts to prevent accidental clicking on potentially malicious links.',
  tags: ['string', 'replace'],

  code: {
    pseudocode: `function defangIPaddr(address):
  result = ""
  for char in address:
    if char == '.':
      result += "[.]"
    else:
      result += char
  return result`,

    python: `def defangIPaddr(address: str) -> str:
    return address.replace('.', '[.]')`,

    javascript: `function defangIPaddr(address) {
  return address.replace(/\\./g, '[.]');
}`,

    java: `public String defangIPaddr(String address) {
    return address.replace(".", "[.]");
}`,
  },

  defaultInput: {
    address: '1.1.1.1',
  },

  inputFields: [
    {
      name: 'address',
      label: 'IP Address',
      type: 'string',
      defaultValue: '1.1.1.1',
      placeholder: '1.1.1.1',
      helperText: 'Valid IPv4 address to defang',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const address = input.address as string;
    const chars = address.split('');
    const steps: AlgorithmStep[] = [];
    let result = '';

    steps.push({
      line: 1,
      explanation: `Input: "${address}". Replace each "." with "[.]" to defang the IP address.`,
      variables: { address },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: {},
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const isDot = c === '.';

      steps.push({
        line: 3,
        explanation: `Character[${i}]="${c}": ${isDot ? 'It is a dot! Append "[.]" to result.' : `Not a dot. Append "${c}" to result.`}`,
        variables: { index: i, char: c, isDot, resultSoFar: result + (isDot ? '[.]' : c) },
        visualization: {
          type: 'array',
          array: chars as unknown as number[],
          highlights: {
            [i]: isDot ? 'active' : 'sorted',
            ...Object.fromEntries(Array.from({ length: i }, (_, k) => [k, 'sorted'])),
          },
          labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
        },
      });

      result += isDot ? '[.]' : c;
    }

    steps.push({
      line: 7,
      explanation: `All characters processed. Defanged IP: "${result}"`,
      variables: { result },
      visualization: {
        type: 'array',
        array: chars as unknown as number[],
        highlights: Object.fromEntries(chars.map((_, i) => [i, 'found'])),
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      },
    });

    return steps;
  },
};

export default defangingIpAddress;
