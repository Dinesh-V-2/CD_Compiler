import { TokenType } from './lexer.js';
import {
  ProgramNode,
  AssignmentNode,
  BinaryOpNode,
  UnaryOpNode,
  IdentifierNode,
  NumberNode
} from './ast.js';

export class SyntaxError extends Error {
  constructor(message, line, column, expected = [], token = null) {
    super(message);
    this.name = 'SyntaxError';
    this.line = line;
    this.column = column;
    this.expected = expected;
    this.token = token;
  }
}

export class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  peek() {
    return this.tokens[this.current] || this.tokens[this.tokens.length - 1];
  }

  previous() {
    return this.tokens[this.current - 1];
  }

  isAtEnd() {
    return this.peek().type === TokenType.EOF;
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  check(type) {
    if (this.isAtEnd()) return type === TokenType.EOF;
    return this.peek().type === type;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  consume(type, errorMessage, expectedList = []) {
    if (this.check(type)) return this.advance();
    const token = this.peek();
    throw new SyntaxError(
      errorMessage || `Expected '${type}' but found '${token.lexeme}'`,
      token.line,
      token.column,
      expectedList,
      token
    );
  }

  parse() {
    const statements = [];

    while (!this.isAtEnd()) {
      // Skip empty semicolons/newlines
      if (this.match(TokenType.SEMI)) {
        continue;
      }

      statements.push(this.statement());

      // Optional statement separator after statement
      if (this.check(TokenType.SEMI)) {
        this.advance();
      }
    }

    if (statements.length === 0) {
      throw new SyntaxError('Empty source expression', 1, 1, ['Expression']);
    }

    return new ProgramNode(statements);
  }

  statement() {
    // Check if assignment: IDENTIFIER = expression
    if (this.check(TokenType.IDENTIFIER) && this.tokens[this.current + 1]?.type === TokenType.ASSIGN) {
      const targetToken = this.advance(); // consume identifier
      this.advance(); // consume =
      const expr = this.expression();
      return new AssignmentNode(targetToken.value, expr);
    }

    // Otherwise, treat as an expression statement (default target will be assigned or evaluated)
    const expr = this.expression();
    return expr;
  }

  expression() {
    return this.additive();
  }

  additive() {
    let expr = this.multiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous().lexeme;
      const right = this.multiplicative();
      expr = new BinaryOpNode(operator, expr, right);
    }

    return expr;
  }

  multiplicative() {
    let expr = this.power();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous().lexeme;
      const right = this.power();
      expr = new BinaryOpNode(operator, expr, right);
    }

    return expr;
  }

  power() {
    let expr = this.unary();

    if (this.match(TokenType.POWER)) {
      const operator = this.previous().lexeme;
      // Exponentiation is right-associative: a ^ b ^ c -> a ^ (b ^ c)
      const right = this.power();
      expr = new BinaryOpNode(operator, expr, right);
    }

    return expr;
  }

  unary() {
    if (this.match(TokenType.MINUS, TokenType.PLUS)) {
      const operator = this.previous().lexeme;
      const operand = this.unary();
      return new UnaryOpNode(operator, operand);
    }

    return this.factor();
  }

  factor() {
    const token = this.peek();

    if (this.match(TokenType.NUMBER)) {
      return new NumberNode(this.previous().value, this.previous().lexeme);
    }

    if (this.match(TokenType.IDENTIFIER)) {
      return new IdentifierNode(this.previous().value);
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(
        TokenType.RPAREN,
        `Missing closing ')' after expression. Found '${this.peek().lexeme}'`,
        [')']
      );
      return expr;
    }

    // Syntax Errors
    if (token.type === TokenType.PLUS || token.type === TokenType.MULTIPLY || 
        token.type === TokenType.DIVIDE || token.type === TokenType.MODULO || 
        token.type === TokenType.POWER || token.type === TokenType.ASSIGN) {
      throw new SyntaxError(
        `Unexpected operator '${token.lexeme}'`,
        token.line,
        token.column,
        ['Identifier', 'Number', '('],
        token
      );
    }

    if (token.type === TokenType.RPAREN) {
      throw new SyntaxError(
        `Unexpected closing parenthesis ')'`,
        token.line,
        token.column,
        ['Identifier', 'Number', '('],
        token
      );
    }

    if (token.type === TokenType.EOF) {
      throw new SyntaxError(
        `Unexpected end of input, missing operand`,
        token.line,
        token.column,
        ['Identifier', 'Number', '('],
        token
      );
    }

    throw new SyntaxError(
      `Unexpected token '${token.lexeme}'`,
      token.line,
      token.column,
      ['Identifier', 'Number', '('],
      token
    );
  }
}

export function parse(tokens) {
  const parser = new Parser(tokens);
  return parser.parse();
}
