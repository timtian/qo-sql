/**
 * Created by timtian on 2016/5/10.
 */

var babel = require('babel-core');
var _ = require('lodash');

var options = {
    presets: [
        require('babel-preset-es2015')
    ],
    plugins: [
        require('babel-plugin-syntax-object-rest-spread'),
        require('babel-plugin-transform-object-rest-spread'),
        [require('../src/index.js'), { prefix: 'sql:', mode :'lodash' }]
    ],
    babelrc : false
};


var result = babel.transformFileSync('./test5.js', options);

console.log(result.code);

//eval(result.code);

//console.log(result.code);
