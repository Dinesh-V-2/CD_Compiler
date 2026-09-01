export function generateTAC(astNode) {
  const instructions = [];
  let tempCounter = 1;

  function newTemp() {
    return `t${tempCounter++}`;
  }

  function emit(op, arg1, arg2, result, type = 'compute') {
    let text = '';
    if (op === '=') {
      text = `${result} = ${arg1}`;
    } else if (arg2 === null || arg2 === undefined) {
      text = `${result} = ${op}${arg1}`;
    } else {
      text = `${result} = ${arg1} ${op} ${arg2}`;
    }

    const inst = {
      id: instructions.length + 1,
      index: instructions.length,
      op,
      arg1: arg1 !== null && arg1 !== undefined ? String(arg1) : '',
      arg2: arg2 !== null && arg2 !== undefined ? String(arg2) : '',
      result: String(result),
      text,
      type
    };

    instructions.push(inst);
    return result;
  }

  function visit(node, targetName = null) {
    if (!node) return '';

    switch (node.type) {
      case 'Program': {
        let lastResult = '';
        for (const stmt of node.statements) {
          lastResult = visit(stmt);
        }
        return lastResult;
      }

      case 'Assignment': {
        const val = visit(node.expression);
        emit('=', val, null, node.target, 'assign');
        return node.target;
      }

      case 'BinaryOp': {
        const leftVal = visit(node.left);
        const rightVal = visit(node.right);
        const temp = targetName || newTemp();
        emit(node.op, leftVal, rightVal, temp, 'compute');
        return temp;
      }

      case 'UnaryOp': {
        const operandVal = visit(node.operand);
        const temp = targetName || newTemp();
        emit(node.op, operandVal, null, temp, 'compute');
        return temp;
      }

      case 'Identifier':
        return node.name;

      case 'Number':
        return String(node.value);

      default:
        return '';
    }
  }

  if (astNode.type === 'Program') {
    astNode.statements.forEach((stmt, idx) => {
      if (stmt.type !== 'Assignment') {
        // If an expression is at top level, assign to result or default target
        const defaultTarget = astNode.statements.length === 1 ? 'result' : `result${idx + 1}`;
        const val = visit(stmt);
        if (val !== defaultTarget) {
          emit('=', val, null, defaultTarget, 'assign');
        }
      } else {
        visit(stmt);
      }
    });
  } else if (astNode.type === 'Assignment') {
    visit(astNode);
  } else {
    const val = visit(astNode);
    emit('=', val, null, 'result', 'assign');
  }

  return instructions;
}
