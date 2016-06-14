/**
 * Created by timtian on 2016/5/12.
 */


var _ = require('lodash');
var yy = require('./parser/yy');
var jsbeautify = require('js-beautify');

var compiler = {};


compiler.exec = function (ast) {

    var code = [];
    code.push('var source = params[' + ast.from.from[0].index + '];');
    code.push('var keys = Object.keys(source);');
    code.push('var res = {};');

    if (ast.order) {
        code.push('var orderList = [];');
    }

    code.push('for(var i = 0; i < keys.length; ++i){');
    code.push('var key = keys[i];');
    code.push('var item = source[key];');

    if (ast.where) {
        code.push('//set where expression here');
        code.push('if (' + compiler.parseOp(ast.where) + ') {');
        code.push('res[key] = ');
        code = code.concat(compiler.parseReturnColumns(ast.columns));


        if (ast.order) {
            code.push('//set order expression');
            //orderList.push({
            //    key: key,
            //    value: item.id
            //});
        }
        code.push('}');
    }

    code.push('}');
    code.push('return res;');

    //set order
    //orderList.sort((x, y)=> {
    //    return x.value == y.value ? 0 : (x.value > y.value ? -1 : 1);
    //});

    //set top
    //orderList = orderList.slice(0, 1);

    //var output = {};
    //orderList.forEach(x=> {
    //    output[x.key] = res[x.key];
    //});


    code.unshift('function (params){');
    code.push('}');

    return jsbeautify.js_beautify(code.join('\n'));
};

compiler.parseOp = function (op) {

    var code = ['('];
    code = code.concat(compiler.parseLeftOrRight(op.left));

    if (op.op == "AND")
        code.push('&&');
    else if (op.op == "OR")
        code.push('||');
    else
        code.push(op.op);

    code = code.concat(compiler.parseLeftOrRight(op.right));
    code.push(')');

    return code.join(' ');
};

compiler.parseLeftOrRight = function (lr) {
    var code = [];
    if (lr instanceof yy.Op) {
        code.push(compiler.parseOp(lr));
    } else if (lr instanceof yy.Column) {
        code.push('item' + compiler.parseColumn(lr))
    } else if (lr instanceof yy.Value) {
        if (typeof lr.value === 'string') {
            code.push("'" + compiler.safeStr(lr.value) + "'");
        } else {
            code.push(lr.value);
        }
    } else if (lr instanceof yy.ParamValue) {
        code.push('params[' + lr.index + ']');
    }
    return code;
};

compiler.parseColumn = function (col) {
    var code = [];
    col.value.forEach(function (x) {
        code.push("['" + compiler.safeStr(x) + "']")
    });
    return code.join('');
};

compiler.safeStr = function (name) {
    return name.replace(/'/gi, "\\\'")
};

compiler.parseReturnColumns = function (columns) {

    var code = ['{'];
    for (var i = 0; i < columns.length; i++) {

        var col = columns[i];

        if (i > 0)
            code.push(',');

        code.push("'" + compiler.safeStr(col.as) + "' : ");
        if (col instanceof yy.Column) {
            if (col.value[0] === '*') {
                code.pop();
                code.push('...item')
            } else {
                code.push('item' + compiler.parseColumn(col));
            }
        } else if (col instanceof yy.Op) {
            code.push(compiler.parseOp(col));
        }
    }
    code.push('}');

    return code;
};

/**
 * @param from
 */
compiler.parseFrom = function (from) {

};


module.exports = compiler;