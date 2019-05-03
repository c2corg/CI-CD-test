/* eslint-disable no-console */

const fs = require('fs');
const Compiler = require('angular-gettext-tools').Compiler;
const compiler = new Compiler({ format: 'json' });

const poData = fs.readFileSync('/dev/stdin', 'utf-8');

// save indented json : need to parse/stringify...
const output = JSON.parse(compiler.convertPo([poData]));
console.log(JSON.stringify(output, null, 2));
