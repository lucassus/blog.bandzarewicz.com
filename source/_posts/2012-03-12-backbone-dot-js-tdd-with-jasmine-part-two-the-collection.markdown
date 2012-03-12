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
Code from the previous step can be downloaded from [004-complete-task-model@tdd-with-backbonejs](https://github.com/lucassus/tdd-with-backbonejs/tree/004-complete-task-model)

We will use our new `TodoList.Collections.Tasks` for fetching tasks from the server side. Let's write a simple test for this this scenario:
