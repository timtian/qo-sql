/**
 * Created by timtian on 2016/7/12.
 */
var assert = require('assert');
var babel = require('babel-core');
var fs = require('fs');
var _ = require('lodash');

var lodashTestCase = {};
var underscoreTestCase = {};

var path = require('path');
var testData = require('./gen/test_data');

function init(){
    var options = {
        presets: [
            require('babel-preset-es2015')
        ],
        plugins: [
            require('babel-plugin-syntax-object-rest-spread'),
            require('babel-plugin-transform-object-rest-spread'),
            [require('../src/index.js'), { prefix: 'sql:', mode :'lodash', debug:true }]
        ],
        babelrc : false
    };


    //gen loadsh code
    var lodashResult = babel.transformFileSync('./test/gen/test_main.js', options);
    fs.writeFileSync('./test/gen/test_main.lodash.gen.js', lodashResult.code);
    lodashTestCase = require(path.join(__dirname, '/gen/test_main.lodash.gen'));


    //gen underscore code
    options.plugins[2][1].mode = 'underscore';
    var underscoreResult = babel.transformFileSync('./test/gen/test_main.js', options);
    fs.writeFileSync('./test/gen/test_main.underscore.gen.js', underscoreResult.code.replace(/require\('lodash'\)/gi, "require('underscore')"));
    underscoreTestCase = require(path.join(__dirname, '/gen/test_main.underscore.gen'));
}
init();


function selectById(testCase){
    var exp = testData.arrayData[6];
    var res = testCase.selectById(7);
    assert.equal(res.length, 1);
    assert.deepEqual(res[0], exp);
}

function selectByNotEqId(testCase){
    var minId = 70;
    var excludeId = 72;
    var exp = testData.arrayData.slice(minId, 100);
    exp.splice(1, 1);

    var res = testCase.selectByNotEqId(excludeId, minId);
    assert.deepEqual(res, exp)

}

function selectByIdAndName(testCase){
    var exp = testData.arrayData[6];
    var res = testCase.selectByIdAndName(7, 'Harlan Crane');
    assert.deepEqual(res[0], exp);

    res = testCase.selectByIdAndName(7, 'Harlan Crane23');
    assert.equal(res.length, 0);
};

function selectByIdOrCount(testCase){
    var mincount = 100;
    var id = 3;
    var exp = testData.arrayData.filter(function(item){
        return item.id == id || item.count > mincount;
    });

    var act = testCase.selectByIdOrCount(id, 100);
    assert.deepEqual(act, exp);
}

function selectByBwId(testCase){
    var exp = testData.arrayData.slice(89, 100);
    var res = testCase.selectByBwId(90, 101);
    assert.deepEqual(res, exp);
}


function selectByBwIdWithOrder(testCase){
    var exp = testData.arrayData.filter(function(item){
        return item.id >= 70 && item.id <= 89
    }).sort(function(a, b){
        if(a.type == b.type){
            //count desc
            return  -(a.count - b.count);
        }else{
            //type asc
            return a.type > b.type ? 1 : -1;
        }
    }).slice(2, 12);


    var res = testCase.selectByBwIdWithOrder(70, 89, 2, 10);
    assert.deepEqual(res, exp);
}

function selectByInCountryListAndNotInTypeList(testCase){
    var exp = testData.arrayData.filter(function(item){
        return (item.country == 'Canada' || item.country == 'United States') && (item.type != 'A' && item.type != 'B' && item.type != 'C');
    });

    var res = testCase.selectByInCountryListAndNotInTypeList(['Canada', 'United States'], ['A', 'B', 'C']);
    assert.deepEqual(res, exp);
}


function selectByInStaticTypeList(testCase){
    var exp = testData.arrayData.filter(function(item){
        return  _.includes(['A', 'C'], item.type);
    });
    var res = testCase.selectByInStaticTypeList();
    assert.deepEqual(res, exp);
}

function selectFieldWithExpressionByType(testCase){

    var type = 'A';
    var res = testCase.selectFieldWithExpressionByType(type);

    var exp = testData.arrayData.filter(function(item){
        return item.type == type;
    }).map(function(item){
        return {
            ID: item.id,
            ID2: item.id + 1,
            ID3 : item.id / 3,
            address : item.city + '@' + item.country,
            field_4 : testCase.formatter.formatMoney(item.count)
        }
    });

    assert.deepEqual(res, exp);
}

