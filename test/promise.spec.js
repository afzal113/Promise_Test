describe('Promise', function () {
  'use strict';
  var successfulPromise;
  beforeEach(function () {
    successfulPromise = resolvedPromise('mock_return', 10);
  });
  function createCallBackSpy (name, orginalFn) {
    return jasmine.createSpy(name, orginalFn).and.callThrough();
  }

  var callbackFn = function (data) {
    console.log(data);
    return data + '_callback';
  };

  var catchFn = function (data) {
    console.log('catching error');
    return data + '_rescued';
  };

  var callbackErrorFn = function (data) {
    console.log('throwing error');
    throw 'Error';
  };
  var callPromiseAndExpects = function (promise, fn) {
    promise.finally(fn);
  };

  describe('successful promises', function () {
    it('should call all chained callback function when resolved', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var cb3 = createCallBackSpy('callback3', callbackFn);

      var expectFn = function () {
        expect(cb3).toHaveBeenCalledWith('mock_return_callback_callback');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .then(cb2)
          .then(cb3),
        expectFn
      );
    });
    it('should call 2 chained callback function when resolved', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var expectFn = function () {
        expect(cb2).toHaveBeenCalledWith('mock_return_callback');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .then(cb2),
        expectFn
      );
    });
    it('should call callback function when resolved', function (done) {
      var cb = createCallBackSpy('callback', callbackFn);
      var expectFn = function () {
        expect(cb).toHaveBeenCalledWith('mock_return');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb),
        expectFn
      );
    });
    it('should skip to catch if function throws error', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackErrorFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var catch1 = createCallBackSpy('catch1', catchFn);
      var expectFn = function () {
        expect(cb1).toHaveBeenCalledWith('mock_return');
        expect(cb2).not.toHaveBeenCalled();
        expect(catch1).toHaveBeenCalledWith('Error');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .then(cb2)
          .catch(catch1),
        expectFn
      );
    });
    it('should call catch and recover if function throws error', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackErrorFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var catch1 = createCallBackSpy('catch1', catchFn);
      var expectFn = function () {
        expect(cb1).toHaveBeenCalledWith('mock_return');
        expect(cb2).toHaveBeenCalledWith('Error_rescued');
        expect(catch1).toHaveBeenCalledWith('Error');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .catch(catch1)
          .then(cb2),
        expectFn
      );
    });
    it('should call catch and recover if function throws error', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackErrorFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var catch1 = createCallBackSpy('catch1', catchFn);
      var expectedFn = function () {
        expect(cb1).toHaveBeenCalledWith('mock_return');
        expect(cb2).toHaveBeenCalledWith('Error_rescued');
        expect(catch1).toHaveBeenCalledWith('Error');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .catch(catch1)
          .then(cb2), expectedFn);
    });
    it('should not call chained callback after function throws error', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackErrorFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);
      var cb3 = createCallBackSpy('callback3', callbackFn);
      var expectFn = function () {
        expect(cb2).not.toHaveBeenCalledWith('mock_return_callback');
        done();
      };
      callPromiseAndExpects(
        successfulPromise
          .then(cb1)
          .then(cb2)
          .then(cb3),
        expectFn
      );
    });
    it('should continue promise on another chain', function (done) {
      var cb1 = createCallBackSpy('callback1', callbackFn);
      var cb2 = createCallBackSpy('callback2', callbackFn);

      var expectFn = function () {
        expect(cb1).toHaveBeenCalledWith('mock_return');
        expect(cb2).toHaveBeenCalledWith('mock_return_callback');
        done();
      };
      var continuePromise = successfulPromise.then(cb1);
      callPromiseAndExpects(
        continuePromise
          .then(cb2),
        expectFn
      );
    });
  });
});
