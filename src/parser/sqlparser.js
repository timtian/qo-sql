/**
 * Created by timtian on 2016/5/6.
 */
var yy = require('./yy');

var sqlparser_jison = require('./sqlparser.jison.js');
var parser = new sqlparser_jison.Parser();
parser.yy = yy;

module.exports = parser;
