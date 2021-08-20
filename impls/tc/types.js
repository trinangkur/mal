const MalValue = class {};

const pr_str = (val, print_readably = false) => {
  if (val instanceof MalValue) {
    return val.pr_str(print_readably);
  }

  return val.toString();
};

const NilValue = class extends MalValue {
  pr_str(print_readably = false) {
    return 'nil';
  }
};

const List = class extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str(print_readably = false) {
    return `(${this.ast.map(pr_str).join(' ')})`;
  }
};

const Vector = class extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str(print_readably = false) {
    return `[${this.ast.map(pr_str).join(' ')}]`;
  }
};

const Keyword = class extends MalValue {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  pr_str(print_readably = false) {
    return `:${this.keyword}`;
  }
};

const Symbol = class extends MalValue {
  constructor(symbol) {
    super();
    this.symbol = symbol;
  }

  pr_str(print_readably = false) {
    return this.symbol;
  }
};

const String = class extends MalValue {
  constructor(string) {
    super();
    this.string = string;
  }

  pr_str(print_readably = false) {
    if (print_readably) {
      return (
        '"' +
        this.string
          .replace(/\\/g, '\\\\')
          .replace(/"/g, '\\"')
          .replace(/\n/g, '\\n') +
        '"'
      );
    }
    return `"${this.string}"`;
  }
};

const NIL = new NilValue();

module.exports = { List, Vector, NIL, Keyword, Symbol, String, pr_str };
