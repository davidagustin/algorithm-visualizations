import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const integerToEnglishWords: AlgorithmDefinition = {
  id: 'integer-to-english-words',
  title: 'Integer to English Words',
  leetcodeNumber: 273,
  difficulty: 'Hard',
  category: 'Hash Map',
  description:
    'Convert a non-negative integer to its English words representation. Map digits and teen words using lookup tables (hash maps), then recursively process groups of three digits (thousands, millions, billions) to build the final string.',
  tags: ['hash map', 'string', 'math', 'recursion'],

  code: {
    pseudocode: `ones = ["","One","Two",...,"Nineteen"]
tens = ["","","Twenty","Thirty",...,"Ninety"]
thousands = ["","Thousand","Million","Billion"]

function numberToWords(num):
  if num == 0: return "Zero"
  result = ""
  for i, unit in enumerate(thousands):
    if num % 1000 != 0:
      result = helper(num % 1000) + unit + result
    num //= 1000
  return result.trim()

function helper(n):
  if n < 20: return ones[n]
  if n < 100: return tens[n//10] + ones[n%10]
  return ones[n//100] + "Hundred " + helper(n%100)`,
    python: `def numberToWords(num: int) -> str:
    if num == 0: return "Zero"
    ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
            "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen",
            "Seventeen","Eighteen","Nineteen"]
    tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"]
    thousands = ["","Thousand","Million","Billion"]

    def helper(n):
        if n == 0: return ""
        if n < 20: return ones[n] + " "
        if n < 100: return tens[n//10] + " " + helper(n%10)
        return ones[n//100] + " Hundred " + helper(n%100)

    result, i = "", 0
    while num:
        if num % 1000:
            result = helper(num % 1000) + (thousands[i] + " " if thousands[i] else "") + result
        num //= 1000
        i += 1
    return result.strip()`,
    javascript: `function numberToWords(num) {
  if (num === 0) return "Zero";
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
    "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const thousands = ["","Thousand","Million","Billion"];
  const helper = n => {
    if (!n) return "";
    if (n < 20) return ones[n] + " ";
    if (n < 100) return tens[Math.floor(n/10)] + " " + helper(n%10);
    return ones[Math.floor(n/100)] + " Hundred " + helper(n%100);
  };
  let result = "", i = 0;
  while (num) {
    if (num % 1000) result = helper(num%1000) + (thousands[i] ? thousands[i]+" " : "") + result;
    num = Math.floor(num/1000); i++;
  }
  return result.trim();
}`,
    java: `public String numberToWords(int num) {
    if (num == 0) return "Zero";
    String[] ones = {"","One","Two","Three","Four","Five","Six","Seven","Eight","Nine",
        "Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"};
    String[] tens = {"","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"};
    String[] th = {"","Thousand","Million","Billion"};
    StringBuilder sb = new StringBuilder();
    int i = 0;
    while (num > 0) {
        if (num % 1000 != 0) {
            StringBuilder part = new StringBuilder(helper(num%1000, ones, tens));
            if (!th[i].isEmpty()) part.append(th[i]).append(" ");
            sb.insert(0, part);
        }
        num /= 1000; i++;
    }
    return sb.toString().trim();
}`,
  },

  defaultInput: {
    num: 1234567,
  },

  inputFields: [
    {
      name: 'num',
      label: 'Number',
      type: 'number',
      defaultValue: 1234567,
      placeholder: '1234567',
      helperText: 'Non-negative integer (0 to 2^31-1)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const num = input.num as number;
    const steps: AlgorithmStep[] = [];

    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
      'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
      'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    const helper = (n: number): string => {
      if (n === 0) return '';
      if (n < 20) return ones[n] + ' ';
      if (n < 100) return tens[Math.floor(n / 10)] + ' ' + helper(n % 10);
      return ones[Math.floor(n / 100)] + ' Hundred ' + helper(n % 100);
    };

    const makeViz = (highlights: Record<number, string>, labels: Record<number, string>): ArrayVisualization => ({
      type: 'array',
      array: [num] as unknown as number[],
      highlights,
      labels,
    });

    if (num === 0) {
      steps.push({
        line: 1,
        explanation: 'Input is 0. Return "Zero".',
        variables: { num, result: 'Zero' },
        visualization: makeViz({ 0: 'found' }, { 0: 'Zero' }),
      });
      return steps;
    }

    steps.push({
      line: 3,
      explanation: `Converting ${num} to English words. Break into groups of 1000.`,
      variables: { num },
      visualization: makeViz({ 0: 'active' }, { 0: `${num}` }),
    });

    let remaining = num;
    let i = 0;
    const parts: string[] = [];

    while (remaining > 0) {
      const chunk = remaining % 1000;
      if (chunk !== 0) {
        const chunkWords = helper(chunk).trim();
        const unit = thousands[i] ? ' ' + thousands[i] : '';
        const part = chunkWords + unit;
        parts.unshift(part);

        steps.push({
          line: 8,
          explanation: `Group ${i} (${thousands[i] || 'ones'}): ${chunk} -> "${chunkWords}"${unit ? ' + "' + thousands[i] + '"' : ''}`,
          variables: { group: i, chunk, words: chunkWords, unit: thousands[i] || 'none' },
          visualization: makeViz({ 0: 'active' }, { 0: `${chunk}` }),
        });
      }
      remaining = Math.floor(remaining / 1000);
      i++;
    }

    const result = parts.join(' ').replace(/\s+/g, ' ').trim();

    steps.push({
      line: 10,
      explanation: `Final result: "${result}"`,
      variables: { result },
      visualization: makeViz({ 0: 'found' }, { 0: 'done' }),
    });

    return steps;
  },
};

export default integerToEnglishWords;
