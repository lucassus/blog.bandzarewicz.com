---
layout: post
title: KRUG TDD with backbone and jasmine
---

## Jasmine

[http://pivotal.github.com/jasmine](http://pivotal.github.com/jasmine)

Jasmine is a behavior-driven development framework for testing your JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM.

### Sample test case

{% highlight javascript %}
describe('some behaviour', function() {
  it('should be true', function() {
    expect(false).toBeTruthy();
  });

  it('increment a number', function() {
    var n = 0;
    n++;
    expect(n).toEqual(1);
  });
});
{% endhighlight %}

### Some useful matchers

{% highlight javascript %}
expect(x).toEqual(y); // compares objects or primitives x and y and passes if they are equivalent
// Every matcher's criteria can be inverted by prepending .not:
expect(x).not.toEqual(y); // compares objects or primitives x and y and passes if they are not equivalent

expect(x).toBe(expected); // compares the actual to the expected using ===
expect(x).toNotBe(expected); // toNotBe: compares the actual to the expected using !==

expect(x).toMatch(pattern); // compares x to string or regular expression pattern and passes if they match
expect(x).toNotMatch(pattern);

expect(x).toBeDefined(); // passes if x is not undefined
expect(x).toBeUndefined();
expect(x).toBeNull(); // passes if x is null

expect(x).toBeTruthy(); // passes if x evaluates to true
expect(x).toBeFalsy(); // passes if x evaluates to false

expect(x).toContain(y); // passes if array or string x contains y
expect(x).toNotContain(y);

expect(x).toBeCloseTo(expected, precision); // precision (default 2).

expect(x).toBeLessThan(expected);
expect(x).toBeGreaterThan(expected);

expect(x).toThrow(expected);
{% endhighlight %}

### beforeEach and afterEach

{% highlight javascript %}
describe('some suite', function () {
  var suiteWideFoo;

  beforeEach(function () {
    suiteWideFoo = 1;
  });

  it('should equal bar', function () {
    expect(suiteWideFoo).toEqual(1);
  });
});
{% endhighlight %}

{% highlight javascript %}
var server;

beforeEach(function () {
    server = sinon.fakeServer.create();
});

afterEach(function() {
    server.restore();
});
{% endhighlight %}

## Sinon.JS

[http://sinonjs.org](http://sinonjs.org)

Standalone test spies, stubs and mocks for JavaScript. No dependencies, works with any unit testing framework.

Features:

* Anonymous spies
* Spying on existing methods
* A rich inspection interface
* Sample stubs and mocks

{% highlight javascript %}
it('should display validation messages', function () {
    var mock = sinon.mock(window).expects('alert').withArgs("Task name can't be blank");
    subject.doSomething();
    mock.verify();
});

describe('#getName', function() {
    it('should return task id', function() {
      var stub = sinon.stub(task, 'get').returns('Task name');

      expect(task.getName()).toEqual('Task name');
      expect(stub.calledWith('name')).toBeTruthy();
    });
});
{% endhighlight %}

### How to mock the server

{% highlight javascript %}
var server;

beforeEach(function () {
    server = sinon.fakeServer.create();

    var fixtures = {};

      server.respondWith('POST', '/tasks.json',
          [
            200,
            { "Content-Type": "application/json" },
            JSON.stringify(fixtures)
          ]
      );
});

afterEach(function() {
    server.restore();
});

it('should do something via ajax', function() {
    collection.fetch();
    server.respond();
    // some expectations here
});
{% endhighlight %}

## Basic Rails application

Basic Rails application (without javascripts):
[https://github.com/lucassus/tdd-with-backbonejs/tree/000-basic-app](https://github.com/lucassus/tdd-with-backbonejs/tree/000-basic-app)

./Gemfile
{% highlight ruby %}
gem 'twitter-bootstrap-rails'
gem 'jquery-rails'
gem 'underscore-rails'
gem 'backbone-on-rails'

group :development, :test do
  gem 'jasmine'
  gem 'jasminerice'

  gem 'guard'
  gem 'guard-jasmine'
end
{% endhighlight %}

./Guardfile
{% highlight ruby %}
group :frontend do
  guard 'jasmine', :phantomjs_bin => './spec/javascripts/support/phantomjs', :specdoc => :always, :console => :always do
    watch(%r{app/assets/javascripts/.+(js\.coffee|js)}) { "spec/javascripts" }
    watch(%r{spec/javascripts/.+(js\.coffee|js)}) { "spec/javascripts" }
  end
end
{% endhighlight %}

### Sample phantomjs output

{% highlight bash %}
$ guard --group frontend
Guard could not detect any of the supported notification libraries.
Guard is now watching at '/home/lucassus/Projects/TodoList'
Guard::Jasmine starts webrick test server on port 8888 in development environment.
Jasmine test runner is available at http://localhost:8888/jasmine
Run all Jasmine suites
Run Jasmine suite at http://localhost:8888/jasmine
Sample spec
  ✘ should fail
    ➤ Expected true to be falsy.
ERROR: 2 specs, 1 failure
in 0.006 seconds
{% endhighlight %}

## Creating Task backbone model

### Initial spec

{% highlight javascript %}
describe('TodoList.Models.Task', function() {

  it('should be defined', function() {
    expect(TodoList.Models.Task).toBeDefined();
  });

});
{% endhighlight %}

{% highlight javascript %}
TodoList.Models.Task = {};
{% endhighlight %}

### Testing default values

{% highlight javascript %}
describe('TodoList.Models.Task', function() {

  it('should have correct default values', function() {
    var task = new TodoList.Models.Task();

    expect(task.id).toBeUndefined();
    expect(task.get('name')).toEqual('');
    expect(task.get('complete')).toBeFalsy();
  });

});
{% endhighlight %}

{% highlight javascript %}
TodoList.Models.Task = Backbone.Model.extend({

  defaults: {
    name: '',
    complete: false
  }

});
{% endhighlight %}

### Testing getters

{% highlight javascript %}
describe('TodoList.Models.Task', function() {
  var task;

  describe('#getId', function() {
    it('should be defined', function() {
      expect(task.getId).toBeDefined();
    });

    it('should return task id', function () {
      var stub = sinon.stub(task, 'get').returns(11);

      expect(task.getId()).toEqual(11);
      expect(stub.calledWith('id')).toBeTruthy();
    });
  });

  describe('#getName', function() {
    it('should be defined', function() {
      expect(task.getName).toBeDefined();
    });

    it('should return task name', function() {
      var stub = sinon.stub(task, 'get').returns('Task name');

      expect(task.getName()).toEqual('Task name');
      expect(stub.calledWith('name')).toBeTruthy();
    });
  });

  describe('#getComplete', function() {
    it('should be defined', function() {
      expect(task.getComplete).toBeDefined();
    });

    it('should return task id', function() {
      var stub = sinon.stub(task, 'get').returns(false);

      expect(task.getComplete()).toEqual(false);
      expect(stub.calledWith('complete')).toBeTruthy();
    });
  });

});
{% endhighlight %}

{% highlight javascript %}
TodoList.Models.Task = Backbone.Model.extend({

  getId: function() {
    return this.get('id');
  },

  getName: function() {
    return this.get('name');
  },

  getComplete: function() {
    return this.get('complete');
  }

});
{% endhighlight %}

### Test for #save method

{% highlight javascript %}
describe('TodoList.Models.Task', function() {
  var task;

  beforeEach(function() {
    task = new TodoList.Models.Task();
  });

  describe('#save', function() {
    var server = null;

    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    describe('request', function() {
      var request = null;

      beforeEach(function() {
        task.set({ name: 'New task to do' });
      });

      describe('on create', function() {
        beforeEach(function() {
          task.set({ id: null });
          task.save();
          request = server.requests[0];
        });

        it('should be POST', function() {
          expect(request).toHaveMethod('POST');
        });

        it('should be async', function() {
          expect(request).toBeAsync();
        });

        it('should have valid url', function() {
          expect(request).toHaveUrl('/tasks.json');
        });

        it('should send valid data', function() {
          var params = JSON.parse(request.requestBody);
          expect(params.task).toBeDefined();
          expect(params.task.name).toEqual('New task to do');
          expect(params.task.complete).toBeFalsy();
        });
      });

      describe('on update', function() {
        beforeEach(function() {
          task.id = 66;
          task.save();
          request = server.requests[0];
        });

        it('should be PUT', function() {
          expect(request).toHaveMethod('PUT');
        });

        it('should be async', function() {
          expect(request).toBeAsync();
        });

        it('should have valid url', function() {
          expect(request).toHaveUrl('/tasks/66.json')
        });

        it('should send valid data', function() {
          var params = JSON.parse(request.requestBody);
          expect(params.task).toBeDefined();
          expect(params.task.name).toEqual('New task to do');
          expect(params.task.complete).toBeFalsy();
        });
      });
    });
  });
});
{% endhighlight %}

Custom jasmine matchers for request

{% highlight javascript %}
beforeEach(function() {
  this.addMatchers({
    toHaveMethod: function(expected) {
      var actual = this.actual.method;
      this.message = function() { return "Expected request to be " + expected + " but was " + actual };
      return actual === expected;
    },

    toBeAsync: function() {
      var actual = this.actual.async;
      this.message = function() { return "Expected request to be async" };
      return actual;
    },

    toHaveUrl: function(expected) {
      var actual = this.actual.url;
      this.message = function() { return "Expected request to have url " + expected + " but was " + actual };
      return actual == expected;
    }
  });
});
{% endhighlight %}

Complete Task model:
[https://github.com/lucassus/tdd-with-backbonejs/tree/004-complete-task-model](https://github.com/lucassus/tdd-with-backbonejs/tree/004-complete-task-model)

## Create Tasks collection

{% highlight javascript %}
describe('TodoList.Collections.Tasks', function() {

  it('should be defined', function() {
    expect(TodoList.Collections.Tasks).toBeDefined();
  });

  var tasks;

  beforeEach(function() {
    tasks = new TodoList.Collections.Tasks();
  });

  describe('#fetch', function() {
    var server = null;
    beforeEach(function() {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    describe('request', function() {
      var request;
      beforeEach(function() {
        tasks.fetch();
        request = server.requests[0];
      });

      it('should be GET', function() {
        expect(request).toHaveMethod('GET');
      });

      it('should be async', function() {
        expect(request).toBeAsync();
      });

      it('should have valid url', function() {
        expect(request).toHaveUrl('/tasks.json')
      });
    });

    describe('on success', function() {
      beforeEach(function() {
        var fixtures = { tasks: [
            { id: 11, name: 'First task', complete: false },
            { id: 12, name: 'Second task', complete: true }
          ] };

        server.respondWith('GET', '/tasks.json',
            [
              200,
              { "Content-Type": "application/json" },
              JSON.stringify(fixtures)
            ]
        );

        tasks.fetch();
      });

      it('should parse tasks from the response', function() {
        server.respond();

        expect(tasks.models.length).toEqual(2);
        expect(tasks.get(11).getName()).toEqual('First task');
        expect(tasks.get(11).getComplete()).toEqual(false);
        expect(tasks.get(12).getName()).toEqual('Second task');
        expect(tasks.get(12).getComplete()).toEqual(true);
      });
    });
  });

});
{% endhighlight %}

{% highlight javascript %}
TodoList.Collections.Tasks = Backbone.Collection.extend({

  url: '/tasks.json',
  model: TodoList.Models.Task,

  parse: function(response) {
    return response.tasks;
  }

});
{% endhighlight %}

[https://github.com/lucassus/tdd-with-backbonejs/tree/005-complete-tasks-collection](https://github.com/lucassus/tdd-with-backbonejs/tree/005-complete-tasks-collection)

## Create Form view

{% highlight javascript %}
describe('TodoList.Views.Form', function() {

  it('should be defined', function() {
    expect(TodoList.Views.Form).toBeDefined();
  });

  var view, $fixture, collection;

  beforeEach(function() {
    loadFixtures('form-fixture.html');
    $fixture = $('#form-fixture');
    collection = new TodoList.Collections.Tasks();

    view = new TodoList.Views.Form({ el: $fixture, collection: collection });
  });

  describe('events', function() {
    it('should handle click event on submit button', function() {
      expect(view.events['click button.submit']).toEqual('submit');
    });
  });

  describe('#getInputFor', function () {
    it('should return form input for given name', function () {
      expect(view.getInputFor('name')).toBe($fixture.find('input'));
    });
  });

  describe('#getAttributes', function () {
    it('should be defined', function() {
      expect(view.getAttributes).toBeDefined();
    });

    it('should return valid attributes', function () {
      $fixture.find('input').val('Do something');
      var attributes = view.getAttributes();

      expect(attributes).toBeDefined();
      expect(attributes.name).toBeDefined();
      expect(attributes.name).toEqual('Do something');
    });
  });

  describe('#submit', function() {
    it('should be defined', function() {
      expect(view.submit).toBeDefined();
    });

    var server;
    beforeEach(function () {
      server = sinon.fakeServer.create();
    });

    afterEach(function() {
      server.restore();
    });

    it('should prevent default action', function() {
      var event = { preventDefault: function() {} };
      var mock = sinon.mock(event).expects('preventDefault').once();
      view.submit(event);
      mock.verify();
    });

    describe('sent request', function () {
      it('should send valid attributes to the server', function () {
        $fixture.find('input').val('New task name');
        view.submit();

        var request = server.requests[0];
        expect(request).toHaveMethod('POST');
        expect(request).toHaveUrl('/tasks.json');

        var attributes = JSON.parse(request.requestBody);
        expect(attributes.task).toBeDefined();
        expect(attributes.task.name).toBeDefined();
        expect(attributes.task.name).toEqual('New task name');
      });
    });

    describe('on success', function () {
      beforeEach(function () {
        var fixtures = {};
        server.respondWith('POST', '/tasks.json',
            [
              200,
              { "Content-Type": "application/json" },
              JSON.stringify(fixtures)
            ]
        );
      });

      it('should clear the form input', function () {
        var $nameInput = $fixture.find('input');
        $nameInput.val('New task name');

        view.submit();
        expect($nameInput).toHaveValue('New task name');

        server.respond();
        expect($nameInput).toHaveValue('');
      });
    });

    describe('on error', function () {
      beforeEach(function () {
        server.respondWith('POST', '/tasks.json',
            [
              422,
              { "Content-Type": "application/json" },
              JSON.stringify({ errors: { name: "can't be blank" } })
            ]
        );
      });

      it('should display validation messages', function () {
        var $nameInput = $fixture.find('input');
        $nameInput.val('');

        var mock = sinon.mock(window).expects('alert').withArgs("Task name can't be blank");

        view.submit();
        server.respond();

        mock.verify();
      });
    });
  });

});
{% endhighlight %}

Form fixture:

{% highlight html %}
<div id="form-fixture">
  <form action="">
    <input name="task[name]" val="Task name" />
    <button class="submit">Add</button>
  </form>
</div>
{% endhighlight %}

{% highlight javascript %}
TodoList.Views.Form = Backbone.View.extend({

  events: {
    'click button.submit': 'submit'
  },

  initialize: function() {
    this.collection.on('add', this.resetForm, this);
  },

  submit: function(event) {
    if (event) event.preventDefault();

    var attributes = this.getAttributes();
    var task = new TodoList.Models.Task(attributes);
    task.on('error', this.handleErrors, this);

    this.collection.create(task, { wait: true });
  },

  resetForm: function() {
    this.getInputFor('name').val('');
  },

  handleErrors: function(task, response) {
    var errors = JSON.parse(response.responseText).errors;
    if (errors.name) {
      alert("Task name " + errors.name);
    }
  },

  getAttributes: function() {
    return {
      name: this.getInputFor('name').val()
    };
  },

  getInputFor: function(name) {
    return this.$("input[name='task[" + name + "]']");
  }
});
{% endhighlight %}
