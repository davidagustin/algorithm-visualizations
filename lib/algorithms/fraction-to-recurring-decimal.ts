import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const fractionToRecurringDecimal: AlgorithmDefinition = {
  id: 'fraction-to-recurring-decimal',
  title: 'Fraction to Recurring Decimal',
  leetcodeNumber: 166,
  difficulty: 'Medium',
  category: 'Math',
  description:
    'Given numerator and denominator, return the fraction as a string. If the fractional part is repeating, enclose the repeating part in parentheses. Perform long division while tracking remainders in a hash map. When a remainder repeats, the portion from that point onwards is the repeating part.',
  tags: ['math', 'hash map', 'long division'],

  code: {
    pseudocode: `function fractionToDecimal(num, den):
  handle sign and zeros
  result = integer part
  if remainder == 0: return result
  result += "."
  map = {} (remainder -> position)
  while remainder != 0:
    if remainder in map:
      insert "(" at map[remainder]
      result += ")"
      break
    map[remainder] = len(result)
    remainder *= 10
    result += remainder / den
    remainder = remainder % den
  return result`,

    python: `def fractionToDecimal(numerator, denominator):
    if numerator == 0: return "0"
    sign = "-" if (numerator < 0) ^ (denominator < 0) else ""
    num, den = abs(numerator), abs(denominator)
    integer = num // den
    remainder = num % den
    if remainder == 0: return sign + str(integer)
    decimal = []
    seen = {}
    while remainder:
        if remainder in seen:
            decimal.insert(seen[remainder], "(")
            decimal.append(")")
            break
        seen[remainder] = len(decimal)
        remainder *= 10
        decimal.append(str(remainder // den))
        remainder %= den
    return sign + str(integer) + "." + "".join(decimal)`,

    javascript: `function fractionToDecimal(numerator, denominator) {
  if (numerator === 0) return "0";
  const sign = ((numerator < 0) ^ (denominator < 0)) ? "-" : "";
  let num = Math.abs(numerator), den = Math.abs(denominator);
  let result = sign + Math.floor(num / den);
  let rem = num % den;
  if (rem === 0) return result;
  result += ".";
  const map = {};
  while (rem !== 0) {
    if (map[rem] !== undefined) {
      result = result.slice(0, map[rem]) + "(" + result.slice(map[rem]) + ")";
      break;
    }
    map[rem] = result.length;
    rem *= 10;
    result += Math.floor(rem / den);
    rem %= den;
  }
  return result;
}`,

    java: `public String fractionToDecimal(int numerator, int denominator) {
    if (numerator == 0) return "0";
    StringBuilder sb = new StringBuilder();
    if ((numerator < 0) ^ (denominator < 0)) sb.append("-");
    long num = Math.abs((long)numerator), den = Math.abs((long)denominator);
    sb.append(num / den);
    long rem = num % den;
    if (rem == 0) return sb.toString();
    sb.append(".");
    Map<Long, Integer> map = new HashMap<>();
    while (rem != 0) {
        if (map.containsKey(rem)) { sb.insert(map.get(rem), "("); sb.append(")"); break; }
        map.put(rem, sb.length());
        rem *= 10;
        sb.append(rem / den);
        rem %= den;
    }
    return sb.toString();
}`,
  },

  defaultInput: {
    numerator: 1,
    denominator: 6,
  },

  inputFields: [
    {
      name: 'numerator',
      label: 'Numerator',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Numerator of the fraction',
    },
    {
      name: 'denominator',
      label: 'Denominator',
      type: 'number',
      defaultValue: 6,
      placeholder: '6',
      helperText: 'Denominator of the fraction (non-zero)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const numerator = input.numerator as number;
    const denominator = input.denominator as number;
    const steps: AlgorithmStep[] = [];

    if (numerator === 0) {
      steps.push({
        line: 1,
        explanation: 'Numerator is 0. Result is "0".',
        variables: { result: '0' },
        visualization: { type: 'array', array: [0], highlights: { 0: 'found' }, labels: { 0: '0' } } as ArrayVisualization,
      });
      return steps;
    }

    const negative = (numerator < 0) !== (denominator < 0);
    let num = Math.abs(numerator);
    const den = Math.abs(denominator);
    const intPart = Math.floor(num / den);
    let rem = num % den;

    steps.push({
      line: 1,
      explanation: `${numerator} / ${denominator}. ${negative ? 'Negative result. ' : ''}Integer part = ${intPart}, remainder = ${rem}.`,
      variables: { numerator, denominator, intPart, remainder: rem, negative },
      visualization: {
        type: 'array',
        array: [num, den, intPart, rem],
        highlights: { 0: 'active', 1: 'active', 2: 'found', 3: 'comparing' },
        labels: { 0: `num=${num}`, 1: `den=${den}`, 2: `int=${intPart}`, 3: `rem=${rem}` },
      } as ArrayVisualization,
    });

    let result = (negative ? '-' : '') + intPart;

    if (rem === 0) {
      steps.push({
        line: 3,
        explanation: `Remainder is 0. No decimal part. Result = "${result}".`,
        variables: { result },
        visualization: { type: 'array', array: [intPart], highlights: { 0: 'found' }, labels: { 0: result } } as ArrayVisualization,
      });
      return steps;
    }

    result += '.';
    const seen = new Map<number, number>();
    const decimalDigits: string[] = [];
    let repeatStart = -1;
    let iters = 0;

    steps.push({
      line: 4,
      explanation: `Remainder ${rem} != 0. Start decimal long division. Track remainders to detect repetition.`,
      variables: { result, remainder: rem },
      visualization: { type: 'array', array: [rem], highlights: { 0: 'active' }, labels: { 0: `rem=${rem}` } } as ArrayVisualization,
    });

    while (rem !== 0 && iters < 20) {
      iters++;
      if (seen.has(rem)) {
        repeatStart = seen.get(rem)!;
        steps.push({
          line: 7,
          explanation: `Remainder ${rem} seen before at decimal position ${repeatStart}. Repeating detected! Insert "(" at position ${repeatStart} and close with ")".`,
          variables: { remainder: rem, repeatStart },
          visualization: {
            type: 'array',
            array: decimalDigits.map((_, i) => i),
            highlights: Object.fromEntries(decimalDigits.map((_, i) => [i, i >= repeatStart ? 'found' : 'sorted'])),
            labels: Object.fromEntries(decimalDigits.map((d, i) => [i, d])),
          } as ArrayVisualization,
        });
        break;
      }
      seen.set(rem, decimalDigits.length);
      rem *= 10;
      const digit = Math.floor(rem / den);
      rem = rem % den;
      decimalDigits.push(String(digit));

      steps.push({
        line: 9,
        explanation: `Long division step: multiply remainder by 10, divide by ${den}. Digit = ${digit}, new remainder = ${rem}.`,
        variables: { digit, remainder: rem, decimalSoFar: decimalDigits.join('') },
        visualization: {
          type: 'array',
          array: decimalDigits.map((_, i) => i),
          highlights: { [decimalDigits.length - 1]: 'active' },
          labels: Object.fromEntries(decimalDigits.map((d, i) => [i, d])),
        } as ArrayVisualization,
      });
    }

    let decimalStr = decimalDigits.join('');
    if (repeatStart >= 0) {
      decimalStr = decimalDigits.slice(0, repeatStart).join('') + '(' + decimalDigits.slice(repeatStart).join('') + ')';
    }
    const finalResult = result + decimalStr;

    steps.push({
      line: 12,
      explanation: `Result = "${finalResult}". ${repeatStart >= 0 ? `Digits in parentheses repeat infinitely.` : 'Decimal terminates.'}`,
      variables: { result: finalResult },
      visualization: {
        type: 'array',
        array: decimalDigits.map((_, i) => i),
        highlights: Object.fromEntries(decimalDigits.map((_, i) => [i, repeatStart >= 0 && i >= repeatStart ? 'found' : 'sorted'])),
        labels: Object.fromEntries(decimalDigits.map((d, i) => [i, d])),
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default fractionToRecurringDecimal;
