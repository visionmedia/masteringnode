
var sys = require('sys'),
    sassUrl = 'http://github.com/visionmedia/sass.js/raw/master/lib/sass.js',
    sassStr = ''
        + 'body\n'
        + '  a\n'
        + '    :color #eee';

require.async(sassUrl, function(err, sass){
    var str = sass.render(sassStr);
    sys.puts(str);
});