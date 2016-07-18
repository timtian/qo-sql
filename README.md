# Qos

Qos(Query Object with Sql)
是用于在js的template literals中使用sql查询语法进行对象查询的一种实现

## 目标设计
希望将SQL语法查询连接已存在的各种丰富lib(lodash, underscore, immutablejs),
提供一种统一的、便捷的、透明的对象查询方法。

## 特点

- 使用SQL语法这种古老的声明式的语法特别在查询时易于阅读与理解。
- 在template literals语法中传递参数更加直接明了，灵活易用。
- 编译过程直接将最终实现代码编译至目标源码中,消除了在运行时编译性能问题。
- 使用成熟实现(lodash, underscore)在稳定性与性能上更加有所保证。



Before

```js
    //testData
    var testData = require('../test/gen/test_data.js').arrayData;
```
```js
    var minid = 2;
    var data = `sql:select (id + 1) as index, name  from ${testData} where id > ${minid} and type == 'C'`
```

After compile

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
npm install babel-plugin-template-literals-qos

## Usage
Add the following line to your .babelrc file:
```
{
    "plugins": ["babel-plugin-template-literals-qos"]
}
```

```flow
st=>start: Start
op=>operation: Your Operation
cond=>condition: Yes or No?
e=>end

st->op->cond
cond(yes)->e
cond(no)->op
```
