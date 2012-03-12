---
layout: post
title: "Backbone.js TDD with jasmine part one: The model"
date: 2012-03-08 19:40
comments: true
categories:
  - javascript
  - backbone.js
  - sinon.js
  - testing
  - jasmine
  - KRUG
---

## Initial Ruby on Rails application

The initial rails application can be downloaded from github repo: [000-basic-app@tdd-with-backbonejs](https://github.com/lucassus/tdd-with-backbonejs/tree/000-basic-app)

The basic application provides model `Task(name: string, complete: boolean)` and corresponding controller with RESTFUL json interface:

* GET `/tasks.json`
* POST `/tasks.json`
* PUT `/tasks/:id.json`

Don't forget about `rake db:create:all` and `rake db:migrate`.<br/>
You could seed the database with initial tasks: `rake db:seed`.

Now you can run rails: `rails s` and navigate to `http://localhost:3000`.. and you should see nothing special, just an another todo list app without any fancy features and JavaScripts.

### Gems used in the project

* [twitter-bootstrap-rails](https://github.com/seyhunak/twitter-bootstrap-rails) - for nice basic layout
* [jquery-rails](https://github.com/rails/jquery-rails) - a gem to automate using jQuery with Rails 3
* [underscore-rails](https://github.com/rweng/underscore-rails) - underscore.js asset-pipeline provider/wrapper
* [backbone-on-rails](https://github.com/meleyal/backbone-on-rails) - A simple gem for using Backbone.js with Rails (>= 3.1), based on thoughtbot's 'Backbone.js on Rails'

Gems included in development and test environments:

* [jasmine](https://github.com/pivotal/jasmine-gem) - Jasmine ruby gem
* [jasminerice](https://github.com/bradphelan/jasminerice) - Pain free coffeescript testing under Rails 3.1
* [guard](https://github.com/guard/guard) - Guard is a command line tool to easily handle events on file system modifications
* [guard-jasmine](https://github.com/netzpirat/guard-jasmine) - Guard::Jasmine automatically tests your Jasmine specs on Rails when files are modified

{% codeblock Gemfile lang:ruby %}
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
{% endcodeblock %}

Also in `./vendor/assets/javascripts` we have:

* [Sinon.js](http://sinonjs.org) - standalone test spies, stubs and mocks for JavaScript. No dependencies, works with any unit testing framework. Also it has very nice api for stubbing server responses.
* [jasmine-sinon](https://github.com/froots/jasmine-sinon) - A collection of Jasmine matchers for Sinon.JS

### Running the tests

Initial application already contains pre-configured Guardfile for jasmine. It can run JavaScript specs for our application without the browser!

{% codeblock Guardfile lang:ruby %}
group :frontend do
  guard 'jasmine', :phantomjs_bin => './spec/javascripts/support/phantomjs', :specdoc => :always, :console => :always do
    watch(%r{app/assets/javascripts/.+(js\.coffee|js)}) { "spec/javascripts" }
    watch(%r{spec/javascripts/.+(js\.coffee|js)}) { "spec/javascripts" }
  end
end
{% endcodeblock %}

In order to execute our JavaScript tests just type in the console `guard --group frontend` wait for rails to boot and after several seconds you should see the following output:

{% codeblock tests results %}
$ guard --group frontend
Guard is now watching at '/home/lucassus/Projects/tdd-with-backbonejs'
Guard::Jasmine starts webrick test server on port 8888 in development environment.
Jasmine test runner is available at http://localhost:8888/jasmine
Run all Jasmine suites
Run Jasmine suite at http://localhost:8888/jasmine

0 specs, 0 failures
in 0.002 seconds
{% endcodeblock %}

TIP 1: phantomjs in already included in `./spec/javascipt/support/phantomjs` but you may have to compile it on your machine.

TIP 2: you can also see more detailed tests output in the browser, just navigate to `http://localhost:8888/jasmine`.

## Step one: class TodoList.Models.Tasks should be defined and it can be instantiated

Create file `./spec/javascripts/models/task_spec.js` with the following content:

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    it('should be defined', function() {
        expect(TodoList.Models.Task).toBeDefined();
    });

    it('can be instantiated', function() {
        var task = new TodoList.Models.Task();
        expect(task).not.toBeNull();
    });
});
{% endcodeblock %}

Obviously this test will fail since:

* We don't have `TodoList.Models` namespace
* and Task model is not defined within this namespace
* required JavaScript files and dependencies are not loaded via assets pipeline

{% codeblock tests results %}
TodoList.Models.Task
  ✘ should be defined
    ➤ ReferenceError: Can't find variable: TodoList in models/task._spec.js on line 3
  ✘ can be instantiated
    ➤ ReferenceError: Can't find variable: TodoList in models/task._spec.js on line 7
ERROR: 2 specs, 2 failures
{% endcodeblock %}

Create `./app/assets/javascripts/todo_list.js` file with the following content. It will be the entry point for our application.

{% codeblock app/assets/javascripts/todo_list.js lang:javascript %}
//= require jquery
//= require jquery_ujs
//= require underscore
//= require backbone

//= require_self
//= require_tree ./models

window.TodoList = {
  Models: {}
};
{% endcodeblock %}

In the first require section we require all necessary javascipt libraries: jQuery, underscore and finnaly Backbone.js
Second section loads our application's JavaScripts.

Add following content to the `./spec/javascripts/spec.js` file:

{% codeblock spec/javascripts/spec.js lang:javascript %}
//= require todo_list
//= require_tree .
{% endcodeblock %}

These directives will load our application along with all test and helper files defined in the `./spec/javascripts` folder.

And finally define initial `TodoList.Models.Task` class:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({});
{% endcodeblock %}

It's green!

{% codeblock tests results %}
TodoList.Models.Task
  ✔ should be defined
  ✔ can be instantiated
2 specs, 0 failures
in 0.031 seconds
{% endcodeblock %}

## Step two: the new instance should have default values for name and complete flag

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ...

    beforeEach(function() {
        this.task = new TodoList.Models.Task();
    });

    describe('new instance default values', function() {
        it('has default value for the .name attribute', function() {
            expect(this.task.get('name')).toEqual('');
        });

        it('has default value for the .complete attribute', function() {
            expect(this.task.get('complete')).toBeFalsy();
        });
    });
});
{% endcodeblock %}

{% codeblock tests results %}
TodoList.Models.Task
  new instance default values
    ✘ has default value for name
      ➤ Expected undefined to equal ''.
ERROR: 4 specs, 1 failure
{% endcodeblock %}

Define default values for the model:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
    defaults: {
        name: ''
    }
});
{% endcodeblock %}

{% codeblock tests results %}
TodoList.Models.Task
  new instance default values
    ✔ should be defined
    ✔ can be instantiated
    ✔ has default value for the .name attribute
    ✔ has default value for the .complete attribute
4 specs, 0 failures
{% endcodeblock %}

It seems that we don't have to define default value for the `complete` flag. It's false by default.

## Step three: define getters

Generally backbone.js for fetching attributes values has a build-in `model.get(attribute)` method, for instance `model.get('name')` or `model.get('complete')` but in my opinion this approach is prone to typos and other strange errors. To avoid this kind of problems in my backbone models I'm creating getters for all model's attributes, for example the `name` attribute will have `model.getName()` method.

Lets create a simple test case for those methods.
First of all create a `model.getId()` method:

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ..

    describe('getters', function() {
        describe('#getId', function() {
            it('should be defined', function() {
                expect(this.task.getId).toBeDefined();
            });

            it('returns undefined if id is not defined', function() {
                expect(this.task.getId()).toBeUndefined();
            });

            it("otherwise returns model's id", function() {
                this.task.id = 66;
                expect(this.task.getId()).toEqual(66);
            });
        });
    });
});
{% endcodeblock %}

Test will fail with the following messages:

{% codeblock tests results %}
TodoList.Models.Task
  getters
    #getId
      ✘ should be defined
        ➤ Expected undefined to be defined.
      ✘ returns undefined if id is not defined
        ➤ TypeError: Result of expression 'this.task.getId' [undefined] is not a function. in models/task._spec.js on line 32
      ✘ otherwise returns model's id
        ➤ TypeError: Result of expression 'this.task.getId' [undefined] is not a function. in models/task._spec.js on line 37
ERROR: 7 specs, 3 failures
{% endcodeblock %}

Let's add implementation for the missing method

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // .. defaults: { }

  getId: function() {
    return this.id;
  }
});
{% endcodeblock %}

..and it should be green again!

{% codeblock tests results %}
TodoList.Models.Task
  new instance default values
    ✔ should be defined
    ✔ can be instantiated
    ✔ has default value for name
    ✔ has default value for complete flag
  getters
    #getId
      ✔ should be defined
      ✔ returns undefined if id is not defined
      ✔ otherwise returns model's id
7 specs, 0 failures
{% endcodeblock %}

Write some specs for `model.getName()` and `model.getComplete()` methods. In the following example I'm going to use sinon's test stubs. In this case backbone's `get(attribute)` method is stubbed and in the test I'm asserting that this method was called with valid attribute name.

TIP 1: don't forget to require sinon.js in our spec helper, just add `//= require sinon` to the `./spec/javascript/spec.js` file.

TIP 2: sinon should be required before our JavaScripts specs.

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ..

    describe('getters', function() {
        // .. describe('#getId', function() {});

        describe('#getName', function() {
            it('should be defined', function() {
                expect(this.task.getName).toBeDefined();
            });

            it('returns value for the name attribute', function() {
                var stub = sinon.stub(this.task, 'get').returns('Task name');

                expect(this.task.getName()).toEqual('Task name');
                expect(stub.calledWith('name')).toBeTruthy();
            });
        });

        describe('#getComplete', function() {
            // TODO try do it by yourself
        });
    });
});
{% endcodeblock %}

