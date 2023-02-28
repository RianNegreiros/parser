// Tokenizer class
// Lazily pulls tokens from the input stream

class Tokenizer {
  // Initialize the string
  
  init(string) {
    this._string = string;
    this._cursor = 0;
  }

  // Whether we have reached the end of the input stream
  ifEOF() {
    return this._cursor === this._string.length;
  }

  // Whether wel still have tokens to consume
  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  //Obtain the next token
  getNextToken() {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const string = this._string.slice(this._cursor);

  // Numbers
  if (!Number.isNaN(Number(string[0]))) {
    let number = '';
    while (!Number.isNaN(Number(string[this._cursor]))) {
      number += string[this._cursor++];
    }
    return {
      type: 'NUMBER',
      value: number
    };
  }

  if (string[0] === '"' || string[0] === "'") {
    let s = '';
    do {
      s += string[this._cursor++];
    } while (string[this._cursor] !== '"' && !this.ifEOF());
    s += this._cursor++;
    return {
      type: 'STRING',
      value: s
    };
  }
  return null;
  }
}

module.exports = {
  Tokenizer
}