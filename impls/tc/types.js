const MalValue = class {};

const pr_str = (val) => {
  if (val instanceof MalValue) {
    return val.pr_str();
  }

  return val.toString();
};

const List = class extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str() {
    return `(${this.ast.map(pr_str).join(' ')})`;
  }
};

const Vector = class extends MalValue {
  constructor(ast) {
    super();
    this.ast = ast;
  }

  pr_str() {
    return `[${this.ast.map(pr_str).join(' ')}]`;
  }
};

module.exports = { List, Vector, pr_str };
