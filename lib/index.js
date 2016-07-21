/**
 * Created by timtian on 2016/5/11.
 */

var _ = require('lodash');
var babylon = require('babylon');
var SQLParser = require('../src/parser/sqlparser');
var SQLComplile = require('../src/compiler');
var crypto = require('crypto');
var babel = require('babel-core');

var cacheFunc = {};


var defaultOptions = {
    prefix: 'sql:',
    mode: 'lodash'
};

var babel_options = {
    presets: [
        require('babel-preset-es2015')
    ],
    plugins: [
        require('babel-plugin-syntax-object-rest-spread'),
        require('babel-plugin-transform-object-rest-spread')
    ],
    babelrc: false
};

var lib = {
    exec: function (sql, params, options) {

        var key = crypto.createHash('md5').update(sql).digest('hex');

        if (!cacheFunc[key]) {
            var options = _.assign({}, defaultOptions, options);
            //parse and gen code
            var ast = SQLParser.parse(sql);
            ast.yy = SQLParser.yy;
            ast.yy.clear();

            var code = SQLComplile.exec(ast, {
                mode: options.mode,
                rawCode: sql
            });

            if (options.debug) {
                console.log(sql, '==>', code);
            }

            //get ${params}
            var parampattern = /\$\{([^}]+?)\}/gi;
            var callparams = [];
            while (parampattern.exec(sql)) {
                callparams.push('params["' + RegExp.$1 + '"]');
            }
            code = '(' + code + ')' + '([' + callparams.join(',') + '])';


            //gen loadsh code
            var genCode = babel.transform('let result = ' + code, babel_options);
            var genFunc = new Function('params', '_', genCode.code + ' return result;');
            cacheFunc[key] = genFunc;
        }

        return cacheFunc[key].call(params, params, _, options);
    }
};


module.exports = lib;