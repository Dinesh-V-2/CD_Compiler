export function performDeadCodeElimination(tacInstructions) {
  let instructions = tacInstructions.map(inst => ({ ...inst }));
  const logs = [];
  let changed = true;

  while (changed) {
    changed = false;

    // Collect all variables/temporaries that are READ (used as arg1 or arg2) in the current instruction set
    const usedVariables = new Set();
    instructions.forEach(inst => {
      if (inst.arg1 && isNaN(Number(inst.arg1))) {
        usedVariables.add(inst.arg1);
      }
      if (inst.arg2 && isNaN(Number(inst.arg2))) {
        usedVariables.add(inst.arg2);
      }
    });

    const nextInstructions = [];

    for (let i = 0; i < instructions.length; i++) {
      const inst = instructions[i];

      // The final statement's result variable is considered the program's primary return value
      const isFinalStatement = (i === instructions.length - 1);
      const isTemp = /^t\d+$/.test(inst.result);
      
      // If it's not read anywhere AND it's not the final statement output
      if (!usedVariables.has(inst.result) && !isFinalStatement) {
        changed = true;
        const targetType = isTemp ? 'temporary' : 'variable assignment';
        logs.push({
          technique: 'Dead Code Elimination',
          pattern: `Dead ${targetType} ${inst.result}`,
          original: inst.text,
          optimized: '[REMOVED]',
          instructionsSaved: 1,
          explanation: `Eliminated unused ${targetType} '${inst.text}' as '${inst.result}' is never read in subsequent computations.`
        });
        continue; // Skip/eliminate this instruction
      }

      nextInstructions.push(inst);
    }

    instructions = nextInstructions;
  }

  // Renumber instruction indices for clean TAC ordering
  instructions = instructions.map((inst, idx) => ({
    ...inst,
    id: idx + 1,
    index: idx
  }));

  return { instructions, logs };
}
