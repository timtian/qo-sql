# Qos

Qos(Query Object with Sql) is a babel plugin to query object in template literals with sql syntax

like this:
```js
    //testData
    var testData = require('./test/gen/test_data.js').arrayData;
```
```js
    var minid = 2;
    var data = `sql:select (id + 1) as index, name  from ${testData} where id > ${minid} and type == 'C'`
```



## Install
npm install babel-plugin-template-literals-qos

## Usage


```flow
st=>start: Start
op=>operation: Your Operation
cond=>condition: Yes or No?
e=>end

st->op->cond
cond(yes)->e
cond(no)->op
```
