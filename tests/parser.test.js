import { describe, it, expect } from 'vitest';
import { lex } from '../src/compiler/lexer.js';
import { parse, SyntaxError } from '../src/compiler/parser.js';

describe('Parser Engine Tests', () => {
  it('enforces operator precedence: x = a + b * c', () => {
    const tokens = lex('x = a + b * c');
    const ast = parse(tokens);
    const stmt = ast.statements[0];
    
    expect(stmt.type).toBe('Assignment');
    expect(stmt.target).toBe('x');
    // Top operator should be + because * has higher precedence
    expect(stmt.expression.type).toBe('BinaryOp');
    expect(stmt.expression.op).toBe('+');
    expect(stmt.expression.right.op).toBe('*');
  });

  it('respects parentheses precedence: x = (a + b) * c', () => {
    const tokens = lex('x = (a + b) * c');
    const ast = parse(tokens);
    const stmt = ast.statements[0];
    
    // Top operator should be *
    expect(stmt.expression.type).toBe('BinaryOp');
    expect(stmt.expression.op).toBe('*');
    expect(stmt.expression.left.op).toBe('+');
  });

  it('handles right-associative exponentiation: x = a ^ b ^ c', () => {
    const tokens = lex('x = a ^ b ^ c');
    const ast = parse(tokens);
    const stmt = ast.statements[0];

    expect(stmt.expression.op).toBe('^');
    expect(stmt.expression.right.op).toBe('^');
  });

  it('throws SyntaxError for missing operand: x = a + * b', () => {
    const tokens = lex('x = a + * b');
    expect(() => parse(tokens)).toThrow(SyntaxError);
  });
});
