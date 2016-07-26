/**
 * Created by timtian on 2016/5/12.
 */


var _ = require('lodash');
var yy = require('./parser/yy');

var compiler = {};


compiler.mode = {
    inline:"INLINE",
    lib:"LIB",
    lodash:"LODASH"
};



compiler.exec = function (ast, options) {
    var impl = new (require('./impl/' + (options.mode || 'array') + '_impl' ))(options);
    return impl.exec(ast, options);

};


module.exports = compiler;