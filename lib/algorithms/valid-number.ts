import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const validNumber: AlgorithmDefinition = {
  id: 'valid-number',
  title: 'Valid Number',
  leetcodeNumber: 65,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Determine if a string is a valid number. A valid number can be an integer or decimal, optionally followed by an exponent (e or E). Track flags: seenDigit (any digit seen), seenDot (decimal point seen), seenE (exponent seen). After e/E, reset seenDigit and disallow another dot.',
  tags: ['math', 'string', 'state machine'],

  code: {
    pseudocode: `function isNumber(s):
  seenDigit = false
  seenDot = false
  seenE = false
  for each char c in s:
    if c is digit: seenDigit = true
    elif c is +/-: only valid at start or after e/E
    elif c is .: only valid if no dot and no E before
    elif c is e/E: only valid if no E before and digit seen; reset seenDigit
    else: return false
  return seenDigit`,

    python: `def isNumber(s):
    seen_digit = seen_dot = seen_e = False
    for i, c in enumerate(s):
        if c.isdigit():
            seen_digit = True
        elif c in '+-':
            if i > 0 and s[i-1] not in 'eE':
                return False
        elif c == '.':
            if seen_dot or seen_e:
                return False
            seen_dot = True
        elif c in 'eE':
            if seen_e or not seen_digit:
                return False
            seen_e, seen_digit = True, False
        else:
            return False
    return seen_digit`,

    javascript: `function isNumber(s) {
  let seenDigit = false, seenDot = false, seenE = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c >= '0' && c <= '9') { seenDigit = true; }
    else if (c === '+' || c === '-') { if (i > 0 && !'eE'.includes(s[i-1])) return false; }
    else if (c === '.') { if (seenDot || seenE) return false; seenDot = true; }
    else if (c === 'e' || c === 'E') { if (seenE || !seenDigit) return false; seenE = true; seenDigit = false; }
    else return false;
  }
  return seenDigit;
}`,

    java: `public boolean isNumber(String s) {
    boolean seenDigit = false, seenDot = false, seenE = false;
    for (int i = 0; i < s.length(); i++) {
        char c = s.charAt(i);
        if (Character.isDigit(c)) seenDigit = true;
        else if (c == '+' || c == '-') { if (i > 0 && "eE".indexOf(s.charAt(i-1)) < 0) return false; }
        else if (c == '.') { if (seenDot || seenE) return false; seenDot = true; }
        else if (c == 'e' || c == 'E') { if (seenE || !seenDigit) return false; seenE = true; seenDigit = false; }
        else return false;
    }
    return seenDigit;
}`,
  },

  defaultInput: {
    s: '2e10',
  },

  inputFields: [
    {
      name: 's',
      label: 'String',
      type: 'string',
      defaultValue: '2e10',
      placeholder: '2e10',
      helperText: 'String to validate as a number',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const s = input.s as string;
    const steps: AlgorithmStep[] = [];
    const chars = s.split('');

    steps.push({
      line: 1,
      explanation: `Validate if "${s}" is a valid number. Track: seenDigit, seenDot, seenE flags.`,
      variables: { s, seenDigit: false, seenDot: false, seenE: false },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i),
        highlights: {},
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    let seenDigit = false;
    let seenDot = false;
    let seenE = false;
    let valid = true;
    let reason = '';

    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      let charType = '';

      if (c >= '0' && c <= '9') {
        seenDigit = true;
        charType = 'digit';
        steps.push({
          line: 4,
          explanation: `c = '${c}' is a digit. seenDigit = true.`,
          variables: { i, c, seenDigit, seenDot, seenE },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'found' },
            labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
          } as ArrayVisualization,
        });
      } else if (c === '+' || c === '-') {
        charType = 'sign';
        if (i > 0 && !'eE'.includes(chars[i - 1])) {
          valid = false;
          reason = `sign '${c}' at position ${i} not at start or after e/E`;
          steps.push({
            line: 5,
            explanation: `c = '${c}' is a sign at position ${i}, but previous char is '${chars[i-1]}', not e/E. INVALID.`,
            variables: { i, c, prevChar: chars[i - 1], valid: false },
            visualization: {
              type: 'array',
              array: chars.map((_, idx) => idx),
              highlights: { [i]: 'mismatch', [i - 1]: 'mismatch' },
              labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
            } as ArrayVisualization,
          });
          break;
        }
        steps.push({
          line: 5,
          explanation: `c = '${c}' is a valid sign at position ${i} (${i === 0 ? 'start of number' : 'after e/E'}).`,
          variables: { i, c, seenDigit, seenDot, seenE },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'active' },
            labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
          } as ArrayVisualization,
        });
      } else if (c === '.') {
        charType = 'dot';
        if (seenDot || seenE) {
          valid = false;
          reason = `dot at position ${i} but seenDot=${seenDot} or seenE=${seenE}`;
          steps.push({
            line: 7,
            explanation: `c = '.' at position ${i}, but ${seenDot ? 'already saw a dot' : 'already saw e/E'}. INVALID.`,
            variables: { i, c, seenDot, seenE, valid: false },
            visualization: {
              type: 'array',
              array: chars.map((_, idx) => idx),
              highlights: { [i]: 'mismatch' },
              labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
            } as ArrayVisualization,
          });
          break;
        }
        seenDot = true;
        steps.push({
          line: 7,
          explanation: `c = '.' valid decimal point. seenDot = true.`,
          variables: { i, seenDot, seenE },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'active' },
            labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
          } as ArrayVisualization,
        });
      } else if (c === 'e' || c === 'E') {
        charType = 'exponent';
        if (seenE || !seenDigit) {
          valid = false;
          reason = `exponent at position ${i} but seenE=${seenE} or seenDigit=${seenDigit}`;
          steps.push({
            line: 9,
            explanation: `c = '${c}' at position ${i}, but ${seenE ? 'already saw e/E' : 'no digits seen before e/E'}. INVALID.`,
            variables: { i, c, seenE, seenDigit, valid: false },
            visualization: {
              type: 'array',
              array: chars.map((_, idx) => idx),
              highlights: { [i]: 'mismatch' },
              labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
            } as ArrayVisualization,
          });
          break;
        }
        seenE = true;
        seenDigit = false;
        steps.push({
          line: 9,
          explanation: `c = '${c}' is valid exponent. seenE = true, reset seenDigit = false (need digit after e).`,
          variables: { i, seenE, seenDigit },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'active' },
            labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
          } as ArrayVisualization,
        });
      } else {
        valid = false;
        reason = `invalid character '${c}' at position ${i}`;
        steps.push({
          line: 10,
          explanation: `c = '${c}' at position ${i} is not a valid character. INVALID.`,
          variables: { i, c, valid: false },
          visualization: {
            type: 'array',
            array: chars.map((_, idx) => idx),
            highlights: { [i]: 'mismatch' },
            labels: Object.fromEntries(chars.map((ch, idx) => [idx, ch])),
          } as ArrayVisualization,
        });
        break;
      }
      void charType;
    }

    const result = valid && seenDigit;
    steps.push({
      line: 11,
      explanation: `Validation complete. seenDigit=${seenDigit}, valid=${valid}. "${s}" is ${result ? 'a VALID number' : 'NOT a valid number'}. ${reason ? 'Reason: ' + reason : ''}`,
      variables: { result, seenDigit, seenDot, seenE },
      visualization: {
        type: 'array',
        array: chars.map((_, i) => i),
        highlights: Object.fromEntries(chars.map((_, i) => [i, result ? 'found' : 'mismatch'])),
        labels: Object.fromEntries(chars.map((c, i) => [i, c])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default validNumber;
