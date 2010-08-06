
console.log('version:       ' + process.version);
console.log('installPrefix: ' + process.installPrefix);
console.log('execPath:      ' + process.execPath);
console.log('platform:      ' + process.platform);
console.log('pid:           ' + process.pid);
console.log('cwd():         ' + process.cwd());
console.log('getuid():      ' + process.getuid());
console.log('getgid():      ' + process.getgid());
console.log('ENV:');
console.dir(process.env);
console.dir(process.argv)