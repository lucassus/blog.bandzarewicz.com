beforeEach(function() {
  this.addMatchers({
    toBeGET: function() {
      var actual = this.actual.method;
      return actual === 'GET';
    },
    toHaveUrl: function(expected) {
      var actual = this.actual.url;
      this.message = function() {
        return "Expected request to have url " + expected + " but was " + actual
      };
      return actual === expected;
    }
  });
});
