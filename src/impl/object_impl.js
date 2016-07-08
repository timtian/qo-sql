/**
 * Created by timtian on 2016/5/12.
 */


var _ = require('lodash');
var yy = require('../parser/yy');
var baseimpl = require('./base_impl');
var jsbeautify = require('js-beautify');
var util = require('util');


var compiler = function(){
};

util.inherits(compiler, baseimpl);

compiler.prototype.exec = function (ast) {
    var code = [];
    var me = this;
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
        code.push('if (' + me.parseOp(ast.where) + ') {');

        if (ast.order) {
            code.push('//set order expression');
            code.push('orderList.push(key)');
        }else if(ast.limit){
            //limit without order
            code.push('if(i < ' + me.parseExpression(ast.limit[0]) + '){');
            code.push('    continue;');
            code.push('}');
            code.push('else (i > ' + me.parseExpression(ast.limit[0]) + '+' + me.parseExpression(ast.limit[1]) + '){');
            code.push('    break;');
            code.push('}');
        }

        code.push('res[key] = ');
        code = code.concat(me.parseReturnColumns(ast.columns));

        code.push('}');
    }

    code.push('}');

    if (ast.order) {
        code.push('function ___sortByResname(a,b,name){');
        code.push('    if(a[name] < b[name])');
        code.push('        return -1;');
        code.push('    else if(a[name] != b[name])');
        code.push('        return 1;');
        code.push('    return 0;');
        code.push('}');

        //ceate code
        //var sortList = [['id', 'ASC'], ['name', 'DESC']]
        var sortListCode = ['['];
        ast.order.forEach(function(x){
            if(sortListCode.length > 1)
                sortListCode.push(',');

            if(x.column instanceof yy.Column)
                sortListCode.push("['" + me.safeStr(x.column.as) + "',");
            else
                sortListCode.push("['" + me.parseExpression(x.column) + "',");

            sortListCode.push("'" + x.order + "']");
        });
        sortListCode.push('];');

        code.push('var sortList = ');
        code = code.concat(sortListCode);

        code.push('orderList = orderList.sort(function(a, b){');
        code.push('    for(var i = 0 ; i < sortList.length ; i ++){');
        code.push('        var sortRet = ___sortByResname(res[a], res[b], sortList[i][0]);');
        code.push('        if(sortRet != 0){');
        code.push('            return sortList[i][1] == "ASC" ? sortRet :-sortRet;');
        code.push('        }');
        code.push('    }');
        code.push('});');
        code.push('');

        //set limit
        if(ast.limit){
            code.push('orderList = ');
            if(ast.limit[1] == -1){
                code.push('orderList.slice(' + me.parseExpression(ast.limit[0]) + ');');
            }else{
                code.push('orderList.slice(' + me.parseExpression(ast.limit[0]) + ',' + me.parseExpression(ast.limit[0]) + '+' +  me.parseExpression(ast.limit[1]) +');');
            }
        }

        //push ordered data

        code.push('var orderRes = {};');
        code.push('orderList.forEach(x=>{');
        code.push('    orderRes[x] = res[x];');
        code.push('});');
        code.push('res = orderRes');
    }

    code.unshift('function (params){');
    code.push('return res;');
    code.push('}');

    return jsbeautify.js_beautify(code.join('\n'));
};


module.exports = compiler;