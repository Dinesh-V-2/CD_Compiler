import { describe, it, expect } from 'vitest';
import { lex } from '../src/compiler/lexer.js';
import { parse } from '../src/compiler/parser.js';
import { generateTAC } from '../src/compiler/tacGenerator.js';
import { optimizeTAC } from '../src/compiler/optimizer.js';

describe('Optimization Engine Tests', () => {
  it('performs Constant Folding: x = (10 * 20) + (5 * 4)', () => {
    const tokens = lex('x = (10 * 20) + (5 * 4)');
    const ast = parse(tokens);
    const tac = generateTAC(ast);
    const result = optimizeTAC(tac, { constantFolding: true, commonSubexpression: false, deadCodeElimination: true });

    // Should evaluate 10 * 20 -> 200, 5 * 4 -> 20, 200 + 20 -> 220
    const finalInst = result.optimizedTAC.find(i => i.result === 'x');
    expect(finalInst).toBeDefined();
    expect(finalInst.arg1).toBe('220');
  });

  it('performs Common Subexpression Elimination: x = (a + b) * (a + b)', () => {
    const tokens = lex('x = (a + b) * (a + b)');
    const ast = parse(tokens);
    const tac = generateTAC(ast);
    const result = optimizeTAC(tac, { constantFolding: true, commonSubexpression: true, deadCodeElimination: false });

    // Should detect repeated (a + b)
    const cseLog = result.logs.find(l => l.technique === 'Common Subexpression Elimination');
    expect(cseLog).toBeDefined();
  });

  it('performs Dead Code Elimination: y = c * d when unused', () => {
    const tokens = lex('x = a + b\ny = c * d\nz = x + 10');
    const ast = parse(tokens);
    const tac = generateTAC(ast);
    const result = optimizeTAC(tac, { constantFolding: false, commonSubexpression: false, deadCodeElimination: true });

    // y = c * d should be eliminated
    const yAssignment = result.optimizedTAC.find(i => i.result === 'y');
    expect(yAssignment).toBeUndefined();
  });
});
