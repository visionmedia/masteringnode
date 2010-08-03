
require.async('sys', function(err, sys){
    require.async('./utils', function(err, utils){
        console.dir(utils.merge({ foo: 'bar' }, { bar: 'baz' }));
    });
});