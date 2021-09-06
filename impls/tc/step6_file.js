const readline = require('readline');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { Symbol, List, Vector, Hashmap, NIL, Fn } = require('./types');
const Env = require('./env');
const core = require('./core');

const env = new Env(core);
env.set(new Symbol('eval'), (ast) => EVAL(ast, env));

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const eval_ast = (ast, env) => {
  if (ast === undefined) {
    return NIL;
  }

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
  while (true) {
    if (ast === undefined) {
      return NIL;
    }

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

      env = newEnv;
      ast = ast.ast[2];
      continue;
    }

    if (ast.ast[0].symbol === 'do') {
      ast.ast.slice(1, -1).reduce((_, form) => EVAL(form, env), NIL);
      ast = ast.ast[ast.ast.length - 1];
      continue;
    }

    if (ast.ast[0].symbol === 'if') {
      const expr = EVAL(ast.ast[1], env);

      if (expr === false || expr === NIL) {
        ast = ast.ast[3];
        continue;
      }
      ast = ast.ast[2];
      continue;
    }

    if (ast.ast[0].symbol === 'fn*') {
      const closure = (...exprs) => {
        const newEnv = Env.createEnv(env, ast.ast[1].ast, exprs);
        return EVAL(ast.ast[2], newEnv);
      };
      return new Fn(env, ast.ast[1].ast, ast.ast[2], closure);
    }

    const [fn, ...args] = eval_ast(ast, env).ast;

    if (fn instanceof Fn) {
      env = Env.createEnv(fn.env, fn.bindings, args);
      ast = fn.body;
      continue;
    }

    if (fn instanceof Function) {
      return fn.apply(null, args);
    }

    throw `'${fn}' is not a function`;
  }
};

const PRINT = (str) => pr_str(str, true);

const rep = (str) => PRINT(EVAL(READ(str), env));

rep('(def! not (fn* (a) (if a false true)))');

rep(
  '(def! load-file (fn* (f) (eval (read-string (str "(do " (slurp f) "\nnil)")))))'
);

const repl = () => {
  rl.question('user> ', (str) => {
    try {
      console.log(rep(str));
    } catch (e) {
      console.log(e);
    } finally {
      repl();
    }
  });
};

const main = () => {
  const [fileName, ...args] = process.argv.slice(2);
  env.set(new Symbol('*ARGV*'), new List(args));
  if (fileName) {
    console.log(rep(`(load-file "${fileName}")`));
    process.exit(0);
  } else {
    repl();
  }
};

main();