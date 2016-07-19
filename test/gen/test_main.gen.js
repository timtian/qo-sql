'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Created by timtian on 2016/7/12.
 */
var testData = require('./test_data.js').arrayData;
var _ = require('lodash');

//"id": 1,
//"name": "Finn Obrien",
//"email": "Sed.eu@sedtortor.co.uk",
//"count": 103,
//"type": "A",
//"city": "Iqaluit",
//"country": "Canada",
//"birthday": "497520060"

var testCase = {};

testCase.formatter = {};
testCase.formatter.formatMoney = function (number) {
    return number.toFixed(2).replace(/./g, function (c, i, a) {
        return i && c !== "." && (a.length - i) % 3 === 0 ? ',' + c : c;
    });
};

testCase.selectById = function (id) {
    return function (params) {
        /**
         * select * from ${testData} where id=${id}
         */var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] == params[1];
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, id]);
};

testCase.selectByNotEqId = function (excludeId, minId) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] != params[1] && item['id'] > params[2];
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, excludeId, minId]);
};

testCase.selectByIdAndName = function (id, name) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] == params[1] && item['name'] == params[2];
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, id, name]);
};

testCase.selectByIdOrCount = function (id, mincount) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] == params[1] || item['count'] > params[2];
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, id, mincount]);
};

testCase.selectByBwId = function (minid, maxid) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] >= params[1] && item['id'] <= params[2];
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, minid, maxid]);
};

testCase.selectByBwIdWithOrder = function (minid, maxid, start, count) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] >= params[1] && item['id'] <= params[2];
        }).map(function (item) {
            return _extends({}, item);
        }).orderBy(['type', 'count'], ['asc', 'desc']).slice(params[3], params[3] + params[4]).value();return res;
    }([testData, minid, maxid, start, count]);
};

testCase.selectByInCountryListAndNotInTypeList = function (ctyList, typeList) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return _.includes(params[1], item['country']) && !_.includes(params[2], item['type']);
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData, ctyList, typeList]);
};

testCase.selectFieldWithExpressionByType = function (type) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['type'] == params[1];
        }).map(function (item) {
            return { 'ID': item['id'], 'ID2': item['id'] + 1, 'ID3': item['id'] / 3, 'address': item['city'] + '@' + item['country'], 'field_4': testCase.formatter.formatMoney(item['count'], item) };
        }).value();return res;
    }([testData, type]);
};

testCase.selectAggByTypeAndCountry = function (minId) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] > params[1];
        }).groupBy(function (item) {
            return "" + "_" + item['type'] + "_" + item['country'];
        }).reduce(function (result, value, key) {
            var item = value[0];var aggitem = { 'type': item['type'], 'country': item['country'], 'min': function () {
                    var min = Number.MAX_VALUE;value.forEach(function (item) {
                        min = Math.min(min, item['count']);
                    });return min;
                }(), 'max': function () {
                    var max = Number.MIN_VALUE;value.forEach(function (item) {
                        max = Math.max(max, item['count']);
                    });return max;
                }(), 'total': value.length, 'sum': function () {
                    var sum = 0;value.forEach(function (item) {
                        sum += item['count'];
                    });return sum;
                }() };result.push(aggitem);return result;
        }, []).orderBy(['country', 'type'], ['asc', 'asc']).value();return res;
    }([testData, minId]);
};

module.exports = testCase;