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

compiler.prototype.exec = function (ast, optinos, path) {
    var code = [];
    var me = this;
    code.push('var source = params[' + ast.from.from[0].index + '];');
    code.push('var keys = Object.keys(source);');



    //convert object to Array
    code.push('if(!(source instanceof Array)){');
    code.push('    var sourceArr = [];');
    code.push('    Object.keys(source).forEach(x=>{');
    code.push('        sourceArr.push({');
    code.push('            __key__:x,');
    code.push('            ...source[x]');
    code.push('        })');
    code.push('    });');
    code.push('    source = sourceArr;');
    code.push('}');



    //1. set where
    if (ast.where) {
        code.push('//set where expression here');
        code.push('source = source.filter(item=>{');
        code.push('    return ' + me.parseOp(ast.where) + ';');
        code.push('});');
    }



    //2. set order
    if (ast.order) {
        code.push('function ___sortByResname(a,b,name){');
        code.push('    if(a[name] < b[name])');
        code.push('        return -1;');
        code.push('    else if(a[name] != b[name])');
        code.push('        return 1;');
        code.push('    return 0;');
        code.push('}');

        //ceate code
        var sortListCode = ['['];
        ast.order.forEach(function(x){
            if(sortListCode.length > 1)
                sortListCode.push(',');

            if(x.column instanceof yy.Column)
                sortListCode.push("['" + me.safeStr(x.column.as) + "',");
            else
                sortListCode.push("[" + me.parseExpression(x.column) + ",");

            sortListCode.push("'" + x.order + "']");
        });
        sortListCode.push('];');

        code.push('var sortList = ');
        code = code.concat(sortListCode);

        code.push('source.sort((a, b)=>{');
        code.push('    for(var i = 0 ; i < sortList.length ; i ++){');
        code.push('        var sortRet = ___sortByResname(a, b, sortList[i][0]);');
        code.push('        if(sortRet != 0){');
        code.push('            return sortList[i][1] == "ASC" ? sortRet :-sortRet;');
        code.push('        }');
        code.push('    }');
        code.push('})');
    }

    //3. set limit
    if(ast.limit){
        code.push('source = source.slice(');
        if(ast.limit[1] == -1){
            code.push(me.parseExpression(ast.limit[0]));
        }else{
            code.push(me.parseExpression(ast.limit[0]) + ',' + me.parseExpression(ast.limit[0]) + '+' +  me.parseExpression(ast.limit[1]));
        }
        code.push(')');
    }


    //4. set select
    code.push('source = source.map(item=>{ return ');
    code =  code.concat(me.parseReturnColumns(ast.columns));
    code.push('})');

    code.unshift('function (params){');
    code.push('return source;');
    code.push('}');

    return jsbeautify.js_beautify(code.join('\n'));
};




module.exports = compiler;