var resolvedPromise = function (mock_ret, p_delay) {
  var p_ret = mock_ret || 'Resolved';
  var deferred = Q.defer();

  Q.delay(p_delay || 30)
    .done(function () {
      console.log('(resolving the promise)');
      deferred.resolve(p_ret);
    });

  return deferred.promise;
};

var getRejectedPromise = function (logger, p_ret, p_delay) {
  var deferred = Q.defer();

  Q.delay(p_delay || 30)
    .done(function () {
      logger.log('(rejecting the promise)');
      deferred.reject(new Error(p_ret || 'promise rejected'));
    });

  return deferred.promise;
};

var getExceptionPromise = function (logger, p_ret, p_delay) {
  var deferred = Q.defer();

  Q.delay(p_delay || 30)
    .done(function () {
      throw new Error('throwing unhandled exception');
    });

  return deferred.promise;
};
