/**
 * Created by timtian on 2016/5/10.
 */

var babel = require('babel-core');

var options = {
    presets: [
        require('babel-preset-es2015')
    ],
    plugins: [
        require('babel-plugin-syntax-object-rest-spread'),
        require('babel-plugin-transform-object-rest-spread'),
        [require('../src/index.js'), { prefix: 'sql:' }]
    ],
    babelrc : false
};


var result = babel.transformFileSync('./testFile.js', options);

console.log(result.code);

eval(result.code);

//console.log(result.code);
