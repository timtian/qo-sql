var _ = require('lodash');
var a = 123;

var data2 = {
    index1: {id: 1, name: 'A'},
    index2: {id: 2, name: 'B'},
    index3: {id: 3, name: 'C'},
    index31: {id: 3, name: 'E'},
    index4: {id: 4, name: 'D'},
    index32: {id: 3, name: 'F'}
};

var data3 = [{id2: 2, type: 'A', location: 'CN', count: 443}, {id2: 3, type: 'A', location: 'CN', count: 78}, {
    id2: 4,
    type: 'B',
    location: 'EN',
    count: 23342
}, {id2: 5, type: 'C', location: 'EN', count: 43}, {id2: 6, type: 'B', location: 'JP', count: 4234}, {
    id2: 7,
    type: 'A',
    location: 'JP',
    count: 3983
}];
var id = 2;
var start = 1;
var c = 'cccc';
var ordername = 'id';

//var res = `sql:
//SELECT   id,
//         (id   + 1)     AS id2,
//         (name + "ABC") AS name2,
//         (${c} + '12')  AS c,
//         *
//FROM     ${data2}
//WHERE    (id+1)>${id + 1}
//AND      name != "B"
//ORDER BY ${ordername},
//         name2 DESC
//LIMIT    ${start}, 2`;

var res2 = function (params) {
    /*
     * select type, location, sum(count) as count from ${data3} where id2>=3 group by type, location
     */
    var source = params[0];
    var res = _.chain(source).filter(function (item) {
        return item['id2'] >= 3;
    }).groupBy(function (item) {
        return "" + "_" + item['type'] + "_" + item['location'];
    }).reduce(function (result, item, key) {
        var aggitem = {
            'type': item['type'], 'location': item['location'], 'count': function () {
                var sum = 0;
                item.forEach(function (item) {
                    sum += item['count'];
                });
                return sum;
            }()
        };
        result.push(aggitem);

        return result;
    }, []).value();
    return res;
}([data3]);

console.log(res2);