---
layout: post
title: "Jasmine matchers disassembled"
date: 2012-03-08 18:07
comments: true
categories:
  - javascript
  - testing
  - jasmine
---

<a name="home"></a>
Disassembled matchers for jasmine 1.1.0

Go to matcher:
[toBeTruthy()](#toBeTruthy) |
[toBeFalsy()](#toBeFalsy) |
[toBeDefined()](#toBeDefined) |
[toBeUndefined()](#toBeUndefined) |
[toBeNull()](#toBeNull) |
[toEqual()](#toEqual) |
[toContain()](#toContain) |
[toBeLessThan(), toBeGreaterThan()](#toBeLessThan) |
[toMatch()](#toMatch) |
[toThrow()](#toThrow)

<a name="toBeTruthy"></a>
## toBeTruthy

Matcher that boolean not-nots the actual. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L156 %}
jasmine.Matchers.prototype.toBeTruthy = function() {
  return !!this.actual;
};
{% endcodeblock %}

{% jsfiddle ScTrG js,result presentation 695px %}

<a name="toBeFalsy"></a>
## toBeFalsy

Matcher that boolean nots the actual. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L164 %}
jasmine.Matchers.prototype.toBeFalsy = function() {
  return !this.actual;
};
{% endcodeblock %}

{% jsfiddle f99mv js,result presentation 315px %}

<a name="toBeDefined"></a>
## toBeDefined

Matcher that compares the actual to jasmine.undefined. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L135 %}
jasmine.Matchers.prototype.toBeDefined = function() {
  return (this.actual !== jasmine.undefined);
};
{% endcodeblock %}

{% jsfiddle ZG6uH js,result presentation 395px %}

<a name="toBeUndefined"></a>
## toBeUndefined

Matcher that compares the actual to jasmine.undefined. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L135 %}
jasmine.Matchers.prototype.toBeUndefined = function() {
  return (this.actual === jasmine.undefined);
};
{% endcodeblock %}

<a name="toBeNull"></a>
## toBeNull

Matcher that compares the actual to null. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L149 %}
jasmine.Matchers.prototype.toBeNull = function() {
  return (this.actual === null);
};
{% endcodeblock %}

{% jsfiddle kvbsv js,result presentation 400px %}

<a name="toEqual"></a>
## toEqual

Compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc. [Home](#home)

{% jsfiddle 7q9N7 js,result presentation 695px %}

<a name="toContain"></a>
## toContain

Matcher that checks that the expected item is an element in the actual Array. [Home](#home)

{% jsfiddle 5Xtv8 js,result presentation 335px %}

<a name="toBeLessThan"></a>
## toBeLessThan, toBeGreaterThan

[Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L286 %}
jasmine.Matchers.prototype.toBeLessThan = function(expected) {
  return this.actual < expected;
};

jasmine.Matchers.prototype.toBeGreaterThan = function(expected) {
  return this.actual > expected;
};
{% endcodeblock %}

{% jsfiddle 5GNac js,result presentation 400px %}

<a name="toMatch"></a>
## toMatch

Matcher that compares the actual to the expected using a regular expression. Constructs a RegExp, so takes a pattern or a String. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L119 %}
jasmine.Matchers.prototype.toMatch = function(expected) {
  return new RegExp(expected).test(this.actual);
};
{% endcodeblock %}

{% jsfiddle Asnt5 js,result presentation 260px %}

<a name="toThrow"></a>
## toThrow

Matcher that checks that the expected exception was thrown by the actual. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L316 %}
jasmine.Matchers.prototype.toThrow = function(expected) {
  var result = false;
  var exception;
  if (typeof this.actual != 'function') {
    throw new Error('Actual is not a function');
  }
  try {
    this.actual();
  } catch (e) {
    exception = e;
  }
  if (exception) {
    result = (expected === jasmine.undefined || this.env.equals_(exception.message || exception, expected.message || expected));
  }

  var not = this.isNot ? "not " : "";

  this.message = function() {
    if (exception && (expected === jasmine.undefined || !this.env.equals_(exception.message || exception, expected.message || expected))) {
      return ["Expected function " + not + "to throw", expected ? expected.message || expected : "an exception", ", but it threw", exception.message || exception].join(' ');
    } else {
      return "Expected function to throw an exception.";
    }
  };

  return result;
};
{% endcodeblock %}

{% jsfiddle FKeNg js,result presentation 360px %}
