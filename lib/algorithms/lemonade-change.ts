import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lemonadeChange: AlgorithmDefinition = {
  id: 'lemonade-change',
  title: 'Lemonade Change',
  leetcodeNumber: 860,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'At a lemonade stand each lemonade costs $5. Customers pay with $5, $10, or $20 bills. Return true if you can give every customer correct change. Greedy: when making $15 change for a $20, prefer to give a $10+$5 (keep fewer large bills), fall back to three $5s.',
  tags: ['Greedy', 'Array', 'Simulation'],
  code: {
    pseudocode: `function lemonadeChange(bills):
  five = 0, ten = 0
  for bill in bills:
    if bill == 5: five++
    elif bill == 10:
      if five == 0: return false
      five--; ten++
    else:  // bill == 20
      if ten > 0 and five > 0:
        ten--; five--   // prefer $10+$5
      elif five >= 3:
        five -= 3
      else: return false
  return true`,
    python: `def lemonadeChange(bills):
    five = ten = 0
    for bill in bills:
        if bill == 5:
            five += 1
        elif bill == 10:
            if not five: return False
            five -= 1; ten += 1
        else:
            if ten and five:
                ten -= 1; five -= 1
            elif five >= 3:
                five -= 3
            else:
                return False
    return True`,
    javascript: `function lemonadeChange(bills) {
  let five = 0, ten = 0;
  for (const bill of bills) {
    if (bill === 5) {
      five++;
    } else if (bill === 10) {
      if (!five) return false;
      five--; ten++;
    } else {
      if (ten > 0 && five > 0) { ten--; five--; }
      else if (five >= 3) { five -= 3; }
      else return false;
    }
  }
  return true;
}`,
    java: `public boolean lemonadeChange(int[] bills) {
    int five = 0, ten = 0;
    for (int bill : bills) {
        if (bill == 5) five++;
        else if (bill == 10) {
            if (five == 0) return false;
            five--; ten++;
        } else {
            if (ten > 0 && five > 0) { ten--; five--; }
            else if (five >= 3) five -= 3;
            else return false;
        }
    }
    return true;
}`,
  },
  defaultInput: { bills: [5, 5, 5, 10, 20] },
  inputFields: [
    {
      name: 'bills',
      label: 'Bills',
      type: 'array',
      defaultValue: [5, 5, 5, 10, 20],
      placeholder: 'e.g. 5,5,5,10,20',
      helperText: 'Bills paid by customers (5, 10, or 20 only)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bills = input.bills as number[];
    const n = bills.length;
    const steps: AlgorithmStep[] = [];
    let five = 0, ten = 0;
    let failed = false;

    function makeViz(idx: number, color: string): ArrayVisualization {
      const highlights: Record<number, string> = {};
      const labels: Record<number, string> = {};
      for (let i = 0; i < n; i++) {
        labels[i] = `$${bills[i]}`;
        if (i < idx) highlights[i] = 'visited';
        else if (i === idx) highlights[i] = color;
        else highlights[i] = 'default';
      }
      return {
        type: 'array',
        array: bills.slice(),
        highlights,
        labels,
        auxData: {
          label: 'Cash Register',
          entries: [
            { key: '$5 bills', value: String(five) },
            { key: '$10 bills', value: String(ten) },
            { key: 'Customer', value: String(idx + 1) },
          ],
        },
      };
    }

    steps.push({
      line: 1,
      explanation: `Lemonade costs $5. Process ${n} customers. Track $5 and $10 bills in register.`,
      variables: { five, ten },
      visualization: makeViz(-1, 'default'),
    });

    for (let i = 0; i < n; i++) {
      const bill = bills[i];

      if (bill === 5) {
        five++;
        steps.push({
          line: 3,
          explanation: `Customer ${i + 1} pays $5 (exact). No change needed. five=$${five}.`,
          variables: { bill, five, ten },
          visualization: makeViz(i, 'found'),
        });
      } else if (bill === 10) {
        if (five === 0) {
          failed = true;
          steps.push({
            line: 5,
            explanation: `Customer ${i + 1} pays $10. Need to give $5 change but have none! Return false.`,
            variables: { bill, five, ten },
            visualization: makeViz(i, 'mismatch'),
          });
          break;
        }
        five--;
        ten++;
        steps.push({
          line: 5,
          explanation: `Customer ${i + 1} pays $10. Give $5 change. five=$${five}, ten=$${ten}.`,
          variables: { bill, five, ten },
          visualization: makeViz(i, 'active'),
        });
      } else {
        // bill === 20
        if (ten > 0 && five > 0) {
          ten--;
          five--;
          steps.push({
            line: 8,
            explanation: `Customer ${i + 1} pays $20. Give $10+$5 change (preferred). five=$${five}, ten=$${ten}.`,
            variables: { bill, five, ten, strategy: '$10+$5' },
            visualization: makeViz(i, 'active'),
          });
        } else if (five >= 3) {
          five -= 3;
          steps.push({
            line: 10,
            explanation: `Customer ${i + 1} pays $20. No $10 bill; give three $5 bills. five=$${five}.`,
            variables: { bill, five, ten, strategy: 'three $5s' },
            visualization: makeViz(i, 'comparing'),
          });
        } else {
          failed = true;
          steps.push({
            line: 11,
            explanation: `Customer ${i + 1} pays $20. Cannot make $15 change (five=${five}, ten=${ten}). Return false.`,
            variables: { bill, five, ten },
            visualization: makeViz(i, 'mismatch'),
          });
          break;
        }
      }
    }

    if (!failed) {
      steps.push({
        line: 12,
        explanation: `All ${n} customers served successfully! Return true.`,
        variables: { result: true, five, ten },
        visualization: (() => {
          const h: Record<number, string> = {};
          const l: Record<number, string> = {};
          for (let i = 0; i < n; i++) { l[i] = `$${bills[i]}`; h[i] = 'found'; }
          return {
            type: 'array' as const,
            array: bills.slice(),
            highlights: h,
            labels: l,
            auxData: {
              label: 'Result: True',
              entries: [
                { key: 'Result', value: 'true' },
                { key: '$5 bills left', value: String(five) },
                { key: '$10 bills left', value: String(ten) },
              ],
            },
          };
        })(),
      });
    }

    return steps;
  },
};

export default lemonadeChange;
