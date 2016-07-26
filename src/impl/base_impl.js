/**
 * Created by timtian on 2016/5/12.
 */


var _ = require('lodash');
var yy = require('../parser/yy');
var jsbeautify = require('js-beautify');

var compiler = function () {
};


compiler.prototype.exec = function (ast, options, path) {
};

compiler.prototype.parseOp = function (op) {

    if (op.op == "IN") {
        return "_.includes(" + this.parseExpressionList(op.right) + "," + this.parseExpression(op.left) + ')';
    }
    else if (op.op == "NOT IN") {
        return "!(_.includes(" + this.parseExpressionList(op.right) + "," + this.parseExpression(op.left) + '))';
    }
    else {

        var code = ['('];
        code = code.concat(this.parseExpression(op.left));

        if (op.op == "AND")
            code.push('&&');
        else if (op.op == "OR")
            code.push('||');
        else if (op.op == "=")
            code.push('==');
        else
            code.push(op.op);

        code = code.concat(this.parseExpression(op.right));
        code.push(')');

        return code.join(' ');
    }
};

compiler.prototype.parseExpressionList = function (list) {

    if (list instanceof Array) {
        var code = ['['];
        var me = this;
        list.forEach(function (item) {
            if (code.length > 1)
                code.push(',');
            code.push(me.parseExpression(item));
        });
        code.push(']');

        return code.join(' ');
    }

    return this.parseExpression(list);
};

compiler.prototype.parseExpression = function (expr) {
    var code = [];
    if (expr instanceof yy.Op) {
        code.push(this.parseOp(expr));
    } else if (expr instanceof yy.Column) {
        code.push(this.parseColumn(expr))
    } else if (expr instanceof yy.Value) {
        code.push(this.parseValue(expr));
    } else if (expr instanceof yy.ParamValue) {
        code.push(this.parseParam(expr));
    } else if (expr instanceof yy.FunctionValue) {
        //default push item in last args
        code.push(this.parseFunction(expr))
    }else{
        code.push(expr);
    }
    return code;
};

compiler.prototype.parseValue = function (value) {
    if (typeof value.value === 'string') {
        return "'" + this.safeStr(value.value) + "'";
    } else {
        return value.value;
    }
};

compiler.prototype.parseParam = function (paramValue) {
    return 'params[' + paramValue.index + ']';
};

compiler.prototype.parseFunction = function (funValue, exparams) {
    return funValue.name + '(' + this.parseExpression(funValue.params) + ',' + (exparams ? exparams.join(',') : 'item') + ')';
};

compiler.prototype.parseColumn = function (col) {
    var code = [];
    var me = this;
    col.value.forEach(function (x) {
        code.push("item['" + me.safeStr(x) + "']")
    });
    return code.join('');
};

compiler.prototype.safeStr = function (name) {
    return name.replace(/'/gi, "\\\'")
};

compiler.prototype.parseReturnColumns = function (columns, options) {

    options = options || {};
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
                code.push(this.parseColumn(col));
            }
        } else if (col instanceof yy.Op) {
            code.push(this.parseOp(col));
        } else if (col instanceof yy.ParamValue) {
            code.push('params[' + col.index + ']');
        } else if (col instanceof yy.FunctionValue) {
            if (options.trans && options.trans.functionValue) {
                code.push(options.trans.functionValue(col));
            } else {
                code.push(this.parseFunction(col));
            }
        }
    }
    code.push('}');

    return code;
};

compiler.prototype.createComment = function (comment) {
    var code = [];
    code.push('/**');
    code.push(comment.replace(/(.+)/gi, '* $1'));
    code.push('*/');

    return code.join('\n');
};

compiler.prototype.parseFrom = function (from) {

};


module.exports = compiler;