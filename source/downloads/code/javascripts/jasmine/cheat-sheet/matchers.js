describe('built-in matchers', function() {

  describe('toBeTruthy', function() {
    it('passes if subject is true', function() {
      expect(true).toBeTruthy();
      expect(false).not.toBeTruthy();
    });
  });

  describe('toBeFalsy', function() {
    it('passes if subject is false', function() {
      expect(false).toBeFalsy();
      expect(true).not.toBeFalsy();
    });
  });

  describe('toBeDefined', function() {
    it('passes if subject is not undefined', function() {
      expect({}).toBeDefined();
      expect(undefined).not.toBeDefined();
    });
  });

  describe('toBeNull', function() {
    it('passes if subject is null', function() {
      expect(null).toBeNull();
      expect(undefined).not.toBeNull();
      expect({}).not.toBeNull();
    });
  });

  describe('toEqual', function() {
    it('passes if subject and expectation are equivalent', function() {
      expect('Hello World!').toEqual('Hello World!');
      expect('Hello World!').not.toEqual('Goodbye!');
      expect('Hello World!').toNotEqual('Hi!');
      expect([1, 2, 3]).toEqual([1, 2, 3]);
      expect(1).toEqual(1);
      expect({ foo: 1 }).toEqual({ foo: 1 });
    });
  });

  describe('toBeCloseTo', function() {
    it('checks that the expected item is equal to the actual item up to a given level of decimal precision ', function() {
      expect(1.223).toBeCloseTo(1.22);
      expect(1.233).not.toBeCloseTo(1.22);
      expect(1.23326).toBeCloseTo(1.23324, 3);
    });
  });

  describe('toContain', function() {
    it('passes if the expected item is an element in the actual array', function() {
      expect([1, 2, 3]).toContain(2);
      expect([1, 2, 3]).not.toContain(4);
    });
  });

  describe('toMatch', function() {
    it('compares the actual to the expected using a regular expression', function() {
      expect('Hello Jasmine').toMatch(/jasmine/i);
      expect('phone: 123-45-67').toMatch(/\d{3}-\d{2}-\d{2}/);
    });
  });

  describe('toBeGreaterThan', function() {
    it('passes if the actual value is greater than the expected value', function() {
      expect(2).toBeGreaterThan(1);
    });
  });

  describe('toBeLessThan', function() {
    it('passes if the actual value is less than the expected value', function() {
      expect(2).toBeLessThan(3);
    });
  });

  describe('toThrow', function() {
    it('checks that the expected exception was thrown by the actua', function() {
      var object = {
        doSomething: function() {
          throw new Error("Unexpected error!")
        }
      };
      expect(object.doSomething).toThrow(new Error("Unexpected error!"));
    });
  });
});
