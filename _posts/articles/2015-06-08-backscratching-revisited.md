---
date: 2015-06-08 15:00:00 +0100
title: Backscratching Revisited
lede: I revised my original technique for styling default elements and took it a step further to scratch the greatest number of backs.
tags:
  - css
banner:
  - backscratching-revisited.png
banner_mobile:
  - backscratching-revisited_mobile.png
edit: I originally documented this technique in a previous article, <a href="https://chrisburnell.com/article/ill-scratch-your-back">I’ll Scratch Your Back, And Mine Too</a>, but have updated the techniques and explanation here to reflect accessibility needs and to better convey the message; although, I no longer use Microdata, opting for [Microformats](http://microformats.org/){:rel="external"} instead.
comments: disqus
syndicate_to:
  - https://twitter.com/iamchrisburnell/status/607915792911495168
---

In [I’ll Scratch Your Back, And Mine Too](/article/ill-scratch-your-back/), I wrote about a technique I came up with for styling default elements. To recap, this comes with a couple of advantages: managing styles for default elements is a lot easier for development and makes writing content for non-technical users as simple as possible—coupled with a nice <abbr title="What You See Is What You Get">WYSIWYG editor</abbr> or knowledge of Markdown.


--------


I’ve been revising the CSS architecture of my website recently trying to learn and expose myself to various techniques to see what works the best and feels the best for me. Alongside that, I’ve been lightly salting my HTML with little nuggets of [accessibility](http://a11yproject.com/){:rel="external"} in the form of [ARIA](http://html5doctor.com/using-aria-in-html/){:rel="external"} and [Microdata](https://schema.org/docs/documents.html){:rel="external"}.

In doing this research, I learned a lot about the [title attribute on anchors](https://silktide.com/i-thought-title-text-improved-accessibility-i-was-wrong/){:rel="external"} and how to present content properly for impaired users. Specifically, I learned about a technique that has relatively broad use for hiding anchor text that isn’t important to the visual journey but would be for someone with a visual impairment—that is to use a `span` to designate hidden text inside an anchor.

{% highlight html %}
<a href="/article/interesting-article">
    <span>Continue reading </span>Interesting Article by Emily
</a>
{% endhighlight %}

{% highlight css %}
a span {
    width:  1px;
    height: 1px;
    position: absolute;
    overflow: hidden;
    clip: rect(1px, 1px, 1px, 1px);
}
{% endhighlight %}

<aside><p>This technique for hiding text comes from <a rel="external" href="https://snook.ca/archives/html_and_css/hiding-content-for-accessibility">Hiding Content for Accessibility</a>. Credit to <a rel="external" href="https://snook.ca">Jonathan Snook</a>.</p></aside>

The CSS technique above for hiding the `span`, itself, is a piece of code that seems more verbose than necessary. `display: none;` would work just as well to hide the element, but `display: none;` does something we don’t want: it removes the element from the flow of the page, meaning it *won’t* be read by screen readers, text-to-speech software, etc.

However, the code above *does* allow the element’s content to be read aloud, and is treated as any other text by text-to-speech software, despite it being completely visually hidden from the user.


--------


In my actual SCSS, I abstract this snippet out and `@extend` it where I need it, like so:

{% highlight scss %}
@mixin hidden() {
    width:  1px !important;
    height: 1px !important;
    padding: 0 !important;
    border: 0 !important;
    position: absolute !important;
    overflow: hidden !important;
    clip: rect(1px, 1px, 1px, 1px) !important;
}

a {
    span {
        @include hidden;
    }
}
{% endhighlight %}


{% include_cached content/heading.liquid title='One Step Further' %}

We can tighten this up by slowing down a touch. What happens if we *do want* a `span` inside an anchor to be displayed visually?

{% highlight html %}
<a href="/article/interesting-article">
    <span>Continue reading</span>Interesting Article by <span class="author--emily">Emily</span>
</a>
{% endhighlight %}

Looks like we’ve been a bit heavy-handed in hiding *all* `spans` nested inside anchors because we can’t differentiate here between our two `spans`. Let’s revise a bit.

{% highlight scss %}
a {
    span:not([class]) {
        @include hidden;
    }
}
{% endhighlight %}

Since I know that if I have the need for a `span` to change some visual style, I will want to be specific enough to give it a `class`. The above code alteration, as we first discussed in [the previous article](/article/ill-scratch-your-back/), taps into that fact and allows us to take advantage of our rule to always `class`ify any `spans` I want to style for visual reasons, so using `class`-less `spans` will hide our textual accessibility cues.


{% include_cached content/heading.liquid title='A Prickly Pear' %}

But there’s a problem if we want to use [Microdata](https://schema.org/docs/documents.html){:rel="external"}. Let me demonstrate with a modified snippet of HTML from my site.

{% highlight html %}
<aside class="author" itemtype="https://schema.org/Person">
    <div class="author-name">
        by <a href="/about">
               <span>Chris Burnell</span>
           </a>
    </div>
</aside>
{% endhighlight %}

I won’t go into specifics on the attribute types here and what they mean as Microdata (read about that [here](https://schema.org/Person){:rel="external"}), but to sum up: we can use different attributes ([boolean](https://html.spec.whatwg.org/#boolean-attributes){:rel="external"} or [enumerated](https://html.spec.whatwg.org/#keywords-and-enumerated-attributes){:rel="external"}) to give the browser context about our data.

So instead of printing, for example, an author’s name, we’ll wrap it in a `span` and give it an `itemprop` attribute. When the value of the `itemprop` attribute is set to <q>author</q> within the scope of the *Person* schema, we’re essentially tagging the page with an author. There are numerous Schemas and Properties within each Schema to help you provide context to the content of your website.

But let’s focus on the `span` with the `itemprop` attribute. This isn’t text I want to be hidden, so this breaks the rule we established before (all `spans` which are children of an anchor are hidden). But we can solve this with a further modification to our SCSS snippet.

{% highlight scss %}
a {
    span:not([class]):not([itemprop]) {
        @include hidden;
    }
}
{% endhighlight %}

Now we can be sure to only target `spans` without a `class` *or* `itemprop` attribute!


{% include_cached content/heading.liquid title='The Takeaway' %}

You can extrapolate this idea to more than just `spans` for hiding text. The `:not([class])` technique is extremely versatile and will help you in keeping your CSS lean and maintainable.

I have to reiterate that this technique needs to be taken with a grain of salt. **Do not [copy-pasta](https://gifs.chrisburnell.com/copypasta.gif "Copy and Paste"){:rel="external"} this code into your existing codebase without making careful considerations.** Think of it like switching the box model in your CSS—you wouldn’t want to do that without first thinking about how it will affect your current code.
