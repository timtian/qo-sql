# Qos
[![Build Status](https://travis-ci.org/timtian/Qos.svg?branch=master)](https://travis-ci.org/timtian/Qos)


Qos(Query Object with Sql)
It is a implementation of object query with template literals of JavaScript using Sql

![babel-plugin-flow](https://raw.githubusercontent.com/timtian/Qos/master/docs/babel-plugin-flow.png)

## document
- [中文](https://github.com/timtian/Qos/blob/master/docs/README_CN.md)
- [English](https://github.com/timtian/Qos/blob/master/README.md)

## specialty


It support a unified、convenient and clear way to query object by unite Sql and libs(lodash,underscore,immutablejs).
- It`s easy to read and understand with SQL the ancient and declarative syntax.
- It`s straightforward and flexible to pass parameters in template literals.
- It will compile the source code to the target code,avoiding the performance problem of compiling at running time.
- It will ensure the stability and performance of code by using the realization of the mature(lodash,underscore).
- It just focuses on Object querying compared with other libs of Sql.


In

```js
    //testData
    var testData = require('../test/gen/test_data.js').arrayData;
```
```js
    var minid = 2;
    var data = `sql:select (id + 1) as index, name  from ${testData} where id > ${minid} and type == 'C'`
```

Out

```js
'use strict';

var _ = require('loadsh');
var testData = require('../test/gen/test_data.js').arrayData;
var minid = 2;
var data = function (params) {
  /**
   * select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'
   */var source = params[0];var res = _.chain(source).filter(function (item) {
    return item['id'] > params[1] && item['type'] == 'C';
  }).map(function (item) {
    return { 'index': item['id'] + 1, 'name': item['name'] };
  }).value();return res;
}([testData, minid]);

```


## Install
```
npm install babel-plugin-template-literals-qos
```

Conversion relies on object-rest-spread.Please ensure that you have installed the following  components
```
npm install babel-plugin-syntax-object-rest-spread
npm install babel-plugin-transform-object-rest-spread
```


## Usage


### Via .babelrc
```
{
    "plugins": [
        ["babel-plugin-template-literals-qos", {
            prefix:'sql:',
            mode:'lodash'
        }
    ]
}
```

### Via Node API
```
var babel = require('babel-core');
var _ = require('lodash');

var options = {
    presets: [
        require('babel-preset-es2015')
    ],
    plugins: [
        require('babel-plugin-syntax-object-rest-spread'),
        require('babel-plugin-transform-object-rest-spread'),
        [require('../src/index.js'), { prefix: 'sql:', mode :'lodash' }]
    ],
    babelrc : false
};

var result = babel.transform('code', options);

```



### Via Node Api As lib
```
var _ = require('lodash');
var qos = require('babel-plugin-template-literals-qos/lib');
var testData = require('../test/gen/test_data.js').arrayData;


var res = qos.exec("select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'", {
    testData : testData,
    minid : 2
})

console.log(res);

```

### Options


- prefix:(string) default = 'sql:'
- mode:(lodash|underscore)




### Example



- filter
```
   testCase.selectById = function(id){
       return `sql:select * from ${testData} where id=${id}`;
   };

   testCase.selectByNotEqId = function(excludeId, minId){
       return `sql:select * from ${testData} where id!=${excludeId} and id > ${minId}`;
   };

   testCase.selectByIdAndName = function(id,name){
       return `sql:select * from ${testData} where id=${id} and name=${name}`;
   };

   testCase.selectByIdOrCount = function(id, mincount){
       return `sql:select * from ${testData} where id=${id} or count>${mincount}`;
   };

   testCase.selectByBwId = function(minid, maxid){
       return `sql:select * from ${testData} where id>=${minid} and id<=${maxid}`;
   };
```
- sorting and intercept
```
   testCase.selectByBwIdWithOrder = function(minid, maxid, start, count){
       return `sql:select * from ${testData} where id>=${minid} and id<=${maxid} order by type, count desc limit ${start}, ${count}`;
   };
```
- querying of IN
```
   testCase.selectByInCountryListAndNotInTypeList = function(ctyList, typeList){
       return `sql:select * from ${testData} where country IN ${ctyList} AND type NOT IN ${typeList}`;
   };
```

- self-defined result
```
   testCase.selectFieldWithExpressionByType = function(type){
       return `sql:select id as ID, (id + 1) as ID2, (id / 3) as ID3, (city + '@' + country)  as address, testCase.formatter.formatMoney(count) from ${testData} where type=${type}`;
   };
```
- Grouping and aggregation function
>supporting min, max, count, sum, avg

```
   testCase.selectAggByTypeAndCountry = function(minId){
       return `sql:select type, country, min(count) as min, max(count) as max, count(*) as total, sum(count) as sum from ${testData} WHERE id >${minId} group by type, country order by country, type`;
   };

```

- custom function
>calling function in context
>It will pass the specified filed and the row`s content to callback(field, rowItem)
```
   testCase.selectFieldWithExpressionByType = function(type){
       return `sql:select *, testCase.formatter.formatMoney(count) as money from ${testData} where type=${type}`;
   };
```


- more examples

>[Examples](https://github.com/timtian/Qos/blob/master/test/gen/test_main.js)

>after compiling

>[Compile to lodash](https://github.com/timtian/Qos/blob/master/test/gen/test_main.lodash.gen.js)


>[Compile to underscore](https://github.com/timtian/Qos/blob/master/test/gen/test_main.underscore.gen.js)
