
exports.merge = function(obj, other) {
    var keys = Object.keys(other);
    for (var i = 0, len = keys.length; i < len; ++i) {
        var key = keys[i];
        obj[key] = other[key];
    }
    return obj;
};