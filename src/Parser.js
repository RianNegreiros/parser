// Letter parser: recursive descent implmentation

const { Tokenizer } = require('./Tokenizer')

// Default AST node

const DefaultFactory = {
  Program(body) {
    return {
      type: 'Program',
      body
    }
  },

  EmptyStatement() {
    return {
      type: 'EmptyStatement'
    }
  },

  BlockStatement(body) {
    return {
      type: 'BlockStatement',
      body
    }
  },

  ExpressionStatement(expression) {
    return {
      type: 'ExpressionStatement',
      expression
    }
  },

  BinaryExpression(operator, left, right) {
    return {
      type: 'BinaryExpression',
      operator,
      left,
      right
    }
  },

  StringLiteral(value) {
    return {
      type: 'StringLiteral',
      value
    }
  },

  NumericLiteral(value) {
    return {
      type: 'NumericLiteral',
      value
    }
  },

  VariableStatement(declarations) {
    return {
      type: 'VariableStatement',
      declarations
    }
  },

  VariableDeclaration(id, init) {
    return {
      type: 'VariableDeclaration',
      id,
      init
    }
  }
}

// S-expression AST node

const SExpressionFactory = {
  Program(body) {
    return ['begin', body]
  },

  EmptyStatement() {},

  BlockStatement(body) {
    return ['begin', body]
  },

  ExpressionStatement(expression) {
    return expression;
  },

  StringLiteral(value) {
    return value;
  },

  NumericLiteral(value) {
    return value;
  }
}

const AST_NODE = 'default';

const factory = AST_NODE ===  'default' ? DefaultFactory : SExpressionFactory;

class Parser {
  // Initialize the parser
  constructor() {
    this._string = '';
    this._tokenizer = new Tokenizer()
  }

  // Parses a string into an AST
  parse(string) {
    this._string = string;
    this._tokenizer.init(string)

    // Prime the tokenizer to get the first token
    // which is our lookahead token
    // the lookahead is used for predictive parsing

    this._lookahead = this._tokenizer.getNextToken()

    // Parse recursively starting from the main
    // entry point, the Program:

    return this.Program()
  }

  // Main entry point

  // Program
  //   : StatementList
  //   ;

  Program() {
    return factory.Program(this.StatementList())
  }

  // StatementList
  //   : Statement
  //   | Statement StatementList
  //   ;

  StatementList(stopLookahead = null) {
    const statementList = [this.Statement()];

    while (this._lookahead != null && this._lookahead.type !== stopLookahead) {
      statementList.push(this.Statement())
    }

    return statementList;
  }

  // Statement
  // : ExpressionStatement
  // | BlockStatement
  // | EmptyStatement
  // ;

  Statement() {
    switch (this._lookahead.type) {
      case ';':
        return this.EmptyStatement()
      case '{': 
        return this.BlockStatement()
      case 'let':
        return this.VariableStatement()
      default:
        return this.ExpressionStatement()
    }
  }

  // VariableStatement
  //   : 'let' VariableDeclarationList ';'
  //   ;

  VariableStatement() {
    this._eat('let')
    const declarations = this.VariableDeclarationList()
    this._eat(';')
    return factory.VariableStatement(declarations)
  }

  // VariableDeclarationList
  //   : VariableDeclaration
  //   | VariableDeclaration ',' VariableDeclarationList
  //   ;

  VariableDeclarationList() {
    const declarations = [];

    do {
      declarations.push(this.VariableDeclaration())
    } while (this._lookahead.type === ',' && this._eat(','))

    return declarations;
  }

  // VariableDeclaration
  //   : Identifier Initializer
  //   ;

  VariableDeclaration() {
    const id = this.Identifier()
    const init =
      this._lookahead.type !== ';' && this._lookahead.type !== ','
        ? this.VariableInitializer()
        : null

    return factory.VariableDeclaration(id, init)
  }

  // VariableInitializer
  //   : SIMPLE_ASSIGNMENT AssignmentExpression
  //   ;

  VariableInitializer() {
    this._eat('SIMPLE_ASSIGNMENT')
    return this.AssignmentExpression()
  }

  // EmptyStatement
  //   : ';'
  //   ;

  EmptyStatement() {
    this._eat(';')
    return factory.EmptyStatement()
  }

  // BlockStatement
  //   : '{' OptionalStatementList '}'
  //   ;

  BlockStatement() {
    this._eat('{')

    const body = this._lookahead.type !== '}' ? this.StatementList('}') : [];

    this._eat('}')

    return factory.BlockStatement(body)
  }

  // ExpressionStatement
  //   : Expression ';'
  //   ;

  ExpressionStatement() {
    const expression = this.Expression()
    this._eat(';')
    return factory.ExpressionStatement(expression)
  }

