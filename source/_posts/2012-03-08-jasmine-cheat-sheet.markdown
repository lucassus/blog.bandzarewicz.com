---
layout: post
title: "Jasmine cheat sheet"
date: 2012-03-08 12:35
comments: true
sharing: true
categories:
  - javascript
  - testing
  - jasmine
---

BDD for JavaScript

{% blockquote %}
Jasmine is a behavior-driven development framework for testing your JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests.
{% endblockquote %}

<!-- more -->

Go to: [Builtin matchers](#builtin-matchers) | [Creating custom matchers](#custom-matchers)

<a name="builtin-matchers"></a>
## Builtin matchers

{% codeblock lang:javascript %}
toBeTruthy(); toBeFalsy(); toBeDefined(); toBeNull();
toEqual(); toBeCloseTo(); toContain(); toMatch();
toBeGreaterThan(); toBeLessThan();
toThrow();
{% endcodeblock %}

{% include_code javascripts/jasmine/cheat-sheet/matchers.js %}

### Try is in jsfiddle

{% jsfiddle 4DrrW js,result %}

<a name="custom-matchers"></a>
## Creating custom matchers

Custom matchers help to document the intent of your specs, and can help to remove code duplication in your specs.

It's extremely easy to create new matchers for your app. A matcher function receives the actual value as this.actual, and zero or more arguments may be passed in the function call. The function should return true if the actual value passes the matcher's requirements, and false if it does not.

{% include_code javascripts/jasmine/cheat-sheet/custom-matchers.js %}

{% include_code javascripts/jasmine/cheat-sheet/custom-matchers-usage.js %}

### Try is in jsfiddle

{% jsfiddle epEyn js,result %}
