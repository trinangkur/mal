const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { Symbol, List, Vector, Hashmap, NIL } = require('./types');
const Env = require('./env');
const core = require('./core');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast instanceof Symbol) {
    const val = env.get(ast);
    return val;
  }

  if (ast instanceof List) {
    return new List(ast.ast.map((x) => EVAL(x, env)));
  }

  if (ast instanceof Vector) {
    return new Vector(ast.ast.map((x) => EVAL(x, env)));
  }

  if (ast instanceof Hashmap) {
    const hashMap = new Map();

    for (const [key, value] of ast.hashmap) {
      hashMap.set(EVAL(key, env), EVAL(value, env));
    }

    return new Hashmap(hashMap);
  }

  return ast;
};

const READ = (str) => read_str(str);

const EVAL = (ast, env) => {
  if (!(ast instanceof List)) {
    return eval_ast(ast, env);
  }

  if (ast.isEmpty()) {
    return ast;
  }

  if (ast.ast[0].symbol === 'def!') {
    if (ast.ast.length > 3) {
      throw 'Wrong number of arguments to def';
    }
    return env.set(ast.ast[1], EVAL(ast.ast[2], env));
  }

  if (ast.ast[0].symbol === 'let*') {
    if (ast.ast.length > 3) {
      throw 'Wrong number of arguments to let*';
    }

    const newEnv = new Env(env);
    const bindings = ast.ast[1].ast;

    for (let i = 0; i < bindings.length; i += 2) {
      newEnv.set(bindings[i], EVAL(bindings[i + 1], newEnv));
    }

    return EVAL(ast.ast[2], newEnv);
  }

  if (ast.ast[0].symbol === 'do') {
    return ast.ast.slice(1).reduce((_, form) => EVAL(form, env), NIL);
  }

  if (ast.ast[0].symbol === 'if') {
    const expr = EVAL(ast.ast[1], env);

    if (expr === false || expr === NIL) return EVAL(ast.ast[3], env);

    return EVAL(ast.ast[2], env);
  }

  if (ast.ast[0].symbol === 'fn*') {
    return function (...exprs) {
      const newEnv = Env.createEnv(env, ast.ast[1].ast, exprs);
      return EVAL(ast.ast[2], newEnv);
    };
  }

  const [fn, ...args] = eval_ast(ast, env).ast;

  if (fn instanceof Function) {
    return fn.apply(null, args);
  }

  throw `'${fn}' is not a function`;
};

const PRINT = (str) => pr_str(str, true);

const rep = (str) => PRINT(EVAL(READ(str), core));

const main = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (e) {
      console.log(e);
    } finally {
      main();
    }
  });
};

main();