Obviously it will fail:

{% codeblock tests results %}
TodoList.Models.Task
  getters
    #getName
      ✘ should be defined
        ➤ Expected undefined to be defined.
      ✘ returns value for the name attribute
        ➤ TypeError: Result of expression 'this.task.getName' [undefined] is not a function. in models/task._spec.js on line 49
    #getComplete
      ✘ should be defined
        ➤ Expected undefined to be defined.
      ✘ returns value for the complete attribute
        ➤ TypeError: Result of expression 'this.task.getComplete' [undefined] is not a function. in models/task._spec.js on line 62
ERROR: 11 specs, 4 failures
{% endcodeblock %}

The missing implementation would be very trivial:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // ..

  getId: function() {
    return this.id;
  },

  getName: function() {
    return this.get('name');
  },

  getComplete: function() {
    return this.get('complete');
  }
});
{% endcodeblock %}

Green again! Not it's time for something less trivial.

## Step four: creating and updating our model via ajax

For creating a new tasks and updating its `complete` flag we'll use built-in in backbone `save` method. Let's see whether this method meets all our requirements:

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ..

    describe('#save', function() {
        beforeEach(function() {
            this.server = sinon.fakeServer.create();
        });

        afterEach(function() {
            this.server.restore();
        });

        it('sends valid data to the server', function() {
            this.task.save({name: 'A new task to do'});
            var request = this.server.requests[0];
            var params = JSON.parse(request.requestBody);

            expect(params.task).toBeDefined();
            expect(params.task.name).toEqual('A new task to do');
            expect(params.task.complete).toBeFalsy();
        });
    });
});
{% endcodeblock %}

