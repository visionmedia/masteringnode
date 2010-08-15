
exports.compile = function(str){
    return str
        .replace(/(\w+)\(/g, '$1 = function $1(')
        .replace(/\)(.+?)\n/g, '){ return $1 }\n')
        .replace(/::/g, 'exports.');
};