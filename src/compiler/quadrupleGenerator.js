export function generateQuadruples(tacInstructions) {
  return tacInstructions.map((inst, idx) => {
    let op = inst.op;
    let arg1 = inst.arg1;
    let arg2 = inst.arg2;
    let result = inst.result;

    if (op === '=') {
      // Quadruple format for assignment: op = '=', arg1 = val, arg2 = '', result = target
      arg1 = inst.arg1;
      arg2 = '';
    }

    return {
      index: idx + 1,
      op,
      arg1: arg1 !== null && arg1 !== undefined ? String(arg1) : '',
      arg2: arg2 !== null && arg2 !== undefined ? String(arg2) : '',
      result: String(result)
    };
  });
}
