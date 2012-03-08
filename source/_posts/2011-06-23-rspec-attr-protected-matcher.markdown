---
layout: post
title: Rspec matcher for testing model's attr_protected fields
---

## Custom matcher DSL

{% highlight ruby %}
RSpec::Matchers.define :have_something do |something|
  match do |actual|
    # let assume that object under the test has #has_something? method
    actual.has_something?(something)
  end

  failure_message_for_should do |actual|
    # generate and return the appropriate string.
  end

  failure_message_for_should_not do |actual|
    # generate and return the appropriate string.
  end

  description do
    # generate and return the appropriate string.
  end
end

describe Something do
  subject { Something.new }
  it { should have_something('a thing') }
end
{% endhighlight %}

## Custom matcher for testing attr_protected

{% highlight ruby %}
RSpec::Matchers.define :protect_attribute do |attribute, value = nil|
  match do |record|
    old_value = record[attribute]
    record.update_attributes(attribute.to_sym => value)
    record[attribute] == old_value
  end

  failure_message do
    "#{subject.class} should protect attribute #{attribute.inspect}"
  end
end
{% endhighlight %}

{% highlight ruby %}
class Topic < ActiveRecord::Base
  attr_accessible :title, :message
end

describe Topic do
  it { should have_db_column(:title) }
  it { should have_db_column(:message) }
  it { should have_db_column(:status) }

  it { should protect_attribute(:status) }
end
{% endhighlight %}

