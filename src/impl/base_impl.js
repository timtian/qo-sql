/**
 * Created by timtian on 2016/5/12.
 */


var _ = require('lodash');
var yy = require('../parser/yy');
var jsbeautify = require('js-beautify');

var compiler = function(options){
    this.options = options;
};


compiler.prototype.exec = function (ast, optinos, path) {
    var code = ['not impl'];
    return jsbeautify.js_beautify(code.join('\n'));
};

compiler.prototype.parseOp = function (op) {

    var code = ['('];
    code = code.concat(this.parseExpression(op.left));

    if (op.op == "AND")
        code.push('&&');
    else if (op.op == "OR")
        code.push('||');
    else
        code.push(op.op);

    code = code.concat(this.parseExpression(op.right));
    code.push(')');

    return code.join(' ');
};

compiler.prototype.parseExpression = function (expr) {
    var code = [];
    if (expr instanceof yy.Op) {
        code.push(this.parseOp(expr));
    } else if (expr instanceof yy.Column) {
        code.push('item' + this.parseColumn(expr))
    } else if (expr instanceof yy.Value) {
        if (typeof expr.value === 'string') {
            code.push("'" + this.safeStr(expr.value) + "'");
        } else {
            code.push(expr.value);
        }
    } else if (expr instanceof yy.ParamValue) {
        code.push('params[' + expr.index + ']');
    }
    return code;
};

compiler.prototype.parseColumn = function (col) {
    var code = [];
    var me = this;
    col.value.forEach(function (x) {
        code.push("['" + me.safeStr(x) + "']")
    });
    return code.join('');
};

compiler.prototype.safeStr = function (name) {
    return name.replace(/'/gi, "\\\'")
};



compiler.prototype.parseReturnColumns = function (columns, options) {

    var code = ['{'];
    for (var i = 0; i < columns.length; i++) {

        var col = columns[i];

        if (i > 0)
            code.push(',');

        //set [as] or default field name
        code.push("'" + this.safeStr(col.as || "field_" + i) + "' : ");
        if (col instanceof yy.Column) {
            if (col.value[0] === '*') {
                code.pop();
                code.push('...item')
            } else {
                code.push('item' + this.parseColumn(col));
            }
        } else if (col instanceof yy.Op) {
            code.push(this.parseOp(col));
        } else if (col instanceof yy.ParamValue){
            code.push('params[' + col.index + ']');
        } else if (col instanceof yy.FunctionValue){
            if(options.trans && options.trans.functionValue){
                code.push(options.trans.functionValue(col));
            }else {
                code.push(col.name + '(' + this.parseExpression(col.params) + ')')
            }
        }
    }
    code.push('}');

    return code;
};


compiler.prototype.createComment = function(comment){
    var code = [];
    code.push('/*');
    code.push(comment.replace(/(.+)/gi, '* $1'));
    code.push('*/');

    return code.join('\n');
};
/**
 * @param from
 */
compiler.prototype.parseFrom = function (from) {

};


module.exports = compiler;