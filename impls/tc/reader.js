const { List, Vector, NIL, Keyword, Symbol, String } = require('./types');

const tokenize = (str) => {
  const tokenizeRegexp = /[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g;
  const matches = [...str.matchAll(tokenizeRegexp)];
  return matches.map((match) => match[1]).slice(0, -1);
};

const Reader = class {
  constructor(tokens) {
    this.tokens = tokens;
    this.position = 0;
  }

  peek() {
    return this.tokens[this.position];
  }

  next() {
    const token = this.peek();
    if (token !== undefined) {
      this.position++;
    }
    return token;
  }
};

const read_ast = (reader, endingToken) => {
  const ast = [];
  reader.next();

  while (reader.peek() !== endingToken) {
    if (reader.peek() === undefined) {
      throw 'unbalanced';
    }
    ast.push(read_form(reader));
  }

  reader.next();
  return ast;
};

const read_list = (reader) => {
  const ast = read_ast(reader, ')');
  return new List(ast);
};

const read_vector = (reader) => {
  const ast = read_ast(reader, ']');
  return new Vector(ast);
};

const read_atom = (reader) => {
  const token = reader.next();

  if (token.match(/^-?[0-9]+$/)) {
    return parseInt(token);
  }

  if (token.match(/^-?[0-9][0-9.]*$/)) {
    return parseFloat(token);
  }

  if (token === 'nil') {
    return NIL;
  }

  if (token === 'true') {
    return true;
  }

  if (token === 'false') {
    return false;
  }

  if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    let str = token.slice(1, -1).replace(/\\(.)/g, (_, c) => {
      return c === 'n' ? '\n' : c;
    });
    return new String(str);
  }

  if (token.startsWith('"')) {
    throw 'unbalanced';
  }

  if (token.startsWith(':')) {
    return new Keyword(token.slice(1));
  }

  return new Symbol(token);
};

const read_form = (reader) => {
  const token = reader.peek();

  switch (token) {
    case '(':
      return read_list(reader);
    case ')':
      throw 'unbalanced';
    case '[':
      return read_vector(reader);
    case ']':
      throw 'unbalanced';
  }

  return read_atom(reader);
};

const read_str = (str) => {
  const tokens = tokenize(str);
  const reader = new Reader(tokens);
  return read_form(reader);
};

module.exports = { read_str };
