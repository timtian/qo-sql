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
];


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
    },
};


var source = data2;

var keys = Object.keys(source);
var res = {};
var orderList = [];
for(var i = 0; i < keys.length; ++i){
    var key = keys[i];
    var item = source[key];
    //set where expression here
    if(item.id > 2 && item.name != 'B'){
        res[key] = item;
        //set order expression
        orderList.push({
            key:key,
            value:item.id
        });
    }
}

//set order
orderList.sort((x,y)=>{
    return x.value == y.value ? 0 : (x.value > y.value ? -1 : 1);
});

//set top
orderList = orderList.slice(0, 1);

var output = {};
orderList.forEach(x=>{
    output[x.key] = res[x.key];
});


console.log('orderList');
console.log(orderList);
console.log('output');
console.log(output);