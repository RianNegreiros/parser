// Letter parser: recursive descent implmentation

const { Tokenizer } = require('./Tokenizer');

class Parser {
  // Initialize the parser
  constructor() {
    this._string = '';
    this._tokenizer = new Tokenizer();
  }

  // Parses a string into an AST
  parse(string) {
    this._string = string;
    this._tokenizer.init(string);

    // Prime the tokenizer to get the first token
    // which is our lookahead token
    // the lookahead is used for predictive parsing

    this._lookahead = this._tokenizer.getNextToken();

    // Parse recursively starting from the main
    // entry point, the Program:

    return this.Program();
  }

  // Main entry point

  // Program
  //   : NumericLiteral
  //   ;

  Program() {
    return {
      type: 'Program',
      body: this.StatementList()
    }
  }

  // StatementList
  //   : Statement
  //   | Statement StatementList
  //   ;

  StatementList() {
    const statementList = [this.Statement()];

    while (this._lookahead != null) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  // Statement
  // : ExpressionStatement
  // ;

  Statement() {
    return this.ExpressionStatement();
  }

  // ExpressionStatement
  //   : Expression ';'
  //   ;

  ExpressionStatement() {
    const expression = this.Expression();
    this._eat(';');
    return {
      type: 'ExpressionStatement', 
      expression
    };
  }

  // Expression
  //   : Literal
  //   ;

  Expression() {
    return this.Literal();
  }

  // Literal
  //   : NumericLiteral
  //   : StringLiteral
  //   ;

  Literal() {
    switch (this._lookahead.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
    }
    throw new SyntaxError(`Literal: Unexpected token: ${this._lookahead.type}`)
  }

    // StringLiteral
  //   : STRING
  //   ;

  StringLiteral() {
    const token = this._eat('STRING');
    return {
      type: 'StringLiteral',
      value: token.value.slice(1, -1)
    };
  }

  // NumericLiteral
  //   : NUMBER
  //   ;

  NumericLiteral() {
    const token = this._eat('NUMBER');
    return {
      type: 'NumericLiteral',
      value: Number(token.value)
    };
  }

  // Expect the next token to match the given token type
  _eat(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected ${tokenType}`
      );
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpect token: "${token.value}", expected: "${tokenType}`
      );
    }

    // Advance the tokenizer
    this._lookahead = this._tokenizer.getNextToken();

    return token;
  }
}

module.exports = {
  Parser
};