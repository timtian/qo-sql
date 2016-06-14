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
    index4:{
        id:4,
        name:'D'
    }
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
var res = `sql:SELECT id, (id + 1) as id2, (name + "ABC") as name2, c, * FROM ${data2} WHERE (id+1)>${id + 1} AND name != "B"`;

var data4 = {
    a:123,
    ...data2
}

console.log(data4);

console.log(res);

