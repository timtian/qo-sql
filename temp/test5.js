var _ = require('loadsh');
var testData = require('../test/gen/test_data.js').arrayData;
var minid = 2;
var data = `sql:select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'`;

