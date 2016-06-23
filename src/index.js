/**
 * Created by timtian on 2016/5/11.
 */

var _ = require('lodash');
var babylon = require('babylon');
var SQLParser = require('./parser/sqlparser');
var SQLComplile = require('./compiler');
var t = require('babel-types');

var sql_template_plguin = {
    manipulateOptions : function(){

    },
    visitor:{
        TemplateLiteral : function(path, state){
            var rawCode = _.trim(this.file.code.substring(path.node.start, path.node.end), '`');

            var defaultOptions = {
                prefix : 'sql:'
            };

            var options = _.assign({}, defaultOptions, state.opts);

            //如果不命中则直接返回
            if(rawCode.substring(0, options.prefix.length).toLowerCase() != options.prefix.toLowerCase()){
                return;
            }else{
                rawCode = rawCode.substring(options.prefix.length);
            }

            //parse and gen code
            var ast = SQLParser.parse(rawCode);
            ast.yy = SQLParser.yy;
            ast.yy.clear();

            var code = SQLComplile.exec(ast, path);

            //keep the TemplateLiteral expressions
            var preexp = path.node.expressions;
            //var destNode = babylon.parse( code , {plugins:['objectRestSpread']});
            var replacement = babylon.parse( '(' + code + ')' , {plugins:['objectRestSpread']});
            replacement = replacement.program.body[0].expression;

            //path.replaceWithSourceString(code);
            path.replaceWith(
                t.callExpression(replacement, [t.arrayExpression(preexp)])
            );
        }
    }
};

module.exports = sql_template_plguin;