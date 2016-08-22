var _ = require('lodash');
var qos = require('../lib');
var testData = require('../test/gen/test_data.js').arrayData;




var exp = testData.filter(function(item){
    return item.id <= 23;
}).sort(function(a, b){
    console.log(a.id, b.id);
    if(a.type == b.type){
        //count desc

        if(a.count == b.count) {
            console.log('eq', a.id, b.id);
            return 0;
        }

        return  -(a.count - b.count);
    }else{
        //type asc
        return a.type > b.type ? 1 : -1;
    }
});

var res = qos.exec("select * from ${data} where id=${id}", {
    data:testData,
    id:2
});

console.log(res);




