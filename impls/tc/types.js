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

  count() {
    return 0;
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

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
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

  isEmpty() {
    return this.ast.length === 0;
  }

  count() {
    return this.ast.length;
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

const Hashmap = class extends MalValue {
  constructor(hashmap) {
    super();
    this.hashmap = hashmap;
  }

  pr_str(print_readably = false) {
    const mapStr = [...this.hashmap.entries()]
      .map(
        ([key, value]) =>
          `${pr_str(key, print_readably)} ${pr_str(value, print_readably)}`
      )
      .join(' ');

    return `{${mapStr}}`;
  }

  isEmpty() {
    return this.hashmap.size === 0;
  }

  count() {
    return this.ast.size;
  }
};

const NIL = new NilValue();

module.exports = {
  List,
  Vector,
  NIL,
  Keyword,
  Symbol,
  String,
  Hashmap,
  pr_str,
};
