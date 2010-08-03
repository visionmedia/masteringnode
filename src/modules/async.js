
require.async('./utils', function(err, utils){
    console.dir(utils.merge({ foo: 'bar' }, { bar: 'baz' }));
});