{% codeblock tests results %}
TodoList.Models.Task
  #save
    ✘ sends valid data to the server
      ➤ Error: A "url" property or function must be specified in backbone.js on line 1287
ERROR: 12 specs, 1 failure
{% endcodeblock %}

It seems that our model hasn't required `url` property. Basically `url` can be a property or a function and it returns the relative URL where the model's resource would be located on the server.
Let's add this property with some arbitrary value:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // ..

  url: '/something'

  // ..
});
{% endcodeblock %}

Now we have:

{% codeblock tests results %}
TodoList.Models.Task
  #save
    ✘ sends valid data to the server
      ➤ Expected undefined to be defined.
      ➤ TypeError: Result of expression 'params.task' [undefined] is not an object. in models/task._spec.js on line 84
ERROR: 12 specs, 2 failures
{% endcodeblock %}

It seems that our tasks attributes are not wrapped within `task` property. In order to fix it we should override model's `toJSON` method.
In the backbone docs for this method we find the following description:

{% blockquote %}
 Return a copy of the model's attributes for JSON stringification. This can be used for persistence, serialization, or for augmentation before being handed off to a view.
{% endblockquote %}

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // ..

  url: '/something',

  toJSON: function() {
    return { task: this.attributes };
  }

  // ..
});
{% endcodeblock %}