function selectAggByTypeAndCountry(testCase){
    var minId = '23';
    var res = testCase.selectAggByTypeAndCountry(minId);

    var exp = [
        {"type":"A","country":"Canada","min":70,"max":170,"total":4,"sum":496},
        {"type":"B","country":"Canada","min":20,"max":67,"total":5,"sum":183},
        {"type":"C","country":"Canada","min":23,"max":192,"total":6,"sum":820},
        {"type":"D","country":"Canada","min":50,"max":187,"total":5,"sum":723},
        {"type":"E","country":"Canada","min":75,"max":190,"total":3,"sum":347},
        {"type":"F","country":"Canada","min":98,"max":178,"total":3,"sum":433},
        {"type":"A","country":"United Kingdom","min":29,"max":162,"total":6,"sum":596},
        {"type":"B","country":"United Kingdom","min":107,"max":166,"total":3,"sum":405},
        {"type":"C","country":"United Kingdom","min":182,"max":193,"total":3,"sum":557},
        {"type":"D","country":"United Kingdom","min":121,"max":192,"total":4,"sum":640},
        {"type":"E","country":"United Kingdom","min":104,"max":165,"total":2,"sum":269},
        {"type":"F","country":"United Kingdom","min":89,"max":89,"total":1,"sum":89},
        {"type":"A","country":"United States","min":24,"max":154,"total":3,"sum":204},
        {"type":"B","country":"United States","min":46,"max":61,"total":2,"sum":107},
        {"type":"C","country":"United States","min":33,"max":150,"total":7,"sum":846},
        {"type":"D","country":"United States","min":20,"max":144,"total":6,"sum":514},
        {"type":"E","country":"United States","min":27,"max":190,"total":10,"sum":994},
        {"type":"F","country":"United States","min":23,"max":179,"total":4,"sum":522}
    ];

    assert.deepEqual(res, exp);
}


function selectAvgAndCustomReduce(testCase){
    var res = testCase.selectAvgAndCustomReduce();
    var exp = [
        {
            "count": 1,
            "avg": 103,
            "ids": [1],
            "type": "A"
        },
        {
            "count": 2,
            "avg": 99.5,
            "ids": [2,4],
            "type": "C"
        },
        {
            "count": 1,
            "avg": 34,
            "ids": [3],
            "type": "D"
        }
    ];

    assert.deepEqual(res, exp);
}


describe('common', function(){

    it('check prefix', function(){
        var test = 'sql:';
        var exp = 'hi:this is a test ' + test + '!'
        var result = lodashTestCase.checkPrefix(test)
        assert.equal(exp, result);
    })
});

describe('lodash impl', function(){


    describe('#1 Where', function() {
        it('selectById', function(){
            selectById(lodashTestCase);
        });

        it('selectByNotEqId', function(){
            selectByNotEqId(lodashTestCase);
        });

        it('selectByIdAndName', function(){
            selectByIdAndName(lodashTestCase);
        });

        it('selectByIdOrCount', function(){
            selectByIdOrCount(lodashTestCase);
        });

        it('selectByBwId', function(){
            selectByBwId(lodashTestCase);
        });


        it('selectByBwIdWithOrder', function(){
            selectByBwIdWithOrder(lodashTestCase);
        });

        it('selectByInCountryListAndNotInTypeList', function(){
            selectByInCountryListAndNotInTypeList(lodashTestCase);
        });

        it('selectByInStaticTypeList', function(){
            selectByInStaticTypeList(lodashTestCase);
        });

        it('selectAvgAndCustomReduce', function(){
            selectAvgAndCustomReduce(lodashTestCase);
        });




    });

    describe('#2 Select', function() {

        it('selectFieldWithExpressionByType', function(){
            selectFieldWithExpressionByType(lodashTestCase);
        });
    });

    describe('#3 Aggregate', function() {
        it('selectAggByTypeAndCountry', function(){
            selectAggByTypeAndCountry(lodashTestCase);
        });
    });

});


describe('underscore impl', function(){
    describe('#1 Where', function() {
        it('selectById', function(){
            selectById(underscoreTestCase);
        });

        it('selectByNotEqId', function(){
            selectByNotEqId(underscoreTestCase);
        });

        it('selectByIdAndName', function(){
            selectByIdAndName(underscoreTestCase);
        });

        it('selectByIdOrCount', function(){
            selectByIdOrCount(underscoreTestCase);
        });

        it('selectByBwId', function(){
            selectByBwId(underscoreTestCase);
        });


        it('selectByBwIdWithOrder', function(){
            selectByBwIdWithOrder(underscoreTestCase);
        });

        it('selectByInCountryListAndNotInTypeList', function(){
            selectByInCountryListAndNotInTypeList(underscoreTestCase);
        });


        it('selectByInStaticTypeList', function(){
            selectByInStaticTypeList(underscoreTestCase);
        })

        it('selectAvgAndCustomReduce', function(){
            selectAvgAndCustomReduce(underscoreTestCase);
        });
    });

    describe('#2 Select', function() {

        it('selectFieldWithExpressionByType', function(){
            selectFieldWithExpressionByType(underscoreTestCase);
        });
    });

    describe('#3 Aggregate', function() {
        it('selectAggByTypeAndCountry', function(){
            selectAggByTypeAndCountry(underscoreTestCase);
        });
    });

});