var _ = require('lodash');
var qos = require('../lib');
var testData = require('../test/gen/test_data.js').arrayData;


var res = qos.exec("select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'", {
    testData : testData,
    minid : 2
})


console.log(res);



