
function explainFlag(mode, flag) {
    var classes = [];
    if (mode & process['S_I' + flag + 'USR']) classes.push('user');
    if (mode & process['S_I' + flag + 'GRP']) classes.push('group');
    if (mode & process['S_I' + flag + 'OTH']) classes.push('other');
    return classes.join(' ');
}

function explainMode(mode) {
    console.log('\n   mode: %s', mode.toString(8));
    console.log('   read: %s', explainFlag(mode, 'R'));
    console.log('  write: %s', explainFlag(mode, 'W'));
    console.log('   exec: %s', explainFlag(mode, 'X'));
}

explainMode(0755);
explainMode(0664);
explainMode(process.umask());
