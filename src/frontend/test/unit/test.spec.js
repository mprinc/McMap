//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

xdescribe("A test suite", function() {
	beforeEach(function() { });
	afterEach(function() { });

	it('should fail', function() {
		expect(true).to.be.true;
	});
});