module.exports = test => {
  test(`
  {
    42;
    "foo";
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 42
            },
          },
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'StringLiteral',
              value: 'foo'
            }
          }
        ]
      }
    ]
  })

  // Empty block

  test(`
  {

  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body: []
      }
    ]
  })

  test(`
  {
    42;
    {
      "foo";
    }
  }
  `, {
    type: 'Program',
    body: [
      {
        type: 'BlockStatement',
        body: [
          {
            type: 'ExpressionStatement',
            expression: {
              type: 'NumericLiteral',
              value: 42
            },
          },
          {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'StringLiteral',
                  value: 'foo'
                }
              }
            ]
          }
        ]
      }
    ]
  })
}