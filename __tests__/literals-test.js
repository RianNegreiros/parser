module.exports = test => {
  // NumericLiteral
  test(`42;`, {
    type: 'Program',
    body: [
    {
      type: 'ExpressionStatement',
      expression: {
        type: 'NumericLiteral',
        value: 42
      },
    },
    ],
  });

  // StringLiteral
  test(`"foo";`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'foo'
        }
      }
    ]
  })

  test(`'bar';`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'StringLiteral',
          value: 'bar'
        }
      }
    ]
  })
}