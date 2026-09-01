import { describe, it, expect } from 'vitest';
import { lex } from '../src/compiler/lexer.js';
import { parse } from '../src/compiler/parser.js';
import { generateTAC } from '../src/compiler/tacGenerator.js';
import { generateQuadruples } from '../src/compiler/quadrupleGenerator.js';
import { generateTriples } from '../src/compiler/tripleGenerator.js';

describe('TAC, Quadruples & Triples Engine Tests', () => {
  it('generates valid TAC for x = a + b * c', () => {
    const tokens = lex('x = a + b * c');
    const ast = parse(tokens);
    const tac = generateTAC(ast);

    expect(tac.length).toBeGreaterThanOrEqual(2);
    expect(tac[0].op).toBe('*');
    expect(tac[0].arg1).toBe('b');
    expect(tac[0].arg2).toBe('c');
    expect(tac[0].result).toBe('t1');

    expect(tac[1].op).toBe('+');
    expect(tac[1].arg1).toBe('a');
    expect(tac[1].arg2).toBe('t1');
  });

  it('generates matching Quadruples and Triples', () => {
    const tokens = lex('x = a + b');
    const ast = parse(tokens);
    const tac = generateTAC(ast);
    const quads = generateQuadruples(tac);
    const triples = generateTriples(tac);

    expect(quads).toHaveLength(tac.length);
    expect(triples).toHaveLength(tac.length);
    expect(quads[0].op).toBe('+');
    expect(triples[0].op).toBe('+');
  });
});
