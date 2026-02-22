import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const getEqualSubstringsWithinBudget: AlgorithmDefinition = {
  id: 'get-equal-substrings-within-budget',
  title: 'Get Equal Substrings Within Budget',
  leetcodeNumber: 1208,
  difficulty: 'Medium',
  category: 'Sliding Window',
  description:
    'You are given two strings s and t of the same length and an integer maxCost. You want to change s to t. Changing the i-th character of s to i-th character of t costs |s[i] - t[i]|. Return the maximum length of a substring of s that can be changed to be the same as the corresponding substring of t with a cost less than or equal to maxCost. Use a sliding window tracking total cost.',
  tags: ['sliding window', 'string', 'binary search', 'prefix sum'],

  code: {
    pseudocode: `function equalSubstring(s, t, maxCost):
  left = 0
  cost = 0
  result = 0
  for right in range(len(s)):
    cost += abs(ord(s[right]) - ord(t[right]))
    while cost > maxCost:
      cost -= abs(ord(s[left]) - ord(t[left]))
      left += 1
    result = max(result, right - left + 1)
  return result`,

    python: `def equalSubstring(s: str, t: str, maxCost: int) -> int:
    left = 0
    cost = 0
    result = 0
    for right in range(len(s)):
        cost += abs(ord(s[right]) - ord(t[right]))
        while cost > maxCost:
            cost -= abs(ord(s[left]) - ord(t[left]))
            left += 1
        result = max(result, right - left + 1)
    return result`,

    javascript: `function equalSubstring(s, t, maxCost) {
  let left = 0, cost = 0, result = 0;
  for (let right = 0; right < s.length; right++) {
    cost += Math.abs(s.charCodeAt(right) - t.charCodeAt(right));
    while (cost > maxCost) {
      cost -= Math.abs(s.charCodeAt(left) - t.charCodeAt(left));
      left++;
    }
    result = Math.max(result, right - left + 1);
  }
  return result;
}`,

    java: `public int equalSubstring(String s, String t, int maxCost) {
    int left = 0, cost = 0, result = 0;
    for (int right = 0; right < s.length(); right++) {
        cost += Math.abs(s.charAt(right) - t.charAt(right));
        while (cost > maxCost) {
            cost -= Math.abs(s.charAt(left) - t.charAt(left));
            left++;
        }
        result = Math.max(result, right - left + 1);
    }
    return result;
}`,
  },

  defaultInput: {
    s: 'abcd',
    t: 'bcdf',
    maxCost: 3,
  },

  inputFields: [
    {
      name: 's',
      label: 'Source String (s)',
      type: 'string',
      defaultValue: 'abcd',
      placeholder: 'abcd',
      helperText: 'Source string',
    },
    {
      name: 't',
      label: 'Target String (t)',
      type: 'string',
      defaultValue: 'bcdf',
      placeholder: 'bcdf',
      helperText: 'Target string (same length as s)',
    },
    {
      name: 'maxCost',
      label: 'Max Cost',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Maximum total conversion cost',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const t = input.t as string;
    const maxCost = input.maxCost as number;
    const steps: AlgorithmStep[] = [];

    const costs = Array.from({ length: s.length }, (_, i) =>
      Math.abs(s.charCodeAt(i) - t.charCodeAt(i))
    );

    const makeViz = (
      highlights: Record<number, string>,
      labels: Record<number, string>
    ): ArrayVisualization => ({
      type: 'array',
      array: costs,
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Convert strings to cost array (|s[i]-t[i]| for each position). Costs: [${costs.join(', ')}]. maxCost=${maxCost}.`,
      variables: { costs: costs.join(', '), maxCost },
      visualization: makeViz({}, {}),
    });

    let left = 0;
    let cost = 0;
    let result = 0;

    for (let right = 0; right < costs.length; right++) {
      cost += costs[right];

      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        highlights[i] = 'active';
      }
      highlights[right] = 'current';
      labels[left] = 'L';
      labels[right] = 'R';

      steps.push({
        line: 5,
        explanation: `Expand right to index ${right}. Cost of converting s[${right}]='${s[right]}' to t[${right}]='${t[right]}' is ${costs[right]}. Total cost=${cost}.`,
        variables: { left, right, addedCost: costs[right], totalCost: cost, maxCost },
        visualization: makeViz(highlights, labels),
      });

      while (cost > maxCost) {
        const shrinkHighlights: Record<number, string> = {};
        const shrinkLabels: Record<number, string> = {};
        for (let i = left; i <= right; i++) {
          shrinkHighlights[i] = 'active';
        }
        shrinkHighlights[left] = 'mismatch';
        shrinkLabels[left] = 'L++';
        shrinkLabels[right] = 'R';

        steps.push({
          line: 7,
          explanation: `Cost ${cost} > maxCost ${maxCost}. Shrink from left, removing cost ${costs[left]} at index ${left}.`,
          variables: { left, right, removedCost: costs[left], totalCost: cost, maxCost },
          visualization: makeViz(shrinkHighlights, shrinkLabels),
        });

        cost -= costs[left];
        left++;
      }

      result = Math.max(result, right - left + 1);

      const validHighlights: Record<number, string> = {};
      const validLabels: Record<number, string> = {};
      for (let i = left; i <= right; i++) {
        validHighlights[i] = result === right - left + 1 ? 'found' : 'active';
      }
      validLabels[left] = 'L';
      validLabels[right] = 'R';

      steps.push({
        line: 9,
        explanation: `Valid window [${left}, ${right}], cost=${cost} <= maxCost=${maxCost}. Length=${right - left + 1}. Best=${result}.`,
        variables: { left, right, cost, maxCost, windowLength: right - left + 1, result },
        visualization: makeViz(validHighlights, validLabels),
      });
    }

    steps.push({
      line: 10,
      explanation: `Done. Maximum equal substring length within budget = ${result}.`,
      variables: { result },
      visualization: makeViz({}, {}),
    });

    return steps;
  },
};

export default getEqualSubstringsWithinBudget;
