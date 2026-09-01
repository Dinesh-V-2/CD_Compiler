export function performConstantFolding(tacInstructions) {
  let instructions = tacInstructions.map(inst => ({ ...inst }));
  const logs = [];
  const constantMap = new Map(); // tracks variable/temp -> numeric value
  let changed = true;

  function evaluate(op, val1, val2) {
    const num1 = parseFloat(val1);
    const num2 = parseFloat(val2);

    switch (op) {
      case '+': return num1 + num2;
      case '-': return num1 - num2;
      case '*': return num1 * num2;
      case '/': return num2 !== 0 ? num1 / num2 : null;
      case '%': return num2 !== 0 ? num1 % num2 : null;
      case '^': return Math.pow(num1, num2);
      default: return null;
    }
  }

  function isNumeric(val) {
    return val !== '' && val !== null && val !== undefined && !isNaN(Number(val));
  }

  while (changed) {
    changed = false;
    const nextInstructions = [];

    for (let i = 0; i < instructions.length; i++) {
      let inst = { ...instructions[i] };
      const originalText = inst.text;

      // Substitute known constants in arg1
      if (constantMap.has(inst.arg1)) {
        inst.arg1 = String(constantMap.get(inst.arg1));
      }
      // Substitute known constants in arg2
      if (constantMap.has(inst.arg2)) {
        inst.arg2 = String(constantMap.get(inst.arg2));
      }

      // Check for constant binary evaluation
      if (inst.op !== '=' && isNumeric(inst.arg1) && isNumeric(inst.arg2)) {
        const foldedVal = evaluate(inst.op, inst.arg1, inst.arg2);
        if (foldedVal !== null) {
          const formattedVal = Number.isInteger(foldedVal) ? String(foldedVal) : String(Number(foldedVal.toFixed(6)));
          inst.op = '=';
          inst.arg1 = formattedVal;
          inst.arg2 = '';
          inst.text = `${inst.result} = ${formattedVal}`;

          constantMap.set(inst.result, parseFloat(formattedVal));
          changed = true;

          logs.push({
            technique: 'Constant Folding',
            pattern: `${inst.arg1} ${inst.op} ${inst.arg2}`,
            original: originalText,
            optimized: inst.text,
            instructionsSaved: 0,
            explanation: `Evaluated constant expression directly to '${formattedVal}'`
          });
        }
      }

      // Check for algebraic identities (x + 0, x * 1, x * 0, x ^ 0, x ^ 1)
      if (inst.op !== '=') {
        let simplifiedVal = null;
        let explanation = '';

        if (inst.op === '+' && inst.arg2 === '0') {
          simplifiedVal = inst.arg1;
          explanation = `Identity addition by 0 simplified to '${inst.arg1}'`;
        } else if (inst.op === '+' && inst.arg1 === '0') {
          simplifiedVal = inst.arg2;
          explanation = `Identity addition by 0 simplified to '${inst.arg2}'`;
        } else if (inst.op === '-' && inst.arg2 === '0') {
          simplifiedVal = inst.arg1;
          explanation = `Identity subtraction by 0 simplified to '${inst.arg1}'`;
        } else if (inst.op === '*' && inst.arg2 === '1') {
          simplifiedVal = inst.arg1;
          explanation = `Identity multiplication by 1 simplified to '${inst.arg1}'`;
        } else if (inst.op === '*' && inst.arg1 === '1') {
          simplifiedVal = inst.arg2;
          explanation = `Identity multiplication by 1 simplified to '${inst.arg2}'`;
        } else if (inst.op === '*' && (inst.arg1 === '0' || inst.arg2 === '0')) {
          simplifiedVal = '0';
          explanation = `Multiplication by 0 simplified to '0'`;
        } else if (inst.op === '/' && inst.arg2 === '1') {
          simplifiedVal = inst.arg1;
          explanation = `Identity division by 1 simplified to '${inst.arg1}'`;
        } else if (inst.op === '^' && inst.arg2 === '1') {
          simplifiedVal = inst.arg1;
          explanation = `Exponentiation to power 1 simplified to '${inst.arg1}'`;
        } else if (inst.op === '^' && inst.arg2 === '0') {
          simplifiedVal = '1';
          explanation = `Exponentiation to power 0 simplified to '1'`;
        }

        if (simplifiedVal !== null) {
          inst.op = '=';
          inst.arg1 = simplifiedVal;
          inst.arg2 = '';
          inst.text = `${inst.result} = ${simplifiedVal}`;
          if (isNumeric(simplifiedVal)) {
            constantMap.set(inst.result, parseFloat(simplifiedVal));
          }
          changed = true;

          logs.push({
            technique: 'Algebraic Simplification',
            pattern: `${inst.arg1} ${inst.op} ${inst.arg2}`,
            original: originalText,
            optimized: inst.text,
            instructionsSaved: 0,
            explanation
          });
        }
      }

      // Check if assignment of a constant
      if (inst.op === '=' && isNumeric(inst.arg1)) {
        constantMap.set(inst.result, parseFloat(inst.arg1));
      } else if (inst.op === '=') {
        // If assigned variable is reassigned a non-constant, remove from constant map
        constantMap.delete(inst.result);
      }

      // Re-generate text
      if (inst.op === '=') {
        inst.text = `${inst.result} = ${inst.arg1}`;
      } else if (!inst.arg2) {
        inst.text = `${inst.result} = ${inst.op}${inst.arg1}`;
      } else {
        inst.text = `${inst.result} = ${inst.arg1} ${inst.op} ${inst.arg2}`;
      }

      nextInstructions.push(inst);
    }

    instructions = nextInstructions;
  }

  return { instructions, logs };
}
