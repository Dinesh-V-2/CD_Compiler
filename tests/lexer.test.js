import { describe, it, expect } from 'vitest';
import { lex, TokenType, LexicalError } from '../src/compiler/lexer.js';

describe('Lexer Engine Tests', () => {
  it('tokenizes simple expression: x = a + 10', () => {
    const input = 'x = a + 10';
    const tokens = lex(input);
    expect(tokens).toHaveLength(6); // x, =, a, +, 10, EOF
    expect(tokens[0].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[0].lexeme).toBe('x');
    expect(tokens[1].type).toBe(TokenType.ASSIGN);
    expect(tokens[2].type).toBe(TokenType.IDENTIFIER);
    expect(tokens[2].lexeme).toBe('a');
    expect(tokens[3].type).toBe(TokenType.PLUS);
    expect(tokens[4].type).toBe(TokenType.NUMBER);
    expect(tokens[4].value).toBe(10);
  });

  it('tokenizes floating numbers and exponentiation operator', () => {
    const input = 'y = (25.5 * rate) ^ 2';
    const tokens = lex(input);
    expect(tokens.find(t => t.lexeme === '25.5').value).toBe(25.5);
    expect(tokens.find(t => t.type === TokenType.POWER)).toBeDefined();
  });

  it('throws LexicalError for invalid character @', () => {
    expect(() => lex('x = a + @')).toThrow(LexicalError);
  });
});
