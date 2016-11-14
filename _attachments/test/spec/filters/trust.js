'use strict';

describe('Filter: trust', function () {

  // load the filter's module
  beforeEach(module('angularTestApp'));

  // initialize a new instance of the filter before each test
  var trust;
  beforeEach(inject(function ($filter) {
    trust = $filter('trust');
  }));

  it('should return the input prefixed with "trust filter:"', function () {
    var text = 'angularjs';
    expect(trust(text)).toBe('trust filter: ' + text);
  });

});
