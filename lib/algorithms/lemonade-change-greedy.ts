import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const lemonadeChangeGreedy: AlgorithmDefinition = {
  id: 'lemonade-change-greedy',
  title: 'Lemonade Change (Greedy)',
  leetcodeNumber: 860,
  difficulty: 'Easy',
  category: 'Greedy',
  description:
    'At a lemonade stand, each cup costs $5. Customers pay with $5, $10, or $20 bills. Give correct change to every customer. Return true if you can give correct change to all customers. Greedy: for a $20 bill, prefer to give $10+$5 change over $5+$5+$5, since $10 bills are less versatile.',
  tags: ['greedy', 'array', 'simulation'],

  code: {
    pseudocode: `function lemonadeChange(bills):
  five = 0, ten = 0
  for bill in bills:
    if bill == 5:
      five++
    elif bill == 10:
      if five == 0: return false
      five--; ten++
    else: // bill == 20
      if ten > 0 and five > 0:
        ten--; five--
      elif five >= 3:
        five -= 3
      else:
        return false
  return true`,

    python: `def lemonadeChange(bills: list[int]) -> bool:
    five = ten = 0
    for bill in bills:
        if bill == 5:
            five += 1
        elif bill == 10:
            if not five:
                return False
            five -= 1
            ten += 1
        else:
            if ten and five:
                ten -= 1
                five -= 1
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
            else if (five >= 3) { five -= 3; }
            else return false;
        }
    }
    return true;
}`,
  },

  defaultInput: {
    bills: [5, 5, 5, 10, 20],
  },

  inputFields: [
    {
      name: 'bills',
      label: 'Customer Bills',
      type: 'array',
      defaultValue: [5, 5, 5, 10, 20],
      placeholder: '5,5,5,10,20',
      helperText: 'Bills paid by each customer (5, 10, or 20)',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const bills = input.bills as number[];
    const steps: AlgorithmStep[] = [];

    steps.push({
      line: 1,
      explanation: `Start with no change. Process each customer bill and give correct change.`,
      variables: { five: 0, ten: 0 },
      visualization: {
        type: 'array',
        array: [...bills],
        highlights: {},
        labels: {},
      },
    });

    let five = 0;
    let ten = 0;

    for (let i = 0; i < bills.length; i++) {
      const bill = bills[i];

      if (bill === 5) {
        five++;
        steps.push({
          line: 4,
          explanation: `Customer ${i} pays $5. Exact change, no change needed. Collect the $5 bill. five=${five}, ten=${ten}.`,
          variables: { i, bill, five, ten },
          visualization: {
            type: 'array',
            array: [...bills],
            highlights: { [i]: 'found' } as Record<number, string>,
            labels: { [i]: '$5' } as Record<number, string>,
          },
        });
      } else if (bill === 10) {
        if (five === 0) {
          steps.push({
            line: 7,
            explanation: `Customer ${i} pays $10 but we have no $5 bills for change. Return false.`,
            variables: { i, bill, five, ten, result: false },
            visualization: {
              type: 'array',
              array: [...bills],
              highlights: { [i]: 'mismatch' } as Record<number, string>,
              labels: { [i]: 'fail' } as Record<number, string>,
            },
          });
          return steps;
        }
        five--;
        ten++;
        steps.push({
          line: 8,
          explanation: `Customer ${i} pays $10. Give $5 change. five=${five}, ten=${ten}.`,
          variables: { i, bill, five, ten },
          visualization: {
            type: 'array',
            array: [...bills],
            highlights: { [i]: 'found' } as Record<number, string>,
            labels: { [i]: '$10-$5' } as Record<number, string>,
          },
        });
      } else {
        if (ten > 0 && five > 0) {
          ten--;
          five--;
          steps.push({
            line: 10,
            explanation: `Customer ${i} pays $20. Give $10+$5 change (preferred). five=${five}, ten=${ten}.`,
            variables: { i, bill, five, ten },
            visualization: {
              type: 'array',
              array: [...bills],
              highlights: { [i]: 'found' } as Record<number, string>,
              labels: { [i]: '$20-$10-$5' } as Record<number, string>,
            },
          });
        } else if (five >= 3) {
          five -= 3;
          steps.push({
            line: 11,
            explanation: `Customer ${i} pays $20. No $10 available. Give $5+$5+$5 change. five=${five}, ten=${ten}.`,
            variables: { i, bill, five, ten },
            visualization: {
              type: 'array',
              array: [...bills],
              highlights: { [i]: 'active' } as Record<number, string>,
              labels: { [i]: '$20-3x$5' } as Record<number, string>,
            },
          });
        } else {
          steps.push({
            line: 12,
            explanation: `Customer ${i} pays $20 but not enough change available. Return false.`,
            variables: { i, bill, five, ten, result: false },
            visualization: {
              type: 'array',
              array: [...bills],
              highlights: { [i]: 'mismatch' } as Record<number, string>,
              labels: { [i]: 'fail' } as Record<number, string>,
            },
          });
          return steps;
        }
      }
    }

    steps.push({
      line: 13,
      explanation: `Successfully gave change to all customers. Return true.`,
      variables: { result: true, five, ten },
      visualization: {
        type: 'array',
        array: [...bills],
        highlights: Object.fromEntries(bills.map((_, i) => [i, 'found'])) as Record<number, string>,
        labels: {},
      },
    });

    return steps;
  },
};

export default lemonadeChangeGreedy;
