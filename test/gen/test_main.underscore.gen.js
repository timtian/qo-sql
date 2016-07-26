'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Created by timtian on 2016/7/12.
 */
var testData = require('./test_data.js').arrayData;
var _ = require('underscore');

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

testCase.customReduce = function (empty, result, value, key) {
    var ids = [];
    value.forEach(function (item) {
        ids.push(item.id);
    });

    return ids;
};

testCase.demo = function (type, id, size) {
    return function (params) {
        /**
         *  select id, name, ${type} from ${testData} where id>${id} order by id desc limit 10, ${size}
         */var source = params[1];var res = _.chain(source).filter(function (item) {
            return item['id'] > params[2];
        }).map(function (item) {
            return { 'id': item['id'], 'name': item['name'], 'field_2': params[0] };
        }).value().sort(function (a, b) {
            var sortList = [['id', 'DESC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        }).slice(10, 10 + params[3]);return res;
    }([type, testData, id, size]);
};

testCase.checkPrefix = function (str) {
    return 'hi:this is a test ' + str + '!';
};

testCase.selectById = function (id) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
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
        }).value().sort(function (a, b) {
            var sortList = [['type', 'ASC'], ['count', 'DESC'], ['id', 'ASC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        }).slice(params[3], params[3] + params[4]);return res;
    }([testData, minid, maxid, start, count]);
};

testCase.selectByMaxWithLimit = function (maxid) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] <= params[1];
        }).map(function (item) {
            return _extends({}, item);
        }).value().sort(function (a, b) {
            var sortList = [['type', 'ASC'], ['count', 'DESC'], ['id', 'ASC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        }).slice(0, 0 + 2);return res;
    }([testData, maxid]);
};

testCase.selectByMaxWithLimit2 = function (maxid) {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] <= params[1];
        }).map(function (item) {
            return _extends({}, item);
        }).value().sort(function (a, b) {
            var sortList = [['type', 'ASC'], ['count', 'DESC'], ['id', 'ASC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        }).slice(2);return res;
    }([testData, maxid]);
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

testCase.selectByInStaticTypeList = function () {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return _.includes(['A', 'C'], item['type']);
        }).map(function (item) {
            return _extends({}, item);
        }).value();return res;
    }([testData]);
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
        }, []).value().sort(function (a, b) {
            var sortList = [['country', 'ASC'], ['type', 'ASC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        });return res;
    }([testData, minId]);
};

testCase.selectAvgAndCustomReduce = function () {
    return function (params) {
        var source = params[0];var res = _.chain(source).filter(function (item) {
            return item['id'] <= 4;
        }).groupBy(function (item) {
            return "" + "_" + item['type'];
        }).reduce(function (result, value, key) {
            var item = value[0];var aggitem = { 'type': item['type'], 'ids': testCase.customReduce(item['id'], result, value, key), 'avg': function () {
                    var sum = 0;value.forEach(function (item) {
                        sum += item['count'];
                    });return sum / value.length;
                }(), 'count': value.length };result.push(aggitem);return result;
        }, []).value().sort(function (a, b) {
            var sortList = [['type', 'ASC']];for (var i = 0; i < sortList.length; i++) {
                var sortName = sortList[i][0];var sortRet = 0;if (a[sortName] < b[sortName]) sortRet = -1;else if (a[sortName] != b[sortName]) sortRet = 1;if (sortRet != 0) {
                    return sortList[i][1] == "ASC" ? sortRet : -sortRet;
                }
            }return 0;
        });return res;
    }([testData]);
};

module.exports = testCase;