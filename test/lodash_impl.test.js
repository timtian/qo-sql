/**
 * Created by timtian on 2016/7/12.
 */
var assert = require('assert');
var babel = require('babel-core');
var fs = require('fs');
var _ = require('lodash');

var testCase = {};
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
            [require('../src/index.js'), { prefix: 'sql:', mode :'lodash' }]
        ],
        babelrc : false
    };


    var result = babel.transformFileSync('./test/gen/test_main.js', options);

    fs.writeFileSync('./test/gen/test_main.gen.js', result.code);

    testCase = require(path.join(__dirname, '/gen/test_main.gen'));
}

describe('lodash impl', function(){

    this.timeout(15000);

    before(function() {
        init();
        //testCase = require(path.join(__dirname, '/gen/test_main.gen'));
    });

    after(function() {
    });

    beforeEach(function() {
    });

    afterEach(function() {
    });

    describe('#1 Where', function() {
        it('selectById', function(){
            var exp = testData.arrayData[6];
            var res = testCase.selectById(7);
            assert.equal(res.length, 1);
            assert.deepEqual(res[0], exp);
        })

        it('selectByIdAndName', function(){
            var exp = testData.arrayData[6];
            var res = testCase.selectByIdAndName(7, 'Harlan Crane');
            assert.deepEqual(res[0], exp);

            res = testCase.selectByIdAndName(7, 'Harlan Crane23');
            assert.equal(res.length, 0);
        });

        it('selectByIdOrCount', function(){
            var mincount = 100;
            var id = 3;
            var exp = testData.arrayData.filter(function(item){
                return item.id == id || item.count > mincount;
            });

            var act = testCase.selectByIdOrCount(id, 100);
            assert.deepEqual(act, exp);
        });

        it('selectByBwId', function(){
            var exp = testData.arrayData.slice(89, 100);
            var res = testCase.selectByBwId(90, 101);
            assert.deepEqual(res, exp);
        });


        it('selectByBwIdWithOrder', function(){
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
        });

        it('selectByInCountryListAndNotInTypeList', function(){
            var exp = testData.arrayData.filter(function(item){
                return (item.country == 'Canada' || item.country == 'United States') && (item.type != 'A' && item.type != 'B' && item.type != 'C');
            });

            var res = testCase.selectByInCountryListAndNotInTypeList(['Canada', 'United States'], ['A', 'B', 'C']);
            assert.deepEqual(res, exp);
        });

    });


    describe('#2 Select', function() {

        it('selectFieldWithExpressionByType', function(){

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
        });
    });

    describe('#3 Aggregate', function() {

        it('selectAggByTypeAndCountry', function(){
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
        });
    });

});