import { performConstantFolding } from './constantFolding.js';
import { performCommonSubexpressionElimination } from './commonSubexpression.js';
import { performDeadCodeElimination } from './deadCodeElimination.js';
import { generateQuadruples } from './quadrupleGenerator.js';
import { generateTriples } from './tripleGenerator.js';

export function optimizeTAC(tacInstructions, options = {}) {
  const {
    constantFolding = true,
    commonSubexpression = true,
    deadCodeElimination = true
  } = options;

  let currentTAC = tacInstructions.map(inst => ({ ...inst }));
  const allLogs = [];

  // Pass 1: Constant Folding & Algebraic Simplification
  if (constantFolding) {
    const cfResult = performConstantFolding(currentTAC);
    currentTAC = cfResult.instructions;
    allLogs.push(...cfResult.logs);
  }

  // Pass 2: Common Subexpression Elimination
  if (commonSubexpression) {
    const cseResult = performCommonSubexpressionElimination(currentTAC);
    currentTAC = cseResult.instructions;
    allLogs.push(...cseResult.logs);
  }

  // Pass 3: Dead Code Elimination
  if (deadCodeElimination) {
    const dceResult = performDeadCodeElimination(currentTAC);
    currentTAC = dceResult.instructions;
    allLogs.push(...dceResult.logs);
  }

  // Final re-indexing of TAC instructions
  const optimizedTAC = currentTAC.map((inst, idx) => ({
    ...inst,
    id: idx + 1,
    index: idx
  }));

  // Regenerate Quadruples and Triples directly from optimized TAC
  const optimizedQuadruples = generateQuadruples(optimizedTAC);
  const optimizedTriples = generateTriples(optimizedTAC);

  return {
    optimizedTAC,
    optimizedQuadruples,
    optimizedTriples,
    logs: allLogs,
    instructionsSaved: tacInstructions.length - optimizedTAC.length
  };
}
