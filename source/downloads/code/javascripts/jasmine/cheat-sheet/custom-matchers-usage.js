describe('request', function() {
  var request = { method: 'GET', url: '/products.json' };

  it('should be GET', function() {
    expect(request).toBeGET();
  });

  it('should have url /products.json', function() {
    expect(request).toHaveUrl('/products.json');
  });

  // this will fail with nice message:
  // "Expected request to have url /tasks.json but was /projects.json"
  it('should have url /tasks.json', function() {
    expect(request).toHaveUrl('/tasks.json');
  });
});
