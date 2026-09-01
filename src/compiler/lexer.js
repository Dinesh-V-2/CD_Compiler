export class LexicalError extends Error {
  constructor(message, line, column, position) {
    super(message);
    this.name = 'LexicalError';
    this.line = line;
    this.column = column;
    this.position = position;
  }
}

export const TokenType = {
  IDENTIFIER: 'IDENTIFIER',
  NUMBER: 'NUMBER',
  ASSIGN: 'ASSIGN',
  PLUS: 'PLUS',
  MINUS: 'MINUS',
  MULTIPLY: 'MULTIPLY',
  DIVIDE: 'DIVIDE',
  MODULO: 'MODULO',
  POWER: 'POWER',
  LPAREN: 'LPAREN',
  RPAREN: 'RPAREN',
  SEMI: 'SEMI',
  EOF: 'EOF'
};

export function lex(input) {
  const tokens = [];
  let i = 0;
  let line = 1;
  let column = 1;

  while (i < input.length) {
    const char = input[i];

    // Handle spaces and tabs
    if (char === ' ' || char === '\t' || char === '\r') {
      i++;
      column++;
      continue;
    }

    // Handle newline (statement separator)
    if (char === '\n') {
      tokens.push({
        id: tokens.length + 1,
        type: TokenType.SEMI,
        lexeme: '\\n',
        line,
        column,
        position: i
      });
      i++;
      line++;
      column = 1;
      continue;
    }

    // Handle semicolon
    if (char === ';') {
      tokens.push({
        id: tokens.length + 1,
        type: TokenType.SEMI,
        lexeme: ';',
        line,
        column,
        position: i
      });
      i++;
      column++;
      continue;
    }

    // Identifiers (alpha or _)
    if (/[a-zA-Z_]/.test(char)) {
      let lexeme = '';
      const startCol = column;
      const startPos = i;

      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        lexeme += input[i];
        i++;
        column++;
      }

      tokens.push({
        id: tokens.length + 1,
        type: TokenType.IDENTIFIER,
        lexeme,
        value: lexeme,
        line,
        column: startCol,
        position: startPos
      });
      continue;
    }

    // Numbers (integers or decimals)
    if (/[0-9]/.test(char)) {
      let lexeme = '';
      const startCol = column;
      const startPos = i;
      let hasDot = false;

      while (i < input.length && (/[0-9]/.test(input[i]) || input[i] === '.')) {
        if (input[i] === '.') {
          if (hasDot) {
            throw new LexicalError(
              `Invalid number format with multiple decimal points '${lexeme + '.'}'`,
              line,
              column,
              i
            );
          }
          hasDot = true;
        }
        lexeme += input[i];
        i++;
        column++;
      }

      if (lexeme.endsWith('.')) {
        throw new LexicalError(
          `Invalid number format ending with decimal point '${lexeme}'`,
          line,
          startCol,
          startPos
        );
      }

      tokens.push({
        id: tokens.length + 1,
        type: TokenType.NUMBER,
        lexeme,
        value: parseFloat(lexeme),
        line,
        column: startCol,
        position: startPos
      });
      continue;
    }

    // Operators & Delimiters
    const singleOps = {
      '=': TokenType.ASSIGN,
      '+': TokenType.PLUS,
      '-': TokenType.MINUS,
      '*': TokenType.MULTIPLY,
      '/': TokenType.DIVIDE,
      '%': TokenType.MODULO,
      '^': TokenType.POWER,
      '(': TokenType.LPAREN,
      ')': TokenType.RPAREN
    };

    if (singleOps[char]) {
      tokens.push({
        id: tokens.length + 1,
        type: singleOps[char],
        lexeme: char,
        value: char,
        line,
        column,
        position: i
      });
      i++;
      column++;
      continue;
    }

    // Invalid character error
    throw new LexicalError(
      `Invalid character '${char}'`,
      line,
      column,
      i
    );
  }

  // Add EOF token
  tokens.push({
    id: tokens.length + 1,
    type: TokenType.EOF,
    lexeme: 'EOF',
    line,
    column,
    position: i
  });

  return tokens;
}
