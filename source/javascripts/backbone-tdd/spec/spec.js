beforeEach(function() {
  this.addMatchers({
    toBeGET: function() {
      var actual = this.actual.method;
      return actual === 'GET';
    },
    toBePOST: function() {
      var actual = this.actual.method;
      return actual === 'POST';
    },
    toBePUT: function() {
      var actual = this.actual.method;
      return actual === 'PUT';
    },
    toHaveUrl: function(expected) {
      var actual = this.actual.url;
      this.message = function() {
        return "Expected request to have url " + expected + " but was " + actual
      };
      return actual === expected;
    },
    toBeAsync: function() {
      var actual = this.actual.async;
      return actual;
    }
  });
});

window.itShouldBeGET = function() {
  it('should be POST', function() {
    expect(this.request).toBeGET();
  });
};

window.itShouldBePOST = function() {
  it('should be POST', function() {
    expect(this.request).toBePOST();
  });
};

window.itShouldBePUT = function() {
  it('should be PUT', function() {
    expect(this.request).toBePUT();
  });
};

window.itShouldBeAsync = function() {
  it('should be async', function() {
    expect(this.request).toBeAsync();
  });
};

window.itShouldHaveUrl = function(url) {
  it('should have url ' + url, function() {
    expect(this.request).toHaveUrl(url);
  });
};
