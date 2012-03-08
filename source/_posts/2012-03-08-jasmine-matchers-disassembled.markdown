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

Go to:
[toBeTruthy()](#toBeTruthy) |
[toBeFalsy()](#toBeFalsy) |
[toBeDefined()](#toBeDefined) |
[toBeFalsy()](#toBeFalsy) |
[toBeNull()](#toBeNull) |
[toEqual()](#toEqual) |
[toContain()](#toContain)

<a name="toBeTruthy"></a>
## toBeTruthy

Matcher that boolean not-nots the actual. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L156 %}
jasmine.Matchers.prototype.toBeTruthy = function() {
  return !!this.actual;
};
{% endcodeblock %}

{% jsfiddle ScTrG js,result presentation 680px %}

<a name="toBeFalsy"></a>
## toBeFalsy

Matcher that boolean nots the actual. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L164 %}
jasmine.Matchers.prototype.toBeFalsy = function() {
  return !this.actual;
};
{% endcodeblock %}

{% jsfiddle f99mv js,result presentation 200px %}

<a name="toBeDefined"></a>
## toBeDefined

Matcher that compares the actual to jasmine.undefined. [Home](#home)

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L135 %}
jasmine.Matchers.prototype.toBeDefined = function() {
  return (this.actual !== jasmine.undefined);
};
{% endcodeblock %}

{% jsfiddle ZG6uH js,result presentation 380px %}

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

{% jsfiddle kvbsv js,result presentation 360px %}

<a name="toEqual"></a>
## toEqual

Compares the actual to the expected using common sense equality. Handles Objects, Arrays, etc. [Home](#home)

{% jsfiddle 7q9N7 js,result presentation 660px %}

<a name="toContain"></a>
## toContain

Matcher that checks that the expected item is an element in the actual Array. [Home](#home)

{% jsfiddle 5Xtv8 js,result presentation 290px %}