Green again but `url` attribute definitely is not what we want. For creating task it should be `/tasks.json` (along with `POST` request method) and for updating existing task's attributes it should be `/tasks/:id.json` (along with `PUT` request method). Let write some specs for those scenarios:

Let's override this method:

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ..

    describe('#save', function() {
        // .. fakeServer

        // .. it('sends valid data to the server', function() { });

        describe('request', function() {

            describe('on create', function() {
                beforeEach(function() {
                    this.task.id = null;
                    this.task.save();
                    this.request = this.server.requests[0];
                });

                it('should be POST', function() {
                    expect(this.request.method).toEqual('POST');
                });

                it('should be async', function() {
                    expect(this.request.async).toBeTruthy();
                });

                it('should have valid url', function() {
                    expect(this.request.url).toEqual('/tasks.json');
                });
            });

            describe('on update', function() {
                beforeEach(function() {
                    this.task.id = 66;
                    this.task.save();
                    this.request = this.server.requests[0];
                });

                it('should be PUT', function() {
                    expect(this.request.method).toEqual('PUT');
                });

                it('should be async', function() {
                    expect(this.request.async).toBeTruthy();
                });

                it('should have valid url', function() {
                    expect(this.request.url).toEqual('/tasks/66.json');
                });
            });
        });
    });
});
{% endcodeblock %}

It will fail since the `url` is not set correctly.

{% codeblock tests results %}
TodoList.Models.Task
  #save
    request
      on create
        ✘ should have valid url
          ➤ Expected '/something' to equal '/tasks.json'.
      on update
        ✘ should have valid url
          ➤ Expected '/something' to equal '/tasks/66.json'.
ERROR: 18 specs, 2 failures
{% endcodeblock %}

Try to fix it with the following code snippet:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // ..

  url: function() {
    if (this.isNew()) {
      return '/tasks.json';
    } else {
      return '/tasks/' + this.getId() + '.json';
    }
  }

  // ..
});
{% endcodeblock %}

Green again!

TIP: we could define custom jasmine matchers in order to make the test cases above more DRY.

Create `spec/javascripts/support/request_matchers.js` file with the following content:

{% codeblock spec/javascripts/support/request_matchers.js lang:javascript %}
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
{% endcodeblock %}

And now instead:

{% codeblock lang:javascript %}
it('should be POST', function() {
  expect(this.request.method).toEqual('POST');
});
{% endcodeblock %}

We could write:

{% codeblock lang:javascript %}
it('should be POST', function() {
  expect(this.request).toBePOST();
});
{% endcodeblock %}

TIP: Try to refactor other test scenarios.

We can also do one more step further and create the following macros:

{% codeblock lang:javascript %}
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
{% endcodeblock %}

Now our test case is really DRY!

{% codeblock spec/javascripts/models/task_spec.js lang:javascript %}
describe('TodoList.Models.Task', function() {
    // ..

    describe('#save', function() {
        // .. fakeServer

        // .. it('sends valid data to the server', function() { });

        describe('request', function() {
            beforeEach(function() {
                this.performRequest = function() {
                    this.task.save();
                    return this.server.requests[0];
                };
            });

            describe('on create', function() {
                beforeEach(function() {
                    this.task.id = null;
                    this.request = this.performRequest();
                });

                itShouldBePOST();
                itShouldBeAsync();
                itShouldHaveUrl('/tasks.json');
            });

            describe('on update', function() {
                beforeEach(function() {
                    this.task.id = 66;
                    this.request = this.performRequest();
                });

                itShouldBePUT();
                itShouldBeAsync();
                itShouldHaveUrl('/tasks/66.json');
            });
        });
    });
});
{% endcodeblock %}

Our model is ready! Now you can open firebug or goggle-chrome console and test it:

{% codeblock lang:javascript %}
var task = new TodoList.Models.Task();
task.set('name', 'Something new to do');
task.save();
task.save({ complete: true });
// .. and so on
{% endcodeblock %}

TIP: You could try to write some test scenarios for backbone model's validations.

## Try it in jsfiddle

Feel free to fork it!

{% jsfiddle tug6H js,result presentation 600px %}

Stay tuned, there will be more: "Part two: The collection" and "Part three: The view".. and maybe something about Routers.
