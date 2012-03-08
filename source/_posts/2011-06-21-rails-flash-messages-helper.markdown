---
layout: post
title: Rails flash messages helper
categories:
  - rails
  - rspec
---

## The code

{% codeblock lang:ruby %}
module ApplicationHelper

  def flash_messages
    return if flash.empty?

    content_tag(:ul, :id => 'flash-messages') do
      flash.collect do |type, message|
        content_tag(:li, message, :class => "flash-message #{type}")
      end.join("\n").html_safe
    end
  end

end
{% endcodeblock %}

## The spec

{% codeblock lang:ruby %}
require 'spec_helper'

describe ApplicationHelper do

  describe "#flash_messages" do
    context "when there is no flash messages" do
      it "should return nothing" do
        helper.flash_messages.should be_nil
      end
    end

    context "when there are some flash messages" do
      let(:flashes) do
        { :notice => 'Battlestation operational',
          :error => 'Hudson, we have a problem!',
          :warning => "I'm sorry Dave, I'm afraid I can't do that" }
      end

      before do
        flashes.each { |type, message| flash[type] = message }
      end

      subject { helper.flash_messages }
      it "should render a list with flash messages" do
        should have_selector('ul', :id => 'flash-messages')

        flashes.each do |type, message|
          should have_selector("li", :class => "flash-message #{type}", :content => message)
        end
      end
    end
  end

end
{% endcodeblock %}

## The usage

{% codeblock lang:html %}
<%= flash_messages %>
{% endcodeblock %}

## ..and the output

{% codeblock lang:html %}
<ul id="flash-messages">
  <li class="flash-message notice">Vote was added.</li>
</ul>
{% endcodeblock %}
