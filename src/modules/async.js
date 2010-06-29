
require.async('sys', function(err, sys){
    require.async('./utilities', function(err, utils){
        sys.p(utils.merge({ foo: 'bar' }, { bar: 'baz' }));
    });
});