const { readFileSync } = require('fs');
const { read_str } = require('./reader');
const Env = require('./env');
const { pr_str } = require('./printer');
const { List, Symbol, NIL, String, Atom } = require('./types');

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

core.set(new Symbol('count'), (form) => form.count());

core.set(new Symbol('='), (a, b) => a == b);

core.set(new Symbol('<'), (a, b) => a < b);

core.set(new Symbol('>'), (a, b) => a > b);

core.set(new Symbol('<='), (a, b) => a <= b);

core.set(new Symbol('>='), (a, b) => a >= b);

core.set(new Symbol('str'), (...args) => {
  return new String(args.map((e) => pr_str(e, false)).join(''));
});

core.set(new Symbol('read-string'), (str) => read_str(str.pr_str(false)));

core.set(
  new Symbol('slurp'),
  (file) => new String(readFileSync(file.pr_str(false), 'utf-8'))
);

core.set(new Symbol('pr-str'), (...args) => {
  return new String(args.map((val) => pr_str(val, true)).join(' '));
});

core.set(new Symbol('prn'), (...args) => {
  console.log(args.map((val) => pr_str(val, true)).join(' '));
  return NIL;
});

core.set(new Symbol('println'), (...values) => {
  console.log(values.map((val) => pr_str(val, false)).join(' '));
  return NIL;
});

core.set(new Symbol('atom'), (value) => {
  return new Atom(value);
});

core.set(new Symbol('atom?'), (atom) => {
  return atom instanceof Atom;
});

core.set(new Symbol('deref'), (atom) => {
  return atom.value;
});

core.set(new Symbol('reset!'), (atom, value) => {
  return atom.reset(value);
});

core.set(new Symbol('swap!'), (atom, fn, ...args) => {
  const values = [atom.value, ...args];
  const func = fn.fn || fn;
  return atom.reset(func.apply(null, values));
});

module.exports = core;
