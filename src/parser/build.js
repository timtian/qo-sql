/**
 * Created by timtian on 2016/8/22.
 */
var jison = require("jison");
var fs = require('fs');
var path = require('path');
var yy = require('./yy');


console.log('start build sqlparser')

try {
    var grammar = fs.readFileSync(path.join(__dirname, './sqlparser.jison'), 'UTF-8');
    var parser = new jison.Parser(grammar);

    var source = parser.generateCommonJSModule({moduleName: "sqlparser"});
    fs.writeFileSync(path.join(__dirname, './sqlparser.jison.js'), source);

}catch (e){
    console.error(e, e.stack());
}

console.log('done=========');