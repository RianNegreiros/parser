module.exports = test => {
  test(
    `
    "foo";
    'bar';
    42;
    `,
    {
      type:'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'foo'
          }
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'bar'
          }
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'NumericLiteral',
            value: 42
          }
        }
      ]
    }
  )
}