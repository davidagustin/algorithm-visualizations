import type { AlgorithmDefinition, AlgorithmStep, ArrayVisualization } from '../types';

const reachingPoints: AlgorithmDefinition = {
  id: 'reaching-points',
  title: 'Reaching Points',
  leetcodeNumber: 780,
  difficulty: 'Hard',
  category: 'Math',
  description:
    'Starting from (sx, sy), you can transform to (x+y, y) or (x, x+y). Determine if (tx, ty) is reachable from (sx, sy). Work backwards: from (tx, ty), if tx > ty, the previous state was (tx-ty, ty), but we can do this in bulk using modulo. Stop when tx < sx or ty < sy.',
  tags: ['math', 'modulo', 'backward reasoning'],

  code: {
    pseudocode: `function reachingPoints(sx, sy, tx, ty):
  while tx >= sx and ty >= sy:
    if tx == sx and ty == sy: return true
    if tx > ty:
      if ty == sy: return (tx - sx) % ty == 0
      tx = tx % ty
    else:
      if tx == sx: return (ty - sy) % tx == 0
      ty = ty % tx
  return false`,

    python: `def reachingPoints(sx, sy, tx, ty):
    while tx >= sx and ty >= sy:
        if tx == sx and ty == sy:
            return True
        if tx > ty:
            if ty == sy:
                return (tx - sx) % ty == 0
            tx %= ty
        else:
            if tx == sx:
                return (ty - sy) % tx == 0
            ty %= tx
    return False`,

    javascript: `function reachingPoints(sx, sy, tx, ty) {
  while (tx >= sx && ty >= sy) {
    if (tx === sx && ty === sy) return true;
    if (tx > ty) {
      if (ty === sy) return (tx - sx) % ty === 0;
      tx %= ty;
    } else {
      if (tx === sx) return (ty - sy) % tx === 0;
      ty %= tx;
    }
  }
  return false;
}`,

    java: `public boolean reachingPoints(int sx, int sy, int tx, int ty) {
    while (tx >= sx && ty >= sy) {
        if (tx == sx && ty == sy) return true;
        if (tx > ty) {
            if (ty == sy) return (tx - sx) % ty == 0;
            tx %= ty;
        } else {
            if (tx == sx) return (ty - sy) % tx == 0;
            ty %= tx;
        }
    }
    return false;
}`,
  },

  defaultInput: {
    sx: 1,
    sy: 1,
    tx: 3,
    ty: 5,
  },

  inputFields: [
    {
      name: 'sx',
      label: 'Start X',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Starting x coordinate',
    },
    {
      name: 'sy',
      label: 'Start Y',
      type: 'number',
      defaultValue: 1,
      placeholder: '1',
      helperText: 'Starting y coordinate',
    },
    {
      name: 'tx',
      label: 'Target X',
      type: 'number',
      defaultValue: 3,
      placeholder: '3',
      helperText: 'Target x coordinate',
    },
    {
      name: 'ty',
      label: 'Target Y',
      type: 'number',
      defaultValue: 5,
      placeholder: '5',
      helperText: 'Target y coordinate',
    },
  ],

  generateSteps(input: Record<string, unknown>): AlgorithmStep[] {
    const sx = input.sx as number;
    const sy = input.sy as number;
    let tx = input.tx as number;
    let ty = input.ty as number;
    const steps: AlgorithmStep[] = [];
    const path: [number, number][] = [[tx, ty]];

    steps.push({
      line: 1,
      explanation: `Start: (${sx}, ${sy}), Target: (${tx}, ${ty}). Work backwards using modulo to efficiently reduce (tx, ty) toward (sx, sy).`,
      variables: { sx, sy, tx, ty },
      visualization: {
        type: 'array',
        array: [sx, sy, tx, ty],
        highlights: { 0: 'active', 1: 'active', 2: 'comparing', 3: 'comparing' },
        labels: { 0: `sx=${sx}`, 1: `sy=${sy}`, 2: `tx=${tx}`, 3: `ty=${ty}` },
      } as ArrayVisualization,
    });

    let result = false;
    let iters = 0;
    while (tx >= sx && ty >= sy) {
      iters++;
      if (iters > 50) break; // safety limit

      if (tx === sx && ty === sy) {
        result = true;
        steps.push({
          line: 3,
          explanation: `(tx, ty) = (${tx}, ${ty}) equals start (${sx}, ${sy}). Reached! Return true.`,
          variables: { tx, ty, sx, sy, result: true },
          visualization: {
            type: 'array',
            array: [tx, ty],
            highlights: { 0: 'found', 1: 'found' },
            labels: { 0: `tx=${tx}`, 1: `ty=${ty}` },
          } as ArrayVisualization,
        });
        break;
      }

      if (tx > ty) {
        if (ty === sy) {
          result = (tx - sx) % ty === 0;
          steps.push({
            line: 5,
            explanation: `tx > ty and ty == sy. Check if (tx - sx) % ty == 0: (${tx} - ${sx}) % ${ty} = ${(tx - sx) % ty}. Result = ${result}.`,
            variables: { tx, ty, sx, sy, check: (tx - sx) % ty, result },
            visualization: {
              type: 'array',
              array: [tx, ty],
              highlights: { 0: result ? 'found' : 'mismatch', 1: 'active' },
              labels: { 0: String(tx), 1: String(ty) },
            } as ArrayVisualization,
          });
          break;
        }
        const prevTx = tx % ty;
        steps.push({
          line: 6,
          explanation: `tx (${tx}) > ty (${ty}). Previous tx was tx mod ty = ${tx} mod ${ty} = ${prevTx}. Reduce tx.`,
          variables: { tx, ty, prevTx },
          visualization: {
            type: 'array',
            array: [tx, ty],
            highlights: { 0: 'active' },
            labels: { 0: `${tx}->${prevTx}`, 1: String(ty) },
          } as ArrayVisualization,
        });
        tx = prevTx;
        path.push([tx, ty]);
      } else {
        if (tx === sx) {
          result = (ty - sy) % tx === 0;
          steps.push({
            line: 8,
            explanation: `ty >= tx and tx == sx. Check if (ty - sy) % tx == 0: (${ty} - ${sy}) % ${tx} = ${(ty - sy) % tx}. Result = ${result}.`,
            variables: { tx, ty, sx, sy, check: (ty - sy) % tx, result },
            visualization: {
              type: 'array',
              array: [tx, ty],
              highlights: { 0: 'active', 1: result ? 'found' : 'mismatch' },
              labels: { 0: String(tx), 1: String(ty) },
            } as ArrayVisualization,
          });
          break;
        }
        const prevTy = ty % tx;
        steps.push({
          line: 9,
          explanation: `ty (${ty}) >= tx (${tx}). Previous ty was ty mod tx = ${ty} mod ${tx} = ${prevTy}. Reduce ty.`,
          variables: { tx, ty, prevTy },
          visualization: {
            type: 'array',
            array: [tx, ty],
            highlights: { 1: 'active' },
            labels: { 0: String(tx), 1: `${ty}->${prevTy}` },
          } as ArrayVisualization,
        });
        ty = prevTy;
        path.push([tx, ty]);
      }
    }

    if (tx < sx || ty < sy) {
      steps.push({
        line: 10,
        explanation: `(${tx}, ${ty}) went below start bounds (${sx}, ${sy}). Return false.`,
        variables: { tx, ty, sx, sy, result: false },
        visualization: {
          type: 'array',
          array: [tx, ty],
          highlights: { 0: 'mismatch', 1: 'mismatch' },
          labels: { 0: String(tx), 1: String(ty) },
        } as ArrayVisualization,
      });
    }

    steps.push({
      line: 11,
      explanation: `Final result: (${sx}, ${sy}) ${result ? 'CAN' : 'CANNOT'} reach (${input.tx}, ${input.ty}).`,
      variables: { result },
      visualization: {
        type: 'array',
        array: [sx, sy, input.tx as number, input.ty as number],
        highlights: { 0: result ? 'found' : 'mismatch', 1: result ? 'found' : 'mismatch', 2: result ? 'found' : 'mismatch', 3: result ? 'found' : 'mismatch' },
        labels: { 0: `sx`, 1: `sy`, 2: `tx`, 3: `ty` },
      } as ArrayVisualization,
    });

    return steps;
  },
};

export default reachingPoints;
