import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const countItemsMatchingRule: AlgorithmDefinition = {
  id: 'count-items-matching-rule',
  title: 'Count Items Matching a Rule',
  leetcodeNumber: 1773,
  difficulty: 'Easy',
  category: 'Arrays',
  description:
    'Given a list of items where each item is [type, color, name] and a rule [ruleKey, ruleValue], count how many items match the rule. Map the ruleKey to its index (type=0, color=1, name=2), then count items where item[index] equals ruleValue.',
  tags: ['array', 'string', 'enumeration'],

  code: {
    pseudocode: `function countMatches(items, ruleKey, ruleValue):
  idx = 0 if type else 1 if color else 2
  count = 0
  for item in items:
    if item[idx] == ruleValue:
      count++
  return count`,
    python: `def countMatches(items, ruleKey, ruleValue):
    idx = {"type": 0, "color": 1, "name": 2}[ruleKey]
    return sum(1 for item in items if item[idx] == ruleValue)`,
    javascript: `function countMatches(items, ruleKey, ruleValue) {
  const idx = {type: 0, color: 1, name: 2}[ruleKey];
  return items.filter(item => item[idx] === ruleValue).length;
}`,
    java: `public int countMatches(List<List<String>> items, String ruleKey, String ruleValue) {
    int idx = ruleKey.equals("type") ? 0 : ruleKey.equals("color") ? 1 : 2;
    int count = 0;
    for (List<String> item : items)
        if (item.get(idx).equals(ruleValue)) count++;
    return count;
}`,
  },

  defaultInput: {
    items: [['phone', 'blue', 'pixel'], ['computer', 'silver', 'lenovo'], ['phone', 'gold', 'iphone']],
    ruleKey: 'color',
    ruleValue: 'silver',
  },

  inputFields: [
    {
      name: 'ruleKey',
      label: 'Rule Key',
      type: 'string',
      defaultValue: 'color',
      placeholder: 'color',
      helperText: 'One of: type, color, name',
    },
    {
      name: 'ruleValue',
      label: 'Rule Value',
      type: 'string',
      defaultValue: 'silver',
      placeholder: 'silver',
      helperText: 'Value to match against',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const items = [['phone', 'blue', 'pixel'], ['computer', 'silver', 'lenovo'], ['phone', 'gold', 'iphone']];
    const ruleKey = (input.ruleKey as string) || 'color';
    const ruleValue = (input.ruleValue as string) || 'silver';
    const steps: AlgorithmStep[] = [];

    const keyMap: Record<string, number> = { type: 0, color: 1, name: 2 };
    const idx = keyMap[ruleKey] ?? 1;

    // Encode items as numbers for visualization (use item index as value)
    const nums = items.map((_, i) => i + 1);

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [...nums],
      highlights,
      labels,
    });

    steps.push({
      line: 1,
      explanation: `Rule: ${ruleKey} == "${ruleValue}". Key maps to field index ${idx}. Scanning ${items.length} items.`,
      variables: { ruleKey, ruleValue, fieldIndex: idx, itemCount: items.length },
      visualization: makeViz({}, {}),
    });

    let count = 0;
    for (let i = 0; i < items.length; i++) {
      const fieldVal = items[i][idx];
      const matches = fieldVal === ruleValue;
      if (matches) count++;
      steps.push({
        line: 4,
        explanation: `Item ${i}: [${items[i].join(', ')}]. ${ruleKey}="${fieldVal}". ${matches ? `Matches "${ruleValue}"! count=${count}` : `Does not match "${ruleValue}".`}`,
        variables: { item: items[i].join(', '), field: fieldVal, matches, count },
        visualization: makeViz({ [i]: matches ? 'found' : 'comparing' }, { [i]: matches ? 'match' : 'no' }),
      });
    }

    steps.push({
      line: 6,
      explanation: `Total items matching rule ${ruleKey}="${ruleValue}": ${count}.`,
      variables: { result: count },
      visualization: makeViz(
        Object.fromEntries(items.map((item, i) => [i, item[idx] === ruleValue ? 'found' : 'sorted'])),
        {}
      ),
    });

    return steps;
  },
};

export default countItemsMatchingRule;
