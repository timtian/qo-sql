# templateliteral-sql


Qos(Query Object withe Sql) is a babel plugin to query obejct withe sql syntax

##Basic usage
```js
 var data =  [
    {
        "id": 1,
        "name": "Finn Obrien",
        "email": "Sed.eu@sedtortor.co.uk",
        "count": 103,
        "type": "A",
        "city": "Iqaluit",
        "country": "Canada",
        "birthday": "497520060"
    },
    {
        "id": 2,
        "name": "Mohammad Anderson",
        "email": "luctus.ipsum@egestashendreritneque.com",
        "count": 81,
        "type": "C",
        "city": "Rae-Edzo",
        "country": "Canada",
        "birthday": "1375970900"
    },
    {
        "id": 3,
        "name": "Hector Hopper",
        "email": "lorem.sit@torquent.co.uk",
        "count": 34,
        "type": "D",
        "city": "Stornaway",
        "country": "United Kingdom",
        "birthday": "848072131"
    },
    {
        "id": 4,
        "name": "Brody Mathis",
        "email": "rutrum@ac.org",
        "count": 118,
        "type": "C",
        "city": "Olathe",
        "country": "United States",
        "birthday": "558425996"
    }];

 var minid = 2;
 var type = 'C';
 var data = `sql:select (id+1) as num, name from ${data} where id > ${minid} and type == ${type}`
 
```


## install

npm install babel-plugin-qos --save



##
