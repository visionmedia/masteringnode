
var sassUrl = 'http://github.com/visionmedia/sass.js/raw/master/lib/sass.js',
    sassStr = ''
        + 'body\n'
        + '  a\n'
        + '    :color #eee';

require.async(sassUrl, function(err, sass){
    var str = sass.render(sassStr);
    console.log(str);
});