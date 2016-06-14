/**
 * Created by timtian on 2016/5/11.
 */


var jison = require("jison");
var fs = require('fs');
var path = require('path');
var compiler = require('../src/compiler');

var grammar = fs.readFileSync( path.join(__dirname, '../src/parser/sqlparser.jison'), 'UTF-8');

var parser = new jison.Parser(grammar);

parser.yy = require(path.join(__dirname, '../src/parser/yy'))

//var ast = parser.parse('SELECT TOP ${count} ID, Name, true as Enable, "hehe" as hehe2, 123 as value, Data.[desc], (${base} + Count)  FROM ${data} as a JOIN ${data1} as b ON a.id=b.id WHERE ID=2 AND Name>2 OR ID >10 ORDER BY Name DESC, ID');


var data2 =
{
    index1:{
        id:1,
        name:'A'
    },
    index2:{
        id:2,
        name:'B'
    },
    index3:{
        id:3,
        name:'C'
    },
    index4:{
        id:4,
        name:'D'
    },
};


var ast = parser.parse('SELECT id, (id + 1) as id2, (name + "ABC") as name2, c FROM ${data} WHERE (id+1)>${id} AND name != "B"');
console.log(ast);

var code = compiler.exec(ast);
console.log(code);
var execFun = new Function('params', code);


var params = [
    data2,
    1
];
var res = execFun(params);



//var test = function(params) {
//    var source = params[0];
//    var keys = Object.keys(source);
//    var res = {};
//    for (var i = 0; i < keys.length; ++i) {
//        var key = keys[i];
//        var item = source[key];
//        var res = {};
//        //set where expression here
//        if ((((item['id'] + 1) > params[1]) && (item['name'] != 'B'))) {
//            res[key] = item;
//        }
//    }
//    return res;
//}
//
//console.log(test(params));

console.log(code);

console.log(res);
module.exports = parser;


