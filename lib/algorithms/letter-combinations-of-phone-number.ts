import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const letterCombinationsOfPhoneNumber: AlgorithmDefinition = {
  id: 'letter-combinations-of-phone-number',
  title: 'Letter Combinations of a Phone Number',
  leetcodeNumber: 17,
  difficulty: 'Medium',
  category: 'Backtracking',
  description:
    'Given a string containing digits 2-9, return all possible letter combinations that the number could represent on a phone keypad. Use backtracking: for each digit, iterate over its letters and recurse to the next digit, building combinations character by character.',
  tags: ['backtracking', 'hash map', 'string', 'recursion'],

  code: {
    pseudocode: `function letterCombinations(digits):
  if digits is empty: return []
  phoneMap = {2:"abc", 3:"def", 4:"ghi", 5:"jkl",
              6:"mno", 7:"pqrs", 8:"tuv", 9:"wxyz"}
  results = []
  function backtrack(idx, current):
    if idx == len(digits):
      results.append(current)
      return
    for letter in phoneMap[digits[idx]]:
      backtrack(idx+1, current+letter)
  backtrack(0, "")
  return results`,
    python: `def letterCombinations(digits: str) -> list[str]:
    if not digits: return []
    phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
             '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'}
    res = []
    def bt(idx, cur):
        if idx == len(digits): res.append(cur); return
        for c in phone[digits[idx]]: bt(idx+1, cur+c)
    bt(0, '')
    return res`,
    javascript: `function letterCombinations(digits) {
  if (!digits) return [];
  const phone = {'2':'abc','3':'def','4':'ghi','5':'jkl',
                 '6':'mno','7':'pqrs','8':'tuv','9':'wxyz'};
  const res = [];
  function bt(idx, cur) {
    if (idx === digits.length) { res.push(cur); return; }
    for (const c of phone[digits[idx]]) bt(idx+1, cur+c);
  }
  bt(0, '');
  return res;
}`,
    java: `public List<String> letterCombinations(String digits) {
    if (digits.isEmpty()) return new ArrayList<>();
    Map<Character, String> phone = Map.of('2',"abc",'3',"def",'4',"ghi",
        '5',"jkl",'6',"mno",'7',"pqrs",'8',"tuv",'9',"wxyz");
    List<String> res = new ArrayList<>();
    backtrack(digits, phone, 0, new StringBuilder(), res);
    return res;
}
private void backtrack(String d, Map<Character,String> m, int idx, StringBuilder cur, List<String> res) {
    if (idx == d.length()) { res.add(cur.toString()); return; }
    for (char c : m.get(d.charAt(idx)).toCharArray()) {
        cur.append(c); backtrack(d, m, idx+1, cur, res); cur.deleteCharAt(cur.length()-1);
    }
}`,
  },

  defaultInput: { digits: '23' },

  inputFields: [
    {
      name: 'digits',
      label: 'Digits',
      type: 'string',
      defaultValue: '23',
      placeholder: '23',
      helperText: 'Phone digits (2-9) to map to letters',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const digits = input.digits as string;
    const steps: AlgorithmStep[] = [];

    const phoneMap: Record<string, string> = {
      '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
      '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz',
    };

    const results: string[] = [];

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: digits.split('').map((_, i) => i),
      highlights,
      labels,
    });

    if (!digits) {
      steps.push({
        line: 1,
        explanation: 'Empty input: return empty array.',
        variables: { digits: '', result: [] },
        visualization: makeViz({}, {}),
      });
      return steps;
    }

    steps.push({
      line: 1,
      explanation: `Map digits "${digits}" to phone letters. Digit 2->abc, 3->def, ... Backtrack to form all combinations.`,
      variables: { digits, mappings: digits.split('').map(d => `${d}->${phoneMap[d]}`).join(', ') },
      visualization: makeViz({}, Object.fromEntries(digits.split('').map((d, i) => [i, `${d}:${phoneMap[d]}`]))),
    });

    function backtrack(idx: number, current: string) {
      if (idx === digits.length) {
        results.push(current);
        const h: Record<number, string> = {};
        digits.split('').forEach((_, i) => { h[i] = 'found'; });
        steps.push({
          line: 7,
          explanation: `Combination complete: "${current}". Total found: ${results.length}.`,
          variables: { combination: current, totalFound: results.length },
          visualization: makeViz(h, Object.fromEntries(digits.split('').map((d, i) => [i, current[i]]))),
        });
        return;
      }

      const letters = phoneMap[digits[idx]];
      for (const letter of letters) {
        if (steps.length < 30) {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          digits.split('').forEach((d, i) => {
            if (i < idx) { h[i] = 'visited'; l[i] = current[i]; }
            else if (i === idx) { h[i] = 'active'; l[i] = letter; }
            else { l[i] = phoneMap[d]; }
          });
          steps.push({
            line: 9,
            explanation: `Digit "${digits[idx]}" at index ${idx}: try letter "${letter}". Current: "${current + letter}".`,
            variables: { digit: digits[idx], letter, index: idx, current: current + letter },
            visualization: makeViz(h, l),
          });
        }
        backtrack(idx + 1, current + letter);
      }
    }

    backtrack(0, '');

    steps.push({
      line: 11,
      explanation: `All combinations for "${digits}": [${results.join(', ')}]. Total: ${results.length}.`,
      variables: { digits, combinations: results, count: results.length },
      visualization: makeViz({}, Object.fromEntries(digits.split('').map((d, i) => [i, `${d}:${phoneMap[d]}`]))),
    });

    return steps;
  },
};

export default letterCombinationsOfPhoneNumber;
