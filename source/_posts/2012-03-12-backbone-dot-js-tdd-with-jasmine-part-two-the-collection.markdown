---
layout: post
title: "Backbone.js TDD with jasmine part two: The collection"
date: 2012-03-12 10:22
comments: true
categories:
  - javascript
  - backbone.js
  - sinon.js
  - testing
  - jasmine
  - KRUG
---

In the previous part [Backbone.js TDD with jasmine part one: The model]({{ site.url}}/blog/backbone-dot-js-tdd-with-jasmine-part-two-the-collection) we created a simple `TodoList.Models.Task` model for handling creating and updating a task.
Code from the previous step can be downloaded from github repository: [004-complete-task-model@tdd-with-backbonejs](https://github.com/lucassus/tdd-with-backbonejs/tree/004-complete-task-model)

Now it's time to create a `TodoList.Collections.Tasks` collection. Generally in backbone.js collections are ordered sets of models. In our application we will use this collection for fetching tasks from the serer (`fetch` method) and for creating new task (`create` method).

Firstly, let’s test that we can add instantiate to the collection.

{% codeblock spec/javascripts/collections/tasks.js lang:javascript %}
describe('TodoList.Collections.Tasks', function() {
  it('should be defined', function() {
    expect(TodoList.Collections.Tasks).toBeDefined();
  });

  it('can be instantiated', function() {
    var tasks = new TodoList.Collections.Tasks();
    expect(tasks).not.toBeNull();
  });
});
{% endcodeblock %}

Obviously we need a `Tasks` collection, so let's add it:

{% codeblock app/assets/javascripts/collections/tasks.js lang:javascript %}
TodoList.Collections.Tasks = Backbone.Collection.extend({});
{% endcodeblock %}

TIP: Don't forget to add `TodoList.Collections` namespace and require all files from `app/assets/javascripts/collections` directory:

{% codeblock spec/javascripts/todo_list.js lang:javascript %}
//= require_self
//= require_tree ./models
//= require_tree ./collections

window.TodoList = {
  Models: {},
  Collections: {}
};
{% endcodeblock %}

We will use our new `TodoList.Collections.Tasks` for fetching tasks from the server side. Let's write a simple scenario for the `fetch` method.
Firstly let's write a test which will check that the request to the server is correct:

{% codeblock spec/javascripts/collections/tasks.js lang:javascript %}
describe('TodoList.Collections.Tasks', function() {
  // ...

  beforeEach(function () {
    this.tasks = new TodoList.Collections.Tasks();
  });

  describe('#fetch', function() {
    beforeEach(function () {
      this.server = sinon.fakeServer.create();
    });

    afterEach(function() {
      this.server.restore();
    });

    describe('request', function() {
      beforeEach(function () {
        this.tasks.fetch();
        this.request = this.server.requests[0];
      });

      itShouldBeGET();
      itShouldBeAsync();
      itShouldHaveUrl('/tasks.json');
    });
  });
});
{% endcodeblock %}

And run the test..

{% codeblock %}
TodoList.Collections.Tasks
  #fetch
    request
      ✘ should be POST
        ➤ Error: A "url" property or function must be specified
        ➤ TypeError: 'undefined' is not an object
      ✘ should be async
        ➤ Error: A "url" property or function must be specified
        ➤ TypeError: 'undefined' is not an object
      ✘ should have url /tasks.json
        ➤ Error: A "url" property or function must be specified
        ➤ TypeError: 'undefined' is not an object
ERROR: 23 specs, 6 failures
{% endcodeblock %}

It seems we need a `url` property defined in our collection. This is easy to fix, we just add a url property to our Todos collection:

{% codeblock app/assets/javascripts/collections/tasks.js lang:javascript %}
TodoList.Collections.Tasks = Backbone.Collection.extend({
    url '/tasks.json'
});
{% endcodeblock %}

Green!

In the next step we will check that when the server responds, the collection creates models representing the JSON returned. For this we’ll need to have our fake server respond with some JSON data. We expand our `beforeEach` function to include this:

{% codeblock lang:javascript %}
this.server.respondWith('GET', '/tasks.json', [
    200,
    { "Content-Type": "application/json" },
    JSON.stringify(responseFixture)
]);
{% endcodeblock %}

As you see in this example we're stubbing server's response with sinon's `respondWith` helper method. The fake server’s `respondWith` method takes three arguments here. The first and second are the HTTP request method and URL to respond to. The final argument is an array representing the response that is returned, which itself has three values: the HTTP response code, an object literal of response headers, and a string containing the response body.
Variable `responseFixture` will contain an object with our dummy data and we're using `JSON.stringify` to convert this object to the JSON string (returned by the fake server).

The complete spec should look like this:

{% codeblock app/assets/javascripts/collections/tasks.js lang:javascript %}
describe('TodoList.Collections.Tasks', function() {
    // ...

    describe('#fetch', function() {
        // ...

        describe('on success', function() {
            var responseFixture = { tasks: [
                { id: 11, name: 'First task', complete: false },
                { id: 12, name: 'Second task', complete: true }
            ] };

            beforeEach(function () {
                this.server.respondWith('GET', '/tasks.json', [
                    200,
                    { "Content-Type": "application/json" },
                    JSON.stringify(responseFixture)
                ]);

                this.tasks.fetch();
                this.server.respond();
            });

            describe('loaded tasks collection', function() {
                it('loads all tasks', function() {
                    expect(this.tasks.models.length).toEqual(2);
                });

                it('parses tasks from the response', function() {
                    expect(this.tasks.get(11).getName()).toEqual('First task');
                    expect(this.tasks.get(11).getComplete()).toEqual(false);

                    expect(this.tasks.get(12).getName()).toEqual('Second task');
                    expect(this.tasks.get(12).getComplete()).toEqual(true);
                });
            });
        });
    });
});
{% endcodeblock %}

TIP: Don't forget about `this.server.respond()` method call, otherwise the collection won't receive fixture data from the server.

{% codeblock %}
TodoList.Collections.Tasks
  #fetch
    on success
      loaded tasks collection
        ✘ loads all tasks
          ➤ Expected 1 to equal 2.
        ✘ parses tasks from the response
          ➤ TypeError: 'undefined' is not an object
{% endcodeblock %}

We have to override `TodoList.Collections.Tasks#parse` method:

{% codeblock app/assets/javascripts/collections/tasks.js lang:javascript %}
TodoList.Collections.Tasks = Backbone.Collection.extend({
    url '/tasks.json',

    parse: function(response) {
        return response.tasks;
    }
});
{% endcodeblock %}

..and later we should define valid `model` property on the Collection:

{% codeblock app/assets/javascripts/collections/tasks.js lang:javascript %}
TodoList.Collections.Tasks = Backbone.Collection.extend({
    url '/tasks.json',
    model: TodoList.Models.Task,

    parse: function(response) {
        return response.tasks;
    }
});
{% endcodeblock %}

Should be green again!

Now we have all the functionality to manage tasks from JavaScript. Let's create a new task using our collection.

{% blockquote http://documentcloud.github.com/backbone/#Collection-create %}
collection.create(task)

Convenience to create a new instance of a model within a collection. Equivalent to instantiating a model with a hash of attributes, saving the model to the server, and adding the model to the set after being successfully created.
{% endblockquote %}

{% codeblock lang:javascript %}
var task = new TodoList.Models.Task({ name: 'New task to do' });

var collection = new TodoList.Collections.Tasks();
collection.create(task); // POST /tasks.json

collection.fetch();
var task = collection.models[0];

task.set('name, 'New name');
task.save(); // PUT /task/1.json

task.destroy(); // DELETE /task/1.json

var task = new TodoList.Models.Task({ id: 1 });
task.fetch(); // GET /tasks/1.json
// etc.
{% endcodeblock %}
