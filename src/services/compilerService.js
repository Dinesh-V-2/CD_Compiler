import { lex } from '../compiler/lexer.js';
import { parse } from '../compiler/parser.js';
import { formatASTForTree } from '../compiler/ast.js';
import { generateTAC } from '../compiler/tacGenerator.js';
import { generateQuadruples } from '../compiler/quadrupleGenerator.js';
import { generateTriples } from '../compiler/tripleGenerator.js';
import { optimizeTAC } from '../compiler/optimizer.js';
import { analyzePerformance } from '../compiler/performanceAnalyzer.js';

export function runFullCompilation(expressionInput, options = { optimize: true, optimizationSettings: {} }) {
  const consoleLogs = [];
  const startTime = performance.now();

  function log(message, type = 'INFO') {
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', fractionalSecondDigits: 3 });
    consoleLogs.push({ timestamp, type, message });
  }

  log('Compiler initialized', 'INFO');
  log('Execution Mode: LOCALHOST (JavaScript Engine)', 'SYS');

  try {
    // 1. Lexical Analysis
    log('Starting lexical analysis...', 'INFO');
    const lexStart = performance.now();
    const tokens = lex(expressionInput);
    const lexTime = performance.now() - lexStart;
    log(`${tokens.length} tokens generated (${lexTime.toFixed(2)} ms)`, 'SUCCESS');

    // 2. Syntax Analysis / Parsing
    log('Starting recursive-descent parser...', 'INFO');
    const parseStart = performance.now();
    const ast = parse(tokens);
    const parseTime = performance.now() - parseStart;
    log(`Abstract Syntax Tree generated successfully (${parseTime.toFixed(2)} ms)`, 'SUCCESS');

    // Formatted Tree structure for UI view
    const astTree = formatASTForTree(ast);

    // 3. Three Address Code Generation
    log('Generating Three Address Code (TAC)...', 'INFO');
    const tac = generateTAC(ast);
    log(`TAC generated (${tac.length} instructions)`, 'SUCCESS');

    // 4. Quadruples Generation
    log('Generating Quadruple Representation...', 'INFO');
    const quadruples = generateQuadruples(tac);
    log(`Quadruples generated (${quadruples.length} records)`, 'SUCCESS');

    // 5. Triples Generation
    log('Generating Triple Representation...', 'INFO');
    const triples = generateTriples(tac);
    log(`Triples generated (${triples.length} records)`, 'SUCCESS');

    let optimizationResult = null;
    let performanceMetrics = null;

    // 6. Optimization Pipeline (if requested)
    if (options.optimize) {
      log('Running Optimization Engine...', 'INFO');
      const optStart = performance.now();
      const settings = options.optimizationSettings || {
        constantFolding: true,
        commonSubexpression: true,
        deadCodeElimination: true
      };

      optimizationResult = optimizeTAC(tac, settings);
      const optTime = performance.now() - optStart;

      log(`Optimization completed (${optimizationResult.logs.length} optimization steps applied)`, 'SUCCESS');

      // 7. Performance Analysis
      performanceMetrics = analyzePerformance(
        tac,
        optimizationResult.optimizedTAC,
        optimizationResult.logs,
        parseTime,
        optTime
      );

      log(`Instruction count reduced from ${tac.length} to ${optimizationResult.optimizedTAC.length} (${performanceMetrics.reductionPercentage}% efficiency gain)`, 'SUCCESS');
    }

    const totalTime = (performance.now() - startTime).toFixed(2);
    log(`Compilation pipeline completed in ${totalTime} ms`, 'SUCCESS');

    return {
      success: true,
      tokens,
      ast,
      astTree,
      tac,
      quadruples,
      triples,
      optimizationResult,
      performanceMetrics,
      consoleLogs,
      error: null
    };

  } catch (error) {
    log(`Compilation failed: ${error.message}`, 'ERROR');
    return {
      success: false,
      tokens: [],
      ast: null,
      astTree: null,
      tac: [],
      quadruples: [],
      triples: [],
      optimizationResult: null,
      performanceMetrics: null,
      consoleLogs,
      error: {
        name: error.name || 'CompilationError',
        message: error.message,
        line: error.line || 1,
        column: error.column || 1,
        expected: error.expected || []
      }
    };
  }
}
