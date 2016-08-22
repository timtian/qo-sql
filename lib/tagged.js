/**
 * Created by timtian on 2016/8/19.
 */

var qos = require('./index');

var taggedFunc = function(strings,...values){

    var raw = '';
    var data = {};
    for(var i = 0 ; i < strings.length; ++i){
        raw += strings[i];

        if(i < values.length) {
            raw += `\$\{data_${i}\}`;
            data[`data_${i}`] = values[i];
        }
    }

    return qos.exec(raw, data);
};

module.exports = taggedFunc;