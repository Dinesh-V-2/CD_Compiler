export function performCommonSubexpressionElimination(tacInstructions) {
  let instructions = tacInstructions.map(inst => ({ ...inst }));
  const logs = [];
  const availableSubexpressions = new Map(); // expressionKey -> temporary variable name
  const resultToExprKey = new Map(); // temp/var -> expressionKey
  const finalInstructions = [];

  function getExprKey(op, arg1, arg2) {
    if (op === '=') return null;
    // For commutative operations +, *, sort operands to catch commutative CSE (e.g., a+b and b+a)
    if (op === '+' || op === '*') {
      const sortedArgs = [arg1, arg2].sort();
      return `${op}:${sortedArgs[0]}:${sortedArgs[1]}`;
    }
    return `${op}:${arg1}:${arg2}`;
  }

  for (let i = 0; i < instructions.length; i++) {
    const inst = { ...instructions[i] };
    const originalText = inst.text;

    // Check if this instruction computes an expression
    if (inst.op !== '=') {
      const exprKey = getExprKey(inst.op, inst.arg1, inst.arg2);

      if (availableSubexpressions.has(exprKey)) {
        // Common Subexpression Found!
        const previousTemp = availableSubexpressions.get(exprKey);
        
        // Transform current instruction into simple assignment from previousTemp
        const oldOp = inst.op;
        const oldArg1 = inst.arg1;
        const oldArg2 = inst.arg2;

        inst.op = '=';
        inst.arg1 = previousTemp;
        inst.arg2 = '';
        inst.text = `${inst.result} = ${previousTemp}`;

        logs.push({
          technique: 'Common Subexpression Elimination',
          pattern: `${oldArg1} ${oldOp} ${oldArg2}`,
          original: originalText,
          optimized: inst.text,
          instructionsSaved: 1,
          explanation: `Reused previously computed subexpression '${previousTemp}' for '${oldArg1} ${oldOp} ${oldArg2}'`
        });
      } else {
        // Save this new subexpression for future reuse
        availableSubexpressions.set(exprKey, inst.result);
        resultToExprKey.set(inst.result, exprKey);
      }
    } else {
      // If assignment (e.g., x = ...), check if variable being assigned invalidates any stored subexpressions
      // Any subexpression using inst.result as an operand must be invalidated
      for (const [key, temp] of availableSubexpressions.entries()) {
        const parts = key.split(':');
        if (parts[1] === inst.result || parts[2] === inst.result) {
          availableSubexpressions.delete(key);
        }
      }
    }

    finalInstructions.push(inst);
  }

  return { instructions: finalInstructions, logs };
}
