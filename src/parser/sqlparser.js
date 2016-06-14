/**
 * Created by timtian on 2016/5/6.
 */

var jison = require("jison");
var fs = require('fs');
var path = require('path');
var yy = require('./yy');

var grammar = fs.readFileSync( path.join(__dirname, './sqlparser.jison'), 'UTF-8');
var parser = new jison.Parser(grammar);
parser.yy = yy;

module.exports = parser;
