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

Go to: [toBeTruthy](#toBeTruthy) | [toBeFalsy](#toBeFalsy) | [toBeDefined](#toBeDefined)

<a name="toBeTruthy"></a>
## toBeTruthy

Matcher that boolean not-nots the actual.

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L156 %}
jasmine.Matchers.prototype.toBeTruthy = function() {
  return !!this.actual;
};
{% endcodeblock %}

{% jsfiddle ScTrG js,result presentation 680px %}

<a name="toBeFalsy"></a>
## toBeFalsy

Matcher that boolean nots the actual.

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L164 %}
jasmine.Matchers.prototype.toBeFalsy = function() {
  return !this.actual;
};
{% endcodeblock %}

{% jsfiddle f99mv js,result presentation 200px %}

<a name="toBeDefined"></a>
## toBeDefined

Matcher that compares the actual to jasmine.undefined.

{% codeblock source lang:javascript https://github.com/pivotal/jasmine/blob/c2160477114d7a5b28c36c6c03c8f6c13f8634b4/src/core/Matchers.js#L135 %}
jasmine.Matchers.prototype.toBeDefined = function() {
  return (this.actual !== jasmine.undefined);
};
{% endcodeblock %}

{% jsfiddle ZG6uH js,result presentation 380px %}
