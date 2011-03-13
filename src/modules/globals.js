console.time('console.time');
console.log('console.log');
console.info('console.info');
console.warn('console.warn');
console.error('console.error');
console.dir({example: 'example'});

try {
   console.assert( (1 != 2), '1 != 2: Should be true' );
   console.assert( (1 == 2), '1 == 2: Should be false');
} catch(e) {
   console.error('Caught error ' + e);
   console.trace();
}

console.log('Filename: ' + __filename);
console.log('Directory: ' + __dirname);
console.dir(module);

console.timeEnd('console.time');
