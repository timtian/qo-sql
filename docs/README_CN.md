# qo-sql
[![Build Status](https://travis-ci.org/timtian/qo-sql.svg?branch=master)](https://travis-ci.org/timtian/qo-sql)
[![codecov](https://codecov.io/gh/timtian/qo-sql/branch/master/graph/badge.svg)](https://codecov.io/gh/timtian/qo-sql)
[![Code Climate](https://codeclimate.com/github/timtian/qo-sql/badges/gpa.svg)](https://codeclimate.com/github/timtian/qo-sql)
[![NPM version](https://badge.fury.io/js/qo-sql.svg)](http://badge.fury.io/js/qo-sql)

qo-sql(Query Object with Sql)
是用于在js的template literals中使用sql查询语法进行对象查询的一种实现

![babel-plugin-flow](https://raw.githubusercontent.com/timtian/qo-sql/master/docs/babel-plugin-flow.png)

## 文档

- [中文](https://github.com/timtian/qo-sql/blob/master/docs/README_CN.md)
- [English](https://github.com/timtian/qo-sql/blob/master/README.md)

## 特点

将SQL语法查询连接已存在的各种丰富lib(lodash, underscore, immutablejs),提供一种统一的、便捷的、透明的对象查询方法。

- 使用SQL声明式的语法特别适合在查询，易于阅读与理解。
- 在template literals语法中传递参数更加直接明了，灵活的上下文。
- 编译过程直接将最终实现代码编译至目标源码中,消除了在运行时编译性能问题。
- 使用成熟实现(lodash, underscore)在稳定性与性能上更加有所保证。
- 与其它SQL之类相比更加简单轻量聚焦于Object查询
- 支持babel-plugin模式与lib调用模式


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
npm install qo-sql
```

转换需要依赖object-rest-spread。确保以下组件已安装
```
npm install babel-plugin-syntax-object-rest-spread
npm install babel-plugin-transform-object-rest-spread
```


## Usage

### babel-plugin使用
Via .babelrc
```
{
    "plugins": [
        ["qo-sql", {
            prefix:'sql:',
            mode:'lodash'
        }
    ]
}
```

Via Node API
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


### 做为类库直接调用
Via Node Api As lib
```
var _ = require('lodash');
var qos = require('qo-sql/lib');
var testData = require('../test/gen/test_data.js').arrayData;


var res = qos.exec("select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'", {
    testData : testData,
    minid : 2
})

console.log(res);

```

### Options


- prefix:(string)
> 默认为'sql:',仅在作为babel-plugin中有效


- mode:(lodash|underscore)
> 编译的目标使用类库，默认为(lodash)



## Example

- 条件过滤
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
- 排序及截取
```
   testCase.selectByBwIdWithOrder = function(minid, maxid, start, count){
       return `sql:select * from ${testData} where id>=${minid} and id<=${maxid} order by type, count desc limit ${start}, ${count}`;
   };
```
- IN查询支持
```
   testCase.selectByInCountryListAndNotInTypeList = function(ctyList, typeList){
       return `sql:select * from ${testData} where country IN ${ctyList} AND type NOT IN ${typeList}`;
   };
```

- 自定义查询结果
```
   testCase.selectFieldWithExpressionByType = function(type){
       return `sql:select id as ID, (id + 1) as ID2, (id / 3) as ID3, (city + '@' + country)  as address, testCase.formatter.formatMoney(count) from ${testData} where type=${type}`;
   };
```
- 分组及聚合函数
>支持 min, max, count, sum, avg

```
   testCase.selectAggByTypeAndCountry = function(minId){
       return `sql:select type, country, min(count) as min, max(count) as max, count(*) as total, sum(count) as sum from ${testData} WHERE id >${minId} group by type, country order by country, type`;
   };

```

- 自定义函数调用
>调用当前上下文中的函数
>callback(field, rowItem) 中将 传递指定的字段与行内容
```
   testCase.selectFieldWithExpressionByType = function(type){
       return `sql:select *, testCase.formatter.formatMoney(count) as money from ${testData} where type=${type}`;
   };
```


- 更多示例

>[Examples](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.js)

>编译后

>[Compile to lodash](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.lodash.gen.js)

>[Compile to underscore](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.underscore.gen.js)