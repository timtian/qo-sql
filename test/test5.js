/**
 * Created by timtian on 2016/6/8.
 */

var babylon = require('babylon');


var ast = babylon.parse(`
function test(params) {
    var source = params[0];
    var keys = Object.keys(source);
    var res = {};
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var item = source[key];
        //set where expression here
        if ((((item['id'] + 1) > params[1]) && (item['name'] != 'B'))) {
            res[key] = {
                'id': item['id'],
                'id2':
                    (item['id'] + 1),
                'name2':
                    (item['name'] + 'ABC'),
                'c': item['c'],
                ...item
            }
        }
    }
    return res;
}
`, {plugins:['objectRestSpread']});

console.log(ast);