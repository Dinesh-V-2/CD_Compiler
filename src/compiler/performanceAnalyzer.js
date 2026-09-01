export function analyzePerformance(originalTAC, optimizedTAC, optimizationLogs, parseTimeMs, optTimeMs) {
  const origCount = originalTAC.length;
  const optCount = optimizedTAC.length;
  const removed = Math.max(0, origCount - optCount);

  const reductionPercentage = origCount > 0 
    ? parseFloat((((origCount - optCount) / origCount) * 100).toFixed(2))
    : 0;

  // Breakdown by optimization technique
  let cfSavings = 0;
  let cseSavings = 0;
  let dceSavings = 0;

  optimizationLogs.forEach(log => {
    if (log.technique === 'Constant Folding' || log.technique === 'Algebraic Simplification') {
      cfSavings += log.instructionsSaved || 0;
    } else if (log.technique === 'Common Subexpression Elimination') {
      cseSavings += log.instructionsSaved || 1;
    } else if (log.technique === 'Dead Code Elimination') {
      dceSavings += log.instructionsSaved || 1;
    }
  });

  return {
    originalInstructionCount: origCount,
    optimizedInstructionCount: optCount,
    instructionsRemoved: removed,
    reductionPercentage: Math.max(0, reductionPercentage),
    breakdown: {
      constantFolding: cfSavings,
      commonSubexpression: cseSavings,
      deadCodeElimination: dceSavings
    },
    timing: {
      parseTimeMs: parseFloat(parseTimeMs.toFixed(3)),
      optTimeMs: parseFloat(optTimeMs.toFixed(3)),
      totalTimeMs: parseFloat((parseTimeMs + optTimeMs).toFixed(3))
    }
  };
}
