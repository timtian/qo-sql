/**
 * Created by timtian on 2016/5/11.
 */


var alasql = require('alasql');



var a = 123;
var id = 2;

var data = [
    {
        id:1,
        name:'A'
    },
    {
        id:2,
        name:'B'
    },
    {
        id:3,
        name:'C'
    }
]

var res = alasql('SELECT  id, name, 1 as enable, "abc" as title, (id + 1) as ID2 FROM ?  WHERE id=2 AND name != "A"', [data]);

console.log(res);