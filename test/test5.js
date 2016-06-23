
var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

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

var res = function (params) {
    var source = params[0];
    var keys = Object.keys(source);
    var res = {};
    var orderList = [];
    for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var item = source[key]; //set where expression here
        if (item['id'] + 1 > params[1] && item['name'] != 'B') {
            res[key] = _extends({
                'id': item['id'],
                'id2': item['id'] + 1,
                'name2': item['name'] + 'ABC',
                'c': item['c']
            }, item); //set order expression
            orderList.push(key);
        }
    }


    function ___sortByResname(a,b,name){
        if(a[name] < b[name])
            return -1;
        else if(a[name] != b[name])
            return 1;
        return 0;
    }


    var sortList = [['id', 'asc'], ['name', 'desc']];
    orderList = orderList.sort(function(a, b){
        for(let i = 0 ; i < sortList.length ; i ++){
            var sortRet = ___sortByResname(res[a], res[b], sortList[i][0]);
            if(sortRet != 0){
                return sortList[i][1] == 'asc' ? sortRet :-sortRet;
            }
        }
    });

    var orderRes = {};
    orderList.forEach(x=>{
        orderRes[x] = res[x]
    });



    console.log(orderRes)
    //console.log(orderList)


    return res;
}([data2, id + 1]);


//console.log(res);