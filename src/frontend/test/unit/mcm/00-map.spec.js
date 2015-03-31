//var chai = require('chai');
//var chaiAsPromised = require('chai-as-promised');
//chai.use(chaiAsPromised);

var assert = chai.assert;
var expect = chai.expect;

describe("mcm.Map", function() {
	var mcmMap;
	beforeEach(function() {
		var configView = {
		};
		mcmMap = new mcm.Map(configView);
	});

	afterEach(function() {
		
	});

	it('should pass', function() {
		console.log("\n\n=================================\n\nMap.spec\n\n=================================\n\n");

		expect(true).to.be.true;
	});
});