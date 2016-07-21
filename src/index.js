/**
 * Created by timtian on 2016/5/11.
 */

var _ = require('lodash');
var babylon = require('babylon');
var SQLParser = require('./parser/sqlparser');
var SQLComplile = require('./compiler');
var t = require('babel-types');
var qoslib = require('././index');


var Qos = {
    manipulateOptions : function(){

    },
    visitor:{
        Program: {
            enter(path, state) {
                //console.log("Entered!");
            },
            exit() {
                //console.log("Exited!");
            }
        },
        TemplateLiteral : function(path, state){
            var rawCode = _.trim(this.file.code.substring(path.node.start, path.node.end), '`');

            var defaultOptions = {
                prefix : 'sql:',
                mode:'lodash'
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

            var code = SQLComplile.exec(ast, {
                mode:options.mode,
                rawCode:rawCode
            }, path);


            if(options.debug){
                console.log(rawCode, '==>', code);
            }


            //save the TemplateLiteral expressions
            var preexp = path.node.expressions;
            var replacement = babylon.parse( '(' + code + ')' , {plugins:['objectRestSpread']});
            replacement = replacement.program.body[0].expression;
            //path.replaceWithSourceString(code);
            path.replaceWith(
                t.callExpression(replacement, [t.arrayExpression(preexp)])
            );
        }
    },
    exec : function(sql, params, options){
        return qoslib.exec(sql, params, options);
    }
};

module.exports = Qos;