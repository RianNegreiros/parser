const { Parser } = require('../src/Parser');

const parser = new Parser();

const Program = `42`;

const ast = parser.parse(Program);

console.log(JSON.stringify(ast, null, 2));