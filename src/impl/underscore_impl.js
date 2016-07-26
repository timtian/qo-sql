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

compiler.prototype.exec = function(ast, options, path){
    var code = [];
    var me = this;

    code.push(me.createComment(options.rawCode));

    code.push('var source = params[' + ast.from.from[0].index + '];');
    code.push('var res = _.chain(source)');

    // set where
    if (ast.where) {
        code.push('.filter(item=>{');
        code.push('    return ' + me.parseOp(ast.where) + ';');
        code.push('})');
    }


    if(ast.group){
        code.push('.groupBy(item=>{');

        code.push('    return ""');
        ast.group.forEach(function(x){
            code.push(' + "_" + ')
            code.push(me.parseExpression(x));
        });

        code.push('})');

        //set aggregate result
        code.push('.reduce((result, value, key)=>{');
        code.push('var item = value[0]');
        code.push('var aggitem = ');
        code = code.concat(this.parseReturnColumns(ast.columns, {
            trans:{
                functionValue:function(col){
                    var aggCode = [];
                    switch (col.name.toLowerCase()){
                        case "sum" :
                            aggCode.push('(()=>{');
                            aggCode.push('var sum = 0;');
                            aggCode.push('value.forEach(item=>{');
                            aggCode.push("    sum += " +  me.parseExpression(col.params) + ";");
                            aggCode.push('});');
                            aggCode.push('return sum;');
                            aggCode.push('})()');
                            break;
                        case "min" :
                            aggCode.push('(()=>{');
                            aggCode.push('var min = Number.MAX_VALUE;');
                            aggCode.push('value.forEach(item=>{');
                            aggCode.push("    min = Math.min(min, " + me.parseExpression(col.params) + ");");
                            aggCode.push('});');
                            aggCode.push('return min;');
                            aggCode.push('})()');
                            break;
                        case "max" :
                            aggCode.push('(()=>{');
                            aggCode.push('var max = Number.MIN_VALUE;');
                            aggCode.push('value.forEach(item=>{');
                            aggCode.push("    max = Math.max(max, " + me.parseExpression(col.params) + ");");
                            aggCode.push('});');
                            aggCode.push('return max;');
                            aggCode.push('})()');
                            break;
                        case "avg" :
                            aggCode.push('(()=>{');
                            aggCode.push('var sum = 0;');
                            aggCode.push('value.forEach(item=>{');
                            aggCode.push("    sum += " +  me.parseExpression(col.params) + ";");
                            aggCode.push('});');
                            aggCode.push('return sum / value.length;');
                            aggCode.push('})()');
                            break;
                        case "count" :
                            aggCode.push('value.length');
                            break;
                        default:
                            aggCode.push(me.parseFunction(col, ['result', 'value', 'key']));
                    }
                    return aggCode.join('\n');

                }
            }
        }));

        code.push('result.push(aggitem);');
        code.push('return result;');
        code.push('}, [])');
    }
    else{
        //2. normal select .map(item=>{return xx});
        code.push('.map(item=>{ return ');
        code =  code.concat(me.parseReturnColumns(ast.columns));
        code.push('})');
    }


    //get value .value();
    code.push('.value()');


    //set order .sort()
    if (ast.order) {
        //ceate code
        var sortListCode = ['['];
        ast.order.forEach(function(x){
            if(sortListCode.length > 1)
                sortListCode.push(',');

            if(x.column instanceof yy.Column)
                sortListCode.push("['" + me.safeStr(x.column.as) + "',");
            else
                sortListCode.push("[" + me.parseExpression(x.column) + ",");


            if(x.order instanceof yy.ParamValue){
                sortListCode.push(me.parseExpression(x.order));
            }else {
                sortListCode.push("'" + x.order + "'");
            }
            sortListCode.push("]");

        });
        sortListCode.push('];');



        code.push('.sort((a, b)=>{');
        code.push('    var sortList = ');
        code = code.concat(sortListCode);
        code.push('    for(var i = 0 ; i < sortList.length ; i ++){');
        code.push('        var sortName = sortList[i][0];');
        code.push('        var sortRet = 0;');
        code.push('        if(a[sortName] < b[sortName])');
        code.push('            sortRet =  -1;');
        code.push('        else if(a[sortName] != b[sortName])');
        code.push('            sortRet =  1;');
        code.push('        if(sortRet != 0){');
        code.push('            return sortList[i][1] == "ASC" ? sortRet :-sortRet;');
        code.push('        }');
        code.push('    }');
        code.push('   return 0;');
        code.push('})');


    }

    //4. set limit .slice(x,y)
    if(ast.limit){
        code.push('.slice(');
        if(ast.limit[1].value < 0){
            code.push(me.parseExpression(ast.limit[0]));
        }else{
            code.push(me.parseExpression(ast.limit[0]) + ',' + me.parseExpression(ast.limit[0]) + '+' +  me.parseExpression(ast.limit[1]));
        }
        code.push(')');
    }

    code.unshift('function (params){');
    code.push('return res;');
    code.push('}');

    return jsbeautify.js_beautify(code.join('\n'));
};

module.exports = compiler;