module.exports = {
    'Test 1' : function(test) {
        test.expect(1);
        test.ok(true, "This shouldn't fail");
        test.done();
    },
    'Test 2' : function(test) {
        test.expect(2);
        test.ok(1 === 1, "This shouldn't fail");
        test.ok(false, "This should fail");
        test.done();
    }
};
