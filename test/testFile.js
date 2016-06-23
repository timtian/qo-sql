/**
 * Created by timtian on 2016/5/10.test
 */

var a = 123;

var data2 =
{
    index1:{
        id:1,
        name:'A'
    },
    index2:{
        id:2,
        name:'B'
    },
    index3:{
        id:3,
        name:'C'
    },
    index31:{
        id:3,
        name:'E'
    },
    index4:{
        id:4,
        name:'D'
    },
    index32:{
        id:3,
        name:'F'
    },
};

var data3 = [
    {
        id2:2,
        count:22
    },
    {
        id2:3,
        count:33
    }
]
var id = 2;
var start  = 1;
var c = 'cccc';
var res = `sql:SELECT  id, (id + 1) as id2, (name + "ABC") as name2, * FROM ${data2} WHERE (id+1)>${id + 1} AND name != "B" ORDER BY id, name2 desc LIMIT 1, 2`;


var res2 = `sql:select id2 from ${data3} where id2>=3`;

console.log(res2);
console.log(res);

