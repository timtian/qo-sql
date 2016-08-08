# qo-sql
[![Build Status](https://travis-ci.org/timtian/qo-sql.svg?branch=master)](https://travis-ci.org/timtian/qo-sql)
[![codecov](https://codecov.io/gh/timtian/qo-sql/branch/master/graph/badge.svg)](https://codecov.io/gh/timtian/qo-sql)
[![Code Climate](https://codeclimate.com/github/timtian/qo-sql/badges/gpa.svg)](https://codeclimate.com/github/timtian/qo-sql)
[![NPM version](https://badge.fury.io/js/qo-sql.svg)](http://badge.fury.io/js/qo-sql)

qo-sql(Query Object with Sql)
> a simple way to query object/array with sql, it's will compile to lodash/underscore
> you can use it as babel-plugin or lib.

## Install
```
npm install qo-sql
npm install babel-plugin-syntax-object-rest-spread
npm install babel-plugin-transform-object-rest-spread

```

## Usage

## Lib Mode
```
var _ = require('lodash');
var qos = require('qo-sql/lib');
var testData = require('../test/gen/test_data.js').arrayData;


var res = qos.exec("select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'", {
    testData : testData,
    minid : 2
})

```

## Babel-plugin Mode

> babel-plugin mode support query object in template-literals

such as
```
var testData = require('../test/gen/test_data.js').arrayData;;
var minid = 2;

var result = `sql:select (id + 1) as index, name  from ${testData} where id > ${minid} and type = 'C'`;
```

### Via .babelrc
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
        [require('qo-sql'), { prefix: 'sql:', mode :'lodash' }]
    ],
    babelrc : false
};

var result = babel.transform('code', options);

```

### Options

- prefix:(string) default = 'sql:'
- mode:(lodash|underscore) default = 'underscore'


### Example

- SELECT
```
    `sql:select id as ID, (id + 1) as ID2, (id / 3) as ID3, (city + '@' + country)  as address, testCase.formatter.formatMoney(count) from ${testData} where type=${type}`;
```

- WHERE
```
    `sql:select * from ${testData} where id=${id}`;
```

```
    `sql:select * from ${testData} where id!=${excludeId} and id > ${minId}`;
```

```
    `sql:select * from ${testData} where id=${id} and name=${name}`;
```
```
    `sql:select * from ${testData} where id=${id} or count>${mincount}`;
```

```
    `sql:select * from ${testData} where id>=${minid} and id<=${maxid}`;
```

```
    `sql:select * from ${testData} where country IN ${ctyList} AND type NOT IN ${typeList}`;
```

- ORDER、LIMIT
```
    `sql:select * from ${testData} where id>=${minid} and id<=${maxid} order by type, count desc limit ${start}, ${count}`;
```


- GROUP and Aggregation
>support min, max, count, sum, avg
```
    `sql:select type, country, min(count) as min, max(count) as max, count(*) as total, sum(count) as sum from ${testData} WHERE id >${minId} group by type, country order by country, type`;
```

- Custom function
```
   `sql:select *, testCase.formatter.formatMoney(count) as money from ${testData} where type=${type}`;
```

### More example

>[Examples](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.js)

>after compiling

>[Compile to lodash](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.lodash.gen.js)
>[Compile to underscore](https://github.com/timtian/qo-sql/blob/master/test/gen/test_main.underscore.gen.js)

