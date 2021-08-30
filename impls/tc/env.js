class Env {
  constructor(outer = null) {
    this.data = new Map();
    this.outer = outer;
  }

  set(symbol, malValue) {
    this.data.set(symbol.symbol, malValue);
    return malValue;
  }

  find(symbol) {
    if (this.data.has(symbol.symbol)) return this;
    return this.outer && this.outer.find(symbol);
  }

  get(symbol) {
    const env = this.find(symbol);
    if (env) {
      return env.data.get(symbol.symbol);
    }
    throw `${symbol.symbol} not found`;
  }

  static createEnv(outer = null, binds = [], exprs = []) {
    const env = new Env(outer);
    binds.forEach((element, index) => {
      env.set(element, exprs[index]);
    });
    return env;
  }
}

module.exports = Env;