  // Expression
  //   : Literal
  //   ;

  Expression() {
    return this.AssignmentExpression()
  }

  // AssignmentExpression
  //   : AdditiveExpression
  //   | LeftHandSideExpression AssignmentOperator AssignmentExpression
  //   ;

  AssignmentExpression() {
    const left = this.AdditiveExpression()

    if (!this._isAssignmentOperator(this._lookahead.type)) {
      return left;
    }

    return {
      type: 'AssignmentExpression',
      operator: this.AssignmentOperator().value,
      left: this._checkValidAssignmentTarget(left),
      right: this.AssignmentExpression()
    }
  }

  // LeftHandSideExpression
  LeftHandSideExpression() {
    return this.Identifier()
  }

  // Identifier
  Identifier() {
    const name = this._eat('IDENTIFIER').value
    return {
      type: 'Identifier',
      name
    }
  }

  // Extra check to make sure the left hand side expression
  _checkValidAssignmentTarget(node) {
    if (node.type === 'Identifier') {
      return node
    }

    throw new SyntaxError('Invalid left-hand side in assignment expression')
  }

  // Whether the token is an assignment operator
  _isAssignmentOperator(type) {
    return type === 'SIMPLE_ASSIGNMENT' || type === 'COMPLEX_ASSIGNMENT'
  }

  // AssignmentOperator
  //   : SIMPLE_ASSIGNMENT
  //   : COMPLEX_ASSIGNMENT
  //   ;

  AssignmentOperator() {
    if (this._lookahead.type === 'SIMPLE_ASSIGNMENT') {
      return this._eat('SIMPLE_ASSIGNMENT')
    }
    return this._eat('COMPLEX_ASSIGNMENT')
  }

  // AdditiveExpression
  //   : MultiplicativeExpression
  //   | AdditiveExpression ADDITIVE_OPERATOR MultiplicativeExpression -> MultiplicativeExpression ADDITIVE_OPERATOR MultiplicativeExpression
  //   ;

  AdditiveExpression() {
    return this._BinaryExpressionParser('MultiplicativeExpression', 'ADDITIVE_OPERATOR')
  }

    // MultiplicativeExpression
  //   : PrimaryExpression
  //   | MultiplicativeExpression MULTIPLICATIVE_OPERATOR PrimaryExpression -> PrimaryExpression MULTIPLICATIVE_OPERATOR PrimaryExpression
  //   ;

  MultiplicativeExpression() {
    return this._BinaryExpressionParser('PrimaryExpression', 'MULTIPLICATIVE_OPERATOR')
  }

  // Generic binary expression parser

  _BinaryExpressionParser(primaryExpressionParser, operators) {
    let left = this[primaryExpressionParser]()

    while (this._lookahead.type === operators) {
      const operator = this._eat(operators)
      const right = this[primaryExpressionParser]()
      left = factory.BinaryExpression(operator.value, left, right)
    }

    return left;
  }

  // PrimaryExpression
  //   : Literal
  //   | ParenthesizedExpression
  //   | LeftHandSideExpression
  //   ;

  PrimaryExpression() {
    if (this._isLiteral(this._lookahead.type)) {
      return this.Literal()
    }
    switch (this._lookahead.type) {
      case '(':
        return this.ParenthesizedExpression()
      default:
        return this.LeftHandSideExpression()
    }
  }

  // Whether the token is a literal
  _isLiteral(type) {
    return type === 'NUMBER' || type === 'STRING'
  }

  // ParenthesizedExpression
  //   : '(' Expression ')'
  //   ;

  ParenthesizedExpression() {
    this._eat('(')
    const expression = this.Expression()
    this._eat(')')
    return expression;
  }

  // Literal
  //   : NumericLiteral
  //   : StringLiteral
  //   ;

  Literal() {
    switch (this._lookahead.type) {
      case 'NUMBER':
        return this.NumericLiteral()
      case 'STRING':
        return this.StringLiteral()
    }
    throw new SyntaxError(`Literal: Unexpected token: ${this._lookahead.type}`)
  }

    // StringLiteral
  //   : STRING
  //   ;

  StringLiteral() {
    const token = this._eat('STRING')
    return factory.StringLiteral(token.value)
  }

  // NumericLiteral
  //   : NUMBER
  //   ;

  NumericLiteral() {
    const token = this._eat('NUMBER')
    return factory.NumericLiteral(token.value)
  }

  // Expect the next token to match the given token type
  _eat(tokenType) {
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(
        `Unexpected end of input, expected ${tokenType}`
      )
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(
        `Unexpect token: "${token.value}", expected: "${tokenType}`
      )
    }

    // Advance the tokenizer
    this._lookahead = this._tokenizer.getNextToken()

    return token;
  }
}

module.exports = {
  Parser
};