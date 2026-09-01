export class ASTNode {
  constructor(type) {
    this.type = type;
  }
}

export class ProgramNode extends ASTNode {
  constructor(statements = []) {
    super('Program');
    this.statements = statements;
  }
}

export class AssignmentNode extends ASTNode {
  constructor(target, expression) {
    super('Assignment');
    this.target = target;
    this.expression = expression;
  }
}

export class BinaryOpNode extends ASTNode {
  constructor(op, left, right) {
    super('BinaryOp');
    this.op = op;
    this.left = left;
    this.right = right;
  }
}

export class UnaryOpNode extends ASTNode {
  constructor(op, operand) {
    super('UnaryOp');
    this.op = op;
    this.operand = operand;
  }
}

export class IdentifierNode extends ASTNode {
  constructor(name) {
    super('Identifier');
    this.name = name;
  }
}

export class NumberNode extends ASTNode {
  constructor(value, raw = null) {
    super('Number');
    this.value = typeof value === 'number' ? value : parseFloat(value);
    this.raw = raw || String(value);
  }
}

/**
 * Returns a structural string signature of an AST node for structural comparison (CSE).
 */
export function getASTSignature(node) {
  if (!node) return '';
  switch (node.type) {
    case 'Number':
      return `${node.value}`;
    case 'Identifier':
      return `${node.name}`;
    case 'UnaryOp':
      return `(${node.op}${getASTSignature(node.operand)})`;
    case 'BinaryOp':
      return `(${getASTSignature(node.left)} ${node.op} ${getASTSignature(node.right)})`;
    case 'Assignment':
      return `${node.target} = ${getASTSignature(node.expression)}`;
    case 'Program':
      return node.statements.map(getASTSignature).join(';\n');
    default:
      return '';
  }
}

/**
 * Deep clones an AST node.
 */
export function cloneAST(node) {
  if (!node) return null;
  switch (node.type) {
    case 'Number':
      return new NumberNode(node.value, node.raw);
    case 'Identifier':
      return new IdentifierNode(node.name);
    case 'UnaryOp':
      return new UnaryOpNode(node.op, cloneAST(node.operand));
    case 'BinaryOp':
      return new BinaryOpNode(node.op, cloneAST(node.left), cloneAST(node.right));
    case 'Assignment':
      return new AssignmentNode(node.target, cloneAST(node.expression));
    case 'Program':
      return new ProgramNode(node.statements.map(cloneAST));
    default:
      return null;
  }
}

/**
 * Converts AST node to clean display format / hierarchy object for UI Tree rendering.
 */
export function formatASTForTree(node, idPrefix = 'node') {
  if (!node) return null;

  let counter = 0;
  function traverse(n, parentId = null) {
    const currentId = `${idPrefix}_${counter++}`;
    let label = '';
    let details = '';

    switch (n.type) {
      case 'Program':
        label = 'Program';
        details = `${n.statements.length} Statement(s)`;
        break;
      case 'Assignment':
        label = `= (${n.target})`;
        details = `Target: ${n.target}`;
        break;
      case 'BinaryOp':
        label = `Op: ${n.op}`;
        details = `Operator: ${n.op}`;
        break;
      case 'UnaryOp':
        label = `Unary: ${n.op}`;
        details = `Unary Operator: ${n.op}`;
        break;
      case 'Identifier':
        label = `Var: ${n.name}`;
        details = `Identifier: ${n.name}`;
        break;
      case 'Number':
        label = `Num: ${n.value}`;
        details = `Value: ${n.value}`;
        break;
      default:
        label = n.type;
    }

    const nodeItem = {
      id: currentId,
      type: n.type,
      label,
      details,
      rawNode: n,
      children: []
    };

    if (n.type === 'Program') {
      nodeItem.children = n.statements.map(s => traverse(s, currentId));
    } else if (n.type === 'Assignment') {
      nodeItem.children = [traverse(n.expression, currentId)];
    } else if (n.type === 'BinaryOp') {
      nodeItem.children = [traverse(n.left, currentId), traverse(n.right, currentId)];
    } else if (n.type === 'UnaryOp') {
      nodeItem.children = [traverse(n.operand, currentId)];
    }

    return nodeItem;
  }

  return traverse(node);
}
