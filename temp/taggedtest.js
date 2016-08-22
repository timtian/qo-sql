/**
 * Created by timtian on 2016/5/10.
 */


var a = 123;

var data2 =
{
    index1:{id:1, name:'A'},
    index2:{id:2, name:'B'},
    index3:{id:3, name:'C'},
    index31:{id:3, name:'E'},
    index4:{id:4, name:'D'},
    index32:{id:3, name:'F'}
};

var data3 = [
    {id2:2, type:'A', location:'CN', count:443},
    {id2:3, type:'A', location:'CN', count:78},
    {id2:4, type:'B', location:'EN', count:23342},
    {id2:5, type:'C', location:'EN', count:43},
    {id2:6, type:'B', location:'JP', count:4234},
    {id2:7, type:'A', location:'JP', count:3983}
]
var id = 2;
var start  = 1;
var c = 'cccc';
var ordername = 'id';


var tagged = require('../lib/tagged');


var data = tagged`select *, ${id} from ${data3} where id2=${id}`;


console.log(data);