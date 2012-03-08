---
layout: post
title: "Backbone.js TDD with jasmine part one: The model"
date: 2012-03-08 19:40
comments: true
categories: 
---

## Initial rails applications

The initial rails application can be downloaded from github repo: [000-basic-app@tdd-with-backbonejs](https://github.com/lucassus/tdd-with-backbonejs/tree/000-basic-app)

Basic application provides Task model (name: string, complete: boolean) and corresponding controller with RESTFUL json interface:

* GET `/tasks.json`
* POST `/tasks.json`
* PUT `/tasks/:id.json`

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

Just type in the console `guard --group frontend` wait for boot and after several seconds you should see the following output:

{% codeblock %}
$ guard --group frontend
Guard is now watching at '/home/lucassus/Projects/tdd-with-backbonejs'
Guard::Jasmine starts webrick test server on port 8888 in development environment.
Jasmine test runner is available at http://localhost:8888/jasmine
Run all Jasmine suites
Run Jasmine suite at http://localhost:8888/jasmine

0 specs, 0 failures
in 0.002 seconds
{% endcodeblock %}

TIP: phantomjs in already included in `./spec/javascipt/support/phantomjs` but you may have to compile it on your machine

TIP2: you can also see more detailed tests output in the browser, just navigate to `http://localhost:8888/jasmine`

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
* required javascript files and dependencies are not loaded via assets pipeline

{% codeblock result %}
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
Second section loads our application's javascripts.

Add following content to the `./spec/javascripts/spec.js` file:

{% codeblock spec/javascripts/spec.js lang:javascript %}
//= require todo_list
//= require_tree .
{% endcodeblock %}

Those directives will load our application along with all test and helper files defined in the `./spec/javascripts` folder.

And finally define initial `TodoList.Models.Task` class:

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({});
{% endcodeblock %}

It's green!

{% codeblock %}
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
        it('has default value for name', function() {
            expect(this.task.get('name')).toEqual('');
        });

        it('has default value for complete flag', function() {
            expect(this.task.get('complete')).toBeFalsy();
        });
    });
});
{% endcodeblock %}

{% codeblock %}
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

{% codeblock %}
TodoList.Models.Task
  new instance default values
    ✔ should be defined
    ✔ can be instantiated
    ✔ has default value for name
    ✔ has default value for complete flag
4 specs, 0 failures
{% endcodeblock %}

It seems that we don't have to define default value for the `complete` flag. It's false by default.

## Step three: define getters

Generally in backbone.js we're using `model.get(attribute)` method for instance `model.get('name')` or `model.get('complete')` but in my opinion this approach is prone to typos and other strange errors. To avoid this kind of problems in my backbone models I'm creating getters for all model's attributes, for instance the `name` attribute will have `model.getName()` method.

Lets create a simple test case for those methods.
First create a `model.getId()` method:

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

{% codeblock %}
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

Let add implementation for the missing method

{% codeblock app/assets/javascripts/models/task.js lang:javascript %}
TodoList.Models.Task = Backbone.Model.extend({
  // .. defaults: { }

  getId: function() {
    return this.id;
  }
});
{% endcodeblock %}

..and it should be green again!

{% codeblock %}
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

TIP: don't forget to require sinon.js in our spec helper, just add `//= require sinon` to the `./spec/javascript/spec.js` file.

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
            it('should be defined', function() {
                expect(this.task.getComplete).toBeDefined();
            });

            it('returns value the complete attribute', function() {
                var stub = sinon.stub(this.task, 'get').returns(false);

                expect(this.task.getComplete()).toBeFalsy();
                expect(stub.calledWith('complete')).toBeTruthy();
            });
        });
    });
});
{% endcodeblock %}

Obviously it will fail:

{% codeblock %}
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

Green again!

## Try it in jsfiddle

{% jsfiddle tug6H js,result presentation 600px %}
