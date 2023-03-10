// Tokenizer spec
const Spec = [
  // Whitespace
  [/^\s+/, null],

  // Single-line comments
  [/^\/\/.*/, null],

  // Multi-line comments
  [/^\/\*[\s\S]*?\*\//, null],

  // delimiters
  [/^;/, ';'],
  [/^\{/, '{'],
  [/^\}/, '}'],

  // Math operators
  [/^[+\-]/, 'ADDITIVE_OPERATOR'],
  [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],

  // Numbers
  [/^\d+/, 'NUMBER'],

  // Strings
  [/^"(.*)"/, 'STRING'],
  [/^'(.*)'/, 'STRING'],
]

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

  for (const [regex, tokenType] of Spec) {
    const tokenValue = this._match(regex, string);

    if (tokenValue == null) {
      continue
    }

    // If the token type is null, we should skip it
    if (tokenType === null) {
      return this.getNextToken();
    }

    return {
      type: tokenType,
      value: tokenValue
    }
  }

  throw new SyntaxError(`Unexpected token: ${string[0]}`);
  }

  _match(regexp, string) {
    const matched = regexp.exec(string);
    if (matched === null) {
      return null;
    }
    this._cursor += matched[0].length;
    return matched[0];
  }
}

module.exports = {
  Tokenizer
}