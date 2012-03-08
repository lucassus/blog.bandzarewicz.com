---
layout: post
title: Testing named scopes in Ruby on Rails 3.x
---

## The code

{% codeblock lang:ruby %}
class Topic < ActiveRecord::Base
  STATUS_PENDING = 'pending'
  STATUS_ACCEPTED = 'accepted'
  STATUS_DONE = 'done'
  STATUSES = [STATUS_PENDING, STATUS_ACCEPTED, STATUS_DONE].freeze

  ## Scopes
  default_scope :order => 'created_at DESC'
  # statuses
  scope :pending, where(:status => STATUS_PENDING)
  scope :accepted, where(:status => STATUS_ACCEPTED)
  scope :done, where(:status => STATUS_DONE)
end
{% endcodeblock %}

{% codeblock lang:ruby %}
describe Topic do

  describe "scopes" do
    describe :default do
      specify { Cse::Topic.scoped.arel.orders.should == ['created_at DESC'] }
    end

    describe "statuses" do
      Cse::Topic::STATUSES.each do |status|
        describe status do
          specify { Cse::Topic.send(status).where_values_hash.should == { :status => status } }
        end
      end
    end
  end

end
{% endcodeblock %}
