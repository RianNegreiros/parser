module.exports = test => {
  test(`let x = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'VariableStatement',
        declarations: [
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            init: {
              type: 'NumericLiteral',
              value: 42
            }
          }
        ]
      }
    ]
  })

  // Multiple variables declaration with no initializers
  test(`let x, y;`, {
    type: 'Program',
    body: [
      {
        type: 'VariableStatement',
        declarations: [
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            init: null
          },
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'y'
            },
            init: null
          }
        ]
      }
    ]
  })

  // Multiple variables declaration with initializers
  test(`let x, y = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'VariableStatement',
        declarations:[
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'x'
            },
            init: null
          },
          {
            type: 'VariableDeclaration',
            id: {
              type: 'Identifier',
              name: 'y'
            },
            init: {
              type: 'NumericLiteral',
              value: 42
            }
          }
        ]
      }
    ]
  })
}