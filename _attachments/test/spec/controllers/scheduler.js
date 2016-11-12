'use strict';

describe('Controller: SchedulerCtrl', function () {

  // load the controller's module
  beforeEach(module('angularTestApp'));

  var SchedulerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    SchedulerCtrl = $controller('SchedulerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(SchedulerCtrl.awesomeThings.length).toBe(3);
  });
});
