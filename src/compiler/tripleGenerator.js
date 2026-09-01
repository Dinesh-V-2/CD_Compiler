export function generateTriples(tacInstructions) {
  // Map temporary variable names or results to their generating triple index reference e.g., 't1' -> '(0)'
  const tempToTripleRef = new Map();

  return tacInstructions.map((inst, idx) => {
    let arg1 = inst.arg1;
    let arg2 = inst.arg2;

    // Substitute arg1 if it references a previous triple result
    if (tempToTripleRef.has(arg1)) {
      arg1 = tempToTripleRef.get(arg1);
    }

    // Substitute arg2 if it references a previous triple result
    if (tempToTripleRef.has(arg2)) {
      arg2 = tempToTripleRef.get(arg2);
    }

    const currentRef = `(${idx})`;

    // If result is a temporary variable (like t1, t2), map it to this triple reference
    if (/^t\d+$/.test(inst.result)) {
      tempToTripleRef.set(inst.result, currentRef);
    }

    return {
      index: idx,
      op: inst.op,
      arg1: arg1 !== null && arg1 !== undefined ? String(arg1) : '',
      arg2: arg2 !== null && arg2 !== undefined ? String(arg2) : '',
      resultRef: currentRef,
      targetVar: inst.op === '=' ? inst.result : ''
    };
  });
}
