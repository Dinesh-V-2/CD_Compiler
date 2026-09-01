import { describe, it, expect } from 'vitest';
import { runFullCompilation } from '../src/services/compilerService.js';

describe('Acceptance Criteria & End-to-End Pipeline Tests', () => {
  it('executes Acceptance Test 1: x = (a + b) * (a + b) + (10 * 20)', () => {
    const input = 'x = (a + b) * (a + b) + (10 * 20)';
    const result = runFullCompilation(input, {
      optimize: true,
      optimizationSettings: {
        constantFolding: true,
        commonSubexpression: true,
        deadCodeElimination: true
      }
    });

    expect(result.success).toBe(true);
    expect(result.tokens.length).toBeGreaterThan(0);
    expect(result.ast).not.toBeNull();
    expect(result.tac.length).toBeGreaterThan(0);
    expect(result.quadruples.length).toBe(result.tac.length);
    expect(result.triples.length).toBe(result.tac.length);

    // Verify Constant Folding detected 10 * 20
    const cfLog = result.optimizationResult.logs.find(l => l.technique === 'Constant Folding');
    expect(cfLog).toBeDefined();

    // Verify CSE detected repeated (a + b)
    const cseLog = result.optimizationResult.logs.find(l => l.technique === 'Common Subexpression Elimination');
    expect(cseLog).toBeDefined();

    // Verify Performance Metrics
    expect(result.performanceMetrics.originalInstructionCount).toBeGreaterThan(0);
    expect(result.performanceMetrics.optimizedInstructionCount).toBeLessThan(result.performanceMetrics.originalInstructionCount);
    expect(result.performanceMetrics.reductionPercentage).toBeGreaterThan(0);
  });

  it('executes Acceptance Test 2: result = ((a + b) * c) + ((a + b) * d)', () => {
    const input = 'result = ((a + b) * c) + ((a + b) * d)';
    const result = runFullCompilation(input, {
      optimize: true,
      optimizationSettings: {
        constantFolding: true,
        commonSubexpression: true,
        deadCodeElimination: true
      }
    });

    expect(result.success).toBe(true);
    const cseLog = result.optimizationResult.logs.find(l => l.technique === 'Common Subexpression Elimination');
    expect(cseLog).toBeDefined();
  });

  it('executes Default Complex Expression: finalValue = ((principal * rate * time) / 100) + (principal * (1 + rate/100)^time) - fees', () => {
    const input = 'finalValue = ((principal * rate * time) / 100) + (principal * (1 + rate/100)^time) - fees';
    const result = runFullCompilation(input, {
      optimize: true,
      optimizationSettings: {
        constantFolding: true,
        commonSubexpression: true,
        deadCodeElimination: true
      }
    });

    expect(result.success).toBe(true);
    expect(result.optimizationResult.optimizedTAC.length).toBeGreaterThan(0);
  });
});
