const Env = require('./env');
const { pr_str } = require('./printer');
const { List, Symbol, NIL } = require('./types');

const core = new Env();

core.set(new Symbol('+'), (...args) => args.reduce((r, x) => r + x, 0));

core.set(new Symbol('-'), (...args) => {
  if (args.length === 1) {
    return 0 - args[0];
  }
  return args.reduce((r, x) => r - x);
});

core.set(new Symbol('*'), (...args) => args.reduce((r, x) => r * x, 1));

core.set(new Symbol('/'), (...args) => {
  if (args.length === 1) {
    return 1 / args[0];
  }
  return args.reduce((r, x) => r / x);
});

core.set(new Symbol('empty?'), (seq) => seq.isEmpty());

core.set(new Symbol('prn'), (form) => {
  if (form) {
    return pr_str(form, true);
  }
  return NIL;
});

core.set(new Symbol('list'), (...args) => new List(args));

core.set(new Symbol('list?'), (form) => form instanceof List);

core.set(new Symbol('list?'), (form) => form instanceof List);

core.set(new Symbol('count'), (form) => form.count());

core.set(new Symbol('='), (a, b) => a == b);

core.set(new Symbol('<'), (a, b) => a < b);

core.set(new Symbol('>'), (a, b) => a > b);

core.set(new Symbol('<='), (a, b) => a <= b);

core.set(new Symbol('>='), (a, b) => a >= b);

module.exports = core;
