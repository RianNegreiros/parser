module.exports = test => {
  // NumericLiteral
  test(`42`, {
    type: 'Program',
    body: {
      type: 'NumericLiteral',
      value: 42
    },
  });

  // StringLiteral
  test(`"foo"`, {
    type: 'Program',
    body: {
      type: 'StringLiteral',
      value: 'foo'
    }
  })

  test(`'foo'`, {
    type: 'Program',
    body: {
      type: 'StringLiteral',
      value: 'foo'
    }
  })
}