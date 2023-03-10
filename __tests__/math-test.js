module.exports = test => {
  // Add two numbers
  test(`2 + 2;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 2
          },
          right: {
            type: 'NumericLiteral',
            value: 2
          }
        }
      }
    ]
  })

  // Nested expressions
  test(`3 + 2 - 2`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '-',
          left: {
            type: 'BinaryExpression',
            operator: '+',
            left: {
              type: 'NumericLiteral',
              value: 3
            },
            right: {
              type: 'NumericLiteral',
              value: 2
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 2
          }
        }
      }
    ]
  })

  // Multiplication
  test(`3 * 2`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'NumericLiteral',
            value: 3
          },
          right: {
            type: 'NumericLiteral',
            value: 2
          }
        }
      }
    ]
  })

  // Multiplication with precedence
  test(`3 * 2 * 2`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '*',
          left: {
            type: 'BinaryExpression',
            operator: '*',
            left: {
              type: 'NumericLiteral',
              value: 3
            },
            right: {
              type: 'NumericLiteral',
              value: 2
            },
          },
          right: {
            type: 'NumericLiteral',
            value: 2
          }
        }
      }
    ]
  })

  test(`3 + 2 * 2`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'BinaryExpression',
          operator: '+',
          left: {
            type: 'NumericLiteral',
            value: 3
          },
          right: {
            type: 'BinaryExpression',
            operator: '*',
            left: {
              type: 'NumericLiteral',
              value: 2
            },
            right: {
              type: 'NumericLiteral',
              value: 2
            }
          }
        }
      }
    ]
  })
}